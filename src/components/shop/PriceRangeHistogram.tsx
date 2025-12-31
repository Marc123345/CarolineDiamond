import React, { useMemo } from 'react';
import { ProcessedProduct } from '../../types'; // Adjusted import path

interface PriceRangeHistogramProps {
  products: ProcessedProduct[];
  selectedMin?: number;
  selectedMax?: number;
  onRangeSelect: (min: number, max: number | undefined) => void;
}

export const PriceRangeHistogram: React.FC<PriceRangeHistogramProps> = ({
  products,
  selectedMin,
  selectedMax,
  onRangeSelect,
}) => {
  const priceDistribution = useMemo(() => {
    if (products.length === 0) return [];

    const prices = products.map(p => p.price).sort((a, b) => a - b);
    
    if (prices.length === 0) return [];

    // Calculate nice round numbers for min/max
    const rawMin = prices[0];
    const rawMax = prices[prices.length - 1];
    
    // Round down to nearest 100 for min, up for max
    const min = Math.floor(rawMin / 100) * 100;
    const max = Math.ceil(rawMax / 100) * 100;
    
    // If all products are same price or range is 0, handle gracefully
    if (min === max) {
        return [{ min, max: max + 100, count: products.length, percentage: 100 }];
    }

    const binCount = 8;
    const binSize = Math.ceil((max - min) / binCount / 100) * 100;

    const bins: Array<{ min: number; max: number; count: number; percentage: number }> = [];

    for (let i = 0; i < binCount; i++) {
      const binMin = min + i * binSize;
      // Ensure the last bin captures the absolute max value
      const binMax = i === binCount - 1 ? Math.max(max, binMin + binSize) : binMin + binSize;

      // Count products in this specific bin range
      const count = products.filter(p => p.price >= binMin && p.price < binMax).length;
      
      // Calculate height percentage relative to total products (or max bin count for better visuals)
      // Using total products for percentage here
      const percentage = (count / products.length) * 100;

      bins.push({ min: binMin, max: binMax, count, percentage });
    }

    return bins;
  }, [products]);

  if (priceDistribution.length === 0) {
    return null;
  }

  // Find the highest percentage to normalize bar heights relative to the tallest bar
  const maxBinPercentage = Math.max(...priceDistribution.map(b => b.percentage));

  return (
    <div className="space-y-3 px-1">
      <div className="text-sm font-medium text-Color-Netural-Black mb-2 flex items-center gap-2">
        <span>Price Distribution</span>
        

[Image of Histogram Chart]

      </div>

      <div className="flex items-end gap-1 h-24 sm:h-32 mt-4">
        {priceDistribution.map((bin, index) => {
          // Normalize height: The tallest bar will always be 100% height
          const height = maxBinPercentage > 0 ? (bin.percentage / maxBinPercentage) * 100 : 0;
          
          // Check if this bin falls within the currently selected range
          const isSelected =
            (!selectedMin || bin.max > selectedMin) &&
            (!selectedMax || bin.min < selectedMax);

          return (
            <button
              key={index}
              onClick={() => onRangeSelect(bin.min, bin.max)}
              className="flex-1 relative group h-full flex items-end focus:outline-none"
              title={`€${bin.min.toLocaleString()} - €${bin.max.toLocaleString()}: ${bin.count} products`}
              aria-label={`Filter prices between €${bin.min} and €${bin.max}`}
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-Color-Champagne-Gold'
                    : 'bg-Color-Light-300 group-hover:bg-Color-Champagne-Gold/50'
                }`}
                style={{ height: `${Math.max(height, 5)}%` }} // Ensure at least 5% height so empty bins are visible as flat lines
              >
                 {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-Color-Netural-Black text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 shadow-md">
                  {bin.count}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-Color-Gray-700 font-medium">
        <span>€{priceDistribution[0].min.toLocaleString()}</span>
        <span>€{priceDistribution[priceDistribution.length - 1].max.toLocaleString()}</span>
      </div>

      <div className="flex gap-4 text-[10px] text-Color-Gray-700 mt-2 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-Color-Champagne-Gold rounded-sm" />
          <span>Active Range</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-Color-Light-300 rounded-sm" />
          <span>Available</span>
        </div>
      </div>
    </div>
  );
};