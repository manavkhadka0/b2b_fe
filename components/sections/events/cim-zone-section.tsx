import Image from "next/image";
import Link from "next/link";
import { ResponsiveContainer } from "../common/responsive-container";
import { HeaderSubtitle } from "../common/header-subtitle";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { CimZoneBookingsList } from "./cim-zone-bookings-list";

const OPPORTUNITIES = [
  "CIM Member Industries",
  "Stratus & Innovative Products",
  "Women Entrepreneurs",
  "Other priority areas (as endorsed by CIM)",
  "Willingness to cooperate CIM initiatives (Voluntary)",
];

const FEATURES = [
  {
    icon: Building2,
    title: "Product Showcase",
    description: "Display national pride products and innovations",
  },
  {
    icon: Users,
    title: "B2B Platform",
    description: "Network and build partnerships",
  },
  {
    icon: TrendingUp,
    title: "Market Reach",
    description: "Strengthen visibility and market linkages",
  },
  {
    icon: Sparkles,
    title: "Virtual Tours",
    description: "Experience industries through VR content",
  },
];

export function CimZoneSection() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <ResponsiveContainer className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <HeaderSubtitle
              title="CIM Industry Experience Zone"
              subtitle="A showcase at the CIM Secretariat for Nepali products, innovations, and B2B promotion."
            />
          </div>

          {/* Hero Image with Overlay */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/zone/cim-zone.jpeg"
              alt="CIM Industry Experience Zone at CIM Secretariat"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                Experience Nepali Innovation
              </h3>
              <p className="text-white/90 text-sm sm:text-base max-w-2xl">
                See, feel, and experience local industries through products,
                profiles, and partnerships
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-5 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-5 h-5 text-blue-700" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The Chamber of Industries Morang (CIM) has established the{" "}
                <span className="font-semibold text-gray-900">
                  CIM Industry Experience Zone
                </span>{" "}
                at the CIM Secretariat premises to showcase Nepali products of
                national pride, flagship innovations from CIM member industries,
                innovative startups, women entrepreneurs, and industry-specific
                skilled human resources.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Zone serves as a permanent platform for B2B promotion,
                market linkages, learning, and partnership building,
                strengthening the visibility and market reach of Nepali
                products.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Visitors can see, feel, and experience local industries through
                products, company profiles, workplace insights, potential
                partners, occupations, and skills—and, where available, also
                visit industries virtually through digital/VR content.
              </p>
            </div>
          </div>

          {/* Opportunities Section */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 sm:p-6 border border-blue-100">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Display Opportunities
              </h3>
            </div>

            <p className="text-gray-700 mb-4 text-sm">
              Display opportunities are open to:
            </p>

            <div className="space-y-2">
              {OPPORTUNITIES.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 bg-white/80 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-700 mt-0.5" />
                  <span className="text-gray-800 text-sm sm:text-[15px]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to Showcase Your Innovation?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Book a display slot and gain visibility for your products and
              services at the CIM Industry Experience Zone
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-white/90 text-blue-700 gap-2 shadow-lg px-8 py-3 text-base font-semibold"
            >
              <Link href="/events/zone-booking">
                <Calendar className="w-5 h-5" />
                Book a Display Slot
              </Link>
            </Button>
          </div>

          {/* Existing Bookings */}
          <div className="pt-8">
            <CimZoneBookingsList />
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
