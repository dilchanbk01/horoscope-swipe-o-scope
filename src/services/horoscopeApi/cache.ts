
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

// Cache expiration in milliseconds (2 hours for more frequent updates)
export const CACHE_EXPIRATION = 2 * 60 * 60 * 1000;

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
      // Check if the cache is still valid before using it
      const now = Date.now();
      
      // Filter out expired entries
      Object.keys(parsedCache.dailyHoroscopes).forEach(key => {
        if (!isCacheValid(parsedCache.dailyHoroscopes[key].timestamp)) {
          delete parsedCache.dailyHoroscopes[key];
        }
      });
      
      Object.keys(parsedCache.socialEnergy).forEach(key => {
        if (!isCacheValid(parsedCache.socialEnergy[key].timestamp)) {
          delete parsedCache.socialEnergy[key];
        }
      });
      
      // Merge with our empty cache
      cache.dailyHoroscopes = { ...parsedCache.dailyHoroscopes };
      cache.socialEnergy = { ...parsedCache.socialEnergy };
      console.log('Loaded valid cache from localStorage');
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
    console.log('Cache saved to localStorage');
  } catch (error) {
    console.error('Error saving cache to localStorage:', error);
  }
};

// Save cache more frequently
setInterval(saveCache, 30000); // Save every 30 seconds

// Save cache before the page unloads
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', saveCache);
}

// Force reload cache after certain time to ensure fresh data
export const invalidateCacheIfOld = () => {
  const lastRefresh = localStorage.getItem('zodiac_cache_last_refresh');
  const now = Date.now();
  
  // If no refresh timestamp or it's been more than 4 hours, clear cache
  if (!lastRefresh || (now - parseInt(lastRefresh, 10)) > 4 * 60 * 60 * 1000) {
    console.log('Invalidating old cache data');
    cache.dailyHoroscopes = {};
    cache.socialEnergy = {};
    localStorage.setItem('zodiac_cache_last_refresh', now.toString());
    saveCache();
    return true;
  }
  
  return false;
};

// Call invalidation check on initialization
invalidateCacheIfOld();
