import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const isMobile = useIsMobile();
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Disable animations on mobile or if user prefers reduced motion
  const shouldAnimate = !isMobile && !prefersReducedMotion;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageTransition = {
    duration: shouldAnimate ? 0.35 : 0,
    ease: "easeInOut"
  };

  const pageVariants = {
    initial: {
      opacity: shouldAnimate ? 0 : 1,
      y: shouldAnimate ? 20 : 0,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: pageTransition
    },
    exit: {
      opacity: shouldAnimate ? 0 : 1,
      y: shouldAnimate ? -10 : 0,
      transition: pageTransition
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
        willChange: shouldAnimate ? 'opacity, transform' : 'auto',
        transform: 'translateZ(0)'
      }}
    >
      {children}
    </motion.div>
  );
};