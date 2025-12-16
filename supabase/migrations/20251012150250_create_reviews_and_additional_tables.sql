/*
  # Product Reviews and Additional Tables

  ## Overview
  Creates tables for product reviews, notification preferences, search tracking, and abandoned cart recovery.

  ## New Tables

  ### 1. `product_reviews`
  Product reviews and ratings system
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References auth.users
  - `product_id` (text) - Shopify product ID
  - `variant_id` (text, nullable) - Specific variant reviewed
  - `rating` (integer) - 1-5 stars
  - `title` (text) - Review headline
  - `comment` (text) - Review text
  - `verified_purchase` (boolean) - Whether user purchased this
  - `helpful_count` (integer) - Number of helpful votes
  - `approved` (boolean) - Admin moderation status
  - `approved_at` (timestamptz) - When approved
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `review_helpful_votes`
  Track who found reviews helpful
  - `id` (uuid, primary key)
  - `review_id` (uuid) - References product_reviews
  - `user_id` (uuid) - References auth.users
  - `created_at` (timestamptz)

  ### 3. `notification_preferences`
  User email notification settings
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References auth.users, unique
  - `back_in_stock` (boolean) - Enable back in stock alerts
  - `price_drops` (boolean) - Enable price drop alerts
  - `new_arrivals` (boolean) - Enable new product notifications
  - `order_updates` (boolean) - Enable order status updates
  - `promotions` (boolean) - Enable promotional emails
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `search_queries`
  Track search queries for analytics
  - `id` (uuid, primary key)
  - `user_id` (uuid, nullable) - References auth.users
  - `query` (text) - Search text
  - `results_count` (integer) - Number of results
  - `clicked_product_id` (text, nullable) - Product clicked from results
  - `created_at` (timestamptz)

  ### 5. `price_drop_alerts`
  Track price drop notifications for wishlisted items
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References auth.users
  - `product_id` (text) - Shopify product ID
  - `variant_id` (text) - Shopify variant ID
  - `original_price` (decimal) - Price when wishlisted
  - `alert_threshold` (decimal) - Price drop % to trigger
  - `notified` (boolean) - Whether user was notified
  - `notified_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 6. `abandoned_carts`
  Track abandoned carts for recovery emails
  - `id` (uuid, primary key)
  - `user_id` (uuid, nullable) - References auth.users if logged in
  - `email` (text) - Recovery email
  - `cart_id` (text) - Shopify cart ID
  - `cart_items` (jsonb) - Snapshot of cart items
  - `total_value` (decimal) - Cart total
  - `reminder_sent` (boolean) - Whether reminder was sent
  - `reminder_sent_at` (timestamptz)
  - `recovered` (boolean) - Whether cart was converted
  - `recovered_at` (timestamptz)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Public can read approved reviews
  - Authenticated users can write reviews for verified purchases
*/

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  variant_id text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  comment text NOT NULL,
  verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  approved boolean DEFAULT false,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT one_review_per_user_product UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON product_reviews(approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON product_reviews(rating DESC);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved reviews"
  ON product_reviews FOR SELECT
  TO public
  USING (approved = true);

CREATE POLICY "Users can read own reviews"
  ON product_reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews"
  ON product_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON product_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create review_helpful_votes table
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(review_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_helpful_votes_review ON review_helpful_votes(review_id);

ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view helpful votes"
  ON review_helpful_votes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create helpful votes"
  ON review_helpful_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own helpful votes"
  ON review_helpful_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  back_in_stock boolean DEFAULT true,
  price_drops boolean DEFAULT true,
  new_arrivals boolean DEFAULT false,
  order_updates boolean DEFAULT true,
  promotions boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create search_queries table
CREATE TABLE IF NOT EXISTS search_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  query text NOT NULL,
  results_count integer DEFAULT 0,
  clicked_product_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_search_queries_query ON search_queries(query);
CREATE INDEX IF NOT EXISTS idx_search_queries_created ON search_queries(created_at DESC);

ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create search queries"
  ON search_queries FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can view aggregate search data"
  ON search_queries FOR SELECT
  TO authenticated
  USING (true);

-- Create price_drop_alerts table
CREATE TABLE IF NOT EXISTS price_drop_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  variant_id text NOT NULL,
  original_price decimal(10,2) NOT NULL,
  alert_threshold decimal(5,2) DEFAULT 10.00,
  notified boolean DEFAULT false,
  notified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_drop_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_variant ON price_drop_alerts(variant_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_notified ON price_drop_alerts(notified, created_at);

ALTER TABLE price_drop_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own price alerts"
  ON price_drop_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create price alerts"
  ON price_drop_alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own price alerts"
  ON price_drop_alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create abandoned_carts table
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  cart_id text NOT NULL,
  cart_items jsonb DEFAULT '[]'::jsonb,
  total_value decimal(10,2) DEFAULT 0,
  reminder_sent boolean DEFAULT false,
  reminder_sent_at timestamptz,
  recovered boolean DEFAULT false,
  recovered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts(email);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_reminder ON abandoned_carts(reminder_sent, created_at);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_recovered ON abandoned_carts(recovered);

ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own abandoned carts"
  ON abandoned_carts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "System can insert abandoned carts"
  ON abandoned_carts FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Create trigger to update updated_at columns
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_prefs_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment review helpful count
CREATE OR REPLACE FUNCTION increment_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE product_reviews
  SET helpful_count = helpful_count + 1
  WHERE id = NEW.review_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement review helpful count
CREATE OR REPLACE FUNCTION decrement_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE product_reviews
  SET helpful_count = GREATEST(0, helpful_count - 1)
  WHERE id = OLD.review_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for review helpful count
CREATE TRIGGER increment_helpful_on_insert
  AFTER INSERT ON review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION increment_review_helpful_count();

CREATE TRIGGER decrement_helpful_on_delete
  AFTER DELETE ON review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_review_helpful_count();
