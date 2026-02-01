import { stepValidationSchemas } from "./schemas";
import type { MDMUFormData } from "./types";

export const validateStepData = async (
  step: keyof typeof stepValidationSchemas,
  data: Omit<
    MDMUFormData,
    "nature_of_industry_category" | "nature_of_industry_sub_category"
  > & {
    nature_of_industry_category: number;
    nature_of_industry_sub_category: number | null;
  }
) => {
  const schema = stepValidationSchemas[step];
  const fields = Object.keys(schema.shape);

  const stepData = fields.reduce((acc, field) => {
    const key = field as keyof typeof schema.shape;
    acc[key] = data[key];
    return acc;
  }, {} as any);

  return schema.safeParseAsync(stepData);
};
