"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type {
  AvailabilityOption,
  ProficiencyLevel,
} from "@/services/workInterests";

type WorkInterestsFiltersContextValue = {
  search: string;
  setSearch: (value: string) => void;
  availability: AvailabilityOption | "";
  setAvailability: (value: AvailabilityOption | "") => void;
  proficiency: ProficiencyLevel | "";
  setProficiency: (value: ProficiencyLevel | "") => void;
};

const WorkInterestsFiltersContext =
  createContext<WorkInterestsFiltersContextValue | null>(null);

export function WorkInterestsFiltersProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState<AvailabilityOption | "">(
    "",
  );
  const [proficiency, setProficiency] = useState<ProficiencyLevel | "">("");

  return (
    <WorkInterestsFiltersContext.Provider
      value={{
        search,
        setSearch,
        availability,
        setAvailability,
        proficiency,
        setProficiency,
      }}
    >
      {children}
    </WorkInterestsFiltersContext.Provider>
  );
}

export function useWorkInterestsFilters() {
  const ctx = useContext(WorkInterestsFiltersContext);
  if (!ctx) {
    throw new Error(
      "useWorkInterestsFilters must be used within a WorkInterestsFiltersProvider",
    );
  }
  return ctx;
}

