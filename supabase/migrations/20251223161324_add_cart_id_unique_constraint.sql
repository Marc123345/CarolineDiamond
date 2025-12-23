/*
  # Add unique constraint to cart_id in abandoned_carts table

  1. Changes
    - Add unique constraint to cart_id column in abandoned_carts table
    - This ensures cart webhooks can be safely upserted without duplicates
  
  2. Notes
    - The upsert operation in the webhook handler relies on this constraint
*/

-- Add unique constraint to cart_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'abandoned_carts_cart_id_key'
  ) THEN
    ALTER TABLE abandoned_carts ADD CONSTRAINT abandoned_carts_cart_id_key UNIQUE (cart_id);
  END IF;
END $$;
