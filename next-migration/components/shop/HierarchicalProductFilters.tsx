import React, { useState, useMemo } from 'react';
import { X, ChevronDown, RotateCcw, Check, Sparkles, Gem } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  ProductFilters as FilterType,
  RING_STYLES,
  METAL_COLORS,
  METAL_COLOR_LABELS,
  PRICE_RANGES,
  getAvailableShapes,
  shouldShowShapeFilter
} from '../../config/filterConfig';
import { ProcessedProduct } from '../../types/shopify';
import { ShapeIcon, RingStyleIcon } from './ShapeIcons';
import { getMetalColorDisplayInfo } from '../../utils/metalColorUtils';
import { useEnhancedFilterCounts } from '../../hooks/useEnhancedFilterCounts';

interface HierarchicalProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClose?: () => void;
  isMobile?: boolean;
  products?: ProcessedProduct[];
}

export const HierarchicalProductFilters: React.FC<HierarchicalProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
  products = []
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['ringStyle', 'shape'])
  );

  const { counts: filterCounts } = useEnhancedFilterCounts(products, filters);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  };

  const updateFilter = (key: keyof FilterType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'ringStyle') {
      newFilters.shapes = undefined;
      newFilters.sideDiamonds = undefined;
    }
    onFiltersChange(newFilters);
  };

  const availableShapes = getAvailableShapes(filters.ringStyle, filters.jewelryCategory);
  const showShapeFilter = shouldShowShapeFilter(filters.jewelryCategory);

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

  const availableMetalColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(product => {
      product.variants?.forEach(variant => {
        const metalColor = variant.selectedOptions?.['Metal Color'];
        if (metalColor) {
          // Normalize metal color names
          const normalized = metalColor
            .replace(/^18[kK]\s*/, '')  // Remove "18K" or "18k" prefix
            .replace(/-/g, ' ')          // Replace hyphens with spaces
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Title case
            .join(' ');

          // Only add standard colors
          if (normalized === 'Rose Gold' || normalized === 'Yellow Gold' || normalized === 'White Gold' || normalized === 'White') {
            colors.add(normalized === 'White' ? 'White Gold' : normalized);
          }
        }
      });
    });
    return Array.from(colors).sort();
  }, [products]);

  const activeFilterCount = useMemo(() => [
    filters.ringStyle,
    filters.shapes?.length,
    filters.metalColors?.length,
    filters.specificCarats?.length,
    filters.minPrice || filters.maxPrice,
    filters.sideDiamonds !== undefined
  ].filter(Boolean).length, [filters]);

  // --- REFINED SECTION HEADER ---
  const SectionHeader = ({ title, section, label }: { title: string, section: string, label: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-6 border-b border-black/[0.05] group"
    >
      <div className="flex items-center gap-5">
        <span className="text-[10px] font-serif italic text-Color-Light-300">0{label}</span>
        <h3 className="text-xs uppercase tracking-[0.3em] font-black text-Color-Dark-500 group-hover:text-Color-Champagne-Gold transition-colors">
          {title}
        </h3>
      </div>
      <motion.div animate={{ rotate: expandedSections.has(section) ? 180 : 0 }}>
        <ChevronDown className="h-3.5 w-3.5 text-Color-Light-300" />
      </motion.div>
    </button>
  );

  return (
    <div className={`flex flex-col bg-[#FCFAFB] ${isMobile ? 'h-full' : ''}`}>
      {/* Header */}
      <header className="px-6 py-8 border-b border-black/[0.03]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-serif text-Color-Dark-500">Refine Selection</h2>
          {isMobile && (
            <button onClick={onClose} className="p-2 -mr-2 hover:rotate-90 transition-transform duration-500">
              <X className="w-5 h-5 text-Color-Dark-500" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-Color-Champagne-Gold animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-Color-Light-300">
            {products.length} Designs Found
          </span>
        </div>
      </header>

      <div className={`flex-1 overflow-y-auto px-6 py-4 no-scrollbar space-y-2`}>
        <LayoutGroup>
          {/* Clear Filters */}
          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.button
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => onFiltersChange({})}
                className="w-full py-4 mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-Color-Champagne-Gold bg-white border border-Color-Champagne-Gold/20 hover:bg-Color-Primary-Beige/10 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Ledger ({activeFilterCount})
              </motion.button>
            )}
          </AnimatePresence>

          {/* 1. Ring Style */}
          <SectionHeader title="Design Style" section="ringStyle" label="1" />
          <AnimatePresence>
            {expandedSections.has('ringStyle') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden py-6"
              >
                <div className="grid grid-cols-2 gap-3">
                  {RING_STYLES.map(style => {
                    const isSelected = filters.ringStyle === style;
                    const count = filterCounts.ringStyles[style] || 0;
                    return (
                      <button
                        key={style}
                        onClick={() => updateFilter('ringStyle', isSelected ? undefined : style)}
                        className={`group relative p-5 border transition-all duration-700 flex flex-col items-center gap-4 ${
                          isSelected ? 'bg-Color-Dark-500 border-Color-Dark-500 shadow-xl' : 'bg-white border-black/[0.05] hover:border-Color-Champagne-Gold'
                        }`}
                      >
                        <RingStyleIcon 
                          style={style} size={28} 
                          className={isSelected ? 'text-Color-Champagne-Gold' : 'text-Color-Light-300 group-hover:text-Color-Dark-500 transition-colors'} 
                        />
                        <div className="text-center">
                          <p className={`text-[10px] uppercase tracking-widest font-bold ${isSelected ? 'text-white' : 'text-Color-Dark-500'}`}>{style}</p>
                          <p className={`text-[9px] font-serif italic mt-1 ${isSelected ? 'text-Color-Light-300/60' : 'text-Color-Gray-400'}`}>({count})</p>
                        </div>
                        {isSelected && <motion.div layoutId="check" className="absolute top-2 right-2"><Check className="w-3 h-3 text-Color-Champagne-Gold" /></motion.div>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. Diamond Shape */}
          {showShapeFilter && filters.ringStyle && (
            <>
              <SectionHeader title="The Stone Cut" section="shape" label="2" />
              <AnimatePresence>
                {expandedSections.has('shape') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden py-6"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {availableShapes.map(shape => {
                        const isSelected = filters.shapes?.includes(shape);
                        return (
                          <button
                            key={shape}
                            onClick={() => {
                                const current = filters.shapes || [];
                                const next = current.includes(shape) ? current.filter(s => s !== shape) : [...current, shape];
                                updateFilter('shapes', next.length > 0 ? next : undefined);
                            }}
                            className={`flex flex-col items-center p-4 border transition-all duration-500 ${
                              isSelected ? 'border-Color-Dark-500 bg-Color-Dark-500 text-white shadow-lg' : 'border-black/[0.05] bg-white hover:border-Color-Champagne-Gold'
                            }`}
                          >
                            <ShapeIcon shape={shape} size={24} className={isSelected ? 'text-Color-Champagne-Gold' : 'text-Color-Light-300'} />
                            <span className="text-[9px] uppercase tracking-tighter font-black mt-2">{shape}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* 3. Metal Color */}
          {availableMetalColors.length > 0 && (
            <>
              <SectionHeader title="Metal / Gold Color" section="metalColor" label="3" />
              <AnimatePresence>
                {expandedSections.has('metalColor') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden py-6"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {availableMetalColors.map(color => {
                        const isSelected = filters.metalColors?.includes(color as any);
                        return (
                          <button
                            key={color}
                            onClick={() => {
                              const current = filters.metalColors || [];
                              const next = current.includes(color as any)
                                ? current.filter(c => c !== color)
                                : [...current, color as any];
                              updateFilter('metalColors', next.length > 0 ? next : undefined);
                            }}
                            className={`flex flex-col items-center p-4 border transition-all duration-500 ${
                              isSelected ? 'border-Color-Dark-500 bg-Color-Dark-500 text-white shadow-lg' : 'border-black/[0.05] bg-white hover:border-Color-Champagne-Gold'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full mb-2 ${
                              color.includes('Rose') ? 'bg-gradient-to-br from-[#E8C4B8] to-[#D4A89A]' :
                              color.includes('Yellow') ? 'bg-gradient-to-br from-[#FFD700] to-[#FFC700]' :
                              'bg-gradient-to-br from-[#E5E4E2] to-[#D3D3D3]'
                            }`} />
                            <span className="text-[9px] uppercase tracking-tighter font-black mt-1">{color}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* 4. Diamond Type */}
          {availableDiamondTypes.length > 0 && (
            <>
              <SectionHeader title="Diamond Type" section="diamondType" label="4" />
              <AnimatePresence>
                {expandedSections.has('diamondType') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden py-6 space-y-2"
                  >
                    {availableDiamondTypes.map(type => {
                      const isLabGrown = type.toLowerCase().includes('lab-grown');
                      const caratMatch = type.match(/([\d.]+)ct/);
                      const carat = caratMatch ? parseFloat(caratMatch[1]) : null;
                      const isSelected = carat
                        ? filters.specificCarats?.includes(carat)
                        : false;

                      return (
                        <button
                          key={type}
                          onClick={() => {
                            if (carat) {
                              const current = filters.specificCarats || [];
                              const next = current.includes(carat)
                                ? current.filter(c => c !== carat)
                                : [...current, carat];
                              updateFilter('specificCarats', next.length > 0 ? next : undefined);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-6 py-4 border transition-all duration-500 ${
                            isSelected ? 'bg-Color-Dark-500 border-Color-Dark-500 text-white' : 'bg-white border-black/[0.05] hover:border-Color-Champagne-Gold text-Color-Dark-500'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Gem className={`w-4 h-4 ${isLabGrown ? 'text-green-500' : 'text-blue-500'}`} />
                            <span className="text-[11px] uppercase tracking-widest font-bold">{type}</span>
                          </div>
                          {isSelected ? <Check className="w-3 h-3 text-Color-Champagne-Gold" /> : <div className="w-2 h-2 rounded-full bg-Color-Primary-Beige" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* 5. Price Ledger */}
          <SectionHeader title="Investment Range" section="priceRange" label="5" />
          <AnimatePresence>
            {expandedSections.has('priceRange') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden py-6 space-y-2"
              >
                {PRICE_RANGES.map(range => {
                  const isSelected = filters.minPrice === range.min && filters.maxPrice === range.max;
                  return (
                    <button
                      key={range.label}
                      onClick={() => onFiltersChange({ ...filters, minPrice: isSelected ? undefined : range.min, maxPrice: isSelected ? undefined : range.max })}
                      className={`w-full flex items-center justify-between px-6 py-4 border transition-all duration-500 ${
                        isSelected ? 'bg-Color-Dark-500 border-Color-Dark-500 text-white' : 'bg-white border-black/[0.05] hover:border-Color-Champagne-Gold text-Color-Dark-500'
                      }`}
                    >
                      <span className="text-[11px] uppercase tracking-widest font-bold">{range.label}</span>
                      {isSelected ? <Check className="w-3 h-3 text-Color-Champagne-Gold" /> : <div className="w-2 h-2 rounded-full bg-Color-Primary-Beige" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      {/* Footer Apply */}
      {isMobile && (
        <div className="p-6 bg-white border-t border-black/[0.03] shadow-[0_-20px_40px_rgba(0,0,0,0.03)] backdrop-blur-xl bg-white/90">
          <button
            onClick={onClose}
            className="w-full py-5 bg-Color-Dark-500 text-white uppercase text-xs tracking-[0.5em] font-black hover:bg-black transition-all shadow-xl flex items-center justify-center gap-4 group"
          >
            Enter Boutique
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      );
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);