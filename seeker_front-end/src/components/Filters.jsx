import React from "react";

export default function Filters() {
  return (
    <div className="mb-8">
      <h2 className="text-xs uppercase text-gray-500 font-semibold mb-4">
        Filters
      </h2>
      <div className="space-y-3">
        {["Remote", "Full-time", "Contract"].map((filter) => (
          <div className="flex items-center" key={filter}>
            <input
              type="checkbox"
              id={filter.toLowerCase()}
              className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
            />
            <label htmlFor={filter.toLowerCase()} className="ml-2 text-gray-700">
              {filter}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
