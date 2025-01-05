import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import Image from "next/image";
import { ResponsiveContainer } from "../../common/responsive-container";

const Footerbot = () => {
  return (
    <footer className="bg-[#F9FAFB] pt-12">
      <ResponsiveContainer className="py-10">
        {/* Main Container */}
        <div className="">
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
                Connecting businesses, fostering growth, and promoting
                innovation across Nepal.
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
              <h3 className="text-lg font-semibold text-[#1E40AF]">
                Contact Us
              </h3>
              <ul className="space-y-2 text-gray-500">
                <li>Sahid Marga Biratnagar - 2</li>
                <li>Province No. 1, Nepal</li>
                <li>
                  Phone:{" "}
                  <Link
                    href="tel:021515712"
                    className="text-blue-500 hover:underline"
                  >
                    021-515712
                  </Link>
                  ,{" "}
                  <Link
                    href="tel:021574426"
                    className="text-blue-500 hover:underline"
                  >
                    021-574426
                  </Link>
                </li>
                <li>
                  Phone:{" "}
                  <Link
                    href="tel:021577646"
                    className="text-blue-500 hover:underline"
                  >
                    021-577646
                  </Link>
                  ,{" "}
                  <Link
                    href="tel:021511449"
                    className="text-blue-500 hover:underline"
                  >
                    021-511449
                  </Link>
                </li>
                <li>
                  Email:{" "}
                  <Link
                    href="mailto:cim.biratnagar@gmail.com"
                    className="text-blue-500 hover:underline"
                  >
                    cim.biratnagar@gmail.com
                  </Link>
                </li>
                <li>
                  Website:{" "}
                  <Link
                    href="http://www.cim.org.np"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    www.cim.org.np
                  </Link>
                </li>
              </ul>
            </div>

            {/* Supported By */}
            <div className="flex-1 space-y-4 text-center">
              <h4 className="text-lg font-semibold text-[#1E40AF]">
                Supported by
              </h4>
              <div className="flex justify-center items-center">
                <img
                  src="/logo.png"
                  alt="Support Logo"
                  className="h-12 w-auto mx-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t border-gray-200 pt-4 container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Left - Copyright */}
          <p className="text-gray-500 text-sm">
            © 2025 B2B Birat Bazaar. All rights reserved.
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
      </ResponsiveContainer>
    </footer>
  );
};

export default Footerbot;
