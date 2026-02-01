"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { WishOfferContent } from "./components/WishOfferContent";

export default function WishOfferPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <WishOfferContent />
    </Suspense>
  );
}
