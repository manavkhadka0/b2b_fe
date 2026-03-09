"use client";

import { Loader2, Check, ChevronsUpDown, Search } from "lucide-react";
import { useState, useEffect } from "react";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
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
import type {
  AvailabilityOption,
  CreateWorkInterestPayload,
  ProficiencyLevel,
  WorkInterestSkill,
} from "@/services/workInterests";
import type {
  UnitGroup,
  MajorGroup,
  SubMajorGroup,
  MinorGroup,
} from "@/types/unit-groups";
import {
  getMajorGroups,
  getSubMajorGroups,
  getMinorGroups,
  getUnitGroups,
  searchGroups,
} from "@/services/jobs";
import { useDebounce } from "@/hooks/use-debounce";
import { SkillsSelect } from "./SkillsSelect";
import { toast } from "@/hooks/use-toast";

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

const workInterestPayloadSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(5, "Phone must be at least 5 characters"),
  title: z
    .string()
    .trim()
    .min(3, "Desired title must be at least 3 characters"),
  summary: z.string().trim().min(10, "Summary must be at least 10 characters"),
  unit_group: z.number().int().positive("Unit group is required"),
  proficiency_level: z.enum(["Beginner", "Intermediate", "Expert"], {
    required_error: "Proficiency level is required",
  }),
  availability: z.enum(["Full Time", "Part Time", "Internship", "Freelance"], {
    required_error: "Availability is required",
  }),
  preferred_locations: z.string().optional(),
  skills: z.array(z.number()).min(1, "Please select at least one skill"),
});

export interface WorkInterestFormData {
  name: string;
  email: string;
  phone: string;
  title: string;
  summary: string;
  unit_group: string;
  proficiency_level: ProficiencyLevel;
  availability: AvailabilityOption;
  preferred_locations: string;
  skills: number[];
}

interface WorkInterestFormProps {
  formData: WorkInterestFormData;
  setFormData: React.Dispatch<React.SetStateAction<WorkInterestFormData>>;
  skillSuggestions: WorkInterestSkill[];
  skillNameById: Map<number, string>;
  skillInput: string;
  setSkillInput: (v: string) => void;
  skillsComboboxOpen: boolean;
  setSkillsComboboxOpen: (v: boolean) => void;
  isLoadingSkills: boolean;
  isSubmitting: boolean;
  isCreatingSkill: boolean;
  onAddSkill: (value: string | number) => void;
  onSubmit: (payload: CreateWorkInterestPayload) => Promise<void>;
}

