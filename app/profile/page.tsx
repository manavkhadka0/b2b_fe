"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { Loader2 } from "lucide-react";
import { useMyWishes, useMyOffers } from "@/app/utils/wishOffer";
import { ProfileHeader } from "@/components/profile/profile-header";
import { WishesOffersTabs } from "@/components/profile/wishes-offers-tabs";
import { EditDialog } from "@/components/profile/edit-dialog";
import { ConvertDialog } from "@/components/profile/convert-dialog";
import { useEditData } from "@/components/profile/use-edit-data";
import { useDeleteHandlers } from "@/components/profile/use-delete-handlers";
import { useConvertHandler } from "@/components/profile/use-convert-handler";
import type { Wish, Offer } from "@/types/wish";

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

  const {
    editingWish,
    editingOffer,
    editingWishData,
    editingOfferData,
    loadingEditData,
    openEditWish,
    openEditOffer,
    closeEditDialog,
  } = useEditData();

  const {
    deletingWishId,
    deletingOfferId,
    handleDeleteWish,
    handleDeleteOffer,
  } = useDeleteHandlers(mutateWishes, mutateOffers);

  const { convertItem, isConverting, convertingId } = useConvertHandler(
    mutateWishes,
    mutateOffers,
  );

  // Convert dialog state
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [itemToConvert, setItemToConvert] = useState<{
    sourceType: "wish" | "offer";
    sourceId: number;
    targetType: "wish" | "offer";
    title?: string;
  } | null>(null);

  // Handle redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user && typeof window !== "undefined") {
      router.push("/login?returnTo=/profile");
    }
  }, [authLoading, user, router]);

  const handleEditSuccess = () => {
    closeEditDialog();
    if (editingWish) {
      mutateWishes();
    } else if (editingOffer) {
      mutateOffers();
    }
  };

  const handleConvertWish = (wish: Wish) => {
    setItemToConvert({
      sourceType: "wish",
      sourceId: wish.id,
      targetType: "offer",
      title: wish.title,
    });
    setConvertDialogOpen(true);
  };

  const handleConvertOffer = (offer: Offer) => {
    setItemToConvert({
      sourceType: "offer",
      sourceId: offer.id,
      targetType: "wish",
      title: offer.title,
    });
    setConvertDialogOpen(true);
  };

  const handleConfirmConvert = async () => {
    if (!itemToConvert) return;

    try {
      await convertItem({
        sourceType: itemToConvert.sourceType,
        sourceId: itemToConvert.sourceId,
        targetType: itemToConvert.targetType,
      });
      setConvertDialogOpen(false);
      setItemToConvert(null);
    } catch (error) {
      // Error is already handled in the hook with toast
      // Keep dialog open so user can retry or cancel
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      <ResponsiveContainer className="py-5 px-4 sm:px-5 md:px-6 lg:py-8">
        <ProfileHeader user={user} />

        <WishesOffersTabs
          wishes={wishes}
          offers={offers}
          wishesLoading={wishesLoading}
          offersLoading={offersLoading}
          deletingWishId={deletingWishId}
          deletingOfferId={deletingOfferId}
          convertingId={convertingId}
          onEditWish={openEditWish}
          onEditOffer={openEditOffer}
          onDeleteWish={handleDeleteWish}
          onDeleteOffer={handleDeleteOffer}
          onConvertWish={handleConvertWish}
          onConvertOffer={handleConvertOffer}
        />

        <EditDialog
          editingWish={editingWish}
          editingOffer={editingOffer}
          editingWishData={editingWishData}
          editingOfferData={editingOfferData}
          loadingEditData={loadingEditData}
          onClose={closeEditDialog}
          onEditSuccess={handleEditSuccess}
        />

        <ConvertDialog
          open={convertDialogOpen}
          onOpenChange={setConvertDialogOpen}
          onConfirm={handleConfirmConvert}
          sourceType={itemToConvert?.sourceType || null}
          targetType={itemToConvert?.targetType || null}
          itemTitle={itemToConvert?.title}
          isConverting={isConverting}
        />
      </ResponsiveContainer>
    </div>
  );
}
