"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getProvinces,
  getDistricts,
  getMunicipalities,
} from "@manavkhadka0/nepal-address";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  LEVEL_COMPLETED_CHOICES,
  CERTIFYING_AGENCY_CHOICES,
  JOB_STATUS_CHOICES,
  type CreateGraduateRosterPayload,
  type GraduateRoster,
} from "@/types/graduate-roster";
import { getInstitutes } from "@/services/institute";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  institute: z.union([z.number(), z.string()]).optional().nullable(),
  name: z.string().min(1, "Name is required"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .max(15, "Ensure this field has no more than 15 characters."),
  email: z.string().email("Valid email is required"),
  gender: z.string().min(1, "Gender is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  permanent_province: z.string().min(1, "Province is required"),
  permanent_district: z.string().min(1, "District is required"),
  permanent_municipality: z.string().min(1, "Municipality is required"),
  permanent_ward: z.string().min(1, "Ward is required"),
  sameAsPermanent: z.boolean().optional(),
  current_province: z.string().optional(),
  current_district: z.string().optional(),
  current_municipality: z.string().optional(),
  current_ward: z.string().optional(),
  level_completed: z.string().optional().nullable(),
  subject_trade_stream: z.string().optional().nullable(),
  specialization_key_skills: z.string().optional().nullable(),
  passed_year: z.coerce.number().optional().nullable(),
  certifying_agency: z.string().optional().nullable(),
  certifying_agency_name: z.string().optional().nullable(),
  certificate_id: z.string().optional().nullable(),
  job_status: z.enum(["Available for Job", "Not Available"]),
  available_from: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

function toPayload(values: FormValues): CreateGraduateRosterPayload {
  const instituteId =
    values.institute != null && values.institute !== ""
      ? Number(values.institute)
      : null;
  return {
    institute: instituteId,
    name: values.name,
    phone_number: values.phone_number,
    email: values.email,
    gender: values.gender,
    date_of_birth: values.date_of_birth,
    permanent_province: values.permanent_province,
    permanent_district: values.permanent_district,
    permanent_municipality: values.permanent_municipality,
    permanent_ward: values.permanent_ward,
    current_province: values.sameAsPermanent
      ? values.permanent_province
      : values.current_province || null,
    current_district: values.sameAsPermanent
      ? values.permanent_district
      : values.current_district || null,
    current_municipality: values.sameAsPermanent
      ? values.permanent_municipality
      : values.current_municipality || null,
    current_ward: values.sameAsPermanent
      ? values.permanent_ward
      : values.current_ward || null,
    level_completed:
      (values.level_completed as CreateGraduateRosterPayload["level_completed"]) ||
      null,
    subject_trade_stream: values.subject_trade_stream?.trim() || null,
    specialization_key_skills: values.specialization_key_skills?.trim() || null,
    passed_year: values.passed_year ?? null,
    certifying_agency:
      (values.certifying_agency as CreateGraduateRosterPayload["certifying_agency"]) ||
      null,
    certifying_agency_name: values.certifying_agency_name?.trim() || null,
    certificate_id: values.certificate_id?.trim() || null,
    job_status: values.job_status as CreateGraduateRosterPayload["job_status"],
    available_from: values.available_from?.trim() || null,
  };
}

interface GraduateRosterFormProps {
  defaultInstituteId?: number | null;
  defaultValues?: Partial<GraduateRoster>;
  onSubmit: (payload: CreateGraduateRosterPayload) => Promise<void>;
  submitLabel?: string;
}

export function GraduateRosterForm({
  defaultInstituteId,
  defaultValues,
  onSubmit,
  submitLabel = "Save",
}: GraduateRosterFormProps) {
  const [institutes, setInstitutes] = useState<
    Array<{ id: number; institute_name: string }>
  >([]);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institute: defaultInstituteId ?? null,
      name: defaultValues?.name ?? "",
      phone_number: defaultValues?.phone_number ?? "",
      email: defaultValues?.email ?? "",
      gender: defaultValues?.gender ?? "",
      date_of_birth: defaultValues?.date_of_birth ?? "",
      permanent_province: defaultValues?.permanent_province ?? "",
      permanent_district: defaultValues?.permanent_district ?? "",
      permanent_municipality: defaultValues?.permanent_municipality ?? "",
      permanent_ward: defaultValues?.permanent_ward ?? "",
      sameAsPermanent: false,
      current_province: defaultValues?.current_province ?? "",
      current_district: defaultValues?.current_district ?? "",
      current_municipality: defaultValues?.current_municipality ?? "",
      current_ward: defaultValues?.current_ward ?? "",
      level_completed: defaultValues?.level_completed ?? "",
      subject_trade_stream: defaultValues?.subject_trade_stream ?? "",
      specialization_key_skills: defaultValues?.specialization_key_skills ?? "",
      passed_year: defaultValues?.passed_year ?? undefined,
      certifying_agency: defaultValues?.certifying_agency ?? "",
      certifying_agency_name: defaultValues?.certifying_agency_name ?? "",
      certificate_id: defaultValues?.certificate_id ?? "",
      job_status:
        (defaultValues?.job_status as "Available for Job" | "Not Available") ??
        "Available for Job",
      available_from: defaultValues?.available_from ?? "",
    },
  });

  const permanentProvince = form.watch("permanent_province");
  const permanentDistrict = form.watch("permanent_district");
  const permanentMunicipality = form.watch("permanent_municipality");
  const permanentWard = form.watch("permanent_ward");
  const currentProvince = form.watch("current_province");
  const currentDistrict = form.watch("current_district");

  const provinces = getProvinces();
  const permanentDistricts = permanentProvince
    ? getDistricts(permanentProvince)
    : [];
  const permanentMunicipalities = permanentDistrict
    ? getMunicipalities(permanentDistrict)
    : [];
  const currentDistricts = currentProvince ? getDistricts(currentProvince) : [];
  const currentMunicipalities = currentDistrict
    ? getMunicipalities(currentDistrict)
    : [];

  useEffect(() => {
    getInstitutes()
      .then(setInstitutes)
      .catch(() => setInstitutes([]));
  }, []);

  useEffect(() => {
    if (sameAsPermanent) {
      form.setValue("current_province", permanentProvince);
      form.setValue("current_district", permanentDistrict);
      form.setValue("current_municipality", permanentMunicipality);
      form.setValue("current_ward", permanentWard);
    } else {
      form.setValue("current_province", "");
      form.setValue("current_district", "");
      form.setValue("current_municipality", "");
      form.setValue("current_ward", "");
    }
  }, [
    sameAsPermanent,
    permanentProvince,
    permanentDistrict,
    permanentMunicipality,
    permanentWard,
    form,
  ]);

  const handleSameAsPermanentChange = (checked: boolean) => {
    setSameAsPermanent(checked);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(toPayload({ ...values, sameAsPermanent }));
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Basic information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {institutes.length > 0 && (
              <FormField
                control={form.control}
                name="institute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institute</FormLabel>
                    <Select
                      value={field.value != null ? String(field.value) : ""}
                      onValueChange={(v) =>
                        field.onChange(v === "" ? null : Number(v))
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select institute" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {institutes.map((i) => (
                          <SelectItem key={i.id} value={String(i.id)}>
                            {i.institute_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="98XXXXXXXX"
                      type="tel"
                      maxLength={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="email@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth *</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Permanent address */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Permanent address
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="permanent_province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("permanent_district", "");
                      form.setValue("permanent_municipality", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permanent_district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("permanent_municipality", "");
                    }}
                    disabled={!permanentProvince}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            permanentProvince
                              ? "Select district"
                              : "Select province first"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {permanentDistricts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permanent_municipality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Municipality *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!permanentDistrict}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            permanentDistrict
                              ? "Select municipality"
                              : "Select district first"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {permanentMunicipalities.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permanent_ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ward *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. 5" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Current address */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Current address
            </h3>
            <div className="flex items-center gap-2">
              <Checkbox
                id="same-as-permanent"
                checked={sameAsPermanent}
                onCheckedChange={handleSameAsPermanentChange}
              />
              <Label
                htmlFor="same-as-permanent"
                className="text-sm cursor-pointer"
              >
                Same as permanent
              </Label>
            </div>
          </div>
          {!sameAsPermanent && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="current_province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        form.setValue("current_district", "");
                        form.setValue("current_municipality", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="current_district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        form.setValue("current_municipality", "");
                      }}
                      disabled={!currentProvince}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              currentProvince
                                ? "Select district"
                                : "Select province first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentDistricts.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="current_municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipality</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!currentDistrict}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              currentDistrict
                                ? "Select municipality"
                                : "Select district first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentMunicipalities.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="current_ward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Education */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Education</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="level_completed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level completed</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={(v) => field.onChange(v || null)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEVEL_COMPLETED_CHOICES.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject_trade_stream"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject / trade / stream</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Computer Engineering"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? e.target.value : null,
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passed_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passed year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1990}
                      max={new Date().getFullYear()}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="certifying_agency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifying agency</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={(v) => field.onChange(v || null)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CERTIFYING_AGENCY_CHOICES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="certifying_agency_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifying agency name (if Other)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter if Other"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? e.target.value : null,
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="certificate_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Certificate number"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? e.target.value : null,
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="specialization_key_skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization / key skills</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe skills, certifications, etc."
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? e.target.value : null,
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Job status */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Job availability
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="job_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JOB_STATUS_CHOICES.map((j) => (
                        <SelectItem key={j} value={j}>
                          {j}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="available_from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available from</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
