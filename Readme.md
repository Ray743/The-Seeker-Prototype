# The Seeker App 🟢 http://localhost:5173/The-Seeker-Prototype/

![Seeker Logo](/logo.png)


## Overview

Seeker is a **minimal functional prototype** of a job listing application. This version currently displays **~220 jobs** and is built for demonstration purposes. The app is **not production-ready** and is designed to showcase core functionality and the integration workflow between scrapers, backend, and frontend.  

Future versions will enhance features, improve performance, and implement live data integration.  

---

## Features

- Displays job listings from **three different sources**:
  - PNG JobSeek
  - PNG Workboard
  - PNG Workforce
- Filter jobs by **search query** and **job source**
- Sort jobs by **Newest** or **Oldest**
- Paginate results (6 jobs per page)
- View detailed job information in a modal

---

## Architecture

This prototype demonstrates a **full-stack workflow**:

### Frontend
- Built with **React**
- Displays job data from `public/jobs.json`
- Components:
  - Sidebar with search and job source categories
  - Job listing grid
  - Pagination
  - Job modal
  - Top navigation with sorting

### Backend
- Built in **Python** and housed in a **Python virtual environment**
- **Job merging script**: `merge_jobs.py` consolidates jobs from multiple JSON sources into a single frontend JSON file.
- Scrapers:
  - **Crawl4AI** for crawling pages
  - **BeautifulSoup** for parsing HTML
- Workflow:
  1. Scrapers fetch job data and save to individual JSON files (`jobseek_jobs.json`, `workboard_jobs.json`, `workforce_jobs.json`)
  2. `merge_jobs.py` reads these JSON files, adds a `source` field for each job, and merges them into `public/jobs.json`
  3. React frontend fetches `jobs.json` and renders jobs dynamically

---

## Future Production Plan

The production-ready version will include:

- **Flask backend** for API and live data integration
- Jobs stored in a **SQL database** for dynamic querying and updates
- Improved authentication, error handling, and deployment optimizations
- [Placeholder: Add any other planned production features here]

---

