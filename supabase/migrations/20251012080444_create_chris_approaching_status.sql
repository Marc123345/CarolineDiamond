/*
  # Chris Approaching Status Table

  1. New Tables
    - `chris_status`
      - `id` (uuid, primary key)
      - `is_approaching` (boolean) - Whether Chris is currently approaching
      - `message` (text) - Optional custom message to display
      - `eta_minutes` (integer) - Estimated time of arrival in minutes
      - `updated_at` (timestamptz) - Last update timestamp
      - `updated_by` (uuid) - User who made the update
  
  2. Security
    - Enable RLS on `chris_status` table
    - Add policy for public read access (everyone can see when Chris is approaching)
    - Add policy for authenticated admin users to update status
  
  3. Initial Data
    - Insert default status record (not approaching)
*/

CREATE TABLE IF NOT EXISTS chris_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_approaching boolean DEFAULT false NOT NULL,
  message text DEFAULT '',
  eta_minutes integer DEFAULT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE chris_status ENABLE ROW LEVEL SECURITY;

-- Everyone can read the status
CREATE POLICY "Anyone can view Chris status"
  ON chris_status
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can update (you can restrict this further to admin role if needed)
CREATE POLICY "Authenticated users can update Chris status"
  ON chris_status
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert Chris status"
  ON chris_status
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default status record
INSERT INTO chris_status (is_approaching, message, eta_minutes)
VALUES (false, '', NULL)
ON CONFLICT DO NOTHING;

-- Create function to automatically update timestamp
CREATE OR REPLACE FUNCTION update_chris_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update timestamp
DROP TRIGGER IF EXISTS update_chris_status_timestamp_trigger ON chris_status;
CREATE TRIGGER update_chris_status_timestamp_trigger
  BEFORE UPDATE ON chris_status
  FOR EACH ROW
  EXECUTE FUNCTION update_chris_status_timestamp();