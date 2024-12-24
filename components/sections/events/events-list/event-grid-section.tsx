"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import EventCard from "../common/events-card";
import type { Event, EventResponse } from "@/types/events";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { DataNotFound } from "../../errors/data-not-found";

type EventGridSectionProps = {
  eventsResponse: EventResponse;
};

export const EventGridSection = ({ eventsResponse }: EventGridSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { results, count, next, previous } = eventsResponse;

  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get("page")) || 1;

  // Constants for pagination
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
  const hasNext = Boolean(next);
  const hasPrevious = Boolean(previous);

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const showMax = 5;

    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + showMax - 1);

    if (end - start + 1 < showMax) {
      start = Math.max(1, end - showMax + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (results.length === 0) {
    return <DataNotFound title="No events found" message="No events found" />;
  }

  return (
    <div className="space-y-8 container max-w-7xl mx-auto mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((event: Event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              href={`/events?page=${currentPage - 1}`}
              aria-disabled={!hasPrevious}
              className={!hasPrevious ? "cursor-not-allowed opacity-50" : ""}
            />
          </PaginationItem>

          {/* First page if not in view */}
          {pageNumbers[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="/events?page=1"
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {pageNumbers[0] > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* Page numbers */}
          {pageNumbers.map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href={`/events?page=${pageNum}`}
                isActive={pageNum === currentPage}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Last page if not in view */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href={`/events?page=${totalPages}`}
                  isActive={currentPage === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              href={`/events?page=${currentPage + 1}`}
              aria-disabled={!hasNext}
              className={!hasNext ? "cursor-not-allowed opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
