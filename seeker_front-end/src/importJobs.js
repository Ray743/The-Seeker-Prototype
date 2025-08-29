// importJobs.js
import fs from "fs";
import mysql from "mysql2/promise";

const run = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "nativetvdp_seeker",
    password: "jYX5tnuwjZFTg3p778d8",
    database: "nativetvdp_seeker"
  });

const jobs = JSON.parse(fs.readFileSync("../public/jobs.json", "utf-8"));

  for (const job of jobs) {
    await connection.execute(
      "INSERT INTO jobs (title, location, datePosted, jobLink, description) VALUES (?, ?, ?, ?, ?)",
      [job.title, job.location, job.datePosted, job.jobLink, job.description]
    );
  }

  console.log("Jobs imported successfully!");
  await connection.end();
};

run().catch(console.error);
