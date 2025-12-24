import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Trash2, Search } from 'lucide-react';
import { ProductFilters } from '../../config/filterConfig';
import {
  getSavedSearches,
  createSavedSearch,
  updateSavedSearch,
  deleteSavedSearch,
  SavedSearch,
} from '../../lib/filterDb';
import { useAuth } from '../../context/AuthContext';

interface SavedSearchesPanelProps {
  currentFilters: ProductFilters;
  currentSearchQuery?: string;
  onSearchLoad: (filters: ProductFilters, searchQuery?: string) => void;
}

export const SavedSearchesPanel: React.FC<SavedSearchesPanelProps> = ({
  currentFilters,
  currentSearchQuery,
  onSearchLoad,
}) => {
  const { user } = useAuth();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');

  useEffect(() => {
    if (user) {
      loadSearches();
    }
  }, [user]);

  const loadSearches = async () => {
    if (!user) return;
    const data = await getSavedSearches(user.id);
    setSearches(data);
  };

  const handleCreateSearch = async () => {
    if (!user || !newSearchName.trim()) return;

    const created = await createSavedSearch(
      user.id,
      newSearchName.trim(),
      currentFilters,
      currentSearchQuery
    );

    if (created) {
      setSearches(prev => [created, ...prev]);
      setNewSearchName('');
      setIsCreating(false);
    }
  };

  const handleToggleNotifications = async (search: SavedSearch) => {
    const updated = await updateSavedSearch(search.id, {
      notify_on_new: !search.notify_on_new,
    });

    if (updated) {
      setSearches(prev => prev.map(s => (s.id === search.id ? updated : s)));
    }
  };

  const handleDeleteSearch = async (searchId: string) => {
    const success = await deleteSavedSearch(searchId);
    if (success) {
      setSearches(prev => prev.filter(s => s.id !== searchId));
    }
  };

  const getFilterSummary = (filters: ProductFilters): string => {
    const parts: string[] = [];

    if (filters.ringStyle) parts.push(filters.ringStyle);
    if (filters.shapes?.length) parts.push(filters.shapes.join(', '));
    if (filters.metalColors?.length) parts.push(filters.metalColors.join(', '));
    if (filters.stoneType) parts.push(filters.stoneType);

    return parts.length > 0 ? parts.join(' • ') : 'All products';
  };

  if (!user) {
    return (
      <div className="p-4 text-center text-sm text-Color-Gray-700">
        Sign in to save searches
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-Color-Netural-Black">Saved Searches</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="px-3 py-1.5 bg-Color-Netural-Black text-white text-xs rounded-lg hover:bg-Color-Champagne-Gold transition-colors"
        >
          Save Current Search
        </button>
      </div>

      {isCreating && (
        <div className="space-y-2 p-3 border border-Color-Champagne-Gold/30 rounded-lg bg-Color-Primary-Beige/10">
          <input
            type="text"
            value={newSearchName}
            onChange={e => setNewSearchName(e.target.value)}
            placeholder="Search name..."
            className="w-full px-3 py-2 border border-Color-Champagne-Gold/30 rounded-lg text-sm focus:ring-2 focus:ring-Color-Champagne-Gold focus:border-transparent"
            autoFocus
          />

          <div className="text-xs text-Color-Gray-700">
            {currentSearchQuery && <div>Query: "{currentSearchQuery}"</div>}
            <div>Filters: {getFilterSummary(currentFilters)}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateSearch}
              className="flex-1 px-3 py-2 bg-Color-Netural-Black text-white rounded-lg text-sm hover:bg-Color-Champagne-Gold transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewSearchName('');
              }}
              className="flex-1 px-3 py-2 border border-Color-Champagne-Gold/30 rounded-lg text-sm hover:bg-Color-Primary-Beige/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {searches.map(search => (
          <div
            key={search.id}
            className="p-3 border border-Color-Champagne-Gold/20 rounded-lg hover:bg-Color-Primary-Beige/10 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <button
                onClick={() => onSearchLoad(search.filters, search.search_query || undefined)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-Color-Champagne-Gold flex-shrink-0" />
                  <span className="text-sm font-medium text-Color-Netural-Black">
                    {search.name}
                  </span>
                </div>

                {search.search_query && (
                  <div className="text-xs text-Color-Gray-700 mt-1 ml-6">
                    "{search.search_query}"
                  </div>
                )}

                <div className="text-xs text-Color-Gray-700 mt-1 ml-6">
                  {getFilterSummary(search.filters)}
                </div>
              </button>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleToggleNotifications(search)}
                  className={`p-1.5 rounded transition-colors ${
                    search.notify_on_new
                      ? 'bg-Color-Champagne-Gold text-white'
                      : 'hover:bg-Color-Primary-Beige/30'
                  }`}
                  title={search.notify_on_new ? 'Notifications enabled' : 'Enable notifications'}
                >
                  {search.notify_on_new ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <BellOff className="h-4 w-4 text-Color-Gray-700" />
                  )}
                </button>

                <button
                  onClick={() => handleDeleteSearch(search.id)}
                  className="p-1.5 hover:bg-red-50 rounded transition-colors"
                  title="Delete search"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>

            {search.last_result_count > 0 && (
              <div className="text-xs text-Color-Gray-700 ml-6">
                Last result: {search.last_result_count} products
              </div>
            )}
          </div>
        ))}

        {searches.length === 0 && !isCreating && (
          <div className="text-center text-sm text-Color-Gray-700 py-4">
            No saved searches yet
          </div>
        )}
      </div>
    </div>
  );
};
