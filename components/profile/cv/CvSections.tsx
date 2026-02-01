"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { CvSection } from "./CvSection";
import type {
  CvProfile,
  CvEducation,
  CvCareerHistory,
  CvCertification,
  CvSkill,
  CvAvailability,
} from "@/types/cv";
import {
  mapApiToCvProfile,
  updateJobseekerProfile,
  addEducation as apiAddEducation,
  deleteEducation as apiDeleteEducation,
  addCareerHistory as apiAddCareerHistory,
  deleteCareerHistory as apiDeleteCareerHistory,
  addCertification as apiAddCertification,
  deleteCertification as apiDeleteCertification,
  addSkill as apiAddSkill,
  deleteSkill as apiDeleteSkill,
} from "@/services/jobseeker";
import {
  GraduationCap,
  Briefcase,
  Building2,
  Award,
  Calendar,
  DollarSign,
  MapPin,
  Trash2,
} from "lucide-react";

let nextId = 1;
function generateId() {
  return Date.now() + nextId++;
}

const AVAILABILITY_OPTIONS: CvAvailability[] = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
];

const QUALIFICATION_OPTIONS = [
  "General Literate",
  "Below SLC",
  "+2",
  "Bachelors",
  "Master & above",
  "Pre-Diploma",
  "Diploma",
  "TLSC",
  "No Education",
];

interface CvSectionsProps {
  profile: CvProfile;
  onProfileUpdate: (profile: CvProfile) => void;
  username: string | null;
}

