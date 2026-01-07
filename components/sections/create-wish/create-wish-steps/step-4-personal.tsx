"use client";

import { UseFormReturn } from "react-hook-form";
import type { CreateWishFormValues } from "@/types/create-wish-type";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FloatingInput } from "@/components/ui/floatingInput";
import { FloatingLabel } from "@/components/ui/floatingInput";
interface Step4PersonalProps {
  form: UseFormReturn<CreateWishFormValues>;
  designationPopoverOpen: boolean;
  setDesignationPopoverOpen: (open: boolean) => void;
}

export function Step4Personal({
  form,
  designationPopoverOpen,
  setDesignationPopoverOpen,
}: Step4PersonalProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
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
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput id="designation" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="designation">
                    Designation
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
          name="mobile_no"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput id="mobile-no" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="mobile-no">
                    Mobile Number
                  </FloatingLabel>
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
      </div>
    </div>
  );
}
