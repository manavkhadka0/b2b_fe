"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import type { Wish, Offer } from "@/types/wish";
import { WishCard } from "./wish-card";
import { OfferCard } from "./offer-card";

interface WishesOffersTabsProps {
  wishes: Wish[];
  offers: Offer[];
  wishesLoading: boolean;
  offersLoading: boolean;
  deletingWishId: number | null;
  deletingOfferId: number | null;
  convertingId: number | null;
  onEditWish: (wish: Wish) => void;
  onEditOffer: (offer: Offer) => void;
  onDeleteWish: (id: number) => void;
  onDeleteOffer: (id: number) => void;
  onConvertWish: (wish: Wish) => void;
  onConvertOffer: (offer: Offer) => void;
}

export function WishesOffersTabs({
  wishes,
  offers,
  wishesLoading,
  offersLoading,
  deletingWishId,
  deletingOfferId,
  convertingId,
  onEditWish,
  onEditOffer,
  onDeleteWish,
  onDeleteOffer,
  onConvertWish,
  onConvertOffer,
}: WishesOffersTabsProps) {
  return (
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
                <WishCard
                  key={wish.id}
                  wish={wish}
                  onDelete={onDeleteWish}
                  onEdit={onEditWish}
                  onConvert={onConvertWish}
                  isDeleting={deletingWishId === wish.id}
                  isConverting={convertingId === wish.id}
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
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onDelete={onDeleteOffer}
                  onEdit={onEditOffer}
                  onConvert={onConvertOffer}
                  isDeleting={deletingOfferId === offer.id}
                  isConverting={convertingId === offer.id}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
