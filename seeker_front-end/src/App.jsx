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
  const [selectedSource, setSelectedSource] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}jobs.json`)
      .then((res) => res.json())
      .then((data) => setJobs(data || []))
      .catch((err) => console.error("Failed to load jobs.json", err));
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = Object.values(job).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesSource = selectedSource ? job.source === selectedSource : true;
    return matchesSearch && matchesSource;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0);
      const match = dateStr.match(/(\d{2})-(\d{2})-(\d{4})/);
      if (!match) return new Date(0);
      const [_, day, month, year] = match;
      return new Date(`${year}-${month}-${day}`);
    };
    const dateA = parseDate(a.datePosted);
    const dateB = parseDate(b.datePosted);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentJobs = sortedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder, selectedSource]);

  return (
    <div className="">
      {/* Desktop Sidebar (independent scroll) */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex md:flex-col md:h-screen md:overflow-y-auto md:overflow-x-hidden md:border-r md:border-gray-200 md:bg-white">
        <Sidebar
          jobs={jobs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-65">
        {/* TopNav */}
        <TopNav
          total={filteredJobs.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          jobs={jobs}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          setCurrentPage={setCurrentPage}
        />

        {/* Job list + pagination */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-8 min-h-0">
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

      {/* Job Modal */}
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
