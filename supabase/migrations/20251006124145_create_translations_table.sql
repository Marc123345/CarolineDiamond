/*
  # Translation Caching System

  1. New Tables
    - `translations`
      - `id` (uuid, primary key) - Unique identifier
      - `source_text` (text) - Original text to translate
      - `source_lang` (text) - Source language code (nl or en)
      - `target_lang` (text) - Target language code (nl or en)
      - `translated_text` (text) - Translated result
      - `context` (text, nullable) - Optional context for translation
      - `created_at` (timestamptz) - When translation was cached
      - `updated_at` (timestamptz) - Last time translation was verified/updated
      - `usage_count` (integer) - Track how often this translation is used

  2. Indexes
    - Composite index on (source_text, source_lang, target_lang) for fast lookups
    - Index on created_at for cache cleanup

  3. Security
    - Enable RLS on `translations` table
    - Public read access (translations are not sensitive)
    - Authenticated write access for admin updates

  4. Performance
    - Cache translations to avoid repeated API calls
    - Track usage to identify frequently translated content
*/

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text text NOT NULL,
  source_lang text NOT NULL DEFAULT 'nl',
  target_lang text NOT NULL DEFAULT 'en',
  translated_text text NOT NULL,
  context text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  usage_count integer DEFAULT 1,
  CONSTRAINT valid_source_lang CHECK (source_lang IN ('nl', 'en')),
  CONSTRAINT valid_target_lang CHECK (target_lang IN ('nl', 'en')),
  CONSTRAINT different_languages CHECK (source_lang != target_lang)
);

-- Create composite index for fast translation lookups
CREATE INDEX IF NOT EXISTS idx_translations_lookup 
  ON translations(source_text, source_lang, target_lang);

-- Create index for cache cleanup
CREATE INDEX IF NOT EXISTS idx_translations_created 
  ON translations(created_at);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Public can read translations (not sensitive data)
CREATE POLICY "Public can read translations"
  ON translations
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert translations
CREATE POLICY "Authenticated can insert translations"
  ON translations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update translation usage count
CREATE POLICY "Authenticated can update translations"
  ON translations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update usage count
CREATE OR REPLACE FUNCTION increment_translation_usage(translation_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE translations
  SET usage_count = usage_count + 1,
      updated_at = now()
  WHERE id = translation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean old unused translations (can be called periodically)
CREATE OR REPLACE FUNCTION cleanup_old_translations(days_old integer DEFAULT 90)
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM translations
  WHERE created_at < now() - (days_old || ' days')::interval
    AND usage_count <= 1;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;