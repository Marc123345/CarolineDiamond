/**
 * Product Catalog Database Functions
 *
 * Provides functions to interact with the product catalog tables in Supabase
 */

import { supabase } from './supabase';

// Types matching database schema
export interface RingModel {
  id: string;
  model_id: string;
  name_en: string;
  name_nl: string;
  description: string | null;
  style: 'Solitaire' | 'Solitaire + Side Diamonds' | 'Halo' | 'Halo + Side Diamonds';
  has_side_diamonds: boolean;
  available_shapes: string[];
  image_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingTier {
  id: string;
  model_id: string;
  carat_weight: number;
  diamond_origin: 'natural' | 'lab-grown';
  diamond_quality: {
    color: string;
    clarity: string;
    grade: string;
  };
  base_price_eur: number;
  price_incl_tax: number;
  currency: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MetalOption {
  id: string;
  metal_id: string;
  name_en: string;
  name_nl: string;
  display_name: string;
  hex_color: string;
  karat: number;
  price_modifier: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface CertificationBody {
  id: string;
  code: string;
  name: string;
  website: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

// Fetch all active ring models
export async function getActiveRingModels(): Promise<RingModel[]> {
  const { data, error } = await supabase
    .from('ring_models')
    .select('*')
    .eq('is_active', true)
    .order('style', { ascending: true });

  if (error) {
    console.error('Error fetching ring models:', error);
    throw error;
  }

  return data || [];
}

// Fetch ring model by ID
export async function getRingModelById(modelId: string): Promise<RingModel | null> {
  const { data, error } = await supabase
    .from('ring_models')
    .select('*')
    .eq('model_id', modelId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching ring model:', error);
    throw error;
  }

  return data;
}

// Fetch pricing tiers for a specific model
export async function getPricingForModel(
  modelId: string,
  origin?: 'natural' | 'lab-grown'
): Promise<PricingTier[]> {
  let query = supabase
    .from('pricing_tiers')
    .select('*')
    .eq('model_id', modelId)
    .eq('is_active', true)
    .order('carat_weight', { ascending: true });

  if (origin) {
    query = query.eq('diamond_origin', origin);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching pricing tiers:', error);
    throw error;
  }

  return data || [];
}

// Get specific price for a configuration
export async function getPrice(
  modelId: string,
  caratWeight: number,
  origin: 'natural' | 'lab-grown'
): Promise<number | null> {
  const { data, error } = await supabase
    .from('pricing_tiers')
    .select('price_incl_tax')
    .eq('model_id', modelId)
    .eq('carat_weight', caratWeight)
    .eq('diamond_origin', origin)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching price:', error);
    throw error;
  }

  return data?.price_incl_tax || null;
}

// Calculate variant price using database function
export async function calculateVariantPrice(
  modelId: string,
  caratWeight: number,
  origin: 'natural' | 'lab-grown',
  metalId: string
): Promise<number | null> {
  const { data, error } = await supabase.rpc('calculate_variant_price', {
    p_model_id: modelId,
    p_carat_weight: caratWeight,
    p_diamond_origin: origin,
    p_metal_id: metalId
  });

  if (error) {
    console.error('Error calculating variant price:', error);
    throw error;
  }

  return data;
}

// Fetch all active metal options
export async function getMetalOptions(): Promise<MetalOption[]> {
  const { data, error } = await supabase
    .from('metal_options')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching metal options:', error);
    throw error;
  }

  return data || [];
}

// Fetch metal option by ID
export async function getMetalOptionById(metalId: string): Promise<MetalOption | null> {
  const { data, error } = await supabase
    .from('metal_options')
    .select('*')
    .eq('metal_id', metalId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching metal option:', error);
    throw error;
  }

  return data;
}

// Fetch all certification bodies
export async function getCertificationBodies(): Promise<CertificationBody[]> {
  const { data, error } = await supabase
    .from('certification_bodies')
    .select('*')
    .eq('is_active', true)
    .order('code', { ascending: true });

  if (error) {
    console.error('Error fetching certification bodies:', error);
    throw error;
  }

  return data || [];
}

// Add a new ring model (authenticated users only)
export async function addRingModel(model: Omit<RingModel, 'id' | 'created_at' | 'updated_at'>): Promise<RingModel> {
  const { data, error } = await supabase
    .from('ring_models')
    .insert(model)
    .select()
    .single();

  if (error) {
    console.error('Error adding ring model:', error);
    throw error;
  }

  return data;
}

// Update a ring model (authenticated users only)
export async function updateRingModel(
  modelId: string,
  updates: Partial<Omit<RingModel, 'id' | 'model_id' | 'created_at' | 'updated_at'>>
): Promise<RingModel> {
  const { data, error } = await supabase
    .from('ring_models')
    .update(updates)
    .eq('model_id', modelId)
    .select()
    .single();

  if (error) {
    console.error('Error updating ring model:', error);
    throw error;
  }

  return data;
}

// Add a new pricing tier (authenticated users only)
export async function addPricingTier(
  pricing: Omit<PricingTier, 'id' | 'created_at' | 'updated_at'>
): Promise<PricingTier> {
  const { data, error } = await supabase
    .from('pricing_tiers')
    .insert(pricing)
    .select()
    .single();

  if (error) {
    console.error('Error adding pricing tier:', error);
    throw error;
  }

  return data;
}

// Update a pricing tier (authenticated users only)
export async function updatePricingTier(
  id: string,
  updates: Partial<Omit<PricingTier, 'id' | 'created_at' | 'updated_at'>>
): Promise<PricingTier> {
  const { data, error } = await supabase
    .from('pricing_tiers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating pricing tier:', error);
    throw error;
  }

  return data;
}

// Get all ring models with their pricing
export async function getRingModelsWithPricing(): Promise<Array<RingModel & { pricing: PricingTier[] }>> {
  const models = await getActiveRingModels();

  const modelsWithPricing = await Promise.all(
    models.map(async (model) => {
      const pricing = await getPricingForModel(model.model_id);
      return {
        ...model,
        pricing
      };
    })
  );

  return modelsWithPricing;
}

// Get pricing summary for display
export interface PricingSummary {
  model: RingModel;
  labGrownPrices: { carat: number; price: number }[];
  naturalPrice: number;
}

export async function getPricingSummary(modelId: string): Promise<PricingSummary | null> {
  const model = await getRingModelById(modelId);
  if (!model) return null;

  const labGrownPricing = await getPricingForModel(modelId, 'lab-grown');
  const naturalPricing = await getPricingForModel(modelId, 'natural');

  return {
    model,
    labGrownPrices: labGrownPricing.map(p => ({
      carat: p.carat_weight,
      price: p.price_incl_tax
    })),
    naturalPrice: naturalPricing[0]?.price_incl_tax || 3000
  };
}

export default {
  getActiveRingModels,
  getRingModelById,
  getPricingForModel,
  getPrice,
  calculateVariantPrice,
  getMetalOptions,
  getMetalOptionById,
  getCertificationBodies,
  addRingModel,
  updateRingModel,
  addPricingTier,
  updatePricingTier,
  getRingModelsWithPricing,
  getPricingSummary
};
