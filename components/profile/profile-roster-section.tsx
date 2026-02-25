"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Users, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getMyGraduates, deleteGraduate } from "@/services/graduates";
import type { GraduateRoster } from "@/types/graduate-roster";
import { toast } from "sonner";
import { ProfileRosterEditableItem } from "./profile-roster-editable-item";

export function ProfileRosterSection() {
  const [graduates, setGraduates] = useState<GraduateRoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [graduateToDelete, setGraduateToDelete] =
    useState<GraduateRoster | null>(null);

  const fetchGraduates = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getMyGraduates();
      setGraduates(all);
    } catch (err) {
      console.error("Failed to load roster:", err);
      toast.error("Failed to load roster.");
      setGraduates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraduates();
  }, [fetchGraduates]);

  const openDeleteDialog = (graduate: GraduateRoster) => {
    setGraduateToDelete(graduate);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setGraduateToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!graduateToDelete) return;
    const id = graduateToDelete.id;
    setDeletingId(id);
    try {
      await deleteGraduate(id);
      setGraduates((prev) => prev.filter((g) => g.id !== id));
      toast.success("Graduate removed from roster.");
      closeDeleteDialog();
    } catch (err) {
      console.error("Failed to delete graduate:", err);
      toast.error("Failed to remove graduate.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Skilled Workforce Roster
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Your graduate roster entries.
            </p>
          </div>
        </div>
        <div className="mt-4">
          {graduates.length > 0 ? (
            <ul className="space-y-4">
              {graduates.map((g) => (
                <li key={g.id}>
                  <ProfileRosterEditableItem
                    graduate={g}
                    onUpdate={(updated) =>
                      setGraduates((prev) =>
                        prev.map((x) => (x.id === updated.id ? updated : x)),
                      )
                    }
                    onDelete={openDeleteDialog}
                    deletingId={deletingId}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="rounded-full bg-indigo-50 p-4 mb-4">
                <Users className="w-10 h-10 text-indigo-400" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                You have not added any graduates to your roster yet.
              </p>
              <Link href="/jobs/roster/create?source=roster">
                <Button className="inline-flex gap-2 bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4" />
                  Add graduate
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setGraduateToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove graduate from roster?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-gray-900">
                {graduateToDelete?.name ?? "this graduate"}
              </span>{" "}
              from your roster. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={!!deletingId}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
