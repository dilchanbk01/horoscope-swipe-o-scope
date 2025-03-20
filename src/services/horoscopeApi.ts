
import { ZodiacSign } from '../utils/zodiacData';
import { supabase } from '@/integrations/supabase/client';

// Cache to store API responses
interface Cache {
  dailyHoroscopes: Record<string, {text: string, timestamp: number}>;
  socialEnergy: Record<string, {level: number, timestamp: number}>;
}

const cache: Cache = {
  dailyHoroscopes: {},
  socialEnergy: {},
};

// Cache expiration in milliseconds (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Check if cache is still valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_EXPIRATION;
};

// AstroAPI configuration
const ASTRO_API_URL = 'https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily';

// API to fetch daily horoscope for a sign
export const fetchDailyHoroscope = async (sign: string): Promise<string> => {
  // Check cache first
  if (cache.dailyHoroscopes[sign] && isCacheValid(cache.dailyHoroscopes[sign].timestamp)) {
    return cache.dailyHoroscopes[sign].text;
  }

  try {
    // Convert sign to lowercase as required by the API
    const signLower = sign.toLowerCase();
    const response = await fetch(`${ASTRO_API_URL}?sign=${signLower}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const horoscopeText = data.data.horoscope_data;
    
    // Cache the result
    cache.dailyHoroscopes[sign] = {
      text: horoscopeText,
      timestamp: Date.now()
    };
    
    return horoscopeText;
  } catch (error) {
    console.error("Error fetching horoscope from API:", error);
    // Fallback to our mock data if API fails
    const fallbackText = await fetchFromMockHoroscopeService(sign);
    return fallbackText;
  }
};

// Get social energy level for a sign (using a deterministic but seemingly random approach)
export const getSocialEnergyLevel = async (sign: string): Promise<number> => {
  // Check cache first
  if (cache.socialEnergy[sign] && isCacheValid(cache.socialEnergy[sign].timestamp)) {
    return cache.socialEnergy[sign].level;
  }
  
  try {
    // We'll use the horoscope text to generate a pseudo-random but consistent energy level
    const horoscope = await fetchDailyHoroscope(sign);
    
    // Use the text to create a deterministic "random" number
    // The same horoscope text will always generate the same energy level
    let hash = 0;
    for (let i = 0; i < horoscope.length; i++) {
      hash = ((hash << 5) - hash) + horoscope.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    // Ensure the value is between 30 and 100
    const level = Math.abs(hash % 70) + 30;
    
    // Cache the result
    cache.socialEnergy[sign] = {
      level,
      timestamp: Date.now()
    };
    
    return level;
  } catch (error) {
    console.error("Error calculating social energy:", error);
    // Fallback value
    return 50;
  }
};

// Mock API call - used as fallback if the real API fails
async function fetchFromMockHoroscopeService(sign: string): Promise<string> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const horoscopes = {
    "Aries": "Today brings a fresh perspective on a longstanding issue. Trust your intuition when making important decisions, and don't be afraid to take the lead.",
    "Taurus": "Your practical approach will serve you well today. Financial matters take center stage, and your steady hand guides you to make sound decisions.",
    "Gemini": "Communication flows effortlessly for you today. Share your ideas freely and make meaningful connections with others who appreciate your quick wit.",
    "Cancer": "Emotional intuition is your guide today. Listen to your inner voice and create boundaries when necessary. Focus on nurturing the relationships that truly matter.",
    "Leo": "Your creative energy is at a peak today. Take time to express yourself through artistic endeavors, and don't be afraid to take center stage.",
    "Virgo": "Your analytical skills are especially sharp today. Use this clarity to solve problems that have been lingering, but remember perfection isn't always attainable.",
    "Libra": "Harmony in relationships is your focus today. You excel at finding balance and creating peaceful environments. Take time before making important decisions.",
    "Scorpio": "Your intuition runs deep today. Trust your instincts about people and situations, and consider letting go of what no longer serves your growth.",
    "Sagittarius": "Adventure calls to you today. Embrace new opportunities for learning and exploration. Your optimistic outlook brings positive energy to those around you.",
    "Capricorn": "Professional achievements are highlighted today. Your disciplined approach impresses those in authority, but remember to balance work with personal time.",
    "Aquarius": "Innovative ideas flow freely today. Your unique perspective offers solutions others might miss. Connect with communities that share your vision.",
    "Pisces": "Your creative and spiritual energies are heightened today. Trust your intuition and set healthy boundaries. Artistic pursuits bring joy and fulfillment."
  };
  
  return horoscopes[sign as keyof typeof horoscopes] || "The stars are aligning in interesting ways for you today.";
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
