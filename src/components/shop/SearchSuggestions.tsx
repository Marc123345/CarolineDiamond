import React, { useMemo, useState, useEffect } from 'react';
import { Search, TrendingUp, Clock } from 'lucide-react';
import { ProcessedProduct } from '../../types'; // Adjusted path
import { fuzzySearch } from '../../utils/uiHelpers'; // Adjusted path

interface SearchSuggestionsProps {
  searchTerm: string;
  products: ProcessedProduct[];
  onSuggestionClick: (suggestion: string) => void;
  recentSearches?: string[];
  maxSuggestions?: number;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  searchTerm,
  products,
  onSuggestionClick,
  recentSearches = [],
  maxSuggestions = 8,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  const highlightMatches = (text: string, search: string): Array<{ text: string; match: boolean }> => {
    const lowerText = text.toLowerCase();
    const lowerSearch = search.toLowerCase();
    const index = lowerText.indexOf(lowerSearch);

    if (index === -1) {
      return [{ text, match: false }];
    }

    return [
      { text: text.substring(0, index), match: false },
      { text: text.substring(index, index + search.length), match: true },
      { text: text.substring(index + search.length), match: false },
    ].filter(part => part.text.length > 0);
  };

  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) {
      return recentSearches.slice(0, maxSuggestions).map(term => ({
        text: term,
        type: 'recent' as const,
        matches: [],
      }));
    }

    const productMatches = new Set<string>();
    const tagMatches = new Set<string>();
    const categoryMatches = new Set<string>();

    products.forEach(product => {
      // Product Name Match
      if (productMatches.size < maxSuggestions) {
        if (fuzzySearch(searchTerm, product.name, 0.5)) {
          productMatches.add(product.name);
        }
      }

      // Tag Match
      product.tags?.forEach(tag => {
        if (tagMatches.size < maxSuggestions) {
          if (fuzzySearch(searchTerm, tag, 0.6)) {
            tagMatches.add(tag);
          }
        }
      });

      // Category Match
      if (product.category && categoryMatches.size < maxSuggestions) {
        if (fuzzySearch(searchTerm, product.category, 0.6)) {
          categoryMatches.add(product.category);
        }
      }
    });

    const allSuggestions = [
      ...Array.from(productMatches).map(text => ({
        text,
        type: 'product' as const,
        matches: highlightMatches(text, searchTerm),
      })),
      ...Array.from(tagMatches).map(text => ({
        text,
        type: 'tag' as const,
        matches: highlightMatches(text, searchTerm),
      })),
      ...Array.from(categoryMatches).map(text => ({
        text,
        type: 'category' as const,
        matches: highlightMatches(text, searchTerm),
      })),
    ];

    return allSuggestions.slice(0, maxSuggestions);
  }, [searchTerm, products, recentSearches, maxSuggestions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHoveredIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHoveredIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter' && hoveredIndex >= 0) {
        e.preventDefault();
        onSuggestionClick(suggestions[hoveredIndex].text);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredIndex, suggestions, onSuggestionClick]);

  if (suggestions.length === 0) {
    return null;
  }

  const getIcon = (type: 'product' | 'tag' | 'category' | 'recent') => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'product':
        return <Search className="h-4 w-4 text-Color-Champagne-Gold" />;
      case 'tag':
      case 'category':
        return <TrendingUp className="h-4 w-4 text-Color-Light-300" />;
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-Color-Champagne-Gold/30 rounded-lg shadow-xl max-h-80 overflow-y-auto z-50 animate-fadeIn">
      {suggestions.map((suggestion, index) => (
        <button
          key={`${suggestion.type}-${suggestion.text}`}
          onClick={() => onSuggestionClick(suggestion.text)}
          onMouseEnter={() => setHoveredIndex(index)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${
            hoveredIndex === index
              ? 'bg-Color-Primary-Beige/30'
              : 'hover:bg-Color-Primary-Beige/20'
          } ${index === 0 ? 'rounded-t-lg' : ''} ${
            index === suggestions.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-100'
          }`}
        >
          {getIcon(suggestion.type)}

          <div className="flex-1">
            {suggestion.matches.length > 0 ? (
              <span className="text-sm text-Color-Netural-Black">
                {suggestion.matches.map((part, i) => (
                  <span
                    key={i}
                    className={part.match ? 'font-bold text-Color-Champagne-Gold' : ''}
                  >
                    {part.text}
                  </span>
                ))}
              </span>
            ) : (
              <span className="text-sm text-Color-Netural-Black">{suggestion.text}</span>
            )}
          </div>

          <span className="text-xs text-gray-400 capitalize bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            {suggestion.type}
          </span>
        </button>
      ))}
    </div>
  );
};