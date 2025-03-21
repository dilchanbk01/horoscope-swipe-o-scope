
// Cache implementation for horoscope data
interface Cache {
  dailyHoroscopes: Record<string, {text: string, data: any, timestamp: number}>;
  socialEnergy: Record<string, {level: number, timestamp: number}>;
}

// Initialize empty cache
export const cache: Cache = {
  dailyHoroscopes: {},
  socialEnergy: {},
};

// Cache expiration in milliseconds (4 hours)
export const CACHE_EXPIRATION = 4 * 60 * 60 * 1000;

// Check if cache is still valid
export const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_EXPIRATION;
};

// Attempt to load cached data from localStorage on initialization
try {
  const savedCache = localStorage.getItem('zodiac_data_cache');
  if (savedCache) {
    const parsedCache = JSON.parse(savedCache);
    // Validate the structure before using
    if (parsedCache.dailyHoroscopes && parsedCache.socialEnergy) {
      // Merge with our empty cache
      cache.dailyHoroscopes = { ...parsedCache.dailyHoroscopes };
      cache.socialEnergy = { ...parsedCache.socialEnergy };
      console.log('Loaded cache from localStorage');
    }
  }
} catch (error) {
  console.error('Error loading cache from localStorage:', error);
  // If there's an error, we just use the empty cache
}

// Function to save the cache to localStorage
export const saveCache = () => {
  try {
    localStorage.setItem('zodiac_data_cache', JSON.stringify(cache));
  } catch (error) {
    console.error('Error saving cache to localStorage:', error);
  }
};

// Set up periodic cache saving
setInterval(saveCache, 60000); // Save every minute

// Save cache before the page unloads
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', saveCache);
}
