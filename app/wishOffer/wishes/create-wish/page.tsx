"use client";

import { HeaderSubtitle } from "@/components/sections/common/header-subtitle";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { CreateWishOfferForm } from "@/components/sections/create-wish/create-wish-form";

export default function CreateWishPage() {
  return (
    <ResponsiveContainer className="py-10 space-y-8">
      <HeaderSubtitle
        title="Create a Wish"
        subtitle="Create a Wish to get help from the community"
        className="mb-8"
      />
      <CreateWishOfferForm is_wish_or_offer="wishes" />
    </ResponsiveContainer>
  );
}
