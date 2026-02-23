"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ResponsiveContainer } from "../common/responsive-container";
import { ChevronRight } from "lucide-react";

export default function CoWorkingHeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-slate-50">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Soft gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-indigo-100/30 blur-3xl" />

      <ResponsiveContainer className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr,420px] xl:grid-cols-[1fr,480px] gap-8 sm:gap-12 items-center">
          <div className="max-w-2xl min-w-0">
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white border border-slate-200/80 shadow-sm mb-4 sm:mb-6"
            >
              <span className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                Co-Working & Room Booking
              </span>
            </motion.div>

            <motion.h1
              className="text-2xl font-bold text-slate-900 tracking-tight leading-[1.15] mb-4 sm:text-4xl sm:mb-6 md:text-5xl lg:text-6xl"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Co-Working Space{" "}
              <span className="text-blue-600">Incubation Center</span>
            </motion.h1>

            <motion.p
              className="text-sm text-slate-600 leading-relaxed mb-6 max-w-2xl sm:text-base md:text-lg lg:text-xl sm:mb-8 md:mb-10"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Biratnagar Incubation Center (BIC) is a co-working and
              collaboration space at the CIM Secretariat, Biratnagar-02,
              Morang—built to support startups from idea to creation.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href="/co-working-space/booking" className="min-w-0">
                <button
                  type="button"
                  className="inline-flex items-center justify-start gap-2 sm:gap-2.5 w-fit min-h-[48px] px-4 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 bg-white text-slate-700 text-sm sm:text-base font-semibold rounded-lg border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors leading-tight text-center overflow-hidden min-w-0"
                >
                  <span className="truncate min-w-0">Book Now</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div
            className="hidden lg:block order-2"
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/coworking.png"
              alt="Biratnagar Incubation Center - Co-Working Space"
              className="w-full h-[350px] rounded-xl shadow-lg"
            />
          </motion.div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
