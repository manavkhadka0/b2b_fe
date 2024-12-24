import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <main className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Floating Background Effects */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 bg-blue-300 rounded-full opacity-30 blur-lg"
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      ></motion.div>
      <motion.div
        className="absolute bottom-10 right-10 w-56 h-56 bg-blue-500 rounded-full opacity-20 blur-lg"
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity }}
      ></motion.div>
      <motion.div
        className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-blue-300 to-blue-700 rounded-full opacity-25"
        animate={{ rotate: [0, 45, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      ></motion.div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl relative z-10">
        {/* Left Content */}
        <motion.div
          className="text-center md:text-left max-w-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Accelerate Your <span className="text-blue-500">Business</span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-8 leading-relaxed">
            Transform your business with cutting-edge solutions. Unlock growth,
            drive efficiency, and achieve success effortlessly with our
            expertise.
          </p>
          <Link href={"/events/create-event"}>
            <motion.button
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Events
            </motion.button>
          </Link>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          className="mt-12 md:mt-0 flex justify-center items-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-80 h-80 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg flex items-center justify-center">
            <motion.div
              className="absolute w-24 h-24 bg-white rounded-full shadow-lg animate-pulse"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
            <motion.div
              className="absolute w-16 h-16 bg-blue-100 rounded-full shadow-md bottom-6 left-6"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            ></motion.div>
            <motion.div
              className="absolute w-12 h-12 bg-blue-50 rounded-full shadow-sm top-8 right-8"
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            ></motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
