"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { cn } from "@/lib/utils";
import type { InternshipFormValues } from "../types";

interface Step5MotivationProps {
  form: UseFormReturn<InternshipFormValues>;
  wordCount: number;
}

export function Step5Motivation({ form, wordCount }: Step5MotivationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="motivationalLetter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Motivational Letter * (150-1000 words)</FormLabel>
            <FormDescription>
              Why are you choosing this industry/company?
            </FormDescription>
            <FormControl>
              <MinimalTiptapEditor
                value={field.value || ""}
                onChange={(content) => {
                  field.onChange(typeof content === "string" ? content : "");
                }}
                placeholder="Write your motivational letter here..."
                output="html"
                className="min-h-[300px]"
                editorContentClassName="p-4"
              />
            </FormControl>
            <div className="flex justify-between items-center">
              <FormMessage />
              <span
                className={cn(
                  "text-sm font-medium",
                  wordCount < 150
                    ? "text-red-500"
                    : wordCount > 1000
                    ? "text-red-500"
                    : wordCount >= 150 && wordCount <= 300
                    ? "text-green-600"
                    : "text-gray-500"
                )}
              >
                {wordCount} words
                {wordCount < 150 && (
                  <span className="ml-1">(minimum 150 words)</span>
                )}
                {wordCount > 1000 && (
                  <span className="ml-1">(maximum 1000 words)</span>
                )}
              </span>
            </div>
          </FormItem>
        )}
      />
    </motion.div>
  );
}
