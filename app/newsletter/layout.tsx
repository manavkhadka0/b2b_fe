import Footer from "@/components/sections/layout/footer/footer";
import { DefaultNav } from "@/components/sections/layout/navigation/default-nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CIM Newsletter | BiratBazar",
  description: "Stay updated with the latest business news and trends with the CIM Newsletter from BiratBazar.",
 
};

export default function WishOfferLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DefaultNav />
      {children}
      <Footer />
    </>
  );
}
