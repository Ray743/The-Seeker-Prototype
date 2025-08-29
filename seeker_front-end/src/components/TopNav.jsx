import React from "react";

export default function TopNav({ total, searchQuery, sortOrder, setSortOrder }) {
  return (
    <div className="bg-white sticky top-0 z-10 shadow-sm p-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Job Listings</h2>
          <p className="text-gray-500">
            {total} {total === 1 ? "job" : "jobs"} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-gray-600 mr-2">Sort by:</span>
          <select
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
