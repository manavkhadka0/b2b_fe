"use client";
import { HeaderSubtitle } from "../../common/header-subtitle";
import { useOffers } from "@/app/utils/wishOffer";
import WishOfferCard from "@/components/wish-offer-card";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const EventOffersSection = () => {
  const { offers, isLoading: offerLoading, error: offerError } = useOffers();
  const router = useRouter();

  if (offerLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeaderSubtitle
        title="Offers"
        subtitle="Check out special offers for this event"
      />

      {offers && offers.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-6">
          {offers.map((offer) => (
            <WishOfferCard
              key={offer.id}
              title={offer.title}
              description={""}
              tags={[
                offer.product?.name ||
                  offer.service?.name ||
                  "No tag available",
              ]}
              hCode={[offer.product?.hs_code || "No HS Code"]}
              matchPercentage={offer.match_percentage || 0}
              onClick={() => router.push(`/wishOffer/offer/${offer.id}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No offers available for this event.</p>
      )}
    </div>
  );
};

export default EventOffersSection;
