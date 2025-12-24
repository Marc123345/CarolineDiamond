import { supabase } from './supabase';

export async function trackMetalColorFilter(userId: string, metalColor: string) {
  try {
    const { error } = await supabase
      .from('metal_color_analytics')
      .insert({
        user_id: userId,
        metal_color: metalColor,
        action: 'filter_applied',
        timestamp: new Date().toISOString()
      });

    if (error && error.code !== '42P01') {
      console.error('Error tracking metal color filter:', error);
    }
  } catch (error) {
    console.error('Error tracking metal color filter:', error);
  }
}

export async function getUserMetalColorPreferences(userId: string) {
  try {
    const { data, error } = await supabase
      .from('metal_color_analytics')
      .select('metal_color, count')
      .eq('user_id', userId)
      .order('count', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching metal color preferences:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching metal color preferences:', error);
    return [];
  }
}

export async function getPopularMetalColors() {
  try {
    const { data, error } = await supabase
      .from('metal_color_analytics')
      .select('metal_color, count')
      .order('count', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching popular metal colors:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching popular metal colors:', error);
    return [];
  }
}
