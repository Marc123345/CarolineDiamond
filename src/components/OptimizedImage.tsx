import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Package } from 'lucide-react';
import { buildImageKitUrl, getLQIPUrl, buildResponsiveSrcSet, type ImageKitTransformation } from '../utils/imagekit';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  widths?: number[];
  transformation?: ImageKitTransformation;
  priority?: boolean;
}

const DEFAULT_FALLBACK = '/images/product-placeholder.jpg';
const DEFAULT_WIDTHS = [320, 640, 960, 1280, 1920];
const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  onLoad,
  fallbackSrc = DEFAULT_FALLBACK,
  loading = 'lazy',
  sizes = DEFAULT_SIZES,
  widths = DEFAULT_WIDTHS,
  transformation = {},
  priority = false
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imageLoadedRef = useRef(false);
  const highResLoadedRef = useRef(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: '200px',
    skip: priority || loading === 'eager'
  });

  const shouldLoad = priority || loading === 'eager' || inView;

  const isExternalImage = src.startsWith('http://') || src.startsWith('https://');

  const lqipSrc = !isExternalImage ? getLQIPUrl(src) : '';
  const optimizedSrc = !isExternalImage
    ? buildImageKitUrl(src, {
        format: 'auto',
        quality: 'auto',
        dpr: 'auto',
        ...transformation
      })
    : src;

  const srcSet = !isExternalImage && widths.length > 0
    ? buildResponsiveSrcSet(src, widths, {
        format: 'auto',
        quality: 'auto',
        dpr: 'auto',
        ...transformation
      })
    : undefined;

  useEffect(() => {
    if (!shouldLoad || imageLoadedRef.current) return;

    let lqipImg: HTMLImageElement | null = null;

    if (lqipSrc && !currentSrc) {
      lqipImg = new Image();
      lqipImg.src = lqipSrc;

      lqipImg.onload = () => {
        if (!imageLoadedRef.current) {
          setCurrentSrc(lqipSrc);
        }
      };
    }

    const highResImg = new Image();
    if (srcSet) {
      highResImg.srcset = srcSet;
      highResImg.sizes = sizes;
    }
    highResImg.src = optimizedSrc;

    const handleLoad = () => {
      if (!highResLoadedRef.current) {
        setCurrentSrc(optimizedSrc);
        setIsLoaded(true);
        setIsLoading(false);
        setHasError(false);
        imageLoadedRef.current = true;
        highResLoadedRef.current = true;
        onLoad?.();
      }
    };

    const handleError = () => {
      if (!imageLoadedRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Failed to load image: ${src}`);
        }
        setCurrentSrc(fallbackSrc);
        setIsLoading(false);
        setHasError(true);
        imageLoadedRef.current = true;
      }
    };

    highResImg.addEventListener('load', handleLoad);
    highResImg.addEventListener('error', handleError);

    return () => {
      highResImg.removeEventListener('load', handleLoad);
      highResImg.removeEventListener('error', handleError);
      if (lqipImg) {
        lqipImg.onload = null;
      }
      highResImg.src = '';
    };
  }, [src, optimizedSrc, lqipSrc, srcSet, sizes, onLoad, shouldLoad, fallbackSrc]);

  const isBlurred = currentSrc === lqipSrc && !isLoaded;

  return (
    <div ref={ref} className="relative w-full h-full bg-gray-100 overflow-hidden">
      {isLoading && !currentSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="animate-pulse">
            <Package className="h-12 w-12 text-gray-300" />
          </div>
        </div>
      )}

      {currentSrc && (
        <img
          src={currentSrc}
          srcSet={isLoaded && srcSet ? srcSet : undefined}
          sizes={isLoaded && srcSet ? sizes : undefined}
          alt={alt}
          className={`${className} transition-all duration-700 ease-out ${
            isBlurred
              ? 'blur-xl scale-110 opacity-70'
              : isLoaded
                ? 'blur-0 scale-100 opacity-100'
                : 'opacity-0'
          }`}
          loading={loading}
          decoding="async"
        />
      )}

      {isLoading && currentSrc && isBlurred && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100/30 to-transparent pointer-events-none" />
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Image unavailable</p>
          </div>
        </div>
      )}

      {priority && !isLoaded && (
        <link
          rel="preload"
          as="image"
          href={optimizedSrc}
          imageSrcSet={srcSet}
          imageSizes={sizes}
        />
      )}
    </div>
  );
};
