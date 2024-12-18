import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import Image from "next/image";

const Footerbot = () => {
  return (
    <footer className="bg-[#F9FAFB] py-12">
      {/* Main Container */}
      <div className="container mx-auto px-6 lg:px-16 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 text-gray-700">
          {/* Left Section - Logo and Description */}
          <div className="flex-1 space-y-4">
            <Image
              src="/Link.svg"
              alt="B2B Birat Bazaar Logo"
              width={150}
              height={64}
            />
            <p className="leading-relaxed text-gray-500 mt-5">
              Connecting businesses, fostering growth, and promoting innovation
              across Nepal.
            </p>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold text-[#1E40AF]">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-blue-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-500">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-500">
                  Events
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Section - Contact Us */}
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold text-[#1E40AF]">Contact Us</h3>
            <ul className="space-y-2 text-gray-500">
              <li>123 Business Street</li>
              <li>Kathmandu, Nepal</li>
              <li>Phone: +977 1 234 5678</li>
              <li>
                Email:{" "}
                <Link
                  href="mailto:info@nepalbusinesshub.com"
                  className="text-blue-500 hover:underline"
                >
                  info@nepalbusinesshub.com
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported By */}
          <div className="flex-1 space-y-4">
            <h4 className="text-lg font-semibold text-[#1E40AF]">
              Supported by
            </h4>
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Support Logo 1"
                className="h-12 w-auto"
              />
              <img
                src="/enssure.jpg"
                alt="Support Logo 2"
                className="h-12 w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 border-t border-gray-200 pt-4 container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Left - Copyright */}
        <p className="text-gray-500 text-sm">
          © 2024 Nepal Business Hub. All rights reserved.
        </p>

        {/* Right - Social Icons */}
        <div className="flex space-x-6">
          <Link
            href="#"
            className="text-gray-700 hover:text-blue-500 transition"
            aria-label="Facebook"
          >
            <FacebookIcon size={24} />
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-blue-500 transition"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={24} />
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-blue-500 transition"
            aria-label="Twitter"
          >
            <TwitterIcon size={24} />
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-blue-500 transition"
            aria-label="Instagram"
          >
            <InstagramIcon size={24} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footerbot;
