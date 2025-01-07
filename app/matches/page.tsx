"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useOffers } from "../utils/wishOffer";
import { useWishes } from "../utils/wishOffer";
import { Loader2 } from "lucide-react";
import { Offer } from "@/types/wish";

export default function WishesOffers() {
  const { wishes, isLoading: wishLoading, mutate: mutateWishes } = useWishes();
  const { offers, isLoading: offerLoading, mutate: mutateOffers } = useOffers();
  const [selectedWish, setSelectedWish] = useState<number | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [showMatchedText, setShowMatchedText] = useState(false);
  const [dummyWishes, setDummyWishes] = useState(wishes);
  const [dummyOffers, setDummyOffers] = useState(offers);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMatching) {
      timer = setTimeout(() => {
        setShowMatchedText(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isMatching]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (wishes.length > 0) {
        // Clone and modify a random wish from existing wishes
        const randomWish = {
          ...wishes[Math.floor(Math.random() * wishes.length)],
        };
        randomWish.id = Math.random();
        randomWish.title = `New Wish ${Math.floor(Math.random() * 100)}`;
        setDummyWishes((prev) => [randomWish, ...prev]);
      }

      if (offers.length > 0) {
        // Clone and modify a random offer from existing offers
        const randomOffer = {
          ...offers[Math.floor(Math.random() * offers.length)],
        };
        randomOffer.id = Math.random();
        randomOffer.title = `New Offer ${Math.floor(Math.random() * 100)}`;
        setDummyOffers((prev) => [randomOffer, ...prev]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [wishes, offers]);

  const handleMatch = () => {
    if (selectedWish !== null && selectedOffer !== null) {
      setIsMatching(true);

      // Reset state after animation
      setTimeout(() => {
        setIsMatching(false);
        setSelectedWish(null);
        setSelectedOffer(null);
        setAnimationComplete(false);
      }, 2500); // Increased timeout to allow for heart animation

      // Show confetti after cards come together
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
        });
      }, 1000);
    }
  };

  if (wishLoading || offerLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Wishes Section */}
          <div className="space-y-8">
            <motion.div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#004dad] to-[#004bad] transform skew-x-12 rounded-lg shadow-xl"></div>
              <h2 className="relative px-8 py-6 text-6xl font-bold text-white">
                Wishes
              </h2>
            </motion.div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {dummyWishes.map((wish) => (
                  <motion.div
                    key={`wish-${wish.id}`}
                    initial={{ x: -100, opacity: 0 }}
                    animate={
                      isMatching && selectedWish === wish.id
                        ? {
                            x: window.innerWidth / 2 - 150,
                            y: window.innerHeight / 2 - 100,
                            rotate: -180,
                            scale: 0.5,
                            opacity: 0,
                            transition: {
                              duration: 1,
                              ease: "easeInOut",
                            },
                          }
                        : { x: 0, opacity: 1, filter: "blur(0px)", rotate: 0 }
                    }
                    exit={{ x: -100, opacity: 0 }}
                    layout
                    whileHover={{ scale: 1.02 }}
                    className="relative cursor-pointer"
                    onClick={() => !isMatching && setSelectedWish(wish.id)}
                  >
                    <div
                      className={`relative h-32 transform -skew-x-12
                      ${
                        selectedWish === wish.id
                          ? "ring-4 ring-yellow-400 ring-offset-4 ring-offset-black"
                          : ""
                      }
                      ${
                        wish.matches?.length > 0
                          ? "border-4 border-green-500"
                          : ""
                      }
                    `}
                    >
                      <div className="absolute inset-0 bg-white transform translate-x-2 translate-y-2"></div>
                      <div className="absolute inset-0 bg-blue-800 border-2 border-white/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500">
                          <div className="relative h-full flex items-center justify-between px-6 text-white">
                            <div className="transform skew-x-12">
                              <h3 className="font-bold truncate text-4xl">
                                {wish.title}
                              </h3>
                              <p className="text-2xl text-white/70">
                                {wish.product?.category?.name ||
                                  wish.service?.name ||
                                  "No category"}
                              </p>
                            </div>
                            {wish.match_percentage && (
                              <div className="transform skew-x-12 bg-white/10 px-2 py-1 rounded">
                                <span className="text-2xl font-semibold">
                                  {wish.match_percentage}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Offers Section */}
          <div className="space-y-8">
            <motion.div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#004bad] to-[#004dad] transform -skew-x-12 rounded-lg shadow-xl"></div>
              <h2 className="relative px-8 py-6 text-6xl font-bold text-white text-right">
                Offers
              </h2>
            </motion.div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {dummyOffers.map((offer) => (
                  <motion.div
                    key={`offer-${offer.id}`}
                    initial={{ x: 100, opacity: 0 }}
                    animate={
                      isMatching && selectedOffer === offer.id
                        ? {
                            x: window.innerWidth / 2 - 250,
                            y: window.innerHeight / 2 - 100,
                            rotate: 180,
                            scale: 0.5,
                            opacity: 0,
                            transition: {
                              duration: 1,
                              ease: "easeInOut",
                            },
                          }
                        : { x: 0, opacity: 1, filter: "blur(0px)", rotate: 0 }
                    }
                    exit={{ x: 100, opacity: 0 }}
                    layout
                    whileHover={{ scale: 1.02 }}
                    className="relative cursor-pointer"
                    onClick={() => !isMatching && setSelectedOffer(offer.id)}
                  >
                    <div
                      className={`relative h-32 transform skew-x-12
                      ${
                        selectedOffer === offer.id
                          ? "ring-4 ring-yellow-400 ring-offset-4 ring-offset-black"
                          : ""
                      }
                      ${
                        offer.matches?.length > 0
                          ? "border-4 border-green-500"
                          : ""
                      }
                    `}
                    >
                      <div className="absolute inset-0 bg-white transform translate-x-2 translate-y-2"></div>
                      <div className="absolute inset-0 bg-teal-500 border-2 border-white/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-400">
                          <div className="relative h-full flex items-center justify-between px-6 text-white">
                            <div className="transform -skew-x-12">
                              <h3 className="font-bold truncate text-4xl  ">
                                {offer.title}
                              </h3>
                              <p className="text-2xl text-white/70">
                                {offer.product?.name ||
                                  offer.service?.name ||
                                  "No category"}
                              </p>
                            </div>
                            {offer.match_percentage && (
                              <div className="transform -skew-x-12 bg-white/10 px-2 py-1 rounded">
                                <span className="text-2xl font-semibold">
                                  {offer.match_percentage}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Match Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMatch}
          disabled={
            selectedWish === null || selectedOffer === null || isMatching
          }
          className={`
            mt-12 mx-auto block px-8 py-3 text-xl font-bold rounded-full
            bg-gradient-to-r from-yellow-300 to-yellow-400 
            shadow-[0_0_20px_rgba(250,204,21,0.3)]
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              selectedWish !== null && selectedOffer !== null && !isMatching
                ? "animate-pulse"
                : ""
            }
          `}
        >
          Match
        </motion.button>

        {/* Matched Text Modal */}
        <AnimatePresence>
          {isMatching && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 1,
                  times: [0, 0.5, 1],
                  delay: 0.8,
                }}
                className="w-32 h-32 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 transform rotate-45">
                  <div className="w-full h-full rounded-[100%_100%_0_100%]" />
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
