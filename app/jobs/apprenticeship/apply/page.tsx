"use client";

import { useState, useEffect } from "react";
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
  Briefcase,
  Building,
  FileText,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apprenticeshipFormSchema } from "./schema";
import type { ApprenticeshipFormValues } from "./types";
import { Step1ApplicantDetails } from "./components/Step1ApplicantDetails";
import { Step2EducationEligibility } from "./components/Step2EducationEligibility";
import { Step3TradeInstitute } from "./components/Step3TradeInstitute";
import { Step4IndustryPlacement } from "./components/Step4IndustryPlacement";
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
    title: "Education & Eligibility",
    description: "Education information",
    icon: GraduationCap,
  },
  {
    title: "Trade & Institute",
    description: "Select trade and institute",
    icon: Briefcase,
  },
  {
    title: "Industry Placement",
    description: "Industry preferences",
    icon: Building,
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

export default function ApprenticeshipApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [citizenshipFile, setCitizenshipFile] = useState<File | null>(null);
  const [supportingCertificatesFiles, setSupportingCertificatesFiles] =
    useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [isLoadingIndustries, setIsLoadingIndustries] = useState(true);

  const form = useForm<ApprenticeshipFormValues>({
    resolver: zodResolver(apprenticeshipFormSchema),
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      addressProvince: "",
      addressDistrict: "",
      addressMunicipality: "",
      addressWard: "",
      dateOfBirth: "",
      gender: "Male",
      educationLevel: "Grade 10",
      schoolName: "",
      yearOfSeeCompletion: "",
      trade: "Mechanical",
      preferredTrainingProvider:
        "Manamohan Memorial Polytechnic — Mechanical Engineering, Automobile Engineering, Electrical Engineering (Budiganga, Morang)",
      industryPreference1: "",
      industryPreference2: undefined,
      industryPreference3: undefined,
      preferredLocation: undefined,
      motivationLetter: "",
      supportingCertificates: [],
      declaration: false,
    },
  });

  // Fetch industries on component mount
  useEffect(() => {
    const fetchIndustries = async () => {
      setIsLoadingIndustries(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/industries/`
        );
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
    };

    fetchIndustries();
  }, []);

  const getFieldsForStep = (
    step: number
  ): (keyof ApprenticeshipFormValues)[] => {
    switch (step) {
      case 1:
        return [
          "fullName",
          "mobileNumber",
          "email",
          "addressProvince",
          "addressDistrict",
          "addressMunicipality",
          "addressWard",
          "dateOfBirth",
          "gender",
        ];
      case 2:
        return ["educationLevel", "schoolName", "yearOfSeeCompletion"];
      case 3:
        return ["trade", "preferredTrainingProvider"];
      case 4:
        return ["industryPreference1"];
      case 5:
        return ["motivationLetter"];
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

  const wordCount = getWordCount(form.watch("motivationLetter"));

  const onSubmit = async (data: ApprenticeshipFormValues) => {
    setIsSubmitting(true);
    try {
      // Create FormData
      const formData = new FormData();

      // Map fields to Django serializer field names
      formData.append("full_name", data.fullName);
      formData.append("mobile_number", data.mobileNumber);
      formData.append("email_address", data.email);
      if (data.addressProvince) {
        formData.append("province", data.addressProvince);
      }
      if (data.addressDistrict) {
        formData.append("district", data.addressDistrict);
      }
      if (data.addressMunicipality) {
        formData.append("municipality", data.addressMunicipality);
      }
      if (data.addressWard) {
        formData.append("ward", data.addressWard);
      }
      formData.append("date_of_birth", data.dateOfBirth);
      formData.append("gender", data.gender);

      // Education & Eligibility
      formData.append("education_level", data.educationLevel);
      formData.append("school_name", data.schoolName);
      formData.append("year_of_see_completion", data.yearOfSeeCompletion);

      // Trade & Institute
      formData.append("trade", data.trade);
      formData.append(
        "preferred_training_provider",
        data.preferredTrainingProvider
      );

      // Industry Placement - convert string IDs to numbers
      const industry1Id = parseInt(data.industryPreference1, 10);
      if (!isNaN(industry1Id)) {
        formData.append("industry_preference_1", industry1Id.toString());
      }
      if (data.industryPreference2) {
        const industry2Id = parseInt(data.industryPreference2, 10);
        if (!isNaN(industry2Id)) {
          formData.append("industry_preference_2", industry2Id.toString());
        }
      }
      if (data.industryPreference3) {
        const industry3Id = parseInt(data.industryPreference3, 10);
        if (!isNaN(industry3Id)) {
          formData.append("industry_preference_3", industry3Id.toString());
        }
      }
      if (data.preferredLocation) {
        formData.append("preferred_location", data.preferredLocation);
      }

      // Motivation Letter
      if (data.motivationLetter) {
        formData.append("motivation_letter", data.motivationLetter);
      }

      // Documents - append files to FormData
      if (citizenshipFile && citizenshipFile instanceof File) {
        formData.append("citizenship", citizenshipFile);
      }

      // Supporting certificates - append as "documents"
      if (supportingCertificatesFiles.length > 0) {
        supportingCertificatesFiles.forEach((file) => {
          if (file instanceof File) {
            formData.append("documents", file);
          }
        });
      }

      // Make API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/apprenticeship/apply/`,
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
      setCitizenshipFile(null);
      setSupportingCertificatesFiles([]);
      setCurrentStep(1);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCitizenshipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file instanceof File) {
      setCitizenshipFile(file);
      form.setValue("citizenship", file);
    }
  };

  const handleSupportingCertificatesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...supportingCertificatesFiles, ...files];
      setSupportingCertificatesFiles(newFiles);
      form.setValue("supportingCertificates", newFiles);
    }
  };

  const removeCitizenship = () => {
    setCitizenshipFile(null);
    form.setValue("citizenship", undefined);
  };

  const removeSupportingCertificate = (index: number) => {
    const newFiles = supportingCertificatesFiles.filter((_, i) => i !== index);
    setSupportingCertificatesFiles(newFiles);
    form.setValue("supportingCertificates", newFiles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent mb-2">
            Apprenticeship Program Application
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Complete all steps to submit your application for Industry Placement
            Assurance
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
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
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">
                Step {currentStep} of {STEPS.length}
              </span>
              <span className="text-sm text-gray-500">
                {STEPS[currentStep - 1].title}
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">
              {STEPS[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Step Components */}
                {currentStep === 1 && <Step1ApplicantDetails form={form} />}
                {currentStep === 2 && <Step2EducationEligibility form={form} />}
                {currentStep === 3 && <Step3TradeInstitute form={form} />}
                {currentStep === 4 && (
                  <Step4IndustryPlacement
                    form={form}
                    industries={industries}
                    isLoadingIndustries={isLoadingIndustries}
                  />
                )}
                {currentStep === 5 && (
                  <Step5Motivation form={form} wordCount={wordCount} />
                )}
                {currentStep === 6 && (
                  <Step6Documents
                    citizenshipFile={citizenshipFile}
                    supportingCertificatesFiles={supportingCertificatesFiles}
                    onCitizenshipChange={handleCitizenshipChange}
                    onSupportingCertificatesChange={
                      handleSupportingCertificatesChange
                    }
                    onRemoveCitizenship={removeCitizenship}
                    onRemoveSupportingCertificate={removeSupportingCertificate}
                  />
                )}
                {currentStep === 7 && (
                  <Step7Declaration
                    form={form}
                    formData={form.getValues()}
                    citizenshipFile={citizenshipFile}
                    supportingCertificatesFiles={supportingCertificatesFiles}
                    industries={industries}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onCancelEdit={() => {
                      setIsEditing(false);
                    }}
                    onSaveEdit={async () => {
                      const isValid = await form.trigger();
                      if (isValid) {
                        setIsEditing(false);
                      }
                    }}
                  />
                )}

                {/* Navigation Buttons */}
                {currentStep === 7 && isEditing ? null : (
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    {currentStep < 7 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={
                          isSubmitting || !form.watch("declaration")
                        }
                        className={cn(
                          "flex items-center gap-2",
                          !form.watch("declaration") &&
                            "disabled:opacity-50 disabled:pointer-events-none"
                        )}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Submit Application
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
