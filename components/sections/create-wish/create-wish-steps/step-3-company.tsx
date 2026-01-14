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
import { FloatingInput } from "@/components/ui/floatingInput";
import { FloatingLabel } from "@/components/ui/floatingInput";
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

interface Step3CompanyProps {
  form: UseFormReturn<CreateWishFormValues>;
}

export function Step3Company({ form }: Step3CompanyProps) {
  const provinces = getProvinces();
  const selectedCountry = form.watch("country");
  const selectedProvince = form.watch("province");
  const selectedDistrict = form.watch("district");

  const districts = selectedProvince ? getDistricts(selectedProvince) : [];
  const municipalities = selectedDistrict
    ? getMunicipalities(selectedDistrict)
    : [];

  const isNepal = selectedCountry === "Nepal";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Company Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput id="company-name" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="company-name">
                    Company Name
                  </FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_website"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput
                    id="company-website"
                    placeholder=" "
                    type="url"
                    {...field}
                  />
                  <FloatingLabel htmlFor="company-website">
                    Company Website
                  </FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Reset location fields when country changes
                    if (value === "Others") {
                      form.setValue("province", "");
                      form.setValue("district", "");
                      form.setValue("municipality", "");
                      form.setValue("ward", "");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nepal">Nepal</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormControl>
                <div className="relative">
                  <FloatingInput id="address" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="address">Address</FloatingLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isNepal && (
          <>
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset dependent fields when province changes
                        form.setValue("district", "");
                        form.setValue("municipality", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset municipality when district changes
                        form.setValue("municipality", "");
                      }}
                      disabled={!selectedProvince}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            selectedProvince
                              ? "Select district"
                              : "Select province first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="municipality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Municipality</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedDistrict}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            selectedDistrict
                              ? "Select municipality"
                              : "Select district first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {municipalities.map((municipality) => (
                          <SelectItem key={municipality} value={municipality}>
                            {municipality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ward</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FloatingInput id="ward" placeholder="Ward" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </div>
    </div>
  );
}
