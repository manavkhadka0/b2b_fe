import { ResponsiveContainer } from "../../common/responsive-container";
import ContactDetails from "../contact-details";
import ContactForm from "../contact-form";
import ContactMap from "../contact-map";
import ContactUsHeroSection from "../contact-us-hero-section";

export default function ContactView() {
  return (
    <>
      <ResponsiveContainer>
        <ContactUsHeroSection />
      </ResponsiveContainer>
      <ResponsiveContainer>
        <ContactDetails />
      </ResponsiveContainer>
    </>
  );
}
