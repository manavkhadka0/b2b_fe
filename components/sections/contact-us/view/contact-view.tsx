import { ResponsiveContainer } from "../../common/responsive-container";
import ContactDetails from "../contact-details";
import ContactUsHeroSection from "../contact-us-hero-section";

export default function ContactView() {
  return (
    <>
      <ResponsiveContainer className="py-10 space-y-10">
        <ContactUsHeroSection />
        <ContactDetails />
      </ResponsiveContainer>
    </>
  );
}
