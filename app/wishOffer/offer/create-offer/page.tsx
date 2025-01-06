"use client";

import { HeaderSubtitle } from "@/components/sections/common/header-subtitle";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { CreateWishOfferForm } from "@/components/sections/create-wish/create-wish-form";
import { useRouter } from "next/navigation";

export default function CreateWishPage() {
  const router = useRouter();
  return (
    <ResponsiveContainer className="py-10 space-y-8">
      <HeaderSubtitle
        title="Create an Offer"
        subtitle="Create an Offer to get help from the community"
        className="mb-8"
      />
      <CreateWishOfferForm
        is_wish_or_offer="offers"
        onClose={() => {
          router.push("/wishOffer/offers");
        }}
      />
    </ResponsiveContainer>
  );
}
