import React from 'react';
import { Sparkles, Heart, Award } from 'lucide-react';
import { ProductFilters } from '../../config/filterConfig';

interface FilterPresetsPanelProps {
  onPresetSelect: (filters: ProductFilters) => void;
}

export const FilterPresetsPanel: React.FC<FilterPresetsPanelProps> = ({
  onPresetSelect
}) => {
  const presets = [
    {
      name: 'Popular',
      icon: Award,
      filters: { sortBy: 'bestselling' as const }
    },
    {
      name: 'New Arrivals',
      icon: Sparkles,
      filters: { sortBy: 'newest' as const }
    },
    {
      name: 'Most Loved',
      icon: Heart,
      filters: { sortBy: 'bestselling' as const }
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {presets.map((preset) => {
        const Icon = preset.icon;
        return (
          <button
            key={preset.name}
            onClick={() => onPresetSelect(preset.filters)}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#8B7355] hover:bg-gray-50 transition-colors"
          >
            <Icon className="w-5 h-5 text-[#8B7355]" />
            <span className="font-medium">{preset.name}</span>
          </button>
        );
      })}
    </div>
  );
};
