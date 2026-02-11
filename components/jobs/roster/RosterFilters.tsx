"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LEVEL_COMPLETED_CHOICES,
  JOB_STATUS_CHOICES,
  CERTIFYING_AGENCY_CHOICES,
  type LevelCompleted,
  type JobStatus,
  type CertifyingAgency,
} from "@/types/graduate-roster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RosterFiltersProps {
  tradeStream: string;
  onTradeStreamChange: (value: string) => void;
  level: LevelCompleted | "";
  onLevelChange: (value: LevelCompleted | "") => void;
  passedYearMin: string;
  onPassedYearMinChange: (value: string) => void;
  passedYearMax: string;
  onPassedYearMaxChange: (value: string) => void;
  district: string;
  onDistrictChange: (value: string) => void;
  municipality: string;
  onMunicipalityChange: (value: string) => void;
  status: JobStatus | "";
  onStatusChange: (value: JobStatus | "") => void;
  certifyingAgency: CertifyingAgency | "";
  onCertifyingAgencyChange: (value: CertifyingAgency | "") => void;
  institutionName: string;
  onInstitutionNameChange: (value: string) => void;
}

export function RosterFilters({
  tradeStream,
  onTradeStreamChange,
  level,
  onLevelChange,
  passedYearMin,
  onPassedYearMinChange,
  passedYearMax,
  onPassedYearMaxChange,
  district,
  onDistrictChange,
  municipality,
  onMunicipalityChange,
  status,
  onStatusChange,
  certifyingAgency,
  onCertifyingAgencyChange,
  institutionName,
  onInstitutionNameChange,
}: RosterFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-slate-600">
          Trade / Stream
        </Label>
        <Input
          value={tradeStream}
          onChange={(e) => onTradeStreamChange(e.target.value)}
          placeholder="e.g. Electrical, Plumbing"
          className="h-8 text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-slate-600">Level</Label>
        <Select
          value={level}
          onValueChange={(v) =>
            onLevelChange(
              (v === "all" ? "" : v) as LevelCompleted | "",
            )
          }
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Any level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any level</SelectItem>
            {LEVEL_COMPLETED_CHOICES.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-slate-600">
            Passed year (min)
          </Label>
          <Input
            type="number"
            inputMode="numeric"
            value={passedYearMin}
            onChange={(e) => onPassedYearMinChange(e.target.value)}
            placeholder="From"
            className="h-8 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-slate-600">
            Passed year (max)
          </Label>
          <Input
            type="number"
            inputMode="numeric"
            value={passedYearMax}
            onChange={(e) => onPassedYearMaxChange(e.target.value)}
            placeholder="To"
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-slate-600">
          Current district
        </Label>
        <Input
          value={district}
          onChange={(e) => onDistrictChange(e.target.value)}
          placeholder="Search district"
          className="h-8 text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-slate-600">
          Current municipality
        </Label>
        <Input
          value={municipality}
          onChange={(e) => onMunicipalityChange(e.target.value)}
          placeholder="Search municipality"
          className="h-8 text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-slate-600">Status</Label>
        <Select
          value={status}
          onValueChange={(v) =>
            onStatusChange((v === "all" ? "" : v) as JobStatus | "")
          }
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Any status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            {JOB_STATUS_CHOICES.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-slate-600">
          Certifying agency
        </Label>
        <Select
          value={certifyingAgency}
          onValueChange={(v) =>
            onCertifyingAgencyChange(
              (v === "all" ? "" : v) as CertifyingAgency | "",
            )
          }
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Any agency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any agency</SelectItem>
            {CERTIFYING_AGENCY_CHOICES.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-slate-600">
          Institution name
        </Label>
        <Input
          value={institutionName}
          onChange={(e) => onInstitutionNameChange(e.target.value)}
          placeholder="Search institution"
          className="h-8 text-sm"
        />
      </div>
    </div>
  );
}

