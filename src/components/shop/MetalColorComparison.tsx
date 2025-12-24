import React, { useState, useEffect } from 'react';
import { Info, Eye, Heart, TrendingUp, X } from 'lucide-react';
import { MetalColor } from '../../config/filterConfig';
import { getMetalColorDisplayInfo } from '../../utils/metalColorUtils';
import { trackEducationView } from '../../lib/metalColorDb';
import { useAuth } from '../../context/AuthContext';

interface MetalColorComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColors?: MetalColor[];
  onColorSelect?: (color: MetalColor) => void;
}

export const MetalColorComparison: React.FC<MetalColorComparisonProps> = ({
  isOpen,
  onClose,
  selectedColors = [],
  onColorSelect,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'comparison' | 'guide' | 'care'>('comparison');

  useEffect(() => {
    if (isOpen && user) {
      trackEducationView('White Gold', 'comparison', user.id);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const metalColors: MetalColor[] = ['White Gold', 'Yellow Gold', 'Rose Gold'];

  const comparisonData = {
    'White Gold': {
      pros: [
        'Classic and timeless appearance',
        'Complements all skin tones',
        'Perfect for diamonds and white stones',
        'Professional and versatile',
      ],
      cons: [
        'Requires periodic rhodium plating',
        'May show scratches more easily',
        'Can appear cooler in tone',
      ],
      bestFor: 'Engagement rings, professional wear, modern aesthetics',
      maintenance: 'Re-plating every 1-2 years recommended',
      durability: '9/10',
      popularity: '45%',
    },
    'Yellow Gold': {
      pros: [
        'Traditional and luxurious',
        'Naturally warm and rich color',
        'No plating required',
        'Shows fewer scratches',
      ],
      cons: [
        'May not suit all skin tones',
        'Can appear vintage or traditional',
        'Less popular for engagement rings',
      ],
      bestFor: 'Wedding bands, vintage styles, warm-toned jewelry',
      maintenance: 'Minimal - periodic polishing only',
      durability: '8/10',
      popularity: '30%',
    },
    'Rose Gold': {
      pros: [
        'Romantic and unique appearance',
        'Complements warm skin tones beautifully',
        'Trending and modern',
        'Durable copper alloy',
      ],
      cons: [
        'May not match all jewelry',
        'Color can vary by karat',
        'Less traditional for some',
      ],
      bestFor: 'Fashion jewelry, modern engagement rings, mixed metal looks',
      maintenance: 'Very low - natural patina develops',
      durability: '9/10',
      popularity: '25%',
    },
  };

  const careGuide = {
    'White Gold': [
      'Clean with mild soap and warm water',
      'Avoid harsh chemicals and chlorine',
      'Remove during physical activities',
      'Professional rhodium plating every 1-2 years',
      'Store separately to prevent scratches',
    ],
    'Yellow Gold': [
      'Clean with jewelry cleaner or mild soap',
      'Polish regularly to maintain shine',
      'Avoid exposure to harsh chemicals',
      'Can be worn daily with minimal care',
      'Professional cleaning annually',
    ],
    'Rose Gold': [
      'Very low maintenance metal',
      'Clean with soft cloth and warm water',
      'Natural darkening adds character',
      'Avoid harsh abrasives',
      'Can be worn 24/7',
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-Color-Champagne-Gold to-Color-Light-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                18K Gold Metal Color Guide
              </h2>
              <p className="text-white/90 text-sm">
                Compare and learn about our three exquisite metal options
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close comparison"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-Color-Light-300">
          <div className="flex gap-1 p-2">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'comparison'
                  ? 'bg-Color-Netural-Black text-white shadow-lg'
                  : 'text-Color-Gray-700 hover:bg-Color-Primary-Beige/20'
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'guide'
                  ? 'bg-Color-Netural-Black text-white shadow-lg'
                  : 'text-Color-Gray-700 hover:bg-Color-Primary-Beige/20'
              }`}
            >
              Buying Guide
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'care'
                  ? 'bg-Color-Netural-Black text-white shadow-lg'
                  : 'text-Color-Gray-700 hover:bg-Color-Primary-Beige/20'
              }`}
            >
              Care Instructions
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'comparison' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metalColors.map(color => {
                const info = getMetalColorDisplayInfo(color);
                const data = comparisonData[color];
                const isSelected = selectedColors.includes(color);

                return (
                  <div
                    key={color}
                    className={`border-2 rounded-xl p-5 transition-all duration-300 ${
                      isSelected
                        ? 'border-Color-Champagne-Gold bg-Color-Primary-Beige/20 shadow-lg'
                        : 'border-Color-Light-300 hover:border-Color-Champagne-Gold/50 hover:shadow-md'
                    }`}
                  >
                    {/* Color Swatch */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                        style={{ backgroundColor: info.hexColor }}
                      />
                      <div className="text-right">
                        <div className="text-xs text-Color-Gray-700 mb-1">Popularity</div>
                        <div className="text-lg font-bold text-Color-Champagne-Gold">
                          {data.popularity}
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-Color-Netural-Black mb-2">
                      {info.name}
                    </h3>
                    <p className="text-sm text-Color-Gray-700 mb-4">{info.description}</p>

                    {/* Durability */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-Color-Gray-700">Durability</span>
                        <span className="font-semibold">{data.durability}</span>
                      </div>
                      <div className="w-full bg-Color-Light-300 rounded-full h-2">
                        <div
                          className="bg-Color-Champagne-Gold rounded-full h-2 transition-all duration-500"
                          style={{ width: `${parseInt(data.durability) * 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Pros */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-Color-Netural-Black mb-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Advantages
                      </h4>
                      <ul className="space-y-1">
                        {data.pros.map((pro, i) => (
                          <li key={i} className="text-xs text-Color-Gray-700 flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Best For */}
                    <div className="mb-4 p-3 bg-Color-Primary-Beige/30 rounded-lg">
                      <h4 className="text-xs font-semibold text-Color-Netural-Black mb-1 flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        Best For
                      </h4>
                      <p className="text-xs text-Color-Gray-700">{data.bestFor}</p>
                    </div>

                    {/* Select Button */}
                    {onColorSelect && (
                      <button
                        onClick={() => onColorSelect(color)}
                        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                          isSelected
                            ? 'bg-Color-Champagne-Gold text-white shadow-lg'
                            : 'bg-Color-Netural-Black text-white hover:bg-Color-Champagne-Gold'
                        }`}
                      >
                        {isSelected ? 'Selected ✓' : `Select ${color}`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-xl font-bold text-Color-Netural-Black mb-4">
                How to Choose Your Perfect Metal
              </h3>

              <div className="space-y-6">
                <div className="bg-Color-Primary-Beige/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-Color-Netural-Black mb-2 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-Color-Champagne-Gold" />
                    Consider Your Skin Tone
                  </h4>
                  <ul className="space-y-2 text-sm text-Color-Gray-700">
                    <li>
                      <strong>Cool skin tones:</strong> White Gold and Rose Gold complement pink or blue
                      undertones beautifully
                    </li>
                    <li>
                      <strong>Warm skin tones:</strong> Yellow Gold and Rose Gold enhance golden or peachy
                      undertones
                    </li>
                    <li>
                      <strong>Neutral skin tones:</strong> Lucky you! All three metals will look stunning
                    </li>
                  </ul>
                </div>

                <div className="bg-Color-Primary-Beige/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-Color-Netural-Black mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5 text-Color-Champagne-Gold" />
                    Lifestyle Considerations
                  </h4>
                  <ul className="space-y-2 text-sm text-Color-Gray-700">
                    <li>
                      <strong>Active lifestyle:</strong> Rose Gold is most durable, Yellow Gold shows fewer
                      scratches
                    </li>
                    <li>
                      <strong>Professional setting:</strong> White Gold is most versatile and traditional
                    </li>
                    <li>
                      <strong>Low maintenance:</strong> Yellow and Rose Gold require less upkeep than White
                      Gold
                    </li>
                  </ul>
                </div>

                <div className="bg-Color-Primary-Beige/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-Color-Netural-Black mb-2">Mixing Metals</h4>
                  <p className="text-sm text-Color-Gray-700 mb-2">
                    Modern jewelry trends embrace mixing metals! Consider:
                  </p>
                  <ul className="space-y-1 text-sm text-Color-Gray-700">
                    <li>• White Gold engagement ring with Rose Gold wedding band</li>
                    <li>• Yellow Gold chain with White Gold pendant</li>
                    <li>• Stacking rings in different metals for visual interest</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-6">
              {metalColors.map(color => {
                const info = getMetalColorDisplayInfo(color);
                const care = careGuide[color];

                return (
                  <div key={color} className="border border-Color-Light-300 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: info.hexColor }}
                      />
                      <div>
                        <h3 className="text-lg font-bold text-Color-Netural-Black">
                          {info.name}
                        </h3>
                        <p className="text-sm text-Color-Gray-700">Care & Maintenance</p>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {care.map((instruction, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-Color-Gray-700"
                        >
                          <span className="text-Color-Champagne-Gold mt-0.5">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-Color-Light-300 p-4 bg-Color-Primary-Beige/10">
          <p className="text-xs text-Color-Gray-700 text-center">
            All our jewelry is crafted with authentic 18K gold. Need help choosing? Contact our experts!
          </p>
        </div>
      </div>
    </div>
  );
};
