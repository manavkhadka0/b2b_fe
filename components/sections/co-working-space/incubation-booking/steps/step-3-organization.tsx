"use client";

import { UseFormReturn } from "react-hook-form";
import type { IncubationCenterBookingFormValues } from "@/types/schemas/incubation-center-booking-schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingInput } from "@/components/ui/floatingInput";
import { FloatingLabel } from "@/components/ui/floatingInput";
import { Textarea } from "@/components/ui/textarea";

interface Step3OrganizationProps {
  form: UseFormReturn<IncubationCenterBookingFormValues>;
}

export function IncubationStep3Organization({ form }: Step3OrganizationProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        2) Company / Idea Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative py-3">
                  <FloatingInput id="org-name" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="org-name">
                    Company / Startup / Idea Name
                  </FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="founder_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative py-3">
                  <FloatingInput
                    id="founder-name"
                    placeholder=" "
                    {...field}
                    value={field.value ?? ""}
                  />
                  <FloatingLabel htmlFor="founder-name">
                    Founder Name (Optional)
                  </FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="founder_designation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative py-3">
                  <FloatingInput
                    id="founder-designation"
                    placeholder=" "
                    {...field}
                    value={field.value ?? ""}
                  />
                  <FloatingLabel htmlFor="founder-designation">
                    Founder Role / Designation (Optional)
                  </FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <label className="text-sm font-medium mb-2 block">
              Brief Purpose / Notes
            </label>
            <FormControl>
              <Textarea
                placeholder="e.g., pitch practice, meeting, training, team work, mentoring, brainstorming"
                className="min-h-[100px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
