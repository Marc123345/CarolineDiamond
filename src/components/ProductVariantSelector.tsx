import React, { useState, useMemo, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
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

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({ 
  productKey, 
  onAddToCart, 
  onRequestPrice 
}) => {
  const t = useTranslate();
  const product = UNIFIED_PRODUCTS[productKey];
  
  // State for selections
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCarat, setSelectedCarat] = useState<string | null>(null);

  // Get available options based on current selections
  const availableFilters = useMemo(() => {
    return getAvailableFilters(product.variants, {
      metalColor: selectedMetal as any,
      diamondType: selectedType as any,
      caratWeight: selectedCarat as any
    });
  }, [selectedMetal, selectedType, selectedCarat, product.variants]);

  // Determine the active variant
  const selectedVariant = useMemo(() => {
    if (!selectedMetal || !selectedType) return undefined;
    
    // For Natural diamonds, price is always 'On Request'
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

  const isNatural = selectedType === 'Natural';
  const isPriceOnRequest = selectedVariant?.price === null || isNatural;
  const canAddToCart = selectedVariant && !isPriceOnRequest;

  // UI pricing string
  const displayPrice = selectedVariant 
    ? (isPriceOnRequest ? t('Price on Request') : `€${selectedVariant.price?.toLocaleString('nl-NL')}`)
    : product.priceRange;

  return (
    <div className="space-y-8">
      {/* 1. Metal Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-4">{t('Select Metal')}</label>
        <div className="grid grid-cols-3 gap-3">
          {['White Gold', 'Yellow Gold', 'Rose Gold'].map(color => (
            <button 
              key={color}
              onClick={() => setSelectedMetal(color)}
              className={`p-4 border-2 rounded-xl transition-all ${selectedMetal === color ? 'border-[#CDBCAB] bg-[#CDBCAB]/5' : 'border-gray-100'}`}
            >
              <span className="text-xs font-bold uppercase tracking-tight">{t(color)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Diamond Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-4">{t('Diamond Type')}</label>
        <div className="grid grid-cols-2 gap-3">
          {['Lab-Grown', 'Natural'].map(type => (
            <button 
              key={type}
              onClick={() => {
                setSelectedType(type);
                if (type === 'Natural') setSelectedCarat(null);
              }}
              className={`p-4 border-2 rounded-xl text-left transition-all ${selectedType === type ? 'border-[#CDBCAB] bg-[#CDBCAB]/5' : 'border-gray-100'}`}
            >
              <span className="block text-sm font-bold">{t(type)}</span>
              <span className="block text-[10px] text-gray-500 mt-1">
                {type === 'Lab-Grown' ? t('Ethical Luxury') : t('Price on Request')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Carat Selection - Hidden if Natural selected */}
      <AnimatePresence>
        {!isNatural && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <label className="block text-sm font-medium text-gray-900 mb-4">{t('Carat Weight')}</label>
            <div className="grid grid-cols-3 gap-3">
              {availableFilters.caratWeights.map(carat => (
                <button 
                  key={carat}
                  onClick={() => setSelectedCarat(carat)}
                  className={`p-3 border-2 rounded-xl text-sm transition-all ${selectedCarat === carat ? 'border-[#CDBCAB] bg-[#CDBCAB]/5 font-bold' : 'border-gray-100'}`}
                >
                  {carat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Card */}
      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{t('Total Price')}</p>
        <p className="text-3xl font-light text-gray-900 tracking-tight">{displayPrice}</p>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        {canAddToCart ? (
          <button 
            onClick={() => onAddToCart?.(selectedVariant!)}
            className="w-full bg-[#CDBCAB] text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-[#B9A892] transition-all"
          >
            {t('Add to Cart')}
          </button>
        ) : isPriceOnRequest && selectedVariant ? (
          <button 
            onClick={() => onRequestPrice?.(selectedVariant!)}
            className="w-full bg-black text-white py-5 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-5 h-5" />
            {t('Contact Us for Price')}
          </button>
        ) : (
          <button disabled className="w-full bg-gray-100 text-gray-400 py-5 rounded-xl font-bold uppercase tracking-widest border border-gray-200">
            {t('Select Options')}
          </button>
        )}
      </div>
    </div>
  );
};