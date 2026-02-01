import { DefaultNav } from "@/components/sections/layout/navigation/default-nav";
import Footer from "@/components/sections/layout/footer/footer";

export default function HowToLayout({
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
