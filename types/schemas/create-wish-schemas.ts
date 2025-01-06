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
    // Conditional validation for product/service
    product: z.string().optional(),
    service: z.string().optional(),
    full_name: z.string().min(2, "Full name is required"),
    designation: z
      .string()
      .min(1, "Designation is required")
      .refine(
        (data) => designationOptions.some((option) => option.value === data),
        {
          message: "Invalid designation",
        }
      ),
    email: z.string().email("Invalid email address"),
    mobile_no: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
    alternate_no: z.string().optional(),
    company_name: z.string().min(1, "Company name is required"),
    address: z.string().min(1, "Address is required"),
    province: z.string().min(1, "Province is required"),
    municipality: z.string().min(1, "Municipality is required"),
    ward: z.string().min(1, "Ward is required"),
    company_website: z.string().url("Invalid URL").optional().or(z.literal("")),
    images: z.array(z.string()).optional(),
    event_id: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "Product") {
        return !!data.product;
      }
      if (data.type === "Service") {
        return !!data.service;
      }
      return false;
    },
    {
      message: "Please select a product or service based on your wish type",
      path: ["product", "service"], // This will show the error on both fields
    }
  );
