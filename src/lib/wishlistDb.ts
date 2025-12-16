import { supabase } from './supabase';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
}

export const addToWishlistDb = async (item: WishlistItem): Promise<{ error: Error | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        product_image: item.image,
        product_category: item.category
      });

    if (error) {
      if (error.code === '23505') {
        return { error: null };
      }
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const removeFromWishlistDb = async (productId: string): Promise<{ error: Error | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};
