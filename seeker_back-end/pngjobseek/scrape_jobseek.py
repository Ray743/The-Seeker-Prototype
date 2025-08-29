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
    Scrapes all available job listings using different schemas for different page layouts.
    Stops when the 'next page' button is disabled.
    """
    print("\n=== Scraping PNG Jobseek ===")

    # Load both schema files into dictionaries
    schema_1_path = os.path.join(os.path.dirname(__file__), "jobseek_schema_1.json")
    with open(schema_1_path, "r", encoding="utf-8") as f:
        schema_1_dict = json.load(f)

    schema_2_path = os.path.join(os.path.dirname(__file__), "jobseek_schema_2.json")
    with open(schema_2_path, "r", encoding="utf-8") as f:
        schema_2_dict = json.load(f)

    jobs = []
    base_url = "https://www.pngjobseek.com/search-results-jobs/"
    search_id = None
    page_number = 1

    async with AsyncWebCrawler(config=BrowserConfig(headless=False)) as crawler:
        while True:
            if page_number == 1:
                current_url = base_url
            else:
                if not search_id:
                    print("Error: searchId not found. Cannot continue pagination.")
                    break
                
                query_params = {
                    'searchId': search_id,
                    'action': 'search',
                    'page': page_number,
                    'view': 'list'
                }
                query_string = urllib.parse.urlencode(query_params)
                current_url = f"{base_url}?{query_string}"

            print(f"Scraping Page {page_number}: {current_url}")

            if page_number <= 3:
                selected_schema = schema_1_dict
                print("Using Schema 1 for pages 1-3.")
            else:
                selected_schema = schema_2_dict
                print("Using Schema 2 for pages 4 and above.")

            current_config = CrawlerRunConfig(
                session_id="jobseek_session",
                extraction_strategy=JsonCssExtractionStrategy(schema=selected_schema),
            )

            results: list[CrawlResult] = await crawler.arun(
                url=current_url,
                config=current_config,
            )

            jobs_scraped_on_page = 0
            for res in results:
                if res.success:
                    # Check for the disabled next button to end the loop
                    soup = BeautifulSoup(res.html, 'html.parser')
                    disabled_next_button = soup.select_one('span.btn.disabled i.icon-circle-arrow-right')
                    if disabled_next_button:
                        print("Found disabled 'next page' button. All jobs have been scraped.")
                        # Break out of the for loop to exit the while loop
                        jobs_scraped_on_page = 0  
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
                                jobs_scraped_on_page = 0
                                break
                    
                    try:
                        data = json.loads(res.extracted_content)
                    except json.JSONDecodeError:
                        print(f"Failed to decode JSON from {current_url}. Ending scraper.")
                        jobs_scraped_on_page = 0
                        break

                    if not data:
                        print("No more jobs found on this page. Ending scraper.")
                        jobs_scraped_on_page = 0
                        break

                    jobs.extend(data)
                    jobs_scraped_on_page = len(data)
                    print(f"Jobs scraped from this page: {jobs_scraped_on_page}")
                else:
                    print(f"Failed to extract structured data from {current_url}. Ending scraper.")
                    jobs_scraped_on_page = 0
                    break
            
            # Check the flag set to 0 when the loop should terminate
            if jobs_scraped_on_page == 0:
                print("Ending scraper loop.")
                break

            page_number += 1
            await asyncio.sleep(5)

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