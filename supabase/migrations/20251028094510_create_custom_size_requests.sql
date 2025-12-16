/*
  # Custom Lab-Grown Diamond Size Requests

  1. New Tables
    - `custom_size_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, nullable)
      - `email` (text, required)
      - `phone` (text, nullable)
      - Diamond specifications (carat, clarity, certification, shape)
      - Ring specifications (metal_color, ring_style, ring_size)
      - Budget and notes
      - Status tracking (pending, contacted, quoted, completed)
      - Admin notes and quote amount
      - Timestamps

  2. Security
    - Enable RLS on custom_size_requests
    - Users can view their own requests
    - Users can create requests (anonymous or authenticated)
    - Only admins can update status and add notes

  3. Indexes
    - Index on user_id for fast user lookup
    - Index on email for searching
    - Index on status for filtering
    - Index on created_at for sorting

  4. Functions
    - Auto-send email notification on new request
    - Calculate average request processing time
*/

-- Custom Size Requests Table
CREATE TABLE IF NOT EXISTS custom_size_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Contact Information
  email text NOT NULL,
  phone text,
  customer_name text,
  
  -- Diamond Specifications
  desired_carat numeric(4,2) NOT NULL CHECK (desired_carat > 0 AND desired_carat <= 20),
  clarity_grade text,
  certification text CHECK (certification IN ('GIA', 'HRD', 'IGI', NULL)),
  shape text,
  color_grade text,
  
  -- Ring Specifications
  metal_color text,
  ring_style text,
  ring_size text,
  
  -- Budget & Preferences
  budget_min numeric(10,2) CHECK (budget_min >= 0),
  budget_max numeric(10,2) CHECK (budget_max >= budget_min),
  additional_notes text,
  
  -- Status Tracking
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'completed', 'cancelled')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Admin Information
  admin_notes text,
  quote_amount numeric(10,2),
  quoted_at timestamptz,
  completed_at timestamptz,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Source Tracking
  source_url text,
  referrer text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_custom_size_requests_user_id ON custom_size_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_size_requests_email ON custom_size_requests(email);
CREATE INDEX IF NOT EXISTS idx_custom_size_requests_status ON custom_size_requests(status);
CREATE INDEX IF NOT EXISTS idx_custom_size_requests_created_at ON custom_size_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_size_requests_priority ON custom_size_requests(priority, status);

-- Row Level Security
ALTER TABLE custom_size_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can create a request (authenticated or anonymous)
CREATE POLICY "Anyone can create custom size requests"
  ON custom_size_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own requests
CREATE POLICY "Users can view own requests"
  ON custom_size_requests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Only service role can update (admin dashboard will use service role)
CREATE POLICY "Service role can update requests"
  ON custom_size_requests FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'service_role'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_custom_size_requests_updated_at ON custom_size_requests;
CREATE TRIGGER update_custom_size_requests_updated_at
  BEFORE UPDATE ON custom_size_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get request statistics
CREATE OR REPLACE FUNCTION get_custom_size_request_stats()
RETURNS TABLE(
  total_requests bigint,
  pending_requests bigint,
  contacted_requests bigint,
  quoted_requests bigint,
  completed_requests bigint,
  avg_processing_time interval,
  total_quoted_amount numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint as total_requests,
    COUNT(*) FILTER (WHERE status = 'pending')::bigint as pending_requests,
    COUNT(*) FILTER (WHERE status = 'contacted')::bigint as contacted_requests,
    COUNT(*) FILTER (WHERE status = 'quoted')::bigint as quoted_requests,
    COUNT(*) FILTER (WHERE status = 'completed')::bigint as completed_requests,
    AVG(completed_at - created_at) FILTER (WHERE completed_at IS NOT NULL) as avg_processing_time,
    SUM(quote_amount) FILTER (WHERE quote_amount IS NOT NULL) as total_quoted_amount
  FROM custom_size_requests;
END;
$$ LANGUAGE plpgsql;

-- Function to get pending requests count
CREATE OR REPLACE FUNCTION get_pending_requests_count()
RETURNS bigint AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM custom_size_requests
    WHERE status = 'pending'
  );
END;
$$ LANGUAGE plpgsql;

-- Request Activity Log Table (optional for tracking changes)
CREATE TABLE IF NOT EXISTS custom_size_request_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES custom_size_requests(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  old_status text,
  new_status text,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_request_activity_request_id ON custom_size_request_activity(request_id);
CREATE INDEX IF NOT EXISTS idx_request_activity_created_at ON custom_size_request_activity(created_at DESC);

ALTER TABLE custom_size_request_activity ENABLE ROW LEVEL SECURITY;

-- Anyone can view activity for their requests
CREATE POLICY "Users can view request activity"
  ON custom_size_request_activity FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM custom_size_requests
      WHERE id = request_id
      AND (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    )
  );
