"use client";

import { Loader2 } from "lucide-react";
import type { Wish, Offer } from "@/types/wish";
import type { Job } from "@/types/types";
import { ProfileWishesTable } from "./profile-wishes-table";
import { ProfileOffersTable } from "./profile-offers-table";
import { ProfileJobsTable } from "./profile-jobs-table";

interface ProfileContentProps {
  activeTab: string;
  wishes: Wish[];
  offers: Offer[];
  myJobs: Job[];
  appliedJobs: Job[];
  wishesLoading: boolean;
  offersLoading: boolean;
  myJobsLoading: boolean;
  appliedJobsLoading: boolean;
  deletingWishId: number | null;
  deletingOfferId: number | null;
  convertingId: number | null;
  onEditWish: (wish: Wish) => void;
  onEditOffer: (offer: Offer) => void;
  onEditJob?: (job: Job) => void;
  onDeleteWish: (id: number) => void;
  onDeleteOffer: (id: number) => void;
  onConvertWish: (wish: Wish) => void;
  onConvertOffer: (offer: Offer) => void;
}

export function ProfileContent({
  activeTab,
  wishes,
  offers,
  myJobs,
  appliedJobs,
  wishesLoading,
  offersLoading,
  myJobsLoading,
  appliedJobsLoading,
  deletingWishId,
  deletingOfferId,
  convertingId,
  onEditWish,
  onEditOffer,
  onEditJob,
  onDeleteWish,
  onDeleteOffer,
  onConvertWish,
  onConvertOffer,
}: ProfileContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "wishes":
        if (wishesLoading) {
          return (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          );
        }
        if (wishes.length === 0) {
          return (
            <div className="py-20 text-center text-sm text-gray-500">
              You have not created any wishes yet.
            </div>
          );
        }
        return (
          <ProfileWishesTable
            wishes={wishes}
            deletingWishId={deletingWishId}
            convertingId={convertingId}
            onEdit={onEditWish}
            onDelete={onDeleteWish}
            onConvert={onConvertWish}
          />
        );

      case "offers":
        if (offersLoading) {
          return (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          );
        }
        if (offers.length === 0) {
          return (
            <div className="py-20 text-center text-sm text-gray-500">
              You have not created any offers yet.
            </div>
          );
        }
        return (
          <ProfileOffersTable
            offers={offers}
            deletingOfferId={deletingOfferId}
            convertingId={convertingId}
            onEdit={onEditOffer}
            onDelete={onDeleteOffer}
            onConvert={onConvertOffer}
          />
        );

      case "my-jobs":
        if (myJobsLoading) {
          return (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          );
        }
        if (myJobs.length === 0) {
          return (
            <div className="py-20 text-center text-sm text-gray-500">
              You have not posted any jobs yet.
            </div>
          );
        }
        return (
          <ProfileJobsTable
            jobs={myJobs}
            showEditButton={!!onEditJob}
            onEdit={onEditJob}
          />
        );

      case "applied-jobs":
        if (appliedJobsLoading) {
          return (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
            </div>
          );
        }
        if (appliedJobs.length === 0) {
          return (
            <div className="py-20 text-center text-sm text-gray-500">
              You have not applied to any jobs yet.
            </div>
          );
        }
        return (
          <ProfileJobsTable
            jobs={appliedJobs}
            showEditButton={false}
          />
        );

      default:
        return null;
    }
  };

  return <div className="flex-1 p-4 md:p-5">{renderContent()}</div>;
}
