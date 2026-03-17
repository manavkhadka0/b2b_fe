"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  GraduationCap,
  Building,
  Briefcase,
  FileText,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { internshipFormSchema } from "./schema";
import type { InternshipFormValues } from "./types";
import { Step1ApplicantDetails } from "./components/Step1ApplicantDetails";
import { Step2EducationDetails } from "./components/Step2EducationDetails";
import { Step3SupervisorDetails } from "./components/Step3SupervisorDetails";
import { Step4InternshipPreferences } from "./components/Step4InternshipPreferences";
import { Step5Motivation } from "./components/Step5Motivation";
import { Step6Documents } from "./components/Step6Documents";
import { Step7Declaration } from "./components/Step7Declaration";

const STEPS = [
  {
    title: "Applicant Details",
    description: "Personal information",
    icon: User,
  },
  {
    title: "Education Details",
    description: "School/College information",
    icon: GraduationCap,
  },
  {
    title: "Supervisor Details",
    description: "College supervisor information",
    icon: Building,
  },
  {
    title: "Internship Preferences",
    description: "Your preferences",
    icon: Briefcase,
  },
  {
    title: "Motivation",
    description: "Motivational letter",
    icon: FileText,
  },
  {
    title: "Documents",
    description: "Upload required documents",
    icon: Upload,
  },
  {
    title: "Declaration",
    description: "Review and submit",
    icon: CheckCircle2,
  },
];

interface Industry {
  id: number;
  name: string;
  description: string;
  link: string;
  slug: string;
}

