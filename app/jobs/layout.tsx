import { Suspense } from "react";
import Footer from "@/components/sections/layout/footer/footer";
import { DefaultNav } from "@/components/sections/layout/navigation/default-nav";
import { JobsLayoutClient } from "@/components/jobs/JobsLayoutClient";

export default function JobsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DefaultNav />
      <Suspense fallback={null}>
        <JobsLayoutClient>{children}</JobsLayoutClient>
      </Suspense>
      <Footer />
    </>
  );
}
