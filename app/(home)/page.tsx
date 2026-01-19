import type { Metadata } from "next";
import LandingView from "@/components/sections/landing-page/view/landing-view";

export const metadata: Metadata = {
  title: "Birat Bazaar | B2B Marketplace & Business Networking Platform",
  description:
    "Birat Bazaar is a B2B marketplace connecting businesses, service providers, and organizations in Nepal. Discover events, offers, wishes, and business support services to help your company grow.",
  keywords: [
    "Birat Bazaar",
    "B2B marketplace",
    "business to business",
    "Nepal business platform",
    "Biratnagar business",
    "business networking",
    "trade events",
    "business services",
    "offers and wishes",
  ],
  openGraph: {
    title: "Birat Bazaar | B2B Marketplace & Business Networking Platform",
    description:
      "Join Birat Bazaar to discover B2B opportunities, events, offers, and business services in Nepal. Connect with partners and grow your business.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Birat Bazaar | B2B Marketplace & Business Networking Platform",
    description:
      "Explore Birat Bazaar, a dedicated B2B marketplace and networking platform for businesses in Nepal.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Birat Bazaar",
    url: "",
    description:
      "Birat Bazaar is a B2B marketplace and business networking platform connecting companies, service providers, and organizations in Nepal.",
    potentialAction: {
      "@type": "SearchAction",
      target: "/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD for better SEO visibility of Birat Bazaar
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingView />
    </>
  );
}

