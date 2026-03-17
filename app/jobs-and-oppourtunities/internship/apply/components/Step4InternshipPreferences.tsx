"use client";

import { useEffect, useState, useRef } from "react";
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
import {
  Check,
  ChevronsUpDown,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
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
  onSearchIndustries?: (search: string) => void;
}

// Normalize API link values to a safe, clickable URL
const getIndustryWebsiteUrl = (
  rawLink: string | undefined | null,
): string | null => {
  if (!rawLink) return null;
  const trimmed = rawLink.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const getIndustryWebsiteLabel = (
  rawLink: string | undefined | null,
): string | null => {
  const url = getIndustryWebsiteUrl(rawLink);
  if (!url) return null;

  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
};

export function Step4InternshipPreferences({
  form,
  industries,
  isLoadingIndustries,
  onSearchIndustries,
}: Step4InternshipPreferencesProps) {
  const [industrySearchOpen, setIndustrySearchOpen] = useState(false);
  const [industrySearchValue, setIndustrySearchValue] = useState("");
  const debouncedIndustrySearch = useDebounce(industrySearchValue, 300);
  const hasSearchedRef = useRef(false);

  // Trigger API search when user types in the industry search input
  useEffect(() => {
    if (!onSearchIndustries || !industrySearchOpen) return;

    const search = debouncedIndustrySearch.trim();
    if (search.length >= 2) {
      hasSearchedRef.current = true;
      onSearchIndustries(search);
    } else if (search.length === 0 && hasSearchedRef.current) {
      // Only reload default industries if user previously searched
      onSearchIndustries("");
      hasSearchedRef.current = false;
    }
  }, [debouncedIndustrySearch, onSearchIndustries, industrySearchOpen]);

  // Reset local search value when popover closes
  useEffect(() => {
    if (!industrySearchOpen) {
      setIndustrySearchValue("");
      hasSearchedRef.current = false;
    }
  }, [industrySearchOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 sm:space-y-4"
    >
      <FormField
        control={form.control}
        name="preferredIndustry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Industry / Company *</FormLabel>
            <Popover
              open={industrySearchOpen}
              onOpenChange={setIndustrySearchOpen}
              modal={true}
            >
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between text-xs sm:text-sm",
                      !field.value && "text-muted-foreground",
                    )}
                    disabled={isLoadingIndustries}
                  >
                    <span className="truncate mr-2">
                      {field.value
                        ? industries.find(
                            (ind) => ind.id.toString() === field.value,
                          )?.name || "Select preferred industry"
                        : isLoadingIndustries
                          ? "Loading industries..."
                          : "Select preferred industry"}
                    </span>
                    <ChevronsUpDown className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-1rem)] sm:w-full p-0 max-h-[70vh] sm:max-h-80" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search industries..."
                    value={industrySearchValue}
                    onValueChange={setIndustrySearchValue}
                    className="text-sm sm:text-base"
                  />
                  <CommandEmpty className="text-xs sm:text-sm py-2">
                    {isLoadingIndustries
                      ? "Loading..."
                      : industries.length === 0
                        ? "No industries found."
                        : "No industries match your search."}
                  </CommandEmpty>
                  <CommandGroup className="max-h-[50vh] sm:max-h-64 overflow-y-auto">
                    {industries.map((industry) => (
                      <CommandItem
                        key={industry.id}
                        value={industry.id.toString()}
                        onSelect={() => {
                          field.onChange(industry.id.toString());
                          setIndustrySearchOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            industry.id.toString() === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
                          <span className="truncate text-xs sm:text-sm">{industry.name}</span>
                          {getIndustryWebsiteUrl(industry.link) && (
                            <a
                              href={
                                getIndustryWebsiteUrl(industry.link) as string
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 hover:underline flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="hidden min-[375px]:inline">
                                {getIndustryWebsiteLabel(industry.link)}
                              </span>
                              <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </a>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
