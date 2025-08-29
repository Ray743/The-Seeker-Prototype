import asyncio
import json
import os
from crawl4ai import (
    JsonCssExtractionStrategy,
    CrawlerRunConfig,
    AsyncWebCrawler,
    CrawlResult,
    BrowserConfig
)


async def scraper():
    """Scrapes first set of job listings from PNG Workboard."""
    print("\n=== Scraping PNG Workboard ===")

    # Load schema
    schema_path = os.path.join(os.path.dirname(__file__), "pngworkboard_schema.json")
    with open(schema_path, "r", encoding="utf-8") as f:
        schema_dict = json.load(f)

    jobs = []

    async with AsyncWebCrawler(config=BrowserConfig(headless=False)) as crawler:
        page_num = 1
        has_next = True

        while has_next:
            print(f"\n--- Scraping page {page_num} ---")

            #Extract jobs on the current page
            extract_config = CrawlerRunConfig(
                session_id="job_scraper_session",
                extraction_strategy=JsonCssExtractionStrategy(schema_dict),
                wait_for="div.cursor-pointer.transition.rounded-md"  # Wait until job cards appear
            )

            results: list[CrawlResult] = await crawler.arun(
                url="https://www.pngworkboard.com/jobs",
                config=extract_config,
            )

            page_jobs = []
            for res in results:
                if res.success:
                    data = json.loads(res.extracted_content)
                    # relative job links
                    for job in data:
                        if "jobLink" in job and job["jobLink"].startswith("/"):
                            job["jobLink"] = "https://www.pngworkboard.com" + job["jobLink"]
                    page_jobs.extend(data)
                else:
                    print("❌ Failed to extract structured data on this page.")

            if not page_jobs:
                print("⚠️ No jobs found, stopping.")
                break

            jobs.extend(page_jobs)
            print(f"✅ Found {len(page_jobs)} jobs on page {page_num}. Total so far: {len(jobs)}")

            # Check and click "Next" button
            click_next_config = CrawlerRunConfig(
                js_code="""
                    const btn = document.querySelector('button.justify-center:has(svg.lucide-chevron-right)');
                    if (btn && !btn.disabled) {
                        btn.click();
                        window.__hasNext = true;
                    } else {
                        window.__hasNext = false;
                    }
                """,
                js_only=True,
                session_id="job_scraper_session",
            )

            await crawler.arun(
                url="https://www.pngworkboard.com/jobs",
                config=click_next_config,
            )

            # Wait for content to update
            await asyncio.sleep(5)

            # Check if there are more pages
            check_next_config = CrawlerRunConfig(
                js_code="return window.__hasNext === true;",
                js_only=True,
                session_id="job_scraper_session",
            )
            check_results = await crawler.arun(
                url="https://www.pngworkboard.com/jobs",
                config=check_next_config,
            )

            has_next = check_results and check_results[0].extracted_content == "true"
            page_num += 1

    # Save all jobs
    out_path = os.path.join(os.path.dirname(__file__), "workboard_jobs.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(jobs, f, indent=2)

    print(f"\n Scraped total {len(jobs)} jobs. Saved to {out_path}")


if __name__ == "__main__":
    asyncio.run(scraper())
