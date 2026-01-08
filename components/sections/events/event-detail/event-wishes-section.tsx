"use client";
import { HeaderSubtitle } from "../../common/header-subtitle";
import { useWishes } from "@/app/utils/wishOffer";
import WishOfferCard from "@/components/wish-offer-card";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const EventWishesSection = () => {
  const { wishes, isLoading: wishLoading, error: wishError } = useWishes();
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
              description={""}
              tags={[
                wish.product?.category?.name ||
                  wish.service?.name ||
                  "No tag available",
              ]}
              hCode={[wish.product?.hs_code || ""]}
              matchPercentage={wish.match_percentage}
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
