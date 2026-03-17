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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Building,
  Briefcase,
  FileText,
  Edit,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InternshipFormValues } from "../types";
import { Step1ApplicantDetails } from "./Step1ApplicantDetails";
import { Step2EducationDetails } from "./Step2EducationDetails";
import { Step3SupervisorDetails } from "./Step3SupervisorDetails";
import { Step4InternshipPreferences } from "./Step4InternshipPreferences";
import { Step5Motivation } from "./Step5Motivation";
import { Step6Documents } from "./Step6Documents";
import {
  getProvinces,
  getDistricts,
  getMunicipalities,
} from "@manavkhadka0/nepal-address";

interface Industry {
  id: number;
  name: string;
  description: string;
  link: string;
  slug: string;
}

interface Step7DeclarationProps {
  form: UseFormReturn<InternshipFormValues>;
  formData: InternshipFormValues;
  industries: Industry[];
  recommendationFile: File | null;
  citizenshipFile: File | null;
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
  industries,
  recommendationFile,
  citizenshipFile,
  isEditing,
  onEdit,
  onCancelEdit,
  onSaveEdit,
}: Step7DeclarationProps) {
  const provinces = getProvinces();
  const permanentDistrict = formData.permanentDistrict
    ? getDistricts(formData.permanentProvince)[0]
    : null;
  const permanentMunicipality = formData.permanentMunicipality
    ? getMunicipalities(formData.permanentDistrict)[0]
    : null;

  const selectedIndustry = industries.find(
    (ind) => ind.id.toString() === formData.preferredIndustry
  );

  const getWordCount = (html: string | undefined): number => {
    if (!html) return 0;
    const text = html.replace(/<[^>]*>/g, " ").trim();
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const wordCount = getWordCount(formData.motivationalLetter);

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
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSaveEdit}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Show all steps for editing */}
        <div className="space-y-8">
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
              Education Details
            </h4>
            <Step2EducationDetails form={form} />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Supervisor Details
            </h4>
            <Step3SupervisorDetails form={form} />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Internship Preferences
            </h4>
            <Step4InternshipPreferences
              form={form}
              industries={industries}
              isLoadingIndustries={false}
            />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Motivational Letter
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
            label="Permanent Address"
            value={`${
              formData.permanentWard ? `Ward ${formData.permanentWard}, ` : ""
            }${formData.permanentMunicipality || ""}, ${
              formData.permanentDistrict || ""
            }, ${formData.permanentProvince || ""}`}
          />
          {(formData.currentProvince ||
            formData.currentDistrict ||
            formData.currentMunicipality ||
            formData.currentWard) && (
            <ReviewField
              label="Current Address"
              value={`${
                formData.currentWard ? `Ward ${formData.currentWard}, ` : ""
              }${formData.currentMunicipality || ""}, ${
                formData.currentDistrict || ""
              }, ${formData.currentProvince || ""}`}
            />
          )}
          <ReviewField label="Contact Number" value={formData.contactNumber} />
          <ReviewField label="Email" value={formData.email} />
          <ReviewField
            label="Date of Birth"
            value={formData.dateOfBirth}
            optional
          />
        </ReviewSection>

        {/* Education Details */}
        <ReviewSection title="Education Details" icon={GraduationCap}>
          <ReviewField label="Institution" value={formData.institution} />
          <ReviewField
            label="Qualification"
            value={formData.courseOrQualification}
          />
          <ReviewField
            label="Year of Completion"
            value={formData.yearOfCompletion}
            optional
          />
          <ReviewField
            label="Course Highlights"
            value={formData.courseHighlights}
            optional
          />
        </ReviewSection>

        {/* Supervisor Details */}
        <ReviewSection title="Supervisor Details" icon={Building}>
          <ReviewField
            label="Supervisor Name"
            value={formData.supervisorName}
          />
          <ReviewField
            label="Supervisor Email"
            value={formData.supervisorEmail}
          />
          <ReviewField
            label="Supervisor Mobile"
            value={formData.supervisorMobile}
          />
        </ReviewSection>

        {/* Internship Preferences */}
        <ReviewSection title="Internship Preferences" icon={Briefcase}>
          <ReviewField
            label="Preferred Industry"
            value={selectedIndustry?.name || formData.preferredIndustry}
          />
          <ReviewField
            label="Preferred Department"
            value={formData.preferredDepartment}
            optional
          />
          <ReviewField
            label="Duration"
            value={
              formData.internshipDuration && formData.durationUnit
                ? `${formData.internshipDuration} ${formData.durationUnit}`
                : null
            }
          />
          <ReviewField
            label="Preferred Month"
            value={formData.preferredMonth}
          />
          <ReviewField
            label="Preferred Start Date"
            value={formData.preferredStartDate}
            optional
          />
          <ReviewField label="Availability" value={formData.availability} />
        </ReviewSection>

        {/* Motivational Letter */}
        <ReviewSection title="Motivational Letter" icon={FileText}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-600">
              Word Count: {wordCount} words
            </span>
            {formData.motivationalLetter && (
              <div
                className="text-sm text-gray-900 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formData.motivationalLetter,
                }}
              />
            )}
          </div>
        </ReviewSection>

        {/* Documents */}
        <ReviewSection title="Documents" icon={FileText}>
          <ReviewField
            label="Recommendation Letter"
            value={recommendationFile?.name}
            optional
          />
          <ReviewField
            label="Citizenship/ID"
            value={citizenshipFile?.name}
            optional
          />
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
                I confirm the information is true and I agree to follow
                school/college and industry rules, safety requirements, and
                reporting formats. *
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </motion.div>
  );
}
