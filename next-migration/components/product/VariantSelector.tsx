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
      if (!variant.availableForSale || !variant.selectedOptions) return;

      const matchesCurrentSelection = Object.entries(selectedOptions).every(
        ([key, value]) => {
          const variantValue = variant.selectedOptions![key];
          return !variantValue || variantValue === value;
        }
      );

      if (matchesCurrentSelection) {
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
  }, [product.variants, selectedOptions]);

  const getVariantAvailability = (optionName: string, optionValue: string): boolean => {
    const testOptions = { ...selectedOptions, [optionName]: optionValue };

    return product.variants.some(variant => {
      if (!variant.availableForSale) return false;
      if (!variant.selectedOptions) return false;

      // Only check the options that are currently selected
      // This allows users to select options in any order
      return Object.entries(testOptions).every(([key, value]) => {
        const variantValue = variant.selectedOptions![key];

        // If variant doesn't have this option, skip it
        if (!variantValue) return true;

        // Check if values match
        return variantValue === value;
      });
    });
  };

  const getRequiredOptions = useMemo(() => {
    const required = new Set<string>();
    product.variants.forEach(variant => {
      if (variant.selectedOptions) {
        Object.keys(variant.selectedOptions).forEach(key => {
          if (!key.toLowerCase().includes('color') &&
              !key.toLowerCase().includes('metal') &&
              key !== 'Size' && key !== 'Ring Size') {
            required.add(key);
          }
        });
      }
    });
    return Array.from(required);
  }, [product.variants]);

  const getMissingOptions = useMemo(() => {
    return getRequiredOptions.filter(option => !selectedOptions[option]);
  }, [getRequiredOptions, selectedOptions]);

  const handleOptionChange = (optionName: string, value: string) => {
    onOptionsChange({
      ...selectedOptions,
      [optionName]: value,
    });
  };

  const getDiamondTypeDisplay = (value: string): string => {
    return value;
  };

  const getDiamondTypePrice = (value: string): string | null => {
    const testOptions = { ...selectedOptions, ['Diamond Type']: value };

    // CRITICAL FIX: Match ALL selected options including Size to show correct price
    // If Size/Ring Size is not selected yet, we can't show an exact price
    const matchingVariant = product.variants.find(variant => {
      if (!variant.selectedOptions) return false;
      return Object.entries(testOptions).every(([key, val]) => {
        // Only match if the variant has this option and values match exactly
        return variant.selectedOptions![key] === val;
      });
    });

    if (matchingVariant) {
      return `€${matchingVariant.price.toLocaleString()}`;
    }

    // If no exact match (e.g., Size not selected yet), show price range
    const variantsWithDiamondType = product.variants.filter(variant => {
      if (!variant.selectedOptions) return false;
      // Match only the Diamond Type, ignore unselected options
      return Object.entries(testOptions).every(([key, val]) => {
        if (!selectedOptions[key] && key !== 'Diamond Type') return true; // Skip unselected options
        return variant.selectedOptions![key] === val;
      });
    });

    if (variantsWithDiamondType.length > 0) {
      const prices = variantsWithDiamondType.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) {
        return `€${minPrice.toLocaleString()}`;
      } else {
        return `€${minPrice.toLocaleString()} - €${maxPrice.toLocaleString()}`;
      }
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

  const isOptionSelected = (optionName: string): boolean => {
    return !!selectedOptions[optionName];
  };

  return (
    <div className="space-y-6">
      {/* Missing Options Alert */}
      {getMissingOptions.length > 0 && Object.keys(selectedOptions).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-900 mb-1">Please complete your selection</p>
            <p className="text-[10px] text-amber-700 leading-relaxed">
              Select: {getMissingOptions.join(', ')}
            </p>
          </div>
        </div>
      )}

      {Object.entries(availableOptions).map(([optionName, values]) => {
        if (values.length <= 1) return null;

        const isDiamondType = optionName === 'Diamond Type' || optionName.toLowerCase().includes('diamond') || optionName.toLowerCase().includes('carat');
        const isRingSize = optionName === 'Size' || optionName === 'Ring Size';
        const isColorOption = optionName.toLowerCase().includes('color') || optionName.toLowerCase().includes('metal');
        const isSelected = isOptionSelected(optionName);
        const isRequired = getRequiredOptions.includes(optionName);

        if (isColorOption) return null;

        return (
          <div key={optionName} className="space-y-3">
            <h3 className="text-sm font-semibold text-[#2c2827] flex items-center gap-2">
              {optionName}
              {isRequired && !isSelected && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] uppercase tracking-wider font-bold rounded">
                  Required
                </span>
              )}
              {isSelected && (
                <Check className="w-4 h-4 text-Color-Champagne-Gold" />
              )}
              <span className="ml-auto text-xs text-[#837f7a] font-normal">
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
