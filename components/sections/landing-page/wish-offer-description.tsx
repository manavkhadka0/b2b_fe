"use client";

import { ResponsiveContainer } from "../common/responsive-container";
import { HeaderSubtitle } from "../common/header-subtitle";
import { useTranslation } from "react-i18next";

export default function WishOfferDescription() {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer className="py-10">
      <HeaderSubtitle
        title={t("wishOfferDesc.title")}
        subtitle={t("wishOfferDesc.subtitle")}
      />

      <div className="mt-12 grid md:grid-cols-2 gap-8">
        {/* Wish Section */}
        <div className="space-y-6 p-8 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {t("wishOfferDesc.wishTitle")} ({t("navigation.buyer")})
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              {t("wishOfferDesc.wishDescription")}
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>{t("wishOfferDesc.wishList1")}</li>
              <li>{t("wishOfferDesc.wishList2")}</li>
              <li>{t("wishOfferDesc.wishList3")}</li>
              <li>{t("wishOfferDesc.wishList4")}</li>
              <li>{t("wishOfferDesc.wishList5")}</li>
            </ul>
            <p className="text-gray-600">
              {t("wishOfferDesc.wishConclusion")}
            </p>
          </div>
        </div>

        {/* Offer Section */}
        <div className="space-y-6 p-8 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {t("wishOfferDesc.offerTitle")} ({t("navigation.seller")})
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              {t("wishOfferDesc.offerDescription")}
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>{t("wishOfferDesc.offerList1")}</li>
              <li>{t("wishOfferDesc.offerList2")}</li>
              <li>{t("wishOfferDesc.offerList3")}</li>
              <li>{t("wishOfferDesc.offerList4")}</li>
              <li>{t("wishOfferDesc.offerList5")}</li>
            </ul>
            <p className="text-gray-600">
              {t("wishOfferDesc.offerConclusion")}
            </p>
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
}
