import { z } from "zod";

export const rosterFormSchema = z.object({
  // Step 1: Basic info
  institute: z.union([z.number(), z.string()]).optional().nullable(),
  name: z.string().min(1, "Name is required"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .max(15, "Ensure this field has no more than 15 characters."),
  email: z.string().email("Valid email is required"),
  gender: z.string().min(1, "Gender is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),

  // Step 2: Permanent address
  permanent_province: z.string().min(1, "Province is required"),
  permanent_district: z.string().min(1, "District is required"),
  permanent_municipality: z.string().min(1, "Municipality is required"),
  permanent_ward: z.string().min(1, "Ward is required"),

  // Step 3: Current address
  sameAsPermanent: z.boolean().optional(),
  current_province: z.string().optional(),
  current_district: z.string().optional(),
  current_municipality: z.string().optional(),
  current_ward: z.string().optional(),

  // Step 4: Education
  level_completed: z.string().optional().nullable(),
  subject_trade_stream: z.string().optional().nullable(),
  specialization_key_skills: z.string().optional().nullable(),
  passed_year: z.coerce.number().optional().nullable(),
  certifying_agency: z.string().optional().nullable(),
  certifying_agency_name: z.string().optional().nullable(),
  certificate_id: z.string().optional().nullable(),

  // Step 5: Job availability
  job_status: z.enum(["Available for Job", "Not Available"]),
  available_from: z.string().optional().nullable(),

  // Step 6: Declaration
  declaration: z.boolean().refine((val) => val === true, {
    message: "You must agree to the declaration",
  }),
});
