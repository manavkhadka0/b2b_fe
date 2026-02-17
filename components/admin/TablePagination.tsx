"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

export interface TablePaginationProps {
  /** Current page (1-based) */
  page: number;
  /** Total count of items */
  count: number;
  /** Number of items on current page (for accurate "Showing X–Y") */
  resultsLength: number;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Whether there is a previous page */
  hasPrevious: boolean;
  /** Page size from API (default 10). Used when resultsLength is 0. */
  pageSize?: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Optional label for the entity (e.g. "applications") */
  entityLabel?: string;
  /** Whether data is loading (disables buttons) */
  isLoading?: boolean;
}

export function TablePagination({
  page,
  count,
  resultsLength,
  hasNext,
  hasPrevious,
  pageSize = PAGE_SIZE,
  onPageChange,
  entityLabel = "items",
  isLoading = false,
}: TablePaginationProps) {
  if (count === 0) return null;

  const start = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = resultsLength > 0 ? start + resultsLength - 1 : Math.min(page * pageSize, count);
  const totalPages = Math.ceil(count / pageSize);

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-700">
          {start}–{end}
        </span>{" "}
        of <span className="font-medium text-slate-700">{count}</span>{" "}
        {entityLabel}
      </p>

      <Pagination className="mx-0 w-auto min-w-0">
        <PaginationContent className="flex flex-wrap gap-1">
          <PaginationItem>
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={!hasPrevious || isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
          </PaginationItem>

          <PaginationItem className="hidden items-center gap-1 sm:flex">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  disabled={isLoading}
                  className={`min-w-[2.25rem] rounded-lg px-3 py-2 text-sm font-medium transition ${
                    pageNum === page
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  } disabled:opacity-50`}
                >
                  {pageNum}
                </button>
              );
            })}
          </PaginationItem>

          <PaginationItem>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNext || isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
