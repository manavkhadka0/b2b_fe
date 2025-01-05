import { ResponsiveContainer } from "../common/responsive-container";
import { HeaderSubtitle } from "../common/header-subtitle";

export default function WishOfferDescription() {
  return (
    <ResponsiveContainer className="py-16">
      <HeaderSubtitle
        title="Business Collaboration Platform"
        subtitle="Connect, Collaborate, and Grow Together in the B2B Ecosystem"
      />

      <div className="mt-12 grid md:grid-cols-2 gap-8">
        {/* Wish Section */}
        <div className="space-y-6 p-8 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Business Wishes
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              Express your business needs and growth objectives through our
              structured wish system. Whether you're seeking:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Strategic partnerships for market expansion</li>
              <li>Technology integration solutions</li>
              <li>Supply chain optimization opportunities</li>
              <li>Industry-specific expertise and consulting</li>
              <li>Investment and funding opportunities</li>
            </ul>
            <p className="text-gray-600">
              Our intelligent matching system ensures your business requirements
              reach the right potential partners, accelerating your path to
              successful collaborations.
            </p>
          </div>
        </div>

        {/* Offer Section */}
        <div className="space-y-6 p-8 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Business Offers
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              Showcase your company's unique value propositions and capabilities
              to potential business partners. Highlight your:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Core products and services portfolio</li>
              <li>Technical expertise and innovations</li>
              <li>Industry experience and success stories</li>
              <li>Partnership models and frameworks</li>
              <li>Resources and capabilities</li>
            </ul>
            <p className="text-gray-600">
              Create detailed business offers that demonstrate your
              organization's strengths and attract quality partnerships aligned
              with your growth strategy.
            </p>
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
}
