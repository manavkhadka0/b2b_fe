import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
    </div>
  );
}

