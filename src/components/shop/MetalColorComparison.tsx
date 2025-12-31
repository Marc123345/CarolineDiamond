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
      trackEducationView('General', 'comparison_modal', user.id);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const metalColors: MetalColor[] = ['White Gold', 'Yellow Gold', 'Rose Gold'];

  const comparisonData: Record<string, any> = {
    'White Gold': {
      pros: ['Classic appearance', 'Complements all skin tones', 'Best for white diamonds'],
      cons: ['Requires rhodium re-plating', 'Cooler tone'],
      bestFor: 'Engagement rings, modern aesthetics',
      durability: '9/10',
      popularity: '45%',
    },
    'Yellow Gold': {
      pros: ['Traditional & luxurious', 'No plating required', 'Shows fewer scratches'],
      cons: ['May clash with some skin tones', 'Can look vintage'],
      bestFor: 'Wedding bands, warm-toned jewelry',
      durability: '8/10',
      popularity: '30%',
    },
    'Rose Gold': {
      pros: ['Romantic & unique', 'Most durable gold alloy', 'Trending and modern'],
      cons: ['Does not match all accessories', 'Less traditional'],
      bestFor: 'Fashion jewelry, mixed metal looks',
      durability: '9.5/10',
      popularity: '25%',
    },
  };

  const careGuide: Record<string, string[]> = {
    'White Gold': ['Mild soap and warm water', 'Rhodium plating every 1-2 years', 'Avoid chlorine'],
    'Yellow Gold': ['Regular polishing', 'Annual professional cleaning', 'Daily wear friendly'],
    'Rose Gold': ['Very low maintenance', 'Soft cloth cleaning', 'Develops natural patina'],
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="bg-Color-Netural-Black p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif">18K Gold Metal Guide</h2>
              <p className="text-gray-400 text-sm">Find the perfect foundation for your jewelry</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100 flex p-2 bg-gray-50 shrink-0">
          {(['comparison', 'guide', 'care'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all capitalize ${
                activeTab === tab ? 'bg-white text-Color-Netural-Black shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'comparison' ? 'Side-by-Side' : `${tab} guide`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'comparison' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metalColors.map(color => {
                const info = getMetalColorDisplayInfo(color);
                const data = comparisonData[color];
                const isSelected = selectedColors.includes(color);

                return (
                  <div key={color} className={`border rounded-xl p-5 transition-all ${isSelected ? 'border-Color-Champagne-Gold ring-1 ring-Color-Champagne-Gold' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: info.hexColor }} />
                      <div className="text-right"><div className="text-[10px] text-gray-400 uppercase">Popularity</div><div className="font-bold text-Color-Champagne-Gold">{data.popularity}</div></div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{info.name}</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1"><span>Durability</span><span className="font-medium">{data.durability}</span></div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-Color-Champagne-Gold" style={{ width: data.durability.replace('/10', '0%') }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-gray-400">Pros</h4>
                            <ul className="space-y-1">{data.pros.map((p: string) => <li key={p} className="text-xs text-gray-600 flex gap-2"><span className="text-green-500">✓</span>{p}</li>)}</ul>
                        </div>
                        <div className="bg-gray-50 p-3 rounded text-xs text-gray-600"><strong>Best For:</strong><br/>{data.bestFor}</div>
                    </div>

                    {onColorSelect && (
                      <button
                        onClick={() => onColorSelect(color)}
                        className={`w-full mt-6 py-2 rounded text-xs font-bold transition-all ${isSelected ? 'bg-Color-Champagne-Gold text-white' : 'bg-gray-900 text-white hover:bg-black'}`}
                      >
                        {isSelected ? 'Selected' : `Choose ${color}`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="max-w-3xl mx-auto space-y-8">
              <section>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Eye className="h-5 w-5 text-Color-Champagne-Gold"/> Skin Tone Matching</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-lg">
                        <h4 className="font-bold text-sm mb-2">Cool Skin Tones</h4>
                        <p className="text-sm text-gray-600">Look best with White Gold and Rose Gold. Cool tones typically have blue or pink veins.</p>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-lg">
                        <h4 className="font-bold text-sm mb-2">Warm Skin Tones</h4>
                        <p className="text-sm text-gray-600">Complemented beautifully by Yellow Gold and Rose Gold. Warm tones typically have greenish veins.</p>
                    </div>
                </div>
              </section>
              <section className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-2">Did you know?</h3>
                <p className="text-sm text-gray-600">All of our jewelry uses 18K gold. This is the perfect balance of purity (75% gold) and strength, ensuring your piece lasts a lifetime while maintaining a rich, authentic color.</p>
              </section>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metalColors.map(color => (
                    <div key={color} className="p-5 bg-gray-50 rounded-xl">
                        <h4 className="font-bold mb-4 border-b border-gray-200 pb-2">{color} Care</h4>
                        <ul className="space-y-3">
                            {careGuide[color].map(item => (
                                <li key={item} className="text-sm text-gray-600 flex gap-2"><div className="w-1.5 h-1.5 bg-Color-Champagne-Gold rounded-full mt-1.5 shrink-0" />{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center shrink-0">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Expert consultation available in Antwerp</p>
        </div>
      </div>
    </div>
  );
};