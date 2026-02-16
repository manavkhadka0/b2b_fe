interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="px-4 py-12 text-center">
      <p className="text-sm font-medium text-slate-900">
        {hasFilters
          ? "No applications match your current filters."
          : "No applications found."}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {hasFilters
          ? "Try clearing some filters or adjusting your search criteria."
          : "There are currently no applications in the system."}
      </p>
    </div>
  );
}

