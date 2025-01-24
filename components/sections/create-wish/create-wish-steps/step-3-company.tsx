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

interface Step3CompanyProps {
  form: UseFormReturn<CreateWishFormValues>;
}

export function Step3Company({ form }: Step3CompanyProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Company Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput id="company-name" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="company-name">
                    Company Name
                  </FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_website"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput
                    id="company-website"
                    placeholder=" "
                    type="url"
                    {...field}
                  />
                  <FloatingLabel htmlFor="company-website">
                    Company Website
                  </FloatingLabel>
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
            <FormItem className="col-span-full">
              <FormControl>
                <div className="relative">
                  <FloatingInput id="address" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="address">Address</FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput id="province" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="province">Province</FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="municipality"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput id="municipality" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="municipality">
                    Municipality
                  </FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ward"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput id="ward" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="ward">Ward</FloatingLabel>
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
