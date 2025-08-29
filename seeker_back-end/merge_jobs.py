import json
import os

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # seeker_back-end/
FRONTEND_JOBS_PATH = os.path.join(BASE_DIR, "..", "seeker_front-end", "public", "jobs.json")

# Source JSON files
JOB_FILES = [
    os.path.join(BASE_DIR, "pngjobseek", "jobseek_jobs.json"),
    os.path.join(BASE_DIR, "pngworkboard", "workboard_jobs.json"),
    os.path.join(BASE_DIR, "pngworkforce", "workforce_jobs.json"),
]

# Mapping from JSON filenames to friendly site names
SOURCE_NAME_MAP = {
    "jobseek_jobs.json": "PNG JobSeek",
    "workboard_jobs.json": "PNG JobBoard",
    "workforce_jobs.json": "PNG WorkForce",
}

def merge_jobs():
    merged_jobs = []

    for file_path in JOB_FILES:
        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    # Ensure it’s a list of jobs, not a dict
                    if isinstance(data, list):
                        jobs_to_add = data
                    elif isinstance(data, dict):
                        jobs_to_add = data.get("jobs", [])
                    else:
                        jobs_to_add = []

                    # Add source field to each job (friendly name)
                    filename = os.path.basename(file_path)
                    friendly_name = SOURCE_NAME_MAP.get(filename, filename)

                    for job in jobs_to_add:
                        job["source"] = friendly_name
                        merged_jobs.append(job)

            except Exception as e:
                print(f"Could not read {file_path}: {e}")
        else:
            print(f"File not found: {file_path}")

    # Save merged jobs.json in seeker_front-end/public
    os.makedirs(os.path.dirname(FRONTEND_JOBS_PATH), exist_ok=True)
    with open(FRONTEND_JOBS_PATH, "w", encoding="utf-8") as f:
        json.dump(merged_jobs, f, indent=2, ensure_ascii=False)

    print(f"Merged {len(merged_jobs)} jobs into {FRONTEND_JOBS_PATH}")

if __name__ == "__main__":
    merge_jobs()
