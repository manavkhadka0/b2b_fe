"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useOffers } from "../utils/wishOffer";
import { useWishes } from "../utils/wishOffer";
import { Loader2 } from "lucide-react";

export default function WishesOffers() {
  const { wishes, isLoading: wishLoading, error: wishError } = useWishes();
  const { offers, isLoading: offerLoading, error: offerError } = useOffers();
  const [selectedWish, setSelectedWish] = useState<number | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [showMatchedText, setShowMatchedText] = useState(false);

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

  const handleMatch = async () => {
    if (selectedWish !== null && selectedOffer !== null) {
      setIsMatching(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wish_and_offers/matches/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              wish_id: selectedWish,
              offer_id: selectedOffer,
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to create match");

        // SWR will automatically revalidate the data
        // Show success animation
        setTimeout(() => {
          setShowMatchedText(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }, 1000);
      } catch (error) {
        console.error("Error creating match:", error);
      }
    }
  };

  const resetState = () => {
    setIsMatching(false);
    setShowMatchedText(false);
    setSelectedWish(null);
    setSelectedOffer(null);
  };

  if (wishLoading || offerLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Wishes Section */}
          <div className="space-y-8">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 transform skew-x-12 rounded-lg shadow-xl"></div>
              <h2 className="relative px-8 py-4 text-4xl font-bold text-black">
                Wishes
              </h2>
            </motion.div>

            <div className="space-y-6">
              {wishes.map((wish) => (
                <motion.div
                  key={`wish-${wish.id}`}
                  layout
                  whileHover={{ scale: 1.02 }}
                  animate={
                    isMatching && selectedWish === wish.id
                      ? {
                          scale: 5,
                          zIndex: 10,
                          transition: { duration: 0.5 },
                        }
                      : {}
                  }
                  className="relative cursor-pointer"
                  onClick={() => !isMatching && setSelectedWish(wish.id)}
                >
                  <div
                    className={`relative h-16 transform -skew-x-12
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
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700">
                        <div className="relative h-full flex items-center justify-between px-6 text-white">
                          <div className="transform skew-x-12">
                            <h3 className="font-bold truncate">{wish.title}</h3>
                            <p className="text-xs text-white/70">
                              {wish.product?.category?.name ||
                                wish.service?.name ||
                                "No category"}
                            </p>
                          </div>
                          {wish.match_percentage && (
                            <div className="transform skew-x-12 bg-white/10 px-2 py-1 rounded">
                              <span className="text-sm font-semibold">
                                {wish.match_percentage}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {wish.matches?.length > 0 && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                      {wish.matches.length}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Offers Section */}
          <div className="space-y-8">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 transform -skew-x-12 rounded-lg shadow-xl"></div>
              <h2 className="relative px-8 py-4 text-4xl font-bold text-black text-right">
                Offers
              </h2>
            </motion.div>

            <div className="space-y-6">
              {offers.map((offer) => (
                <motion.div
                  key={`offer-${offer.id}`}
                  layout
                  whileHover={{ scale: 1.02 }}
                  animate={
                    isMatching && selectedOffer === offer.id
                      ? {
                          scale: 5,
                          zIndex: 10,
                          transition: { duration: 0.5 },
                        }
                      : {}
                  }
                  className="relative cursor-pointer"
                  onClick={() => !isMatching && setSelectedOffer(offer.id)}
                >
                  <div
                    className={`relative h-16 transform skew-x-12
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
                            <h3 className="font-bold truncate">
                              {offer.title}
                            </h3>
                            <p className="text-xs text-white/70">
                              {offer.product?.name ||
                                offer.service?.name ||
                                "No category"}
                            </p>
                          </div>
                          {offer.match_percentage && (
                            <div className="transform -skew-x-12 bg-white/10 px-2 py-1 rounded">
                              <span className="text-sm font-semibold">
                                {offer.match_percentage}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {offer.matches?.length > 0 && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                      {offer.matches.length}
                    </div>
                  )}
                </motion.div>
              ))}
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
          {showMatchedText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
              onClick={resetState}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-lg p-8 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
                  Matched!
                </h3>
                <p className="text-gray-600">
                  Your wish and offer have been successfully matched!
                </p>
                <button
                  onClick={resetState}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-400 text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  Continue Matching
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
