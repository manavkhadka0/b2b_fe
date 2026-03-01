"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const RESOURCE_LINKS = [
  {
    id: "samriddhi",
    title: "Legal & Administrative Information for Business in Nepal",
    titleNepali: "नेपालमा व्यवसाय सुरु गर्न वा विस्तार गर्न चाहनुहुन्छ?",
    description:
      "Explore legal requirements and administrative information for doing business in Nepal—everything from starting a business to investment. Business registration, required documents, local tax, PAN, VAT, policies, acts, regulations, and forms—all in one place.",
    descriptionNepali:
      "यहाँ तपाईंले व्यवसाय दर्ता प्रक्रिया, आवश्यक कागजात/मापदण्ड, स्थानीय कर, PAN, VAT लगायतका प्रशासनिक तथा कानुनी जानकारी एकै ठाउँमा पाउन सक्नुहुन्छ। साथै नीति, ऐन, नियमावली, निर्देशिका र आवश्यक फारम/फर्म्याट समेत उपलब्ध छन्।",
    url: "https://repository.samriddhi.org",
    domain: "repository.samriddhi.org",
    accentColor: "blue",
  },
  {
    id: "biratnagar-angels",
    title: "Investment, Partners & Mentors",
    titleNepali: "के तपाईंलाई लगानी, पार्टनर, वा मेन्टर चाहिएको छ?",
    description:
      "Connect with the Biratnagar Angel Investors Network for fundraising, mentorship, and business growth. Fundraising prep, mentor connections, networking, partner linkages, pitch opportunities, and follow-up support.",
    descriptionNepali:
      "बिराटनगर एन्जेल नेटवर्कले स्टार्टअप/उद्यमीहरूलाई लगानीकर्ता र अनुभवी व्यवसायिक व्यक्तिहरूसँग जोडेर लगानी/फन्ड रेजिङ तयारी, मेन्टर कनेक्शन, नेटवर्किङ र पार्टनर लिंकज, पिच अवसर र फलो–अप सहयोग प्रदान गर्छ।",
    url: "https://biratnagarangels.com",
    domain: "biratnagarangels.com",
    accentColor: "green",
  },
];

export default function ResourceLinksSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800">
          Resources & Support
        </h2>
        <p className="text-gray-600 mt-1">
          Explore tools and networks to grow your business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {RESOURCE_LINKS.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:border-blue-200">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      resource.accentColor === "blue"
                        ? "bg-blue-100"
                        : "bg-green-100"
                    }`}
                  >
                    <ExternalLink
                      className={`h-5 w-5 ${
                        resource.accentColor === "blue"
                          ? "text-blue-700"
                          : "text-green-700"
                      }`}
                    />
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                </div>

                <h3 className="text-lg font-semibold text-blue-800 group-hover:text-blue-700 transition-colors mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 italic mb-3">
                  {resource.titleNepali}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed flex-1">
                  {resource.description}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mt-3">
                  {resource.descriptionNepali}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-800 group-hover:text-blue-600 transition-colors">
                  Visit: {resource.domain}
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
