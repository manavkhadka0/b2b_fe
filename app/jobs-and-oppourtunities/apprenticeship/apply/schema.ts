import { z } from "zod";

// Validation Schema for Apprenticeship Application
export const apprenticeshipFormSchema = z.object({
  // Step 1: Applicant Details
  fullName: z.string().min(2, "Full name is required"),
  mobileNumber: z
    .string()
    .min(10, "Valid mobile number is required")
    .max(15, "Mobile number must not exceed 15 characters"),
  email: z.string().email("Valid email is required"),
  addressProvince: z.string().min(1, "Province is required"),
  addressDistrict: z.string().min(1, "District is required"),
  addressMunicipality: z.string().min(1, "Municipality is required"),
  addressWard: z.string().min(1, "Ward is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),

  // Step 2: Education & Eligibility
  educationLevel: z.enum(["Grade 10", "SEE completed"], {
    required_error: "Education level is required",
  }),
  schoolName: z.string().min(2, "School name is required"),
  yearOfSeeCompletion: z.string().min(4, "Year of SEE completion is required"),

  // Step 3: Trade & Institute Selection
  trade: z.enum(
    [
      "Mechanical",
      "Automobile",
      "Electrical",
      "Civil",
      "IT",
      "Hotel Mgmt.",
      "ECD",
      "Tea Technology",
    ],
    {
      required_error: "Trade/Field is required",
    }
  ),
  preferredTrainingProvider: z.enum(
    [
      "Manamohan Memorial Polytechnic — Mechanical Engineering, Automobile Engineering, Electrical Engineering (Budiganga, Morang)",
      "Ratna Kumar Bantawa Bahuprabidhik Shikshyalaya — Information Technology (Kankai, Jhapa)",
      "Ratna Kumar Bantawa Bahuprabidhik Shikshyalaya — Information Technology (Jahada, Morang)",
      "Ratna Kumar Bantawa Bahuprabidhik Shikshyalaya — Information Technology (Damak, Jhapa)",
      "Nara Bahadur Karmacharya Bahuprabidhik Shikshyalaya — Hotel Management (Itahari, Sunsari)",
      "Aadarsha School — Information Technology, Early Childhood Development (Biratnagar, Morang)",
      "Ratna Kumar Bantawa Bahuprabidhik Shikshyalaya — Tea Technology (Ilam)",
    ],
    {
      required_error: "Preferred training provider is required",
    }
  ),

  // Step 4: Requested Industry for Placement
  industryPreference1: z
    .string()
    .min(1, "First preference industry is required")
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: "Invalid industry selected",
    }),
  industryPreference2: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseInt(val, 10)), {
      message: "Invalid industry selected",
    }),
  industryPreference3: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseInt(val, 10)), {
      message: "Invalid industry selected",
    }),
  preferredLocation: z.string().optional(),

  // Step 5: Motivation Letter
  motivationLetter: z.string().refine(
    (val) => {
      if (!val) return false;
      // Strip HTML tags and count words
      const text = val.replace(/<[^>]*>/g, " ").trim();
      const words = text.split(/\s+/).filter((word) => word.length > 0);
      return words.length >= 150 && words.length <= 300;
    },
    {
      message: "Motivation letter must be between 150-300 words",
    }
  ),

  // Step 6: Upload Documents
  citizenship: z.instanceof(File).optional(),
  supportingCertificates: z.array(z.instanceof(File)).optional(),

  // Step 7: Declaration
  declaration: z.boolean().refine((val) => val === true, {
    message: "You must agree to the declaration",
  }),
});
