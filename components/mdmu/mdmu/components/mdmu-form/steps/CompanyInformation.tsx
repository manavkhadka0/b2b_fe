"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getProvinces,
  getDistricts,
  getMunicipalities,
} from "@manavkhadka0/nepal-address";
import type { UseFormReturn } from "react-hook-form";
import type { MDMUFormData } from "../types";

interface CompanyInformationProps {
  form: UseFormReturn<MDMUFormData>;
}

// Helper function to format province names for display
const formatProvinceName = (province: string): string => {
  const provinceMap: Record<string, string> = {
    bagmati: "Bagmati",
    sudurpaschim: "Sudurpashchim",
    lumbini: "Lumbini",
    "pradesh-1": "Koshi",
    madhesh: "Madhesh",
    gandaki: "Gandaki",
    karnali: "Karnali",
  };
  return provinceMap[province] || province;
};

// Helper function to format district/municipality names (capitalize first letter of each word)
const formatName = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function CompanyInformation({ form }: CompanyInformationProps) {
  const selectedProvince = form.watch("address_province");
  const selectedDistrict = form.watch("address_district");
  const prevProvinceRef = useRef<string | null>(null);
  const prevDistrictRef = useRef<string | null>(null);

  // Get all provinces
  const provinces = useMemo(() => getProvinces(), []);

  // Get districts based on selected province
  const districts = useMemo(() => {
    if (!selectedProvince) return [];
    return getDistricts(selectedProvince);
  }, [selectedProvince]);

  // Get municipalities based on selected district
  const municipalities = useMemo(() => {
    if (!selectedDistrict) return [];
    return getMunicipalities(selectedDistrict);
  }, [selectedDistrict]);

  // Reset district and municipality only when province actually changes
  useEffect(() => {
    const prevProvince = prevProvinceRef.current;
    if (selectedProvince && prevProvince && selectedProvince !== prevProvince) {
      form.setValue("address_district", "");
      form.setValue("address_municipality", "");
    }
    prevProvinceRef.current = selectedProvince ?? null;
  }, [selectedProvince, form]);

  // Reset municipality only when district actually changes
  useEffect(() => {
    const prevDistrict = prevDistrictRef.current;
    if (selectedDistrict && prevDistrict && selectedDistrict !== prevDistrict) {
      form.setValue("address_municipality", "");
    }
    prevDistrictRef.current = selectedDistrict ?? null;
  }, [selectedDistrict, form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name_of_company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter company name"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs text-red-600" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company_logo"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Company Logo</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => {
                  const fileList = e.target.files;
                  onChange(
                    fileList && fileList.length > 0 ? fileList : undefined
                  );
                }}
                {...field}
              />
            </FormControl>
            <FormDescription className="text-xs text-gray-500">
              Upload your company logo (optional). Accepted formats: JPG, PNG,
              GIF, etc.
            </FormDescription>
            <FormMessage className="text-xs text-red-600" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address_province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Province</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={provinces.length === 0}
            >
              <FormControl>
                <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem
                    key={province}
                    value={province}
                    className="cursor-pointer bg-white hover:bg-blue-50 focus:bg-blue-50"
                  >
                    {formatProvinceName(province)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-xs text-red-600" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address_district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedProvince || districts.length === 0}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                    <SelectValue
                      placeholder={
                        !selectedProvince
                          ? "Select province first"
                          : "Select district"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem
                      key={district}
                      value={district}
                      className="cursor-pointer bg-white hover:bg-blue-50 focus:bg-blue-50"
                    >
                      {formatName(district)}
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
          name="address_municipality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Municipality</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedDistrict || municipalities.length === 0}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                    <SelectValue
                      placeholder={
                        !selectedDistrict
                          ? "Select district first"
                          : "Select municipality"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {municipalities.map((municipality) => (
                    <SelectItem
                      key={municipality}
                      value={municipality}
                      className="cursor-pointer bg-white hover:bg-blue-50 focus:bg-blue-50"
                    >
                      {formatName(municipality)}
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
        <FormField
          control={form.control}
          name="address_ward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ward No.</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter ward number"
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address_street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter street address"
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
