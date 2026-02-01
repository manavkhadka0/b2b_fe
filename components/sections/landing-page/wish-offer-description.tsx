"use client";

import { ResponsiveContainer } from "../common/responsive-container";
import { useTranslation } from "react-i18next";
import { Heart, Gift } from "lucide-react";

export default function WishOfferDescription() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-white">
      <ResponsiveContainer>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl text-center font-bold text-slate-900 mb-4">
              {t("wishOfferDesc.title")}
            </h2>
            <p className="text-slate-600  text-center text-lg">
              {t("wishOfferDesc.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t("wishOfferDesc.wishTitle")} ({t("navigation.buyer")})
                </h3>
              </div>
              <p className="text-slate-600">
                {t("wishOfferDesc.wishDescription")}
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                <li>{t("wishOfferDesc.wishList1")}</li>
                <li>{t("wishOfferDesc.wishList2")}</li>
                <li>{t("wishOfferDesc.wishList3")}</li>
                <li>{t("wishOfferDesc.wishList4")}</li>
                <li>{t("wishOfferDesc.wishList5")}</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t("wishOfferDesc.offerTitle")} ({t("navigation.seller")})
                </h3>
              </div>
              <p className="text-slate-600">
                {t("wishOfferDesc.offerDescription")}
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                <li>{t("wishOfferDesc.offerList1")}</li>
                <li>{t("wishOfferDesc.offerList2")}</li>
                <li>{t("wishOfferDesc.offerList3")}</li>
                <li>{t("wishOfferDesc.offerList4")}</li>
                <li>{t("wishOfferDesc.offerList5")}</li>
              </ul>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
