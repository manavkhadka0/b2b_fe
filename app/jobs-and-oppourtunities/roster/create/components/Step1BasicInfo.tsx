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
import { User, Phone, Mail, Calendar, Users, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RosterFormValues } from "../types";
import type { Institute } from "@/types/institute";
import { ROSTER_TYPE_CHOICES } from "../schema";

interface Step1BasicInfoProps {
  form: UseFormReturn<RosterFormValues>;
  institute: Institute | null;
  onOpenCreateInstitute?: () => void;
  hideRosterType?: boolean;
}

export function Step1BasicInfo({
  form,
  institute,
  onOpenCreateInstitute,
  hideRosterType = false,
}: Step1BasicInfoProps) {
  const rosterType = form.watch("roster_type");
  const isRosterGraduates = rosterType === "Roster-Graduates";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Roster type selector - hidden when pre-filled from profile sections */}
      {!hideRosterType && (
        <>
      <FormField
        control={form.control}
        name="roster_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Roster type</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {ROSTER_TYPE_CHOICES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    field.onChange(type);
                    if (type === "Individual") {
                      form.setValue("institute", null);
                      form.setValue("institute_name", "");
                    } else if (institute) {
                      form.setValue("institute", institute.id);
                      form.setValue("institute_name", institute.institute_name);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                    field.value === type
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900"
                      : "border-gray-200 bg-white hover:border-gray-300",
                  )}
                >
                  {type === "Individual" ? (
                    <UserCircle className="h-6 w-6 shrink-0" />
                  ) : (
                    <Users className="h-6 w-6 shrink-0" />
                  )}
                  <span className="font-medium">{type}</span>
                </button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Roster-Graduates: institute requirement */}
      {isRosterGraduates && !hideRosterType && (
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          {institute?.is_verified ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Institute</p>
              <p className="text-sm text-gray-600">{institute.institute_name}</p>
            </div>
          ) : institute ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Your institute is pending verification. Please check your email
                to verify before adding roster graduates.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                To add roster graduates, you need to register and verify your
                institute first.
              </p>
              <button
                type="button"
                onClick={onOpenCreateInstitute}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Create institute
              </button>
            </div>
          )}
        </div>
      )}
        </>
      )}

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full name *</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...field}
                  placeholder="Enter full name"
                  className="pl-10"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    placeholder="98XXXXXXXX"
                    type="tel"
                    maxLength={15}
                    className="pl-10"
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
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    placeholder="email@example.com"
                    type="email"
                    className="pl-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth *</FormLabel>
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
      </div>
    </motion.div>
  );
}
