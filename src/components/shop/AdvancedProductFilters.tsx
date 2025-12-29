import React, { useState, useMemo } from 'react';
import { X, ChevronDown, RotateCcw, Check, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ProductFilters as FilterType,
  JEWELRY_CATEGORIES,
  RING_STYLES,
  ALL_SHAPES,
  getAvailableShapes,
  shouldShowShapeFilter,
} from '../../config/filterConfig';
import type { ProcessedProduct } from '../../types/shopify';
import { applyFilterChange } from '../../lib/shop/filterRules';
import { filterProducts } from '../../lib/shop/productFiltering';

interface AdvancedProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClose?: () => void;
  isMobile?: boolean;
  products?: ProcessedProduct[];
  isLoading?: boolean;
  filteredCount?: number;
}

const SectionHeader: React.FC<{
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  description?: string;
  activeCount?: number;
}> = ({ title, isExpanded, onToggle, description, activeCount }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between py-5 border-b border-black/[0.05] group"
  >
    <div className="text-left">
      <div className="flex items-center gap-3">
        <h3 className="text-xs uppercase tracking-[0.3em] font-black text-Color-Dark-500">
          {title}
        </h3>
        {activeCount ? (
          <span className="w-5 h-5 rounded-full bg-Color-Champagne-Gold text-white text-[10px] flex items-center justify-center font-bold">
            {activeCount}
          </span>
        ) : null}
      </div>
      {description && !isExpanded && (
        <p className="text-[10px] text-Color-Gray-400 uppercase tracking-widest mt-1">
          {description}
        </p>
      )}
    </div>
    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
      <ChevronDown className="h-4 w-4 text-Color-Light-300" />
    </motion.div>
  </button>
);

