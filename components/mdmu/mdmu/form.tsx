import Image from "next/image";
import { FileCheck, Shield, Clock, Award } from "lucide-react";
import Link from "next/link";

const formFeatures = [
  {
    icon: FileCheck,
    title: "Easy Application",
    description: "Simple and straightforward application process",
    color: "text-blue-600",
    gradient: "from-blue-50 to-blue-100",
  },
  {
    icon: Shield,
    title: "Secure Process",
    description: "Your information is safe and protected",
    color: "text-emerald-600",
    gradient: "from-emerald-50 to-emerald-100",
  },
  {
    icon: Clock,
    title: "Quick Processing",
    description: "Fast review and approval process",
    color: "text-purple-600",
    gradient: "from-purple-50 to-purple-100",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Maintaining high standards for logo usage",
    color: "text-amber-600",
    gradient: "from-amber-50 to-amber-100",
  },
];

export const Form = () => {
  return (
    <section
      id="apply"
      className="py-8 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-grid-gray-200/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 relative inline-block">
              Apply for the Logo
              <div className="relative mt-4">
                <img
                  src="/Rectangle.svg"
                  alt="decorative underline"
                  className="absolute left-1/2 -translate-x-1/2 transform scale-110 w-full h-8"
                />
              </div>
            </h2>
            <p className="mt-8 text-gray-600 text-lg max-w-2xl mx-auto">
              Join our initiative to promote domestic products and strengthen
              the local economy
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {formFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md 
                  transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                <h3 className="font-semibold text-xl mb-4 text-gray-800">
                  Why Apply?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <div className="mt-1">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-600 text-sm">
                      Get official recognition for your products
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-1">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-600 text-sm">
                      Build trust with your customers
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-1">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-600 text-sm">
                      Join a network of quality domestic producers
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium text-gray-800 mb-2">Need Help?</h4>
                <p className="text-gray-600 text-sm">
                  Contact our support team for assistance with your application
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 
                        text-sm mt-3 transition-colors"
                >
                  Get Support →
                </Link>
              </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 mb-8">
                  Apply now to join our network of quality domestic producers
                </p>
                <Link
                  href="/apply"
                  className="inline-flex items-center justify-center px-8 py-4 
                  bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                  transition-all duration-300 transform hover:translate-y-[-2px]"
                >
                  Start Application
                  <FileCheck className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
