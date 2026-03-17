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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUALIFICATION_OPTIONS } from "../constants";
import type { InternshipFormValues } from "../types";

interface Step2EducationDetailsProps {
  form: UseFormReturn<InternshipFormValues>;
}

export function Step2EducationDetails({ form }: Step2EducationDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="institution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Institution *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="School or university" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="courseOrQualification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qualification *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {QUALIFICATION_OPTIONS.map((qualification) => (
                  <SelectItem key={qualification} value={qualification}>
                    {qualification}
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
        name="yearOfCompletion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year of completion (Optional)</FormLabel>
            <FormControl>
              <Input {...field} type="text" placeholder="e.g., 2024" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="courseHighlights"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course highlights (Optional)</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Key achievements, relevant coursework, etc."
                rows={4}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
