"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { Loader2 } from "lucide-react";
import { useMyWishes, useMyOffers } from "@/app/utils/wishOffer";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileContent } from "@/components/profile/profile-content";
import { EditDialog } from "@/components/profile/edit-dialog";
import { ConvertDialog } from "@/components/profile/convert-dialog";
import { useEditData } from "@/components/profile/use-edit-data";
import { useDeleteHandlers } from "@/components/profile/use-delete-handlers";
import { useConvertHandler } from "@/components/profile/use-convert-handler";
import { getMyJobs, getAppliedJobs } from "@/services/jobs";
import { transformJobs, transformAppliedJobs } from "@/utils/jobTransform";
import type { Wish, Offer } from "@/types/wish";
import type { Job } from "@/types/types";

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

  // Jobs state
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [myJobsLoading, setMyJobsLoading] = useState(true);
  const [appliedJobsLoading, setAppliedJobsLoading] = useState(true);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState("wishes");

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

  // Fetch jobs
  const fetchMyJobs = useCallback(async () => {
    setMyJobsLoading(true);
    try {
      const response = await getMyJobs();
      const transformedJobs = transformJobs(response.results);
      setMyJobs(transformedJobs);
    } catch (error) {
      console.error("Error fetching my jobs:", error);
    } finally {
      setMyJobsLoading(false);
    }
  }, []);

  const fetchAppliedJobs = useCallback(async () => {
    setAppliedJobsLoading(true);
    try {
      const response = await getAppliedJobs();
      // Transform applications - extract job from each application
      const transformedJobs = transformAppliedJobs(response.results);
      setAppliedJobs(transformedJobs);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    } finally {
      setAppliedJobsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyJobs();
      fetchAppliedJobs();
    }
  }, [user, fetchMyJobs, fetchAppliedJobs]);

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

  const handleEditJob = (job: Job) => {
    router.push(`/jobs/create?slug=${job.slug}`);
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

        <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            
            <ProfileContent
              activeTab={activeTab}
              wishes={wishes}
              offers={offers}
              myJobs={myJobs}
              appliedJobs={appliedJobs}
              wishesLoading={wishesLoading}
              offersLoading={offersLoading}
              myJobsLoading={myJobsLoading}
              appliedJobsLoading={appliedJobsLoading}
              deletingWishId={deletingWishId}
              deletingOfferId={deletingOfferId}
              convertingId={convertingId}
              onEditWish={openEditWish}
              onEditOffer={openEditOffer}
              onEditJob={handleEditJob}
              onDeleteWish={handleDeleteWish}
              onDeleteOffer={handleDeleteOffer}
              onConvertWish={handleConvertWish}
              onConvertOffer={handleConvertOffer}
            />
          </div>
        </div>

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
