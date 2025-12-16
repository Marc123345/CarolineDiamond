/*
  # Hierarchical Jewelry Filter System

  ## Overview
  Creates a comprehensive hierarchical filtering system for jewelry products,
  enabling multi-level filter relationships and cascading filter dependencies.

  ## 1. New Tables
  
  ### `ring_type_definitions`
  Stores ring type categories with side diamond variants
  - `id` (uuid, primary key)
  - `name` (text) - Display name (e.g., "Solitaire", "Halo")
  - `slug` (text) - URL-friendly identifier
  - `has_side_diamonds` (boolean) - Whether this type includes side diamonds
  - `display_order` (integer) - Sort order for UI display
  - `icon_name` (text) - Icon identifier for UI
  - `description` (text) - Detailed description
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `diamond_shape_definitions`
  Stores diamond shape information with visual icons
  - `id` (uuid, primary key)
  - `name` (text) - Shape name (e.g., "Round", "Oval")
  - `slug` (text) - URL-friendly identifier
  - `icon_svg` (text) - SVG icon data for display
  - `display_order` (integer)
  - `created_at` (timestamptz)

  ### `stone_type_hierarchy`
  Defines diamond and gemstone type hierarchies
  - `id` (uuid, primary key)
  - `parent_type` (text) - "Diamond" or "Gemstone"
  - `variant_name` (text) - Specific variant (e.g., "Natural Diamond", "Sapphire (Blue)")
  - `variant_slug` (text)
  - `color_hex` (text) - Display color for UI
  - `display_order` (integer)
  - `created_at` (timestamptz)

  ### `filter_dependencies`
  Defines which filters should reset when parent filters change
  - `id` (uuid, primary key)
  - `parent_filter` (text) - Parent filter name
  - `dependent_filter` (text) - Filter that should reset
  - `created_at` (timestamptz)

  ### `filter_availability_rules`
  Stores rules for which filter combinations are valid
  - `id` (uuid, primary key)
  - `ring_type` (text)
  - `available_shapes` (jsonb) - Array of available shapes for this ring type
  - `created_at` (timestamptz)

  ### `product_filter_cache`
  Caches filter counts for performance
  - `id` (uuid, primary key)
  - `filter_combination` (jsonb) - Current filter state
  - `product_count` (integer)
  - `last_updated` (timestamptz)
  - `expires_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Public read access for filter definitions
  - Authenticated write access for admin operations
  - Cache table has automatic expiration cleanup

  ## 3. Indexes
  - Fast lookups on slugs and names
  - Efficient filtering on parent_type and ring_type
  - Quick cache retrieval by filter_combination
*/

-- Ring Type Definitions
CREATE TABLE IF NOT EXISTS ring_type_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  has_side_diamonds boolean DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  icon_name text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Diamond Shape Definitions
CREATE TABLE IF NOT EXISTS diamond_shape_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  icon_svg text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Stone Type Hierarchy
CREATE TABLE IF NOT EXISTS stone_type_hierarchy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_type text NOT NULL CHECK (parent_type IN ('Diamond', 'Gemstone')),
  variant_name text NOT NULL,
  variant_slug text NOT NULL UNIQUE,
  color_hex text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Filter Dependencies
CREATE TABLE IF NOT EXISTS filter_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_filter text NOT NULL,
  dependent_filter text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_filter, dependent_filter)
);

-- Filter Availability Rules
CREATE TABLE IF NOT EXISTS filter_availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ring_type text NOT NULL UNIQUE,
  available_shapes jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Product Filter Cache
CREATE TABLE IF NOT EXISTS product_filter_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filter_combination jsonb NOT NULL,
  product_count integer NOT NULL DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '1 hour')
);

-- Enable Row Level Security
ALTER TABLE ring_type_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamond_shape_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stone_type_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE filter_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE filter_availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_filter_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public Read Access
CREATE POLICY "Public read access for ring types"
  ON ring_type_definitions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for shapes"
  ON diamond_shape_definitions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for stone hierarchy"
  ON stone_type_hierarchy FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for dependencies"
  ON filter_dependencies FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for availability rules"
  ON filter_availability_rules FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for filter cache"
  ON product_filter_cache FOR SELECT
  TO public
  USING (true);

-- RLS Policies: Authenticated Write Access
CREATE POLICY "Authenticated users can manage ring types"
  ON ring_type_definitions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage shapes"
  ON diamond_shape_definitions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage stone hierarchy"
  ON stone_type_hierarchy FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage dependencies"
  ON filter_dependencies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage availability rules"
  ON filter_availability_rules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "System can manage cache"
  ON product_filter_cache FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_ring_types_slug ON ring_type_definitions(slug);
