'use client';

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import type { NormalizedVariant } from '../../utils/productNormalizer';

interface ProductSpecificationsProps {
  selectedVariant: NormalizedVariant | null;
}

export const ProductSpecifications = memo<ProductSpecificationsProps>(({ selectedVariant }) => {
  const [activeTab, setActiveTab] = useState('specifications');

  return (
    <div className="space-y-6">
      <nav className="flex gap-10 border-b border-black/[0.05]">
        {['specifications', 'craftsmanship'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-black transition-all relative ${
              activeTab === tab ? 'text-Color-Dark-500' : 'text-Color-Light-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="tab"
                className="absolute bottom-0 left-0 right-0 h-px bg-Color-Champagne-Gold"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="min-h-[200px]">
        {activeTab === 'specifications' ? (
          <div className="grid grid-cols-2 gap-y-6 gap-x-12">
            {selectedVariant?.selectedOptions &&
              Object.entries(selectedVariant.selectedOptions).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-Color-Gray-400">
                    {key}
                  </span>
                  <span className="text-sm font-medium text-Color-Dark-500">{value}</span>
                </div>
              ))}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest font-bold text-Color-Gray-400">
                Metal Finish
              </span>
              <span className="text-sm font-medium text-Color-Dark-500">18K Solid Gold</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-Color-Gray-500 leading-loose italic">
            Every Diamond by CS piece is individually forged in the heart of Antwerp's diamond
            district, combining 15 years of legacy expertise with conflict-free, hand-selected
            stones.
          </p>
        )}
      </div>
    </div>
  );
});

ProductSpecifications.displayName = 'ProductSpecifications';
