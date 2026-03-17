"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  User,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Briefcase,
  FileText,
  Edit,
  Building,
  MapPin,
} from "lucide-react";
import type { ApprenticeshipFormValues } from "../types";
import { Step1ApplicantDetails } from "./Step1ApplicantDetails";
import { Step2EducationEligibility } from "./Step2EducationEligibility";
import { Step3TradeInstitute } from "./Step3TradeInstitute";
import { Step4IndustryPlacement } from "./Step4IndustryPlacement";
import { Step5Motivation } from "./Step5Motivation";
import { Step6Documents } from "./Step6Documents";

interface Industry {
  id: number;
  name: string;
  description: string;
  link: string;
  slug: string;
}

interface Step7DeclarationProps {
  form: UseFormReturn<ApprenticeshipFormValues>;
  formData: ApprenticeshipFormValues;
  citizenshipFile: File | null;
  supportingCertificatesFiles: File[];
  industries: Industry[];
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

const ReviewSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 pb-2 border-b">
      <Icon className="h-5 w-5 text-blue-600" />
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="space-y-2 pl-7">{children}</div>
  </div>
);

const ReviewField = ({
  label,
  value,
  optional = false,
}: {
  label: string;
  value: string | null | undefined;
  optional?: boolean;
}) => {
  if (optional && !value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
      <span className="text-sm font-medium text-gray-600 min-w-[140px]">
        {label}:
      </span>
      <span className="text-sm text-gray-900 flex-1">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </span>
    </div>
  );
};

export function Step7Declaration({
  form,
  formData,
  citizenshipFile,
  supportingCertificatesFiles,
  industries,
  isEditing,
  onEdit,
  onCancelEdit,
  onSaveEdit,
}: Step7DeclarationProps) {
  const getWordCount = (html: string | undefined): number => {
    if (!html) return 0;
    const text = html.replace(/<[^>]*>/g, " ").trim();
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const wordCount = getWordCount(formData.motivationLetter);

  const getIndustryName = (id: string) => {
    const industry = industries.find((ind) => ind.id.toString() === id);
    return industry?.name || id;
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Edit Application
          </h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEdit}
              className="flex items-center gap-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSaveEdit}
              className="flex items-center gap-2"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Applicant Details
            </h4>
            <Step1ApplicantDetails form={form} />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education & Eligibility
            </h4>
            <Step2EducationEligibility form={form} />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Trade & Institute Selection
            </h4>
            <Step3TradeInstitute form={form} />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Industry Placement Preferences
            </h4>
            <Step4IndustryPlacement
              form={form}
              industries={industries}
              isLoadingIndustries={false}
            />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Motivation Letter
            </h4>
            <Step5Motivation form={form} wordCount={wordCount} />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Review Your Application
        </h3>
        <p className="text-sm text-blue-800">
          Please review all the information you have provided before submitting
          your application. Click "Edit" to make changes.
        </p>
      </div>

      <div className="space-y-6">
        {/* Applicant Details */}
        <ReviewSection title="Applicant Details" icon={User}>
          <ReviewField label="Full Name" value={formData.fullName} />
          <ReviewField
            label="Address"
            value={`Ward ${formData.addressWard}, ${formData.addressMunicipality}, ${formData.addressDistrict}, ${formData.addressProvince}`}
          />
          <ReviewField label="Mobile Number" value={formData.mobileNumber} />
          <ReviewField label="Email" value={formData.email} />
          <ReviewField label="Date of Birth" value={formData.dateOfBirth} />
          <ReviewField label="Gender" value={formData.gender} />
        </ReviewSection>

        {/* Education & Eligibility */}
        <ReviewSection title="Education & Eligibility" icon={GraduationCap}>
          <ReviewField
            label="Education Level"
            value={formData.educationLevel}
          />
          <ReviewField label="School Name" value={formData.schoolName} />
          <ReviewField
            label="Year of SEE Completion"
            value={formData.yearOfSeeCompletion}
          />
        </ReviewSection>

        {/* Trade & Institute Selection */}
        <ReviewSection title="Trade & Institute Selection" icon={Briefcase}>
          <ReviewField label="Trade/Field" value={formData.trade} />
          <ReviewField
            label="Preferred Training Provider"
            value={formData.preferredTrainingProvider}
          />
        </ReviewSection>

        {/* Industry Placement Preferences */}
        <ReviewSection title="Industry Placement Preferences" icon={Building}>
          <ReviewField
            label="1st Preference Industry"
            value={
              formData.industryPreference1
                ? getIndustryName(formData.industryPreference1)
                : null
            }
          />
          <ReviewField
            label="2nd Preference Industry"
            value={
              formData.industryPreference2
                ? getIndustryName(formData.industryPreference2)
                : null
            }
            optional
          />
          <ReviewField
            label="3rd Preference Industry"
            value={
              formData.industryPreference3
                ? getIndustryName(formData.industryPreference3)
                : null
            }
            optional
          />
          <ReviewField
            label="Preferred Location"
            value={formData.preferredLocation || undefined}
            optional
          />
        </ReviewSection>

        {/* Motivation Letter */}
        <ReviewSection title="Motivation Letter" icon={FileText}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-600">
              Word Count: {wordCount} words
            </span>
            {formData.motivationLetter && (
              <div
                className="text-sm text-gray-900 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formData.motivationLetter,
                }}
              />
            )}
          </div>
        </ReviewSection>

        {/* Documents */}
        <ReviewSection title="Documents" icon={FileText}>
          <ReviewField
            label="Citizenship"
            value={citizenshipFile?.name}
            optional
          />
          {supportingCertificatesFiles.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-600">
                Supporting Certificates:
              </span>
              {supportingCertificatesFiles.map((file, index) => (
                <div key={index} className="text-sm text-gray-900 pl-4">
                  • {file.name}
                </div>
              ))}
            </div>
          )}
        </ReviewSection>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Application
        </Button>
      </div>

      <FormField
        control={form.control}
        name="declaration"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-normal">
                I confirm the information is true. I understand that industry
                placement assurance depends on seat availability and matching. I
                agree to follow industry rules, safety requirements, and
                institute/program procedures. *
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </motion.div>
  );
}
