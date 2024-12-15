import { ReactNode, Suspense } from "react";

const SuspenseFallback = (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-100/30 to-blue-100/30 animate-gradient" />
    </div>
  </div>
);

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={SuspenseFallback}>{children}</Suspense>;
}
