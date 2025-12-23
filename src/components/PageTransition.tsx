import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const isMobile = useIsMobile();
  const isUnmountingRef = useRef(false);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Disable animations on mobile or if user prefers reduced motion
  const shouldAnimate = !isMobile && !prefersReducedMotion;

  // Scroll to top on route change
  useEffect(() => {
    isUnmountingRef.current = false;
    window.scrollTo(0, 0);

    return () => {
      isUnmountingRef.current = true;
    };
  }, []);

  const pageTransition = {
    duration: shouldAnimate ? 0.3 : 0,
    ease: "easeInOut"
  };

  const pageVariants = {
    initial: {
      opacity: shouldAnimate ? 0 : 1,
      y: shouldAnimate ? 15 : 0,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: pageTransition
    },
    exit: {
      opacity: shouldAnimate ? 0 : 1,
      y: 0, // Don't move on exit to prevent DOM conflicts
      transition: { ...pageTransition, duration: shouldAnimate ? 0.15 : 0 }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={`w-full ${className}`}
      style={{
        willChange: shouldAnimate ? 'opacity' : 'auto',
      }}
      onAnimationComplete={() => {
        // Cleanup after animation
        if (isUnmountingRef.current) {
          isUnmountingRef.current = false;
        }
      }}
    >
      {children}
    </motion.div>
  );
};