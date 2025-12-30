import { supabase } from './supabase';

export interface ChrisStatus {
  id: string;
  is_approaching: boolean;
  message: string;
  eta_minutes: number | null;
  updated_at: string;
  updated_by: string | null;
}

export const getChrisStatus = async (): Promise<{ data: ChrisStatus | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .from('chris_status')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching Chris status:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching Chris status:', error);
    return { data: null, error };
  }
};

export interface UpdateChrisStatusData {
  is_approaching: boolean;
  message?: string;
  eta_minutes?: number | null;
}

export const updateChrisStatus = async (
  updates: UpdateChrisStatusData,
  userId: string
): Promise<{ data: ChrisStatus | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    // Get the current status record
    const { data: currentStatus } = await getChrisStatus();

    if (currentStatus) {
      // Update existing record
      const { data, error } = await supabase
        .from('chris_status')
        .update({
          ...updates,
          updated_by: userId
        })
        .eq('id', currentStatus.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating Chris status:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('chris_status')
        .insert({
          ...updates,
          updated_by: userId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating Chris status:', error);
        return { data: null, error };
      }

      return { data, error: null };
    }
  } catch (error) {
    console.error('Error updating Chris status:', error);
    return { data: null, error };
  }
};
