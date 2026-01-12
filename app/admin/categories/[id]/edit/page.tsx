"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getCategoryById, updateCategory } from "@/services/categories";
import type { Category } from "@/types/create-wish-type";

export default function EditCategoryPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const categoryId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Product",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        setFormData({
          name: data.name,
          description: data.description,
          type: data.type || "Product",
        });
        if (data.image) {
          setImagePreview(data.image);
        }
      } catch (error) {
        console.error("Failed to fetch category:", error);
        setError("Failed to load category. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && categoryId) {
      fetchCategory();
    }
  }, [isAuthenticated, categoryId]);

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

    if (!formData.type) {
      setError("Type is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateCategory(categoryId, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        image: imageFile,
      });
      router.push("/admin/categories");
    } catch (error: any) {
      console.error("Failed to update category:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to update category. Please try again."
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
          Loading category...
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Category not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Edit Category</h2>
        <p className="text-sm text-slate-500">
          Update category information.
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
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-slate-700"
            >
              Type <span className="text-rose-500">*</span>
            </label>
            <select
              id="type"
              required
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="Product">Product</option>
              <option value="Service">Service</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Enter category description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
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
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Updating..." : "Update Category"}
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
