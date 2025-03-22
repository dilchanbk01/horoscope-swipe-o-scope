
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Additional horoscope content to enhance the basic Aztro API responses
const enhancementsBySign = {
  aries: {
    elements: ["Your ruling planet Mars influences your energy today.", "The fire element in you shines brightly in social settings now."],
    insights: ["Take some time for physical activity to channel excess energy.", "Consider strategic planning for ongoing projects."]
  },
  taurus: {
    elements: ["Venus, your ruling planet, highlights matters of value and beauty today.", "Your earth element brings stability to chaotic situations."],
    insights: ["Focus on financial planning may yield unexpected results.", "Aesthetic pursuits will bring particular satisfaction."]
  },
  gemini: {
    elements: ["Mercury's position enhances your communication skills today.", "Your air element facilitates intellectual connections."],
    insights: ["Writing or speaking engagements will flow naturally.", "Consider exploring a new topic that's caught your interest."]
  },
  cancer: {
    elements: ["The moon, your ruler, influences your emotional landscape today.", "Your water element deepens intuitive understanding."],
    insights: ["Home improvements or family connections deserve attention.", "Trust your gut feelings about important decisions."]
  },
  leo: {
    elements: ["The sun, your ruling body, empowers your creative expression.", "Your fire element fuels passionate pursuits."],
    insights: ["Leadership opportunities may arise unexpectedly.", "Creative projects started today have special potential."]
  },
  virgo: {
    elements: ["Mercury's position highlights your analytical abilities.", "Your earth element grounds your practical thinking."],
    insights: ["Organizational tasks will be particularly satisfying today.", "Pay attention to details in health and wellness routines."]
  },
  libra: {
    elements: ["Venus influences your harmonious approach to relationships.", "Your air element facilitates balanced decision-making."],
    insights: ["Aesthetic choices made today will have lasting impact.", "Partnership matters benefit from your diplomatic touch."]
  },
  scorpio: {
    elements: ["Pluto and Mars intensify your perceptions today.", "Your water element deepens emotional connections."],
    insights: ["Research or investigation yields valuable insights.", "Transformative opportunities align with your inner vision."]
  },
  sagittarius: {
    elements: ["Jupiter expands your horizons and optimism today.", "Your fire element fuels your adventurous spirit."],
    insights: ["Educational pursuits or travel plans receive cosmic support.", "Philosophical conversations lead to meaningful revelations."]
  },
  capricorn: {
    elements: ["Saturn's influence strengthens your discipline today.", "Your earth element supports steady progress toward goals."],
    insights: ["Career initiatives benefit from structured planning.", "Long-term investments deserve your careful consideration."]
  },
  aquarius: {
    elements: ["Uranus and Saturn create a dynamic tension in your thinking.", "Your air element electrifies innovative ideas."],
    insights: ["Humanitarian efforts align with your cosmic purpose today.", "Unexpected technological solutions may present themselves."]
  },
  pisces: {
    elements: ["Neptune enhances your spiritual awareness today.", "Your water element deepens empathic connections."],
    insights: ["Artistic or musical pursuits flow with special grace.", "Meditation or quiet reflection reveals important truths."]
  }
};

