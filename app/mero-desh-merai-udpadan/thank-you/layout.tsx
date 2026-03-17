import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | MDMU | BiratBazar",
  description: "Thank you for supporting Mero Desh Merai Udpadan.",
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
