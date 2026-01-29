"use client";

import { useEffect, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MARKET_CHOICES,
  RAW_MATERIAL_CHOICES,
  API_ENDPOINTS,
} from "../constants";
import type { UseFormReturn } from "react-hook-form";
import type {
  MDMUFormData,
  IndustryCategory,
  IndustrySubCategory,
  IndustrySize,
} from "../types";
import axios from "axios";

interface BusinessDetailsProps {
  form: UseFormReturn<MDMUFormData & { industry_size: IndustrySize }>;
}

export function BusinessDetails({ form }: BusinessDetailsProps) {
  const [categories, setCategories] = useState<IndustryCategory[]>([]);
  const [subCategories, setSubCategories] = useState<IndustrySubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.categories);
        setCategories(response.data.results);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Initialize selected category from existing form value so it persists on remount
  useEffect(() => {
    if (!selectedCategory) {
      const currentCategory = form.getValues("nature_of_industry_category");
      if (currentCategory?.id) {
        setSelectedCategory(currentCategory.id);
      }
    }
  }, [form, selectedCategory]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedCategory) return;

      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.subCategories}?category=${selectedCategory}`
        );
        setSubCategories(response.data.results);

        // If sub-categories exist but none selected, set error
        if (
          response.data.results.length > 0 &&
          !form.getValues("nature_of_industry_sub_category")
        ) {
          form.setError("nature_of_industry_sub_category", {
            type: "manual",
            message: "Please select a sub-category",
          });
        } else {
          form.clearErrors("nature_of_industry_sub_category");
        }
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubCategories();
  }, [selectedCategory, form]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nature_of_industry_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry Category</FormLabel>
              <Select
                onValueChange={(value) => {
                  const numValue = parseInt(value);
                  const selectedCat = categories.find(
                    (cat) => cat.id === numValue
                  );
                  if (selectedCat) {
                    field.onChange(selectedCat);
                    setSelectedCategory(numValue);
                    form.setValue("nature_of_industry_sub_category", undefined);
                  }
                }}
                value={field.value?.id?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                      className="cursor-pointer bg-white hover:bg-blue-50 focus:bg-blue-50"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nature_of_industry_sub_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry Sub-Category</FormLabel>
              <Select
                onValueChange={(value) => {
                  const numValue = parseInt(value);
                  const selectedSubCat = subCategories.find(
                    (sub) => sub.id === numValue
                  );
                  if (selectedSubCat) {
                    field.onChange(selectedSubCat);
                  }
                }}
                value={field.value?.id?.toString()}
                disabled={!selectedCategory || isLoading}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-50  border-gray-200 focus:bg-white transition-colors">
                    <SelectValue
                      placeholder={
                        isLoading
                          ? "Loading sub-categories..."
                          : !selectedCategory
                            ? "Select a category first"
                            : "Select sub-category"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                {isLoading ? (
                  <SelectContent>
                    <SelectItem value="loading">Loading...</SelectItem>
                  </SelectContent>
                ) : (
                  <SelectContent className="bg-white">
                    {subCategories.map((subCategory) => (
                      <SelectItem
                        key={subCategory.id}
                        value={subCategory.id.toString()}
                        className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
                      >
                        {subCategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="product_market"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Market</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                    <SelectValue placeholder="Select market type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MARKET_CHOICES.map((choice) => (
                    <SelectItem
                      key={choice.value}
                      value={choice.value}
                      className="cursor-pointer bg-white hover:bg-blue-50 focus:bg-blue-50"
                    >
                      {choice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="raw_material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Raw Material Source</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                    <SelectValue placeholder="Select material source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {RAW_MATERIAL_CHOICES.map((choice) => (
                    <SelectItem
                      key={choice.value}
                      value={choice.value}
                      className="cursor-pointer bg-white hover:bg-blue-50 focus:bg-blue-50"
                    >
                      {choice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Industry Size Field */}
        <FormField
          control={form.control}
          name="industry_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry Size</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                    <SelectValue placeholder="Select industry size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[
                    "Startup",
                    "Micro",
                    "Cottage",
                    "Small",
                    "Medium",
                    "Large",
                  ].map((size) => (
                    <SelectItem
                      key={size}
                      value={size}
                      className="cursor-pointer bg-white hover:bg-blue-50 focus:bg-blue-50"
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
