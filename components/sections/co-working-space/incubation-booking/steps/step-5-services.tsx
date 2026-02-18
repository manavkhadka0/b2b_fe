"use client";

import { UseFormReturn } from "react-hook-form";
import type { IncubationCenterBookingFormValues } from "@/types/schemas/incubation-center-booking-schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Wifi, Copy, Printer, Monitor, Pen, Coffee } from "lucide-react";

const SERVICE_OPTIONS: {
  name: keyof IncubationCenterBookingFormValues;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    name: "wifi",
    label: "High-speed Internet / Wi-Fi",
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    name: "photocopy",
    label: "Photocopy",
    icon: <Copy className="h-4 w-4" />,
  },
  {
    name: "printing",
    label: "Printing",
    icon: <Printer className="h-4 w-4" />,
  },
  {
    name: "interactive_board",
    label: "Interactive Board (Big Brain Room)",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    name: "whiteboard_marker",
    label: "Whiteboard + Marker",
    icon: <Pen className="h-4 w-4" />,
  },
  {
    name: "tea_coffee_water",
    label: "Tea/Coffee/Water arrangement (as available)",
    icon: <Coffee className="h-4 w-4" />,
  },
];

interface Step5ServicesProps {
  form: UseFormReturn<IncubationCenterBookingFormValues>;
}

export function IncubationStep5Services({ form }: Step5ServicesProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        4) Specific Services Needed (Optional)
      </h2>
      <p className="text-sm text-gray-600">Select all that apply:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SERVICE_OPTIONS.map((opt) => (
          <FormField
            key={opt.name}
            control={form.control}
            name={opt.name}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {opt.icon}
                    {opt.label}
                  </div>
                </div>
              </FormItem>
            )}
          />
        ))}
      </div>

      <FormField
        control={form.control}
        name="other_service"
        render={({ field }) => (
          <FormItem>
            <label className="text-sm font-medium mb-2 block">
              Other (please specify)
            </label>
            <FormControl>
              <Textarea
                placeholder="Specify any other services needed"
                className="min-h-[80px] resize-none"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
