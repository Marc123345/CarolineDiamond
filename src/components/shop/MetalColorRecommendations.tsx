import React from 'react';
import { Sparkles } from 'lucide-react';

interface MetalColorRecommendationsProps {
  userPreferences?: string[];
  onRecommendationSelect: (color: string) => void;
}

export const MetalColorRecommendations: React.FC<MetalColorRecommendationsProps> = ({
  userPreferences = [],
  onRecommendationSelect
}) => {
  const recommendations = [
    { color: 'white-gold', label: 'White Gold', description: 'Classic and versatile' },
    { color: 'yellow-gold', label: 'Yellow Gold', description: 'Timeless elegance' },
    { color: 'rose-gold', label: 'Rose Gold', description: 'Romantic and modern' }
  ];

  const filteredRecommendations = recommendations.filter(
    rec => !userPreferences.includes(rec.color)
  );

  if (filteredRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#8B7355]" />
        <h3 className="font-medium text-sm">Recommended for You</h3>
      </div>
      <div className="space-y-2">
        {filteredRecommendations.map((rec) => (
          <button
            key={rec.color}
            onClick={() => onRecommendationSelect(rec.color)}
            className="w-full text-left p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="font-medium text-sm capitalize">{rec.label}</div>
            <div className="text-xs text-gray-600 mt-0.5">{rec.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
