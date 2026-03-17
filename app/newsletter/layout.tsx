import Footer from "@/components/sections/layout/footer/footer";
import { DefaultNav } from "@/components/sections/layout/navigation/default-nav";

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
