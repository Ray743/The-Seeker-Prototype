import React from "react";

export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-blue-500 hover:text-white"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(Math.max(currentPage - 5, 0), Math.min(currentPage + 5, totalPages))
          .map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center border rounded-lg ${
                currentPage === page
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-300 hover:bg-blue-500 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
      </div>

      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-blue-500 hover:text-white"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}
