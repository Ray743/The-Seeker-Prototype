import json
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")

# Load jobs from JSON file
with open("./pngjobseek/jobseek_jobs.json", "r", encoding="utf-8") as f:
    jobs = json.load(f)

# Connect to MySQL
db = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_name
)
cursor = db.cursor()

# Clear existing data
cursor.execute("DELETE FROM jobs")
db.commit()
print("Old jobs deleted.")

# Prepare bulk insert
insert_values = []
for job in jobs:
    insert_values.append((
        job.get("title", ""),
        job.get("jobLink", ""),
        job.get("datePosted", ""),
        job.get("companyName", ""),
        job.get("category", ""),
        job.get("location", ""),
        job.get("description", "")
    ))

sql = """
    INSERT INTO jobs (title, jobLink, datePosted, companyName, category, location, description)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

# Execute bulk insert
cursor.executemany(sql, insert_values)
db.commit()

print(f"{cursor.rowcount} jobs inserted successfully!")
cursor.close()
db.close()
