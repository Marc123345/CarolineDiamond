import React from 'react';
import { Search, Trash2 } from 'lucide-react';

interface SavedSearch {
  id: string;
  name: string;
  query: string;
}

interface SavedSearchesPanelProps {
  onSearchSelect: (query: string) => void;
}

export const SavedSearchesPanel: React.FC<SavedSearchesPanelProps> = ({
  onSearchSelect
}) => {
  const [savedSearches] = React.useState<SavedSearch[]>([]);

  if (savedSearches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No saved searches yet</p>
        <p className="text-xs mt-1">Save your favorite searches for quick access</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {savedSearches.map((search) => (
        <div
          key={search.id}
          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#8B7355] transition-colors"
        >
          <button
            onClick={() => onSearchSelect(search.query)}
            className="flex-1 text-left"
          >
            <div className="font-medium text-sm">{search.name}</div>
            <div className="text-xs text-gray-500">{search.query}</div>
          </button>
          <button
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete search"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
