/*
  # Remove Cart Items Table

  ## Summary
  Removes the `cart_items` table since we're using Shopify's cart management instead of maintaining our own cart in the database.

  ## Changes
  - Drop cart_items table and related indexes
  - Drop cart_items trigger
  - Keep wishlist_items (still needed for saved items)
  - Keep orders (needed for order history synced from Shopify)

  ## Reason
  Using Shopify's Storefront API for cart management provides:
  - Real-time inventory updates
  - Built-in tax calculations
  - Secure checkout flow
  - No data synchronization issues
*/

-- Drop cart_items trigger
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;

-- Drop cart_items index
DROP INDEX IF EXISTS idx_cart_user_id;

-- Drop cart_items table
DROP TABLE IF EXISTS cart_items CASCADE;
