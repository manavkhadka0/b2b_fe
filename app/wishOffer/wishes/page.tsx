import React from "react";
import WishOfferCard from "@/components/wish-offer-card";
import Link from "next/link";
import { getWishes } from "@/app/utils/wishOffer";

// Main Page Component
export default async function WishPage() {
  const wishes = await getWishes();

  return (
    <div>
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-bold">Wishes</h2>
        <Link href={"/wishOffer/wishes/create-wish"}>
          <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
            Create Wish
          </button>
        </Link>
      </div>

      <div className="p-4 bg-white rounded-lg border max-w-7xl mx-auto px-4 py-10">
        {/* Wishes Cards */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {wishes.map((wish) => (
            <WishOfferCard
              key={wish.id}
              title={wish.title}
              description={
                wish.product?.description || wish.service?.description || ""
              }
              tags={[wish.product?.name || wish.service?.name || ""]}
              hCode={[wish.product?.hs_code || ""]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
