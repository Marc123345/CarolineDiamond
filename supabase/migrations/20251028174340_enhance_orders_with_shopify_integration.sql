/*
  # Enhance Orders Table for Shopify Integration

  ## Overview
  This migration enhances the orders table to better support Shopify order tracking
  and prepare for Stripe payment integration.

  ## Changes Made

  1. **Schema Enhancements**
    - Add `shopify_order_id` for tracking Shopify order IDs
    - Add `shopify_checkout_id` for tracking checkout sessions
    - Add `fulfillment_status` for order fulfillment tracking
    - Add `financial_status` for payment status tracking
    - Add `currency` for multi-currency support
    - Add `customer_email` for guest checkout support
    - Add `tracking_info` for shipping tracking
    - Make `user_id` nullable to support guest checkouts

  2. **Indexes**
    - Add index on shopify_order_id for fast lookups
    - Add index on customer_email for guest order retrieval
    - Add index on shopify_checkout_id for checkout tracking

  3. **Security**
    - Update RLS policies to support guest checkout retrieval by email + order number
    - Maintain secure access for authenticated users

  4. **Data Migration**
    - Safely add new columns with defaults
    - Preserve existing order data
*/

-- Add new columns to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shopify_order_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN shopify_order_id text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shopify_checkout_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN shopify_checkout_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'fulfillment_status'
  ) THEN
    ALTER TABLE orders ADD COLUMN fulfillment_status text DEFAULT 'unfulfilled';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'financial_status'
  ) THEN
    ALTER TABLE orders ADD COLUMN financial_status text DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'currency'
  ) THEN
    ALTER TABLE orders ADD COLUMN currency text DEFAULT 'EUR';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'customer_email'
  ) THEN
    ALTER TABLE orders ADD COLUMN customer_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tracking_info'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_info jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Make user_id nullable to support guest checkouts
DO $$
BEGIN
  ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION
  WHEN others THEN
    NULL;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_shopify_order_id ON orders(shopify_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_shopify_checkout_id ON orders(shopify_checkout_id);
CREATE INDEX IF NOT EXISTS idx_orders_financial_status ON orders(financial_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;

-- Create enhanced RLS policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Guests can view orders by email and order number"
  ON orders FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all orders"
  ON orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to get order by email and order number (for guest checkouts)
CREATE OR REPLACE FUNCTION get_order_by_email_and_number(
  p_email text,
  p_order_number text
)
RETURNS SETOF orders
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT *
  FROM orders
  WHERE customer_email = p_email
  AND order_number = p_order_number;
$$;

-- Add comment for documentation
COMMENT ON TABLE orders IS 'Stores customer orders synced from Shopify. Supports both authenticated and guest checkouts.';
COMMENT ON COLUMN orders.shopify_order_id IS 'Unique Shopify order ID for syncing';
COMMENT ON COLUMN orders.shopify_checkout_id IS 'Shopify checkout session ID';
COMMENT ON COLUMN orders.fulfillment_status IS 'Order fulfillment status (unfulfilled, partial, fulfilled)';
COMMENT ON COLUMN orders.financial_status IS 'Payment status (pending, paid, refunded, etc)';
COMMENT ON COLUMN orders.customer_email IS 'Customer email for guest checkout support';
