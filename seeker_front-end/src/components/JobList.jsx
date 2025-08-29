import React from "react";
import JobCard from "./JobCard";

export default function JobList({
  jobs,
  setSelectedJob,
  setLoading,
  getCategoryColor,
  getCategoryIcon,
  searchQuery,
}) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
        <p className="text-gray-500">
          {searchQuery
            ? `No jobs found for "${searchQuery}"`
            : "Try adjusting your search or filter criteria"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {jobs.map((job, index) => (
        <JobCard
          key={index}
          job={job}
          setSelectedJob={setSelectedJob}
          setLoading={setLoading}
          getCategoryColor={getCategoryColor}
          getCategoryIcon={getCategoryIcon}
        />
      ))}
    </div>
  );
}
