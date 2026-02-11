import type { z } from "zod";
import type { rosterFormSchema } from "./schema";

export type RosterFormValues = z.infer<typeof rosterFormSchema>;
