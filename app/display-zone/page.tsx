import { CimZoneSection } from "@/components/sections/events/cim-zone-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Display Zone | Cim Birat Expo | BiratBazar",
  description:
    "Expose your brand to a targeted audience and elevate your visibility to potential customers and industry leaders at the Cim Birat Expo Display Zone.",
};

export default function CimZonePage() {
  return <CimZoneSection />;
}
