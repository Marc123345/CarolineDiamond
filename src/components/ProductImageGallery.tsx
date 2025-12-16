import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

const ProductImageGalleryComponent: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  selectedImageIndex,
  onImageSelect,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handlePrevious = () => {
    const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1;
    onImageSelect(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0;
    onImageSelect(newIndex);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const currentImage = images[selectedImageIndex];

  return (
    <>
      {/* Main Image Container */}
      <div className="space-y-4 sm:space-y-6">
        <div
          className="aspect-square overflow-hidden bg-[#f8f6f3] group relative rounded-lg sm:rounded-xl cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onClick={() => setIsFullscreen(true)}
        >
          {currentImage ? (
            <motion.img
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={currentImage}
              alt={`${productName} - View ${selectedImageIndex + 1}`}
              loading={selectedImageIndex === 0 ? 'eager' : 'lazy'}
              fetchPriority={selectedImageIndex === 0 ? 'high' : 'low'}
              decoding={selectedImageIndex === 0 ? 'sync' : 'async'}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'group-hover:scale-110'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    }
                  : {}
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ZoomIn className="h-16 w-16" />
            </div>
          )}

          {/* Navigation Arrows - Only show if multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-Color-Netural-Black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-Color-Netural-Black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Zoom Indicator */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
            <Maximize2 className="h-3 w-3" />
            <span>Click to enlarge</span>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails - Display filtered images based on color */}
        {images.length > 1 && (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onImageSelect(index)}
                className={`flex-shrink-0 overflow-hidden border-2 transition-all duration-200 rounded-lg ${
                  selectedImageIndex === index
                    ? 'border-[#764e3e] shadow-lg ring-2 ring-[#764e3e]/50'
                    : 'border-[#e5d9d2] hover:border-[#764e3e]'
                }`}
                aria-label={`View image ${index + 1}`}
                aria-pressed={selectedImageIndex === index}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  loading="lazy"
                  className="w-16 sm:w-20 h-16 sm:h-20 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full z-10 transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation in fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full z-10 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full z-10 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            <motion.img
              key={selectedImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={currentImage}
              alt={`${productName} - Full size view ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image counter in fullscreen */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const ProductImageGallery = React.memo(ProductImageGalleryComponent);
