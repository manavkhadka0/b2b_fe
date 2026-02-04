import { z } from "zod";

// Validation Schema matching Django serializer
export const internshipFormSchema = z.object({
  // Step 1: Applicant Details
  fullName: z.string().min(2, "Full name is required"),
  permanentProvince: z.string().min(1, "Province is required"),
  permanentDistrict: z.string().min(1, "District is required"),
  permanentMunicipality: z.string().min(1, "Municipality is required"),
  permanentWard: z.string().min(1, "Ward is required"),
  currentProvince: z.string().optional(),
  currentDistrict: z.string().optional(),
  currentMunicipality: z.string().optional(),
  currentWard: z.string().optional(),
  contactNumber: z
    .string()
    .min(10, "Valid contact number is required")
    .max(15, "Contact number must not exceed 15 characters"),
  email: z.string().email("Valid email is required"),
  dateOfBirth: z.string().optional(),

  // Step 2: Education & School/College Details (matching CV EducationForm)
  institution: z.string().min(2, "Institution is required"),
  courseOrQualification: z.string().min(1, "Qualification is required"),
  yearOfCompletion: z.string().optional(),
  courseHighlights: z.string().optional(),

  // Step 3: College Supervisor / Focal Person Details
  supervisorName: z.string().min(2, "Supervisor name is required"),
  supervisorEmail: z.string().email("Valid email is required"),
  supervisorMobile: z.string().min(10, "Valid mobile number is required"),

  // Step 4: Internship Preferences
  preferredIndustry: z.string().min(1, "Preferred industry is required"),
  preferredDepartment: z.string().optional(),
  internshipDuration: z.string().min(1, "Internship duration is required"),
  durationUnit: z.enum(["weeks", "months", "hours"]),
  preferredMonth: z.string().min(1, "Preferred month is required"),
  preferredStartDate: z.string().optional(),
  availability: z.enum(["Full Time", "Part Time", "Contract", "Internship"]),

  // Step 5: Motivation
  motivationalLetter: z.string().refine(
    (val) => {
      if (!val) return false;
      // Strip HTML tags and count words
      const text = val.replace(/<[^>]*>/g, " ").trim();
      const words = text.split(/\s+/).filter((word) => word.length > 0);
      return words.length >= 150 && words.length <= 1000;
    },
    {
      message: "Motivational letter must be between 150-1000 words",
    }
  ),

  // Step 6: Documents
  recommendationLetter: z.instanceof(File).optional(),
  citizenshipId: z.instanceof(File).optional(),

  // Step 7: Declaration
  declaration: z.boolean().refine((val) => val === true, {
    message: "You must agree to the declaration",
  }),
});
