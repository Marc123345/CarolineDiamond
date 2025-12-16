import React, { useEffect, useState } from 'react';
import { X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from './SearchBar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  products?: any[]; // Optional: for dynamic popular searches
}

// Default popular searches based on actual product catalog
// These are the most relevant categories and attributes that exist in the store
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

// Generate dynamic popular searches from product catalog
const generatePopularSearches = (products?: any[]): string[] => {
  if (!products || products.length === 0) {
    return DEFAULT_POPULAR_SEARCHES;
  }

  const tagCounts: Record<string, number> = {};
  const relevantCategories = new Set<string>();

  products.forEach(product => {
    // Collect relevant categories
    if (product.tags) {
      product.tags.forEach((tag: string) => {
        const lowerTag = tag.toLowerCase();
        // Only include tags that are categories, styles, or attributes users search for
        if (
          lowerTag.includes('ring') ||
          lowerTag.includes('earring') ||
          lowerTag.includes('necklace') ||
          lowerTag.includes('solitaire') ||
          lowerTag.includes('halo') ||
          lowerTag.includes('diamond') ||
          lowerTag.includes('gold')
        ) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          relevantCategories.add(tag);
        }
      });
    }
  });

  // Sort by frequency and take top searches
  const topSearches = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 9)
    .map(([tag]) => tag);

  // Ensure we have a good mix of categories
  const finalSearches = new Set<string>();

  // Prioritize main categories
  if (topSearches.some(s => s.toLowerCase().includes('engagement'))) {
    finalSearches.add('Engagement rings');
  }
  topSearches.forEach(tag => {
    if (tag.toLowerCase().includes('earring')) finalSearches.add('Diamond earrings');
    if (tag.toLowerCase().includes('necklace')) finalSearches.add('Diamond necklaces');
    if (tag.toLowerCase().includes('solitaire')) finalSearches.add('Solitaire rings');
    if (tag.toLowerCase().includes('halo')) finalSearches.add('Halo rings');
  });

  // Add remaining top tags
  topSearches.forEach(tag => {
    if (finalSearches.size < 9) {
      finalSearches.add(tag);
    }
  });

  return finalSearches.size > 0
    ? Array.from(finalSearches)
    : DEFAULT_POPULAR_SEARCHES;
};

const getRecentSearches = (): string[] => {
  try {
    const stored = localStorage.getItem('recent_searches');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveRecentSearch = async (query: string, userId?: string) => {
  try {
    const recent = getRecentSearches();
    const updated = [query, ...recent.filter(q => q !== query)].slice(0, 5);
    localStorage.setItem('recent_searches', JSON.stringify(updated));

    if (supabase && userId) {
      await supabase
        .from('search_history')
        .insert({
          user_id: userId,
          search_query: query,
          searched_at: new Date().toISOString()
        })
        .catch(err => console.error('Failed to save search history:', err));
    }
  } catch {
    // Ignore storage errors
  }
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
      setRecentSearches(getRecentSearches());
      // Generate dynamic popular searches if products are available
      if (products && products.length > 0) {
        setPopularSearches(generatePopularSearches(products));
      }
    }
  }, [isOpen, products]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      saveRecentSearch(query.trim(), user?.id);
      onSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    saveRecentSearch(suggestion, user?.id);
    onSearch(suggestion);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[110]"
        style={{
          top: 'env(safe-area-inset-top)',
          bottom: 'env(safe-area-inset-bottom)',
          left: 'env(safe-area-inset-left)',
          right: 'env(safe-area-inset-right)'
        }}
      >
        {/* Dim background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute top-0 left-0 right-0 bg-surface shadow-2xl border-b border-gray-200 p-4 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <SearchBar
                  onSearch={handleSearchSubmit}
                  placeholder={placeholder}
                />
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 transition-all duration-300 rounded-lg active:scale-90 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close search"
              >
                <X className="h-6 w-6 text-gray-900" />
              </button>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700">Recent Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="px-4 py-2 bg-Color-Primary-Beige/30 text-Color-Netural-Black rounded-full text-sm hover:bg-Color-Champagne-Gold hover:text-white transition-all duration-200"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">Popular Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="px-4 py-2 bg-white border border-Color-Champagne-Gold/30 text-Color-Netural-Black rounded-full text-sm hover:bg-Color-Netural-Black hover:text-white transition-all duration-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center mt-6">
              Press ESC to close
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