// Generate a detailed horoscope when the API fails or for backup purposes
function generateFallbackHoroscope(sign, date = new Date()) {
  const signData = enhancementsBySign[sign] || {
    elements: ["The cosmic forces are affecting your sign in unique ways today."],
    insights: ["Trust your intuition as you navigate through the day."]
  };
  
  const day = date.getDate();
  const seedValue = sign + day;
  let hash = 0;
  for (let i = 0; i < seedValue.length; i++) {
    hash = ((hash << 5) - hash) + seedValue.charCodeAt(i);
    hash |= 0;
  }
  
  // Use the hash to ensure consistent but seemingly random results for the same sign/day
  const positivity = Math.abs(hash % 3); // 0 = challenging, 1 = mixed, 2 = positive
  const focusArea = Math.abs((hash >> 2) % 4); // 0 = career, 1 = relationships, 2 = health, 3 = personal growth
  const intensity = 30 + Math.abs((hash >> 4) % 70); // Energy level between 30-100
  
  // Select a random element and insight based on the hash
  const elementIndex = Math.abs((hash >> 6) % signData.elements.length);
  const insightIndex = Math.abs((hash >> 8) % signData.insights.length);
  const element = signData.elements[elementIndex];
  const insight = signData.insights[insightIndex];
  
  // Generate lucky numbers
  const luckyNumber1 = 1 + Math.abs((hash >> 10) % 99);
  const luckyNumber2 = 1 + Math.abs((hash >> 12) % 99);
  
  // Array of possible colors
  const colors = [
    "Blue", "Red", "Green", "Purple", "Yellow", "Orange", "Pink", 
    "Teal", "Gold", "Silver", "White", "Black", "Brown", "Turquoise"
  ];
  const colorIndex = Math.abs((hash >> 14) % colors.length);
  const luckyColor = colors[colorIndex];
  
  // Generate lucky time
  const hour = Math.abs((hash >> 16) % 12) + 1;
  const minute = Math.abs((hash >> 18) % 60);
  const ampm = Math.abs((hash >> 20) % 2) === 0 ? "AM" : "PM";
  const luckyTime = `${hour}:${minute < 10 ? '0' + minute : minute} ${ampm}`;
  
  // Generate compatibility
  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const compatIndex = Math.abs((hash >> 22) % zodiacSigns.length);
  const compatibility = zodiacSigns[compatIndex];
  
  // Generate mood
  const moods = [
    "Happy", "Reflective", "Energetic", "Calm", "Ambitious", "Creative", 
    "Focused", "Relaxed", "Inspired", "Determined", "Peaceful", "Enthusiastic"
  ];
  const moodIndex = Math.abs((hash >> 24) % moods.length);
  const mood = moods[moodIndex];
  
  // Focus areas based on hash
  const focusAreas = ["career and professional life", "relationships and social connections", 
                      "health and well-being", "personal growth and self-discovery"];
  
  // Tone based on positivity value
  let tone, advice;
  if (positivity === 0) {
    tone = "You may face some challenges today, but they contain valuable lessons.";
    advice = "Approach obstacles with patience and a willingness to learn.";
  } else if (positivity === 1) {
    tone = "Today brings a mix of opportunities and minor challenges.";
    advice = "Balance your energy and prioritize what truly matters.";
  } else {
    tone = "The cosmic energy flows in your favor today, creating positive openings.";
    advice = "Take initiative and embrace new possibilities that arise.";
  }
  
  // Construct the horoscope
  const horoscope = `Today your focus may be drawn to matters of ${focusAreas[focusArea]}. ${tone} ${element} ${insight} ${advice} With an energy level of ${intensity}%, pace yourself accordingly. Your lucky numbers today are ${luckyNumber1} and ${luckyNumber2}, and your lucky color is ${luckyColor}. The most auspicious time for important decisions is around ${luckyTime}. ${compatibility} energy complements yours well today.`;
  
  return {
    current_date: new Date().toISOString().split('T')[0],
    compatibility: compatibility,
    lucky_number: `${luckyNumber1}, ${luckyNumber2}`,
    lucky_time: luckyTime,
    color: luckyColor,
    date_range: "N/A", // We don't have this in our fallback
    mood: mood,
    description: horoscope,
    _usedFallback: true
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sign, day = "today" } = await req.json();
    
    // Validate the sign parameter
    const validSigns = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", 
                        "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
    
    if (!sign || !validSigns.includes(sign.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: "Invalid zodiac sign" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate the day parameter
    const validDays = ["today", "tomorrow", "yesterday"];
    if (!validDays.includes(day.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: "Invalid day parameter. Use 'today', 'tomorrow', or 'yesterday'" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    try {
      // Make the request to the Aztro API
      const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign.toLowerCase()}&day=${day.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // If the Aztro API fails, use our fallback method
        console.log(`Aztro API error: ${response.status} ${response.statusText}. Using fallback.`);
        const fallbackData = generateFallbackHoroscope(sign.toLowerCase());
        
        // Enhance the fallback data
        const normalizedSign = sign.toLowerCase();
        const enhancements = enhancementsBySign[normalizedSign];
        
        // Create a more detailed description
        if (enhancements) {
          // Already enhanced in the fallback
        }
        
        return new Response(
          JSON.stringify(fallbackData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      
      // Enhance the description with additional content
      const normalizedSign = sign.toLowerCase();
      const enhancements = enhancementsBySign[normalizedSign] || { elements: [], insights: [] };
      
      // Select random enhancements to add variation
      const elementText = enhancements.elements[Math.floor(Math.random() * enhancements.elements.length)];
      const insightText = enhancements.insights[Math.floor(Math.random() * enhancements.insights.length)];
      
      // Create a more detailed description
      data.description = `${data.description} ${elementText} ${insightText} The cosmic alignment today suggests that focusing on ${data.color}-colored objects might bring unexpected insights, especially during ${data.lucky_time}. Consider the number ${data.lucky_number.split(',')[0]} as significant in your decision-making process today.`;
      
      console.log(`Successfully fetched enhanced horoscope for ${sign} (${day})`);
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error("Error calling external API:", apiError);
      
      // Use fallback data generation if the API call fails
      const fallbackData = generateFallbackHoroscope(sign.toLowerCase());
      
      return new Response(
        JSON.stringify(fallbackData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in aztro-horoscope function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
