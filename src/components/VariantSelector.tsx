import React, { useMemo } from 'react';
import { ProcessedProduct, ProductVariant } from '../types/shopify';
import { Check, AlertCircle } from 'lucide-react';

interface VariantSelectorProps {
  product: ProcessedProduct;
  selectedOptions: Record<string, string>;
  onOptionsChange: (options: Record<string, string>) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  product,
  selectedOptions,
  onOptionsChange,
}) => {
  const availableOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};

    product.variants.forEach(variant => {
      if (variant.selectedOptions) {
        Object.entries(variant.selectedOptions).forEach(([key, value]) => {
          if (!options[key]) {
            options[key] = new Set();
          }
          options[key].add(value);
        });
      }
    });

    const result: Record<string, string[]> = {};
    Object.entries(options).forEach(([key, valueSet]) => {
      result[key] = Array.from(valueSet).sort();
    });

    return result;
  }, [product.variants]);

  const getVariantAvailability = (optionName: string, optionValue: string): boolean => {
    const testOptions = { ...selectedOptions, [optionName]: optionValue };

    return product.variants.some(variant => {
      if (!variant.availableForSale) return false;
      if (!variant.selectedOptions) return false;

      return Object.entries(testOptions).every(([key, value]) => {
        return !variant.selectedOptions![key] || variant.selectedOptions![key] === value;
      });
    });
  };

  const handleOptionChange = (optionName: string, value: string) => {
    onOptionsChange({
      ...selectedOptions,
      [optionName]: value,
    });
  };

  const getDiamondTypeDisplay = (value: string): string => {
    if (value === 'Natural Diamond') return 'Natural Diamond (Any Size)';
    if (value.includes('Lab-Grown')) {
      return value.replace('Lab-Grown ', '') + ' Lab-Grown';
    }
    return value + ' Natural';
  };

  const getDiamondTypePrice = (value: string): string | null => {
    const testOptions = { ...selectedOptions, ['Diamond Type']: value };

    const matchingVariant = product.variants.find(variant => {
      if (!variant.selectedOptions) return false;
      return Object.entries(testOptions).every(([key, val]) => {
        if (key === 'Size' || key === 'Ring Size') return true;
        return !variant.selectedOptions![key] || variant.selectedOptions![key] === val;
      });
    });

    if (matchingVariant) {
      return `€${matchingVariant.price.toLocaleString()}`;
    }
    return null;
  };

  const isNaturalDiamond = (value: string): boolean => {
    return value === 'Natural Diamond' || (!value.includes('Lab-Grown') && !value.includes('0.'));
  };

  const getOptionCount = (optionName: string, optionValue: string): number => {
    const testOptions = { ...selectedOptions, [optionName]: optionValue };

    return product.variants.filter(variant => {
      if (!variant.selectedOptions) return false;
      return Object.entries(testOptions).every(([key, value]) => {
        return !variant.selectedOptions![key] || variant.selectedOptions![key] === value;
      });
    }).length;
  };

  return (
    <div className="space-y-6">
      {Object.entries(availableOptions).map(([optionName, values]) => {
        if (values.length <= 1) return null;

        const isDiamondType = optionName === 'Diamond Type' || optionName.toLowerCase().includes('diamond') || optionName.toLowerCase().includes('carat');
        const isRingSize = optionName === 'Size' || optionName === 'Ring Size';

        return (
          <div key={optionName} className="space-y-3">
            <h3 className="text-sm font-semibold text-[#2c2827] flex items-center">
              {optionName}
              <span className="ml-2 text-xs text-[#837f7a] font-normal">
                ({values.length} options)
              </span>
            </h3>

            {isDiamondType ? (
              <div className="space-y-2">
                {values.map(value => {
                  const isSelected = selectedOptions[optionName] === value;
                  const isAvailable = getVariantAvailability(optionName, value);
                  const displayName = getDiamondTypeDisplay(value);
                  const price = getDiamondTypePrice(value);
                  const isNatural = isNaturalDiamond(value);
                  const count = getOptionCount(optionName, value);

                  return (
                    <label
                      key={value}
                      className={`block w-full p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/10'
                          : !isAvailable
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-Color-Champagne-Gold hover:bg-Color-Primary-Beige/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name={optionName}
                          checked={isSelected}
                          disabled={!isAvailable}
                          onChange={() => handleOptionChange(optionName, value)}
                          className="mt-1 w-5 h-5 border-2 border-Color-Champagne-Gold text-Color-Champagne-Gold focus:ring-2 focus:ring-Color-Champagne-Gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-sm font-medium ${!isAvailable ? 'text-gray-400' : 'text-[#2c2827]'}`}>
                              {displayName}
                            </span>
                            {price && !isNatural && (
                              <span className={`text-sm font-bold ${isSelected ? 'text-Color-Champagne-Gold' : 'text-[#2c2827]'}`}>
                                {price}
                              </span>
                            )}
                            {isNatural && (
                              <span className="text-xs bg-Color-Champagne-Gold/10 text-Color-Champagne-Gold px-2 py-1 rounded-full font-medium">
                                Contact for Price
                              </span>
                            )}
                          </div>
                          {!isAvailable && (
                            <div className="flex items-center mt-1 text-xs text-red-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Not available with current selection
                            </div>
                          )}
                          {isAvailable && count > 0 && (
                            <div className="text-xs text-[#837f7a] mt-1">
                              {count} variant{count > 1 ? 's' : ''} available
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : isRingSize ? (
              <select
                value={selectedOptions[optionName] || ''}
                onChange={(e) => handleOptionChange(optionName, e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-Color-Champagne-Gold focus:ring-2 focus:ring-Color-Champagne-Gold/50 transition-all"
              >
                <option value="">Select {optionName}</option>
                {values.map(value => {
                  const isAvailable = getVariantAvailability(optionName, value);
                  return (
                    <option key={value} value={value} disabled={!isAvailable}>
                      {value} {!isAvailable ? '(Out of stock)' : ''}
                    </option>
                  );
                })}
              </select>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {values.map(value => {
                  const isSelected = selectedOptions[optionName] === value;
                  const isAvailable = getVariantAvailability(optionName, value);

                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(optionName, value)}
                      disabled={!isAvailable}
                      className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        isSelected
                          ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/10 text-Color-Champagne-Gold'
                          : !isAvailable
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                          : 'border-gray-200 hover:border-Color-Champagne-Gold hover:bg-Color-Primary-Beige/20 text-[#2c2827]'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isSelected && <Check className="h-4 w-4" />}
                        <span className="capitalize">{value}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
