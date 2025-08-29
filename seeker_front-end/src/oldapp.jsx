import React, { useState, useEffect } from "react";
import logo from "/logo.png";

const ITEMS_PER_PAGE = 6;

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load jobs.json from public folder
  useEffect(() => {
    fetch("/jobs.json")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Failed to load jobs.json", err));
  }, []);

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) =>
    Object.values(job).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sorting logic
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortOrder === "newest") {
      // Assuming 'datePosted' is in a sortable format
      return new Date(b.datePosted) - new Date(a.datePosted);
    }
    // Add other sorting logic here if needed
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentJobs = sortedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page on new search or sort
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder]);

  // Function to get icon based on job category
  const getCategoryIcon = (category = "") => {
    switch (category.toLowerCase()) {
      case "design":
        return "fas fa-palette";
      case "development":
        return "fas fa-laptop-code";
      case "marketing":
        return "fas fa-chart-line";
      case "business":
        return "fas fa-briefcase";
      default:
        return "fas fa-briefcase";
    }
  };

  // Function to get color based on job category
  const getCategoryColor = (category = "") => {
    switch (category.toLowerCase()) {
      case "design":
        return "purple";
      case "development":
        return "blue";
      case "marketing":
        return "green";
      case "business":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Navigation - Now scrolls independently */}
      <div className="w-64 bg-white shadow-lg flex flex-col overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center mb-10">
            <img 
              src={logo} 
              alt="Seeker Logo" 
              className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 mr-3" 
            />
          </div>
          {/* Search */}
          <div className="mb-8">
            <h2 className="text-xs uppercase text-gray-500 font-semibold mb-4">Search</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          {/* Filters (not wired up yet, placeholder) */}
          <div className="mb-8">
            <h2 className="text-xs uppercase text-gray-500 font-semibold mb-4">Filters</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <input type="checkbox" id="remote" className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded" />
                <label htmlFor="remote" className="ml-2 text-gray-700">Remote</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="fulltime" className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded" />
                <label htmlFor="fulltime" className="ml-2 text-gray-700">Full-time</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="contract" className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded" />
                <label htmlFor="contract" className="ml-2 text-gray-700">Contract</label>
              </div>
            </div>
          </div>
          {/* Popular Categories (not wired up yet, placeholder) */}
          <div>
            <h2 className="text-xs uppercase text-gray-500 font-semibold mb-4">Popular Categories</h2>
            <div className="space-y-2">
              <button className="text-sm text-gray-700 hover:text-blue-500 block">Software Development</button>
              <button className="text-sm text-gray-700 hover:text-blue-500 block">Marketing</button>
              <button className="text-sm text-gray-700 hover:text-blue-500 block">Design</button>
              <button className="text-sm text-gray-700 hover:text-blue-500 block">Finance</button>
            </div>
          </div>
        </div>
        <div className="mt-auto p-6 text-center text-xs text-gray-500">
          <p>© 2025 The Seeker</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Top Navigation */}
        <div className="bg-white sticky top-0 z-10 shadow-sm p-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Job Listings</h2>
              <p className="text-gray-500">
                {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            {/* Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Sort by:</span>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="salary-high-to-low">Salary: High to Low</option>
                  <option value="salary-low-to-high">Salary: Low to High</option>
                  <option value="relevance">Relevance</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Scrollable Job Listings & Pagination */}
        <div className="flex-1 p-8 overflow-y-auto">
          {currentJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentJobs.map((job, index) => {
                const color = getCategoryColor(job.category);
                const colorClasses = {
                  blue: { bg: "bg-blue-50", text: "text-blue-500", badge: "bg-blue-100 text-blue-700" },
                  purple: { bg: "bg-purple-50", text: "text-purple-500", badge: "bg-purple-100 text-purple-700" },
                  green: { bg: "bg-green-50", text: "text-green-500", badge: "bg-green-100 text-green-700" },
                  yellow: { bg: "bg-yellow-50", text: "text-yellow-500", badge: "bg-yellow-100 text-yellow-700" },
                  gray: { bg: "bg-gray-50", text: "text-gray-500", badge: "bg-gray-100 text-gray-700" },
                };
                return (
                  <div
                    key={index}
                    className="job-card bg-white p-6 rounded-xl shadow border border-gray-100 transition-all duration-300 hover:shadow-lg"
                  >
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
              })}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-500">
                {searchQuery ? `No jobs found for "${searchQuery}"` : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              {/* Prev button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(currentPage - 5, 0),
                    Math.min(currentPage + 5, totalPages)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center border rounded-lg ${
                        currentPage === page
                          ? "bg-blue-500 text-white border-blue-500"
                          : "border-gray-300 hover:bg-blue-500 hover:text-white"
                      } transition-colors`}
                    >
                      {page}
                    </button>
                  ))}
              </div>
              {/* Next button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Job Preview Modal */}
{selectedJob && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl w-11/12 h-[80vh] relative overflow-hidden">
      {/* Header with Close Button */}
      <div className="flex justify-between items-center p-3 border-b">
        <span className="font-semibold text-gray-700">Job Preview</span>
        <button 
          onClick={() => setSelectedJob(null)} 
          className="text-gray-500 hover:text-red-500"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* Iframe */}
      <iframe 
        src={selectedJob} 
        title="Job Preview" 
        className="w-full h-full border-0"
        onLoad={() => setLoading(false)} // hide spinner when loaded
      />
    </div>
  </div>
)}


    </div>
    
  );
}
