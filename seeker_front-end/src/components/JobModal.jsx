import React, { useState, useEffect } from "react";

export default function JobModal({ selectedJob, setSelectedJob, loading, setLoading }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!selectedJob) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div
        className={`bg-white rounded-xl shadow-xl relative overflow-hidden transition-all duration-300
          ${isSmallScreen ? "w-full h-full rounded-none" : isMaximized ? "w-full h-full" : "w-11/12 h-[80vh]"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b">
          {!isSmallScreen && (
            <span className="font-semibold text-gray-700 text-lg md:text-xl lg:text-2xl">
              Job Preview
            </span>
          )}

          <div className="flex space-x-2">
            {!isSmallScreen && (
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-gray-500 hover:text-blue-500"
                title={isMaximized ? "Restore" : "Maximize"}
              >
                <i className={`fas ${isMaximized ? "fa-compress" : "fa-expand"} text-xl`}></i>
              </button>
            )}
            <button
              onClick={() => setSelectedJob(null)}
              className="text-gray-500 hover:text-red-500"
              title="Close"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
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
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}
