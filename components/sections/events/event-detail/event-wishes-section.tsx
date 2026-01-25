"use client";
import { HeaderSubtitle } from "../../common/header-subtitle";
import { useEventWishes } from "@/app/utils/wishOffer";
import WishOfferCard from "@/components/wish-offer-card";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface EventWishesSectionProps {
  eventSlug: string;
}

const EventWishesSection = ({ eventSlug }: EventWishesSectionProps) => {
  const { wishes, isLoading: wishLoading, error: wishError } = useEventWishes(eventSlug);
  const router = useRouter();

  if (wishLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeaderSubtitle
        title="Wishes"
        subtitle="Check out what people are wishing for this event"
      />

      {wishes && wishes.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-6">
          {wishes.map((wish) => (
            <WishOfferCard
              key={wish.id}
              title={wish.title}
              description={wish.description || null}
              hCode={wish.product?.hs_code || undefined}
              matchPercentage={wish.match_percentage}
              province={wish.province}
              municipality={wish.municipality}
              ward={wish.ward}
              image={wish.image || undefined}
              type={wish.type}
              time={wish.created_at}
              onClick={() => router.push(`/wishOffer/wishes/${wish.id}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No wishes available for this event.</p>
      )}
    </div>
  );
};

export default EventWishesSection;
