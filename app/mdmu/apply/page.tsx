import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDMUForm } from "@/components/mdmu/mdmu/components/mdmu-form";

export default function ApplyPage() {
  return (
    <main className="min-h-screen py-12 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Navigation */}
          <Link
            href="/#apply"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <MDMUForm />
          </div>
        </div>
      </div>
    </main>
  );
}
