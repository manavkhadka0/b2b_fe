interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="text-center text-gray-500 space-y-4 mt-10">
      {hasFilters ? (
        <>
          <p className="text-lg">
            No applications match your current filters.
          </p>
          <p>Try clearing some filters or adjusting your search criteria.</p>
        </>
      ) : (
        <>
          <p className="text-lg">No applications found.</p>
          <p>There are currently no applications in the system.</p>
        </>
      )}
    </div>
  );
}

