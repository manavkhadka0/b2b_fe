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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, GraduationCap } from "lucide-react";
import type { ApprenticeshipFormValues } from "../types";

const TRADE_CHOICES = [
  "Mechanical",
  "Automobile",
  "Electrical",
  "Civil",
  "IT",
  "Hotel Mgmt.",
  "ECD",
  "Tea Technology",
];

const INSTITUTE_CHOICES = [
  "Manamohan Memorial Polytechnic — Mechanical Engineering, Automobile Engineering, Electrical Engineering (Budiganga, Morang)",
  "Ratna Kumar Bantawa Bahuprabidhik Shikshyalaya — Information Technology (Kankai, Jhapa)",
  "Ratna Kumar Bantawa Bahuprabidhik Shikshyalaya — Information Technology (Jahada, Morang)",
  "Ratna Kumar Bantawa Bahuprabidhik Shikshyalaya — Information Technology (Damak, Jhapa)",
  "Nara Bahadur Karmacharya Bahuprabidhik Shikshyalaya — Hotel Management (Itahari, Sunsari)",
  "Aadarsha School — Information Technology, Early Childhood Development (Biratnagar, Morang)",
  "Ratna Kumar Bantawa Bahuprabidhik Shikshyalaya — Tea Technology (Ilam)",
];

interface Step3TradeInstituteProps {
  form: UseFormReturn<ApprenticeshipFormValues>;
}

export function Step3TradeInstitute({ form }: Step3TradeInstituteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="trade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trade / Field Applying For *</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select trade/field" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TRADE_CHOICES.map((trade) => (
                  <SelectItem key={trade} value={trade}>
                    {trade}
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
        name="preferredTrainingProvider"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Training Provider (Institute) *</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select training provider" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {INSTITUTE_CHOICES.map((institute) => (
                  <SelectItem key={institute} value={institute}>
                    {institute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
