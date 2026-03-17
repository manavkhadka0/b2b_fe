import type { Metadata } from "next";
import "./globals.css";
import { Bricolage_Grotesque } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { HtmlLang } from "@/components/sections/layout/html-lang";
import { GoogleAnalytics } from "@/components/sections/layout/google-analytics";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/sections/layout/footer/footer";
import SessionProvider from "@/contexts/SessionProvider";
import { auth } from "@/app/auth";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || "https://biratbazar.com"),
  title: "B2B Marketplace | BiratBazar",
  description: "BiratBazar is the leading B2B marketplace to buy and sell products and services in Nepal. Connect with farmers, manufacturers and service providers.",
  keywords: ["B2B", "Marketplace", "Nepal", "Biratnagar", "Agriculture", "Products", "Services"],
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bricolage.className}  antialiased`}>
        <GoogleAnalytics />
        <NextTopLoader height={3} color="#002B49" />
        <I18nProvider>
          <HtmlLang />
          <SessionProvider session={session}>
            <AuthProvider>
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </AuthProvider>
          </SessionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
