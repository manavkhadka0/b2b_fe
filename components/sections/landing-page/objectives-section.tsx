import { ResponsiveContainer } from "../common/responsive-container";
import { HeaderSubtitle } from "../common/header-subtitle";

const objectives = [
  {
    title: "Enhance Networking Opportunities",
    description:
      "Create a structured digital space where entrepreneurs, industrialists, and investors can discover each other and build meaningful connections.",
  },
  {
    title: "Promote Collaboration",
    description:
      "Match business offers with corresponding needs to encourage partnerships, joint ventures, and impactful business deals.",
  },
  {
    title: "Support Local Industries",
    description:
      "Provide visibility to district-specific strengths and capabilities, helping local businesses expand their reach across and beyond Koshi Province.",
  },
  {
    title: "Showcase Investment Potential",
    description:
      "Highlight regional investment-ready opportunities to attract capital, technology, and expertise into high-potential sectors.",
  },
  {
    title: "Inclusive Growth",
    description:
      "Ensure startups, women-led enterprises, and small businesses have equal access to networking, visibility, and collaboration opportunities.",
  },
];

export default function ObjectivesSection() {
  return (
    <div className="bg-gradient-to-br from-blue-50/60 via-white to-purple-50/60">
      <ResponsiveContainer className="py-10 md:py-14">
        <HeaderSubtitle
          title="Platform Objectives"
          subtitle="A focused digital ecosystem designed to enable meaningful B2B connections and inclusive growth"
        />

        <div className="mt-10 md:mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {objectives.map((item) => (
            <div
              key={item.title}
              className="h-full rounded-xl bg-white/90 border border-blue-50 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-7 flex flex-col"
            >
              <div className="mb-4 flex items-center gap-3">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-snug">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </div>
  );
}
