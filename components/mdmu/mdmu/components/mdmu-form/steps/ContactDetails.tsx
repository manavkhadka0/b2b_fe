"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { MDMUFormData } from "../types";

interface ContactDetailsProps {
  form: UseFormReturn<MDMUFormData>;
}

export function ContactDetails({ form }: ContactDetailsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="contact_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Person Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter contact person name"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs text-red-600" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contact_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Enter contact number"
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_alternate_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternate Number (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Enter alternate number"
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contact_designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter designation"
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
