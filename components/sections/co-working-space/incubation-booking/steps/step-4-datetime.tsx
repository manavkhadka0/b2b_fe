"use client";

import { UseFormReturn } from "react-hook-form";
import type { IncubationCenterBookingFormValues } from "@/types/schemas/incubation-center-booking-schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  {
    value: "The Big Brain Room",
    label: "The Big Brain Room (Up to 15 persons)",
  },
  { value: "The Grind Garage", label: "The Grind Garage (Up to 9 persons)" },
  { value: "The Fusion Lab", label: "The Fusion Lab (Up to 4 persons)" },
] as const;

interface Step4DateTimeProps {
  form: UseFormReturn<IncubationCenterBookingFormValues>;
}

export function IncubationStep4DateTime({ form }: Step4DateTimeProps) {
  const bookingDate = form.watch("booking_date");
  const dateObj = bookingDate ? new Date(bookingDate) : undefined;
  const bookingType = form.watch("booking_type");

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">3) Booking Details</h2>

      {bookingType === "Co-working Seat" && (
        <>
          <FormField
            control={form.control}
            name="no_of_seats"
            render={({ field }) => (
              <FormItem>
                <label className="text-sm font-medium mb-2 block">
                  Number of Seats Needed (1–9)
                </label>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={9}
                    placeholder="e.g. 2"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? null : parseInt(val, 10));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-3">
            Co-working is a shared space. Multiple startups/individuals can book
            seats at the same time, up to 9 seats per time slot.
          </p>
        </>
      )}

      {bookingType === "Private Room" && (
        <>
          <FormField
            control={form.control}
            name="room_category"
            render={({ field }) => (
              <FormItem>
                <label className="text-sm font-medium mb-2 block">
                  Room Category *
                </label>
                <Select
                  value={field.value ?? ""}
                  onValueChange={(val) =>
                    field.onChange(val === "" ? null : val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOMS.map((room) => (
                      <SelectItem key={room.value} value={room.value}>
                        {room.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="no_of_participants"
            render={({ field }) => (
              <FormItem>
                <label className="text-sm font-medium mb-2 block">
                  No. of Participants
                </label>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? null : parseInt(val, 10));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      <FormField
        control={form.control}
        name="booking_date"
        render={({ field }) => (
          <FormItem>
            <label className="text-sm font-medium mb-2 block">
              Booking Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
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
          Time Slot (3 Hours slot)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="start_time"
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
                        form.setValue("end_time", add3Hours(val));
                      } else {
                        form.setValue("end_time", "");
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
            name="end_time"
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
                        form.setValue("start_time", subtract3Hours(val));
                      } else {
                        form.setValue("start_time", "");
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
    </div>
  );
}
