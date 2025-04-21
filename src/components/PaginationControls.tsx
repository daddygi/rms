"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const createPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const delta = 1;

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage - delta > 2) pages.unshift("...");
    if (currentPage + delta < totalPages - 1) pages.push("...");

    pages.unshift(1);
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = createPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 mt-6 text-sm">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 py-1 text-gray-600 hover:text-black disabled:text-gray-300"
      >
        <ChevronLeft className="w-4 h-4 inline" /> Prev
      </button>
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={i} className="px-2 py-1">
            <MoreHorizontal className="w-4 h-4" />
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-black text-white"
                : "text-black hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2 py-1 text-gray-600 hover:text-black disabled:text-gray-300"
      >
        Next <ChevronRight className="w-4 h-4 inline" />
      </button>
    </div>
  );
}
