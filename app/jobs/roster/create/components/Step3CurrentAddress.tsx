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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  getProvinces,
  getDistricts,
  getMunicipalities,
} from "@manavkhadka0/nepal-address";
import type { RosterFormValues } from "../types";

interface Step3CurrentAddressProps {
  form: UseFormReturn<RosterFormValues>;
  sameAsPermanent: boolean;
  onSameAsPermanentChange: (value: boolean) => void;
}

export function Step3CurrentAddress({
  form,
  sameAsPermanent,
  onSameAsPermanentChange,
}: Step3CurrentAddressProps) {
  const permanentProvince = form.watch("permanent_province");
  const permanentDistrict = form.watch("permanent_district");
  const permanentMunicipality = form.watch("permanent_municipality");
  const permanentWard = form.watch("permanent_ward");
  const currentProvince = form.watch("current_province");
  const currentDistrict = form.watch("current_district");

  const provinces = getProvinces();
  const currentDistricts = currentProvince ? getDistricts(currentProvince) : [];
  const currentMunicipalities = currentDistrict
    ? getMunicipalities(currentDistrict)
    : [];

  const handleSameAsPermanentChange = (checked: boolean) => {
    onSameAsPermanentChange(checked);
    if (checked) {
      form.setValue("current_province", permanentProvince);
      form.setValue("current_district", permanentDistrict);
      form.setValue("current_municipality", permanentMunicipality);
      form.setValue("current_ward", permanentWard);
    } else {
      form.setValue("current_province", "");
      form.setValue("current_district", "");
      form.setValue("current_municipality", "");
      form.setValue("current_ward", "");
    }
  };

  useEffect(() => {
    if (sameAsPermanent) {
      form.setValue("current_province", permanentProvince);
      form.setValue("current_district", permanentDistrict);
      form.setValue("current_municipality", permanentMunicipality);
      form.setValue("current_ward", permanentWard);
    }
  }, [
    sameAsPermanent,
    permanentProvince,
    permanentDistrict,
    permanentMunicipality,
    permanentWard,
    form,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2 pb-2">
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

      {!sameAsPermanent && (
        <>
          <FormLabel className="text-base font-medium mb-2 block">
            Current address (if different)
          </FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="current_province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("current_district", "");
                      form.setValue("current_municipality", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
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
              name="current_district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("current_municipality", "");
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
                      {currentDistricts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
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
              name="current_municipality"
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
                      {currentMunicipalities.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
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
              name="current_ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ward</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. 5" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
