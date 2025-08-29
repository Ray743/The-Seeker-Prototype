import mysql.connector

try:
    db = mysql.connector.connect(
        host="194.233.80.19",
        user="seeker",
        password="s33k3r01",
        database="job_postings"
    )
    print("Connected successfully!")
except mysql.connector.Error as err:
    print(f"Error: {err}")
