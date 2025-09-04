import asyncio
import json
import os
import urllib.parse
from bs4 import BeautifulSoup
from crawl4ai import (
    JsonCssExtractionStrategy,
    CrawlerRunConfig,
    AsyncWebCrawler,
    CrawlResult,
    BrowserConfig
)


async def scraper():
    """
    Scrapes all available job listings using both schemas.
    Chooses the schema that successfully extracts data for the current page layout.
    """
    print("\n=== Scraping PNG Jobseek ===")

    # Load both schema files into dictionaries
    schema_1_path = os.path.join(os.path.dirname(__file__), "jobseek_schema_1.json")
    with open(schema_1_path, "r", encoding="utf-8") as f:
        schema_1_dict = json.load(f)

    schema_2_path = os.path.join(os.path.dirname(__file__), "jobseek_schema_2.json")
    with open(schema_2_path, "r", encoding="utf-8") as f:
        schema_2_dict = json.load(f)

    schemas = [("Schema 1", schema_1_dict), ("Schema 2", schema_2_dict)]

    jobs = []
    base_url = "https://www.pngjobseek.com/search-results-jobs/"
    search_id = None
    page_number = 1

    async with AsyncWebCrawler(config=BrowserConfig(headless=False)) as crawler:
        while True:
            current_url = base_url if page_number == 1 else f"{base_url}?{urllib.parse.urlencode({'searchId': search_id, 'action': 'search', 'page': page_number, 'view': 'list'})}"

            print(f"Scraping Page {page_number}: {current_url}")

            extracted_data = None
            selected_schema_name = None

            # Try both schemas
            for name, schema in schemas:
                current_config = CrawlerRunConfig(
                    session_id="jobseek_session",
                    extraction_strategy=JsonCssExtractionStrategy(schema=schema),
                )

                results: list[CrawlResult] = await crawler.arun(
                    url=current_url,
                    config=current_config,
                )

                for res in results:
                    if res.success:
                        try:
                            data = json.loads(res.extracted_content)
                        except json.JSONDecodeError:
                            continue
                        if data:  # Schema worked
                            extracted_data = data
                            selected_schema_name = name
                            res_html = res.html
                            break
                if extracted_data:
                    break  # Stop trying other schemas once one works

            if not extracted_data:
                print(f"Failed to extract data from {current_url} using both schemas. Ending scraper.")
                break

            print(f"Using {selected_schema_name} for this page.")
            jobs.extend(extracted_data)
            jobs_scraped_on_page = len(extracted_data)
            print(f"Jobs scraped from this page: {jobs_scraped_on_page}")

            # Parse HTML to check for disabled next button
            soup = BeautifulSoup(res_html, 'html.parser')
            disabled_next_button = soup.select_one('span.btn.disabled i.icon-circle-arrow-right')
            if disabled_next_button:
                print("Found disabled 'next page' button. All jobs have been scraped.")
                break

            # Capture searchId on the first page
            if page_number == 1 and not search_id:
                next_button = soup.select_one('a.btn[href*="searchId"]')
                if next_button and 'href' in next_button.attrs:
                    parsed_next_url = urllib.parse.urlparse(next_button['href'])
                    params = urllib.parse.parse_qs(parsed_next_url.query)
                    if 'searchId' in params:
                        search_id = params['searchId'][0]
                        print(f"Initial searchId captured: {search_id}")
                    else:
                        print("No searchId found on initial page. Check website structure.")
                        break

            page_number += 1
            await asyncio.sleep(5)

    # Deduplicate jobs by Job-ID
    unique_jobs = {}
    for job in jobs:
        try:
            job_id = job['title'].split('Job-ID:')[-1]
            unique_jobs[job_id] = job
        except (KeyError, IndexError):
            continue
    jobs = list(unique_jobs.values())

    out_path = os.path.join(os.path.dirname(__file__), "jobseek_jobs.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(jobs, f, indent=2)

    print(f"\n Scraped total {len(jobs)} unique jobs. Saved to {out_path}")


if __name__ == "__main__":
    asyncio.run(scraper())
