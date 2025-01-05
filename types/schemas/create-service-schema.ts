import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  category_id: z.string({
    required_error: "Please select a category",
  }),
});

export type CreateServiceFormValues = z.infer<typeof createServiceSchema>;
