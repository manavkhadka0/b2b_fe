"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { rosterFormSchema } from "./schema";
import type { RosterFormValues } from "./types";
import { Step1BasicInfo } from "./components/Step1BasicInfo";
import { Step2Address } from "./components/Step2Address";
import { Step4Education } from "./components/Step4Education";
import { Step5JobAvailability } from "./components/Step5JobAvailability";
import { Step6Review } from "./components/Step6Review";
import { createGraduate, getGraduate, updateGraduate } from "@/services/graduates";
import {
  getInstitutes,
  getInstituteDetail,
  isInstituteNotFoundError,
} from "@/services/institute";
import { useAuth } from "@/contexts/AuthContext";
import type { CreateGraduateRosterPayload, GraduateRoster } from "@/types/graduate-roster";
import type { Institute } from "@/types/institute";

const STEPS = [
  { title: "Basic information", description: "Personal details", icon: User },
  { title: "Address", description: "Province, district, municipality", icon: MapPin },
  { title: "Education", description: "Qualifications and skills", icon: GraduationCap },
  { title: "Job availability", description: "Status and availability", icon: Briefcase },
  { title: "Review & submit", description: "Confirm and add", icon: CheckCircle2 },
];

function toPayload(values: RosterFormValues): CreateGraduateRosterPayload {
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
    current_province: values.permanent_province,
    current_district: values.permanent_district,
    current_municipality: values.permanent_municipality,
    current_ward: values.permanent_ward,
    level_completed: (values.level_completed as CreateGraduateRosterPayload["level_completed"]) || null,
    subject_trade_stream: values.subject_trade_stream?.trim() || null,
    specialization_key_skills: values.specialization_key_skills?.trim() || null,
    passed_year: values.passed_year ?? null,
    certifying_agency: (values.certifying_agency as CreateGraduateRosterPayload["certifying_agency"]) || null,
    certifying_agency_name: values.certifying_agency_name?.trim() || null,
    certificate_id: values.certificate_id?.trim() || null,
    job_status: values.job_status as CreateGraduateRosterPayload["job_status"],
    available_from: values.available_from?.trim() || null,
  };
}

function graduateToFormValues(graduate: GraduateRoster): RosterFormValues {
  const instituteId =
    typeof graduate.institute === "object" && graduate.institute
      ? graduate.institute.id
      : graduate.institute ?? null;

  return {
    institute: instituteId,
    name: graduate.name,
    phone_number: graduate.phone_number,
    email: graduate.email,
    gender: graduate.gender,
    date_of_birth: graduate.date_of_birth,
    permanent_province: graduate.permanent_province,
    permanent_district: graduate.permanent_district,
    permanent_municipality: graduate.permanent_municipality,
    permanent_ward: graduate.permanent_ward,
    sameAsPermanent: false,
    current_province: graduate.current_province ?? "",
    current_district: graduate.current_district ?? "",
    current_municipality: graduate.current_municipality ?? "",
    current_ward: graduate.current_ward ?? "",
    level_completed: graduate.level_completed ?? "",
    subject_trade_stream: graduate.subject_trade_stream ?? "",
    specialization_key_skills: graduate.specialization_key_skills ?? "",
    passed_year: graduate.passed_year ?? undefined,
    certifying_agency: graduate.certifying_agency ?? "",
    certifying_agency_name: graduate.certifying_agency_name ?? "",
    certificate_id: graduate.certificate_id ?? "",
    job_status: graduate.job_status,
    available_from: graduate.available_from ?? "",
    declaration: false,
  };
}

