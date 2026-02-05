"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import {
  WorkInterestForm,
  type WorkInterestFormData,
} from "@/components/jobs/work-interests";
import {
  createSkill,
  createWorkInterest,
  getSkills,
  type WorkInterestSkill,
} from "@/services/workInterests";
import { getLocations, getUnitGroups } from "@/services/jobs";
import type { UnitGroup } from "@/types/unit-groups";
import type { Location } from "@/types/auth";
import type { CreateWorkInterestPayload } from "@/services/workInterests";
import { toast } from "@/hooks/use-toast";

const initialFormData: WorkInterestFormData = {
  name: "",
  email: "",
  phone: "",
  title: "",
  summary: "",
  unit_group: "",
  proficiency_level: "Intermediate",
  availability: "Full Time",
  preferred_locations: [],
  skills: [],
};

export default function CreateWorkInterestPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [unitGroups, setUnitGroups] = useState<UnitGroup[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] =
    useState<WorkInterestFormData>(initialFormData);
  const [skillSuggestions, setSkillSuggestions] = useState<WorkInterestSkill[]>(
    [],
  );
  const [skillIdToName, setSkillIdToName] = useState<Map<number, string>>(
    new Map(),
  );
  const [unitGroupsForForm, setUnitGroupsForForm] = useState<UnitGroup[]>([]);
  const [groupedUnitGroupsForForm, setGroupedUnitGroupsForForm] = useState<
    Record<string, UnitGroup[]>
  >({});

  const [unitGroupSearchInput, setUnitGroupSearchInput] = useState("");
  const [unitGroupComboboxOpen, setUnitGroupComboboxOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skillsComboboxOpen, setSkillsComboboxOpen] = useState(false);

  const [isLoadingUnitGroups, setIsLoadingUnitGroups] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const debouncedUnitGroupSearch = useDebounce(unitGroupSearchInput, 300);
  const debouncedSkillSearch = useDebounce(skillInput, 300);

  // Require authentication similar to /jobs/create
  useEffect(() => {
    if (authLoading) return;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!user && !token) {
      setAuthDialogOpen(true);
    }
  }, [user, authLoading]);

  // Load initial unit groups & locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groups, locs] = await Promise.all([
          getUnitGroups(),
          getLocations(),
        ]);
        setUnitGroups(groups);
        setLocations(locs);
        setUnitGroupsForForm(groups);

        const grouped: Record<string, UnitGroup[]> = {};
        groups.forEach((ug) => {
          const major = ug.minor_group?.sub_major_group?.major_group;
          if (!major) return;
          if (!grouped[major.title]) grouped[major.title] = [];
          grouped[major.title].push(ug);
        });
        setGroupedUnitGroupsForForm(grouped);
      } catch (err) {
        console.warn("Failed to load unit groups/locations", err);
      }
    };
    void fetchData();
  }, []);

  // Fetch unit groups for combobox search
  useEffect(() => {
    if (!unitGroupComboboxOpen) return;
    const fetchUnitGroups = async () => {
      setIsLoadingUnitGroups(true);
      try {
        const data = await getUnitGroups(debouncedUnitGroupSearch || undefined);
        setUnitGroupsForForm(data);
        const grouped: Record<string, UnitGroup[]> = {};
        data.forEach((ug) => {
          const major = ug.minor_group?.sub_major_group?.major_group;
          if (!major) return;
          if (!grouped[major.title]) grouped[major.title] = [];
          grouped[major.title].push(ug);
        });
        setGroupedUnitGroupsForForm(grouped);
      } catch (err) {
        console.warn("Failed to fetch unit groups", err);
        setUnitGroupsForForm([]);
      } finally {
        setIsLoadingUnitGroups(false);
      }
    };
    void fetchUnitGroups();
  }, [unitGroupComboboxOpen, debouncedUnitGroupSearch]);

  // Fetch skills for combobox search
  useEffect(() => {
    if (!skillsComboboxOpen) return;
    const fetchSkills = async () => {
      setIsLoadingSkills(true);
      try {
        const data = await getSkills(debouncedSkillSearch || undefined);
        setSkillSuggestions(data);
      } catch (err) {
        console.warn("Failed to fetch skills", err);
        setSkillSuggestions([]);
      } finally {
        setIsLoadingSkills(false);
      }
    };
    void fetchSkills();
  }, [skillsComboboxOpen, debouncedSkillSearch]);

  // Add or create skill
  const addSkill = async (value: string | number) => {
    const skillLabel = String(value).trim();
    if (!skillLabel) return;

    const matched = skillSuggestions.find(
      (s) =>
        s.name.toLowerCase() === skillLabel.toLowerCase() ||
        s.id === Number(skillLabel),
    );

    let chosen = matched;

    if (!matched) {
      try {
        setIsCreatingSkill(true);
        const created = await createSkill(skillLabel);
        setSkillSuggestions((prev) =>
          prev.find((s) => s.id === created.id) ? prev : [...prev, created],
        );
        chosen = created;
      } catch (err) {
        console.error("Failed to create skill", err);
        toast({
          title: "Could not create skill",
          description: "Please try again or pick an existing skill.",
          variant: "destructive",
        });
        setIsCreatingSkill(false);
        return;
      } finally {
        setIsCreatingSkill(false);
      }
    }

    setSkillIdToName((prev) => new Map(prev).set(chosen!.id, chosen!.name));
    setFormData((prev) => {
      if (prev.skills.includes(chosen!.id)) return prev;
      return { ...prev, skills: [...prev.skills, chosen!.id] };
    });
    setSkillInput("");
  };

  const handleSubmit = async (payload: CreateWorkInterestPayload) => {
    setIsSubmitting(true);
    try {
      await createWorkInterest(payload);
      toast({
        title: "Work interest posted",
        description:
          "Your work interest has been published for employers to see.",
      });
      router.push("/jobs/work-interests");
    } catch (err) {
      console.error("Failed to create work interest", err);
      toast({
        title: "Could not save",
        description: "Please review the form and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <WorkInterestForm
          formData={formData}
          setFormData={setFormData}
          locations={locations}
          unitGroups={unitGroups}
          unitGroupsForForm={unitGroupsForForm}
          groupedUnitGroupsForForm={groupedUnitGroupsForForm}
          skillSuggestions={skillSuggestions}
          skillNameById={skillIdToName}
          unitGroupSearchInput={unitGroupSearchInput}
          setUnitGroupSearchInput={setUnitGroupSearchInput}
          unitGroupComboboxOpen={unitGroupComboboxOpen}
          setUnitGroupComboboxOpen={setUnitGroupComboboxOpen}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          skillsComboboxOpen={skillsComboboxOpen}
          setSkillsComboboxOpen={setSkillsComboboxOpen}
          isLoadingUnitGroups={isLoadingUnitGroups}
          isLoadingSkills={isLoadingSkills}
          isSubmitting={isSubmitting}
          isCreatingSkill={isCreatingSkill}
          onAddSkill={addSkill}
          onSubmit={handleSubmit}
        />
      </div>
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        initialMode="login"
        returnTo="/jobs/work-interests/create"
      />
    </>
  );
}

