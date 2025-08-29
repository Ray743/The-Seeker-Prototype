import asyncio
import json
import os
import time
from crawl4ai import (
    JsonCssExtractionStrategy,
    CrawlerRunConfig,
    AsyncWebCrawler,
    CrawlResult,
    BrowserConfig
)


async def scraper():
    """Load jobs from first page."""
    print("\n=== Scrape PNG Workforce ===")

    # Load schema file into dict
    schema_path = os.path.join(os.path.dirname(__file__), "pngworkforce_schema.json")
    with open(schema_path, "r", encoding="utf-8") as f:
        schema_dict = json.load(f)

    jobs = []

    async with AsyncWebCrawler(config=BrowserConfig(headless=False)) as crawler:
        # Load first page
        first_config = CrawlerRunConfig(
            session_id="hn_session",
            extraction_strategy=JsonCssExtractionStrategy(schema_dict),
        )

        first_results: list[CrawlResult] = await crawler.arun(
            url="https://www.pngworkforce.com/",
            config=first_config,
        )

        for res in first_results:
            if res.success:
                data = json.loads(res.extracted_content)
                jobs.extend(data)
                print(f"First page jobs: {len(data)}")
            else:
                print("Failed to extract structured data from first page.")

        print(f"Total after first page: {len(jobs)}")

        # Click "Next" button
        click_next_config = CrawlerRunConfig(
            js_code="""
                setTimeout(() => {
                    const btn = document.querySelector('.fb_next_result_page');
                    if (btn) btn.click();
                }, 500);
            """,
            js_only=True,
            session_id="hn_session",
        )

        await crawler.arun(
            url="https://www.pngworkforce.com/",
            config=click_next_config,
        )

        # Optional: wait a bit to let new content load
        time.sleep(10)

        # Extract jobs from second page
        second_config = CrawlerRunConfig(
            session_id="hn_session",
            extraction_strategy=JsonCssExtractionStrategy(schema_dict),
        )

        second_results: list[CrawlResult] = await crawler.arun(
            url="https://www.pngworkforce.com/",
            config=second_config,
        )

        for res in second_results:
            if res.success:
                data = json.loads(res.extracted_content)
                jobs.extend(data)
                print(f"Second page jobs: {len(data)}")
            else:
                print("Failed to extract structured data from second page.")

        print(f"Total jobs collected: {len(jobs)}")
        
        out_path = os.path.join(os.path.dirname(__file__), "workforce_jobs.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(jobs, f, indent=2)

    print(f"Scraped total {len(jobs)} jobs. Saved to {out_path}")

if __name__ == "__main__":
    asyncio.run(scraper())
