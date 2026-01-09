"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOffers, useWishAndOffer } from "../utils/wishOffer";
import { useWishes } from "../utils/wishOffer";
import { Loader2 } from "lucide-react";
import WishSvg from "@/public/wishes.svg";
import OfferSvg from "@/public/offers.svg";
import Image from "next/image";
import useSound from "use-sound";

import { Offer, Wish } from "@/types/wish";

export default function WishesOffers() {
  const {
    wish_and_offers,
    isLoading: wishLoading,
    mutate: mutateWishes,
  } = useWishAndOffer();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isShowingMatch, setIsShowingMatch] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<{
    wish: Wish | null;
    offer: Offer | null;
  }>({ wish: null, offer: null });
  const [confetti, setConfetti] = useState<any>(null);
  const [Lottie, setLottie] = useState<any>(null);
  const [matchedAnimation, setMatchedAnimation] = useState<any>(null);
  const [playMatchSound] = useSound(
    "/positive-notification-digital-strum-fast-gamemaster-audio-1-1-00-03.mp3"
  );

  useEffect(() => {
    import("canvas-confetti").then((confettiModule) => {
      setConfetti(() => confettiModule.default);
    });
  }, []);

  useEffect(() => {
    if (wish_and_offers) {
      setWishes(wish_and_offers.wishes || []);
      setOffers(wish_and_offers.offers || []);
    }
  }, [wish_and_offers]);

  useEffect(() => {
    const interval = setInterval(() => {
      mutateWishes();
    }, 2000);

    return () => clearInterval(interval);
  }, [mutateWishes]);

  useEffect(() => {
    const checkForNewMatches = () => {
      const latestWish = wishes[0];
      const latestOffer = offers[0];

      const hasWishMatches = latestWish?.offers && latestWish.offers.length > 0;
      const hasOfferMatches =
        latestOffer?.wishes && latestOffer.wishes.length > 0;

      if (hasWishMatches || hasOfferMatches) {
        // Play sound when match is found
        playMatchSound();

        // If it's a matched wish, find its corresponding offer
        if (hasWishMatches && latestWish.offers) {
          const matchedOffer = latestWish.offers[0];
          setCurrentMatch({
            wish: latestWish,
            offer: matchedOffer,
          });
        }
        // If it's a matched offer, find its corresponding wish
        else if (hasOfferMatches && latestOffer.wishes) {
          const matchedWish = latestOffer.wishes[0];
          setCurrentMatch({
            wish: matchedWish,
            offer: latestOffer,
          });
        }

        setIsShowingMatch(true);

        // Only run confetti if it's loaded
        if (confetti) {
          // First burst from top
          setTimeout(() => {
            confetti({
              particleCount: 300,
              spread: 100,
              origin: { y: 0.6, x: 0.5 },
              colors: ["#5271FF", "#B852F4", "#8EA1FD", "#C0CCFF"],
            });
          }, 400);

          // Left side burst
          setTimeout(() => {
            confetti({
              particleCount: 100,
              angle: 60,
              spread: 55,
              origin: { x: 0, y: 0.5 },
              colors: ["#5271FF", "#B852F4"],
            });
          }, 600);

          // Right side burst
          setTimeout(() => {
            confetti({
              particleCount: 100,
              angle: 120,
              spread: 55,
              origin: { x: 1, y: 0.5 },
              colors: ["#8EA1FD", "#C0CCFF"],
            });
          }, 600);

          // Second burst from top
          setTimeout(() => {
            confetti({
              particleCount: 200,
              spread: 100,
              origin: { y: 0.5, x: 0.5 },
              colors: ["#5271FF", "#B852F4", "#8EA1FD", "#C0CCFF"],
              ticks: 200,
            });
          }, 800);

          // Final side bursts
          setTimeout(() => {
            // Left final burst
            confetti({
              particleCount: 80,
              angle: 120,
              spread: 45,
              origin: { x: 0, y: 0.5 },
              colors: ["#5271FF", "#B852F4"],
              ticks: 200,
            });
            // Right final burst
            confetti({
              particleCount: 80,
              angle: 60,
              spread: 45,
              origin: { x: 1, y: 0.5 },
              colors: ["#8EA1FD", "#C0CCFF"],
              ticks: 200,
            });
          }, 1000);
        }

        // Reset after animation
        setTimeout(() => {
          setIsShowingMatch(false);
          setCurrentMatch({ wish: null, offer: null });
        }, 3000);
      }
    };

    checkForNewMatches();
  }, [wishes, offers, confetti, playMatchSound]);

  useEffect(() => {
    // Import Lottie
    import("lottie-react").then((LottieModule) => {
      setLottie(() => LottieModule.default);
    });

    // Import animation data
    import("@/public/matched.json").then((animationData) => {
      setMatchedAnimation(() => animationData.default);
    });
  }, []);

  if (wishLoading) {
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
              <div className="relative w-[488px]">
                <Image
                  src={WishSvg}
                  alt="Wishes"
                  width={488}
                  height={163}
                  priority
                  className="w-auto h-auto"
                />
              </div>
            </motion.div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {wishes.map((wish) => (
                  <motion.div
                    key={`wish-${wish.id}`}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    layout
                    whileHover={{ scale: 1.02 }}
                    className="relative fixed-center"
                  >
                    <div
                      className={`relative h-24 rounded-full overflow-hidden p-1.5 
                        ${
                          currentMatch.wish?.id === wish.id &&
                          wishes.indexOf(wish) === 0 &&
                          isShowingMatch
                            ? "ring-4 ring-yellow-400 ring-offset-4 ring-offset-black"
                            : ""
                        }
                      `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#5271FF] to-[#C0CCFF] rounded-full">
                        <div className="relative h-full flex items-center">
                          {/* Content - Left */}
                          <div className="flex-1 pl-8 pr-28 truncate">
                            <h3 className="font-bold text-2xl text-white truncate">
                              {wish.title}
                            </h3>
                            <p className="text-lg text-white/80 truncate">
                              {wish.product?.category?.name ||
                                wish.service?.name ||
                                "No category"}
                            </p>
                          </div>
                          {/* Percentage Circle - Right */}
                          <div className="absolute right-0 h-full flex items-center">
                            <div className="w-[88px] h-[88px] rounded-full border-4 border-white bg-white/20 flex items-center justify-center mr-1">
                              <span className="text-3xl font-bold text-white">
                                {wish.match_percentage || "68"}%
                              </span>
                            </div>
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
            <motion.div className="relative flex justify-end">
              <div className="relative w-[488px]">
                <Image
                  src={OfferSvg}
                  alt="Offers"
                  width={488}
                  height={163}
                  priority
                  className="w-auto h-auto"
                />
              </div>
            </motion.div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {offers.map((offer) => (
                  <motion.div
                    key={`offer-${offer.id}`}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    layout
                    whileHover={{ scale: 1.02 }}
                    className="relative fixed-center"
                  >
                    <div
                      className={`relative h-24 rounded-full overflow-hidden p-1.5 
                        ${
                          currentMatch.offer?.id === offer.id &&
                          offers.indexOf(offer) === 0 &&
                          isShowingMatch
                            ? "ring-4 ring-yellow-400 ring-offset-4 ring-offset-black"
                            : ""
                        }
                      `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#B852F4] to-[#8EA1FD] rounded-full">
                        <div className="relative h-full flex items-center">
                          {/* Percentage Circle - Left */}
                          <div className="absolute left-0 h-full flex items-center">
                            <div className="w-[88px] h-[88px] rounded-full border-4 border-white bg-white/20 flex items-center justify-center ml-1">
                              <span className="text-3xl font-bold text-white">
                                {offer.match_percentage || "68"}%
                              </span>
                            </div>
                          </div>
                          {/* Content */}
                          <div className="flex-1 pl-24 pr-8 truncate">
                            <h3 className="font-bold text-2xl text-white truncate">
                              {offer.title}
                            </h3>
                            <p className="text-lg text-white/80 truncate">
                              {offer.product?.name ||
                                offer.service?.name ||
                                "No category"}
                            </p>
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

        {/* Matched Animation */}
        <AnimatePresence>
          {isShowingMatch && currentMatch.wish && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"
            >
              <div className="relative bg-white rounded-[32px] p-8 max-w-2xl w-full mx-4 shadow-2xl">
                {/* Wish Card - Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]">
                  <div className="bg-gradient-to-r from-[#5271FF] to-[#C0CCFF] rounded-full p-1">
                    <div className="relative h-20 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm">
                      <div className="relative h-full flex items-center">
                        <div className="absolute left-0 h-full flex items-center">
                          <div className="w-[72px] h-[72px] rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center ml-1">
                            <span className="text-2xl font-bold text-white">
                              {currentMatch.wish?.match_percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 pl-24 pr-6">
                          <h3 className="font-bold text-xl text-white">
                            {currentMatch.wish?.title}
                          </h3>
                          <p className="text-base text-white/80">Wish</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Text */}
                <div className="text-center mb-6 mt-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    New Match Found!
                  </h2>
                  <p className="text-gray-600 text-base">
                    Perfect match with {currentMatch.wish?.match_percentage}%
                    compatibility
                  </p>
                </div>

                {/* Lottie Animation - Middle */}
                <motion.div
                  className="w-[300px] h-[300px] mx-auto my-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 3.3 }}
                  exit={{ scale: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  {Lottie && matchedAnimation && (
                    <Lottie
                      animationData={matchedAnimation}
                      loop={false}
                      autoplay={true}
                      className="w-full h-full"
                    />
                  )}
                </motion.div>

                {/* Offer Card - Bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px]">
                  <div className="bg-gradient-to-r from-[#B852F4] to-[#8EA1FD] rounded-full p-1">
                    <div className="relative h-20 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm">
                      <div className="relative h-full flex items-center">
                        <div className="flex-1 pl-6 pr-24">
                          <h3 className="font-bold text-xl text-white">
                            {currentMatch.offer?.title}
                          </h3>
                          <p className="text-base text-white/80">Offer</p>
                        </div>
                        <div className="absolute right-0 h-full flex items-center">
                          <div className="w-[72px] h-[72px] rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center mr-1">
                            <span className="text-2xl font-bold text-white">
                              {currentMatch.offer?.match_percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
