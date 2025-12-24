import React, { useMemo } from 'react';
import { ProcessedProduct } from '../../types/shopify';

interface PriceRangeHistogramProps {
  products: ProcessedProduct[];
  selectedMin?: number;
  selectedMax?: number;
  onRangeSelect: (min: number, max: number) => void;
}

export const PriceRangeHistogram: React.FC<PriceRangeHistogramProps> = ({
  products,
  selectedMin,
  selectedMax,
  onRangeSelect
}) => {
  const data = useMemo(() => {
    if (!products || products.length === 0) return [];

    const prices = products.map(p => p.price).filter(p => p > 0);
    if (prices.length === 0) return [];

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const rangeSize = (maxPrice - minPrice) / 5;

    const ranges = Array.from({ length: 5 }, (_, i) => {
      const min = Math.floor(minPrice + rangeSize * i);
      const max = Math.floor(minPrice + rangeSize * (i + 1));
      const count = products.filter(p => p.price >= min && p.price < (i === 4 ? max + 1 : max)).length;
      return {
        range: `€${min} - €${max}`,
        count,
        min,
        max
      };
    });

    return ranges;
  }, [products]);

  const maxCount = Math.max(...data.map(d => d.count), 1);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {data.map((item) => {
        const isSelected = selectedMin === item.min && selectedMax === item.max;
        return (
          <button
            key={item.range}
            onClick={() => onRangeSelect(item.min, item.max)}
            className={`w-full text-left p-2 rounded transition-colors ${
              isSelected
                ? 'bg-[#8B7355] text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{item.range}</span>
              <span className="text-xs text-gray-500">{item.count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  isSelected ? 'bg-white' : 'bg-[#8B7355]'
                }`}
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};
