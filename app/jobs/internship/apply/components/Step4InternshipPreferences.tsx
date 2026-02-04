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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS } from "../constants";
import type { InternshipFormValues } from "../types";

interface Industry {
  id: number;
  name: string;
  description: string;
  link: string;
  slug: string;
}

interface Step4InternshipPreferencesProps {
  form: UseFormReturn<InternshipFormValues>;
  industries: Industry[];
  isLoadingIndustries: boolean;
}

export function Step4InternshipPreferences({
  form,
  industries,
  isLoadingIndustries,
}: Step4InternshipPreferencesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="preferredIndustry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Industry / Company *</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoadingIndustries}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingIndustries
                        ? "Loading industries..."
                        : "Select preferred industry"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoadingIndustries ? (
                  <SelectItem value="loading" disabled>
                    Loading industries...
                  </SelectItem>
                ) : industries.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No industries available
                  </SelectItem>
                ) : (
                  industries.map((industry) => (
                    <SelectItem
                      key={industry.id}
                      value={industry.id.toString()}
                    >
                      {industry.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preferredDepartment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Department / Area (Optional)</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="internshipDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internship Duration *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., 4, 6, 8"
                  type="number"
                  min="1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="durationUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration Unit *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="hours">Total Hours</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="preferredMonth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Which month of the calendar? * (e.g., March 2026 / Baishakh 2083)
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="March 2026 / Baishakh 2083" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preferredStartDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Start Date (Optional)</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="availability"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Availability *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Full Time" id="full-time" />
                  <Label htmlFor="full-time">Full Time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Part Time" id="part-time" />
                  <Label htmlFor="part-time">Part Time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Contract" id="contract" />
                  <Label htmlFor="contract">Contract</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Internship" id="internship" />
                  <Label htmlFor="internship">Internship</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
