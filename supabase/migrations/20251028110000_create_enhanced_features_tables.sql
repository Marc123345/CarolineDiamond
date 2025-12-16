/*
  # Enhanced Features Migration

  1. New Tables
    - `user_sessions_recovery`
      - Stores session recovery data for logged-in users
      - `user_id` (uuid, foreign key)
      - `recovery_data` (jsonb)
      - `expires_at` (timestamptz)

    - `wishlist_price_alerts`
      - Tracks price changes for wishlist items
      - `user_id` (uuid, foreign key)
      - `product_id` (text)
      - `target_price` (numeric)
      - `current_price` (numeric)
      - `alert_enabled` (boolean)
      - `last_notified_at` (timestamptz)

    - `search_analytics`
      - Enhanced search tracking
      - `session_id` (text)
      - `search_query` (text)
      - `result_count` (integer)
      - `click_through_rate` (numeric)
      - `user_id` (uuid, optional)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- User Sessions Recovery Table
CREATE TABLE IF NOT EXISTS user_sessions_recovery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recovery_data jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_sessions_recovery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own session recovery"
  ON user_sessions_recovery
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Wishlist Price Alerts Table
CREATE TABLE IF NOT EXISTS wishlist_price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  product_name text NOT NULL,
  target_price numeric NOT NULL,
  current_price numeric NOT NULL,
  alert_enabled boolean DEFAULT true,
  last_notified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist_price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own price alerts"
  ON wishlist_price_alerts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own price alerts"
  ON wishlist_price_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own price alerts"
  ON wishlist_price_alerts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own price alerts"
  ON wishlist_price_alerts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Search Analytics Table
CREATE TABLE IF NOT EXISTS search_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  search_query text NOT NULL,
  result_count integer NOT NULL,
  clicked_product_id text,
  click_position integer,
  click_through_rate numeric,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert search analytics"
  ON search_analytics
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can view own search analytics"
  ON search_analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_recovery_user_id ON user_sessions_recovery(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_recovery_expires_at ON user_sessions_recovery(expires_at);
CREATE INDEX IF NOT EXISTS idx_wishlist_price_alerts_user_id ON wishlist_price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_price_alerts_product_id ON wishlist_price_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_session_id ON search_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_user_id ON search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON search_analytics(created_at);

-- Function to check for price drops
CREATE OR REPLACE FUNCTION check_price_drops()
RETURNS TABLE (
  user_id uuid,
  product_id text,
  product_name text,
  old_price numeric,
  new_price numeric,
  price_drop numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wpa.user_id,
    wpa.product_id,
    wpa.product_name,
    wpa.current_price as old_price,
    wpa.target_price as new_price,
    (wpa.current_price - wpa.target_price) as price_drop
  FROM wishlist_price_alerts wpa
  WHERE wpa.alert_enabled = true
    AND wpa.current_price > wpa.target_price
    AND (wpa.last_notified_at IS NULL OR wpa.last_notified_at < now() - interval '24 hours');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup expired session recovery data
CREATE OR REPLACE FUNCTION cleanup_expired_session_recovery()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions_recovery
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get search trends
CREATE OR REPLACE FUNCTION get_search_trends(
  days_back integer DEFAULT 7,
  limit_results integer DEFAULT 20
)
RETURNS TABLE (
  search_query text,
  search_count bigint,
  avg_result_count numeric,
  avg_ctr numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sa.search_query,
    COUNT(*) as search_count,
    AVG(sa.result_count) as avg_result_count,
    AVG(sa.click_through_rate) as avg_ctr
  FROM search_analytics sa
  WHERE sa.created_at > now() - (days_back || ' days')::interval
  GROUP BY sa.search_query
  ORDER BY search_count DESC
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
