import React from "react";

export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  const createPageArray = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = createPageArray();

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-1 sm:py-2 flex items-center justify-center border border-gray-300 rounded-full disabled:opacity-50 hover:bg-blue-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2 py-1 text-gray-500 hidden sm:inline">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => setCurrentPage(page)}
            className={`px-3 sm:px-4 py-1 sm:py-2 border rounded-full font-medium transition
              ${
                currentPage === page
                  ? "bg-blue-600 text-blue border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 active:bg-blue-700 active:text-white"
                  : "border-gray-300 text-gray-700 hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 active:bg-blue-200 active:text-blue-700"
              }
            `}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-1 sm:py-2 flex items-center justify-center border border-gray-300 rounded-full disabled:opacity-50 hover:bg-blue-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      >
        &gt;
      </button>
    </div>
  );
}
