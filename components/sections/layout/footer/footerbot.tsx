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
    <footer className="bg-[#164394] pt-12">
      <ResponsiveContainer className="py-10">
        {/* Main Container */}
        <div className="">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 text-gray-200">
            {/* Left Section - Logo and Description */}
            <div className="flex-1 space-y-4">
              <Image
                src="/b2blogo-footer.png"
                alt="B2B Birat Bazaar Logo"
                width={200}
                height={150}
              />
              <p className="leading-relaxed text-gray-300 mt-5">
                Connecting businesses, fostering growth, and promoting
                innovation across Nepal.
              </p>
            </div>

            {/* Middle Section - Quick Links */}
            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    B2B Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wishOffer"
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    Wish & Offer
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contacts"
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/howtoapply"
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    How to Apply
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Section - Contact Us */}
            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Sahid Marga Biratnagar - 2</li>
                <li>Koshi Province, Nepal</li>
                <li>
                  Phone:{" "}
                  <Link
                    href="tel:021515712"
                    className="text-sky-200 hover:text-white hover:underline transition-colors"
                  >
                    021-515712
                  </Link>
                  ,{" "}
                  <Link
                    href="tel:021574426"
                    className="text-sky-200 hover:text-white hover:underline transition-colors"
                  >
                    021-574426
                  </Link>
                </li>
                <li>
                  Phone:{" "}
                  <Link
                    href="tel:021577646"
                    className="text-sky-200 hover:text-white hover:underline transition-colors"
                  >
                    021-577646
                  </Link>
                  ,{" "}
                  <Link
                    href="tel:021511449"
                    className="text-sky-200 hover:text-white hover:underline transition-colors"
                  >
                    021-511449
                  </Link>
                </li>
                <li>
                  Email:{" "}
                  <Link
                    href="mailto:cim.biratnagar@gmail.com"
                    className="text-sky-200 hover:text-white hover:underline transition-colors"
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
                    className="text-sky-200 hover:text-white hover:underline transition-colors"
                  >
                    www.cim.org.np
                  </Link>
                </li>
              </ul>
            </div>

            {/* Supported By */}
            <div className="flex-1 space-y-4">
              <h4 className="text-lg font-semibold text-white">Initiated by</h4>
              <div className="flex">
                <img
                  src="/logo.png"
                  alt="Support Logo"
                  className="h-24 w-auto"
                />
              </div>
              <h4 className="text-lg font-semibold text-white">
                Technology Partner
              </h4>
              <Link href="https://baliyotech.com" target="_blank">
                <div className=" bg-black w-32">
                  <img
                    src="/baliyotech.svg"
                    alt="Support Logo"
                    className="h-16 w-auto "
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t border-white/20 pt-4 container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Left - Copyright */}
          <p className="text-gray-300 text-sm">
            © 2025 B2B Birat Bazaar. All rights reserved.
          </p>

          {/* Right - Social Icons */}
          <div className="flex space-x-6">
            <Link
              href="https://www.facebook.com/ChamberOfIndustriesMorang"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon size={24} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/chamber-of-industries-morang-cim-24378b378/"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={24} />
            </Link>
            <Link
              href="https://x.com/CIM_Biratnagar"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <TwitterIcon size={24} />
            </Link>
            <Link
              href="https://www.instagram.com/chamberofindustriesmorang"
              className="text-gray-300 hover:text-white transition-colors"
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
