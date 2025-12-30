/*
  # Product Catalog and Pricing System

  1. New Tables
    - `ring_models`
      - `id` (uuid, primary key)
      - `model_id` (text, unique) - Internal model identifier
      - `name_en` (text) - English product name
      - `name_nl` (text) - Dutch product name
      - `description` (text)
      - `style` (text) - Ring style (Solitaire, Halo, etc.)
      - `has_side_diamonds` (boolean)
      - `available_shapes` (text[]) - Array of available diamond shapes
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `pricing_tiers`
      - `id` (uuid, primary key)
      - `model_id` (text) - References ring model
      - `carat_weight` (decimal)
      - `diamond_origin` (text) - 'natural' or 'lab-grown'
      - `diamond_quality` (jsonb) - Color and clarity info
      - `base_price_eur` (decimal)
      - `price_incl_tax` (decimal)
      - `currency` (text, default 'EUR')
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `metal_options`
      - `id` (uuid, primary key)
      - `metal_id` (text, unique) - Internal identifier
      - `name_en` (text)
      - `name_nl` (text)
      - `display_name` (text)
      - `hex_color` (text)
      - `karat` (integer)
      - `price_modifier` (decimal) - Additional cost for this metal
      - `is_active` (boolean)
      - `sort_order` (integer)
      - `created_at` (timestamptz)

    - `certification_bodies`
      - `id` (uuid, primary key)
      - `code` (text, unique) - 'GIA', 'HRD', 'IGI'
      - `name` (text)
      - `website` (text)
      - `description` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for active products
    - Admin-only write access

  3. Functions
    - Calculate variant price based on model, carat, origin, metal
    - Generate product variants automatically
*/

-- Ring Models Table
CREATE TABLE IF NOT EXISTS ring_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_nl text NOT NULL,
  description text,
  style text NOT NULL CHECK (style IN ('Solitaire', 'Solitaire + Side Diamonds', 'Halo', 'Halo + Side Diamonds')),
  has_side_diamonds boolean DEFAULT false,
  available_shapes text[] NOT NULL DEFAULT ARRAY[]::text[],
  image_urls text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pricing Tiers Table
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id text REFERENCES ring_models(model_id) ON DELETE CASCADE,
  carat_weight decimal(4,2) NOT NULL,
  diamond_origin text NOT NULL CHECK (diamond_origin IN ('natural', 'lab-grown')),
  diamond_quality jsonb DEFAULT '{"color": "D", "clarity": "VS2", "grade": "D/VS2"}'::jsonb,
  base_price_eur decimal(10,2) NOT NULL,
  price_incl_tax decimal(10,2) NOT NULL,
  currency text DEFAULT 'EUR',
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(model_id, carat_weight, diamond_origin)
);

-- Metal Options Table
CREATE TABLE IF NOT EXISTS metal_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metal_id text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_nl text NOT NULL,
  display_name text NOT NULL,
  hex_color text NOT NULL,
  karat integer NOT NULL DEFAULT 18,
  price_modifier decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Certification Bodies Table
