
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

// Cache expiration in milliseconds (2 hours)
export const CACHE_EXPIRATION = 2 * 60 * 60 * 1000;

// Check if cache is still valid
export const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_EXPIRATION;
};
