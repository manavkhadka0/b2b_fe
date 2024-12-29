import { HeaderSubtitle } from "../common/header-subtitle";
import ContactForm from "./contact-form";
import ContactMap from "./contact-map";

export default function ContactUsHeroSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
      <div className="space-y-6">
        <HeaderSubtitle
          title="Drop Us A Line"
          subtitle="We normally respond within 2 business days"
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
