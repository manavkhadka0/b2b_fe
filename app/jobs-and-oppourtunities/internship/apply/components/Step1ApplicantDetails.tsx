"use client";

import { useEffect } from "react";
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
import { User, Phone, Mail, Calendar, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  getProvinces,
  getDistricts,
  getMunicipalities,
} from "@manavkhadka0/nepal-address";
import type { InternshipFormValues } from "../types";

interface Step1ApplicantDetailsProps {
  form: UseFormReturn<InternshipFormValues>;
  sameAsPermanent?: boolean;
  onSameAsPermanentChange?: (value: boolean) => void;
}

export function Step1ApplicantDetails({
  form,
  sameAsPermanent = false,
  onSameAsPermanentChange,
}: Step1ApplicantDetailsProps) {
  const permanentProvince = form.watch("permanentProvince");
  const permanentDistrict = form.watch("permanentDistrict");
  const permanentMunicipality = form.watch("permanentMunicipality");
  const permanentWard = form.watch("permanentWard");

  const permanentDistricts = permanentProvince
    ? getDistricts(permanentProvince)
    : [];
  const permanentMunicipalities = permanentDistrict
    ? getMunicipalities(permanentDistrict)
    : [];

  const currentProvince = form.watch("currentProvince");
  const currentDistrict = form.watch("currentDistrict");
  const currentDistricts = currentProvince ? getDistricts(currentProvince) : [];
  const currentMunicipalities = currentDistrict
    ? getMunicipalities(currentDistrict)
    : [];

  const provinces = getProvinces();

  // Sync addresses when checkbox is checked
  const handleSameAsPermanentChange = (checked: boolean) => {
    if (onSameAsPermanentChange) {
      onSameAsPermanentChange(checked);
    }
    if (checked) {
      // Copy permanent address to current address
      form.setValue("currentProvince", permanentProvince);
      form.setValue("currentDistrict", permanentDistrict);
      form.setValue("currentMunicipality", permanentMunicipality);
      form.setValue("currentWard", permanentWard);
    } else {
      // Clear current address
      form.setValue("currentProvince", "");
      form.setValue("currentDistrict", "");
      form.setValue("currentMunicipality", "");
      form.setValue("currentWard", "");
    }
  };

  // Watch for changes in permanent address and sync if checkbox is checked
  useEffect(() => {
    if (sameAsPermanent && onSameAsPermanentChange) {
      form.setValue("currentProvince", permanentProvince);
      form.setValue("currentDistrict", permanentDistrict);
      form.setValue("currentMunicipality", permanentMunicipality);
      form.setValue("currentWard", permanentWard);
    }
  }, [
    sameAsPermanent,
    permanentProvince,
    permanentDistrict,
    permanentMunicipality,
    permanentWard,
    form,
    onSameAsPermanentChange,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...field}
                  placeholder="Enter your full name"
                  className="pl-10"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div>
          <FormLabel className="text-base font-medium mb-2 block">
            Permanent Address *
          </FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="permanentProvince"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("permanentDistrict", "");
                      form.setValue("permanentMunicipality", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
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
              name="permanentDistrict"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("permanentMunicipality", "");
                    }}
                    disabled={!permanentProvince}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            permanentProvince
                              ? "Select district"
                              : "Select province first"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {permanentDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
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
              name="permanentMunicipality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Municipality *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!permanentDistrict}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            permanentDistrict
                              ? "Select municipality"
                              : "Select district first"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {permanentMunicipalities.map((municipality) => (
                        <SelectItem key={municipality} value={municipality}>
                          {municipality}
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
              name="permanentWard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ward *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter ward number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {onSameAsPermanentChange && (
          <div className="flex items-center space-x-2 pt-2 pb-2">
            <Checkbox
              id="same-as-permanent"
              checked={sameAsPermanent}
              onCheckedChange={handleSameAsPermanentChange}
            />
            <Label
              htmlFor="same-as-permanent"
              className="text-sm font-medium cursor-pointer"
            >
              Current address is same as permanent address
            </Label>
          </div>
        )}

        {(!sameAsPermanent || !onSameAsPermanentChange) && (
          <div>
            <FormLabel className="text-base font-medium mb-2 block">
              Current Address (if different)
            </FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentProvince"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("currentDistrict", "");
                        form.setValue("currentMunicipality", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
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
                name="currentDistrict"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("currentMunicipality", "");
                      }}
                      disabled={!currentProvince}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              currentProvince
                                ? "Select district"
                                : "Select province first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
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
                name="currentMunicipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipality</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!currentDistrict}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              currentDistrict
                                ? "Select municipality"
                                : "Select district first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentMunicipalities.map((municipality) => (
                          <SelectItem key={municipality} value={municipality}>
                            {municipality}
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
                name="currentWard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter ward number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number (Mobile) *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    placeholder="98XXXXXXXX"
                    className="pl-10"
                    type="tel"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    placeholder="your.email@example.com"
                    className="pl-10"
                    type="email"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth (Optional)</FormLabel>
            <FormControl>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input {...field} type="date" className="pl-10" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
