"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { rescheduleRequestSchema } from "@/types/schemas/reschedule-request-schema";
import type { RescheduleRequestFormValues } from "@/types/schemas/reschedule-request-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createRescheduleRequest } from "@/services/rescheduleRequest";
import { Input } from "@/components/ui/input";

const THREE_HOURS_MINUTES = 180;

function add3Hours(time: string): string {
  const parts = time.split(":");
  const h = parseInt(parts[0] ?? "0", 10);
  const m = parseInt(parts[1] ?? "0", 10);
  const totalMinutes = h * 60 + m + THREE_HOURS_MINUTES;
  if (totalMinutes >= 24 * 60) return "23:30";
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`;
}

function subtract3Hours(time: string): string {
  const parts = time.split(":");
  const h = parseInt(parts[0] ?? "0", 10);
  const m = parseInt(parts[1] ?? "0", 10);
  const totalMinutes = h * 60 + m - THREE_HOURS_MINUTES;
  const newH = Math.max(0, Math.floor(totalMinutes / 60));
  const newM = totalMinutes < 0 ? 0 : totalMinutes % 60;
  return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`;
}

const TIME_INPUT_CLASS =
  "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none";

const ROOMS = [
  { value: "The Big Brain Room", label: "The Big Brain Room (Up to 15 persons)" },
  { value: "The Grind Garage", label: "The Grind Garage (Up to 9 persons)" },
  { value: "The Fusion Lab", label: "The Fusion Lab (Up to 4 persons)" },
] as const;

interface RescheduleFormProps {
  bookingId: number;
}

function ThankYouSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="mb-6"
            >
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            >
              Reschedule Request Submitted
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-6"
            >
              Your reschedule request has been submitted. We will review and
              contact you shortly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <Button variant="outline" asChild>
                <Link href="/co-working-space">
                  Return to Co-Working Space
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function RescheduleForm({ bookingId }: RescheduleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<RescheduleRequestFormValues>({
    resolver: zodResolver(rescheduleRequestSchema),
    defaultValues: {
      new_booking_date: "",
      new_start_time: "",
      new_end_time: "",
      new_room_category: null,
      new_booking_type: null,
      reason: "",
    },
  });

  const onSubmit = async (data: RescheduleRequestFormValues) => {
    setIsSubmitting(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      await createRescheduleRequest(
        {
          booking: bookingId,
          new_booking_date: data.new_booking_date || null,
          new_start_time: data.new_start_time || null,
          new_end_time: data.new_end_time || null,
          new_room_category: data.new_room_category ?? null,
          new_booking_type: data.new_booking_type ?? null,
          reason: data.reason || null,
        },
        token
      );

      toast.success("Reschedule request submitted!");
      form.reset();
      setSuccess(true);
    } catch (error) {
      console.error("Failed to submit reschedule:", error);
      toast.error("Failed to submit reschedule request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return <ThankYouSection />;
  }

  const bookingDate = form.watch("new_booking_date");
  const dateObj = bookingDate ? new Date(bookingDate) : undefined;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="new_booking_date"
            render={({ field }) => (
              <FormItem>
                <label className="text-sm font-medium mb-2 block">
                  New Booking Date *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(new Date(field.value), "PPP")
                          : "Pick a date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateObj}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <label className="text-sm font-medium mb-2 block">
              New Time Slot (3 Hours slot) (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="new_start_time"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium mb-2 block">
                      From
                    </label>
                    <FormControl>
                      <Input
                        type="time"
                        step="1800"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val);
                          if (val) {
                            form.setValue("new_end_time", add3Hours(val));
                          } else {
                            form.setValue("new_end_time", "");
                          }
                        }}
                        className={TIME_INPUT_CLASS}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_end_time"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium mb-2 block">
                      To
                    </label>
                    <FormControl>
                      <Input
                        type="time"
                        step="1800"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val);
                          if (val) {
                            form.setValue("new_start_time", subtract3Hours(val));
                          } else {
                            form.setValue("new_start_time", "");
                          }
                        }}
                        className={TIME_INPUT_CLASS}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="new_room_category"
            render={({ field }) => (
              <FormItem>
                <label className="text-sm font-medium mb-2 block">
                  New Room (Optional)
                </label>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                  >
                    <option value="">Keep current room</option>
                    {ROOMS.map((room) => (
                      <option key={room.value} value={room.value}>
                        {room.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <label className="text-sm font-medium mb-2 block">
                  Reason for Reschedule *
                </label>
                <FormControl>
                  <textarea
                    placeholder="Please explain why you need to reschedule..."
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            asChild
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            <Link href="/co-working-space">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Reschedule Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
