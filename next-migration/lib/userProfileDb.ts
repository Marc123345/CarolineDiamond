import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
}

export const getUserProfile = async (userId: string): Promise<{ data: UserProfile | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    return { data, error };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error };
  }
};

export const createUserProfile = async (userId: string): Promise<{ data: UserProfile | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .insert({ id: userId })
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { data: null, error };
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: UpdateProfileData
): Promise<{ data: UserProfile | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
};

export const getOrCreateUserProfile = async (userId: string): Promise<{ data: UserProfile | null; error: any }> => {
  const { data: existingProfile, error: fetchError } = await getUserProfile(userId);

  if (existingProfile) {
    return { data: existingProfile, error: null };
  }

  if (fetchError && fetchError.code !== 'PGRST116') {
    return { data: null, error: fetchError };
  }

  return await createUserProfile(userId);
};
