/*
  # Enhanced Metal Color Tracking and Analytics

  1. New Tables
    - `metal_color_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `metal_color` (text) - 'White Gold', 'Yellow Gold', or 'Rose Gold'
      - `preference_score` (float) - Calculated preference strength (0-1)
      - `view_count` (integer) - Times viewed products with this color
      - `click_count` (integer) - Times clicked products with this color
      - `filter_count` (integer) - Times filtered by this color
      - `wishlist_count` (integer) - Times added to wishlist
      - `last_interacted_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `metal_color_combinations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, references auth.users)
      - `session_id` (text) - For anonymous tracking
      - `primary_metal` (text) - Main metal color selected
      - `secondary_metals` (text[]) - Array of additional metals
      - `result_count` (integer) - Products found with this combination
      - `was_successful` (boolean) - Whether user found products they liked
      - `created_at` (timestamptz)
    
    - `metal_color_education_views`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, references auth.users)
      - `metal_color` (text)
      - `education_type` (text) - 'tooltip', 'comparison', 'guide'
      - `viewed_at` (timestamptz)
    
    - `metal_color_recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `recommended_metal` (text)
      - `reason` (text) - Why this was recommended
      - `confidence_score` (float) - 0-1 confidence in recommendation
      - `was_accepted` (boolean, default false)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own preferences
    - Anonymous tracking through session_id
    - Recommendations are user-specific

  3. Indexes
    - Index on user_id for fast lookup
    - Index on metal_color for analytics
    - Index on session_id for anonymous tracking
*/

-- Metal Color Preferences Table
CREATE TABLE IF NOT EXISTS metal_color_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metal_color text NOT NULL CHECK (metal_color IN ('White Gold', 'Yellow Gold', 'Rose Gold')),
  preference_score float DEFAULT 0.0 CHECK (preference_score >= 0 AND preference_score <= 1),
  view_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  filter_count integer DEFAULT 0,
  wishlist_count integer DEFAULT 0,
  last_interacted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, metal_color)
);

CREATE INDEX IF NOT EXISTS idx_metal_preferences_user_id ON metal_color_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_metal_preferences_score ON metal_color_preferences(preference_score DESC);

ALTER TABLE metal_color_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own metal preferences"
  ON metal_color_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metal preferences"
  ON metal_color_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metal preferences"
  ON metal_color_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Metal Color Combinations Table
CREATE TABLE IF NOT EXISTS metal_color_combinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  primary_metal text NOT NULL CHECK (primary_metal IN ('White Gold', 'Yellow Gold', 'Rose Gold')),
  secondary_metals text[] DEFAULT ARRAY[]::text[],
  result_count integer DEFAULT 0,
  was_successful boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_metal_combinations_user_id ON metal_color_combinations(user_id);
CREATE INDEX IF NOT EXISTS idx_metal_combinations_session_id ON metal_color_combinations(session_id);
CREATE INDEX IF NOT EXISTS idx_metal_combinations_primary ON metal_color_combinations(primary_metal);

ALTER TABLE metal_color_combinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert combinations"
  ON metal_color_combinations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own combinations"
  ON metal_color_combinations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Metal Color Education Views Table
CREATE TABLE IF NOT EXISTS metal_color_education_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  metal_color text NOT NULL CHECK (metal_color IN ('White Gold', 'Yellow Gold', 'Rose Gold')),
  education_type text NOT NULL CHECK (education_type IN ('tooltip', 'comparison', 'guide')),
  viewed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_metal_education_user_id ON metal_color_education_views(user_id);
CREATE INDEX IF NOT EXISTS idx_metal_education_metal ON metal_color_education_views(metal_color);

ALTER TABLE metal_color_education_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert education views"
  ON metal_color_education_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own education history"
  ON metal_color_education_views FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Metal Color Recommendations Table
CREATE TABLE IF NOT EXISTS metal_color_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recommended_metal text NOT NULL CHECK (recommended_metal IN ('White Gold', 'Yellow Gold', 'Rose Gold')),
  reason text NOT NULL,
  confidence_score float DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  was_accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_metal_recommendations_user_id ON metal_color_recommendations(user_id);

ALTER TABLE metal_color_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations"
  ON metal_color_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON metal_color_recommendations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update preference score
CREATE OR REPLACE FUNCTION update_metal_preference_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate score based on interactions
  NEW.preference_score := LEAST(1.0, (
    (NEW.click_count * 0.4) +
    (NEW.filter_count * 0.3) +
    (NEW.wishlist_count * 0.2) +
    (NEW.view_count * 0.1)
  ) / 100.0);
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_preference_score_trigger ON metal_color_preferences;
CREATE TRIGGER update_preference_score_trigger
  BEFORE UPDATE ON metal_color_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_metal_preference_score();

-- Function to get popular metal combinations
CREATE OR REPLACE FUNCTION get_popular_metal_combinations(limit_count integer DEFAULT 10)
RETURNS TABLE (
  primary_metal text,
  secondary_metals text[],
  combination_count bigint,
  success_rate float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    mc.primary_metal,
    mc.secondary_metals,
    COUNT(*) as combination_count,
    (COUNT(*) FILTER (WHERE mc.was_successful = true)::float / NULLIF(COUNT(*), 0)) as success_rate
  FROM metal_color_combinations mc
  WHERE mc.created_at > now() - interval '90 days'
  GROUP BY mc.primary_metal, mc.secondary_metals
  ORDER BY combination_count DESC, success_rate DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
