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

// API to fetch daily horoscope for a sign - using mock data immediately to be faster
export const fetchDailyHoroscope = async (sign: string): Promise<string> => {
  // Check cache first
  if (cache.dailyHoroscopes[sign] && isCacheValid(cache.dailyHoroscopes[sign].timestamp)) {
    return cache.dailyHoroscopes[sign].text;
  }

  try {
    // Skip the API call that's consistently failing and use our reliable mock data
    const horoscopeText = await fetchFromMockHoroscopeService(sign);
    
    // Cache the result
    cache.dailyHoroscopes[sign] = {
      text: horoscopeText,
      timestamp: Date.now()
    };
    
    return horoscopeText;
  } catch (error) {
    console.error("Error fetching horoscope:", error);
    return "The cosmic energies are mysterious today. Take time to reflect and trust your intuition.";
  }
};

// Get social energy level for a sign (much faster now)
export const getSocialEnergyLevel = async (sign: string): Promise<number> => {
  // Check cache first
  if (cache.socialEnergy[sign] && isCacheValid(cache.socialEnergy[sign].timestamp)) {
    return cache.socialEnergy[sign].level;
  }
  
  // Generate a deterministic but seemingly random energy level based on the sign name
  // This ensures the same sign gets the same energy level each time
  let hash = 0;
  for (let i = 0; i < sign.length; i++) {
    hash = ((hash << 5) - hash) + sign.charCodeAt(i) + new Date().getDate();
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
};

// Mock API call - used as primary source now
async function fetchFromMockHoroscopeService(sign: string): Promise<string> {
  // Minimal delay to simulate API call but keep it fast
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth();
  
  // Create different horoscopes based on the day of the month to add variety
  // but keep it deterministic so it doesn't change every reload
  const horoscopes = {
    "Aries": [
      `Today brings a fresh perspective on a longstanding issue. Trust your intuition when making important decisions, and don't be afraid to take the lead. Your energy is particularly high in the ${day % 2 === 0 ? 'morning' : 'afternoon'}, making it an ideal time to tackle challenging tasks.`,
      `The stars align to boost your confidence today. A sudden realization might change your approach to a recent challenge. Consider meditation to enhance your natural leadership abilities.`,
      `Your ruling planet Mars empowers you to overcome obstacles that have been holding you back. Someone close may need your honest feedback - deliver it with compassion.`
    ],
    "Taurus": [
      `Your practical approach will serve you well today. Financial matters take center stage, and your steady hand guides you to make sound decisions. The ${day % 2 === 0 ? 'evening' : 'morning'} hours bring a sense of peace that allows for deeper reflection.`,
      `Venus highlights your sensual nature today. Take time to appreciate beauty around you, whether in nature or art. A sturdy foundation you've built will prove its worth.`,
      `Patience bears fruit today as a long-term project finally shows promising results. Trust your body's signals about what it needs - rest or movement.`
    ],
    "Gemini": [
      `Communication flows effortlessly for you today. Share your ideas freely and make meaningful connections with others who appreciate your quick wit. Pay special attention to conversations in the ${day % 2 === 0 ? 'late afternoon' : 'early morning'}.`,
      `Mercury enhances your already sharp intellect today. Your dual nature allows you to see multiple sides of a situation that others miss. Consider journaling your thoughts.`,
      `Your adaptability becomes your superpower today. A conversation might lead to an unexpected opportunity that perfectly matches your diverse skillset.`
    ],
    "Cancer": [
      `Emotional intuition is your guide today. Listen to your inner voice and create boundaries when necessary. Focus on nurturing the relationships that truly matter, especially during the ${day % 2 === 0 ? 'evening' : 'afternoon'} hours.`,
      `The moon's position strengthens your emotional intelligence today. You'll find yourself understanding others' needs before they express them. Home improvements bring satisfaction.`,
      `Your natural protective instincts serve a loved one well today. Remember to extend that same care to yourself through self-nurturing activities.`
    ],
    "Leo": [
      `Your creative energy is at a peak today. Take time to express yourself through artistic endeavors, and don't be afraid to take center stage. The sun brings you extra vitality, particularly in the ${day % 2 === 0 ? 'morning' : 'midday'} hours.`,
      `The spotlight finds you today even if you're not seeking it. Your natural leadership inspires others to follow your example. Consider how you can use this influence positively.`,
      `Your generous spirit creates ripple effects of goodwill today. A creative block dissolves when you approach it with playfulness rather than pressure.`
    ],
    "Virgo": [
      `Your analytical skills are especially sharp today. Use this clarity to solve problems that have been lingering, but remember perfection isn't always attainable. The ${day % 2 === 0 ? 'morning' : 'evening'} brings productive energy for detailed work.`,
      `Mercury highlights your practical intelligence today. Small improvements you implement now will have long-lasting benefits. Pay attention to subtle signals in health matters.`,
      `Your ability to organize chaos into order benefits everyone around you today. Take time to appreciate the systems you've created that function so smoothly.`
    ],
    "Libra": [
      `Harmony in relationships is your focus today. You excel at finding balance and creating peaceful environments. Take time before making important decisions, especially during ${day % 2 === 0 ? 'social gatherings' : 'one-on-one conversations'}.`,
      `Venus enhances your natural charm today. Your diplomatic skills help resolve a tense situation between others. Consider updating your surroundings with beauty in mind.`,
      `Your sense of fairness makes you the perfect mediator for a disagreement today. Remember that balance also means ensuring your own needs are met.`
    ],
    "Scorpio": [
      `Your intuition runs deep today. Trust your instincts about people and situations, and consider letting go of what no longer serves your growth. Transformative energy is strongest during the ${day % 2 === 0 ? 'evening' : 'early morning'} hours.`,
      `Pluto intensifies your already powerful perceptions today. You see beneath surface appearances to true motivations. Use this insight with compassion rather than judgment.`,
      `A mystery that's been puzzling you becomes clearer today. Your passion and determination help you overcome an obstacle that would defeat others.`
    ],
    "Sagittarius": [
      `Adventure calls to you today. Embrace new opportunities for learning and exploration. Your optimistic outlook brings positive energy to those around you, especially during ${day % 2 === 0 ? 'travel or movement' : 'philosophical discussions'}.`,
      `Jupiter expands your horizons today with a new perspective on a familiar situation. Your enthusiasm inspires others to join your quest for knowledge and experience.`,
      `Your straightforward honesty is appreciated today, even if the truth is difficult. Consider how physical movement can help you process complex emotions.`
    ],
    "Capricorn": [
      `Professional achievements are highlighted today. Your disciplined approach impresses those in authority, but remember to balance work with personal time. Productive energy peaks during the ${day % 2 === 0 ? 'morning' : 'afternoon'} hours.`,
      `Saturn rewards your consistent efforts today with tangible progress toward a long-term goal. Your practical wisdom helps others navigate complicated situations.`,
      `The foundation you've been building steadily shows its strength today. Take time to acknowledge how far you've come before setting your sights on the next mountain.`
    ],
    "Aquarius": [
      `Innovative ideas flow freely today. Your unique perspective offers solutions others might miss. Connect with communities that share your vision, particularly through ${day % 2 === 0 ? 'technology' : 'group activities'}.`,
      `Uranus sparks unexpected insights today that could lead to a breakthrough in a stalled project. Your humanitarian instincts guide you toward making a positive difference.`,
      `Your ability to envision the future helps you make choices today that will benefit you long-term. Don't hesitate to share your unconventional ideas.`
    ],
    "Pisces": [
      `Your creative and spiritual energies are heightened today. Trust your intuition and set healthy boundaries. Artistic pursuits bring joy and fulfillment, especially during ${day % 2 === 0 ? 'quiet moments alone' : 'shared creative experiences'}.`,
      `Neptune deepens your connection to the collective unconscious today. Pay attention to dreams and intuitive flashes. Your compassion creates healing space for others.`,
      `The boundaries between imagination and reality blur productively today. Allow yourself to flow between practical tasks and creative daydreaming for optimal balance.`
    ]
  };
  
  // Select one of the three horoscopes based on the day of month to provide variety
  const horoscopeIndex = day % 3;
  return horoscopes[sign as keyof typeof horoscopes][horoscopeIndex] || "The stars are aligning in interesting ways for you today.";
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
