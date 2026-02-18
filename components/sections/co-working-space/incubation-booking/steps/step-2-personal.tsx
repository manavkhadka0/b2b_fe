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

interface Step2PersonalProps {
  form: UseFormReturn<IncubationCenterBookingFormValues>;
}

export function IncubationStep2Personal({ form }: Step2PersonalProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">1) Applicant Information</h2>

      <FormField
        control={form.control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative py-3">
                <FloatingInput id="full-name" placeholder=" " {...field} />
                <FloatingLabel htmlFor="full-name">Full Name</FloatingLabel>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <label className="text-sm font-medium mb-2 block">Address</label>
            <FormControl>
              <Textarea
                placeholder="Full address"
                className="min-h-[80px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative py-3">
                  <FloatingInput id="phone" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="phone">
                    Mobile / Contact No.
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
                <div className="relative py-3">
                  <FloatingInput
                    type="email"
                    id="email"
                    placeholder=" "
                    {...field}
                  />
                  <FloatingLabel htmlFor="email">Email</FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
