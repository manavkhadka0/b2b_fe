"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getProvinces,
  getDistricts,
  getMunicipalities,
} from "@manavkhadka0/nepal-address";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInstitute } from "@/services/institute";
import {
  INSTITUTE_TYPE_CHOICES,
  type CreateInstitutePayload,
} from "@/types/institute";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle } from "lucide-react";

const instituteFormSchema = z.object({
  institute_name: z.string().min(1, "Institute name is required"),
  institute_type: z.enum([
    "Technical School",
    "Polytechnic",
    "Training Centre",
    "College",
  ]),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  municipality: z.string().min(1, "Municipality is required"),
  ward_no: z.coerce
    .number()
    .int("Ward must be a whole number")
    .min(1, "Ward number is required"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .max(15, "Ensure this field has no more than 15 characters."),
  website: z.string().optional(),
  email: z.string().email("Valid email is required"),
  primary_contact_person: z
    .string()
    .min(1, "Primary contact person is required"),
  primary_contact_person_phone: z
    .string()
    .min(1, "Primary contact phone is required")
    .max(15, "Ensure this field has no more than 15 characters."),
  primary_contact_person_email: z
    .string()
    .email("Valid primary contact email is required"),
  primary_contact_person_designation: z
    .string()
    .min(1, "Designation is required"),
});

type InstituteFormValues = z.infer<typeof instituteFormSchema>;

function formValuesToPayload(
  values: InstituteFormValues,
): CreateInstitutePayload {
  return {
    institute_name: values.institute_name,
    institute_type: values.institute_type,
    province: values.province,
    district: values.district,
    municipality: values.municipality,
    ward_no: values.ward_no,
    phone_number: values.phone_number,
    website: values.website?.trim() || null,
    email: values.email,
    primary_contact_person: values.primary_contact_person,
    primary_contact_person_phone: values.primary_contact_person_phone,
    primary_contact_person_email: values.primary_contact_person_email,
    primary_contact_person_designation:
      values.primary_contact_person_designation,
  };
}

interface CreateInstituteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateInstituteDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateInstituteDialogProps) {
  const [showVerifyMessage, setShowVerifyMessage] = useState(false);

  useEffect(() => {
    if (!open) setShowVerifyMessage(false);
  }, [open]);

  const form = useForm<InstituteFormValues>({
    resolver: zodResolver(instituteFormSchema),
    defaultValues: {
      institute_name: "",
      institute_type: "College",
      province: "",
      district: "",
      municipality: "",
      ward_no: 1,
      phone_number: "",
      website: "",
      email: "",
      primary_contact_person: "",
      primary_contact_person_phone: "",
      primary_contact_person_email: "",
      primary_contact_person_designation: "",
    },
  });

  const province = form.watch("province");
  const district = form.watch("district");
  const provinces = getProvinces();
  const districts = province ? getDistricts(province) : [];
  const municipalities = district ? getMunicipalities(district) : [];

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await createInstitute(formValuesToPayload(values));
      form.reset();
      setShowVerifyMessage(true);
      toast.success("Institute created. Please verify your email.");
    } catch (err) {
      console.error("Create institute error:", err);
      const data = (err as any)?.response?.data as
        | Record<string, unknown>
        | undefined;
      if (data && typeof data === "object") {
        Object.entries(data).forEach(([key, value]) => {
          if (!Array.isArray(value)) return;
          const msg = value.filter((v) => typeof v === "string").join(" ");
          if (!msg) return;
          form.setError(key as any, { type: "server", message: msg });
        });
      }
      toast.error("Failed to create institute. Please check the form.");
    }
  });

  const handleCloseVerifyMessage = () => {
    setShowVerifyMessage(false);
    onOpenChange(false);
    onSuccess();
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto">
        {showVerifyMessage ? (
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 p-4">
              <CheckCircle className="w-10 h-10 text-green-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">Institute created</h3>
                <p className="text-sm text-green-800 mt-1">
                  Please check your institute email inbox. We sent a verification link—click it to verify your email and activate your institute account.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4 shrink-0" />
              <span>Verification link: check the email you used for the institute.</span>
            </div>
            <DialogFooter>
              <Button onClick={handleCloseVerifyMessage}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create Institute</DialogTitle>
              <DialogDescription>
                Register your institute to manage the skilled workforce roster.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="institute_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institute name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. ABC Technical School" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institute_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institute type *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INSTITUTE_TYPE_CHOICES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("district", "");
                        form.setValue("municipality", "");
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
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("municipality", "");
                      }}
                      disabled={!province}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              province
                                ? "Select district"
                                : "Select province first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map((d) => (
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipality *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!district}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              district
                                ? "Select municipality"
                                : "Select district first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {municipalities.map((m) => (
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
                name="ward_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward number *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? 1 : Number(v));
                        }}
                        placeholder="e.g. 5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institute phone *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="98XXXXXXXX"
                        type="tel"
                        inputMode="tel"
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
                    <FormLabel>Institute email *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="institute@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4 space-y-4">
              <p className="text-sm font-medium text-slate-700">
                Primary contact person
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primary_contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primary_contact_person_designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Principal" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primary_contact_person_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="98XXXXXXXX"
                          type="tel"
                          inputMode="tel"
                          maxLength={15}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primary_contact_person_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="contact@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Institute"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
