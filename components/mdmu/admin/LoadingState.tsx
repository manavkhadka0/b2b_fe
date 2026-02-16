import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading applications...
      </p>
    </div>
  );
}

