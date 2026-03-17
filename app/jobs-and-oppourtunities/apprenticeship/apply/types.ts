import { z } from "zod";
import { apprenticeshipFormSchema } from "./schema";

export type ApprenticeshipFormValues = z.infer<typeof apprenticeshipFormSchema>;
