import React, { useMemo } from 'react';
import { ProcessedProduct } from '../../types/shopify';

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
    const min = Math.floor(prices[0] / 100) * 100;
    const max = Math.ceil(prices[prices.length - 1] / 100) * 100;
    const binCount = 8;
    const binSize = Math.ceil((max - min) / binCount / 100) * 100;

    const bins: Array<{ min: number; max: number; count: number; percentage: number }> = [];

    for (let i = 0; i < binCount; i++) {
      const binMin = min + i * binSize;
      const binMax = i === binCount - 1 ? max : binMin + binSize;

      const count = products.filter(p => p.price >= binMin && p.price < binMax).length;
      const percentage = (count / products.length) * 100;

      bins.push({ min: binMin, max: binMax, count, percentage });
    }

    return bins;
  }, [products]);

  if (priceDistribution.length === 0) {
    return null;
  }

  const maxPercentage = Math.max(...priceDistribution.map(b => b.percentage));

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-Color-Netural-Black mb-2">
        Price Distribution
      </div>

      <div className="flex items-end gap-1 h-32">
        {priceDistribution.map((bin, index) => {
          const height = (bin.percentage / maxPercentage) * 100;
          const isSelected =
            (!selectedMin || bin.max > selectedMin) &&
            (!selectedMax || bin.min < selectedMax);

          return (
            <button
              key={index}
              onClick={() => onRangeSelect(bin.min, bin.max)}
              className="flex-1 relative group"
              title={`€${bin.min.toLocaleString()} - €${bin.max.toLocaleString()}: ${bin.count} products`}
            >
              <div
                className={`w-full rounded-t transition-all duration-300 ${
                  isSelected
                    ? 'bg-Color-Champagne-Gold'
                    : 'bg-Color-Light-300 group-hover:bg-Color-Champagne-Gold/50'
                }`}
                style={{ height: `${height}%` }}
              />

              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-Color-Netural-Black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                {bin.count}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-Color-Gray-700">
        <span>€{priceDistribution[0].min.toLocaleString()}</span>
        <span>€{priceDistribution[priceDistribution.length - 1].max.toLocaleString()}</span>
      </div>

      <div className="flex gap-2 text-xs text-Color-Gray-700">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-Color-Champagne-Gold rounded" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-Color-Light-300 rounded" />
          <span>Available</span>
        </div>
      </div>
    </div>
  );
};