export const AdvancedProductFilters: React.FC<AdvancedProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
  products = [],
  isLoading = false,
  filteredCount,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['jewelryType', 'ringStyle', 'shape'])
  );

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  };

  const handleFilterChange = (key: keyof FilterType, value: any) => {
    const updated = applyFilterChange(filters, key, value);
    onFiltersChange(updated);
  };

  const handleToggleArrayFilter = (key: keyof FilterType, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const isSelected = currentArray.includes(value);

    const newArray = isSelected
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
  };

  const handleClearAll = () => {
    onFiltersChange({});
  };

  const availableShapes = useMemo(() => {
    if (filters.ringStyle) return getAvailableShapes(filters.ringStyle);
    if (!filters.jewelryCategory || filters.jewelryCategory === 'Rings') return ALL_SHAPES;
    return [];
  }, [filters.ringStyle, filters.jewelryCategory]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.jewelryCategory) count++;
    if (filters.ringStyle) count++;
    if (filters.shapes && filters.shapes.length > 0) count += filters.shapes.length;
    if (filters.metalColors && filters.metalColors.length > 0) count += filters.metalColors.length;
    if (filters.stoneType) count++;
    if (filters.caratWeights && filters.caratWeights.length > 0) count += filters.caratWeights.length;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.inStockOnly) count++;
    return count;
  }, [filters]);

  const getFilterOptionCount = useMemo(() => {
    return (filterKey: keyof FilterType, value: any): number => {
      const testFilters = { ...filters, [filterKey]: value };
      return filterProducts(products, testFilters).length;
    };
  }, [products, filters]);

  const getCategoryCount = useMemo(() => {
    return JEWELRY_CATEGORIES.reduce((acc, cat) => {
      const testFilters = { ...filters, jewelryCategory: cat };
      acc[cat] = filterProducts(products, testFilters).length;
      return acc;
    }, {} as Record<string, number>);
  }, [products, filters]);

  const getRingStyleCount = useMemo(() => {
    return RING_STYLES.reduce((acc, style) => {
      const testFilters = { ...filters, ringStyle: style };
      acc[style] = filterProducts(products, testFilters).length;
      return acc;
    }, {} as Record<string, number>);
  }, [products, filters]);

  const getShapeCount = useMemo(() => {
    return ALL_SHAPES.reduce((acc, shape) => {
      const currentShapes = filters.shapes || [];
      const isSelected = currentShapes.includes(shape);
      const testShapes = isSelected
        ? currentShapes.filter(s => s !== shape)
        : [...currentShapes, shape];
      const testFilters = { ...filters, shapes: testShapes.length > 0 ? testShapes : undefined };
      acc[shape] = filterProducts(products, testFilters).length;
      return acc;
    }, {} as Record<string, number>);
  }, [products, filters]);

  const availableMetalColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(product => {
      product.variants?.forEach(variant => {
        const metalColor = variant.selectedOptions?.['Metal Color'];
        if (metalColor) {
          const normalized = metalColor
            .replace(/^18[kK]\s*/, '')
            .replace(/-/g, ' ')
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          if (normalized === 'Rose Gold' || normalized === 'Yellow Gold' || normalized === 'White Gold' || normalized === 'White') {
            colors.add(normalized === 'White' ? 'White Gold' : normalized);
          }
        }
      });
    });
    return Array.from(colors).sort();
  }, [products]);

  const availableDiamondTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach(product => {
      product.variants?.forEach(variant => {
        const diamondType = variant.selectedOptions?.['Diamond Type'];
        if (diamondType) types.add(diamondType);
      });
    });
    return Array.from(types).sort();
  }, [products]);

  const getMetalColorCount = useMemo(() => {
    return availableMetalColors.reduce((acc, color) => {
      const currentColors = filters.metalColors || [];
      const isSelected = currentColors.includes(color as any);
      const testColors = isSelected
        ? currentColors.filter(c => c !== color)
        : [...currentColors, color as any];
      const testFilters = { ...filters, metalColors: testColors.length > 0 ? testColors : undefined };
      acc[color] = filterProducts(products, testFilters).length;
      return acc;
    }, {} as Record<string, number>);
  }, [availableMetalColors, products, filters]);

  const getDiamondTypeCount = useMemo(() => {
    return availableDiamondTypes.reduce((acc, type) => {
      const caratMatch = type.match(/([\d.]+)ct/);
      const carat = caratMatch ? parseFloat(caratMatch[1]) : null;
      if (carat) {
        const currentCarats = filters.specificCarats || [];
        const isSelected = currentCarats.includes(carat);
        const testCarats = isSelected
          ? currentCarats.filter(c => c !== carat)
          : [...currentCarats, carat];
        const testFilters = { ...filters, specificCarats: testCarats.length > 0 ? testCarats : undefined };
        acc[type] = filterProducts(products, testFilters).length;
      } else {
        acc[type] = filterProducts(products, filters).length;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [availableDiamondTypes, products, filters]);

  return (
    <div className={`flex flex-col bg-white ${isMobile ? 'h-full' : ''}`}>
      {/* Header */}
      <div
        className={`px-6 py-6 border-b border-black/[0.03] ${
          isMobile ? 'sticky top-0 z-20 bg-white/80 backdrop-blur-md' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-serif text-Color-Dark-500">Refine Collection</h2>
          {isMobile && (
            <button onClick={onClose} className="p-2 -mr-2" aria-label="Close filters">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isLoading ? 'bg-Color-Champagne-Gold animate-pulse' : 'bg-green-500'
            }`}
          />
          <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400">
            {filteredCount !== undefined ? filteredCount : products.length} Masterpieces Found
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar space-y-2">
        {/* Reset Button */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleClearAll}
              className="w-full py-3 mb-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-Color-Champagne-Gold border border-Color-Champagne-Gold/20 hover:bg-Color-Primary-Beige/10 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All Filters ({activeFilterCount})
            </motion.button>
          )}
        </AnimatePresence>

        {/* 1. Jewelry Category */}
        <SectionHeader
          title="Category"
          isExpanded={expandedSections.has('jewelryType')}
          onToggle={() => toggleSection('jewelryType')}
          description={filters.jewelryCategory}
        />
        <AnimatePresence>
          {expandedSections.has('jewelryType') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 py-4">
                {JEWELRY_CATEGORIES.map(cat => {
                  const isSelected = filters.jewelryCategory === cat;
                  const count = getCategoryCount[cat] || 0;
                  const isDisabled = count === 0 && !isSelected;
                  return (
                    <button
                      key={cat}
                      onClick={() =>
                        handleFilterChange('jewelryCategory', isSelected ? undefined : cat)
                      }
                      disabled={isDisabled}
                      className={`relative p-4 text-left border transition-all duration-500 ${
                        isSelected
                          ? 'border-Color-Dark-500 bg-Color-Dark-500 text-white'
                          : isDisabled
                          ? 'border-black/[0.05] opacity-40 cursor-not-allowed'
                          : 'border-black/[0.05] hover:border-Color-Champagne-Gold'
                      }`}
                    >
                      <span
                        className={`text-[11px] uppercase tracking-widest font-bold ${
                          isSelected ? 'text-white' : 'text-Color-Dark-500'
                        }`}
                      >
                        {cat}
                      </span>
                      <span
                        className={`text-[9px] mt-1 block ${
                          isSelected ? 'text-white/70' : 'text-Color-Gray-400'
                        }`}
                      >
                        {count} available
                      </span>
                      {isSelected && (
                        <Check className="absolute top-2 right-2 w-3 h-3 text-Color-Champagne-Gold" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Ring Style */}
        {filters.jewelryCategory === 'Rings' && (
          <>
            <SectionHeader
              title="Style"
              isExpanded={expandedSections.has('ringStyle')}
              onToggle={() => toggleSection('ringStyle')}
              description={filters.ringStyle}
            />
            <AnimatePresence>
              {expandedSections.has('ringStyle') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-2 py-4">
                    {RING_STYLES.map(style => {
                      const isSelected = filters.ringStyle === style;
                      const count = getRingStyleCount[style] || 0;
                      const isDisabled = count === 0 && !isSelected;
                      return (
                        <button
                          key={style}
                          onClick={() =>
                            handleFilterChange('ringStyle', isSelected ? undefined : style)
                          }
                          disabled={isDisabled}
                          className={`flex items-center justify-between p-4 border transition-all ${
                            isSelected
                              ? 'border-Color-Champagne-Gold bg-Color-Primary-Beige/10'
                              : isDisabled
                              ? 'border-black/[0.05] opacity-40 cursor-not-allowed'
                              : 'border-black/[0.05]'
                          }`}
                        >
                          <span className="text-xs font-bold text-Color-Dark-500 uppercase tracking-widest">
                            {style}
                          </span>
                          <span className="text-[9px] text-Color-Gray-400">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* 3. Diamond Shape */}
        {shouldShowShapeFilter(filters.jewelryCategory || 'Rings') && (
          <>
            <SectionHeader
              title="Diamond Shape"
              isExpanded={expandedSections.has('shape')}
              onToggle={() => toggleSection('shape')}
              activeCount={filters.shapes?.length}
            />
            <AnimatePresence>
              {expandedSections.has('shape') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 py-4">
                    {ALL_SHAPES.map(shape => {
                      const isCompatible = availableShapes.includes(shape);
                      const isSelected = filters.shapes?.includes(shape);
                      const count = getShapeCount[shape] || 0;
                      const isDisabled = count === 0 && !isSelected;
                      return (
                        <button
                          key={shape}
                          disabled={isDisabled}
                          onClick={() => handleToggleArrayFilter('shapes', shape)}
                          className={`relative p-4 text-left border transition-all ${
                            isSelected
                              ? 'border-Color-Champagne-Gold bg-Color-Primary-Beige/10'
                              : 'border-black/[0.05]'
                          } ${
                            isDisabled
                              ? 'opacity-30 cursor-not-allowed grayscale'
                              : ''
                          }`}
                        >
                          <span className="text-[11px] uppercase tracking-widest font-bold text-Color-Dark-500">
                            {shape}
                          </span>
                          <span className="text-[9px] mt-1 block text-Color-Gray-400">
                            {count} available
                          </span>
                          {isSelected && (
                            <Check className="absolute top-2 right-2 w-3 h-3 text-Color-Champagne-Gold" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* 4. Metal Color */}
        {availableMetalColors.length > 0 && (
          <>
            <SectionHeader
              title="Metal / Gold Color"
              isExpanded={expandedSections.has('metalColor')}
              onToggle={() => toggleSection('metalColor')}
              activeCount={filters.metalColors?.length}
            />
            <AnimatePresence>
              {expandedSections.has('metalColor') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-2 py-4">
                    {availableMetalColors.map(color => {
                      const isSelected = filters.metalColors?.includes(color as any);
                      const count = getMetalColorCount[color] || 0;
                      const isDisabled = count === 0 && !isSelected;
                      return (
                        <button
                          key={color}
                          disabled={isDisabled}
                          onClick={() => handleToggleArrayFilter('metalColors', color)}
                          className={`relative flex flex-col items-center p-4 border transition-all ${
                            isSelected
                              ? 'border-Color-Champagne-Gold bg-Color-Primary-Beige/10'
                              : 'border-black/[0.05]'
                          } ${
                            isDisabled
                              ? 'opacity-30 cursor-not-allowed grayscale'
                              : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full mb-2 ${
                            color.includes('Rose') ? 'bg-gradient-to-br from-[#E8C4B8] to-[#D4A89A]' :
                            color.includes('Yellow') ? 'bg-gradient-to-br from-[#FFD700] to-[#FFC700]' :
                            'bg-gradient-to-br from-[#E5E4E2] to-[#D3D3D3]'
                          }`} />
                          <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Dark-500 text-center">
                            {color}
                          </span>
                          <span className="text-[9px] mt-1 text-Color-Gray-400">
                            {count}
                          </span>
                          {isSelected && (
                            <Check className="absolute top-2 right-2 w-3 h-3 text-Color-Champagne-Gold" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* 5. Diamond Type */}
        {availableDiamondTypes.length > 0 && (
          <>
            <SectionHeader
              title="Diamond Type"
              isExpanded={expandedSections.has('diamondType')}
              onToggle={() => toggleSection('diamondType')}
              activeCount={filters.specificCarats?.length}
            />
            <AnimatePresence>
              {expandedSections.has('diamondType') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-2 py-4">
                    {availableDiamondTypes.map(type => {
                      const isLabGrown = type.toLowerCase().includes('lab-grown');
                      const caratMatch = type.match(/([\d.]+)ct/);
                      const carat = caratMatch ? parseFloat(caratMatch[1]) : null;
                      const isSelected = carat
                        ? filters.specificCarats?.includes(carat)
                        : false;
                      const count = getDiamondTypeCount[type] || 0;
                      const isDisabled = count === 0 && !isSelected;

                      return (
                        <button
                          key={type}
                          disabled={isDisabled}
                          onClick={() => {
                            if (carat) {
                              const current = filters.specificCarats || [];
                              const next = current.includes(carat)
                                ? current.filter(c => c !== carat)
                                : [...current, carat];
                              handleFilterChange('specificCarats', next.length > 0 ? next : undefined);
                            }
                          }}
                          className={`relative flex items-center justify-between p-4 border transition-all ${
                            isSelected
                              ? 'border-Color-Champagne-Gold bg-Color-Primary-Beige/10'
                              : 'border-black/[0.05]'
                          } ${
                            isDisabled
                              ? 'opacity-30 cursor-not-allowed grayscale'
                              : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Gem className={`w-4 h-4 ${isLabGrown ? 'text-green-500' : 'text-blue-500'}`} />
                            <span className="text-[11px] uppercase tracking-widest font-bold text-Color-Dark-500">
                              {type}
                            </span>
                          </div>
                          <span className="text-[9px] text-Color-Gray-400">
                            {count}
                          </span>
                          {isSelected && (
                            <Check className="absolute top-2 right-2 w-3 h-3 text-Color-Champagne-Gold" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};
