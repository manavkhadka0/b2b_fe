import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MDMU Endorsements | BiratBazar",
  description:
    "Explore the brands and champions supporting domestic production through the Mero Desh Merai Udpadan initiative.",
};

export default function EndorsementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
