import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import gemImg from "@assets/3345EC46-BE04-4B21-A068-11C3A852D2BA_1767620810005.png";

interface MinesGridProps {
  predictedSpots: number[]; // Array of indices (0-24)
  isAnimating: boolean;
}

export function MinesGrid({ predictedSpots, isAnimating }: MinesGridProps) {
  // Create a 5x5 grid (25 cells)
  const cells = Array.from({ length: 25 }, (_, i) => i);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/reveal.mp3");
  }, []);

  const playRevealSound = (index: number) => {
    if (audioRef.current) {
      const delay = predictedSpots.indexOf(index) * 250;
      setTimeout(() => {
        const sound = audioRef.current?.cloneNode() as HTMLAudioElement;
        if (sound) {
          sound.volume = 0.5;
          sound.play().catch(() => {});
        }
      }, delay);
    }
  };

  useEffect(() => {
    if (!isAnimating && predictedSpots.length > 0) {
      predictedSpots.forEach((index) => {
        playRevealSound(index);
      });
    }
  }, [predictedSpots, isAnimating]);

  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-2.5 p-2 sm:p-2.5 bg-[#1a2c38] rounded-md w-full max-w-[400px] aspect-square mx-auto">
      {cells.map((index) => {
        const isPredicted = predictedSpots.includes(index);

        return (
          <div
            key={index}
            className={`
              relative rounded-md overflow-hidden
              bg-[#2f4553] shadow-inner
              hover:bg-[#395261] transition-colors duration-200
              flex items-center justify-center
            `}
          >
            <AnimatePresence>
              {isPredicted && !isAnimating && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotateY: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: predictedSpots.indexOf(index) * 0.25
                  }}
                  className="absolute inset-0 flex items-center justify-center p-1.5"
                >
                  <img 
                    src={gemImg} 
                    alt="Gem" 
                    className="w-[85%] h-[85%] object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
