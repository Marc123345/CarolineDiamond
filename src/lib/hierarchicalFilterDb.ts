import { supabase } from './supabase';

export interface RingTypeDefinition {
  id: string;
  name: string;
  slug: string;
  has_side_diamonds: boolean;
  display_order: number;
  icon_name: string | null;
  description: string | null;
}

export interface DiamondShapeDefinition {
  id: string;
  name: string;
  slug: string;
  icon_svg: string | null;
  display_order: number;
}

export interface StoneTypeHierarchy {
  id: string;
  parent_type: 'Diamond' | 'Gemstone';
  variant_name: string;
  variant_slug: string;
  color_hex: string | null;
  display_order: number;
}

export interface FilterDependency {
  id: string;
  parent_filter: string;
  dependent_filter: string;
}

export interface FilterAvailabilityRule {
  id: string;
  ring_type: string;
  available_shapes: string[];
}

export interface FilterCacheEntry {
  id: string;
  filter_combination: Record<string, any>;
  product_count: number;
  last_updated: string;
  expires_at: string;
}

export async function getRingTypeDefinitions(): Promise<RingTypeDefinition[]> {
  const { data, error } = await supabase
    .from('ring_type_definitions')
    .select('*')
    .order('display_order');

  if (error) {
    console.error('Error fetching ring type definitions:', error);
    return [];
  }

  return data || [];
}

export async function getDiamondShapeDefinitions(): Promise<DiamondShapeDefinition[]> {
  const { data, error } = await supabase
    .from('diamond_shape_definitions')
    .select('*')
    .order('display_order');

  if (error) {
    console.error('Error fetching diamond shape definitions:', error);
    return [];
  }

  return data || [];
}

export async function getStoneTypeHierarchy(parentType?: 'Diamond' | 'Gemstone'): Promise<StoneTypeHierarchy[]> {
  let query = supabase
    .from('stone_type_hierarchy')
    .select('*')
    .order('display_order');

  if (parentType) {
    query = query.eq('parent_type', parentType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching stone type hierarchy:', error);
    return [];
  }

  return data || [];
}

export async function getFilterDependencies(): Promise<FilterDependency[]> {
  const { data, error } = await supabase
    .from('filter_dependencies')
    .select('*');

  if (error) {
    console.error('Error fetching filter dependencies:', error);
    return [];
  }

  return data || [];
}

export async function getFilterAvailabilityRules(): Promise<FilterAvailabilityRule[]> {
  const { data, error } = await supabase
    .from('filter_availability_rules')
    .select('*');

  if (error) {
    console.error('Error fetching filter availability rules:', error);
    return [];
  }

  return data || [];
}

export async function getAvailableShapesForRingType(ringType: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('filter_availability_rules')
    .select('available_shapes')
    .eq('ring_type', ringType)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching available shapes:', error);
    return [];
  }

  return data.available_shapes || [];
}

export async function getCachedFilterCount(filterCombination: Record<string, any>): Promise<number | null> {
  const { data, error } = await supabase
    .from('product_filter_cache')
    .select('product_count, expires_at')
    .eq('filter_combination', filterCombination)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.product_count;
}

export async function setCachedFilterCount(
  filterCombination: Record<string, any>,
  productCount: number,
  expiresInMinutes: number = 60
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

  const { error } = await supabase
    .from('product_filter_cache')
    .upsert({
      filter_combination: filterCombination,
      product_count: productCount,
      last_updated: new Date().toISOString(),
      expires_at: expiresAt.toISOString()
    });

  if (error) {
    console.error('Error setting cached filter count:', error);
  }
}

export async function cleanExpiredFilterCache(): Promise<void> {
  const { error } = await supabase.rpc('clean_expired_filter_cache');

  if (error) {
    console.error('Error cleaning expired filter cache:', error);
  }
}

export function getDependentFilters(parentFilter: string, dependencies: FilterDependency[]): string[] {
  return dependencies
    .filter(dep => dep.parent_filter === parentFilter)
    .map(dep => dep.dependent_filter);
}
