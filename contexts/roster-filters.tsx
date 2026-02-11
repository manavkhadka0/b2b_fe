"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type {
  CertifyingAgency,
  JobStatus,
  LevelCompleted,
} from "@/types/graduate-roster";

type RosterFiltersContextValue = {
  tradeStream: string;
  setTradeStream: (value: string) => void;
  level: LevelCompleted | "";
  setLevel: (value: LevelCompleted | "") => void;
  passedYearMin: string;
  setPassedYearMin: (value: string) => void;
  passedYearMax: string;
  setPassedYearMax: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  municipality: string;
  setMunicipality: (value: string) => void;
  status: JobStatus | "";
  setStatus: (value: JobStatus | "") => void;
  certifyingAgency: CertifyingAgency | "";
  setCertifyingAgency: (value: CertifyingAgency | "") => void;
  institutionName: string;
  setInstitutionName: (value: string) => void;
};

const RosterFiltersContext =
  createContext<RosterFiltersContextValue | null>(null);

export function RosterFiltersProvider({ children }: { children: ReactNode }) {
  const [tradeStream, setTradeStream] = useState("");
  const [level, setLevel] = useState<LevelCompleted | "">("");
  const [passedYearMin, setPassedYearMin] = useState("");
  const [passedYearMax, setPassedYearMax] = useState("");
  const [district, setDistrict] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [status, setStatus] = useState<JobStatus | "">("");
  const [certifyingAgency, setCertifyingAgency] =
    useState<CertifyingAgency | "">("");
  const [institutionName, setInstitutionName] = useState("");

  return (
    <RosterFiltersContext.Provider
      value={{
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
      }}
    >
      {children}
    </RosterFiltersContext.Provider>
  );
}

export function useRosterFilters() {
  const ctx = useContext(RosterFiltersContext);
  if (!ctx) {
    throw new Error(
      "useRosterFilters must be used within a RosterFiltersProvider",
    );
  }
  return ctx;
}

