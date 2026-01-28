"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Clock, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useMyWishes, useMyOffers } from "@/app/utils/wishOffer";
import type { Wish, Offer } from "@/types/wish";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    (parts[0]?.charAt(0) || "") + (parts[1]?.charAt(0) || "")
  ).toUpperCase();
}

function MyWishCard({
  wish,
  onDelete,
  onEdit,
  isDeleting,
}: {
  wish: Wish;
  onDelete: (id: number) => void;
  onEdit: (wish: Wish) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-semibold uppercase">
              {wish.type}
            </Badge>
            {wish.match_percentage !== undefined && (
              <span className="text-[11px] text-gray-500">
                Match:{" "}
                <span className="font-semibold text-blue-600">
                  {wish.match_percentage}%
                </span>
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
            {wish.title}
          </h3>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-gray-500 line-clamp-3">
        {wish.description || "No description provided for this wish."}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3 text-blue-500" />
          {wish.province || "N/A"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(wish.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-1">
        <Link href={`/wishOffer/wishes/${wish.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            View
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs border-gray-200 hover:bg-gray-50"
          onClick={() => onEdit(wish)}
        >
          <Edit2 className="w-3 h-3 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => onDelete(wish.id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <Trash2 className="w-3 h-3 mr-1" />
          )}
          Delete
        </Button>
      </div>
    </div>
  );
}

function MyOfferCard({
  offer,
  onDelete,
  onEdit,
  isDeleting,
}: {
  offer: Offer;
  onDelete: (id: number) => void;
  onEdit: (offer: Offer) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-green-50 text-green-600 border-green-100 text-[10px] font-semibold uppercase">
              {offer.type}
            </Badge>
            {offer.match_percentage !== undefined && (
              <span className="text-[11px] text-gray-500">
                Match:{" "}
                <span className="font-semibold text-green-600">
                  {offer.match_percentage}%
                </span>
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
            {offer.title}
          </h3>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-gray-500 line-clamp-3">
        {offer.description || "No description provided for this offer."}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3 text-green-500" />
          {offer.province || "N/A"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(offer.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-1">
        <Link href={`/wishOffer/offer/${offer.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs border-green-200 text-green-700 hover:bg-green-50"
          >
            View
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs border-gray-200 hover:bg-gray-50"
          onClick={() => onEdit(offer)}
        >
          <Edit2 className="w-3 h-3 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => onDelete(offer.id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <Trash2 className="w-3 h-3 mr-1" />
          )}
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const {
    wishes,
    isLoading: wishesLoading,
    mutate: mutateWishes,
  } = useMyWishes();
  const {
    offers,
    isLoading: offersLoading,
    mutate: mutateOffers,
  } = useMyOffers();

  const [deletingWishId, setDeletingWishId] = useState<number | null>(null);
  const [deletingOfferId, setDeletingOfferId] = useState<number | null>(null);
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/login?returnTo=/profile");
    }
    return null;
  }

  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;

  const openEditWish = (wish: Wish) => {
    setEditingWish(wish);
    setEditingOffer(null);
    setDraftTitle(wish.title || "");
    setDraftDescription(wish.description || "");
  };

  const openEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setEditingWish(null);
    setDraftTitle(offer.title || "");
    setDraftDescription(offer.description || "");
  };

  const closeEditDialog = () => {
    setEditingWish(null);
    setEditingOffer(null);
    setDraftTitle("");
    setDraftDescription("");
    setSavingEdit(false);
  };

  const handleSaveEdit = async () => {
    if (!editingWish && !editingOffer) return;

    try {
      setSavingEdit(true);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      if (!token) {
        toast.error("You must be logged in to edit.");
        setSavingEdit(false);
        return;
      }

      const isWish = !!editingWish;
      const id = isWish ? editingWish!.id : editingOffer!.id;
      const url = isWish
        ? `${API_BASE}/api/wish_and_offers/wishes/${id}/`
        : `${API_BASE}/api/wish_and_offers/offers/${id}/`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: draftTitle,
          description: draftDescription,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      toast.success(
        isWish ? "Wish updated successfully" : "Offer updated successfully",
      );
      if (isWish) {
        mutateWishes();
      } else {
        mutateOffers();
      }
      closeEditDialog();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
      setSavingEdit(false);
    }
  };

  const handleDeleteWish = async (id: number) => {
    try {
      setDeletingWishId(id);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const res = await fetch(`${API_BASE}/api/wish_and_offers/wishes/${id}/`, {
        method: "DELETE",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      if (!res.ok) {
        throw new Error("Failed to delete wish");
      }

      toast.success("Wish deleted successfully");
      mutateWishes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete wish");
    } finally {
      setDeletingWishId(null);
    }
  };

  const handleDeleteOffer = async (id: number) => {
    try {
      setDeletingOfferId(id);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const res = await fetch(`${API_BASE}/api/wish_and_offers/offers/${id}/`, {
        method: "DELETE",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      if (!res.ok) {
        throw new Error("Failed to delete offer");
      }

      toast.success("Offer deleted successfully");
      mutateOffers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete offer");
    } finally {
      setDeletingOfferId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60">
      <ResponsiveContainer className="py-5 px-4 sm:px-5 md:px-6 lg:py-8">
        {/* Header / User info */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 md:p-6 mb-5 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 bg-blue-50">
                <AvatarFallback className="text-blue-700 font-semibold">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                  {fullName}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
              <Link href="/wishOffer/wishes/create-wish">
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                >
                  Create Wish
                </Button>
              </Link>
              <Link href="/wishOffer/offer/create-offer">
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700"
                >
                  Create Offer
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Wishes & Offers */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 md:p-5">
          <Tabs defaultValue="wishes" className="w-full">
            <div className="border-b border-gray-100 px-1 sm:px-2 mb-3 sm:mb-4">
              <TabsList className="bg-transparent h-auto p-0 gap-4 justify-start">
                <TabsTrigger
                  value="wishes"
                  className="px-0 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm md:text-base font-semibold text-gray-500 data-[state=active]:text-blue-600"
                >
                  My Wishes
                </TabsTrigger>
                <TabsTrigger
                  value="offers"
                  className="px-0 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm md:text-base font-semibold text-gray-500 data-[state=active]:text-green-600"
                >
                  My Offers
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="wishes" className="m-0 mt-2">
              {wishesLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              ) : wishes.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  You have not created any wishes yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {wishes.map((wish) => (
                    <MyWishCard
                      key={wish.id}
                      wish={wish}
                      onDelete={handleDeleteWish}
                      onEdit={openEditWish}
                      isDeleting={deletingWishId === wish.id}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="offers" className="m-0 mt-2">
              {offersLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                </div>
              ) : offers.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  You have not created any offers yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {offers.map((offer) => (
                    <MyOfferCard
                      key={offer.id}
                      offer={offer}
                      onDelete={handleDeleteOffer}
                      onEdit={openEditOffer}
                      isDeleting={deletingOfferId === offer.id}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>

        <Dialog
          open={!!editingWish || !!editingOffer}
          onOpenChange={(open) => {
            if (!open) closeEditDialog();
          }}
        >
          <DialogContent className="max-w-md w-[95%] sm:w-full">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">
                {editingWish ? "Edit Wish" : "Edit Offer"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title" className="text-xs sm:text-sm">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="h-9 text-sm"
                  placeholder="Enter title"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-description"
                  className="text-xs sm:text-sm"
                >
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  rows={4}
                  className="text-sm"
                  placeholder="Enter description"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={closeEditDialog}
                  disabled={savingEdit}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                  onClick={handleSaveEdit}
                  disabled={savingEdit || !draftTitle.trim()}
                >
                  {savingEdit ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </ResponsiveContainer>
    </div>
  );
}
