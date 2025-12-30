import { supabase } from './supabase';

export interface AuthSession {
  id: string;
  user_id: string;
  device_info: {
    browser?: string;
    os?: string;
    device?: string;
  };
  ip_address?: string;
  location?: string;
  login_method: 'password' | 'magic_link' | 'social';
  is_active: boolean;
  last_activity_at: string;
  expires_at: string;
  created_at: string;
}

export interface AuthPreferences {
  id: string;
  user_id: string;
  remember_me: boolean;
  session_duration_days: number;
  two_factor_enabled: boolean;
  email_notifications: boolean;
  login_alerts: boolean;
  created_at: string;
  updated_at: string;
}

export async function trackAuthAttempt(
  email: string,
  attemptType: 'signin' | 'signup' | 'reset' | 'magic_link',
  success: boolean,
  errorMessage?: string
): Promise<void> {
  const deviceInfo = getDeviceInfo();

  await supabase.from('auth_attempts').insert({
    email,
    attempt_type: attemptType,
    success,
    error_message: errorMessage,
    device_info: deviceInfo,
  });
}

export async function createAuthSession(
  userId: string,
  loginMethod: 'password' | 'magic_link' | 'social',
  rememberMe: boolean = false
): Promise<AuthSession | null> {
  const deviceInfo = getDeviceInfo();
  const sessionDuration = rememberMe ? 30 : 7;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + sessionDuration);

  const { data, error } = await supabase
    .from('auth_sessions')
    .insert({
      user_id: userId,
      device_info: deviceInfo,
      login_method: loginMethod,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating auth session:', error);
    return null;
  }

  return data;
}

export async function getUserSessions(userId: string): Promise<AuthSession[]> {
  const { data, error } = await supabase
    .from('auth_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('last_activity_at', { ascending: false });

  if (error) {
    console.error('Error fetching user sessions:', error);
    return [];
  }

  return data || [];
}

export async function terminateSession(sessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('auth_sessions')
    .update({ is_active: false })
    .eq('id', sessionId);

  if (error) {
    console.error('Error terminating session:', error);
    return false;
  }

  return true;
}

export async function terminateAllSessions(userId: string, exceptCurrentSession?: string): Promise<boolean> {
  let query = supabase
    .from('auth_sessions')
    .update({ is_active: false })
    .eq('user_id', userId);

  if (exceptCurrentSession) {
    query = query.neq('id', exceptCurrentSession);
  }

  const { error } = await query;

  if (error) {
    console.error('Error terminating sessions:', error);
    return false;
  }

  return true;
}

export async function updateSessionActivity(sessionId: string): Promise<void> {
  await supabase
    .from('auth_sessions')
    .update({ last_activity_at: new Date().toISOString() })
    .eq('id', sessionId);
}

export async function getAuthPreferences(userId: string): Promise<AuthPreferences | null> {
  const { data, error } = await supabase
    .from('auth_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching auth preferences:', error);
    return null;
  }

  if (!data) {
    const defaultPrefs = await createDefaultAuthPreferences(userId);
    return defaultPrefs;
  }

  return data;
}

export async function createDefaultAuthPreferences(userId: string): Promise<AuthPreferences | null> {
  const { data, error } = await supabase
    .from('auth_preferences')
    .insert({
      user_id: userId,
      remember_me: false,
      session_duration_days: 7,
      two_factor_enabled: false,
      email_notifications: true,
      login_alerts: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating default preferences:', error);
    return null;
  }

  return data;
}

export async function updateAuthPreferences(
  userId: string,
  preferences: Partial<Omit<AuthPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<AuthPreferences | null> {
  const { data, error } = await supabase
    .from('auth_preferences')
    .update(preferences)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating auth preferences:', error);
    return null;
  }

  return data;
}

export async function checkAccountLocked(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_account_locked', {
    user_email: email,
  });

  if (error) {
    console.error('Error checking account lock:', error);
    return false;
  }

  return data || false;
}

export async function getFailedAttempts(email: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_recent_failed_attempts', {
    user_email: email,
  });

  if (error) {
    console.error('Error getting failed attempts:', error);
    return 0;
  }

  return data || 0;
}

export async function getAuthAnalytics(userId: string): Promise<{
  totalLogins: number;
  lastLogin: string | null;
  activeSessions: number;
  recentAttempts: number;
}> {
  const [sessions, attempts] = await Promise.all([
    getUserSessions(userId),
    supabase
      .from('auth_attempts')
      .select('*', { count: 'exact' })
      .eq('success', true)
      .gte('attempted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const lastSession = sessions[0];

  return {
    totalLogins: attempts.count || 0,
    lastLogin: lastSession?.last_activity_at || null,
    activeSessions: sessions.length,
    recentAttempts: attempts.count || 0,
  };
}

function getDeviceInfo(): {
  browser?: string;
  os?: string;
  device?: string;
} {
  const userAgent = navigator.userAgent;
  const deviceInfo: {
    browser?: string;
    os?: string;
    device?: string;
  } = {};

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    deviceInfo.browser = 'Chrome';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    deviceInfo.browser = 'Safari';
  } else if (userAgent.includes('Firefox')) {
    deviceInfo.browser = 'Firefox';
  } else if (userAgent.includes('Edg')) {
    deviceInfo.browser = 'Edge';
  } else {
    deviceInfo.browser = 'Unknown';
  }

  // Detect OS
  if (userAgent.includes('Windows')) {
    deviceInfo.os = 'Windows';
  } else if (userAgent.includes('Mac')) {
    deviceInfo.os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    deviceInfo.os = 'Linux';
  } else if (userAgent.includes('Android')) {
    deviceInfo.os = 'Android';
  } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    deviceInfo.os = 'iOS';
  } else {
    deviceInfo.os = 'Unknown';
  }

  // Detect device type
  if (/Mobile|Android|iPhone|iPad|iPod/.test(userAgent)) {
    deviceInfo.device = 'Mobile';
  } else if (/Tablet|iPad/.test(userAgent)) {
    deviceInfo.device = 'Tablet';
  } else {
    deviceInfo.device = 'Desktop';
  }

  return deviceInfo;
}

export async function sendMagicLink(email: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    await trackAuthAttempt(email, 'magic_link', !error, error?.message);

    return { error };
  } catch (err) {
    return { error: err as Error };
  }
}
