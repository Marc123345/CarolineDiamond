import React, { useState, useEffect } from 'react';
import { Save, Star, Trash2, Edit2, Plus } from 'lucide-react';
import { ProductFilters } from '../../config/filterConfig';
import {
  getFilterPresets,
  createFilterPreset,
  updateFilterPreset,
  deleteFilterPreset,
  FilterPreset,
} from '../../lib/filterDb';
import { useAuth } from '../../context/AuthContext';

interface FilterPresetsPanelProps {
  currentFilters: ProductFilters;
  onPresetLoad: (filters: ProductFilters) => void;
}

export const FilterPresetsPanel: React.FC<FilterPresetsPanelProps> = ({
  currentFilters,
  onPresetLoad,
}) => {
  const { user } = useAuth();
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (user) {
      loadPresets();
    }
  }, [user]);

  const loadPresets = async () => {
    if (!user) return;
    const data = await getFilterPresets(user.id);
    setPresets(data);
  };

  const handleCreatePreset = async () => {
    if (!user || !newPresetName.trim()) return;

    const created = await createFilterPreset(user.id, newPresetName.trim(), currentFilters);
    if (created) {
      setPresets(prev => [created, ...prev]);
      setNewPresetName('');
      setIsCreating(false);
    }
  };

  const handleUpdatePreset = async (presetId: string) => {
    if (!editingName.trim()) return;

    const updated = await updateFilterPreset(presetId, { name: editingName.trim() });
    if (updated) {
      setPresets(prev => prev.map(p => (p.id === presetId ? updated : p)));
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    const success = await deleteFilterPreset(presetId);
    if (success) {
      setPresets(prev => prev.filter(p => p.id !== presetId));
    }
  };

  const handleSetDefault = async (presetId: string) => {
    const updated = await updateFilterPreset(presetId, { is_default: true });
    if (updated) {
      setPresets(prev =>
        prev.map(p => ({
          ...p,
          is_default: p.id === presetId,
        }))
      );
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center text-sm text-Color-Gray-700">
        Sign in to save filter presets
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-Color-Netural-Black">Filter Presets</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="p-2 hover:bg-Color-Primary-Beige/30 rounded-lg transition-colors"
          title="Create new preset"
        >
          <Plus className="h-4 w-4 text-Color-Champagne-Gold" />
        </button>
      </div>

      {isCreating && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newPresetName}
            onChange={e => setNewPresetName(e.target.value)}
            placeholder="Preset name..."
            className="flex-1 px-3 py-2 border border-Color-Champagne-Gold/30 rounded-lg text-sm focus:ring-2 focus:ring-Color-Champagne-Gold focus:border-transparent"
            autoFocus
          />
          <button
            onClick={handleCreatePreset}
            className="px-3 py-2 bg-Color-Netural-Black text-white rounded-lg text-sm hover:bg-Color-Champagne-Gold transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsCreating(false);
              setNewPresetName('');
            }}
            className="px-3 py-2 border border-Color-Champagne-Gold/30 rounded-lg text-sm hover:bg-Color-Primary-Beige/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {presets.map(preset => (
          <div
            key={preset.id}
            className="flex items-center gap-2 p-3 border border-Color-Champagne-Gold/20 rounded-lg hover:bg-Color-Primary-Beige/10 transition-colors group"
          >
            {editingId === preset.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  className="flex-1 px-2 py-1 border border-Color-Champagne-Gold/30 rounded text-sm focus:ring-2 focus:ring-Color-Champagne-Gold focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={() => handleUpdatePreset(preset.id)}
                  className="p-1 hover:bg-Color-Primary-Beige/30 rounded transition-colors"
                >
                  <Save className="h-4 w-4 text-Color-Champagne-Gold" />
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingName('');
                  }}
                  className="p-1 hover:bg-Color-Primary-Beige/30 rounded transition-colors"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSetDefault(preset.id)}
                  className="p-1 hover:bg-Color-Primary-Beige/30 rounded transition-colors"
                  title={preset.is_default ? 'Default preset' : 'Set as default'}
                >
                  <Star
                    className={`h-4 w-4 ${
                      preset.is_default
                        ? 'text-Color-Champagne-Gold fill-Color-Champagne-Gold'
                        : 'text-Color-Gray-700'
                    }`}
                  />
                </button>

                <button
                  onClick={() => onPresetLoad(preset.filters)}
                  className="flex-1 text-left text-sm text-Color-Netural-Black hover:text-Color-Champagne-Gold transition-colors"
                >
                  {preset.name}
                </button>

                <button
                  onClick={() => {
                    setEditingId(preset.id);
                    setEditingName(preset.name);
                  }}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-Color-Primary-Beige/30 rounded transition-all"
                >
                  <Edit2 className="h-4 w-4 text-Color-Gray-700" />
                </button>

                <button
                  onClick={() => handleDeletePreset(preset.id)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </>
            )}
          </div>
        ))}

        {presets.length === 0 && !isCreating && (
          <div className="text-center text-sm text-Color-Gray-700 py-4">
            No saved presets yet
          </div>
        )}
      </div>
    </div>
  );
};
