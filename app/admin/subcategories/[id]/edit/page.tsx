"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getSubCategoryById,
  updateSubCategory,
  getCategories,
} from "@/services/categories";
import type { SubCategory, Category } from "@/types/create-wish-type";

export default function EditSubCategoryPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const subcategoryId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<SubCategory | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    example_items: "",
    reference: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subcatData, catsData] = await Promise.all([
          getSubCategoryById(subcategoryId),
          getCategories(),
        ]);
        setSubcategory(subcatData);
        setCategories(catsData);
        setFormData({
          name: subcatData.name,
          example_items: subcatData.example_items || "",
          reference: subcatData.reference || "",
          category: subcatData.category.toString(),
        });
        if (subcatData.image) {
          setImagePreview(subcatData.image);
        }
      } catch (error) {
        console.error("Failed to fetch subcategory:", error);
        setError("Failed to load subcategory. Please try again.");
      } finally {
        setIsLoading(false);
        setIsLoadingCategories(false);
      }
    };

    if (isAuthenticated && subcategoryId) {
      fetchData();
    }
  }, [isAuthenticated, subcategoryId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.category) {
      setError("Category is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateSubCategory(subcategoryId, {
        name: formData.name.trim(),
        example_items: formData.example_items.trim(),
        reference: formData.reference.trim(),
        category: parseInt(formData.category),
        image: imageFile,
      });
      router.push("/admin/subcategories");
    } catch (error: any) {
      console.error("Failed to update subcategory:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to update subcategory. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-sm text-slate-500">
          Loading subcategory...
        </div>
      </div>
    );
  }

  if (!subcategory) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Subcategory not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Edit Subcategory
        </h2>
        <p className="text-sm text-slate-500">
          Update subcategory information.
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
              htmlFor="category"
              className="block text-sm font-medium text-slate-700"
            >
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              required
              disabled={isLoadingCategories}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">
                {isLoadingCategories
                  ? "Loading categories..."
                  : "Select a category"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
              Example Items
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
              Reference
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

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-slate-700"
            >
              Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 rounded-md object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingCategories}
              className="inline-flex items-center rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Updating..." : "Update Subcategory"}
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
