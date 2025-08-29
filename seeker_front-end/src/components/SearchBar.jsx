import React from "react";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <input
      type="text"
      placeholder="Search jobs..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 px-3 py-2 text-gray-700 text-base placeholder-gray-400"
    />
  );
}
