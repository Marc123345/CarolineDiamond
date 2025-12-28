import React from 'react';
import { ArrowLeft, Check, Circle } from 'lucide-react';
import { ProcessedProduct, ProductVariant } from '../types/shopify';

interface VariantSelectionSummaryProps {
  product: ProcessedProduct;
  selectedVariant: ProductVariant;
  onChangeOptions: () => void;
}

const metalColorMap: Record<string, { color: string; border: string; label: string }> = {
  'white': { color: '#FFFFFF', border: '#D1D1D1', label: 'White Gold' },
  'yellow': { color: '#D3B275', border: '#B8985E', label: 'Yellow Gold' },
  'rose': { color: '#B76E79', border: '#9D5D66', label: 'Rose Gold' },
  'platinum': { color: '#E5E4E2', border: '#B8B5B3', label: 'Platinum' },
};

const getMetalColorInfo = (colorString: string) => {
  const lowerColor = colorString.toLowerCase();
  if (lowerColor.includes('yellow')) return metalColorMap['yellow'];
  if (lowerColor.includes('rose')) return metalColorMap['rose'];
  if (lowerColor.includes('white') || lowerColor.includes('whte')) return metalColorMap['white'];
  if (lowerColor.includes('platinum')) return metalColorMap['platinum'];
  return metalColorMap['white'];
};

export const VariantSelectionSummary: React.FC<VariantSelectionSummaryProps> = ({
  product,
  selectedVariant,
  onChangeOptions,
}) => {
  const variantOptions = selectedVariant.selectedOptions || {};

  const metalColor = variantOptions['Color'] || variantOptions['color'] || variantOptions['Metal'];
  const shape = variantOptions['Shape'] || variantOptions['shape'] || variantOptions['Form'];
  const style = variantOptions['Style'] || variantOptions['style'];

  const metalInfo = metalColor ? getMetalColorInfo(metalColor) : null;

  return (
    <div className="bg-gradient-to-br from-[#f8f6f3] to-[#f0ede8] p-5 sm:p-6 rounded-xl border border-Color-Light-300/20 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-[#2c2827] flex items-center">
          <Check className="h-5 w-5 text-Color-Light-300 mr-2" />
          Your Selection
        </h3>
        <button
          onClick={onChangeOptions}
          className="text-xs sm:text-sm text-Color-Champagne-Gold hover:text-Color-Light-300 transition-colors flex items-center font-medium underline-offset-2 hover:underline"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          Change
        </button>
      </div>

      <div className="space-y-3">
        {/* Metal Color */}
        {metalColor && metalInfo && (
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm text-[#837f7a] font-medium">Metal</span>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border-2 shadow-sm"
                style={{
                  backgroundColor: metalInfo.color,
                  borderColor: metalInfo.border,
                }}
              />
              <span className="text-sm font-semibold text-[#2c2827]">{metalInfo.label}</span>
            </div>
          </div>
        )}

        {/* Shape */}
        {shape && (
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm text-[#837f7a] font-medium">Shape</span>
            <span className="text-sm font-semibold text-[#2c2827] capitalize">{shape}</span>
          </div>
        )}

        {/* Style */}
        {style && (
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm text-[#837f7a] font-medium">Style</span>
            <span className="text-sm font-semibold text-[#2c2827] capitalize">{style}</span>
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <span className="text-sm text-[#837f7a] font-medium">Availability</span>
          <div className="flex items-center gap-2">
            <Circle
              className={`h-2 w-2 ${
                selectedVariant.availableForSale ? 'fill-green-500 text-green-500' : 'fill-red-500 text-red-500'
              }`}
            />
            <span
              className={`text-sm font-semibold ${
                selectedVariant.availableForSale ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {selectedVariant.availableForSale ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>

      {/* Additional variant info if needed */}
      {selectedVariant.title && selectedVariant.title !== 'Default Title' && (
        <div className="mt-4 pt-4 border-t border-Color-Light-300/20">
          <p className="text-xs text-[#837f7a]">
            Variant: <span className="font-medium text-[#2c2827]">{selectedVariant.title}</span>
          </p>
        </div>
      )}
    </div>
  );
};
