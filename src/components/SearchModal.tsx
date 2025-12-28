import React, { useEffect, useState, useMemo } from 'react';
import { X, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from './SearchBar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Product {
  tags?: string[];
  productType?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  products?: Product[];
}

// Default popular searches aligned with your CSV "Type" and "Tags" columns
const DEFAULT_POPULAR_SEARCHES = [
  'Engagement Rings',
  'Diamond Earrings',
  'Diamond Necklaces',
  'Solitaire',
  'Halo',
  'Lab-Grown Diamonds',
  '18K Yellow Gold',
  '18K White Gold',
  'Pear Diamond'
];

/**
 * Generates relevant search terms based on actual CSV data structure
 */
const generatePopularSearches = (products?: Product[]): string[] => {
  if (!products || products.length === 0) return DEFAULT_POPULAR_SEARCHES;

  const suggestions = new Set<string>();
  
  // 1. Prioritize CSV "Type" values (Engagement Ring, Necklace, etc.)
  const types = Array.from(new Set(products.map(p => p.productType).filter(Boolean)));
  types.slice(0, 3).forEach(t => suggestions.add(t!));

  // 2. Scan for high-value hyphenated tags from your CSV
  const highValuePatterns = ['lab-grown', 'with-side-diamonds', 'gold', 'diamond'];
  const tags = products.flatMap(p => p.tags || []);
  
  const relevantTags = tags.filter(tag => 
    highValuePatterns.some(pattern => tag.toLowerCase().includes(pattern))
  );

  // Count occurrences
  const tagCounts: Record<string, number> = {};
  relevantTags.forEach(tag => {
    // Normalize hyphenated tags for UI (e.g., "lab-grown" -> "Lab-Grown")
    const displayTag = tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    tagCounts[displayTag] = (tagCounts[displayTag] || 0) + 1;
  });

  // Add top 6 most frequent tags
  Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .forEach(([tag]) => suggestions.add(tag));

  return suggestions.size >= 4 ? Array.from(suggestions) : DEFAULT_POPULAR_SEARCHES;
};

const getRecentSearches = (): string[] => {
  try {
    const stored = localStorage.getItem('recent_searches');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  placeholder = "Search for jewelry, rings, diamonds...",
  products
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { user } = useAuth();

  // Memoize popular searches based on product catalog
  const popularSearches = useMemo(() => generatePopularSearches(products), [products]);

  useEffect(() => {
    if (isOpen) setRecentSearches(getRecentSearches());
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSearchSubmit = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // Save to LocalStorage
    const recent = getRecentSearches();
    const updated = [trimmed, ...recent.filter(q => q !== trimmed)].slice(0, 5);
    localStorage.setItem('recent_searches', JSON.stringify(updated));

    // Save to Supabase if logged in
    if (user?.id && supabase) {
      await supabase.from('search_history').insert({
        user_id: user.id,
        search_query: trimmed,
        searched_at: new Date().toISOString()
      }).catch(() => {});
    }

    onSearch(trimmed);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex flex-col items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative w-full max-w-3xl mt-20 px-4"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1">
                  <SearchBar
                    onSearch={handleSearchSubmit}
                    placeholder={placeholder}
                    autoFocus
                  />
                </div>
                <button
                  onClick={onClose}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Suggestions Grid */}
              <div className="grid sm:grid-cols-2 gap-8">
                
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest">Recent</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      {recentSearches.map((s, i) => (
                        <button
                          key={`recent-${i}`}
                          onClick={() => onSearch(s)}
                          className="text-left text-sm font-bold text-gray-700 hover:text-Color-Champagne-Gold transition-colors py-1"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-4 text-Color-Champagne-Gold">
                    <TrendingUp className="h-4 w-4" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Trending Now</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((s, i) => (
                      <button
                        key={`pop-${i}`}
                        onClick={() => onSearch(s)}
                        className="px-4 py-2 bg-gray-50 hover:bg-Color-Netural-Black hover:text-white rounded-full text-xs font-bold transition-all duration-300"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Tips Footer */}
            <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex items-center justify-center gap-2">
               <Sparkles className="h-3 w-3 text-Color-Champagne-Gold" />
               <p className="text-[10px] text-gray-400 font-medium italic">
                 Try searching for shapes like "Pear" or materials like "18K Gold"
               </p>
            </div>
          </div>
          
          <p className="text-center text-white/40 text-[10px] mt-6 font-bold tracking-widest">
            PRESS ESC TO CLOSE
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};