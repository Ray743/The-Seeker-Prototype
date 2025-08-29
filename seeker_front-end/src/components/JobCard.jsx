import React from "react";

export default function JobCard({
  job,
  setSelectedJob,
  setLoading,
  getCategoryColor,
  getCategoryIcon,
}) {
  const color = getCategoryColor(job.category);
  const colorClasses = {
    blue: { bg: "bg-blue-50", text: "text-blue-500", badge: "bg-blue-100 text-blue-700" },
    purple: { bg: "bg-purple-50", text: "text-purple-500", badge: "bg-purple-100 text-purple-700" },
    green: { bg: "bg-green-50", text: "text-green-500", badge: "bg-green-100 text-green-700" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-500", badge: "bg-yellow-100 text-yellow-700" },
    gray: { bg: "bg-gray-50", text: "text-gray-500", badge: "bg-gray-100 text-gray-700" },
  };

  return (
    <div className="job-card bg-white p-6 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className="font-semibold text-lg text-gray-800 mb-1 cursor-pointer hover:text-blue-500"
            onClick={() => {
              setSelectedJob(job.jobLink);
              setLoading(true);
            }}
          >
            {job.title}
          </h3>
          <p className="text-gray-600">{job.companyName}</p>
        </div>
        <div className={`w-12 h-12 ${colorClasses[color].bg} rounded-lg flex items-center justify-center`}>
          <i className={`${getCategoryIcon(job.category)} ${colorClasses[color].text} text-xl`}></i>
        </div>
      </div>

      <div className="flex items-center text-gray-500 mb-4">
        <i className="fas fa-map-marker-alt mr-2"></i>
        <span className="text-sm">{job.location}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`${colorClasses[color].badge} text-xs px-3 py-1 rounded-full`}>
          {job.category}
        </span>
        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
          {job.type || "Full-time"}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">Posted: {job.datePosted}</span>
        {job.salary && <span className="font-semibold text-gray-800">{job.salary}</span>}
      </div>
    </div>
  );
}
