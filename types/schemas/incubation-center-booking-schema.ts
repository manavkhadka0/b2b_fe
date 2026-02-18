import { z } from "zod";

export const incubationCenterBookingSchema = z
  .object({
    booking_type: z.enum(["Co-working Seat", "Private Room"], {
      required_error: "Please select a booking type",
    }),
    full_name: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be no more than 15 characters"),
    address: z.string().min(1, "Address is required"),
    name: z.string().min(1, "Organization/Company name is required"),
    founder_name: z.string().optional(),
    founder_designation: z.string().optional(),
    purpose: z.string().min(1, "Purpose is required"),
    no_of_seats: z.coerce.number().int().min(1).max(9).optional().nullable(),
    booking_date: z.string().min(1, "Booking date is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
    room_category: z
      .enum([
        "The Big Brain Room",
        "The Grind Garage",
        "The Fusion Lab",
      ])
      .optional()
      .nullable(),
    no_of_participants: z.coerce.number().int().min(0).optional().nullable(),
    wifi: z.boolean().default(false),
    photocopy: z.boolean().default(false),
    printing: z.boolean().default(false),
    interactive_board: z.boolean().default(false),
    whiteboard_marker: z.boolean().default(false),
    tea_coffee_water: z.boolean().default(false),
    other_service: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.booking_type === "Private Room" && !data.room_category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Room selection is required for private room booking",
        path: ["room_category"],
      });
    }
    if (!data.booking_type) return;
    if (
      data.booking_type === "Co-working Seat" &&
      (data.no_of_seats == null || data.no_of_seats < 1 || data.no_of_seats > 9)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Number of seats must be between 1 and 9",
        path: ["no_of_seats"],
      });
    }
  });

export type IncubationCenterBookingFormValues = z.infer<
  typeof incubationCenterBookingSchema
>;
