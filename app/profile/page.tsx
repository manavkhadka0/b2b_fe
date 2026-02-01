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
import { emptyCvProfile } from "@/types/cv";
import type { CvProfile } from "@/types/cv";
import {
  getJobseekerProfile,
  mapApiToCvProfile,
  createJobseekerProfile,
  isProfileNotFoundError,
} from "@/services/jobseeker";

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

  // CV profile (fetched from jobseeker API when user exists)
  const [cvProfile, setCvProfile] = useState<CvProfile>(() => emptyCvProfile());
  const [cvProfileLoading, setCvProfileLoading] = useState(false);
  const [cvProfileNotFound, setCvProfileNotFound] = useState(false);
  const [creatingCv, setCreatingCv] = useState(false);

  const fetchCvProfile = useCallback(async () => {
    if (!user?.username) return;
    setCvProfileLoading(true);
    setCvProfileNotFound(false);
    try {
      const data = await getJobseekerProfile(user.username);
      setCvProfile(mapApiToCvProfile(data));
    } catch (err) {
      if (isProfileNotFoundError(err)) {
        setCvProfileNotFound(true);
        setCvProfile(emptyCvProfile());
      } else {
        console.error("Error fetching CV profile:", err);
        setCvProfile(emptyCvProfile());
      }
    } finally {
      setCvProfileLoading(false);
    }
  }, [user?.username]);

  const handleCreateCv = useCallback(async () => {
    if (!user?.username) return;
    setCreatingCv(true);
    try {
      await createJobseekerProfile();
      await fetchCvProfile();
    } catch (err) {
      console.error("Error creating CV profile:", err);
    } finally {
      setCreatingCv(false);
    }
  }, [user?.username, fetchCvProfile]);

  useEffect(() => {
    if (user?.username) fetchCvProfile();
  }, [user?.username, fetchCvProfile]);

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
    mutateOffers
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
      <div className="min-h-screen bg-gray-50">
        <ResponsiveContainer className="py-10 px-4 sm:px-5 md:px-6">
          <div className="space-y-8">
            <div className="relative w-full bg-[#020A33] text-white rounded-xl overflow-hidden">
              <div className="absolute top-0 right-0">
                <div className="w-48 h-48 bg-[#E31B54] rounded-full opacity-20 translate-x-20 -translate-y-20" />
              </div>
              <div className="absolute bottom-0 right-0">
                <div className="w-32 h-32 bg-blue-800 rounded-full opacity-20 translate-x-16 translate-y-16" />
              </div>
              <div className="relative p-8 space-y-6">
                <div className="h-10 w-64 bg-gray-700/50 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-700/50 rounded animate-pulse" />
                  <div className="h-6 w-56 bg-gray-700/50 rounded animate-pulse" />
                </div>
                <div className="flex gap-3">
                  <div className="h-9 w-24 bg-gray-700/50 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveContainer className="py-10 px-4 sm:px-5 md:px-6">
        <div className="space-y-8">
          <ProfileHeader user={user} />

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <ProfileSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              <ProfileContent
                activeTab={activeTab}
                wishes={wishes}
                offers={offers}
                myJobs={myJobs}
                appliedJobs={appliedJobs}
                cvProfile={cvProfile}
                onCvProfileUpdate={setCvProfile}
                cvProfileLoading={cvProfileLoading}
                cvProfileNotFound={cvProfileNotFound}
                onCreateCv={handleCreateCv}
                creatingCv={creatingCv}
                username={user?.username ?? null}
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
        </div>
      </ResponsiveContainer>
    </div>
  );
}
