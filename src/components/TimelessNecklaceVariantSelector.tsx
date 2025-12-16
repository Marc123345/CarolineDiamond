import React, { useState, useMemo } from 'react';
import { MessageCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UNIFIED_TIMELESS_NECKLACE,
  getAvailableFilters,
  findMatchingVariant,
  formatPrice,
  type NecklaceVariant
} from '../config/necklaceVariantsConfig';
import { useTranslate } from '../hooks/useTranslate';

interface TimelessNecklaceVariantSelectorProps {
  onAddToCart?: (variant: NecklaceVariant) => void;
  onRequestPrice?: (variant: NecklaceVariant) => void;
}

export const TimelessNecklaceVariantSelector: React.FC<TimelessNecklaceVariantSelectorProps> = ({
  onAddToCart,
  onRequestPrice
}) => {
  const t = useTranslate();
  const [selectedMetalColor, setSelectedMetalColor] = useState<string | null>(null);
  const [selectedDiamondType, setSelectedDiamondType] = useState<string | null>(null);
  const [selectedCaratWeight, setSelectedCaratWeight] = useState<string | null>(null);

  // Defensive check for UNIFIED_TIMELESS_NECKLACE
  if (!UNIFIED_TIMELESS_NECKLACE || !UNIFIED_TIMELESS_NECKLACE.variants || UNIFIED_TIMELESS_NECKLACE.variants.length === 0) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-800 font-medium">Configuration Error</p>
        <p className="text-red-600 text-sm mt-1">Unable to load product variants. Please try again later.</p>
      </div>
    );
  }

  const availableFilters = useMemo(() => {
    return getAvailableFilters(UNIFIED_TIMELESS_NECKLACE.variants, {
      metalColor: selectedMetalColor as any,
      diamondType: selectedDiamondType as any,
      caratWeight: selectedCaratWeight as any
    });
  }, [selectedMetalColor, selectedDiamondType, selectedCaratWeight]);

  const selectedVariant = useMemo(() => {
    if (!selectedMetalColor || !selectedDiamondType || !selectedCaratWeight) return undefined;
    return findMatchingVariant(
      UNIFIED_TIMELESS_NECKLACE.variants,
      selectedMetalColor,
      selectedDiamondType,
      selectedCaratWeight
    );
  }, [selectedMetalColor, selectedDiamondType, selectedCaratWeight]);

  const priceDisplay = formatPrice(selectedVariant);
  const isPriceOnRequest = selectedVariant?.price === null;
  const canAddToCart = selectedVariant && !isPriceOnRequest;

  const handleMetalColorSelect = (color: string) => {
    setSelectedMetalColor(color);
  };

  const handleDiamondTypeSelect = (type: string) => {
    setSelectedDiamondType(type);
  };

  const handleCaratWeightSelect = (weight: string) => {
    setSelectedCaratWeight(weight);
  };

  const handleAddToCart = () => {
    if (canAddToCart && onAddToCart) {
      onAddToCart(selectedVariant);
    }
  };

  const handleRequestPrice = () => {
    if (isPriceOnRequest && selectedVariant && onRequestPrice) {
      onRequestPrice(selectedVariant);
    }
  };

  const metalColorOptions = ['White Gold', 'Yellow Gold', 'Rose Gold'];
  const diamondTypeOptions = ['Lab-Grown', 'Natural'];
  const caratWeightOptions = ['0.50 ct', '1.00 ct'];

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

  return (
    <div className="space-y-6">
      {/* Metal Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          {t('Metal Color')}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {metalColorOptions.map(color => {
            const isAvailable = availableFilters.metalColors.includes(color as any);
            const isSelected = selectedMetalColor === color;

            return (
              <button
                key={color}
                onClick={() => isAvailable && handleMetalColorSelect(color)}
                disabled={!isAvailable}
                className={`
                  relative p-4 rounded-lg border-2 transition-all
                  ${isSelected ? 'border-[#CDBCAB] ring-2 ring-[#CDBCAB]/20' : 'border-gray-200'}
                  ${isAvailable ? 'hover:border-[#CDBCAB]/50 cursor-pointer' : 'opacity-40 cursor-not-allowed'}
                `}
              >
                <div className={`w-full h-12 rounded-md mb-2 ${getMetalColorClass(color)}`} />
                <p className="text-xs font-medium text-gray-900">{color}</p>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-[#CDBCAB] rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Diamond Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          {t('Diamond Type')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {diamondTypeOptions.map(type => {
            const isAvailable = availableFilters.diamondTypes.includes(type as any);
            const isSelected = selectedDiamondType === type;

            return (
              <button
                key={type}
                onClick={() => isAvailable && handleDiamondTypeSelect(type)}
                disabled={!isAvailable}
                className={`
                  relative p-4 rounded-lg border-2 transition-all
                  ${isSelected ? 'border-[#CDBCAB] ring-2 ring-[#CDBCAB]/20 bg-[#CDBCAB]/5' : 'border-gray-200'}
                  ${isAvailable ? 'hover:border-[#CDBCAB]/50 cursor-pointer' : 'opacity-40 cursor-not-allowed'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {type === 'Lab-Grown' ? 'Ethical & Certified' : 'Mined Diamond'}
                    </p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-[#CDBCAB] rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Carat Weight Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          {t('Carat Weight')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {caratWeightOptions.map(weight => {
            const isAvailable = availableFilters.caratWeights.includes(weight as any);
            const isSelected = selectedCaratWeight === weight;

            return (
              <button
                key={weight}
                onClick={() => isAvailable && handleCaratWeightSelect(weight)}
                disabled={!isAvailable}
                className={`
                  relative p-4 rounded-lg border-2 transition-all
                  ${isSelected ? 'border-[#CDBCAB] ring-2 ring-[#CDBCAB]/20 bg-[#CDBCAB]/5' : 'border-gray-200'}
                  ${isAvailable ? 'hover:border-[#CDBCAB]/50 cursor-pointer' : 'opacity-40 cursor-not-allowed'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{weight}</p>
                    <p className="text-xs text-gray-500 mt-1">D-VS2 Clarity</p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-[#CDBCAB] rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedVariant ? 'selected' : 'default'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-[#CDBCAB]/10 to-[#CDBCAB]/5 rounded-lg p-6 border border-[#CDBCAB]/20"
        >
          {selectedVariant ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('Total Price')}</p>
                <motion.p
                  key={priceDisplay}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`text-3xl font-bold ${isPriceOnRequest ? 'text-[#CDBCAB]' : 'text-gray-900'}`}
                >
                  {priceDisplay}
                </motion.p>
                {!isPriceOnRequest && (
                  <p className="text-sm text-gray-500 mt-1">
                    {t('incl. 21% VAT')}
                  </p>
                )}
              </div>
              {isPriceOnRequest && (
                <MessageCircle className="w-8 h-8 text-[#CDBCAB]" />
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('Price Range')}</p>
              <p className="text-3xl font-bold text-gray-900">
                €750 – €1,190+
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t('incl. 21% VAT')}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="space-y-3">
        {canAddToCart ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#CDBCAB] text-white py-4 rounded-lg font-semibold hover:bg-[#B9A892] transition-colors"
          >
            {t('Add to Cart')}
          </button>
        ) : isPriceOnRequest && selectedVariant ? (
          <button
            onClick={handleRequestPrice}
            className="w-full bg-gradient-to-r from-[#CDBCAB] to-[#B9A892] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            {t('Request Price Quote')}
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-400 py-4 rounded-lg font-semibold cursor-not-allowed"
          >
            {t('Select all options')}
          </button>
        )}

        {selectedVariant && (
          <p className="text-xs text-center text-gray-500">
            {isPriceOnRequest
              ? t('Contact us for custom pricing on natural diamonds')
              : t('Free worldwide shipping • Lifetime warranty')}
          </p>
        )}
      </div>
    </div>
  );
};
