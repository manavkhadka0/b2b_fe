import type { Metadata } from "next";
import "./globals.css";
import { Bricolage_Grotesque } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { NavWrapper } from "@/components/navigation/nav-wrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/sections/layout/footer/footer";

export const metadata: Metadata = {
  title: "B2B Marketplace",
  description: "B2B Marketplace",
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.className}  antialiased`}>
        <NextTopLoader height={3} color="#002B49" />
        <AuthProvider>
          <TooltipProvider>
            <NavWrapper />
            {children}
            <Footer />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
