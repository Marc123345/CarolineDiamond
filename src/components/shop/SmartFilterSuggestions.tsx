import React, { useMemo } from 'react';
import { Lightbulb, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { ProductFilters } from '../../config/filterConfig';
import { ProcessedProduct } from '../../types'; // Fixed import
import {
  generateSmartSuggestions,
  detectFilterConflicts,
  recommendComplementaryFilters,
  calculateFilterSpecificity,
  FilterSuggestion,
} from '../../utils/filterOptimizer'; // Fixed import path

interface SmartFilterSuggestionsProps {
  currentFilters: ProductFilters;
  allProducts: ProcessedProduct[];
  currentResultCount: number;
  onApplySuggestion: (filterKey: keyof ProductFilters, filterValue: any) => void;
}

export const SmartFilterSuggestions: React.FC<SmartFilterSuggestionsProps> = ({
  currentFilters,
  allProducts,
  currentResultCount,
  onApplySuggestion,
}) => {
  const suggestions = useMemo(
    () => generateSmartSuggestions(currentFilters, allProducts, currentResultCount),
    [currentFilters, allProducts, currentResultCount]
  );

  const conflicts = useMemo(
    () => detectFilterConflicts(currentFilters, allProducts),
    [currentFilters, allProducts]
  );

  const complementaryFilters = useMemo(
    () => recommendComplementaryFilters(currentFilters, allProducts),
    [currentFilters, allProducts]
  );

  const specificity = useMemo(
    () => calculateFilterSpecificity(currentFilters),
    [currentFilters]
  );

  if (
    suggestions.length === 0 &&
    conflicts.length === 0 &&
    complementaryFilters.length === 0
  ) {
    return null;
  }

  const getActionIcon = (type: 'add' | 'remove' | 'replace') => {
    switch (type) {
      case 'add':
        return <Sparkles className="h-4 w-4" />;
      case 'remove':
        return <AlertCircle className="h-4 w-4" />;
      case 'replace':
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getActionColor = (type: 'add' | 'remove' | 'replace') => {
    switch (type) {
      case 'add':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'remove':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'replace':
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getSpecificityLevel = () => {
    if (specificity < 30) return { label: 'Broad', color: 'text-blue-600' };
    if (specificity < 60) return { label: 'Moderate', color: 'text-green-600' };
    return { label: 'Very Specific', color: 'text-orange-600' };
  };

  const specificityLevel = getSpecificityLevel();

  return (
    <div className="space-y-4 mb-6">
      {/* Filter Specificity Indicator */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter Specificity:</span>
          <span className={`text-sm font-semibold ${specificityLevel.color}`}>
            {specificityLevel.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                specificity < 30
                  ? 'bg-blue-500'
                  : specificity < 60
                  ? 'bg-green-500'
                  : 'bg-orange-500'
              }`}
              style={{ width: `${specificity}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">{specificity}%</span>
        </div>
      </div>

      {/* Conflicts Warning */}
      {conflicts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>Filter Conflicts Detected</span>
          </div>
          {conflicts.map((conflict, index) => (
            <div
              key={index}
              className="p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm font-medium text-red-900">{conflict.conflict}</p>
              <p className="text-xs text-red-700 mt-1">{conflict.suggestion}</p>
            </div>
          ))}
        </div>
      )}

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Sparkles className="h-4 w-4" />
            <span>Smart Suggestions</span>
          </div>
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <SuggestionCard
              key={index}
              suggestion={suggestion}
              onApply={() =>
                onApplySuggestion(suggestion.filterKey, suggestion.filterValue)
              }
              getActionIcon={getActionIcon}
              getActionColor={getActionColor}
            />
          ))}
        </div>
      )}

      {/* Complementary Filters (Only show if we have enough results) */}
      {complementaryFilters.length > 0 && currentResultCount > 5 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <TrendingUp className="h-4 w-4" />
            <span>You Might Also Like</span>
          </div>
          {complementaryFilters.slice(0, 2).map((rec, index) => (
            <button
              key={index}
              onClick={() => onApplySuggestion(rec.filterKey, rec.filterValue)}
              className="w-full p-3 text-left bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors group"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-purple-900">
                  Add {rec.filterKey}: <span className="font-bold">{formatFilterValue(rec.filterValue)}</span>
                </p>
                <Sparkles className="h-3 w-3 text-purple-400 group-hover:text-purple-600" />
              </div>
              <p className="text-xs text-purple-700 mt-1">{rec.reason}</p>
            </button>
          ))}
        </div>
      )}

      {/* Zero Results Helper */}
      {currentResultCount === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">
                No products match your filters
              </p>
              <p className="text-xs text-yellow-800 mt-1">
                Try removing some filters or adjusting your criteria.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SuggestionCardProps {
  suggestion: FilterSuggestion;
  onApply: () => void;
  getActionIcon: (type: 'add' | 'remove' | 'replace') => React.ReactNode;
  getActionColor: (type: 'add' | 'remove' | 'replace') => string;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onApply,
  getActionIcon,
  getActionColor,
}) => {
  const actionText = {
    add: 'Add',
    remove: 'Remove',
    replace: 'Change',
  }[suggestion.type];

  return (
    <div
      className={`p-3 border rounded-lg ${getActionColor(suggestion.type)} transition-all hover:shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getActionIcon(suggestion.type)}
            <span className="text-sm font-semibold">
              {actionText} {suggestion.filterKey}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 bg-white/80 rounded-sm">
              {Math.round(suggestion.confidence * 100)}% match
            </span>
          </div>
          <p className="text-xs mb-2 opacity-90">{suggestion.reason}</p>
          <div className="flex items-center gap-2 text-xs font-medium opacity-80">
             <span>Expected results: ~{suggestion.expectedResultCount}</span>
          </div>
        </div>
        <button
          onClick={onApply}
          className="px-3 py-1.5 text-xs font-bold bg-white border border-current rounded shadow-sm hover:bg-opacity-90 transition-colors whitespace-nowrap"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

function formatFilterValue(value: any): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object' && value !== null) {
    // Attempt to display specific keys if they exist (e.g. min/max)
    if ('min' in value || 'max' in value) return `${value.min || 0} - ${value.max || '∞'}`;
    return JSON.stringify(value);
  }
  return String(value);
}