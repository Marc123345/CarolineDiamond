import { supabase } from './supabase';
import { MetalColor } from '../config/filterConfig';

export interface MetalColorPreference {
  id: string;
  user_id: string;
  metal_color: MetalColor;
  preference_score: number;
  view_count: number;
  click_count: number;
  filter_count: number;
  wishlist_count: number;
  last_interacted_at: string;
  created_at: string;
  updated_at: string;
}

export interface MetalColorCombination {
  id: string;
  user_id?: string;
  session_id: string;
  primary_metal: MetalColor;
  secondary_metals: MetalColor[];
  result_count: number;
  was_successful: boolean;
  created_at: string;
}

export interface MetalColorRecommendation {
  id: string;
  user_id: string;
  recommended_metal: MetalColor;
  reason: string;
  confidence_score: number;
  was_accepted: boolean;
  created_at: string;
}

export async function getUserMetalPreferences(userId: string): Promise<MetalColorPreference[]> {
  const { data, error } = await supabase
    .from('metal_color_preferences')
    .select('*')
    .eq('user_id', userId)
    .order('preference_score', { ascending: false });

  if (error) {
    console.error('Error fetching metal preferences:', error);
    return [];
  }

  return data || [];
}

export async function trackMetalColorView(
  userId: string | undefined,
  metalColor: MetalColor
): Promise<void> {
  if (!userId) return;

  const { data: existing } = await supabase
    .from('metal_color_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('metal_color', metalColor)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('metal_color_preferences')
      .update({
        view_count: existing.view_count + 1,
        last_interacted_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    await supabase.from('metal_color_preferences').insert({
      user_id: userId,
      metal_color: metalColor,
      view_count: 1,
    });
  }
}

export async function trackMetalColorClick(
  userId: string | undefined,
  metalColor: MetalColor
): Promise<void> {
  if (!userId) return;

  const { data: existing } = await supabase
    .from('metal_color_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('metal_color', metalColor)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('metal_color_preferences')
      .update({
        click_count: existing.click_count + 1,
        last_interacted_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    await supabase.from('metal_color_preferences').insert({
      user_id: userId,
      metal_color: metalColor,
      click_count: 1,
    });
  }
}

export async function trackMetalColorFilter(
  userId: string | undefined,
  metalColor: MetalColor
): Promise<void> {
  if (!userId) return;

  const { data: existing } = await supabase
    .from('metal_color_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('metal_color', metalColor)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('metal_color_preferences')
      .update({
        filter_count: existing.filter_count + 1,
        last_interacted_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    await supabase.from('metal_color_preferences').insert({
      user_id: userId,
      metal_color: metalColor,
      filter_count: 1,
    });
  }
}

export async function trackMetalColorWishlist(
  userId: string | undefined,
  metalColor: MetalColor
): Promise<void> {
  if (!userId) return;

  const { data: existing } = await supabase
    .from('metal_color_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('metal_color', metalColor)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('metal_color_preferences')
      .update({
        wishlist_count: existing.wishlist_count + 1,
        last_interacted_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    await supabase.from('metal_color_preferences').insert({
      user_id: userId,
      metal_color: metalColor,
      wishlist_count: 1,
    });
  }
}

export async function trackMetalColorCombination(
  sessionId: string,
  primaryMetal: MetalColor,
  secondaryMetals: MetalColor[],
  resultCount: number,
  userId?: string
): Promise<void> {
  await supabase.from('metal_color_combinations').insert({
    user_id: userId,
    session_id: sessionId,
    primary_metal: primaryMetal,
    secondary_metals: secondaryMetals,
    result_count: resultCount,
    was_successful: resultCount > 0,
  });
}

export async function trackEducationView(
  metalColor: MetalColor,
  educationType: 'tooltip' | 'comparison' | 'guide',
  userId?: string
): Promise<void> {
  await supabase.from('metal_color_education_views').insert({
    user_id: userId,
    metal_color: metalColor,
    education_type: educationType,
  });
}

export async function getMetalColorRecommendations(
  userId: string
): Promise<MetalColorRecommendation[]> {
  const { data, error } = await supabase
    .from('metal_color_recommendations')
    .select('*')
    .eq('user_id', userId)
    .eq('was_accepted', false)
    .order('confidence_score', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }

  return data || [];
}

export async function generateMetalColorRecommendation(
  userId: string
): Promise<MetalColorRecommendation | null> {
  const preferences = await getUserMetalPreferences(userId);

  if (preferences.length === 0) {
    const recommendation = {
      user_id: userId,
      recommended_metal: 'White Gold' as MetalColor,
      reason: 'White Gold is our most popular and versatile option, perfect for first-time buyers',
      confidence_score: 0.7,
    };

    const { data } = await supabase
      .from('metal_color_recommendations')
      .insert(recommendation)
      .select()
      .single();

    return data;
  }

  const mostPreferred = preferences[0];
  const allColors: MetalColor[] = ['White Gold', 'Yellow Gold', 'Rose Gold'];
  const notViewed = allColors.filter(
    color => !preferences.find(p => p.metal_color === color)
  );

  if (notViewed.length > 0) {
    const reasons: Record<MetalColor, string> = {
      'White Gold': `Based on your love for ${mostPreferred.metal_color}, White Gold offers a classic alternative that pairs beautifully with diamonds`,
      'Yellow Gold': `Since you prefer ${mostPreferred.metal_color}, Yellow Gold provides a timeless, warm alternative with traditional appeal`,
      'Rose Gold': `Complementing your ${mostPreferred.metal_color} preference, Rose Gold adds a romantic, modern twist to your collection`,
    };

    const recommendation = {
      user_id: userId,
      recommended_metal: notViewed[0],
      reason: reasons[notViewed[0]],
      confidence_score: 0.8,
    };

    const { data } = await supabase
      .from('metal_color_recommendations')
      .insert(recommendation)
      .select()
      .single();

    return data;
  }

  return null;
}

export async function acceptRecommendation(recommendationId: string): Promise<void> {
  await supabase
    .from('metal_color_recommendations')
    .update({ was_accepted: true })
    .eq('id', recommendationId);
}

export async function getPopularMetalCombinations(): Promise<
  Array<{
    primary_metal: MetalColor;
    secondary_metals: MetalColor[];
    combination_count: number;
    success_rate: number;
  }>
> {
  const { data, error } = await supabase.rpc('get_popular_metal_combinations', {
    limit_count: 10,
  });

  if (error) {
    console.error('Error fetching popular combinations:', error);
    return [];
  }

  return data || [];
}

export async function getMetalColorInsights(userId?: string): Promise<{
  preferredMetal: MetalColor | null;
  secondChoice: MetalColor | null;
  interactionCount: number;
  lastInteraction: string | null;
}> {
  if (!userId) {
    return {
      preferredMetal: null,
      secondChoice: null,
      interactionCount: 0,
      lastInteraction: null,
    };
  }

  const preferences = await getUserMetalPreferences(userId);

  if (preferences.length === 0) {
    return {
      preferredMetal: null,
      secondChoice: null,
      interactionCount: 0,
      lastInteraction: null,
    };
  }

  const totalInteractions = preferences.reduce(
    (sum, pref) =>
      sum + pref.view_count + pref.click_count + pref.filter_count + pref.wishlist_count,
    0
  );

  return {
    preferredMetal: preferences[0].metal_color,
    secondChoice: preferences.length > 1 ? preferences[1].metal_color : null,
    interactionCount: totalInteractions,
    lastInteraction: preferences[0].last_interacted_at,
  };
}
