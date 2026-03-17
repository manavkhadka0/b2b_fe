import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About MDMU | BiratBazar",
  description:
    "Learn about the Mero Desh Merai Udpadan initiative and its mission to support local industry and economic growth in Nepal.",
};

export default function AboutMDMULayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
