"use client";
import { HeaderSubtitle } from "../../common/header-subtitle";
import { useEventOffers } from "@/app/utils/wishOffer";
import WishOfferCard from "@/components/wish-offer-card";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface EventOffersSectionProps {
  eventSlug: string;
}

const EventOffersSection = ({ eventSlug }: EventOffersSectionProps) => {
  const { offers, isLoading: offerLoading, error: offerError } = useEventOffers(eventSlug);
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
              description={offer.description || null}
              hCode={offer.product?.hs_code || undefined}
              matchPercentage={offer.match_percentage || 0}
              province={offer.province}
              municipality={offer.municipality}
              ward={offer.ward}
              image={offer.image || undefined}
              type={offer.type}
              time={offer.created_at}
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
