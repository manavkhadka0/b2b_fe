"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  Briefcase,
  Clock,
  FileSignature,
  GraduationCap,
  Search,
  Loader2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { FilterOption } from "@/app/wishOffer/components/FilterOption";
import {
  type EmploymentTypeFilter,
  type ListingTimeFilter,
  searchGroups,
  type SearchGroupResponse,
} from "@/services/jobs";

const LISTING_TIME_OPTIONS: { value: ListingTimeFilter | ""; label: string }[] =
  [
    { value: "", label: "Any time" },
    { value: "Last 24 hours", label: "Last 24 hours" },
    { value: "Last 3 days", label: "Last 3 days" },
    { value: "Last 7 days", label: "Last 7 days" },
    { value: "Last 14 days", label: "Last 14 days" },
    { value: "Last 30 days", label: "Last 30 days" },
  ];

export type JobsSidebarContentProps = {
  selectedEmploymentType: EmploymentTypeFilter;
  setSelectedEmploymentType: (t: EmploymentTypeFilter) => void;
  selectedUnitGroupCodes: string[];
  setSelectedUnitGroupCodes: (codes: string[]) => void;
  selectedMinorGroupCodes: string[];
  setSelectedMinorGroupCodes: (codes: string[]) => void;
  listingTime: ListingTimeFilter | "";
  setListingTime: (t: ListingTimeFilter | "") => void;
  salaryMin: string;
  setSalaryMin: (v: string) => void;
  salaryMax: string;
  setSalaryMax: (v: string) => void;
  onFilterClick?: () => void;
};

const EMPLOYMENT_TYPES: {
  value: EmploymentTypeFilter;
  label: string;
  icon?: React.ReactNode;
}[] = [
  { value: "All", label: "All Types" },
  {
    value: "Full Time",
    label: "Full Time",
    icon: <Briefcase className="w-4 h-4 text-slate-500" />,
  },
  {
    value: "Part Time",
    label: "Part Time",
    icon: <Clock className="w-4 h-4 text-slate-500" />,
  },
  {
    value: "Contract",
    label: "Contract",
    icon: <FileSignature className="w-4 h-4 text-slate-500" />,
  },
  {
    value: "Internship",
    label: "Internship",
    icon: <GraduationCap className="w-4 h-4 text-slate-500" />,
  },
];

function toggleCode(codes: string[], code: string): string[] {
  return codes.includes(code)
    ? codes.filter((c) => c !== code)
    : [...codes, code];
}

export const JobsSidebarContent: React.FC<JobsSidebarContentProps> = ({
  selectedEmploymentType,
  setSelectedEmploymentType,
  selectedUnitGroupCodes,
  setSelectedUnitGroupCodes,
  selectedMinorGroupCodes,
  setSelectedMinorGroupCodes,
  listingTime,
  setListingTime,
  salaryMin,
  setSalaryMin,
  salaryMax,
  setSalaryMax,
  onFilterClick,
}) => {
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [searchResults, setSearchResults] =
    useState<SearchGroupResponse | null>(null);
  const [isSearchingGroups, setIsSearchingGroups] = useState(false);

  useEffect(() => {
    if (!groupSearchTerm.trim()) {
      setSearchResults(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsSearchingGroups(true);
      try {
        const data = await searchGroups(groupSearchTerm);
        if (!cancelled && data) setSearchResults(data);
        else if (!cancelled) setSearchResults(null);
      } catch {
        if (!cancelled) setSearchResults(null);
      } finally {
        if (!cancelled) setIsSearchingGroups(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [groupSearchTerm]);

  const wrap = (fn: () => void) => () => {
    fn();
    onFilterClick?.();
  };

  const handleUnitGroupToggle = (code: string) => {
    setSelectedUnitGroupCodes(toggleCode(selectedUnitGroupCodes, code));
  };

  const handleMinorGroupToggle = (code: string) => {
    setSelectedMinorGroupCodes(toggleCode(selectedMinorGroupCodes, code));
  };

  const hasGroupsSelected =
    selectedUnitGroupCodes.length > 0 || selectedMinorGroupCodes.length > 0;

  const hasUnitResults =
    searchResults && searchResults.results.unit_groups.length > 0;
  const hasMinorResults =
    searchResults && searchResults.results.minor_groups.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
          <LayoutGrid className="w-4 h-4 text-slate-500" />
          <span>Employment Type</span>
        </div>
        <div className="space-y-0.5">
          {EMPLOYMENT_TYPES.map(({ value, label, icon }) => (
            <FilterOption
              key={value}
              label={label}
              isActive={selectedEmploymentType === value}
              onClick={wrap(() => setSelectedEmploymentType(value))}
              icon={icon}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>Posted Date</span>
        </div>
        <select
          value={listingTime}
          onChange={(e) => {
            const val = (e.target.value as ListingTimeFilter) || "";
            setListingTime(val);
            onFilterClick?.();
          }}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
        >
          {LISTING_TIME_OPTIONS.map(({ value, label }) => (
            <option key={value || "any"} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
          <DollarSign className="w-4 h-4 text-slate-500" />
          <span>Salary Range</span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
          <LayoutGrid className="w-4 h-4 text-slate-500" />
          <span>Groups</span>
        </div>
        <div className="space-y-2">
          <FilterOption
            label="All categories"
            isActive={!hasGroupsSelected}
            onClick={wrap(() => {
              setSelectedUnitGroupCodes([]);
              setSelectedMinorGroupCodes([]);
            })}
          />
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by code or title..."
              value={groupSearchTerm}
              onChange={(e) => setGroupSearchTerm(e.target.value)}
              className="w-full pl-8 pr-8 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
            />
            {isSearchingGroups && (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
              </div>
            )}
          </div>
          {(hasMinorResults || hasUnitResults) && (
            <div className="space-y-3 pt-1">
              {hasMinorResults && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide px-1">
                    Minor groups
                  </p>
                  <div className="space-y-0.5">
                    {searchResults!.results.minor_groups.map((group) => (
                      <FilterOption
                        key={group.code}
                        label={`${group.code} · ${group.title}`}
                        isActive={selectedMinorGroupCodes.includes(group.code)}
                        onClick={wrap(() => handleMinorGroupToggle(group.code))}
                      />
                    ))}
                  </div>
                </div>
              )}
              {hasUnitResults && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide px-1">
                    Unit groups
                  </p>
                  <div className="space-y-0.5">
                    {searchResults!.results.unit_groups.map((group) => (
                      <FilterOption
                        key={group.code}
                        label={`${group.code} · ${group.title}`}
                        isActive={selectedUnitGroupCodes.includes(group.code)}
                        onClick={wrap(() => handleUnitGroupToggle(group.code))}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
