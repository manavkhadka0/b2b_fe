import React from "react";
import WishOfferCard from "@/components/wish-offer-card";
import { WISH_DATA } from "@/constants/wish";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <div className="flex justify-between items-center  p-4 max-w-7xl mx-auto px-4 ">
        <h2 className="text-xl font-bold">Offers</h2>
        <Link href={"/wishOffer/offer/create-offer"}>
          <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white">
            Create Offer
          </button>
        </Link>
      </div>
      <div className="p-4 bg-white rounded-lg border max-w-7xl mx-auto px-4 py-10 ">
        {/* Offers Cards */}
        <div className="grid md:grid-cols-2 grid-cols-1  gap-4">
          {WISH_DATA.map((wish, index) => (
            <WishOfferCard
              key={index}
              title={wish.title}
              description={wish.description}
              tags={[wish.product_or_service]}
              hCode={[wish.hCode]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
