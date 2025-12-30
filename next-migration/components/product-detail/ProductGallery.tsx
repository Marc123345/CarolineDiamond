'use client';

import React, { useState, memo } from 'react';
import { ProductImageGallery } from '../product/ProductImageGallery';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery = memo<ProductGalleryProps>(({ images, productName }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-8 sticky top-32">
      <ProductImageGallery
        images={images}
        productName={productName}
        selectedImageIndex={selectedImageIndex}
        onImageSelect={setSelectedImageIndex}
      />

      <div className="grid grid-cols-3 gap-4">
        {['IGI', 'GIA', 'HRD'].map((cert) => (
          <div
            key={cert}
            className="bg-white p-4 flex flex-col items-center justify-center border border-black/[0.03] group hover:border-Color-Champagne-Gold transition-all duration-700"
          >
            <span className="text-[10px] font-black text-Color-Light-300 group-hover:text-Color-Dark-500">
              {cert}
            </span>
            <span className="text-[8px] uppercase tracking-tighter opacity-40 mt-1">
              Certified
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

ProductGallery.displayName = 'ProductGallery';
