// Calculate energy level from mood string
export function calculateEnergyFromMood(mood: string): number {
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
