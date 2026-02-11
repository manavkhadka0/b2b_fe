"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle, type JobsViewMode } from "./ModeToggle";
import { JOBS_SIDEBAR } from "./jobs-sidebar-styles";
import { JOBS_QUICK_LINKS } from "./jobs-quick-links";
import { BrowseFilters } from "@/components/jobs/work-interests";
import { useWorkInterestsFilters } from "@/contexts/work-interests-filters";
import { RosterFilters } from "./roster/RosterFilters";
import { useRosterFilters } from "@/contexts/roster-filters";

export type JobsSidebarNavProps = {
  mode: JobsViewMode;
  onModeChange: (mode: JobsViewMode) => void;
};

export function JobsSidebarNav({ mode, onModeChange }: JobsSidebarNavProps) {
  const pathname = usePathname();
  const isRosterPage = pathname?.startsWith("/jobs/roster") ?? false;
  const { availability, setAvailability, proficiency, setProficiency } =
    useWorkInterestsFilters();
  const {
    tradeStream,
    setTradeStream,
    level,
    setLevel,
    passedYearMin,
    setPassedYearMin,
    passedYearMax,
    setPassedYearMax,
    district,
    setDistrict,
    municipality,
    setMunicipality,
    status,
    setStatus,
    certifyingAgency,
    setCertifyingAgency,
    institutionName,
    setInstitutionName,
  } = useRosterFilters();

  return (
    <div className="space-y-6">
      {/* Mode Toggle - matches JobsSidebarContent / View Mode section on /jobs */}
      <div className={JOBS_SIDEBAR.sectionBordered}>
        <h2 className={JOBS_SIDEBAR.sectionHeadingTight}>View Mode</h2>
        <ModeToggle mode={mode} onModeChange={onModeChange} />
      </div>

      {/* Quick Links - matches JobsSidebarContent Quick Links exactly */}
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

      {mode === "work-interests" && (
        <div className={JOBS_SIDEBAR.sectionBordered}>
          <h2 className={JOBS_SIDEBAR.sectionHeading}>Filters</h2>
          <BrowseFilters
            availability={availability}
            onAvailabilityChange={setAvailability}
            proficiency={proficiency}
            onProficiencyChange={setProficiency}
          />
        </div>
      )}

      {isRosterPage && (
        <div className={JOBS_SIDEBAR.sectionBordered}>
          <h2 className={JOBS_SIDEBAR.sectionHeading}>Filters</h2>
          <RosterFilters
            tradeStream={tradeStream}
            onTradeStreamChange={setTradeStream}
            level={level}
            onLevelChange={setLevel}
            passedYearMin={passedYearMin}
            onPassedYearMinChange={setPassedYearMin}
            passedYearMax={passedYearMax}
            onPassedYearMaxChange={setPassedYearMax}
            district={district}
            onDistrictChange={setDistrict}
            municipality={municipality}
            onMunicipalityChange={setMunicipality}
            status={status}
            onStatusChange={setStatus}
            certifyingAgency={certifyingAgency}
            onCertifyingAgencyChange={setCertifyingAgency}
            institutionName={institutionName}
            onInstitutionNameChange={setInstitutionName}
          />
        </div>
      )}
    </div>
  );
}
