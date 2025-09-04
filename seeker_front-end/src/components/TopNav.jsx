import React from "react";
import logo from "/logo.png";
import SearchBar from "./SearchBar";

export default function TopNav({
  total,
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  jobs,
  selectedSource,
  setSelectedSource,
  setCurrentPage,
}) {
  const sources = Array.from(new Set(jobs.map((job) => job.source))).filter(Boolean);

  return (
    <div className="bg-white sticky top-0 z-10 shadow-sm">
      {/* ---------- Header ---------- */}
      <div className="flex flex-row justify-between items-center p-3 sm:p-4">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2">
          {/* Logo only on small screens */}
          <img src={logo} alt="Seeker Logo" className="w-12 h-12 sm:w-16 sm:h-16 md:hidden" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Job Listings</h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              {total} {total === 1 ? "job" : "jobs"} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Right: Sort + Sources Dropdown */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <select
            className="border rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          {/* Sources Dropdown (Mobile only) */}
          <select
            className="border rounded-lg px-2 py-1 text-xs sm:text-sm md:hidden focus:ring-2 focus:ring-blue-500"
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All</option>
            {sources.map((source, idx) => (
              <option key={idx} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---------- Mobile only: Search Bar ---------- */}
      <div className="md:hidden p-3 border-t border-gray-200 bg-white">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
    </div>
  );
}
