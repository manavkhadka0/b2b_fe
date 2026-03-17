"use client";

import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsletterPage() {
  const pdfPath = "/CIM_Newsletter_Issue 36, Mangsir 2082-compressed.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "CIM_Newsletter_Issue_36_Mangsir_2082.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 relative inline-block">
              Newsletter
              <div className="relative mt-4">
                <img
                  src="/Rectangle.svg"
                  alt="decorative underline"
                  className="absolute left-1/2 -translate-x-1/2 transform scale-110 w-full h-8"
                />
              </div>
            </h1>
            <p className="text-lg text-gray-600 mt-6">
              CIM Newsletter - Issue 36, Mangsir 2082
            </p>
          </div>

          {/* PDF Viewer Container */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                CIM Newsletter Issue 36
              </h2>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex items-center gap-2"
                >
                  <a
                    href={pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in New Tab
                  </a>
                </Button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="w-full" style={{ height: "calc(100vh - 100px)" }}>
              <iframe
                src={`${pdfPath}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full border-0"
                title="CIM Newsletter PDF Viewer"
                style={{ minHeight: "900px" }}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              For the best viewing experience, use the download button or open
              in a new tab.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
