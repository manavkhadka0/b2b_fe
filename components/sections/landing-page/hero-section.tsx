"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ResponsiveContainer } from "../common/responsive-container";

export default function HeroSection() {
  return (
    <main className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 min-h-[calc(100vh-100px)] overflow-hidden flex items-center w-full">
      {/* Improved background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-gray-100/40 to-transparent rounded-full blur-3xl"></div>
      </div>

      <ResponsiveContainer>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Left Content */}
          <motion.div
            className="text-center md:text-left max-w-2xl mx-auto md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Improved typography and spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-6">
                Coming Soon • 2025
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Join Us at{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                Birat Expo 2025
              </span>
            </h1>

            <p className="text-gray-600 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
              Discover endless opportunities to connect, collaborate, and grow.
              Share your{" "}
              <span className="text-blue-600 font-semibold">Wishes</span>,
              explore exciting{" "}
              <span className="text-blue-600 font-semibold">Offers</span>, and
              unlock new possibilities for your business journey.
            </p>

            {/* Improved CTA section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link href="/events">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-200/50 transition-all duration-300 w-full sm:w-auto"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 25px -5px rgb(59 130 246 / 0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore Events
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:shadow-lg border border-blue-100 transition-all duration-300 w-full sm:w-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Us
                </motion.button>
              </Link>
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
