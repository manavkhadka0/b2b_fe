"use client";

import { HeaderSubtitle } from "../common/header-subtitle";
import ContactForm from "./contact-form";
import ContactMap from "./contact-map";
import { useTranslation } from "react-i18next";

export default function ContactUsHeroSection() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
      <div className="space-y-6">
        <HeaderSubtitle
          title={t("contact.dropUsALine")}
          subtitle={t("contact.respondWithin")}
          className="px-0 py-0"
        />
        <ContactForm />
      </div>
      <div className="w-full">
        <ContactMap />
      </div>
    </div>
  );
}
