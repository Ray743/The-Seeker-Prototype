import React from "react";

export default function Categories({
  jobs,
  selectedSource,
  setSelectedSource,
  setCurrentPage,
}) {
  // Get unique sources from jobs
  const sources = Array.from(new Set(jobs.map((job) => job.source)));

  const handleClick = (source) => {
    setSelectedSource(source); // filter jobs by this source
    setCurrentPage(1);        // reset to first page
  };

  return (
    <div className="mb-6">
      <h2 className="text-xs uppercase text-gray-500 font-semibold mb-4">
        Sources
      </h2>
      <div className="space-y-2">
        {/* "All" button */}
        <button
          key="all"
          className={`text-sm block ${
            selectedSource === "" ? "text-blue-500 font-semibold" : "text-gray-700 hover:text-blue-500"
          }`}
          onClick={() => handleClick("")}
        >
          All
        </button>

        {sources.map((source) => (
          <button
            key={source}
            className={`text-sm block ${
              selectedSource === source ? "text-blue-500 font-semibold" : "text-gray-700 hover:text-blue-500"
            }`}
            onClick={() => handleClick(source)}
          >
            {source}
          </button>
        ))}
      </div>
    </div>
  );
}
