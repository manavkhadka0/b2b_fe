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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, MapPin } from "lucide-react";
import { PREFERRED_LOCATIONS } from "../constants";
import type { ApprenticeshipFormValues } from "../types";

interface Industry {
  id: number;
  name: string;
  description: string;
  link: string;
  slug: string;
}

interface Step4IndustryPlacementProps {
  form: UseFormReturn<ApprenticeshipFormValues>;
  industries: Industry[];
  isLoadingIndustries: boolean;
}

export function Step4IndustryPlacement({
  form,
  industries,
  isLoadingIndustries,
}: Step4IndustryPlacementProps) {
  const industryPreference1 = form.watch("industryPreference1");
  const industryPreference2 = form.watch("industryPreference2");

  // Filter out already selected industries from options
  const getAvailableIndustries = (excludeIds: string[] = []) => {
    return industries.filter((ind) => !excludeIds.includes(ind.id.toString()));
  };

  const industry1Options = getAvailableIndustries();
  const industry2Options = getAvailableIndustries(
    industryPreference1 ? [industryPreference1] : []
  );
  const industry3Options = getAvailableIndustries(
    [industryPreference1, industryPreference2].filter(
      (id): id is string => typeof id === "string" && id.length > 0
    )
  );

  const getIndustryName = (id: string) => {
    const industry = industries.find((ind) => ind.id.toString() === id);
    return industry?.name || id;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          Select your industry preferences for placement. You can select up to 3
          industries in order of preference.
        </p>
      </div>

      <FormField
        control={form.control}
        name="industryPreference1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Requested Industry (1st Preference) *</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
              disabled={isLoadingIndustries}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingIndustries
                        ? "Loading industries..."
                        : "Select first preference"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoadingIndustries ? (
                  <SelectItem value="loading" disabled>
                    Loading industries...
                  </SelectItem>
                ) : industry1Options.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No industries available
                  </SelectItem>
                ) : (
                  industry1Options.map((industry) => (
                    <SelectItem
                      key={industry.id}
                      value={industry.id.toString()}
                    >
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{industry.name}</span>
                      </div>
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
        name="industryPreference2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Requested Industry (2nd Preference) (Optional)
            </FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value === "__none__" ? undefined : value);
              }}
              value={field.value || undefined}
              disabled={!industryPreference1 || isLoadingIndustries}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !industryPreference1
                        ? "Select first preference first"
                        : "Select second preference"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {industry2Options.map((industry) => (
                  <SelectItem key={industry.id} value={industry.id.toString()}>
                    {industry.name}
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
        name="industryPreference3"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Requested Industry (3rd Preference) (Optional)
            </FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value === "__none__" ? undefined : value);
              }}
              value={field.value || undefined}
              disabled={!industryPreference1 || isLoadingIndustries}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !industryPreference1
                        ? "Select first preference first"
                        : "Select third preference"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {industry3Options.map((industry) => (
                  <SelectItem key={industry.id} value={industry.id.toString()}>
                    {industry.name}
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
        name="preferredLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Location (Optional)</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value === "__none__" ? undefined : value);
              }}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred location" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {PREFERRED_LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{location}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
