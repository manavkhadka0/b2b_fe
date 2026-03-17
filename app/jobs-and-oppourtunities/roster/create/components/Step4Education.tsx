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
import {
  LEVEL_COMPLETED_CHOICES,
  CERTIFYING_AGENCY_CHOICES,
} from "@/types/graduate-roster";
import type { RosterFormValues } from "../types";

interface Step4EducationProps {
  form: UseFormReturn<RosterFormValues>;
}

export function Step4Education({ form }: Step4EducationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="level_completed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level completed</FormLabel>
              <Select
                value={field.value || ""}
                onValueChange={(v) => field.onChange(v || null)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {LEVEL_COMPLETED_CHOICES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
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
          name="subject_trade_stream"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject / trade / stream</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Computer Engineering"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? e.target.value : null,
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passed_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passed year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1990}
                  max={new Date().getFullYear()}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="certifying_agency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certifying agency</FormLabel>
              <Select
                value={field.value || ""}
                onValueChange={(v) => field.onChange(v || null)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CERTIFYING_AGENCY_CHOICES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
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
          name="certifying_agency_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certifying agency name (if Other)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter if Other"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? e.target.value : null,
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="certificate_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Certificate number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? e.target.value : null,
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="specialization_key_skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specialization / key skills</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe skills, certifications, etc."
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? e.target.value : null,
                  )
                }
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
