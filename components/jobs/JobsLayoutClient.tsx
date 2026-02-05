"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { JobsSidebarNav } from "./JobsSidebarNav";
import { X, SlidersHorizontal } from "lucide-react";
import { JOBS_SIDEBAR } from "./jobs-sidebar-styles";

const SIDEBAR_ROUTES = [
  "career-guidance",
  "internship",
  "apprenticeship",
  "create",
] as const;

function shouldShowSidebar(pathname: string): boolean {
  if (!pathname.startsWith("/jobs")) return false;
  const segments = pathname.split("/").filter(Boolean);
  // /jobs only -> no layout sidebar (JobsSeekerContent has its own)
  if (segments.length === 1) return false;
  const secondSegment = segments[1];
  // /jobs/[slug] -> no sidebar (job detail page)
  if (!SIDEBAR_ROUTES.includes(secondSegment as any)) return false;
  return true;
}

export function JobsLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showSidebar = shouldShowSidebar(pathname);
  const isHiringMode = pathname.includes("/employer");

  const handleModeChange = (isHiring: boolean) => {
    if (isHiring) {
      router.push("/jobs/employer");
    } else {
      router.push("/jobs");
    }
  };

  if (!showSidebar) {
    return <>{children}</>;
  }

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="max-w-7xl px-8 mx-auto py-10 min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${JOBS_SIDEBAR.mobile} ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ msOverflowStyle: "none" } as React.CSSProperties}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-slate-900 text-sm">Filters</span>
          <button
            type="button"
            onClick={closeSidebar}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <JobsSidebarNav
          isHiringMode={isHiringMode}
          onModeChange={handleModeChange}
        />
      </aside>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className={JOBS_SIDEBAR.desktop}>
          <JobsSidebarNav
            isHiringMode={isHiringMode}
            onModeChange={handleModeChange}
          />
        </aside>
        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors lg:hidden mb-4"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
