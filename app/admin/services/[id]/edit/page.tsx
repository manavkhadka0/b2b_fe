"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getServiceById,
  updateService,
  getSubCategories,
} from "@/services/categories";
import type { Service, SubCategory } from "@/types/create-wish-type";

export default function EditServicePage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const serviceId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState<Service | null>(null);
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
    const fetchData = async () => {
      try {
        const [serviceData, subcatsData] = await Promise.all([
          getServiceById(serviceId),
          getSubCategories(),
        ]);
        setService(serviceData);
        setSubcategories(subcatsData);

        // Extract SubCategory ID (API returns `subcategory` object with id and name)
        const serviceAny = serviceData as any;
        let subCategoryId: number | null = null;

        // Check for lowercase `subcategory` first (as per API response)
        if (serviceAny.subcategory) {
          if (
            typeof serviceAny.subcategory === "object" &&
            serviceAny.subcategory.id
          ) {
            subCategoryId = serviceAny.subcategory.id;
          } else if (typeof serviceAny.subcategory === "number") {
            subCategoryId = serviceAny.subcategory;
          }
        }
        // Fallback to uppercase `SubCategory` if lowercase doesn't exist
        else if (serviceAny.SubCategory) {
          if (
            typeof serviceAny.SubCategory === "object" &&
            serviceAny.SubCategory.id
          ) {
            subCategoryId = serviceAny.SubCategory.id;
          } else if (typeof serviceAny.SubCategory === "number") {
            subCategoryId = serviceAny.SubCategory;
          }
        }

        setFormData({
          name: serviceData.name,
          SubCategory: subCategoryId ? subCategoryId.toString() : "",
        });
      } catch (error) {
        console.error("Failed to fetch service:", error);
        setError("Failed to load service. Please try again.");
      } finally {
        setIsLoading(false);
        setIsLoadingSubCategories(false);
      }
    };

    if (isAuthenticated && serviceId) {
      fetchData();
    }
  }, [isAuthenticated, serviceId]);

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
      await updateService(serviceId, {
        name: formData.name.trim(),
        SubCategory: parseInt(formData.SubCategory),
      });
      router.push("/admin/services");
    } catch (error: any) {
      console.error("Failed to update service:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to update service. Please try again.",
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
          Loading service...
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Service not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Edit Service</h2>
        <p className="text-sm text-slate-500">Update service information.</p>
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
                <option key={subcategory.id} value={subcategory.id.toString()}>
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
              {isSubmitting ? "Updating..." : "Update Service"}
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
