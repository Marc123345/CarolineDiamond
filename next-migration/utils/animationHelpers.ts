import { Variants } from 'framer-motion';

/**
 * Returns animation variants or no-op variants based on whether device is mobile
 */
export function getAnimationVariants(
  variants: Variants,
  isMobile: boolean
): Variants {
  if (isMobile) {
    // Return variants with no animation for mobile
    return Object.keys(variants).reduce((acc, key) => {
      acc[key] = { opacity: 1 };
      return acc;
    }, {} as Variants);
  }
  return variants;
}

/**
 * Returns motion props or empty props based on whether device is mobile
 */
export function getMotionProps(isMobile: boolean) {
  if (isMobile) {
    return {
      initial: false,
      animate: false,
      exit: false,
      transition: { duration: 0 }
    };
  }
  return {};
}

/**
 * Returns transition config or zero duration for mobile
 */
export function getTransition(transition: any, isMobile: boolean) {
  if (isMobile) {
    return { duration: 0 };
  }
  return transition;
}
