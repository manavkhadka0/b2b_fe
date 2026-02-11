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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 text-sm justify-start text-left font-normal",
                  !passedYearMin && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {passedYearMin || "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  passedYearMin
                    ? new Date(parseInt(passedYearMin), 0, 1)
                    : undefined
                }
                onSelect={(date) => {
                  if (date) {
                    onPassedYearMinChange(date.getFullYear().toString());
                  } else {
                    onPassedYearMinChange("");
                  }
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-slate-600">
            Passed year (max)
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 text-sm justify-start text-left font-normal",
                  !passedYearMax && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {passedYearMax || "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  passedYearMax
                    ? new Date(parseInt(passedYearMax), 0, 1)
                    : undefined
                }
                onSelect={(date) => {
                  if (date) {
                    onPassedYearMaxChange(date.getFullYear().toString());
                  } else {
                    onPassedYearMaxChange("");
                  }
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
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

