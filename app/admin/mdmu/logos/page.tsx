"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import {
  CompanyLogo,
  CompanyLogoResponse,
} from "@/components/mdmu/mdmu/components/types";

import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import LogoForm from "./logo-form";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/mdmu/company-logo/`;

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  const data: CompanyLogoResponse = await response.json();
  return data.results || [];
};

export default function AdminMDMULogosPage() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<CompanyLogo | null>(null);
  const [deleteLogo, setDeleteLogo] = useState<CompanyLogo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  const {
    data: logos = [],
    error,
    isLoading,
  } = useSWR<CompanyLogo[]>(API_URL, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2,
  });

  const filteredLogos = logos.filter((logo) =>
    logo.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreate = () => {
    setEditingLogo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (logo: CompanyLogo) => {
    setEditingLogo(logo);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteLogo) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}${deleteLogo.slug}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Logo deleted successfully");
        await mutate(API_URL);
        setDeleteLogo(null);
      } else {
        throw new Error("Failed to delete logo");
      }
    } catch (error) {
      toast.error("Failed to delete logo. Please try again.");
      console.error("Error deleting logo:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    setEditingLogo(null);
    await mutate(API_URL);
    toast.success(
      editingLogo ? "Logo updated successfully" : "Logo created successfully",
    );
  };

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading logos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        Failed to load logos: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Endorsements</h2>
          <p className="text-sm text-slate-500">
            Manage company logos displayed on the website.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
        >
          <Plus className="h-4 w-4" />
          Add logo
        </button>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <label
          htmlFor="logo-search"
          className="mb-1.5 block text-xs font-medium text-slate-500"
        >
          Search
        </label>
        <Input
          id="logo-search"
          placeholder="Search logos by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md border-slate-200"
        />
      </div>

      <AdminTableWrapper minWidthClass="min-w-[480px]">
        {filteredLogos.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <p className="text-sm font-medium text-slate-900">
              {searchQuery
                ? "No logos found matching your search."
                : "No logos found."}
            </p>
            {!searchQuery && (
              <p className="mt-1 text-sm text-slate-500">
                Click &quot;Add logo&quot; to get started.
              </p>
            )}
          </div>
        ) : (
          <Table className="min-w-full divide-y divide-slate-200">
            <TableHeader className="bg-slate-50">
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="h-auto w-20 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Logo
                </TableHead>
                <TableHead className="h-auto px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Name
                </TableHead>
                <TableHead className="h-auto px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Slug
                </TableHead>
                <TableHead className="h-auto px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created
                </TableHead>
                <TableHead className="h-auto px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 bg-white">
              {filteredLogos.map((logo) => (
                <TableRow
                  key={logo.id}
                  className="border-0 transition-colors hover:bg-slate-50/50"
                >
                  <TableCell className="px-4 py-3">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded bg-slate-100">
                      <img
                        src={logo.logo}
                        alt={logo.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-medium text-slate-900">
                    {logo.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-slate-600">
                    {logo.slug}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-slate-600">
                    {new Date(logo.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(logo)}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteLogo(logo)}
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AdminTableWrapper>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLogo ? "Edit Logo" : "Create New Logo"}
            </DialogTitle>
            <DialogDescription>
              {editingLogo
                ? "Update the logo information below."
                : "Fill in the details to add a new company logo."}
            </DialogDescription>
          </DialogHeader>
          <LogoForm
            logo={editingLogo}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingLogo(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteLogo}
        onOpenChange={(open) => !open && setDeleteLogo(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete logo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the logo for{" "}
              <span className="font-medium">{deleteLogo?.name}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
