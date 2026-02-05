"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { AvailabilityOption, ProficiencyLevel } from "@/services/workInterests";

const PROFICIENCY_OPTIONS: ProficiencyLevel[] = [
  "Beginner",
  "Intermediate",
  "Expert",
];

const AVAILABILITY_OPTIONS: AvailabilityOption[] = [
  "Full Time",
  "Part Time",
  "Internship",
  "Freelance",
];

interface BrowseFiltersProps {
  availability: AvailabilityOption | "";
  onAvailabilityChange: (value: AvailabilityOption | "") => void;
  proficiency: ProficiencyLevel | "";
  onProficiencyChange: (value: ProficiencyLevel | "") => void;
}

export function BrowseFilters({
  availability,
  onAvailabilityChange,
  proficiency,
  onProficiencyChange,
}: BrowseFiltersProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Availability Filters */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Availability
        </h3>
        <div className="space-y-2">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={availability === opt}
                onCheckedChange={(checked) => {
                  onAvailabilityChange(checked ? opt : "");
                }}
                className="data-[state=checked]:bg-blue-800 data-[state=checked]:border-blue-800"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                {opt}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Proficiency Filters */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Proficiency Level
        </h3>
        <div className="space-y-2">
          {PROFICIENCY_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={proficiency === opt}
                onCheckedChange={(checked) => {
                  onProficiencyChange(checked ? opt : "");
                }}
                className="data-[state=checked]:bg-blue-800 data-[state=checked]:border-blue-800"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                {opt}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
