import MDMUView from "@/components/mdmu/mdmu/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mero Desh Merai Udpadan | BiratBazar",
  description:
    "Explore local Nepalese products and industrial initiatives through 'Mero Desh Merai Udpadan'. Supporting home-grown businesses and economic growth.",
};

export default function Home() {
  return <MDMUView />;
}
