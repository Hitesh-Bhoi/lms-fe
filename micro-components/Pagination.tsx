"use client";
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/common/icon";

export interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (newPage: number) => void;
  disabled?: boolean;
}
// function to generate array of page numbers with trimmed ellipsis notation
export const getPaginationPages = (
  currentPage: number,
  totalPages: number,
): (number | string)[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  // near the start
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  // near the end
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  // in the middle
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  limit,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  disabled = false,
}) => {
  if (total === 0) {
    return null;
  }
  const pages = getPaginationPages(page, totalPages);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200/80 bg-white text-sm select-none">
      {/* information text */}
      <div className="text-xs sm:text-sm text-slate-500 font-medium">
        Showing{" "}
        <span className="font-semibold text-slate-800">{startItem}</span> to{" "}
        <span className="font-semibold text-slate-800">{endItem}</span> of{" "}
        <span className="font-semibold text-slate-800">{total}</span>{" "}
        {total === 1 ? "lead" : "leads"}
      </div>
      {/* controls */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* previous button */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage || disabled}
          title="Previous page"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 transition-colors shadow-xs cursor-pointer"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        {/* page numbers and dots */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (typeof p === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs sm:text-sm text-slate-400 font-medium select-none"
                >
                  ...
                </span>
              );
            }
            const isCurrent = p === page;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                disabled={disabled}
                aria-current={isCurrent ? "page" : undefined}
                className={`min-w-8 h-8 px-2 inline-flex items-center justify-center text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-indigo-600 text-white font-semibold shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                } disabled:cursor-not-allowed`}
              >
                {p}
              </button>
            );
          })}
        </div>
        {/* next button */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage || disabled}
          title="Next page"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 transition-colors shadow-xs cursor-pointer"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
