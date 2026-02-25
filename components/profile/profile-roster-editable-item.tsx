"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import type {
  GraduateRoster,
  CreateGraduateRosterPayload,
  LevelCompleted,
  CertifyingAgency,
  JobStatus,
} from "@/types/graduate-roster";
import {
  LEVEL_COMPLETED_CHOICES,
  CERTIFYING_AGENCY_CHOICES,
  JOB_STATUS_CHOICES,
} from "@/types/graduate-roster";
import {
  getProvinces,
  getDistricts,
  getMunicipalities,
} from "@manavkhadka0/nepal-address";
import { updateGraduate } from "@/services/graduates";
import { toast } from "sonner";

interface ProfileRosterEditableItemProps {
  graduate: GraduateRoster;
  onUpdate: (updated: GraduateRoster) => void;
  onDelete: (graduate: GraduateRoster) => void;
  deletingId: number | null;
}

const GENDER_OPTIONS = ["Male", "Female", "Other"];

function hasValue<T>(v: T | null | undefined): v is T {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (typeof v === "number") return true;
  return true;
}

export function ProfileRosterEditableItem({
  graduate,
  onUpdate,
  onDelete,
  deletingId,
}: ProfileRosterEditableItemProps) {
  const [draft, setDraft] = useState<Partial<CreateGraduateRosterPayload>>({});
  const [saving, setSaving] = useState(false);

  const provinces = getProvinces();
  const permanentProvince = draft.permanent_province ?? graduate.permanent_province ?? "";
  const permanentDistrict = draft.permanent_district ?? graduate.permanent_district ?? "";
  const districts = permanentProvince ? getDistricts(permanentProvince) : [];
  const municipalities = permanentDistrict ? getMunicipalities(permanentDistrict) : [];

  // Include current values in options if not in list (API may use different format)
  const provinceOptions = permanentProvince && !(provinces as readonly string[]).includes(permanentProvince)
    ? [permanentProvince, ...provinces]
    : provinces;
  const districtOptions = permanentDistrict && permanentDistrict.trim() && !districts.includes(permanentDistrict)
    ? [permanentDistrict, ...districts]
    : districts;
  const currentMunicipality = draft.permanent_municipality ?? graduate.permanent_municipality ?? "";
  const municipalityOptions =
    currentMunicipality && !municipalities.includes(currentMunicipality)
      ? [currentMunicipality, ...municipalities]
      : municipalities;

  useEffect(() => {
    setDraft({
      name: graduate.name,
      phone_number: graduate.phone_number,
      email: graduate.email,
      gender: graduate.gender,
      date_of_birth: graduate.date_of_birth,
      permanent_province: graduate.permanent_province,
      permanent_district: graduate.permanent_district,
      permanent_municipality: graduate.permanent_municipality,
      permanent_ward: graduate.permanent_ward,
      level_completed: graduate.level_completed,
      subject_trade_stream: graduate.subject_trade_stream || undefined,
      specialization_key_skills: graduate.specialization_key_skills || undefined,
      passed_year: graduate.passed_year,
      certifying_agency: graduate.certifying_agency,
      certifying_agency_name: graduate.certifying_agency_name || undefined,
      certificate_id: graduate.certificate_id || undefined,
      job_status: graduate.job_status,
      available_from: graduate.available_from || undefined,
    });
  }, [graduate]);

  const updateField = <K extends keyof CreateGraduateRosterPayload>(
    key: K,
    value: CreateGraduateRosterPayload[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const payload: Partial<CreateGraduateRosterPayload> = {
      name: draft.name ?? graduate.name,
      phone_number: draft.phone_number ?? graduate.phone_number,
      email: draft.email ?? graduate.email,
      gender: draft.gender ?? graduate.gender,
      date_of_birth: draft.date_of_birth ?? graduate.date_of_birth,
      permanent_province: draft.permanent_province ?? graduate.permanent_province,
      permanent_district: draft.permanent_district ?? graduate.permanent_district,
      permanent_municipality:
        draft.permanent_municipality ?? graduate.permanent_municipality,
      permanent_ward: draft.permanent_ward ?? graduate.permanent_ward,
      level_completed: draft.level_completed ?? graduate.level_completed,
      subject_trade_stream: draft.subject_trade_stream ?? graduate.subject_trade_stream,
      specialization_key_skills:
        draft.specialization_key_skills ?? graduate.specialization_key_skills,
      passed_year: draft.passed_year ?? graduate.passed_year,
      certifying_agency: draft.certifying_agency ?? graduate.certifying_agency,
      certifying_agency_name:
        draft.certifying_agency_name ?? graduate.certifying_agency_name,
      certificate_id: draft.certificate_id ?? graduate.certificate_id,
      job_status: draft.job_status ?? graduate.job_status,
      available_from: draft.available_from ?? graduate.available_from,
    };

    setSaving(true);
    try {
      const updated = await updateGraduate(graduate.id, payload);
      onUpdate(updated);
      toast.success("Graduate updated.");
    } catch (err) {
      console.error("Failed to update graduate:", err);
      toast.error("Failed to update graduate.");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {children}
    </div>
  );

  const showName = hasValue(draft.name) || hasValue(graduate.name);
  const showPhone = hasValue(draft.phone_number) || hasValue(graduate.phone_number);
  const showEmail = hasValue(draft.email) || hasValue(graduate.email);
  const showGender = hasValue(draft.gender) || hasValue(graduate.gender);
  const showDob = hasValue(draft.date_of_birth) || hasValue(graduate.date_of_birth);
  const showProvince = hasValue(draft.permanent_province) || hasValue(graduate.permanent_province);
  const showDistrict = hasValue(draft.permanent_district) || hasValue(graduate.permanent_district);
  const showMunicipality =
    hasValue(draft.permanent_municipality) || hasValue(graduate.permanent_municipality);
  const showWard = hasValue(draft.permanent_ward) || hasValue(graduate.permanent_ward);
  const showLevel =
    hasValue(draft.level_completed) || hasValue(graduate.level_completed);
  const showSubject =
    hasValue(draft.subject_trade_stream) || hasValue(graduate.subject_trade_stream);
  const showSkills =
    hasValue(draft.specialization_key_skills) ||
    hasValue(graduate.specialization_key_skills);
  const showPassedYear =
    draft.passed_year != null || graduate.passed_year != null;
  const showCertifying =
    hasValue(draft.certifying_agency) || hasValue(graduate.certifying_agency);
  const showCertifyingName =
    hasValue(draft.certifying_agency_name) || hasValue(graduate.certifying_agency_name);
  const showCertId =
    hasValue(draft.certificate_id) || hasValue(graduate.certificate_id);
  const showJobStatus = hasValue(draft.job_status) || hasValue(graduate.job_status);
  const showAvailableFrom =
    hasValue(draft.available_from) || hasValue(graduate.available_from);
  const showInstitute = hasValue(graduate.institute_name);

  const hasEditableFields =
    showName ||
    showPhone ||
    showEmail ||
    showGender ||
    showDob ||
    showProvince ||
    showDistrict ||
    showMunicipality ||
    showWard ||
    showLevel ||
    showSubject ||
    showSkills ||
    showPassedYear ||
    showCertifying ||
    showCertifyingName ||
    showCertId ||
    showJobStatus ||
    showAvailableFrom;

  if (!hasEditableFields && !showInstitute) return null;

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {showName && (
          <Field label="Name">
            <Input
              value={draft.name ?? ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Full name"
            />
          </Field>
        )}
        {showPhone && (
          <Field label="Phone">
            <Input
              type="tel"
              value={draft.phone_number ?? ""}
              onChange={(e) => updateField("phone_number", e.target.value)}
              placeholder="98XXXXXXXX"
              maxLength={15}
            />
          </Field>
        )}
        {showEmail && (
          <Field label="Email">
            <Input
              type="email"
              value={draft.email ?? ""}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="email@example.com"
            />
          </Field>
        )}
        {showGender && (
          <Field label="Gender">
            <Select
              value={draft.gender ?? ""}
              onValueChange={(v) => updateField("gender", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        {showDob && (
          <Field label="Date of birth">
            <Input
              type="date"
              value={draft.date_of_birth ?? ""}
              onChange={(e) => updateField("date_of_birth", e.target.value)}
            />
          </Field>
        )}
        {showProvince && (
          <Field label="Province">
            <Select
              value={draft.permanent_province ?? ""}
              onValueChange={(v) => {
                updateField("permanent_province", v);
                updateField("permanent_district", "");
                updateField("permanent_municipality", "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinceOptions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        {showDistrict && (
          <Field label="District">
            <Select
              value={draft.permanent_district ?? ""}
              onValueChange={(v) => {
                updateField("permanent_district", v);
                updateField("permanent_municipality", "");
              }}
              disabled={!permanentProvince}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    permanentProvince ? "Select district" : "Select province first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {districtOptions.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        {showMunicipality && (
          <Field label="Municipality">
            <Select
              value={draft.permanent_municipality ?? ""}
              onValueChange={(v) => updateField("permanent_municipality", v)}
              disabled={!permanentDistrict}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    permanentDistrict
                      ? "Select municipality"
                      : "Select district first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {municipalityOptions.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        {showWard && (
          <Field label="Ward">
            <Input
              value={draft.permanent_ward ?? ""}
              onChange={(e) => updateField("permanent_ward", e.target.value)}
              placeholder="Ward"
            />
          </Field>
        )}
        {showLevel && (
          <Field label="Level completed">
            <Select
              value={draft.level_completed ?? ""}
              onValueChange={(v) =>
                updateField("level_completed", v as LevelCompleted | null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_COMPLETED_CHOICES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        {showSubject && (
          <Field label="Subject / Trade stream">
            <Input
              value={draft.subject_trade_stream ?? ""}
              onChange={(e) =>
                updateField("subject_trade_stream", e.target.value || undefined)
              }
              placeholder="Subject or trade"
            />
          </Field>
        )}
        {showPassedYear && (
          <Field label="Passed year">
            <Input
              type="number"
              value={draft.passed_year ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                updateField("passed_year", v ? Number(v) : null);
              }}
              placeholder="Year"
            />
          </Field>
        )}
        {showCertifying && (
          <Field label="Certifying agency">
            <Select
              value={draft.certifying_agency ?? ""}
              onValueChange={(v) =>
                updateField("certifying_agency", v as CertifyingAgency | null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {CERTIFYING_AGENCY_CHOICES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        {showCertifyingName && (
          <Field label="Certifying agency name">
            <Input
              value={draft.certifying_agency_name ?? ""}
              onChange={(e) =>
                updateField("certifying_agency_name", e.target.value || undefined)
              }
              placeholder="Agency name"
            />
          </Field>
        )}
        {showCertId && (
          <Field label="Certificate ID">
            <Input
              value={draft.certificate_id ?? ""}
              onChange={(e) =>
                updateField("certificate_id", e.target.value || undefined)
              }
              placeholder="Certificate ID"
            />
          </Field>
        )}
        {showJobStatus && (
          <Field label="Job status">
            <Select
              value={draft.job_status ?? ""}
              onValueChange={(v) =>
                updateField("job_status", v as JobStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {JOB_STATUS_CHOICES.map((j) => (
                  <SelectItem key={j} value={j}>
                    {j}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        {showAvailableFrom && (
          <Field label="Available from">
            <Input
              type="date"
              value={draft.available_from ?? ""}
              onChange={(e) =>
                updateField("available_from", e.target.value || undefined)
              }
              placeholder="Date"
            />
          </Field>
        )}
        </div>
        <div className="flex gap-1 shrink-0">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="shrink-0"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-600 shrink-0"
            onClick={() => onDelete(graduate)}
            disabled={deletingId === graduate.id}
            aria-label="Delete"
          >
            {deletingId === graduate.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {showSkills && (
        <Field label="Specialization / Key skills">
          <Textarea
            value={draft.specialization_key_skills ?? ""}
            onChange={(e) =>
              updateField("specialization_key_skills", e.target.value || undefined)
            }
            placeholder="Skills"
            rows={2}
            className="resize-none"
          />
        </Field>
      )}

      {showInstitute && (
        <div className="space-y-1.5 pt-2 border-t border-gray-100">
          <Label className="text-sm font-medium text-gray-500">Institute</Label>
          <p className="text-sm text-gray-700">{graduate.institute_name}</p>
        </div>
      )}
    </div>
  );
}
