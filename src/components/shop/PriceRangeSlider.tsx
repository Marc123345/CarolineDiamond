import React, { useState, useEffect, useCallback } from 'react';
import { ProcessedProduct } from '../../types'; // Fixed import path

interface PriceRangeSliderProps {
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min: number, max: number) => void;
  products: ProcessedProduct[];
  className?: string;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
  products,
  className = ''
}) => {
  // Calculate price range from products
  const { min: productMin, max: productMax } = React.useMemo(() => {
    if (products.length === 0) {
      return { min: 0, max: 10000 };
    }
    const prices = products.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices) / 100) * 100,
      max: Math.ceil(Math.max(...prices) / 100) * 100
    };
  }, [products]);

  // Use props if provided, otherwise default to product range
  const [localMin, setLocalMin] = useState(minPrice !== undefined ? minPrice : productMin);
  const [localMax, setLocalMax] = useState(maxPrice !== undefined ? maxPrice : productMax);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  // Sync internal state if props change externally (e.g. "Clear Filters")
  useEffect(() => {
    setLocalMin(minPrice !== undefined ? minPrice : productMin);
    setLocalMax(maxPrice !== undefined ? maxPrice : productMax);
  }, [minPrice, maxPrice, productMin, productMax]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localMax - 100);
    setLocalMin(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localMin + 100);
    setLocalMax(value);
  };

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      onPriceChange(localMin, localMax);
      setIsDragging(null);
    }
  }, [isDragging, localMin, localMax, onPriceChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseUp]);

  const minPercent = ((localMin - productMin) / (productMax - productMin)) * 100;
  const maxPercent = ((localMax - productMin) / (productMax - productMin)) * 100;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Price Display */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Min Price</span>
          <span className="text-lg font-bold text-Color-Netural-Black">
            {formatPrice(localMin)}
          </span>
        </div>
        <div className="text-Color-Champagne-Gold font-bold">—</div>
        <div className="flex flex-col text-right">
          <span className="text-xs text-gray-500">Max Price</span>
          <span className="text-lg font-bold text-Color-Netural-Black">
            {formatPrice(localMax)}
          </span>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative pt-2 pb-6">
        {/* Track Background */}
        <div className="absolute h-2 w-full bg-gray-200 rounded-full top-2" />

        {/* Active Track */}
        <div
          className="absolute h-2 bg-Color-Champagne-Gold rounded-full top-2"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`
          }}
        />

        {/* Min Slider */}
        <input
          type="range"
          min={productMin}
          max={productMax}
          step={100}
          value={localMin}
          onChange={handleMinChange}
          onMouseDown={() => setIsDragging('min')}
          onTouchStart={() => setIsDragging('min')}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-2 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-Color-Champagne-Gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-Color-Champagne-Gold [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform focus:outline-none focus:ring-2 focus:ring-Color-Champagne-Gold/50"
          aria-label="Minimum price"
          aria-valuemin={productMin}
          aria-valuemax={productMax}
          aria-valuenow={localMin}
          aria-valuetext={formatPrice(localMin)}
        />

        {/* Max Slider */}
        <input
          type="range"
          min={productMin}
          max={productMax}
          step={100}
          value={localMax}
          onChange={handleMaxChange}
          onMouseDown={() => setIsDragging('max')}
          onTouchStart={() => setIsDragging('max')}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-2 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-Color-Champagne-Gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-Color-Champagne-Gold [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform focus:outline-none focus:ring-2 focus:ring-Color-Champagne-Gold/50"
          aria-label="Maximum price"
          aria-valuemin={productMin}
          aria-valuemax={productMax}
          aria-valuenow={localMax}
          aria-valuetext={formatPrice(localMax)}
        />

        {/* Price Labels */}
        <div className="absolute flex justify-between w-full top-8 text-xs text-gray-500">
          <span>{formatPrice(productMin)}</span>
          <span>{formatPrice(productMax)}</span>
        </div>
      </div>

      {/* Product Count in Range */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-gray-50 rounded-full text-sm">
          <span className="font-bold text-Color-Champagne-Gold">
            {products.filter(p => p.price >= localMin && p.price <= localMax).length}
          </span>
          {' '}
          <span className="text-gray-600">
            products in range
          </span>
        </span>
      </div>
    </div>
  );
};