import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "../globals.css";

import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { MDMUAppShell } from "@/components/mdmu/layout/MDMUAppShell";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: " मेरो देश, मेरै उत्पादन अभियान",
  description: " मेरो देश, मेरै उत्पादन अभियान",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.className} antialiased`}>
        <AuthProvider>
          <MDMUAppShell>{children}</MDMUAppShell>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
