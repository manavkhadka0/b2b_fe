"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { WishOfferContent } from "../../components/WishOfferContent";
import { useParams } from "next/navigation";

export default function WishCategoryPage() {
  const params = useParams();
  const slug = params.slug as string[] | undefined;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <WishOfferContent 
        initialType="WISH"
        slug={slug}
      />
    </Suspense>
  );
}
