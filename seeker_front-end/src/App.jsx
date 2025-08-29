import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import JobList from "./components/JobList";
import Pagination from "./components/Pagination";
import JobModal from "./components/JobModal";
import { getCategoryColor, getCategoryIcon } from "./utils/jobHelpers";

const ITEMS_PER_PAGE = 6;

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState(""); // new state for category
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load jobs.json
  useEffect(() => {
    fetch("/jobs.json")
      .then((res) => res.json())
      .then((data) => setJobs(data || [])) // ensure jobs is always an array
      .catch((err) => console.error("Failed to load jobs.json", err));
  }, []);

  // Filter jobs by search query and selected source
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = Object.values(job).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesSource = selectedSource ? job.source === selectedSource : true;
    return matchesSearch && matchesSource;
  });

  // Sort jobs
const sortedJobs = [...filteredJobs].sort((a, b) => {
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0); // fallback
    const match = dateStr.match(/(\d{2})-(\d{2})-(\d{4})/); // extract DD-MM-YYYY
    if (!match) return new Date(0);
    const [_, day, month, year] = match;
    return new Date(`${year}-${month}-${day}`); // convert to YYYY-MM-DD
  };

  const dateA = parseDate(a.datePosted);
  const dateB = parseDate(b.datePosted);

  if (sortOrder === "newest") return dateB - dateA;
  if (sortOrder === "oldest") return dateA - dateB;
  return 0;
});


  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentJobs = sortedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder, selectedSource]); // reset page if search or category changes

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        jobs={jobs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSource={selectedSource} // pass selected category
        setSelectedSource={setSelectedSource}
        setCurrentPage={setCurrentPage}
      />

      <div className="flex-1 flex flex-col">
        <TopNav
          total={filteredJobs.length}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <div className="flex-1 p-8 overflow-y-auto">
          <JobList
            jobs={currentJobs}
            setSelectedJob={setSelectedJob}
            setLoading={setLoading}
            getCategoryColor={getCategoryColor}
            getCategoryIcon={getCategoryIcon}
            searchQuery={searchQuery}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {selectedJob && (
        <JobModal
          selectedJob={selectedJob}
          setSelectedJob={setSelectedJob}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}
