import { z } from "zod";

export const experienceZoneBookingSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["Product", "Service"], {
      required_error: "Please select a type",
    }),
    product: z.string().optional(),
    service: z.string().optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    contact_person: z.string().min(2, "Contact person is required"),
    designation: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    alternate_no: z.string().optional(),
    company_name: z.string().min(1, "Company name is required"),
    country: z.enum(["Nepal", "Others"], {
      required_error: "Please select a country",
    }),
    address: z.string().min(1, "Address is required"),
    province: z.string().optional(),
    district: z.string().optional(),
    municipality: z.string().optional(),
    ward: z.string().optional(),
    company_website: z.string().optional().or(z.literal("")),
    preferred_month: z.string().min(1, "Preferred month is required"),
  })
  .superRefine((data, ctx) => {
    if (data.country !== "Nepal") return;
    if (!data.province || data.province.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Province is required",
        path: ["province"],
      });
    }
    if (!data.district || data.district.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "District is required",
        path: ["district"],
      });
    }
    if (!data.municipality || data.municipality.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Municipality is required",
        path: ["municipality"],
      });
    }
    if (!data.ward || data.ward.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ward is required",
        path: ["ward"],
      });
    }
  });

export type ExperienceZoneBookingFormValues = z.infer<
  typeof experienceZoneBookingSchema
>;
