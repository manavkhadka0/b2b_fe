"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { createService, getSubCategories } from "@/services/categories";
import type { SubCategory } from "@/types/create-wish-type";

export default function CreateServicePage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    SubCategory: "",
  });

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await getSubCategories();
        setSubcategories(data);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        setError("Failed to load subcategories. Please try again.");
      } finally {
        setIsLoadingSubCategories(false);
      }
    };

    if (isAuthenticated) {
      fetchSubCategories();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.SubCategory) {
      setError("SubCategory is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createService({
        name: formData.name.trim(),
        SubCategory: parseInt(formData.SubCategory),
      });
      router.push("/admin/services");
    } catch (error: any) {
      console.error("Failed to create service:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to create service. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 -ml-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Create Service</h2>
        <p className="text-sm text-slate-500">
          Add a new service to the system.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="SubCategory"
              className="block text-sm font-medium text-slate-700"
            >
              SubCategory <span className="text-rose-500">*</span>
            </label>
            <select
              id="SubCategory"
              required
              disabled={isLoadingSubCategories}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
              value={formData.SubCategory}
              onChange={(e) =>
                setFormData({ ...formData, SubCategory: e.target.value })
              }
            >
              <option value="">
                {isLoadingSubCategories
                  ? "Loading subcategories..."
                  : "Select a subcategory"}
              </option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Enter service name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingSubCategories}
              className="inline-flex items-center rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Create Service"}
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
