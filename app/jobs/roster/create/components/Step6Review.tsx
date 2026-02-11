"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { RosterFormValues } from "../types";

interface Step6ReviewProps {
  form: UseFormReturn<RosterFormValues>;
}

export function Step6Review({ form }: Step6ReviewProps) {
  const values = form.getValues();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-3 text-sm">
        <p className="font-medium text-slate-900">Review your information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
          <div>
            <span className="text-slate-500">Name:</span> {values.name}
          </div>
          <div>
            <span className="text-slate-500">Email:</span> {values.email}
          </div>
          <div>
            <span className="text-slate-500">Phone:</span> {values.phone_number}
          </div>
          <div>
            <span className="text-slate-500">Address:</span>{" "}
            {values.permanent_municipality}, {values.permanent_district},{" "}
            {values.permanent_province}
          </div>
          <div>
            <span className="text-slate-500">Job status:</span>{" "}
            {values.job_status}
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="declaration"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-slate-200 p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-normal cursor-pointer">
                Graduate consent received to publish profile for employment
                opportunities
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </motion.div>
  );
}
