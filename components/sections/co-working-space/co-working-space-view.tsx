import Link from "next/link";
import { ResponsiveContainer } from "@/components/sections/common/responsive-container";
import { HeaderSubtitle } from "@/components/sections/common/header-subtitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const ROOMS = [
  {
    id: "big-brain",
    letter: "A",
    name: "The Big Brain Room",
    capacity: "Up to 15 persons",
    bestFor:
      "Idea pitch, masterclass sessions, staff meetings, presentations",
    facilities: [
      "Round table with comfortable chairs",
      "Air conditioning",
      "84-inch Interactive Board",
      "Whiteboard/markers (optional)",
      "Power points / charging facilities",
    ],
  },
  {
    id: "grind-garage",
    letter: "B",
    name: "The Grind Garage",
    capacity: "Up to 9 persons",
    bestFor: "Dedicated workspace, small team office setup",
    facilities: [
      "Office-style desks and chairs",
      "Air conditioning",
      "Common working environment",
      "Ideal for daily/weekly startup work",
    ],
  },
  {
    id: "fusion-lab",
    letter: "C",
    name: "The Fusion Lab",
    capacity: "4 persons",
    bestFor:
      "Brainstorming, information discussion, mentoring, small discussions, quick meetings",
    facilities: [
      "Round table (4 persons)",
      "2 bean bag seating",
      "Whiteboard + markers for brainstorming",
      "Coffee table",
      "Hot & cold drinking water / coffee setup (as available)",
    ],
  },
];

export default function CoWorkingSpaceView() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveContainer className="py-10 md:py-16 space-y-12">
        {/* Hero Section */}
        <div className="space-y-6">
          <HeaderSubtitle
            title="Co-Working Space / Incubation Center"
            subtitle="Biratnagar Incubation Center (BIC) – Co-Working & Room Booking"
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600 max-w-2xl">
              Biratnagar Incubation Center (BIC) is a co-working and
              collaboration space at the CIM Secretariat, Biratnagar-02,
              Morang—built to support startups from idea to creation.
            </p>
            <Button
              size="lg"
              className="bg-blue-800 hover:bg-blue-900 text-white shrink-0 px-8"
              asChild
            >
              <Link href="/co-working-space/booking">Book Now</Link>
            </Button>
          </div>
        </div>

        {/* Main About Section */}
        <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-xl md:text-2xl font-semibold text-blue-800">
              About Biratnagar Incubation Center
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Book meeting rooms, workspace, and collaboration corners for
              pitching, mentoring, training, team work, and even corporate
              meetings.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Since 2020, CIM has been running a Startup & Innovation Program
              and has successfully completed 6 cohorts. In collaboration with
              the Ministry of Industry, Commerce & Supplies and Biratnagar
              Metropolitan City, CIM has established the Biratnagar Incubation
              Center to provide:
            </p>
            <ul className="space-y-2 text-gray-700">
              {[
                "Affordable and accessible work/meeting space",
                "Mentorship and a learning environment",
                "Investment and network linkage opportunities",
                "Secretarial services: photocopy, printing, high-speed internet",
                "A professional platform for startups and businesses to collaborate",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-800 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pricing / Eligibility Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Free for Startups & Early-Stage Ideators
                  </h3>
                  <p className="text-sm text-gray-600">
                    As per CIM program criteria
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Check className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Available for Corporates & Organizations
                  </h3>
                  <p className="text-sm text-gray-600">
                    For meetings & workspace (service rules apply)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Explore Our Rooms Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800">
              Explore Our Rooms
            </h2>
            <p className="text-gray-600 mt-1">
              Choose the perfect space for your needs
            </p>
          </div>

          <div className="grid gap-6 md:gap-8">
            {ROOMS.map((room) => (
              <Card
                key={room.id}
                className="border border-gray-200 shadow-sm bg-white overflow-hidden"
              >
                <CardHeader className="border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-blue-800 text-blue-800 flex items-center justify-center font-bold text-lg">
                        {room.letter}
                      </div>
                      <div>
                        <CardTitle className="text-xl md:text-2xl font-semibold text-blue-800">
                          {room.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {room.capacity}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-800 text-blue-800 hover:bg-blue-50 shrink-0"
                      asChild
                    >
                      <Link
                        href={`/co-working-space/booking?room=${room.id}`}
                      >
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Best for:
                      </h4>
                      <p className="text-gray-700">{room.bestFor}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Facilities:
                      </h4>
                      <ul className="space-y-1.5">
                        {room.facilities.map((facility, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-gray-700"
                          >
                            <span className="text-blue-800 mt-0.5">•</span>
                            <span>{facility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center justify-center py-8 px-6 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200">
          <p className="text-gray-700 text-center mb-6 max-w-xl">
            Ready to book your workspace or meeting room? Get in touch or book
            directly.
          </p>
          <Button
            size="lg"
            className="bg-blue-800 hover:bg-blue-900 text-white px-8"
            asChild
          >
            <Link href="/co-working-space/booking">Book Now</Link>
          </Button>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