export function WorkInterestForm({
  formData,
  setFormData,
  skillSuggestions,
  skillNameById,
  skillInput,
  setSkillInput,
  skillsComboboxOpen,
  setSkillsComboboxOpen,
  isLoadingSkills,
  isSubmitting,
  isCreatingSkill,
  onAddSkill,
  onSubmit,
}: WorkInterestFormProps) {
  type FormErrors = Partial<
    Record<keyof WorkInterestFormData | "form", string>
  >;
  const [errors, setErrors] = useState<FormErrors>({});

  // Cascade state for occupation hierarchy (Major → Sub-Major → Minor → Unit Group)
  const [majorGroupCode, setMajorGroupCode] = useState<string>("");
  const [subMajorGroupCode, setSubMajorGroupCode] = useState<string>("");
  const [minorGroupCode, setMinorGroupCode] = useState<string>("");

  const [majorGroupSearch, setMajorGroupSearch] = useState("");
  const [subMajorGroupSearch, setSubMajorGroupSearch] = useState("");
  const [minorGroupSearch, setMinorGroupSearch] = useState("");
  const [unitGroupSearch, setUnitGroupSearch] = useState("");

  const debouncedMajorSearch = useDebounce(majorGroupSearch, 300);
  const debouncedSubMajorSearch = useDebounce(subMajorGroupSearch, 300);
  const debouncedMinorSearch = useDebounce(minorGroupSearch, 300);
  const debouncedUnitSearch = useDebounce(unitGroupSearch, 300);

  const [majorGroups, setMajorGroups] = useState<MajorGroup[]>([]);
  const [subMajorGroups, setSubMajorGroups] = useState<SubMajorGroup[]>([]);
  const [minorGroups, setMinorGroups] = useState<MinorGroup[]>([]);
  const [unitGroupsForForm, setUnitGroupsForForm] = useState<UnitGroup[]>([]);

  const [isLoadingMajor, setIsLoadingMajor] = useState(false);
  const [isLoadingSubMajor, setIsLoadingSubMajor] = useState(false);
  const [isLoadingMinor, setIsLoadingMinor] = useState(false);
  const [isLoadingUnit, setIsLoadingUnit] = useState(false);

  const [majorOpen, setMajorOpen] = useState(false);
  const [subMajorOpen, setSubMajorOpen] = useState(false);
  const [minorOpen, setMinorOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);

  // Search groups (unified search across all levels)
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [groupSearchOpen, setGroupSearchOpen] = useState(false);
  const [groupSearchResults, setGroupSearchResults] = useState<{
    major_groups: Array<{ code: string; title: string }>;
    sub_major_groups: Array<{ code: string; title: string }>;
    minor_groups: Array<{ code: string; title: string }>;
    unit_groups: Array<{ code: string; title: string }>;
  } | null>(null);
  const [loadingGroupSearch, setLoadingGroupSearch] = useState(false);
  const debouncedGroupSearch = useDebounce(groupSearchQuery, 300);

  // Fetch major groups when dropdown opens
  useEffect(() => {
    if (!majorOpen) return;
    const fetch = async () => {
      setIsLoadingMajor(true);
      try {
        const data = await getMajorGroups(debouncedMajorSearch || undefined);
        setMajorGroups(data);
      } catch {
        setMajorGroups([]);
      } finally {
        setIsLoadingMajor(false);
      }
    };
    void fetch();
  }, [majorOpen, debouncedMajorSearch]);

  // Fetch sub-major groups when major is selected and dropdown opens
  useEffect(() => {
    if (!subMajorOpen || !majorGroupCode) return;
    const fetch = async () => {
      setIsLoadingSubMajor(true);
      try {
        const data = await getSubMajorGroups(
          majorGroupCode,
          debouncedSubMajorSearch || undefined,
        );
        setSubMajorGroups(data);
      } catch {
        setSubMajorGroups([]);
      } finally {
        setIsLoadingSubMajor(false);
      }
    };
    void fetch();
  }, [subMajorOpen, majorGroupCode, debouncedSubMajorSearch]);

  // Fetch minor groups when sub-major is selected and dropdown opens
  useEffect(() => {
    if (!minorOpen || !subMajorGroupCode) return;
    const fetch = async () => {
      setIsLoadingMinor(true);
      try {
        const data = await getMinorGroups(
          subMajorGroupCode,
          debouncedMinorSearch || undefined,
        );
        setMinorGroups(data);
      } catch {
        setMinorGroups([]);
      } finally {
        setIsLoadingMinor(false);
      }
    };
    void fetch();
  }, [minorOpen, subMajorGroupCode, debouncedMinorSearch]);

  // Fetch unit groups when minor is selected and dropdown opens
  useEffect(() => {
    if (!unitOpen || !minorGroupCode) return;
    const fetch = async () => {
      setIsLoadingUnit(true);
      try {
        const data = await getUnitGroups(
          debouncedUnitSearch || undefined,
          minorGroupCode,
        );
        setUnitGroupsForForm(data);
      } catch {
        setUnitGroupsForForm([]);
      } finally {
        setIsLoadingUnit(false);
      }
    };
    void fetch();
  }, [unitOpen, minorGroupCode, debouncedUnitSearch]);

  // Search groups when dropdown opens and user types
  useEffect(() => {
    if (!groupSearchOpen || !debouncedGroupSearch?.trim()) {
      setGroupSearchResults(null);
      return;
    }
    let cancelled = false;
    setLoadingGroupSearch(true);
    searchGroups(debouncedGroupSearch)
      .then((data) => {
        if (!cancelled && data) setGroupSearchResults(data.results);
        else if (!cancelled) setGroupSearchResults(null);
      })
      .catch(() => {
        if (!cancelled) setGroupSearchResults(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingGroupSearch(false);
      });
    return () => {
      cancelled = true;
    };
  }, [groupSearchOpen, debouncedGroupSearch]);

  const selectedMajor = majorGroups.find((g) => g.code === majorGroupCode);
  const selectedSubMajor = subMajorGroups.find(
    (g) => g.code === subMajorGroupCode,
  );
  const selectedMinor = minorGroups.find((g) => g.code === minorGroupCode);
  const selectedUnit = unitGroupsForForm.find(
    (g) => String(g.id) === formData.unit_group,
  );

  const handleMajorSelect = (code: string) => {
    setMajorGroupCode(code);
    setSubMajorGroupCode("");
    setMinorGroupCode("");
    setFormData((prev) => ({ ...prev, unit_group: "" }));
    setSubMajorGroupSearch("");
    setMinorGroupSearch("");
    setUnitGroupSearch("");
  };

  const handleSubMajorSelect = (code: string) => {
    setSubMajorGroupCode(code);
    setMinorGroupCode("");
    setFormData((prev) => ({ ...prev, unit_group: "" }));
    setMinorGroupSearch("");
    setUnitGroupSearch("");
  };

  const handleMinorSelect = (code: string) => {
    setMinorGroupCode(code);
    setFormData((prev) => ({ ...prev, unit_group: "" }));
    setUnitGroupSearch("");
  };

  const handleGroupSearchSelect = async (
    type: "major" | "sub_major" | "minor" | "unit",
    code: string,
    title: string,
  ) => {
    if (type === "major") {
      setMajorGroupCode(code);
      setSubMajorGroupCode("");
      setMinorGroupCode("");
      setFormData((prev) => ({ ...prev, unit_group: "" }));
      setSubMajorGroupSearch("");
      setMinorGroupSearch("");
      setUnitGroupSearch("");
      setMajorGroups((prev) => {
        if (prev.some((g) => g.code === code)) return prev;
        return [
          ...prev,
          { id: 0, code, title, slug: "", description: "" } as MajorGroup,
        ];
      });
    } else if (type === "unit") {
      try {
        const units = await getUnitGroups(code);
        const unit = units.find((u) => u.code === code);
        if (unit?.minor_group) {
          const major = unit.minor_group.sub_major_group.major_group;
          const subMajor = unit.minor_group.sub_major_group;
          const minor = unit.minor_group;
          setMajorGroupCode(major.code);
          setSubMajorGroupCode(subMajor.code);
          setMinorGroupCode(minor.code);
          setFormData((prev) => ({ ...prev, unit_group: String(unit.id) }));
          setMajorGroups((prev) =>
            prev.some((g) => g.code === major.code)
              ? prev
              : [...prev, major],
          );
          setSubMajorGroups([subMajor]);
          setMinorGroups([minor]);
          setUnitGroupsForForm([unit]);
        }
      } catch {
        // Fallback: cannot resolve hierarchy
      }
    } else if (type === "sub_major" || type === "minor") {
      try {
        const units = await getUnitGroups(code);
        const unit = units.find((u) => {
          if (type === "sub_major")
            return u.minor_group?.sub_major_group?.code === code;
          return u.minor_group?.code === code;
        });
        if (unit?.minor_group) {
          const major = unit.minor_group.sub_major_group.major_group;
          const subMajor = unit.minor_group.sub_major_group;
          const minor = unit.minor_group;
          setMajorGroupCode(major.code);
          setSubMajorGroupCode(subMajor.code);
          setMinorGroupCode(minor.code);
          setFormData((prev) => ({ ...prev, unit_group: "" }));
          setMajorGroups((prev) =>
            prev.some((g) => g.code === major.code)
              ? prev
              : [...prev, major],
          );
          setSubMajorGroups([subMajor]);
          setMinorGroups([minor]);
          if (type === "minor") {
            const minorUnits = await getUnitGroups(undefined, minor.code);
            setUnitGroupsForForm(minorUnits);
          } else {
            setUnitGroupsForForm([]);
          }
        }
      } catch {
        // Can't resolve hierarchy
      }
    }
    setGroupSearchOpen(false);
    setGroupSearchQuery("");
    setGroupSearchResults(null);
  };

  const removeSkill = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateWorkInterestPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      title: formData.title.trim(),
      summary: formData.summary.trim(),
      unit_group: Number(formData.unit_group),
      proficiency_level: formData.proficiency_level,
      availability: formData.availability,
      preferred_locations: formData.preferred_locations?.trim() || undefined,
      skills: formData.skills.length > 0 ? formData.skills : undefined,
    };
    try {
      setErrors({});
      const validated = workInterestPayloadSchema.parse(payload);
      await onSubmit(validated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        for (const issue of err.errors) {
          const field = issue.path[0];
          if (
            typeof field === "string" &&
            !fieldErrors[field as keyof FormErrors]
          ) {
            fieldErrors[field as keyof FormErrors] = issue.message;
          }
        }
        setErrors(fieldErrors);
        const message =
          err.errors[0]?.message ?? "Please check the form fields.";
        toast({
          title: "Could not submit interest",
          description: message,
          variant: "destructive",
        });
        return;
      }
      throw err;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Full Name
          </label>
          <Input
            placeholder="Your name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className={
              errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className={
              errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <Input
            placeholder="Your phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className={
              errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Desired Title *
          </label>
          <Input
            placeholder="e.g. Web Developer, Electrician"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className={
              errors.title ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Preferred Locations (optional)
        </label>
        <Input
          placeholder="e.g., Kathmandu, Lalitpur, Morang"
          value={formData.preferred_locations}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              preferred_locations: e.target.value,
            }))
          }
          className={
            errors.preferred_locations
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
        />
      </div>

      {/* Occupation Classification - Major → Sub-Major → Minor → Unit Group */}
      <div className="space-y-2">
        <label
          className={`text-sm font-medium ${
            errors.unit_group ? "text-red-600" : "text-slate-700"
          }`}
        >
          Occupation Classification *
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Search by occupation or code, or select from Major Group → Sub-Major
          → Minor → Unit Group
        </p>
        {/* Search groups - unified search with auto-fill */}
        <div className="mb-4">
          <Popover
            open={groupSearchOpen}
            onOpenChange={(o) => {
              setGroupSearchOpen(o);
              if (!o) {
                setGroupSearchQuery("");
                setGroupSearchResults(null);
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start font-normal h-9 border-slate-200 text-sm text-left"
              >
                <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-500" />
                <span className="truncate text-slate-500">
                  {groupSearchQuery || "Search by occupation or code..."}
                </span>
                <ChevronsUpDown className="ml-auto h-3.5 w-3.5 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search by occupation or code..."
                  value={groupSearchQuery}
                  onValueChange={setGroupSearchQuery}
                />
                <CommandList>
                  {loadingGroupSearch && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    </div>
                  )}
                  {!loadingGroupSearch && groupSearchResults && (
                    <>
                      {groupSearchResults.major_groups.length === 0 &&
                        groupSearchResults.sub_major_groups.length === 0 &&
                        groupSearchResults.minor_groups.length === 0 &&
                        groupSearchResults.unit_groups.length === 0 && (
                          <div className="py-4 text-center text-sm text-slate-500">
                            No groups found.
                          </div>
                        )}
                      {groupSearchResults.major_groups.length > 0 && (
                        <CommandGroup heading="Major groups">
                          {groupSearchResults.major_groups.map((g) => (
                            <CommandItem
                              key={`major-${g.code}`}
                              value={g.code}
                              onSelect={() =>
                                handleGroupSearchSelect("major", g.code, g.title)
                              }
                            >
                              <span className="truncate">{g.title}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                      {groupSearchResults.sub_major_groups.length > 0 && (
                        <CommandGroup heading="Sub-major groups">
                          {groupSearchResults.sub_major_groups.map((g) => (
                            <CommandItem
                              key={`sub-${g.code}`}
                              value={g.code}
                              onSelect={() =>
                                handleGroupSearchSelect(
                                  "sub_major",
                                  g.code,
                                  g.title,
                                )
                              }
                            >
                              <span className="truncate">{g.title}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                      {groupSearchResults.minor_groups.length > 0 && (
                        <CommandGroup heading="Minor groups">
                          {groupSearchResults.minor_groups.map((g) => (
                            <CommandItem
                              key={`minor-${g.code}`}
                              value={g.code}
                              onSelect={() =>
                                handleGroupSearchSelect(
                                  "minor",
                                  g.code,
                                  g.title,
                                )
                              }
                            >
                              <span className="truncate">{g.title}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                      {groupSearchResults.unit_groups.length > 0 && (
                        <CommandGroup heading="Unit groups">
                          {groupSearchResults.unit_groups.map((g) => (
                            <CommandItem
                              key={`unit-${g.code}`}
                              value={g.code}
                              onSelect={() =>
                                handleGroupSearchSelect(
                                  "unit",
                                  g.code,
                                  g.title,
                                )
                              }
                            >
                              <span className="truncate">{g.title}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </>
                  )}
                  {!loadingGroupSearch &&
                    !groupSearchResults &&
                    debouncedGroupSearch?.trim() && (
                      <div className="py-4 text-center text-sm text-slate-500">
                        Type to search groups...
                      </div>
                    )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Major Group */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Major Group
            </label>
            <Popover
              open={majorOpen}
              onOpenChange={(open) => {
                setMajorOpen(open);
                if (!open) setMajorGroupSearch("");
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between border-slate-200 min-w-0",
                    !majorGroupCode && "text-muted-foreground",
                  )}
                >
                  <span className="min-w-0 truncate">
                    {selectedMajor?.title ?? "Select major group"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search major group..."
                    value={majorGroupSearch}
                    onValueChange={setMajorGroupSearch}
                  />
                  <CommandList>
                    {isLoadingMajor ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No major group found.</CommandEmpty>
                        <CommandGroup>
                          {majorGroups.map((g) => (
                            <CommandItem
                              key={g.code}
                              value={g.code}
                              onSelect={() => {
                                handleMajorSelect(g.code);
                                setMajorOpen(false);
                              }}
                            >
                              <span className="min-w-0 truncate">{g.title}</span>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  g.code === majorGroupCode
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

          {/* Sub-Major Group */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Sub-Major Group
            </label>
            <Popover
              open={subMajorOpen}
              onOpenChange={(open) => {
                setSubMajorOpen(open);
                if (!open) setSubMajorGroupSearch("");
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={!majorGroupCode}
                  className={cn(
                    "w-full justify-between border-slate-200 min-w-0",
                    !subMajorGroupCode && "text-muted-foreground",
                  )}
                >
                  <span className="min-w-0 truncate">
                    {selectedSubMajor?.title ?? "Select sub-major group"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search sub-major group..."
                    value={subMajorGroupSearch}
                    onValueChange={setSubMajorGroupSearch}
                  />
                  <CommandList>
                    {isLoadingSubMajor ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No sub-major group found.</CommandEmpty>
                        <CommandGroup>
                          {subMajorGroups.map((g) => (
                            <CommandItem
                              key={g.code}
                              value={g.code}
                              onSelect={() => {
                                handleSubMajorSelect(g.code);
                                setSubMajorOpen(false);
                              }}
                            >
                              <span className="min-w-0 truncate">{g.title}</span>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  g.code === subMajorGroupCode
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

          {/* Minor Group */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Minor Group
            </label>
            <Popover
              open={minorOpen}
              onOpenChange={(open) => {
                setMinorOpen(open);
                if (!open) setMinorGroupSearch("");
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={!subMajorGroupCode}
                  className={cn(
                    "w-full justify-between border-slate-200 min-w-0",
                    !minorGroupCode && "text-muted-foreground",
                  )}
                >
                  <span className="min-w-0 truncate">
                    {selectedMinor?.title ?? "Select minor group"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search minor group..."
                    value={minorGroupSearch}
                    onValueChange={setMinorGroupSearch}
                  />
                  <CommandList>
                    {isLoadingMinor ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No minor group found.</CommandEmpty>
                        <CommandGroup>
                          {minorGroups.map((g) => (
                            <CommandItem
                              key={g.code}
                              value={g.code}
                              onSelect={() => {
                                handleMinorSelect(g.code);
                                setMinorOpen(false);
                              }}
                            >
                              <span className="min-w-0 truncate">{g.title}</span>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  g.code === minorGroupCode
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

          {/* Unit Group */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Unit Group *
            </label>
            <Popover
              open={unitOpen}
              onOpenChange={(open) => {
                setUnitOpen(open);
                if (!open) setUnitGroupSearch("");
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={!minorGroupCode}
                  className={cn(
                    "w-full justify-between border-slate-200 min-w-0",
                    !formData.unit_group && "text-muted-foreground",
                  )}
                >
                  <span className="min-w-0 truncate">
                    {selectedUnit?.title ?? "Select unit group"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search unit group..."
                    value={unitGroupSearch}
                    onValueChange={setUnitGroupSearch}
                  />
                  <CommandList>
                    {isLoadingUnit ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No unit group found.</CommandEmpty>
                        <CommandGroup>
                          {unitGroupsForForm.map((g) => (
                            <CommandItem
                              key={g.code}
                              value={g.code}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  unit_group: String(g.id),
                                }));
                                setUnitOpen(false);
                              }}
                            >
                              <span className="min-w-0 truncate">{g.title}</span>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  String(g.id) === formData.unit_group
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
            {errors.unit_group && (
              <p className="text-xs text-red-500">{errors.unit_group}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Proficiency *
          </label>
          <Select
            value={formData.proficiency_level}
            onValueChange={(v) =>
              setFormData((prev) => ({
                ...prev,
                proficiency_level: v as ProficiencyLevel,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {PROFICIENCY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Availability *
          </label>
          <Select
            value={formData.availability}
            onValueChange={(v) =>
              setFormData((prev) => ({
                ...prev,
                availability: v as AvailabilityOption,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Summary</label>
        <MinimalTiptapEditor
          value={formData.summary}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              summary:
                typeof value === "string" ? value : JSON.stringify(value),
            }))
          }
          className={`min-h-[160px] border rounded-md ${
            errors.summary ? "border-red-500" : "border-slate-200"
          }`}
          editorContentClassName="p-4"
          output="html"
          placeholder="Describe your interest and expertise..."
          autofocus={false}
          editable={true}
          editorClassName="focus:outline-none prose prose-sm dark:prose-invert max-w-none"
        />
        {errors.summary && (
          <p className="text-xs text-red-500">{errors.summary}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Skills</label>
          <p className="text-xs text-slate-500">
            Search and select, or create new
          </p>
        </div>
        <SkillsSelect
          selectedIds={formData.skills}
          skillSuggestions={skillSuggestions}
          skillNameById={skillNameById}
          searchInput={skillInput}
          onSearchInputChange={setSkillInput}
          open={skillsComboboxOpen}
          onOpenChange={setSkillsComboboxOpen}
          isLoading={isLoadingSkills}
          isCreatingSkill={isCreatingSkill}
          onAddSkill={onAddSkill}
          onRemoveSkill={removeSkill}
        />
        {errors.skills && (
          <p className="text-xs text-red-500">{errors.skills}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
            </>
          ) : (
            "Submit interest"
          )}
        </Button>
      </div>
    </form>
  );
}
