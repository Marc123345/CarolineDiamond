import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import {
  ProductFilters as FilterType,
  JEWELRY_CATEGORIES,
  RING_STYLES,
  METAL_COLORS,
  METAL_COLOR_LABELS,
  STONE_TYPES,
  DIAMOND_ORIGINS,
  GEMSTONE_VARIANTS,
  getAvailableShapes,
  shouldShowShapeFilter
} from '../../config/filterConfig';
import { ProcessedProduct } from '../../types/shopify';
import { ShapeIcon, RingStyleIcon } from './ShapeIcons';
import { getMetalColorDisplayInfo } from '../../utils/metalColorUtils';
import { useEnhancedFilterCounts } from '../../hooks/useEnhancedFilterCounts';
import { useTranslate } from '../../hooks/useTranslate';

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
  const t = useTranslate();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['jewelryType', 'ringType', 'metalColor', 'shape', 'stoneType'])
  );

  const { counts: filterCounts } = useEnhancedFilterCounts(products, filters);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const updateFilter = (key: keyof FilterType, value: FilterType[keyof FilterType]) => {
    const newFilters = { ...filters, [key]: value };

    // Hierarchy Logic: Reset child filters when parents change
    if (key === 'jewelryCategory' && value !== 'Rings') {
      newFilters.ringStyle = undefined;
      newFilters.shapes = undefined;
    }
    if (key === 'ringStyle') newFilters.shapes = undefined;
    if (key === 'stoneType') {
      newFilters.diamondOrigin = undefined;
      newFilters.gemstoneVariant = undefined;
    }

    onFiltersChange(newFilters);
  };

  const toggleArrayItem = <T extends string>(array: T[] | undefined, item: T): T[] => {
    const current = array || [];
    return current.includes(item) ? current.filter(i => i !== item) : [...current, item];
  };

  const availableShapes = getAvailableShapes(filters.ringStyle, filters.jewelryCategory);
  const showShapeFilter = shouldShowShapeFilter(filters.jewelryCategory);

  const activeFilterCount = [
    filters.jewelryCategory,
    filters.ringStyle,
    filters.shapes?.length,
    filters.metalColors?.length,
    filters.stoneType,
    filters.diamondOrigin,
    filters.gemstoneVariant
  ].filter(Boolean).length;

  const SectionHeader: React.FC<{ title: string; section: string; label: string; required?: boolean }> = ({ 
    title, section, label, required = false 
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-4 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-transparent hover:border-[#CDBCAB]/20"
    >
      <div className="flex items-center gap-4">
        <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">
          {label}
        </div>
        <div className="text-left">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">{t(title)}</h3>
          {required && <p className="text-[10px] text-[#CDBCAB] font-bold uppercase">{t('Required')}</p>}
        </div>
      </div>
      {expandedSections.has(section) ? (
        <ChevronUp className="h-4 w-4 text-gray-400" />
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className={`${isMobile ? 'h-full flex flex-col bg-white' : 'space-y-6'}`}>
      {isMobile && (
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-medium text-gray-900">{t('Fine Tuning')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>
      )}

      <div className={`${isMobile ? 'flex-1 overflow-y-auto p-6' : ''} space-y-6`}>
        {activeFilterCount > 0 && (
          <button
            onClick={() => onFiltersChange({})}
            className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-[#CDBCAB] border border-[#CDBCAB]/20 rounded-xl hover:bg-[#CDBCAB]/5 transition-all"
          >
            {t('Clear all filters')} ({activeFilterCount})
          </button>
        )}

        {/* 0: Jewelry Type */}
        <div className="space-y-3">
          <SectionHeader title="Category" section="jewelryType" label="0" required />
          {expandedSections.has('jewelryType') && (
            <div className="grid grid-cols-2 gap-2 animate-fadeIn">
              {JEWELRY_CATEGORIES.map(category => {
                const isSelected = filters.jewelryCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => updateFilter('jewelryCategory', isSelected ? undefined : category)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-tighter transition-all border-2 ${
                      isSelected ? 'bg-gray-900 border-gray-900 text-white shadow-md' : 'bg-white border-gray-50 text-gray-500 hover:border-[#CDBCAB]/30'
                    }`}
                  >
                    {t(category)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* A: Ring Style */}
        {(!filters.jewelryCategory || filters.jewelryCategory === 'Rings') && (
          <div className="space-y-3">
            <SectionHeader title="Ring Style" section="ringType" label="A" required />
            {expandedSections.has('ringType') && (
              <div className="grid grid-cols-2 gap-2 animate-fadeIn">
                {RING_STYLES.map(style => {
                  const count = filterCounts.ringStyles[style] || 0;
                  const isSelected = filters.ringStyle === style;
                  return (
                    <button
                      key={style}
                      onClick={() => updateFilter('ringStyle', isSelected ? undefined : style)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                        isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-50 hover:border-[#CDBCAB]/30'
                      }`}
                    >
                      <RingStyleIcon style={style} size={32} className={isSelected ? 'text-gray-900' : 'text-gray-300'} />
                      <div className="text-center">
                        <div className="text-[10px] font-bold uppercase text-gray-900">{t(style)}</div>
                        <div className="text-[10px] text-gray-400">({count})</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* B: Color Gold */}
        <div className="space-y-3">
          <SectionHeader title="Metal Color" section="metalColor" label="B" required />
          {expandedSections.has('metalColor') && (
            <div className="flex gap-6 justify-center py-2">
              {METAL_COLORS.map(color => {
                const info = getMetalColorDisplayInfo(color);
                const isSelected = filters.metalColors?.includes(color);
                return (
                  <button
                    key={color}
                    onClick={() => updateFilter('metalColors', toggleArrayItem(filters.metalColors, color))}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div 
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        isSelected ? 'border-gray-900 scale-110 shadow-lg' : 'border-gray-100 group-hover:border-[#CDBCAB]'
                      }`}
                      style={{ backgroundColor: info.hexColor }}
                    />
                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tighter">{t(color)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* C: Shape */}
        {showShapeFilter && (
          <div className="space-y-3">
            <SectionHeader title="Diamond Shape" section="shape" label="C" />
            {expandedSections.has('shape') && (
              <div className="grid grid-cols-3 gap-2">
                {availableShapes.map(shape => {
                  const isSelected = filters.shapes?.includes(shape);
                  return (
                    <button
                      key={shape}
                      onClick={() => updateFilter('shapes', toggleArrayItem(filters.shapes, shape))}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-50 hover:border-[#CDBCAB]/30'
                      }`}
                    >
                      <ShapeIcon shape={shape} size={24} className={isSelected ? 'text-gray-900' : 'text-gray-300'} />
                      <span className="text-[9px] font-bold uppercase text-gray-900">{t(shape)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* D: Stone Type */}
        <div className="space-y-3">
          <SectionHeader title="Stone Preference" section="stoneType" label="D" />
          {expandedSections.has('stoneType') && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {STONE_TYPES.map(stone => (
                  <button
                    key={stone}
                    onClick={() => updateFilter('stoneType', filters.stoneType === stone ? undefined : stone)}
                    className={`py-3 rounded-xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      filters.stoneType === stone ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-50 text-gray-500'
                    }`}
                  >
                    {t(stone)}
                  </button>
                ))}
              </div>
              
              {/* Conditional Stone Origin UI */}
              {filters.stoneType === 'Diamond' && (
                <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                  {DIAMOND_ORIGINS.map(origin => (
                    <label key={origin} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          checked={filters.diamondOrigin === origin}
                          onChange={() => updateFilter('diamondOrigin', origin)}
                          className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-full checked:border-gray-900 transition-all"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-gray-900 rounded-full opacity-0 peer-checked:opacity-100 transition-all" />
                      </div>
                      <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">{t(origin)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-xl shadow-xl hover:bg-black transition-all"
          >
            {t('Apply Selection')} {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      )}
    </div>
  );
};