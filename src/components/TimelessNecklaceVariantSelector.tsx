import React, { useState, useMemo } from 'react';
import { MessageCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UNIFIED_PRODUCTS, 
  getAvailableFilters, 
  type ProductVariant 
} from '../config/productVariantsConfig';
import { useTranslate } from '../hooks/useTranslate';

interface ProductVariantSelectorProps {
  productKey: 'necklace' | 'earrings' | 'rings';
  onAddToCart?: (variant: ProductVariant) => void;
  onRequestPrice?: (variant: ProductVariant) => void;
}

/**
 * Helper to determine CSS classes for metal color swatches
 */
const getMetalColorClass = (color: string) => {
  switch (color) {
    case 'White Gold':
      return 'bg-gradient-to-br from-gray-100 to-gray-300';
    case 'Yellow Gold':
      return 'bg-gradient-to-br from-yellow-200 to-yellow-400';
    case 'Rose Gold':
      return 'bg-gradient-to-br from-rose-200 to-rose-300';
    default:
      return 'bg-gray-200';
  }
};

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({ 
  productKey, 
  onAddToCart, 
  onRequestPrice 
}) => {
  const t = useTranslate();
  const product = UNIFIED_PRODUCTS[productKey];
  
  // State management for selected options
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCarat, setSelectedCarat] = useState<string | null>(null);

  // Determine available filters based on current selection
  const availableFilters = useMemo(() => {
    return getAvailableFilters(product.variants, {
      metalColor: selectedMetal as any,
      diamondType: selectedType as any,
      caratWeight: selectedCarat as any
    });
  }, [selectedMetal, selectedType, selectedCarat, product.variants]);

  // Find the variant that matches all selected criteria
  const selectedVariant = useMemo(() => {
    if (!selectedMetal || !selectedType) return undefined;
    
    // For Natural diamonds, we often simplify by picking the first matching metal
    if (selectedType === 'Natural') {
      return product.variants.find(v => 
        v.metalColor === selectedMetal && v.diamondType === 'Natural'
      );
    }

    if (!selectedCarat) return undefined;

    return product.variants.find(v => 
      v.metalColor === selectedMetal && 
      v.diamondType === selectedType && 
      v.caratWeight === selectedCarat
    );
  }, [selectedMetal, selectedType, selectedCarat, product.variants]);

  // CAROLINE'S LOGIC: 
  // 1. If Natural Diamond is selected, Price is "On Request"
  // 2. Hide Carat selection for Natural Diamonds to simplify the UX
  // 3. Hide "Add to Cart" and show "Contact Us" button
  const isNatural = selectedType === 'Natural';
  const isPriceOnRequest = selectedVariant?.price === null || isNatural;
  const canAddToCart = selectedVariant && !isPriceOnRequest;

  // Formatting price for display
  const priceDisplay = selectedVariant 
    ? (isPriceOnRequest ? t('Price on Request') : `€${selectedVariant.price?.toLocaleString('nl-NL')}`)
    : product.priceRange;

  return (
    <div className="space-y-8">
      {/* 1. Metal Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-4">
          {t('Select Metal')}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['White Gold', 'Yellow Gold', 'Rose Gold'].map(color => {
            const isSelected = selectedMetal === color;
            return (
              <button 
                key={color}
                onClick={() => setSelectedMetal(color)}
                className={`relative p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                  ${isSelected ? 'border-[#CDBCAB] bg-[#CDBCAB]/5 ring-1 ring-[#CDBCAB]' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className={`w-10 h-10 rounded-full shadow-inner ${getMetalColorClass(color)}`} />
                <span className="text-xs font-semibold text-gray-700">{t(color)}</span>
                {isSelected && (
                  <motion.div layoutId="check-metal" className="absolute top-1 right-1">
                    <Check className="w-4 h-4 text-[#CDBCAB]" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Diamond Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-4">
          {t('Diamond Type')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['Lab-Grown', 'Natural'].map(type => {
            const isSelected = selectedType === type;
            return (
              <button 
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  // Reset carat if switching to natural to avoid invalid states
                  if (type === 'Natural') setSelectedCarat(null);
                }}
                className={`relative p-4 rounded-lg border-2 text-left transition-all
                  ${isSelected ? 'border-[#CDBCAB] bg-[#CDBCAB]/5 ring-1 ring-[#CDBCAB]' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <span className="block text-sm font-bold text-gray-900">{t(type)}</span>
                <span className="block text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                  {type === 'Lab-Grown' ? t('Ethical Luxury') : t('Price on Request')}
                </span>
                {isSelected && (
                  <Check className="absolute top-4 right-4 w-4 h-4 text-[#CDBCAB]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Carat Weight - Hidden for Natural Diamonds per Caroline's instruction */}
      <AnimatePresence>
        {!isNatural && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="block text-sm font-medium text-gray-900 mb-4">
              {t('Carat Weight')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {availableFilters.caratWeights.map(carat => {
                const isSelected = selectedCarat === carat;
                return (
                  <button 
                    key={carat}
                    onClick={() => setSelectedCarat(carat)}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all
                      ${isSelected ? 'border-[#CDBCAB] bg-[#CDBCAB]/5 text-gray-900' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                  >
                    {carat}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Information Card */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{t('Total Price')}</p>
            <p className="text-3xl font-light text-gray-900 tracking-tight">
              {priceDisplay}
            </p>
          </div>
          <p className="text-[10px] text-gray-400 mb-1">
            {t('incl. 21% VAT')}
          </p>
        </div>
      </div>

      {/* Action Buttons with Conditional Logic */}
      <div className="space-y-3 pt-2">
        {canAddToCart ? (
          <button 
            onClick={() => onAddToCart?.(selectedVariant!)}
            className="w-full bg-[#CDBCAB] text-white py-5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#B9A892] transition-all shadow-md active:scale-[0.98]"
          >
            {t('Add to Cart')}
          </button>
        ) : isPriceOnRequest && selectedVariant ? (
          <button 
            onClick={() => onRequestPrice?.(selectedVariant!)}
            className="w-full bg-gray-900 text-white py-5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-md active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            {t('Contact Us for Price')}
          </button>
        ) : (
          <button 
            disabled 
            className="w-full bg-gray-100 text-gray-400 py-5 rounded-xl font-bold text-sm uppercase tracking-widest cursor-not-allowed border border-gray-200"
          >
            {t('Complete your selection')}
          </button>
        )}
        
        <p className="text-[10px] text-center text-gray-400 uppercase tracking-tight">
          {t('Free worldwide shipping • Certificate of authenticity included')}
        </p>
      </div>
    </div>
  );
};