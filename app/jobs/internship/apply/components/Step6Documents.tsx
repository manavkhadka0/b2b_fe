"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText } from "lucide-react";

interface Step6DocumentsProps {
  recommendationFile: File | null;
  citizenshipFile: File | null;
  onRecommendationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCitizenshipChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveRecommendation: () => void;
  onRemoveCitizenship: () => void;
}

export function Step6Documents({
  recommendationFile,
  citizenshipFile,
  onRecommendationChange,
  onCitizenshipChange,
  onRemoveRecommendation,
  onRemoveCitizenship,
}: Step6DocumentsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-base font-medium">
          College Recommendation / Internship Request Letter (Required for
          academic internships)
        </Label>
        <div className="mt-2">
          <input
            type="file"
            id="recommendation-upload"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={onRecommendationChange}
          />
          <label
            htmlFor="recommendation-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, DOCX (MAX. 5MB)
            </p>
          </label>
          {recommendationFile && (
            <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 rounded-md">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-900 flex-1">
                {recommendationFile.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemoveRecommendation}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">
          Citizenship/ID (Optional, as per policy)
        </Label>
        <div className="mt-2">
          <input
            type="file"
            id="citizenship-upload"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={onCitizenshipChange}
          />
          <label
            htmlFor="citizenship-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, JPG, PNG (MAX. 5MB)
            </p>
          </label>
          {citizenshipFile && (
            <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 rounded-md">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-900 flex-1">
                {citizenshipFile.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemoveCitizenship}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
