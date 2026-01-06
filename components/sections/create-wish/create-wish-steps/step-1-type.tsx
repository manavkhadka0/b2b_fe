"use client";

import { Package2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { FloatingInput } from "@/components/ui/floatingInput";
import { FloatingLabel } from "@/components/ui/floatingInput";

interface Step1TypeProps {
  form: UseFormReturn<CreateWishFormValues>;
  is_wish_or_offer: "wishes" | "offers";
}

export function Step1Type({ form, is_wish_or_offer }: Step1TypeProps) {
  return (
    <div className="space-y-4 mt-5">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative py-3">
                <FloatingInput id="issue-title" placeholder=" " {...field} />
                <FloatingLabel htmlFor="issue-title">
                  Product or Service Name
                </FloatingLabel>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div
                role="button"
                tabIndex={0}
                onClick={() => field.onChange("Product")}
                onKeyDown={(e) =>
                  e.key === "Enter" && field.onChange("Product")
                }
                className={`group relative min-h-[120px] sm:min-h-[160px] p-4 sm:p-6 flex flex-row sm:flex-col items-start gap-4 sm:gap-3 
                  hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer
                  border rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  ${
                    field.value === "Product"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }
                `}
              >
                <Package2
                  size={36}
                  className="text-blue-600 flex-shrink-0 sm:w-12 sm:h-12 transition-transform group-hover:scale-110"
                />
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                    Products
                  </h3>
                  <p className="text-sm text-gray-500">
                    Search and select from our product catalog
                  </p>
                </div>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => field.onChange("Service")}
                onKeyDown={(e) =>
                  e.key === "Enter" && field.onChange("Service")
                }
                className={`group relative min-h-[120px] sm:min-h-[160px] p-4 sm:p-6 flex flex-row sm:flex-col items-start gap-4 sm:gap-3 
                  hover:border-green-600 hover:bg-green-50 transition-all cursor-pointer
                  border rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-green-500
                  ${
                    field.value === "Service"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200"
                  }
                `}
              >
                <Wrench
                  size={36}
                  className="text-green-600 flex-shrink-0 sm:w-12 sm:h-12 transition-transform group-hover:scale-110"
                />
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                    Service
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose from available services or create new
                  </p>
                </div>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
