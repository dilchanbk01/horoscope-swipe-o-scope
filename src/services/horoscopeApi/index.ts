import { supabase } from '@/integrations/supabase/client';
import { cache, isCacheValid } from './cache';
import { calculateEnergyFromMood } from './energyCalculation';
export { saveFavoriteSign, getFavoriteZodiacSigns, isSignFavorited } from './favorites';

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
