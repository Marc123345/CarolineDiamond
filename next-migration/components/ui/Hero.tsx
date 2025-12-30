import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useTranslation } from '../context/TranslationContext';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [, setIsVideoLoaded] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const ref = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax transforms - disabled on mobile
  const videoY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "40%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["-20%", "-50%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 1], isMobile ? [0.65, 0.65, 0.65] : [0.65, 0.75, 0.85]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 1] : [1, 1.1]);

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-light-black-700"
    >
        {/* Background Video */}
        <motion.div
          style={{ y: videoY, scale }}
          className="absolute inset-0 w-full h-full"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            onLoadedData={() => setIsVideoLoaded(true)}
            style={{ filter: 'brightness(0.85) contrast(1.05)' }}
            aria-label="Background video showcasing jewelry"
          >
            <source src="https://ik.imagekit.io/qcvroy8xpd/envato_video_gen_Sep_11_2025_18_19_47.mp4?updatedAt=1760286358904" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>

        {/* Luxury gradient overlay - temple atmosphere */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80"
        />

        {/* Soft ambient glow for luxury feel */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30" />

        {/* Radial gradient spotlight effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />

        {/* Reduced floating heart particles for performance - hidden on mobile */}
        {!isMobile && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 text-Color-Champagne-Gold/30"
                style={{
                  left: `${25 + i * 15}%`,
                  top: `${35 + (i % 2) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 5 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              >
                ♥
              </motion.div>
            ))}
          </div>
        )}

        {/* Hero Content - Luxury focused */}
        <motion.div
          style={{ y: contentY }}
          className="relative z-20 luxury-container grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32"
        >
          {/* Left Column */}
          <div className="text-left space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
            {/* Luxury Tagline - Trust building */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-Color-Champagne-Gold italic font-serif tracking-widest mb-4 sm:mb-5 md:mb-6 lg:mb-8 desire-highlight"
              style={{ textShadow: "0 6px 20px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,0.9)", letterSpacing: '0.08em' }}
            >
              {t('Crafted with Love in Antwerp')}
            </motion.p>

            {/* Main Heading - Desire focus */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-Color-Netural-White leading-[1.15] sm:leading-[1.1] mb-6 sm:mb-7 md:mb-8 lg:mb-10"
              style={{ textShadow: "0 8px 30px rgba(0,0,0,1), 0 6px 20px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,0.9)", letterSpacing: '-0.02em', fontWeight: 300 }}
            >
              {t('Your Forever Begins Here')}
            </motion.h1>

            {/* Trust statement */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-Color-Netural-White/80 leading-relaxed mb-4 sm:mb-5 md:mb-6 max-w-xl"
              style={{ textShadow: "0 4px 12px rgba(0,0,0,0.9)", letterSpacing: '0.02em' }}
            >
              {t('Handcrafted engagement rings that tell your unique love story. Each diamond selected with care, each setting perfected with precision.')}
            </motion.p>

            {/* Enhanced CTA Button with Motion - Shop Now */}
            <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 justify-start">
              <motion.div
                onClick={() => onNavigate('/shop?category=rings')}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.5, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group cursor-pointer flex items-center"
              >
                {/* Animated Circle SVG */}
                <motion.div
                  className="relative mr-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    className="transform -rotate-90"
                  >
                    {/* Background circle */}
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="rgba(247,230,215,0.5)"
                      strokeWidth="2"
                      fill="none"
                    />

                    {/* Animated progress circle */}
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="#F7E6D7"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 2,
                        delay: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                        repeatDelay: 3
                      }}
                      style={{
                        strokeDasharray: "220",
                        strokeDashoffset: "220"
                      }}
                    />
                  </svg>

                  {/* Arrow in center */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    whileHover={{ scale: 1.2, rotate: 45 }}
                    transition={{ duration: 0.4 }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-Color-Primary-Beige"
                    >
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>

                  {/* Floating particles around circle */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-Color-Primary-Beige rounded-full"
                      style={{
                        left: `${40 + 45 * Math.cos((i * Math.PI * 2) / 6)}px`,
                        top: `${40 + 45 * Math.sin((i * Math.PI * 2) / 6)}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3 + 2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>

                {/* CTA Text */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.8 }}
                  className="flex flex-col"
                >
                  <motion.span
                    whileHover={{ x: 5, color: "#F7E6D7" }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl lg:text-3xl xl:text-4xl font-bold text-Color-Netural-White mb-2"
                    style={{ textShadow: "0 4px 12px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,0.9)" }}
                  >
                    {t('Explore Our Rings')}
                  </motion.span>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 2.2 }}
                    className="h-[2px] bg-Color-Primary-Beige"
                  />

                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 2.5 }}
                    className="text-xs lg:text-sm text-Color-Primary-Beige/80 mt-2 tracking-wider uppercase"
                    style={{ textShadow: "0 2px 6px rgba(0,0,0,0.8)", letterSpacing: '0.15em' }}
                  >
                    {t('Discover Your Perfect Ring')}
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Decorative Heart Accents */}
          <div className="relative hidden lg:block pl-12 xl:pl-16">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-12 right-12 w-40 h-40 text-Color-Primary-Beige/25 text-7xl flex items-center justify-center"
            >
              ♥
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, -3, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
              className="absolute bottom-16 left-16 w-32 h-32 text-Color-Primary-Beige/20 text-5xl flex items-center justify-center"
            >
              ♥
            </motion.div>
          </div>
        </motion.div>
      </section>
  );
};