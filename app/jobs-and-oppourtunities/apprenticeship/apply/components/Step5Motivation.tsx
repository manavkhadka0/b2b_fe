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
import type { ApprenticeshipFormValues } from "../types";

interface Step5MotivationProps {
  form: UseFormReturn<ApprenticeshipFormValues>;
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
        name="motivationLetter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Motivation Letter * (150-300 words)</FormLabel>
            <FormDescription>
              Why choose this industry? Explain your interest and motivation.
            </FormDescription>
            <FormControl>
              <MinimalTiptapEditor
                value={field.value || ""}
                onChange={(content) => {
                  field.onChange(typeof content === "string" ? content : "");
                }}
                placeholder="Write your motivation letter here..."
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
                    : wordCount > 300
                    ? "text-red-500"
                    : "text-green-600"
                )}
              >
                {wordCount} words
                {wordCount < 150 && (
                  <span className="ml-1">(minimum 150 words)</span>
                )}
                {wordCount > 300 && (
                  <span className="ml-1">(maximum 300 words)</span>
                )}
              </span>
            </div>
          </FormItem>
        )}
      />
    </motion.div>
  );
}
