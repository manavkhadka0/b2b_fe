"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { createIndustry } from "@/services/industry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateIndustryPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    website_link: "",
    file_link: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoFile(null);
      setLogoPreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createIndustry({
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        description: formData.description.trim() || undefined,
        website_link: formData.website_link.trim() || undefined,
        file_link: formData.file_link.trim() || undefined,
        logo: logoFile,
      });
      router.push("/admin/industry");
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string; detail?: string } }; message?: string };
      setError(
        errObj?.response?.data?.message ||
          errObj?.response?.data?.detail ||
          "Failed to create industry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="-ml-2 inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>
      <div>
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Create Industry
        </h2>
        <p className="text-sm text-slate-500">
          Add a new industry to the system.
        </p>
      </div>

      <div className="min-w-0 rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              required
              placeholder="Enter industry name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_link">Website URL</Label>
            <Input
              id="website_link"
              type="url"
              placeholder="https://www.example.com"
              value={formData.website_link}
              onChange={(e) =>
                setFormData({ ...formData, website_link: e.target.value })
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file_link">YouTube video URL</Label>
            <Input
              id="file_link"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.file_link}
              onChange={(e) =>
                setFormData({ ...formData, file_link: e.target.value })
              }
              className="w-full"
            />
            <p className="text-xs text-slate-500">
              URL for YouTube video (e.g. https://www.youtube.com/watch?v=VIDEO_ID)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Enter industry description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="resize-none w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo (image file)</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full"
            />
            {logoPreview && (
              <div className="mt-2">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-20 w-20 rounded object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Create Industry"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
