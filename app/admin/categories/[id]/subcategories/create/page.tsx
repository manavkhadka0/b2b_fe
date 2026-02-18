"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { createSubCategory, getCategoryById } from "@/services/categories";
import type { Category } from "@/types/create-wish-type";

export default function CreateSubCategoryForCategoryPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const categoryId = parseInt(params.id as string);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    example_items: "",
    reference: "",
  });

  const returnUrl = `/admin/categories/${categoryId}`;

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(categoryId);
        setCategory(data);
      } catch (err) {
        console.error("Failed to fetch category:", err);
        setError("Failed to load category. Please try again.");
      } finally {
        setIsLoadingCategory(false);
      }
    };

    if (isAuthenticated && categoryId && !isNaN(categoryId)) {
      fetchCategory();
    }
  }, [isAuthenticated, categoryId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createSubCategory({
        name: formData.name.trim(),
        example_items: formData.example_items.trim(),
        reference: formData.reference.trim(),
        category: categoryId,
        image: null,
      });
      router.push(returnUrl);
    } catch (error: any) {
      console.error("Failed to create subcategory:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to create subcategory. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  if (!categoryId || isNaN(categoryId)) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Invalid category.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.push(returnUrl)}
        className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 -ml-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Subcategories
      </button>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Create Subcategory
          {category && (
            <span className="ml-2 text-base font-normal text-slate-600">
              for {category.name}
            </span>
          )}
        </h2>
        <p className="text-sm text-slate-500">
          Add a new subcategory to this category.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {category && (
            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-700">
                Category: {category.name}
              </p>
              <p className="text-xs text-slate-500">
                This subcategory will be added to the selected category.
              </p>
            </div>
          )}

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
              placeholder="Enter subcategory name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="example_items"
              className="block text-sm font-medium text-slate-700"
            >
              Example Items (eg: 6802, 6810)
            </label>
            <textarea
              id="example_items"
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Enter example items (comma separated)"
              value={formData.example_items}
              onChange={(e) =>
                setFormData({ ...formData, example_items: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="reference"
              className="block text-sm font-medium text-slate-700"
            >
              Reference (eg: ISIC 7110/7490)
            </label>
            <input
              id="reference"
              type="text"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Enter reference"
              value={formData.reference}
              onChange={(e) =>
                setFormData({ ...formData, reference: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingCategory}
              className="inline-flex items-center rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Create Subcategory"}
            </button>
            <button
              type="button"
              onClick={() => router.push(returnUrl)}
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
