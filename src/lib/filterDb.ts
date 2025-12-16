import { supabase } from './supabase';
import { ProductFilters } from '../config/filterConfig';

export interface FilterPreset {
  id: string;
  user_id: string;
  name: string;
  filters: ProductFilters;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  filters: ProductFilters;
  search_query?: string;
  notify_on_new: boolean;
  last_result_count: number;
  created_at: string;
  updated_at: string;
}

export interface FilterAnalytics {
  filter_combination: ProductFilters;
  result_count: number;
  query_time_ms: number;
}

export interface QueryCacheEntry {
  query_hash: string;
  query_params: any;
  result_data: any;
  result_count: number;
  expires_at: string;
}

export async function getFilterPresets(userId: string): Promise<FilterPreset[]> {
  const { data, error } = await supabase
    .from('filter_presets')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching filter presets:', error);
    return [];
  }

  return data || [];
}

export async function getDefaultFilterPreset(userId: string): Promise<FilterPreset | null> {
  const { data, error } = await supabase
    .from('filter_presets')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching default filter preset:', error);
    return null;
  }

  return data;
}

export async function createFilterPreset(
  userId: string,
  name: string,
  filters: ProductFilters,
  isDefault: boolean = false
): Promise<FilterPreset | null> {
  const { data, error } = await supabase
    .from('filter_presets')
    .insert({
      user_id: userId,
      name,
      filters,
      is_default: isDefault,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating filter preset:', error);
    return null;
  }

  return data;
}

export async function updateFilterPreset(
  presetId: string,
  updates: Partial<Pick<FilterPreset, 'name' | 'filters' | 'is_default'>>
): Promise<FilterPreset | null> {
  const { data, error } = await supabase
    .from('filter_presets')
    .update(updates)
    .eq('id', presetId)
    .select()
    .single();

  if (error) {
    console.error('Error updating filter preset:', error);
    return null;
  }

  return data;
}

export async function deleteFilterPreset(presetId: string): Promise<boolean> {
  const { error } = await supabase.from('filter_presets').delete().eq('id', presetId);

  if (error) {
    console.error('Error deleting filter preset:', error);
    return false;
  }

  return true;
}

export async function getSavedSearches(userId: string): Promise<SavedSearch[]> {
  const { data, error } = await supabase
    .from('saved_searches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved searches:', error);
    return [];
  }

  return data || [];
}

export async function createSavedSearch(
  userId: string,
  name: string,
  filters: ProductFilters,
  searchQuery?: string,
  notifyOnNew: boolean = false
): Promise<SavedSearch | null> {
  const { data, error } = await supabase
    .from('saved_searches')
    .insert({
      user_id: userId,
      name,
      filters,
      search_query: searchQuery,
      notify_on_new: notifyOnNew,
      last_result_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating saved search:', error);
    return null;
  }

  return data;
}

export async function updateSavedSearch(
  searchId: string,
  updates: Partial<Pick<SavedSearch, 'name' | 'filters' | 'search_query' | 'notify_on_new' | 'last_result_count'>>
): Promise<SavedSearch | null> {
  const { data, error } = await supabase
    .from('saved_searches')
    .update(updates)
    .eq('id', searchId)
    .select()
    .single();

  if (error) {
    console.error('Error updating saved search:', error);
    return null;
  }

  return data;
}

export async function deleteSavedSearch(searchId: string): Promise<boolean> {
  const { error } = await supabase.from('saved_searches').delete().eq('id', searchId);

  if (error) {
    console.error('Error deleting saved search:', error);
    return false;
  }

  return true;
}

export async function trackFilterAnalytics(
  sessionId: string,
  filterCombination: ProductFilters,
  resultCount: number,
  queryTimeMs: number,
  userId?: string
): Promise<void> {
  const { error } = await supabase.from('filter_analytics').insert({
    user_id: userId,
    session_id: sessionId,
    filter_combination: filterCombination,
    result_count: resultCount,
    query_time_ms: queryTimeMs,
  });

  if (error) {
    console.error('Error tracking filter analytics:', error);
  }
}

export async function getQueryCache(queryHash: string): Promise<QueryCacheEntry | null> {
  const { data, error } = await supabase
    .from('query_cache')
    .select('*')
    .eq('query_hash', queryHash)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error('Error fetching query cache:', error);
    return null;
  }

  return data;
}

