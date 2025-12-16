import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnatomyMenuProps {
  onSelect: (page: string) => void;
}

const hotspots = [
  {
    id: "ear",
    title: "Earrings",
    page: "/shop?category=Earrings",
    cx: 62, // percent values for responsiveness
    cy: 25,
    description: "Elegant studs & drops",
  },
  {
    id: "neck",
    title: "Necklaces",
    page: "/shop?category=Necklaces",
    cx: 57,
    cy: 45,
    description: "Pendants & chains",
  },
  {
    id: "wrist",
    title: "Bracelets",
    page: "/shop?category=Bracelets",
    cx: 50,
    cy: 65,
    description: "Tennis & charm styles",
  },
  {
    id: "hand",
    title: "Rings",
    page: "/shop?category=Rings",
    cx: 65,
    cy: 80,
    description: "Engagement & everyday",
  },
];

export const AnatomyMenu: React.FC<AnatomyMenuProps> = ({ onSelect }) => {
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null);

  return (
    <div className="relative flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto">
      {/* Luxury Silhouette */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 350"
        className="w-80 h-96 relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CDBCAB" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#B9A892" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#CDBCAB" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#CDBCAB" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Elegant Human Silhouette */}
        <motion.path
          d="M150 25c-20 0-35 15-35 35s15 35 35 35 35-15 35-35-15-35-35-35z
             M150 105c-45 0-80 35-80 80v20c0 10 5 15 10 15h20v80c0 15 10 25 25 25h50c15 0 25-10 25-25v-80h20c5 0 10-5 10-15v-20c0-45-35-80-80-80z
             M120 200l-15 40c-2 5 0 10 5 12l25 10c5 2 10-1 12-6l8-20
             M180 200l15 40c2 5 0 10-5 12l-25 10c-5 2-10-1-12-6l-8-20"
          fill="url(#goldGradient)"
          stroke="#CDBCAB"
          strokeWidth="1"
          className="drop-shadow-lg"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Animated Shimmer Effect */}
        <motion.rect
          x="0"
          y="0"
          width="300"
          height="350"
          fill="url(#shimmer)"
          pointerEvents="none"
          style={{ mixBlendMode: "screen" }}
          initial={{ x: -300 }}
          animate={{ x: 300 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 2,
          }}
        />
      </motion.svg>

      {/* Interactive Hotspots */}
      {hotspots.map((spot, index) => (
        <motion.div
          key={spot.id}
          className="absolute"
          style={{
            left: `${spot.cx}%`,
            top: `${spot.cy}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.8 + index * 0.2,
            type: "spring",
            stiffness: 200,
          }}
        >
          {/* Hotspot Button */}
          <motion.button
            onClick={() => onSelect(spot.page)}
            onMouseEnter={() => setHoveredSpot(spot.id)}
            onMouseLeave={() => setHoveredSpot(null)}
            whileHover={{ scale: 1.4 }}
            whileTap={{ scale: 0.9 }}
            className="relative group"
          >
            {/* Pulsing Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#CDBCAB]"
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.8, 0.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Main Hotspot */}
            <motion.div
              className="w-6 h-6 rounded-full bg-gradient-to-br from-[#CDBCAB] to-[#B9A892] shadow-lg border-2 border-white/80"
              whileHover={{
                backgroundColor: "#CDBCAB",
                boxShadow: "0 0 25px #CDBCAB, 0 0 50px rgba(205,188,171,0.5)",
                scale: 1.2,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Sparkle Particles on Hover */}
            <AnimatePresence>
              {hoveredSpot === spot.id && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-[#CDBCAB] rounded-full will-change-transform will-change-opacity"
                      style={{
                        left: `${12 + Math.cos((i * Math.PI * 2) / 6) * 20}px`,
                        top: `${12 + Math.sin((i * Math.PI * 2) / 6) * 20}px`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Hover Label */}
          <AnimatePresence>
            {hoveredSpot === spot.id && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 z-50"
              >
                <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-[#CDBCAB]/30 text-center min-w-max">
                  <h4 className="text-sm font-bold text-Color-Netural-Black mb-1">
                    {spot.title}
                  </h4>
                  <p className="text-xs text-Color-Netural-Black">{spot.description}</p>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white/95"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Floating Sparkles Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#CDBCAB]/40 rounded-full will-change-transform will-change-opacity"
            style={{
              left: `${20 + i * 10}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-Color-Netural-Black font-medium flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-[#CDBCAB] mr-2" />
          Hover over the silhouette to explore jewelry
        </p>
      </motion.div>
    </div>
  );
};
