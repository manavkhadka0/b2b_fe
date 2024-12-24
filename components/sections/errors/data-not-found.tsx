import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

type DataNotFoundProps = {
  title: string;
  message: string;
};

export const DataNotFound = ({ title, message }: DataNotFoundProps) => {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-gray-900 dark:to-gray-950">
      {/* Decorative gradient circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-200/40 to-cyan-200/40 blur-3xl dark:from-purple-900/30 dark:to-cyan-900/30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-rose-200/40 to-orange-200/40 blur-3xl dark:from-rose-900/30 dark:to-orange-900/30" />
      </div>

      {/* Content */}
      <div className="container relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 p-6">
        {/* Image Section */}
        <div className="w-64 h-64 md:w-96 md:h-96 shrink-0">
          <img
            src="/not-found.svg"
            alt="Not found"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>

        {/* Text Content Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {message}
          </p>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
            <Button
              variant="default"
              onClick={() => router.push("/")}
              className="group"
            >
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
