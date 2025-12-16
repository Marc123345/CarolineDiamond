import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, TrendingUp, Filter } from 'lucide-react';

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
  const [suggestions] = useState([
    'Solitaire Rings',
    'Halo Rings',
    'Round Diamond',
    'Oval Diamond',
    'Emerald Cut',
    'Cushion Cut',
    'Princess Cut',
    'Marquise Cut',
    'Pear Cut',
    'With Side Diamonds',
    'Lab-Grown Diamonds'
  ]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsSearching(true);
    debounceTimerRef.current = setTimeout(() => {
      onSearch(searchQuery);
      setIsSearching(false);
    }, 300);
  }, [onSearch]);

  useEffect(() => {
    debouncedSearch(query);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debouncedSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-full">
      <div className="relative w-full max-w-full">
        <div className="relative">
          <Search className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 transition-colors ${isSearching ? 'text-Color-Champagne-Gold animate-pulse' : 'text-Color-Gray-700'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 100)}
            placeholder={placeholder}
            className="w-full max-w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-3 sm:py-4 border-2 border-Color-Secondary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-surface/95 backdrop-blur-sm shadow-lg rounded-lg text-sm sm:text-base"
            aria-label="Search jewelry products"
          />
          <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 sm:gap-2">
            {query && (
              <button
                onClick={handleClear}
                className="p-2 hover:bg-primary-50 transition-colors duration-200 rounded min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-Color-Gray-700" />
              </button>
            )}
            {showFilters && onFiltersClick && (
              <button
                onClick={onFiltersClick}
                className="p-2 hover:bg-primary-50 transition-colors duration-200 rounded min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                aria-label="Open filters"
              >
                <Filter className="h-4 w-4 text-primary-500" />
              </button>
            )}
          </div>
        </div>

        {/* Search Suggestions */}
        {isFocused && query.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated rounded-xl sm:rounded-2xl shadow-2xl border border-Color-Champagne-Gold/30 overflow-hidden z-10 w-full max-w-full">
            <div className="p-3 sm:p-4 border-b border-Color-Champagne-Gold/30">
              <div className="flex items-center text-Color-Gray-700 typography-caption">
                <TrendingUp className="h-3 sm:h-4 w-3 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm text-Color-Champagne-Gold">Popular searches</span>
              </div>
            </div>
            <div className="max-h-48 sm:max-h-64 overflow-y-auto w-full max-w-full">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full max-w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-Color-Champagne-Gold/10 transition-colors duration-200 text-Color-Dark-500 hover:text-Color-Champagne-Gold text-sm sm:text-base break-words overflow-wrap-anywhere"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Preview */}
        {isFocused && query.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated rounded-xl sm:rounded-2xl shadow-2xl border border-Color-Champagne-Gold/30 overflow-hidden z-10 w-full max-w-full">
            <div className="p-3 sm:p-4 border-b border-Color-Champagne-Gold/30">
              <div className="flex items-center text-Color-Champagne-Gold text-sm">
                <Search className="h-3 sm:h-4 w-3 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm break-words overflow-wrap-anywhere">Results for "{query}"</span>
              </div>
            </div>
            <div className="max-h-48 sm:max-h-64 overflow-y-auto p-3 sm:p-4 w-full max-w-full">
              <div className="text-center text-Color-Gray-700 py-3 sm:py-4 text-sm">
                Press Enter to search...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};