export default function InternshipApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [recommendationFile, setRecommendationFile] = useState<File | null>(
    null
  );
  const [citizenshipFile, setCitizenshipFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [isLoadingIndustries, setIsLoadingIndustries] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const industriesLoadedRef = useRef(false);

  const form = useForm<InternshipFormValues>({
    resolver: zodResolver(internshipFormSchema),
    defaultValues: {
      fullName: "",
      permanentProvince: "",
      permanentDistrict: "",
      permanentMunicipality: "",
      permanentWard: "",
      currentProvince: "",
      currentDistrict: "",
      currentMunicipality: "",
      currentWard: "",
      contactNumber: "",
      email: "",
      dateOfBirth: "",
      institution: "",
      courseOrQualification: "",
      yearOfCompletion: "",
      courseHighlights: "",
      supervisorName: "",
      supervisorEmail: "",
      supervisorMobile: "",
      preferredIndustry: "",
      preferredDepartment: "",
      internshipDuration: "",
      durationUnit: "weeks",
      preferredMonth: "",
      preferredStartDate: "",
      availability: "Full Time",
      motivationalLetter: "",
      declaration: false,
    },
  });

  const getFieldsForStep = (step: number): (keyof InternshipFormValues)[] => {
    switch (step) {
      case 1:
        return [
          "fullName",
          "permanentProvince",
          "permanentDistrict",
          "permanentMunicipality",
          "permanentWard",
          "contactNumber",
          "email",
        ];
      case 2:
        return ["institution", "courseOrQualification"];
      case 3:
        return ["supervisorName", "supervisorEmail", "supervisorMobile"];
      case 4:
        return [
          "preferredIndustry",
          "internshipDuration",
          "durationUnit",
          "preferredMonth",
          "availability",
        ];
      case 5:
        return ["motivationalLetter"];
      case 6:
        return [];
      case 7:
        return ["declaration"];
      default:
        return [];
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate, {
      shouldFocus: true,
    });

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Calculate word count from HTML content
  const getWordCount = (html: string | undefined): number => {
    if (!html) return 0;
    const text = html.replace(/<[^>]*>/g, " ").trim();
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const wordCount = getWordCount(form.watch("motivationalLetter"));

  // Fetch industries (supports optional search query)
  const fetchIndustries = useCallback(async (search?: string) => {
    setIsLoadingIndustries(true);
    try {
      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/industries/`;
      const url =
        search && search.trim().length > 0
          ? `${baseUrl}?search=${encodeURIComponent(search.trim())}`
          : baseUrl;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch industries");
      }
      const data = await response.json();
      setIndustries(data.results || []);
    } catch (error) {
      console.error("Failed to fetch industries:", error);
      toast.error("Failed to load industries. Please refresh the page.");
    } finally {
      setIsLoadingIndustries(false);
    }
  }, []);

  // Initial industries load - only once
  useEffect(() => {
    if (!industriesLoadedRef.current) {
      industriesLoadedRef.current = true;
      fetchIndustries();
    }
  }, [fetchIndustries]);

  const onSubmit = async (data: InternshipFormValues) => {
    setIsSubmitting(true);
    try {
      // Create FormData
      const formData = new FormData();

      // Map fields to Django serializer field names
      formData.append("full_name", data.fullName);
      formData.append("permanent_province", data.permanentProvince);
      formData.append("permanent_district", data.permanentDistrict);
      formData.append("permanent_municipality", data.permanentMunicipality);
      formData.append("permanent_ward", data.permanentWard);

      // Current address (optional)
      if (data.currentProvince) {
        formData.append("current_province", data.currentProvince);
      }
      if (data.currentDistrict) {
        formData.append("current_district", data.currentDistrict);
      }
      if (data.currentMunicipality) {
        formData.append("current_municipality", data.currentMunicipality);
      }
      if (data.currentWard) {
        formData.append("current_ward", data.currentWard);
      }

      // Truncate contact number to max 15 characters
      const contactNumber = data.contactNumber.slice(0, 15);
      formData.append("contact_number", contactNumber);
      formData.append("email", data.email);

      if (data.dateOfBirth) {
        formData.append("date_of_birth", data.dateOfBirth);
      }

      // Education data - create array and send as JSON string
      // Map to Django serializer fields (matching CV EducationForm structure)
      // Note: Remove undefined/null values to avoid JSON serialization issues
      const yearOfCompletion = data.yearOfCompletion
        ? /^\d{4}$/.test(data.yearOfCompletion)
          ? `${data.yearOfCompletion}-01-01`
          : data.yearOfCompletion
        : null;

      const educationItem: Record<string, any> = {
        institution: data.institution.trim() || "Institution",
        course_or_qualification: data.courseOrQualification,
      };

      // Only add optional fields if they have values
      if (yearOfCompletion) {
        educationItem.year_of_completion = yearOfCompletion;
      }
      if (data.courseHighlights?.trim()) {
        educationItem.course_highlights = data.courseHighlights.trim();
      }

      const educationData = [educationItem];

      // Stringify and append - Django's to_internal_value will parse this JSON string
      // Field name must be "education_data" to match serializer
      const educationDataJson = JSON.stringify(educationData);
      console.log("Education Data JSON being sent:", educationDataJson); // Debug log
      formData.append("education_data", educationDataJson);

      // Supervisor details
      formData.append("supervisor_name", data.supervisorName);
      formData.append("supervisor_email", data.supervisorEmail);
      formData.append("supervisor_phone", data.supervisorMobile);

      // Internship preferences
      // preferredIndustry is stored as ID string, send as number (pk)
      if (data.preferredIndustry) {
        const industryId = parseInt(data.preferredIndustry, 10);
        if (!isNaN(industryId)) {
          formData.append("internship_industry", industryId.toString());
        } else {
          toast.error("Invalid industry selected");
          setIsSubmitting(false);
          return;
        }
      }
      if (data.preferredDepartment) {
        formData.append("preferred_department", data.preferredDepartment);
      }

      // Combine duration and unit
      const duration = `${data.internshipDuration} ${data.durationUnit}`;
      formData.append("internship_duration", duration);

      formData.append("internship_month", data.preferredMonth);
      if (data.preferredStartDate) {
        formData.append("preferred_start_date", data.preferredStartDate);
      }
      formData.append("availability", data.availability);

      // Add motivational letter
      if (data.motivationalLetter) {
        formData.append("motivational_letter", data.motivationalLetter);
      }

      // Documents - append files to FormData
      // Ensure files are actual File objects before appending
      if (recommendationFile && recommendationFile instanceof File) {
        formData.append("documents", recommendationFile);
      }
      if (citizenshipFile && citizenshipFile instanceof File) {
        formData.append("documents", citizenshipFile);
      }

      // Make API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/internship/register/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.detail ||
          errorData.message ||
          "Failed to submit application. Please try again.";
        toast.error(errorMessage);
        return;
      }

      const result = await response.json();
      toast.success("Application submitted successfully!");

      // Reset form
      form.reset();
      setRecommendationFile(null);
      setCitizenshipFile(null);
      setCurrentStep(1);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "recommendation" | "citizenship"
  ) => {
    const file = e.target.files?.[0];
    if (file && file instanceof File) {
      if (type === "recommendation") {
        setRecommendationFile(file);
        form.setValue("recommendationLetter", file);
      } else {
        setCitizenshipFile(file);
        form.setValue("citizenshipId", file);
      }
    }
  };

  const removeFile = (type: "recommendation" | "citizenship") => {
    if (type === "recommendation") {
      setRecommendationFile(null);
      form.setValue("recommendationLetter", undefined);
    } else {
      setCitizenshipFile(null);
      form.setValue("citizenshipId", undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 px-2 sm:py-6 sm:px-4 lg:py-8 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 text-center">
          <h1 className="text-xl min-[375px]:text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2 px-2">
            Internship Application
          </h1>
          <p className="text-slate-600 text-xs min-[375px]:text-sm sm:text-base px-2">
            Complete all steps to submit your application
          </p>
        </div>

        {/* Step Indicator */}
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
                          : "bg-gray-200 text-gray-500"
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
                          isActive ? "text-blue-600" : "text-gray-600"
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
                        isCompleted ? "bg-green-600" : "bg-gray-200"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Step Indicator */}
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

        {/* Form Card */}
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
                {/* Step Components */}
                {currentStep === 1 && (
                  <Step1ApplicantDetails
                    form={form}
                    sameAsPermanent={sameAsPermanent}
                    onSameAsPermanentChange={setSameAsPermanent}
                  />
                )}
                {currentStep === 2 && <Step2EducationDetails form={form} />}
                {currentStep === 3 && <Step3SupervisorDetails form={form} />}
                {currentStep === 4 && (
                  <Step4InternshipPreferences
                    form={form}
                    industries={industries}
                    isLoadingIndustries={isLoadingIndustries}
                    onSearchIndustries={fetchIndustries}
                  />
                )}
                {currentStep === 5 && (
                  <Step5Motivation form={form} wordCount={wordCount} />
                )}
                {currentStep === 6 && (
                  <Step6Documents
                    recommendationFile={recommendationFile}
                    citizenshipFile={citizenshipFile}
                    onRecommendationChange={(e) =>
                      handleFileChange(e, "recommendation")
                    }
                    onCitizenshipChange={(e) =>
                      handleFileChange(e, "citizenship")
                    }
                    onRemoveRecommendation={() => removeFile("recommendation")}
                    onRemoveCitizenship={() => removeFile("citizenship")}
                  />
                )}
                {currentStep === 7 && (
                  <Step7Declaration
                    form={form}
                    formData={form.getValues()}
                    industries={industries}
                    recommendationFile={recommendationFile}
                    citizenshipFile={citizenshipFile}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onCancelEdit={() => {
                      setIsEditing(false);
                      // Reset to saved values if needed
                    }}
                    onSaveEdit={async () => {
                      // Validate all fields before saving
                      const isValid = await form.trigger();
                      if (isValid) {
                        setIsEditing(false);
                      }
                    }}
                  />
                )}

                {/* Navigation Buttons */}
                {currentStep === 7 && isEditing ? null : (
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

                    {currentStep < 7 ? (
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
                        disabled={
                          isSubmitting || !form.watch("declaration")
                        }
                        className={cn(
                          "flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base",
                          !form.watch("declaration") &&
                            "disabled:opacity-50 disabled:pointer-events-none"
                        )}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span className="text-xs sm:text-sm">Submitting...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Submit Application</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
