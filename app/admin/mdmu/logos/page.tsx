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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import {
  CompanyLogo,
  CompanyLogoResponse,
} from "@/components/mdmu/mdmu/components/types";

import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import LogoForm from "./logo-form";

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
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 min-h-[400px] flex items-center justify-center">
        Failed to load logos: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Company Logos</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage company logos displayed on the website
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add New Logo
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <Input
          placeholder="Search logos by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredLogos.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {searchQuery
                ? "No logos found matching your search."
                : "No logos found."}
            </p>
            {!searchQuery && (
              <p className="text-gray-500 text-sm mt-2">
                Click &quot;Add New Logo&quot; to get started.
              </p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogos.map((logo) => (
                <TableRow key={logo.id}>
                  <TableCell>
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={logo.logo}
                        alt={logo.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{logo.name}</TableCell>
                  <TableCell className="text-gray-600">{logo.slug}</TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(logo.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(logo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteLogo(logo)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              logo for <strong>{deleteLogo?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
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
