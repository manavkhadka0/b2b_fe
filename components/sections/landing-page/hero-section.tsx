"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ResponsiveContainer } from "../common/responsive-container";

export default function HeroSection() {
  return (
    <main className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 min-h-[calc(100vh-100px)] overflow-hidden flex items-center w-full px-4 md:px-6 py-10 md:py-16">
      {/* Improved background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-gray-100/20 to-transparent rounded-full blur-3xl" />
      </div>

      <ResponsiveContainer>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-14">
          {/* Left Content */}
          <motion.div
            className="max-w-2xl mx-auto md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className=" px-5 py-6 ">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-semibold md:font-bold text-gray-900 leading-snug md:leading-tight mb-4 md:mb-6 tracking-tight">
                  Join us at Birat Bazaar{" "}
                  <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                    B2B Networking Platform
                  </span>
                </h1>

                <p className="text-gray-700 text-base md:text-lg mb-7 md:mb-8 leading-relaxed md:leading-relaxed">
                  The Birat Bazaar B2B Networking Platform is a flagship digital
                  service of the Chamber of Industries Morang (CIM). It
                  institutionalizes business-to-business (B2B) connections
                  across Koshi Province and beyond, creating a permanent,
                  digital-first hub where businesses of all sizes — from
                  startups and women-led enterprises to MSMEs, farmers, and
                  service providers — can connect, collaborate, and grow.
                </p>

                {/* Improved CTA section */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center md:justify-start">
                  <Link href="/events" className="w-full sm:w-auto">
                    <motion.button
                      className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-200/60 transition-all duration-300"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 20px 30px -10px rgb(59 130 246 / 0.35)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Explore Events
                    </motion.button>
                  </Link>
                  <Link href="/contacts" className="w-full sm:w-auto">
                    <motion.button
                      className="w-full sm:w-auto px-7 py-3.5 bg-white text-blue-700 font-semibold rounded-full shadow-md hover:shadow-lg border border-blue-100/80 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Register Now
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Visual with improved animation */}
          <motion.div
            className="hidden md:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full max-w-[600px]">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-transparent rounded-3xl"
                animate={{
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, 0],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <img
                src="/amico.svg"
                alt="Birat Expo Graphic"
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </ResponsiveContainer>
    </main>
  );
}
