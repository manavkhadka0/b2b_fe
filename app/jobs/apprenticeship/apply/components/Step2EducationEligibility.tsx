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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, School, Calendar } from "lucide-react";
import type { ApprenticeshipFormValues } from "../types";

interface Step2EducationEligibilityProps {
  form: UseFormReturn<ApprenticeshipFormValues>;
}

export function Step2EducationEligibility({
  form,
}: Step2EducationEligibilityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="educationLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Education Level *</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Grade 10">Grade 10</SelectItem>
                <SelectItem value="SEE completed">SEE completed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="schoolName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>School Name (Grade 10/SEE) *</FormLabel>
            <FormControl>
              <div className="relative">
                <School className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...field}
                  placeholder="Enter school name"
                  className="pl-10"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="yearOfSeeCompletion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year of SEE Completion *</FormLabel>
            <FormControl>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...field}
                  placeholder="e.g., 2080"
                  className="pl-10"
                  maxLength={4}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
