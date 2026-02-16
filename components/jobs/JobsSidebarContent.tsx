"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  Briefcase,
  Clock,
  FileSignature,
  GraduationCap,
  Loader2,
  Calendar,
  DollarSign,
  ChevronRight,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { JOBS_QUICK_LINKS } from "./jobs-quick-links";
import { FilterOption } from "@/app/wishOffer/components/FilterOption";
import {
  type EmploymentTypeFilter,
  type ListingTimeFilter,
  getMajorGroups,
  getSubMajorGroups,
  getMinorGroups,
  getUnitGroups,
} from "@/services/jobs";
import type {
  MajorGroup,
  SubMajorGroup,
  MinorGroup,
  UnitGroup,
} from "@/types/unit-groups";
import Link from "next/link";
import { JOBS_SIDEBAR } from "./jobs-sidebar-styles";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

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
  selectedMajorGroupCodes: string[];
  setSelectedMajorGroupCodes: (codes: string[]) => void;
  selectedSubMajorGroupCodes: string[];
  setSelectedSubMajorGroupCodes: (codes: string[]) => void;
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
  selectedMajorGroupCodes,
  setSelectedMajorGroupCodes,
  selectedSubMajorGroupCodes,
  setSelectedSubMajorGroupCodes,
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
  // Cascade state for occupation filter
  const [majorCode, setMajorCode] = useState("");
  const [subMajorCode, setSubMajorCode] = useState("");
  const [minorCode, setMinorCode] = useState("");

  const [majorSearch, setMajorSearch] = useState("");
  const [subMajorSearch, setSubMajorSearch] = useState("");
  const [minorSearch, setMinorSearch] = useState("");
  const [unitSearch, setUnitSearch] = useState("");

  const debouncedMajor = useDebounce(majorSearch, 300);
  const debouncedSubMajor = useDebounce(subMajorSearch, 300);
  const debouncedMinor = useDebounce(minorSearch, 300);
  const debouncedUnit = useDebounce(unitSearch, 300);

  const [majorGroups, setMajorGroups] = useState<MajorGroup[]>([]);
  const [subMajorGroups, setSubMajorGroups] = useState<SubMajorGroup[]>([]);
  const [minorGroups, setMinorGroups] = useState<MinorGroup[]>([]);
  const [unitGroups, setUnitGroups] = useState<UnitGroup[]>([]);

  const [loadingMajor, setLoadingMajor] = useState(false);
  const [loadingSubMajor, setLoadingSubMajor] = useState(false);
  const [loadingMinor, setLoadingMinor] = useState(false);
  const [loadingUnit, setLoadingUnit] = useState(false);

  const [majorOpen, setMajorOpen] = useState(false);
  const [subMajorOpen, setSubMajorOpen] = useState(false);
  const [minorOpen, setMinorOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);

  useEffect(() => {
    if (!majorOpen) return;
    let cancelled = false;
    setLoadingMajor(true);
    getMajorGroups(debouncedMajor || undefined)
      .then((data) => {
        if (!cancelled) setMajorGroups(data);
      })
      .finally(() => {
        if (!cancelled) setLoadingMajor(false);
      });
    return () => {
      cancelled = true;
    };
  }, [majorOpen, debouncedMajor]);

  useEffect(() => {
    if (!subMajorOpen || !majorCode) return;
    let cancelled = false;
    setLoadingSubMajor(true);
    getSubMajorGroups(majorCode, debouncedSubMajor || undefined)
      .then((data) => {
        if (!cancelled) setSubMajorGroups(data);
      })
      .finally(() => {
        if (!cancelled) setLoadingSubMajor(false);
      });
    return () => {
      cancelled = true;
    };
  }, [subMajorOpen, majorCode, debouncedSubMajor]);

  useEffect(() => {
    if (!minorOpen || !subMajorCode) return;
    let cancelled = false;
    setLoadingMinor(true);
    getMinorGroups(subMajorCode, debouncedMinor || undefined)
      .then((data) => {
        if (!cancelled) setMinorGroups(data);
      })
      .finally(() => {
        if (!cancelled) setLoadingMinor(false);
      });
    return () => {
      cancelled = true;
    };
  }, [minorOpen, subMajorCode, debouncedMinor]);

  useEffect(() => {
    if (!unitOpen || !minorCode) return;
    let cancelled = false;
    setLoadingUnit(true);
    getUnitGroups(debouncedUnit || undefined, minorCode)
      .then((data) => {
        if (!cancelled) setUnitGroups(data);
      })
      .finally(() => {
        if (!cancelled) setLoadingUnit(false);
      });
    return () => {
      cancelled = true;
    };
  }, [unitOpen, minorCode, debouncedUnit]);

  const selectedMajor = majorGroups.find((g) => g.code === majorCode);
  const selectedSubMajor = subMajorGroups.find((g) => g.code === subMajorCode);
  const selectedMinor = minorGroups.find((g) => g.code === minorCode);
  const selectedUnitLabel =
    selectedUnitGroupCodes.length > 0
      ? selectedUnitGroupCodes.length === 1
        ? (unitGroups.find((g) => g.code === selectedUnitGroupCodes[0])
            ?.title ?? selectedUnitGroupCodes[0])
        : `${selectedUnitGroupCodes.length} unit groups`
      : null;

  const wrap = (fn: () => void) => () => {
    fn();
    onFilterClick?.();
  };

  const clearCascade = () => {
    setMajorCode("");
    setSubMajorCode("");
    setMinorCode("");
    setMajorSearch("");
    setSubMajorSearch("");
    setMinorSearch("");
    setUnitSearch("");
  };

  const handleMajorSelect = (code: string) => {
    setMajorCode(code);
    setSubMajorCode("");
    setMinorCode("");
    setSubMajorSearch("");
    setMinorSearch("");
    setUnitSearch("");
  };

  const handleSubMajorSelect = (code: string) => {
    setSubMajorCode(code);
    setMinorCode("");
    setMinorSearch("");
    setUnitSearch("");
  };

  const handleMinorSelect = (code: string) => {
    setMinorCode(code);
    setUnitSearch("");
  };

  const handleMajorFilterSelect = (code: string) => {
    setSelectedMajorGroupCodes(toggleCode(selectedMajorGroupCodes, code));
    setSelectedSubMajorGroupCodes([]);
    setSelectedMinorGroupCodes([]);
    setSelectedUnitGroupCodes([]);
    wrap(() => {})();
  };

  const handleSubMajorFilterSelect = (code: string) => {
    setSelectedSubMajorGroupCodes(toggleCode(selectedSubMajorGroupCodes, code));
    setSelectedMinorGroupCodes([]);
    setSelectedUnitGroupCodes([]);
    wrap(() => {})();
  };

  const handleUnitSelect = (code: string) => {
    setSelectedUnitGroupCodes(toggleCode(selectedUnitGroupCodes, code));
    setSelectedMinorGroupCodes([]);
    wrap(() => {})();
  };

  const handleMinorFilterSelect = (code: string) => {
    setSelectedMinorGroupCodes(toggleCode(selectedMinorGroupCodes, code));
    setSelectedUnitGroupCodes([]);
    wrap(() => {})();
  };

  const hasGroupsSelected =
    selectedMajorGroupCodes.length > 0 ||
    selectedSubMajorGroupCodes.length > 0 ||
    selectedUnitGroupCodes.length > 0 ||
    selectedMinorGroupCodes.length > 0;

  return (
    <div className="space-y-6">
      {/* Quick Links Section - shared styles with JobsSidebarNav */}
      <div className={JOBS_SIDEBAR.sectionBordered}>
        <h2 className={JOBS_SIDEBAR.sectionHeading}>Quick Links</h2>
        <div className={JOBS_SIDEBAR.linksContainer}>
          {JOBS_QUICK_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={JOBS_SIDEBAR.link}>
              <Icon className={JOBS_SIDEBAR.linkIcon} />
              <span className="truncate">{label}</span>
              <ChevronRight className={JOBS_SIDEBAR.linkChevron} />
            </Link>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div>
        <h4 className={JOBS_SIDEBAR.sectionHeadingLarge}>Filters</h4>

        {/* Groups Filter - cascading dropdowns */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid className="w-4 h-4 text-slate-600 shrink-0" />
            <h3 className="text-slate-900 font-semibold text-sm">Groups</h3>
          </div>
          <div className="space-y-3">
            <FilterOption
              label="All"
              isActive={!hasGroupsSelected}
              onClick={wrap(() => {
                setSelectedMajorGroupCodes([]);
                setSelectedSubMajorGroupCodes([]);
                setSelectedUnitGroupCodes([]);
                setSelectedMinorGroupCodes([]);
                clearCascade();
              })}
            />

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600">
                Major group
              </label>
              <Popover
                open={majorOpen}
                onOpenChange={(o) => {
                  setMajorOpen(o);
                  if (!o) setMajorSearch("");
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-full justify-between font-normal h-9 border-slate-200 text-sm",
                      !majorCode && "text-slate-500",
                    )}
                  >
                    <span className="truncate">
                      {selectedMajor?.title ?? "Select major"}
                    </span>
                    <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search major..."
                      value={majorSearch}
                      onValueChange={setMajorSearch}
                    />
                    <CommandList>
                      {loadingMajor && (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        </div>
                      )}
                      {!loadingMajor && (
                        <>
                          <CommandEmpty>No major group found.</CommandEmpty>
                          <CommandGroup>
                            {majorGroups.map((g) => (
                              <CommandItem
                                key={g.code}
                                value={g.code}
                                onSelect={() => {
                                  handleMajorSelect(g.code);
                                  handleMajorFilterSelect(g.code);
                                  setMajorOpen(false);
                                }}
                              >
                                <span className="truncate">{g.title}</span>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4 shrink-0",
                                    g.code === majorCode ||
                                      selectedMajorGroupCodes.includes(g.code)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600">
                Sub-major group
              </label>
              <Popover
                open={subMajorOpen}
                onOpenChange={(o) => {
                  setSubMajorOpen(o);
                  if (!o) setSubMajorSearch("");
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!majorCode}
                    className={cn(
                      "w-full justify-between font-normal h-9 border-slate-200 text-sm",
                      !subMajorCode && "text-slate-500",
                    )}
                  >
                    <span className="truncate">
                      {selectedSubMajor?.title ?? "Select sub-major"}
                    </span>
                    <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search sub-major..."
                      value={subMajorSearch}
                      onValueChange={setSubMajorSearch}
                    />
                    <CommandList>
                      {loadingSubMajor && (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        </div>
                      )}
                      {!loadingSubMajor && (
                        <>
                          <CommandEmpty>No sub-major group found.</CommandEmpty>
                          <CommandGroup>
                            {subMajorGroups.map((g) => (
                              <CommandItem
                                key={g.code}
                                value={g.code}
                                onSelect={() => {
                                  handleSubMajorSelect(g.code);
                                  handleSubMajorFilterSelect(g.code);
                                  setSubMajorOpen(false);
                                }}
                              >
                                <span className="truncate">{g.title}</span>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4 shrink-0",
                                    g.code === subMajorCode ||
                                      selectedSubMajorGroupCodes.includes(
                                        g.code,
                                      )
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600">
                Minor group
              </label>
              <Popover
                open={minorOpen}
                onOpenChange={(o) => {
                  setMinorOpen(o);
                  if (!o) setMinorSearch("");
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!subMajorCode}
                    className={cn(
                      "w-full justify-between font-normal h-9 border-slate-200 text-sm",
                      !minorCode && "text-slate-500",
                    )}
                  >
                    <span className="truncate">
                      {selectedMinor?.title ?? "Select minor"}
                    </span>
                    <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search minor..."
                      value={minorSearch}
                      onValueChange={setMinorSearch}
                    />
                    <CommandList>
                      {loadingMinor && (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        </div>
                      )}
                      {!loadingMinor && (
                        <>
                          <CommandEmpty>No minor group found.</CommandEmpty>
                          <CommandGroup>
                            {minorGroups.map((g) => (
                              <CommandItem
                                key={g.code}
                                value={g.code}
                                onSelect={() => {
                                  handleMinorSelect(g.code);
                                  handleMinorFilterSelect(g.code);
                                  setMinorOpen(false);
                                }}
                              >
                                <span className="truncate">{g.title}</span>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4 shrink-0",
                                    selectedMinorGroupCodes.includes(g.code)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600">
                Unit group
              </label>
              <Popover
                open={unitOpen}
                onOpenChange={(o) => {
                  setUnitOpen(o);
                  if (!o) setUnitSearch("");
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!minorCode}
                    className={cn(
                      "w-full justify-between font-normal h-9 border-slate-200 text-sm",
                      !selectedUnitLabel && "text-slate-500",
                    )}
                  >
                    <span className="truncate">
                      {selectedUnitLabel ?? "Select unit"}
                    </span>
                    <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search unit..."
                      value={unitSearch}
                      onValueChange={setUnitSearch}
                    />
                    <CommandList>
                      {loadingUnit && (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        </div>
                      )}
                      {!loadingUnit && (
                        <>
                          <CommandEmpty>No unit group found.</CommandEmpty>
                          <CommandGroup>
                            {unitGroups.map((g) => (
                              <CommandItem
                                key={g.code}
                                value={g.code}
                                onSelect={() => {
                                  handleUnitSelect(g.code);
                                  setUnitOpen(false);
                                }}
                              >
                                <span className="truncate">{g.title}</span>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4 shrink-0",
                                    selectedUnitGroupCodes.includes(g.code)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Employment Type Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-slate-600" />
            <h3 className="text-slate-900 font-semibold text-sm">
              Employment Type
            </h3>
          </div>
          <div className="space-y-1">
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

        {/* Posted Date Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-slate-600" />
            <h3 className="text-slate-900 font-semibold text-sm">
              Posted Date
            </h3>
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

        {/* Salary Range Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-slate-600" />
            <h3 className="text-slate-900 font-semibold text-sm">
              Salary Range
            </h3>
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
      </div>
    </div>
  );
};
