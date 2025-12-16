/*
  # Enhanced Authentication Tracking and Security

  1. New Tables
    - `auth_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `device_info` (jsonb) - Browser, OS, device details
      - `ip_address` (text)
      - `location` (text, nullable) - City, country
      - `login_method` (text) - 'password', 'magic_link', 'social'
      - `is_active` (boolean)
      - `last_activity_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `auth_attempts`
      - `id` (uuid, primary key)
      - `email` (text)
      - `attempt_type` (text) - 'signin', 'signup', 'reset'
      - `success` (boolean)
      - `error_message` (text, nullable)
      - `ip_address` (text)
      - `device_info` (jsonb)
      - `attempted_at` (timestamptz)
    
    - `magic_link_tokens`
      - `id` (uuid, primary key)
      - `email` (text)
      - `token` (text, unique)
      - `used` (boolean, default false)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `password_reset_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `token` (text, unique)
      - `used` (boolean, default false)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `auth_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, unique)
      - `remember_me` (boolean, default false)
      - `session_duration_days` (integer, default 7)
      - `two_factor_enabled` (boolean, default false)
      - `email_notifications` (boolean, default true)
      - `login_alerts` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own sessions and preferences
    - Auth attempts are write-only for security
    - Rate limiting tracking

  3. Indexes
    - Index on user_id for fast lookup
    - Index on email for auth attempts
    - Index on token for magic links
    - Index on is_active for session queries
*/

-- Auth Sessions Table
CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_info jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  location text,
  login_method text NOT NULL CHECK (login_method IN ('password', 'magic_link', 'social')),
  is_active boolean DEFAULT true,
  last_activity_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_active ON auth_sessions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires ON auth_sessions(expires_at);

ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON auth_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert sessions"
  ON auth_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON auth_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auth Attempts Table
CREATE TABLE IF NOT EXISTS auth_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  attempt_type text NOT NULL CHECK (attempt_type IN ('signin', 'signup', 'reset', 'magic_link')),
  success boolean NOT NULL,
  error_message text,
  ip_address text,
  device_info jsonb DEFAULT '{}'::jsonb,
  attempted_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_attempts_email ON auth_attempts(email);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_attempted_at ON auth_attempts(attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_success ON auth_attempts(success);

ALTER TABLE auth_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert auth attempts"
  ON auth_attempts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Magic Link Tokens Table
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  used boolean DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_token ON magic_link_tokens(token);
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_email ON magic_link_tokens(email);
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_expires ON magic_link_tokens(expires_at);

ALTER TABLE magic_link_tokens ENABLE ROW LEVEL SECURITY;

-- Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token text UNIQUE NOT NULL,
  used boolean DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Auth Preferences Table
CREATE TABLE IF NOT EXISTS auth_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  remember_me boolean DEFAULT false,
  session_duration_days integer DEFAULT 7 CHECK (session_duration_days >= 1 AND session_duration_days <= 365),
  two_factor_enabled boolean DEFAULT false,
  email_notifications boolean DEFAULT true,
  login_alerts boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_preferences_user_id ON auth_preferences(user_id);

ALTER TABLE auth_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON auth_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON auth_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON auth_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE auth_sessions
  SET is_active = false
  WHERE expires_at < now()
    AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to get failed login attempts in last hour
CREATE OR REPLACE FUNCTION get_recent_failed_attempts(user_email text)
RETURNS bigint AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM auth_attempts
    WHERE email = user_email
      AND success = false
      AND attempted_at > now() - interval '1 hour'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to check if account is locked
CREATE OR REPLACE FUNCTION is_account_locked(user_email text)
RETURNS boolean AS $$
DECLARE
  failed_attempts bigint;
BEGIN
  failed_attempts := get_recent_failed_attempts(user_email);
  RETURN failed_attempts >= 5;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_auth_preferences_updated_at ON auth_preferences;
CREATE TRIGGER update_auth_preferences_updated_at
  BEFORE UPDATE ON auth_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