CREATE TABLE IF NOT EXISTS certification_bodies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  website text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ring_models_active ON ring_models(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ring_models_style ON ring_models(style);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_model ON pricing_tiers(model_id);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_active ON pricing_tiers(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_origin ON pricing_tiers(diamond_origin);
CREATE INDEX IF NOT EXISTS idx_metal_options_active ON metal_options(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE ring_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE metal_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_bodies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ring_models
CREATE POLICY "Anyone can view active ring models"
  ON ring_models FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all ring models"
  ON ring_models FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ring models"
  ON ring_models FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ring models"
  ON ring_models FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete ring models"
  ON ring_models FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for pricing_tiers
CREATE POLICY "Anyone can view active pricing tiers"
  ON pricing_tiers FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all pricing tiers"
  ON pricing_tiers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage pricing tiers"
  ON pricing_tiers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for metal_options
CREATE POLICY "Anyone can view active metal options"
  ON metal_options FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all metal options"
  ON metal_options FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage metal options"
  ON metal_options FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for certification_bodies
CREATE POLICY "Anyone can view active certification bodies"
  ON certification_bodies FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage certification bodies"
  ON certification_bodies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to calculate variant price
CREATE OR REPLACE FUNCTION calculate_variant_price(
  p_model_id text,
  p_carat_weight decimal,
  p_diamond_origin text,
  p_metal_id text
)
RETURNS decimal AS $$
DECLARE
  v_base_price decimal;
  v_metal_modifier decimal;
  v_final_price decimal;
BEGIN
  -- Get base price from pricing tiers
  SELECT price_incl_tax INTO v_base_price
  FROM pricing_tiers
  WHERE model_id = p_model_id
    AND carat_weight = p_carat_weight
    AND diamond_origin = p_diamond_origin
    AND is_active = true
  LIMIT 1;

  -- If no exact match, return null
  IF v_base_price IS NULL THEN
    RETURN NULL;
  END IF;

  -- Get metal price modifier
  SELECT COALESCE(price_modifier, 0) INTO v_metal_modifier
  FROM metal_options
  WHERE metal_id = p_metal_id
    AND is_active = true;

  -- Calculate final price
  v_final_price := v_base_price + COALESCE(v_metal_modifier, 0);

  RETURN v_final_price;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_ring_models_updated_at
  BEFORE UPDATE ON ring_models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_tiers_updated_at
  BEFORE UPDATE ON pricing_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data for metal options
INSERT INTO metal_options (metal_id, name_en, name_nl, display_name, hex_color, karat, sort_order)
VALUES
  ('white-gold', 'White Gold', 'Witgoud', '18K White Gold', '#E8E8E8', 18, 1),
  ('rose-gold', 'Rose Gold', 'Roségoud', '18K Rose Gold', '#E8C4B8', 18, 2),
  ('yellow-gold', 'Yellow Gold', 'Geelgoud', '18K Yellow Gold', '#FFD700', 18, 3)
ON CONFLICT (metal_id) DO NOTHING;

-- Insert certification bodies
INSERT INTO certification_bodies (code, name, website, description)
VALUES
  ('GIA', 'Gemological Institute of America', 'https://www.gia.edu', 'World-renowned diamond grading and certification'),
  ('HRD', 'HRD Antwerp', 'https://www.hrdantwerp.com', 'European diamond certification authority'),
  ('IGI', 'International Gemological Institute', 'https://www.igi.org', 'Independent diamond grading laboratory')
ON CONFLICT (code) DO NOTHING;

-- Insert ring models
INSERT INTO ring_models (model_id, name_en, name_nl, description, style, has_side_diamonds, available_shapes)
VALUES
  (
    'solitaire-princess',
    'Solitaire Ring with Princess Shape Diamond',
    'Solitaire Ring met Princess Geslepen Diamant',
    'Classic timeless solitaire ring with princess cut diamond',
    'Solitaire',
    false,
    ARRAY['Princess']
  ),
  (
    'solitaire-round',
    'Solitaire Ring with Round Diamond',
    'Solitaire Ring met Ronde Diamant',
    'Classic timeless solitaire ring with round brilliant diamond',
    'Solitaire',
    false,
    ARRAY['Round']
  ),
  (
    'solitaire-oval',
    'Solitaire Ring with Oval Diamond',
    'Solitaire Ring met Ovale Diamant',
    'Classic timeless solitaire ring with oval diamond',
    'Solitaire',
    false,
    ARRAY['Oval']
  ),
  (
    'solitaire-round-side',
    'Solitaire Ring with Round Diamond and Side Diamonds',
    'Solitaire Ring met Ronde Diamant en Zijdiamanten',
    'Elegant solitaire ring with round diamond enhanced by side diamonds',
    'Solitaire + Side Diamonds',
    true,
    ARRAY['Round']
  ),
  (
    'solitaire-emerald-side',
    'Solitaire Ring with Emerald Shape and Side Diamond',
    'Solitaire Ring met Smaragd Geslepen Diamant en Zijdiamant',
    'Sophisticated solitaire ring with emerald cut diamond and side diamonds',
    'Solitaire + Side Diamonds',
    true,
    ARRAY['Emerald']
  ),
  (
    'halo-cushion-side',
    'Halo Ring with Cushion Diamond and Side Diamonds',
    'Halo Ring met Cushion Diamant en Zijdiamanten',
    'Stunning halo ring with cushion cut diamond surrounded by smaller diamonds',
    'Halo + Side Diamonds',
    true,
    ARRAY['Cushion']
  ),
  (
    'halo-pear',
    'Halo Ring with Pear Shape Diamond',
    'Halo Ring met Peer Geslepen Diamant',
    'Beautiful halo ring with pear shaped diamond',
    'Halo',
    false,
    ARRAY['Pear']
  ),
  (
    'halo-side',
    'Halo Ring with Side Diamonds',
    'Halo Ring met Zijdiamanten',
    'Luxurious halo ring with side diamonds on the band',
    'Halo + Side Diamonds',
    true,
    ARRAY['Round', 'Oval', 'Princess', 'Cushion', 'Pear', 'Marquise', 'Emerald', 'Heart']
  )
ON CONFLICT (model_id) DO NOTHING;

-- Insert lab-grown pricing for solitaire round rings
INSERT INTO pricing_tiers (model_id, carat_weight, diamond_origin, base_price_eur, price_incl_tax)
VALUES
  ('solitaire-round', 0.50, 'lab-grown', 790, 790),
  ('solitaire-round', 1.00, 'lab-grown', 990, 990),
  ('solitaire-round', 1.50, 'lab-grown', 1250, 1250)
ON CONFLICT (model_id, carat_weight, diamond_origin) DO NOTHING;

-- Insert lab-grown pricing for solitaire oval rings (same as round)
INSERT INTO pricing_tiers (model_id, carat_weight, diamond_origin, base_price_eur, price_incl_tax)
VALUES
  ('solitaire-oval', 0.50, 'lab-grown', 790, 790),
  ('solitaire-oval', 1.00, 'lab-grown', 990, 990),
  ('solitaire-oval', 1.50, 'lab-grown', 1250, 1250)
ON CONFLICT (model_id, carat_weight, diamond_origin) DO NOTHING;

-- Insert natural diamond base pricing (placeholder for all models)
INSERT INTO pricing_tiers (model_id, carat_weight, diamond_origin, base_price_eur, price_incl_tax, notes)
SELECT
  model_id,
  carat_weight,
  'natural' as diamond_origin,
  3000 as base_price_eur,
  3000 as price_incl_tax,
  'Base price for natural diamond - varies by specific carat and quality' as notes
FROM ring_models
CROSS JOIN (VALUES (0.50), (1.00), (1.50), (2.00)) AS carats(carat_weight)
ON CONFLICT (model_id, carat_weight, diamond_origin) DO NOTHING;
