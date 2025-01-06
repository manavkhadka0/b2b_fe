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

interface Step1TypeProps {
  form: UseFormReturn<CreateWishFormValues>;
}

export function Step1Type({ form }: Step1TypeProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Wish Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter wish title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="wish_type"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <Button
                type="button"
                variant="outline"
                className={`h-48 flex flex-col gap-4 hover:border-blue-600 hover:bg-blue-50 ${
                  field.value === "Product" ? "border-blue-600 bg-blue-50" : ""
                }`}
                onClick={() => field.onChange("Product")}
              >
                <Package2 className="h-16 w-16 text-blue-600" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Product</h3>
                  <p className="text-sm text-gray-500">
                    Search and select from our product catalog
                  </p>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className={`h-48 flex flex-col gap-4 hover:border-green-600 hover:bg-green-50 ${
                  field.value === "Service"
                    ? "border-green-600 bg-green-50"
                    : ""
                }`}
                onClick={() => field.onChange("Service")}
              >
                <Wrench className="h-16 w-16 text-green-600" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Service</h3>
                  <p className="text-sm text-gray-500">
                    Choose from available services or create new
                  </p>
                </div>
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
