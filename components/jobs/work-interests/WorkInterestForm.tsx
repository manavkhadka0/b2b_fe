"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import type {
  AvailabilityOption,
  CreateWorkInterestPayload,
  ProficiencyLevel,
  WorkInterestSkill,
} from "@/services/workInterests";
import type { UnitGroup } from "@/types/unit-groups";
import type { Location } from "@/types/auth";
import { LocationsSelect } from "./LocationsSelect";
import { UnitGroupSelect } from "./UnitGroupSelect";
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
  name: z
    .string()
    .trim()
    .min(2, "Full name is required"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(5, "Phone must be at least 5 characters"),
  title: z
    .string()
    .trim()
    .min(3, "Desired title must be at least 3 characters"),
  summary: z
    .string()
    .trim()
    .min(10, "Summary must be at least 10 characters"),
  unit_group: z
    .number()
    .int()
    .positive("Unit group is required"),
  proficiency_level: z.enum(["Beginner", "Intermediate", "Expert"], {
    required_error: "Proficiency level is required",
  }),
  availability: z.enum(
    ["Full Time", "Part Time", "Internship", "Freelance"],
    {
      required_error: "Availability is required",
    },
  ),
  // Only locations can be omitted
  preferred_locations: z.array(z.number()).optional(),
  skills: z
    .array(z.number())
    .min(1, "Please select at least one skill"),
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
  preferred_locations: number[];
  skills: number[];
}

interface WorkInterestFormProps {
  formData: WorkInterestFormData;
  setFormData: React.Dispatch<React.SetStateAction<WorkInterestFormData>>;
  locations: Location[];
  unitGroups: UnitGroup[];
  unitGroupsForForm: UnitGroup[];
  groupedUnitGroupsForForm: Record<string, UnitGroup[]>;
  skillSuggestions: WorkInterestSkill[];
  skillNameById: Map<number, string>;
  unitGroupSearchInput: string;
  setUnitGroupSearchInput: (v: string) => void;
  unitGroupComboboxOpen: boolean;
  setUnitGroupComboboxOpen: (v: boolean) => void;
  skillInput: string;
  setSkillInput: (v: string) => void;
  skillsComboboxOpen: boolean;
  setSkillsComboboxOpen: (v: boolean) => void;
  isLoadingUnitGroups: boolean;
  isLoadingSkills: boolean;
  isSubmitting: boolean;
  isCreatingSkill: boolean;
  onAddSkill: (value: string | number) => void;
  onSubmit: (payload: CreateWorkInterestPayload) => Promise<void>;
}

export function WorkInterestForm({
  formData,
  setFormData,
  locations,
  unitGroups,
  unitGroupsForForm,
  groupedUnitGroupsForForm,
  skillSuggestions,
  skillNameById,
  unitGroupSearchInput,
  setUnitGroupSearchInput,
  unitGroupComboboxOpen,
  setUnitGroupComboboxOpen,
  skillInput,
  setSkillInput,
  skillsComboboxOpen,
  setSkillsComboboxOpen,
  isLoadingUnitGroups,
  isLoadingSkills,
  isSubmitting,
  isCreatingSkill,
  onAddSkill,
  onSubmit,
}: WorkInterestFormProps) {
  type FormErrors = Partial<Record<keyof WorkInterestFormData | "form", string>>;
  const [errors, setErrors] = useState<FormErrors>({});
  const toggleLocation = (id: number) => {
    setFormData((prev) => {
      const exists = prev.preferred_locations.includes(id);
      return {
        ...prev,
        preferred_locations: exists
          ? prev.preferred_locations.filter((loc) => loc !== id)
          : [...prev.preferred_locations, id],
      };
    });
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
      preferred_locations:
        formData.preferred_locations.length > 0
          ? formData.preferred_locations
          : undefined,
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
          if (typeof field === "string" && !fieldErrors[field as keyof FormErrors]) {
            fieldErrors[field as keyof FormErrors] = issue.message;
          }
        }
        setErrors(fieldErrors);
        const message = err.errors[0]?.message ?? "Please check the form fields.";
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
          <label className="text-sm font-medium text-slate-700">Full Name</label>
          <Input
            placeholder="Your name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name}</p>
          )}
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
            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
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
            className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
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
            className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">
          Preferred Locations (optional)
        </label>
        <LocationsSelect
          selectedIds={formData.preferred_locations}
          onToggle={toggleLocation}
          locations={locations}
        />
        {formData.preferred_locations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.preferred_locations.map((id) => {
              const loc = locations.find((l) => l.id === id);
              if (!loc) return null;
              return (
                <Badge
                  key={id}
                  variant="outline"
                  className="flex items-center gap-1 bg-white border-slate-200"
                >
                  {loc.name}
                  <button
                    type="button"
                    onClick={() => toggleLocation(id)}
                    className="text-slate-400 hover:text-slate-700"
                    aria-label={`Remove ${loc.name}`}
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label
            className={`text-sm font-medium ${
              errors.unit_group ? "text-red-600" : "text-slate-700"
            }`}
          >
            Unit Group *
          </label>
          <UnitGroupSelect
            value={formData.unit_group}
            onChange={(v) => setFormData((prev) => ({ ...prev, unit_group: v }))}
            unitGroups={unitGroups}
            unitGroupsForForm={unitGroupsForForm}
            groupedUnitGroupsForForm={groupedUnitGroupsForForm}
            searchInput={unitGroupSearchInput}
            onSearchInputChange={setUnitGroupSearchInput}
            open={unitGroupComboboxOpen}
            onOpenChange={setUnitGroupComboboxOpen}
            isLoading={isLoadingUnitGroups}
          />
          {errors.unit_group && (
            <p className="text-xs text-red-500">{errors.unit_group}</p>
          )}
        </div>
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
