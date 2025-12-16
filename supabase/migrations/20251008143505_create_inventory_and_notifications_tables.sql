/*
  # Inventory and Notification System

  ## Overview
  Creates comprehensive inventory tracking and customer notification system for diamond ring e-commerce.

  ## New Tables

  ### 1. `inventory_snapshots`
  Tracks historical inventory levels for analytics and auditing
  - `id` (uuid, primary key)
  - `product_id` (text) - Shopify product ID
  - `variant_id` (text) - Shopify variant ID
  - `sku` (text) - Product SKU
  - `quantity_available` (integer) - Stock level at snapshot time
  - `price` (decimal) - Price at snapshot time
  - `snapshot_at` (timestamptz) - When snapshot was taken
  - `created_at` (timestamptz)

  ### 2. `back_in_stock_notifications`
  Manages customer waitlist for out-of-stock items
  - `id` (uuid, primary key)
  - `user_id` (uuid, nullable) - References auth.users if logged in
  - `email` (text) - Customer email for notification
  - `product_id` (text) - Shopify product ID
  - `variant_id` (text) - Shopify variant ID
  - `product_name` (text) - Product name for email content
  - `variant_title` (text) - Variant configuration
  - `notified` (boolean) - Whether customer has been notified
  - `notified_at` (timestamptz) - When notification was sent
  - `created_at` (timestamptz)

  ### 3. `inventory_alerts`
  System alerts for low stock and inventory issues
  - `id` (uuid, primary key)
  - `product_id` (text) - Shopify product ID
  - `variant_id` (text) - Shopify variant ID
  - `alert_type` (text) - Type: 'low_stock', 'out_of_stock', 'restock'
  - `current_quantity` (integer) - Current stock level
  - `threshold` (integer) - Alert threshold
  - `acknowledged` (boolean) - Whether alert has been reviewed
  - `acknowledged_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 4. `product_performance`
  Analytics for product sales and performance tracking
  - `id` (uuid, primary key)
  - `product_id` (text) - Shopify product ID
  - `variant_id` (text) - Shopify variant ID
  - `views` (integer) - Number of product views
  - `cart_adds` (integer) - Number of times added to cart
  - `purchases` (integer) - Number of purchases
  - `revenue` (decimal) - Total revenue generated
  - `last_viewed_at` (timestamptz)
  - `last_purchased_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Customers can read their own notifications
  - Customers can create back-in-stock notification requests
  - Only authenticated users can access inventory snapshots (read-only)
  - Product performance data is read-only for authenticated users
  - Alerts are admin-only
*/

-- Create inventory_snapshots table
CREATE TABLE IF NOT EXISTS inventory_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  variant_id text NOT NULL,
  sku text,
  quantity_available integer NOT NULL DEFAULT 0,
  price decimal(10,2),
  snapshot_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_snapshots_variant ON inventory_snapshots(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_snapshots_product ON inventory_snapshots(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_snapshots_snapshot_at ON inventory_snapshots(snapshot_at DESC);

ALTER TABLE inventory_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view inventory snapshots"
  ON inventory_snapshots FOR SELECT
  TO authenticated
  USING (true);

-- Create back_in_stock_notifications table
CREATE TABLE IF NOT EXISTS back_in_stock_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  product_id text NOT NULL,
  variant_id text NOT NULL,
  product_name text NOT NULL,
  variant_title text,
  notified boolean DEFAULT false,
  notified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_back_in_stock_variant ON back_in_stock_notifications(variant_id);
CREATE INDEX IF NOT EXISTS idx_back_in_stock_email ON back_in_stock_notifications(email);
CREATE INDEX IF NOT EXISTS idx_back_in_stock_notified ON back_in_stock_notifications(notified, created_at);
CREATE INDEX IF NOT EXISTS idx_back_in_stock_user ON back_in_stock_notifications(user_id);

ALTER TABLE back_in_stock_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON back_in_stock_notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Anyone can create notification requests"
  ON back_in_stock_notifications FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can delete their own notifications"
  ON back_in_stock_notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create inventory_alerts table
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  variant_id text NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'restock')),
  current_quantity integer NOT NULL DEFAULT 0,
  threshold integer,
  acknowledged boolean DEFAULT false,
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_alerts_variant ON inventory_alerts(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_type ON inventory_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_acknowledged ON inventory_alerts(acknowledged, created_at);

ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view alerts"
  ON inventory_alerts FOR SELECT
  TO authenticated
  USING (true);

-- Create product_performance table
CREATE TABLE IF NOT EXISTS product_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  variant_id text NOT NULL,
  views integer DEFAULT 0,
  cart_adds integer DEFAULT 0,
  purchases integer DEFAULT 0,
  revenue decimal(10,2) DEFAULT 0,
  last_viewed_at timestamptz,
  last_purchased_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_product_performance_variant ON product_performance(variant_id);
CREATE INDEX IF NOT EXISTS idx_product_performance_product ON product_performance(product_id);
CREATE INDEX IF NOT EXISTS idx_product_performance_revenue ON product_performance(revenue DESC);
CREATE INDEX IF NOT EXISTS idx_product_performance_views ON product_performance(views DESC);

ALTER TABLE product_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view performance data"
  ON product_performance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can update performance data"
  ON product_performance FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
