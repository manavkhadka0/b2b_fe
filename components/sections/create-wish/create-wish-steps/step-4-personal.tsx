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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { designationOptions } from "@/types/schemas/create-wish-schemas";

interface Step4PersonalProps {
  form: UseFormReturn<CreateWishFormValues>;
  designationPopoverOpen: boolean;
  setDesignationPopoverOpen: (open: boolean) => void;
}

export function Step4Personal({
  form,
  designationPopoverOpen,
  setDesignationPopoverOpen,
}: Step4PersonalProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation</FormLabel>
              <Popover
                open={designationPopoverOpen}
                onOpenChange={setDesignationPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? designationOptions.find(
                            (option) => option.value === field.value
                          )?.label
                        : "Select designation"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search designation..." />
                    <CommandEmpty>No designation found.</CommandEmpty>
                    <CommandGroup>
                      {designationOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => {
                            form.setValue("designation", option.value);
                            setDesignationPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              option.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobile_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter mobile number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alternate_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternate Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter alternate number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
