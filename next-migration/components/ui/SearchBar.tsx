import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, TrendingUp, Filter, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  onFiltersClick?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for jewelry, rings, necklaces...",
  showFilters = false,
  onFiltersClick
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const suggestions = [
    'Solitaire Rings', 'Halo Rings', 'Round Diamond', 'Lab-Grown Diamonds'
  ];

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setIsSearching(true);
    debounceTimerRef.current = setTimeout(() => {
      onSearch(searchQuery);
      setIsSearching(false);
    }, 300);
  }, [onSearch]);

  useEffect(() => {
    debouncedSearch(query);
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, [query, debouncedSearch]);

  return (
    <div className="relative w-full">
      {/* --- MAIN INPUT CONTAINER --- */}
      <div className={`relative flex items-center transition-all duration-500 rounded-full bg-white px-5 py-2 ${
        isFocused ? 'shadow-[0_10px_40px_rgba(0,0,0,0.08)] ring-1 ring-Color-Champagne-Gold/20' : 'shadow-sm border border-black/5'
      }`}>
        {/* Animated Search Icon */}
        <div className="flex-shrink-0 mr-4">
          {isSearching ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 text-Color-Champagne-Gold" />
            </motion.div>
          ) : (
            <Search className={`h-5 w-5 transition-colors duration-300 ${isFocused ? 'text-Color-Dark-500' : 'text-Color-Gray-400'}`} />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full py-3 bg-transparent border-none focus:ring-0 text-Color-Dark-500 placeholder:text-Color-Gray-300 text-sm sm:text-base font-medium"
        />

        {/* --- ACTION BUTTONS --- */}
        <div className="flex items-center gap-1">
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery('')}
                className="p-2 text-Color-Gray-400 hover:text-Color-Dark-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
          
          {showFilters && (
            <button
              onClick={onFiltersClick}
              className="ml-2 p-2.5 bg-Color-Dark-500 text-white rounded-full hover:bg-Color-Champagne-Gold transition-all duration-300 shadow-md"
            >
              <Filter className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* --- FLOATING RESULTS PANEL --- */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 mt-4 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-black/5 rounded-2xl overflow-hidden z-[100]"
          >
            {/* Suggestions Block */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-3 h-3 text-Color-Light-300" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-Color-Gray-400">
                  {query.length > 0 ? 'Live Suggestions' : 'Trending Now'}
                </span>
              </div>

              <div className="space-y-1">
                {(query.length > 0 ? [query, ...suggestions] : suggestions).map((item, idx) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setQuery(item)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-Color-Secondary/30 group transition-all"
                  >
                    <span className="text-sm font-medium text-Color-Dark-500 group-hover:text-Color-Champagne-Gold group-hover:pl-2 transition-all">
                      {item}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-Color-Champagne-Gold" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Visual CTA Footer */}
            <div className="bg-Color-Primary-Beige/20 p-4 border-t border-black/[0.03] text-center">
              <p className="text-[10px] text-Color-Gray-400 italic">
                Press <span className="font-bold text-Color-Dark-500">Enter</span> to view full boutique results
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};