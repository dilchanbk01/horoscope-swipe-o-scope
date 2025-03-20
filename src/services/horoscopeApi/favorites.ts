
import { supabase } from '@/integrations/supabase/client';

// Save user's favorite zodiac sign
export const saveFavoriteSign = async (signName: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      console.log("User not authenticated");
      return false;
    }
    
    // Check if this sign is already favorited
    const { data: existingFavorite } = await supabase
      .from('favorite_signs')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('sign_name', signName)
      .single();
      
    if (existingFavorite) {
      // Already favorited, so we'll unfavorite it
      const { error } = await supabase
        .from('favorite_signs')
        .delete()
        .eq('id', existingFavorite.id);
        
      if (error) throw error;
      return false;
    } else {
      // Not favorited yet, so add it
      const { error } = await supabase
        .from('favorite_signs')
        .insert([
          { user_id: user.user.id, sign_name: signName }
        ]);
        
      if (error) throw error;
      return true;
    }
  } catch (error) {
    console.error("Error saving favorite sign:", error);
    return false;
  }
};

// Get user's favorite zodiac signs
export const getFavoriteZodiacSigns = async (): Promise<string[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('favorite_signs')
      .select('sign_name')
      .eq('user_id', user.user.id);
      
    if (error) throw error;
    
    return data.map(item => item.sign_name);
  } catch (error) {
    console.error("Error fetching favorite signs:", error);
    return [];
  }
};

// Check if a sign is favorited by the user
export const isSignFavorited = async (signName: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('favorite_signs')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('sign_name', signName)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row Not Found"
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking if sign is favorited:", error);
    return false;
  }
};
