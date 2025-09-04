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
    <div className="job-card bg-white p-4 sm:p-6 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-all flex flex-col">
      {/* Title and Icon */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex-1 mb-3 sm:mb-0">
          <h3
            className="font-semibold text-lg sm:text-xl text-gray-800 mb-1 cursor-pointer hover:text-blue-500 break-words"
            onClick={() => {
              setSelectedJob(job.jobLink);
              setLoading(true);
            }}
          >
            {job.title}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">{job.companyName}</p>
        </div>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${colorClasses[color].bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <i className={`${getCategoryIcon(job.category)} ${colorClasses[color].text} text-xl sm:text-2xl`}></i>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center text-gray-500 text-sm sm:text-base mb-4 flex-wrap">
        <i className="fas fa-map-marker-alt mr-2"></i>
        <span>{job.location}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`${colorClasses[color].badge} text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full`}>
          {job.category}
        </span>
        <span className="bg-gray-100 text-gray-700 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
          {job.type || "Full-time"}
        </span>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-500 text-sm sm:text-base gap-1">
        <span>Posted: {job.datePosted}</span>
        {job.salary && <span className="font-semibold text-gray-800">{job.salary}</span>}
      </div>
    </div>
  );
}
