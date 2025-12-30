import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Package } from 'lucide-react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  onLoad?: () => void;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = '/images/product-placeholder.jpg';

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  placeholderSrc,
  onLoad,
  fallbackSrc = DEFAULT_FALLBACK
}) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || '');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imageLoadedRef = useRef(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (!inView || imageLoadedRef.current) return;

    const img = new Image();
    img.src = src;

    const handleLoad = () => {
      if (!imageLoadedRef.current) {
        setImageSrc(src);
        setIsLoading(false);
        setHasError(false);
        imageLoadedRef.current = true;
        onLoad?.();
      }
    };

    const handleError = () => {
      if (!imageLoadedRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Failed to load image: ${src}`);
        }
        setImageSrc(fallbackSrc);
        setIsLoading(false);
        setHasError(true);
        imageLoadedRef.current = true;
      }
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
      img.src = '';
    };
  }, [src, onLoad, inView, fallbackSrc]);

  return (
    <div ref={ref} className="relative w-full h-full bg-gray-100">
      {isLoading && !imageSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <Package className="h-8 w-8 text-gray-300" />
        </div>
      )}

      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`${className} transition-all duration-500 ${
            isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
          decoding="async"
        />
      )}

      {isLoading && imageSrc && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}

      {hasError && (
        <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-75">
          Image unavailable
        </div>
      )}
    </div>
  );
};
