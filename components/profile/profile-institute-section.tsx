"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Institute } from "@/types/institute";
import type {
  GraduateRoster,
  CreateGraduateRosterPayload,
} from "@/types/graduate-roster";
import {
  Building2,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  Users,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GraduateRosterForm } from "@/components/jobs/roster/GraduateRosterForm";
import {
  deleteGraduate,
  getAllGraduatesForInstitution,
  updateGraduate,
} from "@/services/graduates";
import { resendInstituteVerificationEmail } from "@/services/institute";
import { toast } from "sonner";

interface ProfileInstituteSectionProps {
  institute: Institute | null;
  loading: boolean;
}

export function ProfileInstituteSection({
  institute,
  loading,
}: ProfileInstituteSectionProps) {
  const [graduates, setGraduates] = useState<GraduateRoster[]>([]);
  const [graduatesLoading, setGraduatesLoading] = useState(false);
  const [graduatesError, setGraduatesError] = useState<string | null>(null);
  const [editingGraduate, setEditingGraduate] = useState<GraduateRoster | null>(
    null,
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
   const [resendVerificationLoading, setResendVerificationLoading] =
    useState(false);

  useEffect(() => {
    if (!institute || !institute.institute_name) return;

    let cancelled = false;

    async function loadGraduates(currentInstituteName: string) {
      setGraduatesLoading(true);
      setGraduatesError(null);
      try {
        const all = await getAllGraduatesForInstitution(currentInstituteName);
        if (!cancelled) {
          setGraduates(all);
        }
      } catch (err) {
        console.error("Failed to load graduates for institute:", err);
        if (!cancelled) {
          setGraduatesError("Failed to load graduates.");
        }
      } finally {
        if (!cancelled) {
          setGraduatesLoading(false);
        }
      }
    }

    loadGraduates(institute.institute_name);

    return () => {
      cancelled = true;
    };
  }, [institute]);

  const handleOpenEdit = (graduate: GraduateRoster) => {
    setEditingGraduate(graduate);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (payload: CreateGraduateRosterPayload) => {
    if (!editingGraduate) return;
    try {
      const updated = await updateGraduate(editingGraduate.id, payload);
      setGraduates((prev) =>
        prev.map((g) => (g.id === updated.id ? updated : g)),
      );
      toast.success("Graduate updated.");
      setEditDialogOpen(false);
      setEditingGraduate(null);
    } catch (err) {
      console.error("Failed to update graduate:", err);
      toast.error("Failed to update graduate.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this graduate from the roster?")) return;
    setDeletingId(id);
    try {
      await deleteGraduate(id);
      setGraduates((prev) => prev.filter((g) => g.id !== id));
      toast.success("Graduate removed from roster.");
    } catch (err) {
      console.error("Failed to delete graduate:", err);
      toast.error("Failed to remove graduate.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleResendVerification = async () => {
    if (!institute) return;
    setResendVerificationLoading(true);
    try {
      await resendInstituteVerificationEmail();
      toast.success("Verification email resent.");
    } catch (err) {
      console.error("Failed to resend verification email:", err);
      toast.error("Failed to resend verification email.");
    } finally {
      setResendVerificationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Building2 className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          You have not registered an institute yet. Register to manage the
          skilled workforce roster.
        </p>
        <Button asChild>
          <Link href="/jobs/roster">Go to Roster</Link>
        </Button>
      </div>
    );
  }

  const hasGraduates = graduates.length > 0;

  return (
    <div className="py-4 space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {institute.institute_name}
              </h2>
              <p className="text-sm text-gray-500">
                {institute.institute_type}
              </p>
            </div>
          </div>
          {institute.is_verified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Verified
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-sm font-medium">
                <Clock className="w-4 h-4" />
                Pending verification
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleResendVerification}
                disabled={resendVerificationLoading}
              >
                {resendVerificationLoading && (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                )}
                Resend verification
              </Button>
            </div>
          )}
        </div>
        <div className="p-5 space-y-3 text-sm">
          <div className="flex items-start gap-3 text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
            <span>
              {institute.municipality}, {institute.district},{" "}
              {institute.province} · Ward {institute.ward_no}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-4 h-4 shrink-0 text-gray-400" />
            <a
              href={`mailto:${institute.email}`}
              className="text-indigo-600 hover:underline"
            >
              {institute.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-4 h-4 shrink-0 text-gray-400" />
            <span>{institute.phone_number}</span>
          </div>
          {institute.website && (
            <div className="flex items-center gap-3 text-gray-600">
              <span className="w-4 shrink-0 text-gray-400">🔗</span>
              <a
                href={institute.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {institute.website}
              </a>
            </div>
          )}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Primary contact
            </p>
            <p className="text-gray-700">
              {institute.primary_contact_person} ·{" "}
              {institute.primary_contact_person_designation}
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              {institute.primary_contact_person_email} ·{" "}
              {institute.primary_contact_person_phone}
            </p>
          </div>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
          {institute.is_verified && (
            <Button size="sm" asChild>
              <Link href="/jobs/roster/create">Add graduate</Link>
            </Button>
          )}
        </div>
      </div>

      {institute.is_verified && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Graduate roster
                </h3>
                <p className="text-xs text-gray-500">
                  View, edit, and remove graduates linked to this institute.
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            {graduatesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : graduatesError ? (
              <p className="text-sm text-red-600">{graduatesError}</p>
            ) : !hasGraduates ? (
              <p className="text-sm text-gray-500">
                No graduates have been added for this institute yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm table-fixed border-separate border-spacing-0">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold first:rounded-tl-lg">
                        Name & contact
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Trade / level
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Current location
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Job status
                      </th>
                      <th className="px-4 py-2 text-right font-semibold last:rounded-tr-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {graduates.map((g) => (
                      <tr
                        key={g.id}
                        className="hover:bg-gray-50/70 transition-colors"
                      >
                        <td className="px-4 py-3 align-middle">
                          <div className="font-medium text-gray-900 mb-0.5">
                            {g.name}
                          </div>
                          <div className="text-xs text-gray-500">{g.email}</div>
                          <div className="text-xs text-gray-500">
                            {g.phone_number}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <div className="text-gray-800 mb-0.5">
                            {g.subject_trade_stream || "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {g.level_completed || "Level not specified"}
                            {g.passed_year ? ` · ${g.passed_year}` : ""}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          {g.current_municipality || g.current_district ? (
                            <>
                              <div className="text-gray-800 mb-0.5">
                                {g.current_municipality || "—"},{" "}
                                {g.current_district || "—"}
                              </div>
                              <div className="text-xs text-gray-500">
                                Province: {g.current_province || "—"}, Ward:{" "}
                                {g.current_ward || "—"}
                              </div>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">
                              Not specified
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap ${
                              g.job_status === "Available for Job"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-slate-50 text-slate-600 border border-slate-100"
                            }`}
                          >
                            {g.job_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenEdit(g)}
                            >
                              <Pencil className="w-4 h-4" />
                              <span className="sr-only">Edit graduate</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(g.id)}
                              disabled={deletingId === g.id}
                            >
                              {deletingId === g.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              <span className="sr-only">Delete graduate</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog
        open={editDialogOpen && !!editingGraduate}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setEditingGraduate(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl w-[95%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Edit graduate
            </DialogTitle>
          </DialogHeader>
          {editingGraduate && (
            <div className="mt-2">
              <GraduateRosterForm
                defaultInstituteId={
                  typeof editingGraduate.institute === "number"
                    ? editingGraduate.institute
                    : editingGraduate.institute?.id
                }
                defaultValues={editingGraduate}
                onSubmit={handleEditSubmit}
                submitLabel="Save changes"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
