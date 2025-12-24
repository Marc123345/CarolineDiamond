import React, { useState } from 'react';
import {
  buildImageKitUrl,
  buildResponsiveSrcSet,
  getLQIPUrl,
  defaultResponsiveWidths,
  defaultSizes,
  defaultMobileTransformation,
  type ImageKitTransformation,
} from '../utils/imagekit';

interface OptimizedImageProps {
  path: string;
  alt: string;
  transformation?: ImageKitTransformation;
  widths?: number[];
  sizes?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
  onLoad?: () => void;
  useLQIP?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  path,
  alt,
  transformation = defaultMobileTransformation,
  widths = defaultResponsiveWidths,
  sizes = defaultSizes,
  loading = 'lazy',
  className = '',
  onLoad,
  useLQIP = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!path || imageError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ minHeight: '200px' }}
      >
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    );
  }

  const lqipUrl = useLQIP ? getLQIPUrl(path) : undefined;
  const srcSetString = buildResponsiveSrcSet(path, widths, transformation);
  const srcUrl = buildImageKitUrl(path, { ...transformation, width: widths[2] || 640 });

  return (
    <div className={`relative ${className}`}>
      {useLQIP && !imageLoaded && lqipUrl && (
        <img
          src={lqipUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}
      <img
        src={srcUrl}
        srcSet={srcSetString}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchpriority={loading === 'eager' ? 'high' : 'auto'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '300px'
        }}
      />
    </div>
  );
};
