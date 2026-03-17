"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { MDMUResponse } from "@/components/mdmu/mdmu/components/mdmu-form/types";
import { API_ENDPOINTS } from "@/components/mdmu/mdmu/components/mdmu-form/constants";
import {
  fetcher,
  ALL_OPTION,
  API_BASE_URL,
} from "@/components/mdmu/admin/constants";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { LoadingState } from "@/components/mdmu/admin/LoadingState";
import { ErrorState } from "@/components/mdmu/admin/ErrorState";
import { EmptyState } from "@/components/mdmu/admin/EmptyState";
import { ApplicationFilters } from "@/components/mdmu/admin/ApplicationFilters";
import { ApplicationsTable } from "@/components/mdmu/admin/ApplicationsTable";
import { ViewApplicationDialog } from "@/components/mdmu/admin/ViewApplicationDialog";
import { StatusUpdateDialog } from "@/components/mdmu/admin/StatusUpdateDialog";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";

export default function AdminMDMUApplicationsPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [selectedApplication, setSelectedApplication] =
    useState<MDMUResponse | null>(null);
  const [viewApplication, setViewApplication] = useState<MDMUResponse | null>(
    null,
  );
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [filters, setFilters] = useState({
    company: "",
    category: "",
    status: "",
  });

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  const {
    data: applications = [],
    error,
    isLoading,
  } = useSWR<MDMUResponse[]>(`${API_ENDPOINTS.register}`, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2,
  });

  const uniqueCategories = useMemo(() => {
    if (!Array.isArray(applications)) return [];
    return Array.from(
      new Set(
        applications
          .map(
            (app) => app.nature_of_industry_sub_category_detail?.category?.name,
          )
          .filter(Boolean),
      ),
    );
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (!Array.isArray(applications)) return [];

    return applications.filter((app) => {
      if (!app) return false;

      const companyMatch =
        !filters.company ||
        app.name_of_company
          ?.toLowerCase()
          .includes(filters.company.toLowerCase().trim());

      const categoryMatch =
        filters.category === ALL_OPTION ||
        !filters.category ||
        app.nature_of_industry_sub_category_detail?.category?.name?.toLowerCase() ===
          filters.category.toLowerCase().trim();

      const statusMatch =
        filters.status === ALL_OPTION ||
        !filters.status ||
        app.status?.toLowerCase() === filters.status.toLowerCase().trim();

      return companyMatch && categoryMatch && statusMatch;
    });
  }, [applications, filters]);

  const handleStatusUpdate = useCallback(
    async (status: "Pending" | "Approved" | "Rejected") => {
      if (!selectedApplication) return;

      setStatusUpdateLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/mdmu/${selectedApplication.id}/status/?status=${status}`,
          { method: "PATCH" },
        );

        if (response.ok) {
          await mutate(`${API_ENDPOINTS.register}`);
          setSelectedApplication(null);
        }
      } catch (error) {
        console.error("Failed to update status", error);
      } finally {
        setStatusUpdateLoading(false);
      }
    },
    [selectedApplication],
  );

  const handlePrintFile = useCallback((fileUrl: string) => {
    window.open(fileUrl, "_blank");
  }, []);

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  const hasFilters = Object.values(filters).some((f) => f !== "");

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          MDMU Applications
        </h2>
        <p className="text-sm text-slate-500">
          View and manage MDMU registration applications.
        </p>
      </div>

      <div className="min-w-0 rounded-xl border bg-white p-4 shadow-sm">
        <ApplicationFilters
          filters={filters}
          uniqueCategories={uniqueCategories}
          onFilterChange={setFilters}
        />
      </div>

      <AdminTableWrapper minWidthClass="min-w-[560px]">
        {filteredApplications.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <ApplicationsTable
            applications={filteredApplications}
            onView={setViewApplication}
            onEdit={setSelectedApplication}
            onPrint={handlePrintFile}
          />
        )}
      </AdminTableWrapper>

      <ViewApplicationDialog
        application={viewApplication}
        isOpen={!!viewApplication}
        onClose={() => setViewApplication(null)}
      />

      <StatusUpdateDialog
        application={selectedApplication}
        isOpen={!!selectedApplication}
        isLoading={statusUpdateLoading}
        onClose={() => setSelectedApplication(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
