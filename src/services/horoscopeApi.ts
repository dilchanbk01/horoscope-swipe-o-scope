import { supabase } from '@/integrations/supabase/client';

// Cache to store API responses
interface Cache {
  dailyHoroscopes: Record<string, {text: string, data: any, timestamp: number}>;
  socialEnergy: Record<string, {level: number, timestamp: number}>;
}

const cache: Cache = {
  dailyHoroscopes: {},
  socialEnergy: {},
};

// Cache expiration in milliseconds (2 hours)
const CACHE_EXPIRATION = 2 * 60 * 60 * 1000;

// Check if cache is still valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_EXPIRATION;
};

// API to fetch daily horoscope for a sign using Aztro API
export const fetchDailyHoroscope = async (sign: string): Promise<string> => {
  // Normalize sign name for API (lowercase)
  const normalizedSign = sign.toLowerCase();
  
  // Check cache first
  if (cache.dailyHoroscopes[normalizedSign] && isCacheValid(cache.dailyHoroscopes[normalizedSign].timestamp)) {
    return cache.dailyHoroscopes[normalizedSign].text;
  }

  try {
    // Call our Supabase Edge Function that interfaces with the Aztro API
    const { data, error } = await supabase.functions.invoke("aztro-horoscope", {
      body: { sign: normalizedSign, day: "today" }
    });

    if (error) {
      console.error("Error calling Aztro API via edge function:", error);
      throw new Error(error.message);
    }

    // Format the horoscope text
    const horoscopeText = data.description || "The cosmic energies are mysterious today.";
    
    // Add some additional context based on other Aztro data
    const enhancedHoroscope = `${horoscopeText} Your lucky time today is ${data.lucky_time}, and your lucky color is ${data.color}.`;
    
    // Cache the result
    cache.dailyHoroscopes[normalizedSign] = {
      text: enhancedHoroscope,
      data: data,
      timestamp: Date.now()
    };
    
    return enhancedHoroscope;
  } catch (error) {
    console.error("Error fetching horoscope:", error);
    return "The cosmic forces are currently unpredictable. Take time to reflect and trust your intuition today.";
  }
};

// Get social energy level for a sign (derived from Aztro mood and compatibility)
export const getSocialEnergyLevel = async (sign: string): Promise<number> => {
  // Normalize sign name
  const normalizedSign = sign.toLowerCase();
  
  // Check cache first
  if (cache.socialEnergy[normalizedSign] && isCacheValid(cache.socialEnergy[normalizedSign].timestamp)) {
    return cache.socialEnergy[normalizedSign].level;
  }
  
  try {
    // If we already have the horoscope data in cache, use that instead of making another API call
    if (cache.dailyHoroscopes[normalizedSign] && isCacheValid(cache.dailyHoroscopes[normalizedSign].timestamp)) {
      const aztroData = cache.dailyHoroscopes[normalizedSign].data;
      
      // Calculate energy level based on mood and compatibility
      const moodEnergy = calculateEnergyFromMood(aztroData.mood);
      const level = Math.min(Math.max(moodEnergy, 30), 100); // Ensure between 30-100
      
      // Cache the result
      cache.socialEnergy[normalizedSign] = {
        level,
        timestamp: Date.now()
      };
      
      return level;
    }
    
    // Otherwise, get fresh data from API
    const { data, error } = await supabase.functions.invoke("aztro-horoscope", {
      body: { sign: normalizedSign, day: "today" }
    });

    if (error) {
      console.error("Error calling Aztro API via edge function:", error);
      throw new Error(error.message);
    }
    
    // Calculate energy based on the mood value from Aztro
    const moodEnergy = calculateEnergyFromMood(data.mood);
    const level = Math.min(Math.max(moodEnergy, 30), 100); // Ensure between 30-100
    
    // Cache the result
    cache.socialEnergy[normalizedSign] = {
      level,
      timestamp: Date.now()
    };
    
    return level;
  } catch (error) {
    console.error("Error calculating social energy:", error);
    
    // Generate a deterministic but seemingly random energy level based on the sign name
    // as a fallback when the API fails
    let hash = 0;
    for (let i = 0; i < sign.length; i++) {
      hash = ((hash << 5) - hash) + sign.charCodeAt(i) + new Date().getDate();
      hash |= 0; // Convert to 32bit integer
    }
    
    // Ensure the value is between 30 and 100
    return Math.abs(hash % 70) + 30;
  }
};

// Helper function to calculate energy level from mood string
function calculateEnergyFromMood(mood: string): number {
  if (!mood) return 65; // Default energy level
  
  // Normalize the mood string
  const normalizedMood = mood.toLowerCase().trim();
  
  // Map various moods to energy levels
  const moodMap: Record<string, number> = {
    'happy': 85,
    'cheerful': 90,
    'excited': 95,
    'energetic': 100,
    'enthusiastic': 90,
    'motivated': 85,
    'inspired': 80,
    'content': 75,
    'relaxed': 70,
    'calm': 65,
    'balanced': 60,
    'neutral': 50,
    'mixed': 55,
    'uncertain': 45,
    'cautious': 40,
    'reserved': 45,
    'tired': 35,
    'exhausted': 30,
    'stressed': 40,
    'anxious': 45,
    'worried': 50,
    'sad': 35,
    'depressed': 30
  };
  
  // Check if the mood matches any key exactly
  if (normalizedMood in moodMap) {
    return moodMap[normalizedMood];
  }
  
  // Otherwise, check if the mood contains any of the keys
  for (const [key, value] of Object.entries(moodMap)) {
    if (normalizedMood.includes(key)) {
      return value;
    }
  }
  
  // Default fallback
  return 65;
}

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
