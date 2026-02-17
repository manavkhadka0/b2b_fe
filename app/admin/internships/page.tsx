"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  getInternshipRegistrations,
  deleteInternshipRegistration,
  getIndustries,
} from "@/services/internship";
import type { InternshipRegistration, Industry } from "@/types/internship";
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
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";
import { Trash2 } from "lucide-react";

export default function AdminInternshipsPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<InternshipRegistration[]>(
    [],
  );
  const [industriesMap, setIndustriesMap] = useState<Record<number, string>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<InternshipRegistration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regData, industries] = await Promise.all([
          getInternshipRegistrations(),
          getIndustries(),
        ]);
        setRegistrations(regData.results);
        const map: Record<number, string> = {};
        industries.forEach((ind) => {
          map[ind.id] = ind.name;
        });
        setIndustriesMap(map);
      } catch (err) {
        setError("Failed to load internship applications.");
        setRegistrations([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget || deleteTarget.id == null) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteInternshipRegistration(deleteTarget.id);
      setRegistrations((prev) => prev.filter((r) => r.id !== deleteTarget.id));
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
        "Failed to delete application. Please try again.";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  const displayRegistrations = registrations.filter((r) => r.id != null);

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Internship Applications
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          View and manage internship applications.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <AdminTableWrapper minWidthClass="min-w-[640px]">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Industry
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Department
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Availability
              </th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  Loading applications...
                </td>
              </tr>
            ) : displayRegistrations.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  No internship applications found.
                </td>
              </tr>
            ) : (
              displayRegistrations.map((reg) => (
                <tr
                  key={reg.id!}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-slate-900">
                      {reg.full_name || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {reg.email || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {reg.internship_industry != null
                      ? (industriesMap[reg.internship_industry] ??
                        `#${reg.internship_industry}`)
                      : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {reg.preferred_department || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {reg.availability || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/internships/${reg.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(reg)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 shadow-sm transition hover:bg-rose-50 hover:border-rose-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the application for{" "}
              <span className="font-medium">
                {deleteTarget?.full_name || "this applicant"}
              </span>
              ? This action cannot be undone.
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
