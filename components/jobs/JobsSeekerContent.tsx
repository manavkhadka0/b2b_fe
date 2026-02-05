"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getJobs,
  type EmploymentTypeFilter,
  type ListingTimeFilter,
} from "@/services/jobs";
import { Job } from "@/types/types";
import { transformJobs } from "@/utils/jobTransform";
import {
  Loader2,
  X,
  Search,
  SlidersHorizontal,
  FilterX,
  ChevronRight,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { JobCard } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";

import { ModeToggle, type JobsViewMode } from "@/components/jobs/ModeToggle";
import { JobsSidebarContent } from "./JobsSidebarContent";
import { JOBS_SIDEBAR } from "./jobs-sidebar-styles";

interface JobsSeekerContentProps {
  onApply: (job: Job) => void;
  onModeChange?: (mode: JobsViewMode) => void;
}

const VALID_LISTING_TIMES: (ListingTimeFilter | "")[] = [
  "",
  "Last 24 hours",
  "Last 3 days",
  "Last 7 days",
  "Last 14 days",
  "Last 30 days",
];

export function JobsSeekerContent({
  onApply,
  onModeChange,
}: JobsSeekerContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmploymentType, setSelectedEmploymentType] =
    useState<EmploymentTypeFilter>("All");
  const [selectedUnitGroupCodes, setSelectedUnitGroupCodes] = useState<
    string[]
  >([]);
  const [selectedMinorGroupCodes, setSelectedMinorGroupCodes] = useState<
    string[]
  >([]);
  const [listingTime, setListingTime] = useState<ListingTimeFilter | "">("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedSalaryMin = useDebounce(salaryMin, 500);
  const debouncedSalaryMax = useDebounce(salaryMax, 500);

  // Sync URL -> state on mount and when user navigates (e.g. back/forward)
  useEffect(() => {
    const search = searchParams.get("search") ?? "";
    const emp = (searchParams.get("employment_type") ??
      "All") as EmploymentTypeFilter;
    const units =
      searchParams.get("unit_groups")?.split(",").filter(Boolean) ?? [];
    const minors =
      searchParams.get("minor_groups")?.split(",").filter(Boolean) ?? [];
    const lt = searchParams.get("listing_time") ?? "";
    const smin = searchParams.get("salary_min") ?? "";
    const smax = searchParams.get("salary_max") ?? "";

    setSearchQuery(search);
    setSelectedEmploymentType(
      ["All", "Full Time", "Part Time", "Contract", "Internship"].includes(emp)
        ? emp
        : "All",
    );
    setSelectedUnitGroupCodes(units);
    setSelectedMinorGroupCodes(minors);
    setListingTime(
      VALID_LISTING_TIMES.includes(lt as ListingTimeFilter | "")
        ? (lt as ListingTimeFilter | "")
        : "",
    );
    setSalaryMin(smin);
    setSalaryMax(smax);
  }, [searchParams]);

  // Sync state -> URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (selectedEmploymentType !== "All")
      params.set("employment_type", selectedEmploymentType);
    if (selectedUnitGroupCodes.length)
      params.set("unit_groups", selectedUnitGroupCodes.join(","));
    if (selectedMinorGroupCodes.length)
      params.set("minor_groups", selectedMinorGroupCodes.join(","));
    if (listingTime) params.set("listing_time", listingTime);
    if (debouncedSalaryMin.trim())
      params.set("salary_min", debouncedSalaryMin.trim());
    if (debouncedSalaryMax.trim())
      params.set("salary_max", debouncedSalaryMax.trim());

    const qs = params.toString();
    const newUrl = qs ? `?${qs}` : window.location.pathname;
    if (window.location.search !== (qs ? `?${qs}` : "")) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [
    debouncedSearch,
    selectedEmploymentType,
    selectedUnitGroupCodes,
    selectedMinorGroupCodes,
    listingTime,
    debouncedSalaryMin,
    debouncedSalaryMax,
  ]);

  const lastFetchedRef = useRef<string>("");

  const fetchJobs = useCallback(
    async (
      search?: string,
      employment_type?: EmploymentTypeFilter,
      unit_groups?: string[],
      minor_groups?: string[],
      listing_time?: ListingTimeFilter,
      salary_min?: string,
      salary_max?: string,
    ) => {
      setIsLoading(true);
      try {
        const response = await getJobs(
          search,
          employment_type,
          unit_groups && unit_groups.length > 0 ? unit_groups : undefined,
          minor_groups && minor_groups.length > 0 ? minor_groups : undefined,
          listing_time || undefined,
          salary_min?.trim() || undefined,
          salary_max?.trim() || undefined,
        );
        const transformed = transformJobs(response.results);
        setJobs(transformed);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const fetchKey = JSON.stringify({
      search: debouncedSearch.trim(),
      employment_type: selectedEmploymentType,
      unit_groups: selectedUnitGroupCodes,
      minor_groups: selectedMinorGroupCodes,
      listing_time: listingTime,
      salary_min: debouncedSalaryMin.trim(),
      salary_max: debouncedSalaryMax.trim(),
    });
    if (lastFetchedRef.current === fetchKey) return;
    lastFetchedRef.current = fetchKey;

    fetchJobs(
      debouncedSearch.trim() || undefined,
      selectedEmploymentType,
      selectedUnitGroupCodes,
      selectedMinorGroupCodes,
      listingTime || undefined,
      debouncedSalaryMin.trim() || undefined,
      debouncedSalaryMax.trim() || undefined,
    );
  }, [
    debouncedSearch,
    selectedEmploymentType,
    selectedUnitGroupCodes,
    selectedMinorGroupCodes,
    listingTime,
    debouncedSalaryMin,
    debouncedSalaryMax,
    fetchJobs,
  ]);

  const clearSearch = () => setSearchQuery("");
  const clearAllFilters = () => {
    setSelectedEmploymentType("All");
    setSelectedUnitGroupCodes([]);
    setSelectedMinorGroupCodes([]);
    setListingTime("");
    setSalaryMin("");
    setSalaryMax("");
    setSearchQuery("");
  };

  const hasGroupFilter =
    selectedUnitGroupCodes.length > 0 || selectedMinorGroupCodes.length > 0;
  const hasSalaryFilter = salaryMin.trim() !== "" || salaryMax.trim() !== "";
  const hasListingTimeFilter = listingTime !== "";
  const hasActiveFilters =
    selectedEmploymentType !== "All" ||
    searchQuery.trim() !== "" ||
    hasGroupFilter ||
    hasListingTimeFilter ||
    hasSalaryFilter;

  const employmentTypeLabel =
    selectedEmploymentType !== "All" ? selectedEmploymentType : null;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="max-w-7xl mx-auto py-10 min-h-screen">
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
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {onModeChange && (
          <div className={JOBS_SIDEBAR.sectionBordered}>
            <h2 className={JOBS_SIDEBAR.sectionHeadingTight}>View Mode</h2>
            <ModeToggle mode="jobs" onModeChange={onModeChange} />
          </div>
        )}
        <JobsSidebarContent
          selectedEmploymentType={selectedEmploymentType}
          setSelectedEmploymentType={setSelectedEmploymentType}
          selectedUnitGroupCodes={selectedUnitGroupCodes}
          setSelectedUnitGroupCodes={setSelectedUnitGroupCodes}
          selectedMinorGroupCodes={selectedMinorGroupCodes}
          setSelectedMinorGroupCodes={setSelectedMinorGroupCodes}
          listingTime={listingTime}
          setListingTime={setListingTime}
          salaryMin={salaryMin}
          setSalaryMin={setSalaryMin}
          salaryMax={salaryMax}
          setSalaryMax={setSalaryMax}
          onFilterClick={closeSidebar}
        />
      </aside>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className={JOBS_SIDEBAR.desktop}>
          {onModeChange && (
            <div className={JOBS_SIDEBAR.sectionBordered}>
              <h2 className={JOBS_SIDEBAR.sectionHeadingTight}>View Mode</h2>
              <ModeToggle mode="jobs" onModeChange={onModeChange} />
            </div>
          )}
          <JobsSidebarContent
            selectedEmploymentType={selectedEmploymentType}
            setSelectedEmploymentType={setSelectedEmploymentType}
            selectedUnitGroupCodes={selectedUnitGroupCodes}
            setSelectedUnitGroupCodes={setSelectedUnitGroupCodes}
            selectedMinorGroupCodes={selectedMinorGroupCodes}
            setSelectedMinorGroupCodes={setSelectedMinorGroupCodes}
            listingTime={listingTime}
            setListingTime={setListingTime}
            salaryMin={salaryMin}
            setSalaryMin={setSalaryMin}
            salaryMax={salaryMax}
            setSalaryMax={setSalaryMax}
            onFilterClick={undefined}
          />
        </aside>

        <div className="flex-1 min-w-0">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent py-2">
                यहाँ काम र कामदार पाइन्छ
              </h1>
              <Link href="/jobs/employer">
                <Button
                  size="default"
                  className="whitespace-nowrap bg-blue-800 text-white"
                >
                  Post Your Job
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl">
              Explore opportunities, connect with employers, and take the next
              step in your career journey.
            </p>
          </div>

          {/* Controls Section */}
          <div className="flex items-center gap-3 mb-4 flex-wrap justify-between">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors lg:hidden"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="rounded-md border border-slate-200 flex items-center gap-1.5 px-2.5 py-1.5 bg-white min-w-[200px] max-w-[280px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 h-7 min-w-0"
              />
              {isLoading && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 shrink-0" />
              )}
              {searchQuery && !isLoading && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4 py-2 px-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mr-1">
                Active filters:
              </span>
              {employmentTypeLabel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                  Type: {employmentTypeLabel}
                </span>
              )}
              {hasGroupFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                  Groups:{" "}
                  {selectedUnitGroupCodes.length +
                    selectedMinorGroupCodes.length}{" "}
                  selected
                </span>
              )}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                  Search: &quot;{searchQuery.trim()}&quot;
                </span>
              )}
              {hasListingTimeFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                  Posted: {listingTime}
                </span>
              )}
              {hasSalaryFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                  Salary:{" "}
                  {salaryMin.trim() && salaryMax.trim()
                    ? `${salaryMin.trim()} - ${salaryMax.trim()}`
                    : salaryMin.trim()
                      ? `Min ${salaryMin.trim()}`
                      : `Max ${salaryMax.trim()}`}
                </span>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 ml-auto px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-800 text-xs font-medium transition-colors"
                aria-label="Clear all filters"
              >
                <FilterX className="w-3.5 h-3.5" />
                Clear all
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px] bg-white">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm">
              <p className="text-slate-500">
                No jobs found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={onApply}
                  onClick={(j) => router.push(`/jobs/${j.slug}`)}
                  showApplyButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
