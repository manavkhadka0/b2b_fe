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
import { Phone, Mail } from "lucide-react";
import type { InternshipFormValues } from "../types";

interface Step3SupervisorDetailsProps {
  form: UseFormReturn<InternshipFormValues>;
}

export function Step3SupervisorDetails({ form }: Step3SupervisorDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="supervisorName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>College Supervisor / Coordinator Name *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter supervisor name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="supervisorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supervisor Email *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    placeholder="supervisor@college.edu"
                    className="pl-10"
                    type="email"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supervisorMobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supervisor Mobile Number *</FormLabel>
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
      </div>
    </motion.div>
  );
}
