"use client";

import { UseFormReturn } from "react-hook-form";
import type { ExperienceZoneBookingFormValues } from "@/types/experience-zone-booking-type";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FloatingInput } from "@/components/ui/floatingInput";
import { FloatingLabel } from "@/components/ui/floatingInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const getMonthOptions = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  const options: { value: string; label: string }[] = [];

  // Current year: only months from current onwards
  MONTHS.forEach((mo) => {
    if (parseInt(mo.value, 10) >= currentMonth) {
      options.push({
        value: `${currentYear}-${mo.value}`,
        label: `${mo.label} ${currentYear}`,
      });
    }
  });

  // Next year: all months
  MONTHS.forEach((mo) => {
    options.push({
      value: `${currentYear + 1}-${mo.value}`,
      label: `${mo.label} ${currentYear + 1}`,
    });
  });

  return options;
};

interface ZoneStep4PersonalProps {
  form: UseFormReturn<ExperienceZoneBookingFormValues>;
}

export function ZoneStep4Personal({ form }: ZoneStep4PersonalProps) {
  const monthOptions = getMonthOptions();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="contact_person"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput
                    id="contact-person"
                    placeholder=" "
                    {...field}
                  />
                  <FloatingLabel htmlFor="contact-person">
                    Contact Person
                  </FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput id="designation" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="designation">
                    Designation (Optional)
                  </FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput
                    type="email"
                    id="email"
                    placeholder=" "
                    {...field}
                  />
                  <FloatingLabel htmlFor="email">Email Address</FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput id="phone" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="phone">Phone Number</FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alternate_no"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput id="alternate-no" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="alternate-no">
                    Alternate Number (Optional)
                  </FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferred_month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Month</FormLabel>
              <Select
                value={field.value ? field.value.slice(0, 7) : ""}
                onValueChange={(val) => {
                  const [y, m] = val.split("-");
                  field.onChange(`${y}-${m}-01`);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
