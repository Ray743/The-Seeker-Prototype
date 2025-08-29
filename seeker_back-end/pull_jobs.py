from flask import Flask, jsonify
import mysql.connector
import os
import json
from dotenv import load_dotenv

load_dotenv()
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")

# Path to React public folder
PUBLIC_JSON_PATH = "../seeker/public/jobs.json"

app = Flask(__name__)

def get_jobs():
    db = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_name
    )
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT title, jobLink, datePosted, companyName, category, location FROM jobs ORDER BY id DESC")
    jobs = cursor.fetchall()
    cursor.close()
    db.close()
    return jobs

def export_jobs_to_json(jobs):
    """Write jobs to React public folder as jobs.json"""
    with open(PUBLIC_JSON_PATH, "w") as f:
        json.dump(jobs, f, indent=2)
    print(f"{len(jobs)} jobs exported to jobs.json")

@app.route("/api/jobs", methods=["GET"])
def jobs_api():
    jobs = get_jobs()
    # Export jobs to JSON for frontend
    export_jobs_to_json(jobs)
    return jsonify(jobs)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
