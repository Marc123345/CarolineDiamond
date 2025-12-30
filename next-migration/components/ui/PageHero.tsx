import React from "react";
import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  backgroundImage = "https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/Proposal%20image.jpg?updatedAt=1757413963196"
}) => {
  return (
    <section className="relative h-[70vh] sm:h-[80vh] lg:h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      
      {/* Additional overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 pt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="uppercase text-Color-Netural-White tracking-wider mb-6 text-sm sm:text-base lg:text-lg font-medium"
          style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
        >
          {subtitle}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-light"
          style={{ textShadow: '3px 3px 12px rgba(0,0,0,0.9)' }}
        >
          {title}
        </motion.h1>
        
        {/* Enhanced decorative elements for balance */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 flex items-center justify-center"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-2 h-2 bg-Color-Light-300 rounded-full mx-2"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="w-3 h-3 bg-Color-Light-300 rounded-full mx-3"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.6, 1],
              opacity: [1, 0.6, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="w-4 h-4 bg-Color-Light-300 rounded-full mx-2"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            className="w-3 h-3 bg-Color-Light-300 rounded-full mx-3"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            className="w-2 h-2 bg-Color-Light-300 rounded-full mx-2"
          />
        </motion.div>
      </div>
    </section>
  );
}