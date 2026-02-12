import Image from "next/image";
import Link from "next/link";
import { ResponsiveContainer } from "../common/responsive-container";
import { HeaderSubtitle } from "../common/header-subtitle";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar } from "lucide-react";

const OPPORTUNITIES = [
  "CIM Member Industries",
  "Stratus & Innovative Products",
  "Women Entrepreneurs",
  "Other priority areas (as endorsed by CIM)",
  "Willingness to cooperate CIM initiatives (Voluntary)",
];

export function CimZoneSection() {
  return (
    <ResponsiveContainer className="space-y-6 py-10 mb-10">
      {/* Logo + title: same pattern as other event sections */}
      <div className="space-y-6">
        <HeaderSubtitle
          title="CIM Industry Experience Zone"
          subtitle="The Chamber of Industries Morang (CIM) has established a permanent showcase at the CIM Secretariat for Nepali products, innovations, and B2B promotion."
        />
      </div>

      {/* Zone image: same card style as event images */}
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-gray-100 bg-gray-100">
        <Image
          src="/zone/cim-zone.jpeg"
          alt="CIM Industry Experience Zone at CIM Secretariat"
          fill
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>

      {/* Description: same body text as app */}
      <div className="space-y-4">
        <p className="text-gray-600">
          The Chamber of Industries Morang (CIM) has established the{" "}
          <strong className="text-gray-800">
            CIM Industry Experience Zone
          </strong>{" "}
          at the CIM Secretariat premises to showcase Nepali products of
          national pride, flagship innovations from CIM member industries,
          innovative startups, women entrepreneurs, and industry-specific
          skilled human resources. The Zone serves as a permanent platform for
          B2B promotion, market linkages, learning, and partnership building,
          strengthening the visibility and market reach of Nepali products.
        </p>
        <p className="text-gray-600">
          Visitors can see, feel, and experience local industries through
          products, company profiles, workplace insights, potential partners,
          occupations, and skills—and, where available, also visit industries
          virtually through digital/VR content.
        </p>
      </div>

      {/* Opportunities: clean list, same border/card feel as event cards */}
      <div className="rounded-lg border border-gray-100 bg-white p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Display opportunities are open to:
        </h3>
        <ul className="space-y-2">
          {OPPORTUNITIES.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-gray-600 text-sm"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Book button */}
      <div className="flex justify-center pt-4">
        <Button asChild size="lg" className="bg-blue-800 hover:bg-blue-900 gap-2">
          <Link href="/events/zone-booking">
            <Calendar className="w-5 h-5" />
            Book a Display Slot
          </Link>
        </Button>
      </div>
    </ResponsiveContainer>
  );
}