CREATE INDEX IF NOT EXISTS idx_ring_types_order ON ring_type_definitions(display_order);
CREATE INDEX IF NOT EXISTS idx_shapes_slug ON diamond_shape_definitions(slug);
CREATE INDEX IF NOT EXISTS idx_shapes_order ON diamond_shape_definitions(display_order);
CREATE INDEX IF NOT EXISTS idx_stone_hierarchy_parent ON stone_type_hierarchy(parent_type);
CREATE INDEX IF NOT EXISTS idx_stone_hierarchy_slug ON stone_type_hierarchy(variant_slug);
CREATE INDEX IF NOT EXISTS idx_filter_deps_parent ON filter_dependencies(parent_filter);
CREATE INDEX IF NOT EXISTS idx_filter_rules_ring_type ON filter_availability_rules(ring_type);
CREATE INDEX IF NOT EXISTS idx_filter_cache_combination ON product_filter_cache USING gin(filter_combination);
CREATE INDEX IF NOT EXISTS idx_filter_cache_expires ON product_filter_cache(expires_at);

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_filter_cache()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM product_filter_cache
  WHERE expires_at < now();
END;
$$;

-- Insert Default Ring Type Definitions
INSERT INTO ring_type_definitions (name, slug, has_side_diamonds, display_order, icon_name, description) VALUES
  ('Solitaire', 'solitaire', false, 1, 'gem', 'Classic single diamond design'),
  ('Solitaire + Side Diamonds', 'solitaire-side-diamonds', true, 2, 'sparkles', 'Solitaire with accent diamonds on the band'),
  ('Halo', 'halo', false, 3, 'circle', 'Diamond surrounded by smaller diamonds'),
  ('Halo + Side Diamonds', 'halo-side-diamonds', true, 4, 'sparkles', 'Halo design with additional accent diamonds')
ON CONFLICT (name) DO NOTHING;

-- Insert Diamond Shape Definitions
INSERT INTO diamond_shape_definitions (name, slug, display_order) VALUES
  ('Round', 'round', 1),
  ('Oval', 'oval', 2),
  ('Princess', 'princess', 3),
  ('Pear', 'pear', 4),
  ('Marquise', 'marquise', 5),
  ('Emerald', 'emerald', 6),
  ('Cushion', 'cushion', 7)
ON CONFLICT (name) DO NOTHING;

-- Insert Stone Type Hierarchy
INSERT INTO stone_type_hierarchy (parent_type, variant_name, variant_slug, color_hex, display_order) VALUES
  -- Diamond variants
  ('Diamond', 'Natural Diamond', 'natural-diamond', '#FFFFFF', 1),
  ('Diamond', 'Lab-Grown Diamond', 'lab-grown-diamond', '#F0F0F0', 2),
  -- Gemstone variants
  ('Gemstone', 'Sapphire (Blue)', 'sapphire-blue', '#0F52BA', 1),
  ('Gemstone', 'Sapphire (Pink)', 'sapphire-pink', '#FF69B4', 2),
  ('Gemstone', 'Sapphire (Yellow)', 'sapphire-yellow', '#FFD700', 3),
  ('Gemstone', 'Morganite (Pink)', 'morganite-pink', '#FFB6C1', 4),
  ('Gemstone', 'Ruby (Red)', 'ruby-red', '#E0115F', 5)
ON CONFLICT (variant_slug) DO NOTHING;

-- Insert Filter Dependencies
INSERT INTO filter_dependencies (parent_filter, dependent_filter) VALUES
  ('ringStyle', 'shapes'),
  ('stoneType', 'diamondOrigin'),
  ('stoneType', 'gemstoneVariant')
ON CONFLICT (parent_filter, dependent_filter) DO NOTHING;

-- Insert Filter Availability Rules
INSERT INTO filter_availability_rules (ring_type, available_shapes) VALUES
  ('Solitaire', '["Round", "Oval", "Princess", "Pear", "Marquise", "Emerald"]'),
  ('Solitaire + Side Diamonds', '["Round", "Oval", "Princess", "Pear", "Marquise", "Emerald"]'),
  ('Halo', '["Round", "Oval", "Princess", "Pear", "Marquise", "Emerald", "Cushion"]'),
  ('Halo + Side Diamonds', '["Round", "Oval", "Princess", "Pear", "Marquise", "Emerald", "Cushion"]')
ON CONFLICT (ring_type) DO NOTHING;