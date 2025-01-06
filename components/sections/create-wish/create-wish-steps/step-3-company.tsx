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
import { Input } from "@/components/ui/input";

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
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
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
              <FormLabel>Company Website</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  type="url"
                  {...field}
                />
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter company address" {...field} />
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
              <FormLabel>Province</FormLabel>
              <FormControl>
                <Input placeholder="Enter province" {...field} />
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
              <FormLabel>Municipality</FormLabel>
              <FormControl>
                <Input placeholder="Enter municipality" {...field} />
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
              <FormLabel>Ward</FormLabel>
              <FormControl>
                <Input placeholder="Enter ward number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
