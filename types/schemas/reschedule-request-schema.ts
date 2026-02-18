import { z } from "zod";

export const rescheduleRequestSchema = z.object({
  new_booking_date: z.string().min(1, "New booking date is required"),
  new_start_time: z.string().optional(),
  new_end_time: z.string().optional(),
  new_room_category: z
    .enum([
      "The Big Brain Room",
      "The Grind Garage",
      "The Fusion Lab",
    ])
    .optional()
    .nullable(),
  new_booking_type: z
    .enum(["Co-working Seat", "Private Room"])
    .optional()
    .nullable(),
  reason: z.string().min(1, "Reason for reschedule is required"),
});

export type RescheduleRequestFormValues = z.infer<
  typeof rescheduleRequestSchema
>;
