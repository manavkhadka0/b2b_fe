import { z } from "zod";
import { internshipFormSchema } from "./schema";

export type InternshipFormValues = z.infer<typeof internshipFormSchema>;
