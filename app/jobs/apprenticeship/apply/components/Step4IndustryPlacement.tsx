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
import {
  Building,
  Check,
  ChevronsUpDown,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
  onSearchIndustries?: (search: string) => void;
}

// Normalize API link values to a safe, clickable URL
const getIndustryWebsiteUrl = (
  rawLink: string | undefined | null,
): string | null => {
  if (!rawLink) return null;
  const trimmed = rawLink.trim();
  if (!trimmed) return null;

  // If link already has protocol, use as is
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Default to https if protocol is missing
  return `https://${trimmed}`;
};

const getIndustryWebsiteLabel = (
  rawLink: string | undefined | null,
): string | null => {
  const url = getIndustryWebsiteUrl(rawLink);
  if (!url) return null;

  // Strip protocol and trailing slash for a clean label
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
};

export function Step4IndustryPlacement({
  form,
  industries,
  isLoadingIndustries,
  onSearchIndustries,
}: Step4IndustryPlacementProps) {
  const industryPreference1 = form.watch("industryPreference1");
  const industryPreference2 = form.watch("industryPreference2");

  // Filter out already selected industries from options
  const getAvailableIndustries = (excludeIds: string[] = []) => {
    return industries.filter((ind) => !excludeIds.includes(ind.id.toString()));
  };

  const industry1Options = getAvailableIndustries();
  const industry2Options = getAvailableIndustries(
    industryPreference1 ? [industryPreference1] : [],
  );
  const industry3Options = getAvailableIndustries(
    [industryPreference1, industryPreference2].filter(
      (id): id is string => typeof id === "string" && id.length > 0,
    ),
  );

  const getIndustryName = (id: string) => {
    const industry = industries.find((ind) => ind.id.toString() === id);
    return industry?.name || id;
  };

  // Reusable search hook per preference
  const useIndustrySearch = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const debounced = useDebounce(value, 300);
    const hasSearchedRef = useRef(false);

    useEffect(() => {
      if (!onSearchIndustries || !open) return;

      const search = debounced.trim();
      if (search.length >= 2) {
        hasSearchedRef.current = true;
        onSearchIndustries(search);
      } else if (search.length === 0 && hasSearchedRef.current) {
        // Only reload default industries if user previously searched
        onSearchIndustries("");
        hasSearchedRef.current = false;
      }
    }, [debounced, onSearchIndustries, open]);

    useEffect(() => {
      if (!open) {
        setValue("");
        hasSearchedRef.current = false;
      }
    }, [open]);

    return {
      open,
      setOpen,
      value,
      setValue,
    };
  };

  const industrySearch1 = useIndustrySearch();
  const industrySearch2 = useIndustrySearch();
  const industrySearch3 = useIndustrySearch();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 sm:space-y-4"
    >
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
        <p className="text-xs min-[375px]:text-sm text-blue-800 leading-relaxed">
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
            <Popover
              open={industrySearch1.open}
              onOpenChange={industrySearch1.setOpen}
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
                        ? getIndustryName(field.value)
                        : isLoadingIndustries
                          ? "Loading industries..."
                          : "Select first preference"}
                    </span>
                    <ChevronsUpDown className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-1rem)] sm:w-full p-0 max-h-[70vh] sm:max-h-80" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search industries..."
                    value={industrySearch1.value}
                    onValueChange={industrySearch1.setValue}
                    className="text-sm sm:text-base"
                  />
                  <CommandEmpty className="text-xs sm:text-sm py-2">
                    {isLoadingIndustries
                      ? "Loading..."
                      : industry1Options.length === 0
                        ? "No industries found."
                        : "No industries match your search."}
                  </CommandEmpty>
                  <CommandGroup className="max-h-[50vh] sm:max-h-64 overflow-y-auto">
                    {industry1Options.map((industry) => (
                      <CommandItem
                        key={industry.id}
                        value={industry.id.toString()}
                        onSelect={() => {
                          field.onChange(industry.id.toString());
                          industrySearch1.setOpen(false);
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
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <Building className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                            <span className="truncate text-xs sm:text-sm">{industry.name}</span>
                          </div>
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
        name="industryPreference2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Requested Industry (2nd Preference) (Optional)
            </FormLabel>
            <Popover
              open={industrySearch2.open}
              onOpenChange={industrySearch2.setOpen}
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
                    disabled={!industryPreference1 || isLoadingIndustries}
                  >
                    <span className="truncate mr-2">
                      {field.value
                        ? field.value === "__none__"
                          ? "None"
                          : getIndustryName(field.value)
                        : !industryPreference1
                          ? "Select first preference first"
                          : "Select second preference"}
                    </span>
                    <ChevronsUpDown className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-1rem)] sm:w-full p-0 max-h-[70vh] sm:max-h-80" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search industries..."
                    value={industrySearch2.value}
                    onValueChange={industrySearch2.setValue}
                    className="text-sm sm:text-base"
                  />
                  <CommandEmpty className="text-xs sm:text-sm py-2">
                    {isLoadingIndustries
                      ? "Loading..."
                      : industry2Options.length === 0
                        ? "No industries found."
                        : "No industries match your search."}
                  </CommandEmpty>
                  <CommandGroup className="max-h-[50vh] sm:max-h-64 overflow-y-auto">
                    <CommandItem
                      value="__none__"
                      onSelect={() => {
                        field.onChange(undefined);
                        industrySearch2.setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !field.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span>None</span>
                    </CommandItem>
                    {industry2Options.map((industry) => (
                      <CommandItem
                        key={industry.id}
                        value={industry.id.toString()}
                        onSelect={() => {
                          field.onChange(industry.id.toString());
                          industrySearch2.setOpen(false);
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
                        <span>{industry.name}</span>
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
        name="industryPreference3"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Requested Industry (3rd Preference) (Optional)
            </FormLabel>
            <Popover
              open={industrySearch3.open}
              onOpenChange={industrySearch3.setOpen}
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
                    disabled={!industryPreference1 || isLoadingIndustries}
                  >
                    <span className="truncate mr-2">
                      {field.value
                        ? field.value === "__none__"
                          ? "None"
                          : getIndustryName(field.value)
                        : !industryPreference1
                          ? "Select first preference first"
                          : "Select third preference"}
                    </span>
                    <ChevronsUpDown className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-1rem)] sm:w-full p-0 max-h-[70vh] sm:max-h-80" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search industries..."
                    value={industrySearch3.value}
                    onValueChange={industrySearch3.setValue}
                    className="text-sm sm:text-base"
                  />
                  <CommandEmpty className="text-xs sm:text-sm py-2">
                    {isLoadingIndustries
                      ? "Loading..."
                      : industry3Options.length === 0
                        ? "No industries found."
                        : "No industries match your search."}
                  </CommandEmpty>
                  <CommandGroup className="max-h-[50vh] sm:max-h-64 overflow-y-auto">
                    <CommandItem
                      value="__none__"
                      onSelect={() => {
                        field.onChange(undefined);
                        industrySearch3.setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !field.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span>None</span>
                    </CommandItem>
                    {industry3Options.map((industry) => (
                      <CommandItem
                        key={industry.id}
                        value={industry.id.toString()}
                        onSelect={() => {
                          field.onChange(industry.id.toString());
                          industrySearch3.setOpen(false);
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
                        <span>{industry.name}</span>
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
        name="preferredLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Location (Optional)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || undefined)}
                placeholder="e.g., Morang, Sunsari, Jhapa"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
