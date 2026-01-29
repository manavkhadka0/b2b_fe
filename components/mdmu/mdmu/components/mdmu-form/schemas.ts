import { z } from "zod";
import type { IndustryCategory, IndustrySubCategory } from "./types";

// Common validation messages
const REQUIRED_MSG = "This field is required";

// Enums
const ProductMarketEnum = ["Domestic", "International", "Both"] as const;
const MaterialSourceEnum = ["Local", "International", "Both"] as const;
const BooleanStringEnum = ["true", "false"] as const;

// Reusable schemas
const requiredString = z.string().min(1, REQUIRED_MSG);
const booleanString = z.enum(BooleanStringEnum, {
  required_error: REQUIRED_MSG,
});

// FileList validation that works in both server and client
const fileListSchema = z
  .any()
  .optional()
  .refine(
    (val) => {
      if (val === undefined || val === null) return true;
      if (typeof val === "string") return true;
      // Only check FileList in browser environment
      if (typeof window !== "undefined") {
        return val instanceof FileList;
      }
      // On server, accept any value (will be validated on client)
      return true;
    },
    { message: "Must be a file list or string" }
  );

// Address schema
const addressSchema = z.object({
  address_province: requiredString.describe("Province is required"),
  address_district: requiredString.describe("District is required"),
  address_municipality: requiredString.describe("Municipality is required"),
  address_ward: requiredString.describe("Ward is required"),
  address_street: requiredString.describe("Street address is required"),
});

// Contact schema
const contactSchema = z.object({
  contact_name: requiredString.describe("Contact name is required"),
  contact_number: z.string().min(10, "Valid contact number is required"),
  contact_designation: requiredString.describe("Designation is required"),
  contact_alternate_number: z.string().optional(),
  contact_email: z.string().email("Invalid email address").optional(),
});

// Industry category schemas
const industryCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
}) satisfies z.ZodType<IndustryCategory>;

const industrySubCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  category: industryCategorySchema,
}) satisfies z.ZodType<IndustrySubCategory>;

// Business details schema
const businessSchema = z.object({
  nature_of_industry_category: industryCategorySchema,
  nature_of_industry_sub_category: industrySubCategorySchema
    .optional()
    .superRefine((val, ctx) => {
      // We'll validate this in the component using form.setError if needed
      return true;
    }),
  product_market: z.enum(ProductMarketEnum),
  raw_material: z.enum(MaterialSourceEnum),
  industry_size: z
    .enum(["Startup", "Micro", "Cottage", "Small", "Medium", "Large"])
    .describe("Industry size is required"),
});

// Additional information schema
const additionalInfoSchema = z.object({
  member_of_cim: booleanString,
  know_about_mdmu: booleanString,
  already_used_logo: booleanString.optional(),
  interested_in_logo: booleanString.optional(),
  self_declaration: z
    .boolean()
    .optional()
    .superRefine((val, ctx) => {
      const parent = ctx.path[0] as { interested_in_logo?: string };
      if (parent.interested_in_logo === "true" && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "You must agree to the self declaration",
        });
      }
    }),
});

// Main form schema
export const mdmuFormSchema = z
  .object({
    name_of_company: requiredString.describe("Company name is required"),
    company_logo: fileListSchema,
  })
  .merge(addressSchema)
  .merge(contactSchema)
  .merge(businessSchema)
  .merge(additionalInfoSchema);

// Step validation schemas
export const stepValidationSchemas = {
  1: z
    .object({
      name_of_company: requiredString,
      company_logo: fileListSchema,
    })
    .merge(addressSchema),
  2: contactSchema,
  3: businessSchema,
  4: additionalInfoSchema,
  5: z.object({}),
} as const;

// Export types
export type MDMUFormSchema = z.infer<typeof mdmuFormSchema>;
export type StepSchema = typeof stepValidationSchemas;

// Export additional types
export type IndustryCategorySchema = z.infer<typeof industryCategorySchema>;
export type IndustrySubCategorySchema = z.infer<
  typeof industrySubCategorySchema
>;
