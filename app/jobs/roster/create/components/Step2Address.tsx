"use client";

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
import {
  getProvinces,
  getDistricts,
  getMunicipalities,
} from "@manavkhadka0/nepal-address";
import type { RosterFormValues } from "../types";

interface Step2AddressProps {
  form: UseFormReturn<RosterFormValues>;
}

export function Step2Address({ form }: Step2AddressProps) {
  const province = form.watch("permanent_province");
  const district = form.watch("permanent_district");
  const provinces = getProvinces();
  const districts = province ? getDistricts(province) : [];
  const municipalities = district ? getMunicipalities(district) : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <FormLabel className="text-base font-medium mb-2 block">
        Address *
      </FormLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="permanent_province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province *</FormLabel>
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  form.setValue("permanent_district", "");
                  form.setValue("permanent_municipality", "");
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
          name="permanent_district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District *</FormLabel>
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  form.setValue("permanent_municipality", "");
                }}
                disabled={!province}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        province ? "Select district" : "Select province first"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districts.map((d) => (
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
          name="permanent_municipality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Municipality *</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!district}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        district
                          ? "Select municipality"
                          : "Select district first"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {municipalities.map((m) => (
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
          name="permanent_ward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ward *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 5" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
}
