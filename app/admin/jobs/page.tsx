"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getJobs, deleteJob } from "@/services/jobs";
import type { JobApiResponse } from "@/types/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TablePagination } from "@/components/admin/TablePagination";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";
import { format } from "date-fns";

export default function AdminJobsPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobApiResponse[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<JobApiResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      const data = await getJobs(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        page,
      );
      setJobs(data.results);
      setCount(data.count);
      setHasNext(!!data.next);
      setHasPrevious(!!data.previous);
      if (data.results.length > 0 && (data.next || page === 1)) {
        setPageSize(data.results.length);
      }
      setIsLoading(false);
    };

    if (isAuthenticated) {
      fetchJobs();
    }
  }, [isAuthenticated, page]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteJob(deleteTarget.slug);
      setJobs((prev) => prev.filter((j) => j.slug !== deleteTarget.slug));
      setCount((c) => Math.max(0, c - 1));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const message =
        (
          err as {
            response?: { data?: { detail?: string; error?: string } };
            message?: string;
          }
        )?.response?.data?.detail ||
        (
          err as {
            response?: { data?: { detail?: string; error?: string } };
            message?: string;
          }
        )?.response?.data?.error ||
        (err as { message?: string })?.message ||
        "Failed to delete job. Please try again.";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Jobs Management
        </h2>
        <p className="text-sm text-slate-500">
          View, edit, and delete job listings.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <AdminTableWrapper minWidthClass="min-w-[640px]">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Posted
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Applications
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Loading jobs...
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No jobs found.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.slug}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {job.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {job.company_name || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {job.employment_type}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {job.posted_date
                      ? format(new Date(job.posted_date), "MMM d, yyyy")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {job.applications_count ?? job.total_applicant_count ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/jobs/${job.slug}`)
                        }
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/admin/jobs/${job.slug}/edit`)
                        }
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(job)}
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTableWrapper>

      {jobs.length > 0 && (
        <TablePagination
          page={page}
          count={count}
          resultsLength={jobs.length}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          pageSize={pageSize}
          onPageChange={setPage}
          entityLabel="jobs"
          isLoading={isLoading}
        />
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{deleteTarget?.title}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
