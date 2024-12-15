import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JobBriz",
  description: "JobBriz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