export function CvSections({
  profile,
  onProfileUpdate,
  username,
}: CvSectionsProps) {
  const [bioDraft, setBioDraft] = useState(profile.bio);
  const [savingBio, setSavingBio] = useState(false);
  useEffect(() => {
    setBioDraft(profile.bio);
  }, [profile.bio]);

  const handleSaveBio = async (onClose: () => void) => {
    if (username) {
      setSavingBio(true);
      try {
        const updated = await updateJobseekerProfile(username, {
          bio: bioDraft,
        });
        onProfileUpdate(mapApiToCvProfile(updated));
        toast.success("Profile updated successfully");
        onClose();
      } catch (err) {
        console.error(err);
        toast.error("Failed to update profile");
      } finally {
        setSavingBio(false);
      }
    } else {
      onProfileUpdate({ ...profile, bio: bioDraft });
      onClose();
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Personal Summary */}
      <CvSection
        title="Personal Summary"
        description="Introduce yourself to employers."
        actionText="Edit"
        actionIcon="edit"
        form={(onClose) => (
          <div className="space-y-4 pt-4">
            <h3 className="font-semibold text-gray-900">Edit summary</h3>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                placeholder="Tell us about yourself"
                className="min-h-[160px]"
              />
            </div>
            <Button
              className="w-full"
              disabled={savingBio}
              onClick={() => handleSaveBio(onClose)}
            >
              {savingBio ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      >
        {profile.bio ? (
          <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Add a personal summary to help employers learn more about you.
          </p>
        )}
      </CvSection>

      {/* Education */}
      <CvSection
        title="Education"
        description="Add your educational background."
        actionText="Add"
        form={(onClose) => (
          <EducationForm
            profile={profile}
            onProfileUpdate={onProfileUpdate}
            onClose={onClose}
            username={username}
          />
        )}
      >
        {profile.education.length > 0 ? (
          <ul className="space-y-3">
            {profile.education.map((edu) => (
              <li
                key={edu.id}
                className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4"
              >
                <GraduationCap className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">
                    {edu.course_or_qualification}
                  </p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  {edu.year_of_completion && (
                    <p className="text-xs text-gray-500 mt-1">
                      {edu.year_of_completion}
                    </p>
                  )}
                  {edu.course_highlights && (
                    <p className="text-sm text-gray-600 mt-2">
                      {edu.course_highlights}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-gray-400 hover:text-red-600"
                  onClick={async () => {
                    if (username) {
                      try {
                        const updated = await apiDeleteEducation(
                          username,
                          edu.id
                        );
                        onProfileUpdate(mapApiToCvProfile(updated));
                        toast.success("Education deleted");
                      } catch (err) {
                        toast.error("Failed to delete education");
                      }
                    } else {
                      onProfileUpdate({
                        ...profile,
                        education: profile.education.filter(
                          (e) => e.id !== edu.id
                        ),
                      });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Add your education details.
          </p>
        )}
      </CvSection>

      {/* Career History */}
      <CvSection
        title="Career History"
        description="Your work experience."
        actionText="Add"
        form={(onClose) => (
          <CareerForm
            profile={profile}
            onProfileUpdate={onProfileUpdate}
            onClose={onClose}
            username={username}
          />
        )}
      >
        {profile.career_history.length > 0 ? (
          <ul className="space-y-3">
            {profile.career_history.map((career) => (
              <li
                key={career.id}
                className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4"
              >
                <Briefcase className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">
                    {career.job_title}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {career.company_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {career.start_date}
                    {career.end_date ? ` – ${career.end_date}` : " – Present"}
                  </p>
                  {career.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {career.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-gray-400 hover:text-red-600"
                  onClick={async () => {
                    if (username) {
                      try {
                        const updated = await apiDeleteCareerHistory(
                          username,
                          career.id
                        );
                        onProfileUpdate(mapApiToCvProfile(updated));
                        toast.success("Career history deleted");
                      } catch (err) {
                        toast.error("Failed to delete career history");
                      }
                    } else {
                      onProfileUpdate({
                        ...profile,
                        career_history: profile.career_history.filter(
                          (c) => c.id !== career.id
                        ),
                      });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Add your work experience.
          </p>
        )}
      </CvSection>

      {/* Certifications */}
      <CvSection
        title="Certifications"
        description="Professional certifications."
        actionText="Add"
        form={(onClose) => (
          <CertificationForm
            profile={profile}
            onProfileUpdate={onProfileUpdate}
            onClose={onClose}
            username={username}
          />
        )}
      >
        {profile.certifications.length > 0 ? (
          <ul className="space-y-3">
            {profile.certifications.map((cert) => (
              <li
                key={cert.id}
                className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4"
              >
                <Award className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{cert.name}</p>
                  <p className="text-sm text-gray-600">
                    {cert.issuing_organisation}
                  </p>
                  {(cert.issue_date || cert.expiry_date) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {cert.issue_date}
                      {cert.expiry_date ? ` – ${cert.expiry_date}` : ""}
                    </p>
                  )}
                  {cert.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {cert.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-gray-400 hover:text-red-600"
                  onClick={async () => {
                    if (username) {
                      try {
                        const updated = await apiDeleteCertification(
                          username,
                          cert.id
                        );
                        onProfileUpdate(mapApiToCvProfile(updated));
                        toast.success("Certification deleted");
                      } catch (err) {
                        toast.error("Failed to delete certification");
                      }
                    } else {
                      onProfileUpdate({
                        ...profile,
                        certifications: profile.certifications.filter(
                          (c) => c.id !== cert.id
                        ),
                      });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Add your certifications.
          </p>
        )}
      </CvSection>

      {/* Work Preferences */}
      <WorkPreferencesSection
        profile={profile}
        onProfileUpdate={onProfileUpdate}
        username={username}
      />

      {/* Skills */}
      <CvSection
        title="Skills"
        description="Your technical and soft skills."
        actionText="Add"
        form={(onClose) => (
          <SkillForm
            profile={profile}
            onProfileUpdate={onProfileUpdate}
            onClose={onClose}
            username={username}
          />
        )}
      >
        {profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800"
              >
                {skill.name}
                <button
                  type="button"
                  className="ml-1 rounded-full p-0.5 hover:bg-teal-200/50"
                  onClick={async () => {
                    if (username) {
                      try {
                        const updated = await apiDeleteSkill(
                          username,
                          skill.id
                        );
                        onProfileUpdate(mapApiToCvProfile(updated));
                        toast.success("Skill removed");
                      } catch (err) {
                        toast.error("Failed to remove skill");
                      }
                    } else {
                      onProfileUpdate({
                        ...profile,
                        skills: profile.skills.filter((s) => s.id !== skill.id),
                      });
                    }
                  }}
                  aria-label={`Remove ${skill.name}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">Add your skills.</p>
        )}
      </CvSection>
    </div>
  );
}

function EducationForm({
  profile,
  onProfileUpdate,
  onClose,
  username,
}: {
  profile: CvProfile;
  onProfileUpdate: (p: CvProfile) => void;
  onClose: () => void;
  username: string | null;
}) {
  const [institution, setInstitution] = useState("");
  const [qualification, setQualification] = useState("Bachelors");
  const [year, setYear] = useState("");
  const [highlights, setHighlights] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const institutionVal = institution.trim() || "Institution";
    const yearVal = year.trim();
    const yearOfCompletion = yearVal
      ? /^\d{4}$/.test(yearVal)
        ? `${yearVal}-01-01`
        : yearVal
      : undefined;

    if (username) {
      setSubmitting(true);
      try {
        const updated = await apiAddEducation(username, {
          course_or_qualification: qualification,
          institution: institutionVal,
          year_of_completion: yearOfCompletion,
          course_highlights: highlights.trim() || undefined,
        });
        onProfileUpdate(mapApiToCvProfile(updated));
        toast.success("Education added");
        setInstitution("");
        setQualification("Bachelors");
        setYear("");
        setHighlights("");
        onClose();
      } catch (err) {
        toast.error("Failed to add education");
      } finally {
        setSubmitting(false);
      }
    } else {
      const newEdu: CvEducation = {
        id: generateId(),
        course_or_qualification: qualification,
        institution: institutionVal,
        year_of_completion: yearOfCompletion,
        course_highlights: highlights.trim() || undefined,
      };
      onProfileUpdate({
        ...profile,
        education: [...profile.education, newEdu],
      });
      setInstitution("");
      setQualification("Bachelors");
      setYear("");
      setHighlights("");
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <h3 className="font-semibold text-gray-900">Add education</h3>
      <div className="space-y-2">
        <Label>Institution</Label>
        <Input
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="School or university"
        />
      </div>
      <div className="space-y-2">
        <Label>Qualification</Label>
        <Select value={qualification} onValueChange={setQualification}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QUALIFICATION_OPTIONS.map((q) => (
              <SelectItem key={q} value={q}>
                {q}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Year of completion</Label>
        <Input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="e.g. 2020"
        />
      </div>
      <div className="space-y-2">
        <Label>Highlights (optional)</Label>
        <Textarea
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          placeholder="Key courses or achievements"
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}

function parseDateForApi(val: string): string | undefined {
  if (!val.trim()) return undefined;
  const v = val.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  if (/^\d{4}$/.test(v)) return `${v}-01-01`;
  return v;
}

function CareerForm({
  profile,
  onProfileUpdate,
  onClose,
  username,
}: {
  profile: CvProfile;
  onProfileUpdate: (p: CvProfile) => void;
  onClose: () => void;
  username: string | null;
}) {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const companyVal = company.trim() || "Company";
    const titleVal = title.trim() || "Job title";
    const startVal = startDate.trim() || new Date().toISOString().slice(0, 10);
    const startForApi = parseDateForApi(startVal) ?? startVal;
    const endForApi = endDate.trim() ? parseDateForApi(endDate) : undefined;

    if (username) {
      setSubmitting(true);
      try {
        const updated = await apiAddCareerHistory(username, {
          company_name: companyVal,
          job_title: titleVal,
          start_date: startForApi,
          end_date: endForApi,
          description: description.trim() || undefined,
        });
        onProfileUpdate(mapApiToCvProfile(updated));
        toast.success("Career history added");
        setCompany("");
        setTitle("");
        setStartDate("");
        setEndDate("");
        setDescription("");
        onClose();
      } catch (err) {
        toast.error("Failed to add career history");
      } finally {
        setSubmitting(false);
      }
    } else {
      const newCareer: CvCareerHistory = {
        id: generateId(),
        company_name: companyVal,
        job_title: titleVal,
        start_date: startDate || "Present",
        end_date: endDate.trim() || undefined,
        description: description.trim() || undefined,
      };
      onProfileUpdate({
        ...profile,
        career_history: [...profile.career_history, newCareer],
      });
      setCompany("");
      setTitle("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <h3 className="font-semibold text-gray-900">Add career</h3>
      <div className="space-y-2">
        <Label>Company</Label>
        <Input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company name"
        />
      </div>
      <div className="space-y-2">
        <Label>Job title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your role"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label>Start date</Label>
          <Input
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="e.g. 2020-01 or Jan 2020"
          />
        </div>
        <div className="space-y-2">
          <Label>End date</Label>
          <Input
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Present or YYYY-MM-DD"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description (optional)</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Key responsibilities"
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}

function CertificationForm({
  profile,
  onProfileUpdate,
  onClose,
  username,
}: {
  profile: CvProfile;
  onProfileUpdate: (p: CvProfile) => void;
  onClose: () => void;
  username: string | null;
}) {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameVal = name.trim() || "Certification";
    const orgVal = org.trim() || "Issuer";

    if (username) {
      setSubmitting(true);
      try {
        const updated = await apiAddCertification(username, {
          name: nameVal,
          issuing_organisation: orgVal,
          issue_date: issueDate.trim() || undefined,
          expiry_date: expiryDate.trim() || undefined,
          description: description.trim() || undefined,
        });
        onProfileUpdate(mapApiToCvProfile(updated));
        toast.success("Certification added");
        setName("");
        setOrg("");
        setIssueDate("");
        setExpiryDate("");
        setDescription("");
        onClose();
      } catch (err) {
        toast.error("Failed to add certification");
      } finally {
        setSubmitting(false);
      }
    } else {
      const newCert: CvCertification = {
        id: generateId(),
        name: nameVal,
        issuing_organisation: orgVal,
        issue_date: issueDate.trim() || undefined,
        expiry_date: expiryDate.trim() || undefined,
        description: description.trim() || undefined,
      };
      onProfileUpdate({
        ...profile,
        certifications: [...profile.certifications, newCert],
      });
      setName("");
      setOrg("");
      setIssueDate("");
      setExpiryDate("");
      setDescription("");
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <h3 className="font-semibold text-gray-900">Add certification</h3>
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Certification name"
        />
      </div>
      <div className="space-y-2">
        <Label>Issuing organisation</Label>
        <Input
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          placeholder="Issuer"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label>Issue date</Label>
          <Input
            type="text"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            placeholder="e.g. 2022"
          />
        </div>
        <div className="space-y-2">
          <Label>Expiry date</Label>
          <Input
            type="text"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description (optional)</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Details"
          rows={2}
        />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}

function SkillForm({
  profile,
  onProfileUpdate,
  onClose,
  username,
}: {
  profile: CvProfile;
  onProfileUpdate: (p: CvProfile) => void;
  onClose: () => void;
  username: string | null;
}) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    if (username) {
      setSubmitting(true);
      try {
        const updated = await apiAddSkill(username, { name: trimmed });
        onProfileUpdate(mapApiToCvProfile(updated));
        toast.success("Skill added");
        setName("");
        onClose();
      } catch (err) {
        toast.error("Failed to add skill");
      } finally {
        setSubmitting(false);
      }
    } else {
      const newSkill: CvSkill = { id: generateId(), name: trimmed };
      onProfileUpdate({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
      setName("");
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <h3 className="font-semibold text-gray-900">Add skill</h3>
      <div className="space-y-2">
        <Label>Skill name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. JavaScript, Communication"
        />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}

function WorkPreferencesSection({
  profile,
  onProfileUpdate,
  username,
}: {
  profile: CvProfile;
  onProfileUpdate: (p: CvProfile) => void;
  username: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [years, setYears] = useState(String(profile.work_experience || 0));
  const [availability, setAvailability] = useState<CvAvailability>(
    profile.availability
  );
  const [remote, setRemote] = useState(profile.remote_work_preference);
  const [salaryFrom, setSalaryFrom] = useState(
    String(profile.preferred_salary_range_from || "")
  );
  const [salaryTo, setSalaryTo] = useState(
    String(profile.preferred_salary_range_to || "")
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const payload = {
      work_experience: Number(years) || 0,
      availability,
      remote_work_preference: remote,
      preferred_salary_range_from: Number(salaryFrom) || 0,
      preferred_salary_range_to: Number(salaryTo) || 0,
    };
    if (username) {
      setSaving(true);
      try {
        const updated = await updateJobseekerProfile(username, {
          ...payload,
          work_experience: payload.work_experience,
        });
        onProfileUpdate(mapApiToCvProfile(updated));
        toast.success("Work preferences updated");
        setOpen(false);
      } catch (err) {
        toast.error("Failed to update work preferences");
      } finally {
        setSaving(false);
      }
    } else {
      onProfileUpdate({ ...profile, ...payload });
      setOpen(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Work preferences</h2>
      <p className="text-sm text-gray-500 mt-0.5">
        Availability, experience and salary expectations.
      </p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
          <Briefcase className="w-5 h-5 text-teal-600 shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Experience</p>
            <p className="text-sm font-medium text-gray-900">
              {profile.work_experience} years
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
          <Calendar className="w-5 h-5 text-teal-600 shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Availability</p>
            <p className="text-sm font-medium text-gray-900">
              {profile.availability}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
          <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Remote</p>
            <p className="text-sm font-medium text-gray-900">
              {profile.remote_work_preference ? "Yes" : "No"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
          <DollarSign className="w-5 h-5 text-teal-600 shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Salary range</p>
            <p className="text-sm font-medium text-gray-900">
              {profile.preferred_salary_range_from ||
              profile.preferred_salary_range_to
                ? `NRs. ${(
                    profile.preferred_salary_range_from || 0
                  ).toLocaleString()} – ${(
                    profile.preferred_salary_range_to || 0
                  ).toLocaleString()}`
                : "Not set"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Edit preferences
        </Button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-gray-900 mb-4">
              Edit work preferences
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Years of experience</Label>
                <Input
                  type="number"
                  min={0}
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Availability</Label>
                <Select
                  value={availability}
                  onValueChange={(v) => setAvailability(v as CvAvailability)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY_OPTIONS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remote"
                  checked={remote}
                  onChange={(e) => setRemote(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="remote">Open to remote work</Label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Salary from (NRs)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={salaryFrom}
                    onChange={(e) => setSalaryFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salary to (NRs)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
