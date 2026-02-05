import { z } from "zod";

export const designationOptions = [
  { value: "CEO", label: "Chief Executive Officer" },
  { value: "CFO", label: "Chief Financial Officer" },
  { value: "CTO", label: "Chief Technology Officer" },
  { value: "CMO", label: "Chief Marketing Officer" },
  { value: "COO", label: "Chief Operating Officer" },
  { value: "CIO", label: "Chief Information Officer" },
  { value: "CSO", label: "Chief Security Officer" },
  { value: "Other", label: "Other" },
] as const;

export const wishTypeOptions = [
  { value: "Product", label: "Product" },
  { value: "Service", label: "Service" },
] as const;

export const createWishOfferSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["Product", "Service"], {
      required_error: "Please select a wish type",
    }),
    // Conditional validation for product/service - now optional
    product: z.string().optional(),
    service: z.string().optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    description: z.string().optional(),
    full_name: z.string().min(2, "Full name is required"),
    designation: z.string().min(1, "Designation is required"),
    email: z.string().email("Invalid email address"),
    mobile_no: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
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
    images: z.array(z.string()).optional(),
    event_id: z.string().optional(),
    wish_id: z.string().optional(),
    offer_id: z.string().optional(),
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
        message: "District is required ",
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

// Simplified schema without company and personal information
export const createWishOfferSimplifiedSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["Product", "Service"], {
    required_error: "Please select a wish type",
  }),
  product: z.string().optional(),
  service: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  event_id: z.string().optional(),
  wish_id: z.string().optional(),
  offer_id: z.string().optional(),
});
