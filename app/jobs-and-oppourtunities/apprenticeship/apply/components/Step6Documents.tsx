"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText } from "lucide-react";

interface Step6DocumentsProps {
  citizenshipFile: File | null;
  supportingCertificatesFiles: File[];
  onCitizenshipChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSupportingCertificatesChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onRemoveCitizenship: () => void;
  onRemoveSupportingCertificate: (index: number) => void;
}

export function Step6Documents({
  citizenshipFile,
  supportingCertificatesFiles,
  onCitizenshipChange,
  onSupportingCertificatesChange,
  onRemoveCitizenship,
  onRemoveSupportingCertificate,
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
          Citizenship (as per policy) *
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

      <div>
        <Label className="text-base font-medium">
          Any Supporting Certificates (Optional)
        </Label>
        <div className="mt-2">
          <input
            type="file"
            id="supporting-certificates-upload"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
            multiple
            onChange={onSupportingCertificatesChange}
          />
          <label
            htmlFor="supporting-certificates-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, JPG, PNG, DOC, DOCX (MAX. 5MB each)
            </p>
          </label>
          {supportingCertificatesFiles.length > 0 && (
            <div className="mt-2 space-y-2">
              {supportingCertificatesFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-blue-50 rounded-md"
                >
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-900 flex-1">
                    {file.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSupportingCertificate(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
