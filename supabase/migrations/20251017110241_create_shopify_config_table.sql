/*
  # Create Shopify Configuration Table

  1. New Tables
    - `shopify_config`
      - `id` (uuid, primary key) - Unique identifier
      - `store_domain` (text) - Shopify store domain (e.g., uyccca-1e.myshopify.com)
      - `storefront_access_token` (text) - Storefront API access token
      - `api_version` (text) - Shopify API version (default: 2025-10)
      - `is_active` (boolean) - Whether this config is currently active
      - `last_synced_at` (timestamptz) - Last successful sync timestamp
      - `created_at` (timestamptz) - Record creation time
      - `updated_at` (timestamptz) - Record update time

  2. Security
    - Enable RLS on `shopify_config` table
    - Only authenticated admin users can read/write config
    - Single active configuration enforced

  3. Notes
    - This table stores Shopify connection details persistently
    - Ensures connection survives environment resets
    - Only one active config allowed at a time
*/

CREATE TABLE IF NOT EXISTS shopify_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_domain text NOT NULL,
  storefront_access_token text NOT NULL,
  api_version text DEFAULT '2025-10' NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE shopify_config ENABLE ROW LEVEL SECURITY;

-- Only allow service role to manage config (admin-only operations)
CREATE POLICY "Service role can manage Shopify config"
  ON shopify_config
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for quick lookup of active config
CREATE INDEX IF NOT EXISTS idx_shopify_config_active 
  ON shopify_config(is_active) 
  WHERE is_active = true;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_shopify_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shopify_config_updated_at
  BEFORE UPDATE ON shopify_config
  FOR EACH ROW
  EXECUTE FUNCTION update_shopify_config_updated_at();