export default function RosterCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdParam = searchParams.get("editId");
  const editId = editIdParam ? Number(editIdParam) : null;
  const isEditing = !!editIdParam && !Number.isNaN(editId);

  const { user, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [institutes, setInstitutes] = useState<Array<{ id: number; institute_name: string }>>([]);
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingGraduate, setLoadingGraduate] = useState(false);
  const [editingGraduate, setEditingGraduate] = useState<GraduateRoster | null>(null);

  useEffect(() => {
    if (!user?.username) return;
    getInstituteDetail()
      .then(setInstitute)
      .catch((err) => {
        if (!isInstituteNotFoundError(err)) console.error(err);
        setInstitute(null);
      });
  }, [user?.username]);

  useEffect(() => {
    getInstitutes().then(setInstitutes).catch(() => setInstitutes([]));
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      const returnTo = isEditing
        ? `/jobs/roster/create?editId=${editIdParam}`
        : "/jobs/roster/create";
      router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    }
  }, [authLoading, user, router, isEditing, editIdParam]);

  const form = useForm<RosterFormValues>({
    resolver: zodResolver(rosterFormSchema),
    defaultValues: {
      institute: null,
      name: "",
      phone_number: "",
      email: "",
      gender: "",
      date_of_birth: "",
      permanent_province: "",
      permanent_district: "",
      permanent_municipality: "",
      permanent_ward: "",
      sameAsPermanent: false,
      current_province: "",
      current_district: "",
      current_municipality: "",
      current_ward: "",
      level_completed: "",
      subject_trade_stream: "",
      specialization_key_skills: "",
      passed_year: undefined,
      certifying_agency: "",
      certifying_agency_name: "",
      certificate_id: "",
      job_status: "Available for Job",
      available_from: "",
      declaration: false,
    },
  });

  // When editing, load graduate and reset form with existing values
  useEffect(() => {
    if (!isEditing || !editId) return;
    setLoadingGraduate(true);
    getGraduate(editId)
      .then((g) => {
        setEditingGraduate(g);
        form.reset(graduateToFormValues(g));
      })
      .catch((err) => {
        console.error("Error loading graduate for edit:", err);
        setEditingGraduate(null);
      })
      .finally(() => setLoadingGraduate(false));
  }, [isEditing, editId, form]);

  useEffect(() => {
    if (isEditing) return;
    if (institute?.id) {
      form.setValue("institute", institute.id);
    }
  }, [institute?.id, form, isEditing]);

  const getFieldsForStep = (step: number): (keyof RosterFormValues)[] => {
    switch (step) {
      case 1:
        return ["institute", "name", "phone_number", "email", "gender", "date_of_birth"];
      case 2:
        return ["permanent_province", "permanent_district", "permanent_municipality", "permanent_ward"];
      case 3:
        return ["level_completed", "subject_trade_stream", "specialization_key_skills", "passed_year", "certifying_agency", "certifying_agency_name", "certificate_id"];
      case 4:
        return ["job_status", "available_from"];
      case 5:
        return ["declaration"];
      default:
        return [];
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate, { shouldFocus: true });
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: RosterFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = toPayload(data);
      const finalPayload =
        !isEditing && institute ? { ...payload, institute: institute.id } : payload;

      if (isEditing && editId) {
        await updateGraduate(editId, finalPayload);
        toast.success("Graduate updated.");
      } else {
        await createGraduate(finalPayload);
        toast.success("Graduate added to roster.");
      }
      router.push("/jobs/roster");
    } catch (err) {
      console.error("Create graduate error:", err);
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      if (data && typeof data === "object") {
        const msgs = Object.entries(data)
          .map(([k, v]) => (Array.isArray(v) ? v.join(" ") : String(v)))
          .filter(Boolean);
        if (msgs.length) toast.error(msgs.join(" "));
        else toast.error("Failed to add graduate. Please try again.");
      } else {
        toast.error("Failed to add graduate. Please try again.");
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (isEditing && !loadingGraduate && !editingGraduate) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-600">Graduate not found.</p>
      </div>
    );
  }

  if (isEditing && loadingGraduate) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 px-2 sm:py-6 sm:px-4 lg:py-8 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 text-center">
          <Link
            href="/jobs/roster"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to roster
          </Link>
          <h1 className="text-xl min-[375px]:text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2 px-2">
            {isEditing ? "Edit graduate" : "Add graduate"}
          </h1>
          <p className="text-slate-600 text-xs min-[375px]:text-sm sm:text-base px-2">
            {isEditing
              ? "Update graduate details in your roster."
              : "Complete all steps to add a graduate to your roster"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-4 sm:mb-6 lg:mb-8 px-2">
          <div className="hidden md:flex items-center justify-between">
            {STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;
              const Icon = step.icon;

              return (
                <div key={step.title} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        isCompleted
                          ? "bg-green-600 text-white"
                          : isActive
                            ? "bg-blue-600 text-white ring-4 ring-blue-100"
                            : "bg-gray-200 text-gray-500",
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={cn(
                          "text-sm font-medium",
                          isActive ? "text-blue-600" : "text-gray-600",
                        )}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-2",
                        isCompleted ? "bg-green-600" : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile step indicator */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-2 gap-2">
              <span className="text-xs min-[375px]:text-sm font-medium text-blue-600 truncate">
                Step {currentStep} of {STEPS.length}
              </span>
              <span className="text-xs min-[375px]:text-sm text-gray-500 truncate text-right">
                {STEPS[currentStep - 1].title}
              </span>
            </div>
            <div className="relative h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form card */}
        <Card className="shadow-xl bg-white/80 backdrop-blur-sm mx-0 sm:mx-2">
          <CardHeader className="px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
            <CardTitle className="text-lg min-[375px]:text-xl sm:text-2xl">
              {STEPS[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-xs min-[375px]:text-sm mt-1">
              {STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
              >
                {currentStep === 1 && (
                  <Step1BasicInfo form={form} institutes={institutes} />
                )}
                {currentStep === 2 && <Step2Address form={form} />}
                {currentStep === 3 && <Step4Education form={form} />}
                {currentStep === 4 && <Step5JobAvailability form={form} />}
                {currentStep === 5 && <Step6Review form={form} />}

                {/* Navigation buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 pt-4 sm:pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
                  >
                    <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    Previous
                  </Button>

                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
                    >
                      Next
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !form.watch("declaration")}
                      className={cn(
                        "flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base",
                        !form.watch("declaration") &&
                          "disabled:opacity-50 disabled:pointer-events-none",
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span className="text-xs sm:text-sm">
                            {isEditing ? "Saving..." : "Adding..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">
                            {isEditing ? "Save changes" : "Add graduate"}
                          </span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
