import React from 'react';
import { X } from 'lucide-react';
import { ProductFilters } from '../../config/filterConfig';
import { getClarityDisplayInfo, getCertificationDisplayInfo } from '../../utils/diamondFilterUtils';

interface FilterSummaryChipsProps {
  filters: ProductFilters;
  onRemoveFilter: (filterKey: keyof ProductFilters, value?: any) => void;
  onClearAll: () => void;
}

export const FilterSummaryChips: React.FC<FilterSummaryChipsProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  const activeFilters: Array<{
    key: keyof ProductFilters;
    label: string;
    value?: any;
    color: string;
  }> = [];

  // Ring Style
  if (filters.ringStyle) {
    activeFilters.push({
      key: 'ringStyle',
      label: `Style: ${filters.ringStyle}`,
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    });
  }

  // Shapes
  if (filters.shapes && filters.shapes.length > 0) {
    filters.shapes.forEach(shape => {
      activeFilters.push({
        key: 'shapes',
        label: `Shape: ${shape}`,
        value: shape,
        color: 'bg-purple-100 text-purple-800 border-purple-300',
      });
    });
  }

  // Metal Colors
  if (filters.metalColors && filters.metalColors.length > 0) {
    filters.metalColors.forEach(color => {
      activeFilters.push({
        key: 'metalColors',
        label: `Metal: ${color}`,
        value: color,
        color: 'bg-amber-100 text-amber-800 border-amber-300',
      });
    });
  }

  // Stone Type
  if (filters.stoneType) {
    activeFilters.push({
      key: 'stoneType',
      label: filters.stoneType,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    });
  }

  // Diamond Origin
  if (filters.diamondOrigin) {
    activeFilters.push({
      key: 'diamondOrigin',
      label: filters.diamondOrigin,
      color: 'bg-teal-100 text-teal-800 border-teal-300',
    });
  }

  // Gemstone Variant
  if (filters.gemstoneVariant) {
    activeFilters.push({
      key: 'gemstoneVariant',
      label: filters.gemstoneVariant,
      color: 'bg-pink-100 text-pink-800 border-pink-300',
    });
  }

  // Carat Weights
  if (filters.caratWeights && filters.caratWeights.length > 0) {
    filters.caratWeights.forEach(weight => {
      activeFilters.push({
        key: 'caratWeights',
        label: `Carat: ${weight.label}`,
        value: weight,
        color: 'bg-Color-Champagne-Gold/20 text-Color-Netural-Black border-Color-Champagne-Gold/40',
      });
    });
  }

  // Clarity Grades
  if (filters.clarityGrades && filters.clarityGrades.length > 0) {
    filters.clarityGrades.forEach(clarity => {
      const info = getClarityDisplayInfo(clarity);
      activeFilters.push({
        key: 'clarityGrades',
        label: `Clarity: ${clarity} (${info.quality})`,
        value: clarity,
        color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      });
    });
  }

  // Certifications
  if (filters.certifications && filters.certifications.length > 0) {
    filters.certifications.forEach(cert => {
      activeFilters.push({
        key: 'certifications',
        label: `Cert: ${cert}`,
        value: cert,
        color: 'bg-green-100 text-green-800 border-green-300',
      });
    });
  }

  // Price Range
  if (filters.minPrice || filters.maxPrice) {
    let priceLabel = 'Price: ';
    if (filters.minPrice && filters.maxPrice) {
      priceLabel += `€${filters.minPrice} - €${filters.maxPrice}`;
    } else if (filters.minPrice) {
      priceLabel += `€${filters.minPrice}+`;
    } else if (filters.maxPrice) {
      priceLabel += `Up to €${filters.maxPrice}`;
    }
    activeFilters.push({
      key: 'minPrice',
      label: priceLabel,
      color: 'bg-rose-100 text-rose-800 border-rose-300',
    });
  }

  // Search Text
  if (filters.searchText) {
    activeFilters.push({
      key: 'searchText',
      label: `Search: "${filters.searchText}"`,
      color: 'bg-gray-100 text-gray-800 border-gray-300',
    });
  }

  // In Stock Only
  if (filters.inStockOnly) {
    activeFilters.push({
      key: 'inStockOnly',
      label: 'In Stock Only',
      color: 'bg-lime-100 text-lime-800 border-lime-300',
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  const handleRemoveArrayFilter = (key: keyof ProductFilters, value: any) => {
    const currentArray = (filters[key] as any[]) || [];
    const filtered = currentArray.filter(item => {
      if (typeof item === 'object' && 'label' in item) {
        return item.label !== value.label;
      }
      return item !== value;
    });

    onRemoveFilter(key, filtered.length > 0 ? filtered : undefined);
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-Color-Light-300 py-3 px-4 shadow-sm">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-Color-Gray-700 flex-shrink-0">
          Active Filters:
        </span>

        <div className="flex items-center gap-2 flex-wrap flex-1">
          {activeFilters.map((filter, index) => (
            <button
              key={`${filter.key}-${index}`}
              onClick={() => {
                if (filter.value !== undefined) {
                  handleRemoveArrayFilter(filter.key, filter.value);
                } else if (filter.key === 'minPrice' || filter.key === 'maxPrice') {
                  onRemoveFilter('minPrice');
                  onRemoveFilter('maxPrice');
                } else {
                  onRemoveFilter(filter.key);
                }
              }}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                border transition-all duration-200
                hover:shadow-md hover:scale-105
                ${filter.color}
              `}
            >
              <span>{filter.label}</span>
              <X className="h-3.5 w-3.5 flex-shrink-0" />
            </button>
          ))}
        </div>

        {activeFilters.length > 1 && (
          <button
            onClick={onClearAll}
            className="px-4 py-1.5 text-sm font-semibold text-Color-Champagne-Gold hover:text-white hover:bg-Color-Champagne-Gold border-2 border-Color-Champagne-Gold rounded-full transition-all duration-200 flex-shrink-0"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};
