/*
  # Create Filter Preferences and Analytics Tables

  1. New Tables
    - `filter_presets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - User-defined preset name
      - `filters` (jsonb) - Stored filter configuration
      - `is_default` (boolean) - Whether this is the user's default preset
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `filter_analytics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, references auth.users) - Null for anonymous users
      - `session_id` (text) - For tracking anonymous sessions
      - `filter_combination` (jsonb) - The filter combination used
      - `result_count` (integer) - Number of results returned
      - `query_time_ms` (integer) - Query execution time
      - `applied_at` (timestamptz)
    
    - `saved_searches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - User-defined search name
      - `filters` (jsonb) - Search filter configuration
      - `search_query` (text, nullable) - Search text if applicable
      - `notify_on_new` (boolean) - Whether to notify user of new matches
      - `last_result_count` (integer) - Track changes in results
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `query_cache`
      - `id` (uuid, primary key)
      - `query_hash` (text, unique) - Hash of the query for quick lookup
      - `query_params` (jsonb) - The full query parameters
      - `result_data` (jsonb) - Cached product IDs and metadata
      - `result_count` (integer)
      - `expires_at` (timestamptz) - Cache expiration
      - `created_at` (timestamptz)
    
    - `filter_performance_metrics`
      - `id` (uuid, primary key)
      - `filter_type` (text) - Type of filter (e.g., 'ringStyle', 'shape')
      - `filter_value` (text) - The specific filter value
      - `usage_count` (integer) - How many times used
      - `avg_result_count` (float) - Average results returned
      - `last_used_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own filter presets and saved searches
    - Analytics data is write-only for users, read for admins
    - Query cache is publicly readable but system-managed
    - Performance metrics are publicly readable

  3. Indexes
    - Index on user_id for fast lookup
    - Index on query_hash for cache lookup
    - Index on filter_type and filter_value for performance metrics
    - Index on expires_at for cache cleanup
*/

-- Filter Presets Table
CREATE TABLE IF NOT EXISTS filter_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_name CHECK (char_length(name) > 0 AND char_length(name) <= 100)
);

CREATE INDEX IF NOT EXISTS idx_filter_presets_user_id ON filter_presets(user_id);
CREATE INDEX IF NOT EXISTS idx_filter_presets_is_default ON filter_presets(user_id, is_default) WHERE is_default = true;

ALTER TABLE filter_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own filter presets"
  ON filter_presets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own filter presets"
  ON filter_presets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own filter presets"
  ON filter_presets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own filter presets"
  ON filter_presets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Filter Analytics Table
CREATE TABLE IF NOT EXISTS filter_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  filter_combination jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_count integer DEFAULT 0,
  query_time_ms integer DEFAULT 0,
  applied_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_filter_analytics_user_id ON filter_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_filter_analytics_session_id ON filter_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_filter_analytics_applied_at ON filter_analytics(applied_at DESC);

ALTER TABLE filter_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics"
  ON filter_analytics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own analytics"
  ON filter_analytics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Saved Searches Table
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  search_query text,
  notify_on_new boolean DEFAULT false,
  last_result_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_search_name CHECK (char_length(name) > 0 AND char_length(name) <= 100)
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_notify ON saved_searches(notify_on_new) WHERE notify_on_new = true;

ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved searches"
  ON saved_searches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own saved searches"
  ON saved_searches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved searches"
  ON saved_searches FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved searches"
  ON saved_searches FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Query Cache Table
CREATE TABLE IF NOT EXISTS query_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash text UNIQUE NOT NULL,
  query_params jsonb NOT NULL,
  result_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  result_count integer DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_hash CHECK (char_length(query_hash) > 0)
);

CREATE INDEX IF NOT EXISTS idx_query_cache_hash ON query_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_query_cache_expires_at ON query_cache(expires_at);

ALTER TABLE query_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cache"
  ON query_cache FOR SELECT
  TO anon, authenticated
  USING (expires_at > now());

-- Filter Performance Metrics Table
CREATE TABLE IF NOT EXISTS filter_performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filter_type text NOT NULL,
  filter_value text NOT NULL,
  usage_count integer DEFAULT 1,
  avg_result_count float DEFAULT 0,
  last_used_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_filter_type CHECK (char_length(filter_type) > 0),
  UNIQUE(filter_type, filter_value)
);

CREATE INDEX IF NOT EXISTS idx_filter_performance_type_value ON filter_performance_metrics(filter_type, filter_value);
CREATE INDEX IF NOT EXISTS idx_filter_performance_usage ON filter_performance_metrics(usage_count DESC);

ALTER TABLE filter_performance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read performance metrics"
  ON filter_performance_metrics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "System can update performance metrics"
  ON filter_performance_metrics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "System can modify performance metrics"
  ON filter_performance_metrics FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_filter_presets_updated_at ON filter_presets;
CREATE TRIGGER update_filter_presets_updated_at
  BEFORE UPDATE ON filter_presets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_saved_searches_updated_at ON saved_searches;
CREATE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one default preset per user
CREATE OR REPLACE FUNCTION ensure_single_default_preset()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE filter_presets
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_single_default_preset_trigger ON filter_presets;
CREATE TRIGGER ensure_single_default_preset_trigger
  BEFORE INSERT OR UPDATE ON filter_presets
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_preset();

-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM query_cache
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;
