import ContactView from "@/components/sections/contact-us/view/contact-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | BiratBazar",
  description:
    "Have questions? Get in touch with our team for support, inquiries, or feedback. We are here to help you grow your business.",
};

const ContactPage = () => {
  return <ContactView />;
};

export default ContactPage;
