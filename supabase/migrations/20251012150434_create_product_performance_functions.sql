/*
  # Product Performance Tracking Functions

  ## Overview
  Creates SQL functions to efficiently track product views, cart adds, and purchases
  with upsert logic to handle first-time tracking and updates.

  ## Functions Created
  
  1. `increment_product_views` - Track product views
  2. `increment_product_cart_adds` - Track add to cart events
  3. `increment_product_purchases` - Track purchases and revenue
  
  ## Usage
  These functions use INSERT ON CONFLICT to efficiently upsert performance data.
*/

-- Function to increment product views
CREATE OR REPLACE FUNCTION increment_product_views(
  p_product_id text,
  p_variant_id text
)
RETURNS void AS $$
BEGIN
  INSERT INTO product_performance (product_id, variant_id, views, last_viewed_at)
  VALUES (p_product_id, p_variant_id, 1, now())
  ON CONFLICT (product_id, variant_id)
  DO UPDATE SET
    views = product_performance.views + 1,
    last_viewed_at = now(),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment cart adds
CREATE OR REPLACE FUNCTION increment_product_cart_adds(
  p_product_id text,
  p_variant_id text
)
RETURNS void AS $$
BEGIN
  INSERT INTO product_performance (product_id, variant_id, cart_adds)
  VALUES (p_product_id, p_variant_id, 1)
  ON CONFLICT (product_id, variant_id)
  DO UPDATE SET
    cart_adds = product_performance.cart_adds + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment purchases and revenue
CREATE OR REPLACE FUNCTION increment_product_purchases(
  p_product_id text,
  p_variant_id text,
  p_revenue numeric
)
RETURNS void AS $$
BEGIN
  INSERT INTO product_performance (product_id, variant_id, purchases, revenue, last_purchased_at)
  VALUES (p_product_id, p_variant_id, 1, p_revenue, now())
  ON CONFLICT (product_id, variant_id)
  DO UPDATE SET
    purchases = product_performance.purchases + 1,
    revenue = product_performance.revenue + p_revenue,
    last_purchased_at = now(),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
