import React, { useEffect, useState } from 'react';
import { X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from './SearchBar'; // Adjusted path
import { supabase } from '../../lib/supabase'; // Adjusted path
import { useAuth } from '../../context/AuthContext'; // Adjusted path

interface Product {
  tags?: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  products?: Product[];
}

const DEFAULT_POPULAR_SEARCHES = [
  'Engagement rings',
  'Diamond earrings',
  'Diamond necklaces',
  'Solitaire rings',
  'Halo rings',
  'Lab-grown diamonds',
  'Rose gold',
  'White gold',
  'Round diamond'
];

const generatePopularSearches = (products?: Product[]): string[] => {
  if (!products || products.length === 0) return DEFAULT_POPULAR_SEARCHES;

  const tagCounts: Record<string, number> = {};
  products.forEach(product => {
    if (product.tags) {
      product.tags.forEach((tag: string) => {
        const lowerTag = tag.toLowerCase();
        const keywords = ['ring', 'earring', 'necklace', 'solitaire', 'halo', 'diamond', 'gold'];
        if (keywords.some(k => lowerTag.includes(k))) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      });
    }
  });

  const topSearches = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 9)
    .map(([tag]) => tag);

  return topSearches.length > 0 ? topSearches : DEFAULT_POPULAR_SEARCHES;
};

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  placeholder = "Search for jewelry, rings, diamonds...",
  products
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>(DEFAULT_POPULAR_SEARCHES);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('recent_searches');
      if (stored) setRecentSearches(JSON.parse(stored));
      if (products) setPopularSearches(generatePopularSearches(products));
    }
  }, [isOpen, products]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const saveRecentSearch = async (query: string) => {
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
    setRecentSearches(updated);

    if (supabase && user?.id) {
       try {
        await (supabase as any).from('search_history').insert({
          user_id: user.id,
          search_query: query,
          searched_at: new Date().toISOString()
        });
       } catch (e) { /* silent error */ }
    }
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
      onSearch(query);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex flex-col">
        {/* Dim background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white shadow-2xl border-b border-gray-200 p-4 sm:p-8"
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1">
                <SearchBar
                  onSearch={handleSearchSubmit}
                  placeholder={placeholder}
                />
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all"
                aria-label="Close"
              >
                <X className="h-6 w-6 text-gray-900" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                        <button
                        key={index}
                        onClick={() => handleSearchSubmit(search)}
                        className="px-4 py-2 bg-gray-50 text-gray-900 rounded-lg text-sm hover:bg-black hover:text-white transition-all border border-gray-100"
                        >
                        {search}
                        </button>
                    ))}
                    </div>
                </div>
                )}

                {/* Popular Searches */}
                <div>
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Popular</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                    <button
                        key={index}
                        onClick={() => handleSearchSubmit(search)}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm hover:border-black hover:bg-black hover:text-white transition-all"
                    >
                        {search}
                    </button>
                    ))}
                </div>
                </div>
            </div>

            <div className="text-[10px] text-gray-400 text-center mt-10 uppercase tracking-tighter">
              Press ESC to close search
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};