export async function setQueryCache(
  queryHash: string,
  queryParams: any,
  resultData: any,
  resultCount: number,
  cacheDurationMinutes: number = 15
): Promise<void> {
  const expiresAt = new Date(Date.now() + cacheDurationMinutes * 60 * 1000).toISOString();

  const { error } = await supabase.from('query_cache').upsert(
    {
      query_hash: queryHash,
      query_params: queryParams,
      result_data: resultData,
      result_count: resultCount,
      expires_at: expiresAt,
    },
    {
      onConflict: 'query_hash',
    }
  );

  if (error) {
    console.error('Error setting query cache:', error);
  }
}

export async function updateFilterPerformanceMetrics(
  filterType: string,
  filterValue: string,
  resultCount: number
): Promise<void> {
  const { data: existing } = await supabase
    .from('filter_performance_metrics')
    .select('*')
    .eq('filter_type', filterType)
    .eq('filter_value', filterValue)
    .maybeSingle();

  if (existing) {
    const newUsageCount = existing.usage_count + 1;
    const newAvgResultCount =
      (existing.avg_result_count * existing.usage_count + resultCount) / newUsageCount;

    await supabase
      .from('filter_performance_metrics')
      .update({
        usage_count: newUsageCount,
        avg_result_count: newAvgResultCount,
        last_used_at: new Date().toISOString(),
      })
      .eq('filter_type', filterType)
      .eq('filter_value', filterValue);
  } else {
    await supabase.from('filter_performance_metrics').insert({
      filter_type: filterType,
      filter_value: filterValue,
      usage_count: 1,
      avg_result_count: resultCount,
      last_used_at: new Date().toISOString(),
    });
  }
}

export async function getPopularFilters(limit: number = 10): Promise<Array<{
  filter_type: string;
  filter_value: string;
  usage_count: number;
  avg_result_count: number;
}>> {
  const { data, error } = await supabase
    .from('filter_performance_metrics')
    .select('filter_type, filter_value, usage_count, avg_result_count')
    .order('usage_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching popular filters:', error);
    return [];
  }

  return data || [];
}

export async function getFilterAnalyticsSummary(userId?: string): Promise<{
  totalSearches: number;
  avgResultCount: number;
  avgQueryTime: number;
  mostUsedFilters: Array<{ filter: string; count: number }>;
} | null> {
  let query = supabase
    .from('filter_analytics')
    .select('filter_combination, result_count, query_time_ms');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.order('applied_at', { ascending: false }).limit(1000);

  if (error) {
    console.error('Error fetching analytics summary:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return {
      totalSearches: 0,
      avgResultCount: 0,
      avgQueryTime: 0,
      mostUsedFilters: [],
    };
  }

  const totalSearches = data.length;
  const avgResultCount = data.reduce((sum, item) => sum + item.result_count, 0) / totalSearches;
  const avgQueryTime = data.reduce((sum, item) => sum + item.query_time_ms, 0) / totalSearches;

  const filterCounts = new Map<string, number>();
  data.forEach(item => {
    Object.entries(item.filter_combination).forEach(([key, value]) => {
      if (value) {
        const filterKey = Array.isArray(value) ? `${key}:${value.join(',')}` : `${key}:${value}`;
        filterCounts.set(filterKey, (filterCounts.get(filterKey) || 0) + 1);
      }
    });
  });

  const mostUsedFilters = Array.from(filterCounts.entries())
    .map(([filter, count]) => ({ filter, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalSearches,
    avgResultCount,
    avgQueryTime,
    mostUsedFilters,
  };
}
