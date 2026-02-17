"use client";

import { ReactNode } from "react";

interface AdminTableWrapperProps {
  children: ReactNode;
  /** Tailwind min-width class for horizontal scroll. Default min-w-[600px]. */
  minWidthClass?: string;
}

/**
 * Wraps admin tables to enable horizontal scroll on narrow screens (e.g. 320px).
 * Data remains visible and scrollable on mobile.
 */
export function AdminTableWrapper({
  children,
  minWidthClass = "min-w-[600px]",
}: AdminTableWrapperProps) {
  return (
    <div className="min-w-0 w-full overflow-x-auto rounded-xl border bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
      <div className={minWidthClass}>{children}</div>
    </div>
  );
}
