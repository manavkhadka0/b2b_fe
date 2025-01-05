"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { HeaderSubtitle } from "../common/header-subtitle";
import { ResponsiveContainer } from "../common/responsive-container";

type DataNotFoundProps = {
  title: string;
  message: string;
};

export const DataNotFound = ({ title, message }: DataNotFoundProps) => {
  const router = useRouter();

  return (
    <ResponsiveContainer className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-10">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full">
        {/* Text Content Section */}
        <div className="flex flex-col space-y-6 items-center md:items-start text-center md:text-left max-w-md">
          <HeaderSubtitle title={title} subtitle={message} />

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="group w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
            <Button
              variant="default"
              onClick={() => router.push("/")}
              className="group w-full sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Home
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 shrink-0">
          <img
            src="/not-found.svg"
            alt="Not found"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </ResponsiveContainer>
  );
};
