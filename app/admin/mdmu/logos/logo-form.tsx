"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/mdmu/mdmu/components/types";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

const logoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.union([z.instanceof(File), z.string()]).optional(),
});

type LogoFormValues = z.infer<typeof logoFormSchema>;

interface LogoFormProps {
  logo?: CompanyLogo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const API_URL = "https://cim.baliyoventures.com/api/mdmu/company-logo/";

export default function LogoForm({ logo, onSuccess, onCancel }: LogoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<LogoFormValues>({
    resolver: zodResolver(logoFormSchema),
    defaultValues: {
      name: logo?.name || "",
      logo: logo?.logo || undefined,
    },
  });

  useEffect(() => {
    if (logo?.logo && !selectedFile) {
      setPreviewUrl(logo.logo);
    } else if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [logo, selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      form.setValue("logo", file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    form.setValue("logo", undefined);
    if (logo?.logo) {
      setPreviewUrl(logo.logo);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: LogoFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      if (!logo && !selectedFile) {
        form.setError("logo", {
          type: "manual",
          message: "Logo image is required",
        });
        setIsSubmitting(false);
        return;
      }

      if (selectedFile) {
        formData.append("logo", selectedFile);
      }

      let response: Response;
      if (logo) {
        response = await fetch(`${API_URL}${logo.slug}/`, {
          method: "PATCH",
          body: formData,
        });

        if (!response.ok && response.status === 405) {
          response = await fetch(`${API_URL}${logo.slug}/`, {
            method: "PUT",
            body: formData,
          });
        }
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.logo?.[0] ||
          errorData.name?.[0] ||
          errorData.detail ||
          "Failed to save logo";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error saving logo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter company name"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {previewUrl && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                      <img
                        src={previewUrl}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={removeFile}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {logo && !selectedFile ? "Change Logo" : "Upload Logo"}
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                      />
                    </label>
                    {logo && !selectedFile && (
                      <span className="text-sm text-gray-500">
                        Current logo will be kept if no new file is selected
                      </span>
                    )}
                  </div>
                  {!logo && !selectedFile && (
                    <p className="text-sm text-red-500">
                      Logo image is required
                    </p>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {logo ? "Updating..." : "Creating..."}
              </>
            ) : logo ? (
              "Update Logo"
            ) : (
              "Create Logo"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
