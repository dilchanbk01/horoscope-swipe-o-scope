
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Additional horoscope content to enhance the basic Aztro API responses
const enhancementsBySign = {
  aries: {
    elements: [
      "Your ruling planet Mars is energizing your spirit today.",
      "The fire within you burns especially bright right now.",
      "Your natural leadership qualities are highlighted by today's planetary alignment."
    ],
    insights: [
      "Channel your energy into activities that require quick decisions.",
      "Consider how you can use your pioneering spirit to overcome obstacles.",
      "Your confidence may inspire others around you today."
    ],
    phrases: [
      "Today is ideal for taking the initiative in matters that have been stalled.",
      "Your competitive edge is sharpened, making this a good time for challenges.",
      "Avoid rushing into situations without considering consequences."
    ]
  },
  taurus: {
    elements: [
      "Venus, your ruling planet, enhances your appreciation for beauty today.",
      "Your earth element provides steady ground amidst changing circumstances.",
      "Your natural patience serves you well with today's planetary positions."
    ],
    insights: [
      "Focus on practical steps that bring tangible results.",
      "Trust your instincts regarding financial decisions.",
      "Your perseverance may be tested, but will ultimately reward you."
    ],
    phrases: [
      "Take time to appreciate sensory pleasures that ground you today.",
      "A creative project could benefit from your meticulous attention.",
      "Relationships may require extra nurturing under current influences."
    ]
  },
  gemini: {
    elements: [
      "Mercury's position amplifies your natural communicative abilities.",
      "Your air element brings mental clarity to complex situations.",
      "Your adaptability is your greatest strength today."
    ],
    insights: [
      "Information gathered now could prove valuable in the near future.",
      "Consider multiple perspectives before making important decisions.",
      "Your social connections may open unexpected doors."
    ],
    phrases: [
      "Your words have particular power today—choose them wisely.",
      "Learning opportunities abound if you remain curious and open-minded.",
      "Balancing various interests will help you maintain momentum."
    ]
  },
  cancer: {
    elements: [
      "The moon, your celestial ruler, heightens your emotional awareness today.",
      "Your water element deepens your intuitive understanding of others.",
      "Your nurturing nature is especially needed in your close relationships."
    ],
    insights: [
      "Trust the wisdom of your emotional responses.",
      "Creating security in your home environment may be particularly satisfying.",
      "Past experiences offer valuable lessons for current situations."
    ],
    phrases: [
      "Your sensitivity allows you to perceive undercurrents others might miss.",
      "Family connections could bring unexpected joy or insights today.",
      "Taking care of your emotional needs isn't selfish—it's necessary."
    ]
  },
  leo: {
    elements: [
      "The sun, your ruling body, illuminates your path with clarity today.",
      "Your fire element fuels your creative expression and confidence.",
      "Your natural charisma draws attention in group settings."
    ],
    insights: [
      "Leadership opportunities may arise—be ready to step forward.",
      "Creative projects begin now could have lasting impact.",
      "Generous gestures will return to you multiplied."
    ],
    phrases: [
      "Your authentic self-expression is your greatest gift to the world today.",
      "Recognition for past efforts may come from unexpected sources.",
      "Balance confidence with humility for best results in collaborative efforts."
    ]
  },
  virgo: {
    elements: [
      "Mercury's influence sharpens your analytical abilities today.",
      "Your earth element grounds your practical approach to challenges.",
      "Your attention to detail reveals solutions others might overlook."
    ],
    insights: [
      "Organizational efforts now will save time and stress later.",
      "Health routines established today could have lasting benefits.",
      "Your critical eye is valuable—just remember to apply it gently."
    ],
    phrases: [
      "Breaking large tasks into manageable steps will boost productivity.",
      "Your practical advice may be especially valuable to someone close to you.",
      "Finding the balance between perfectionism and progress is today's challenge."
    ]
  },
  libra: {
    elements: [
      "Venus, your ruling planet, heightens your appreciation for harmony today.",
      "Your air element facilitates clear thinking in relationship matters.",
      "Your diplomatic nature helps navigate tense social situations."
    ],
    insights: [
      "Artistic pursuits are favored under today's celestial influences.",
      "Finding middle ground in disagreements brings unexpected benefits.",
      "Your sense of fairness makes you a valued mediator."
    ],
    phrases: [
      "Beauty in your surroundings has a stronger impact on your mood today.",
      "Romantic connections may deepen through thoughtful conversation.",
      "Balance in all things—including self-care and caring for others—brings peace."
    ]
  },
  scorpio: {
    elements: [
      "Pluto and Mars intensify your perceptions and passions today.",
      "Your water element deepens your emotional understanding of complex situations.",
      "Your natural investigative abilities reveal hidden truths."
    ],
    insights: [
      "Trust your instincts about who to trust with sensitive information.",
      "Transformation begins with acknowledging what needs to change.",
      "Your determination carries you through challenging circumstances."
    ],
    phrases: [
      "Delving beneath surface appearances leads to valuable discoveries.",
      "Emotional honesty, especially with yourself, is liberating today.",
      "Your powerful presence influences situations even when you're silent."
    ]
  },
  sagittarius: {
    elements: [
      "Jupiter, your ruling planet, expands your horizons and optimism today.",
      "Your fire element energizes your quest for meaning and truth.",
      "Your philosophical nature sees the bigger picture in current events."
    ],
    insights: [
      "Educational pursuits bring particular satisfaction now.",
      "Travel plans may have unexpected benefits beyond enjoyment.",
      "Your enthusiasm inspires others to break free of limitations."
    ],
    phrases: [
      "Speaking your truth with tact opens minds and hearts.",
      "Adventure calls—even a small deviation from routine refreshes your spirit.",
      "Your natural optimism helps others see possibilities where they saw obstacles."
    ]
  },
  capricorn: {
    elements: [
      "Saturn, your ruling planet, strengthens your resolve and discipline today.",
      "Your earth element grounds your ambitious pursuits in practical reality.",
      "Your natural authority earns respect in professional settings."
    ],
    insights: [
      "Long-term planning now creates future stability.",
      "Traditions provide comfort and connection during uncertain times.",
      "Your measured approach to challenges leads to lasting solutions."
    ],
    phrases: [
      "Patience with the process brings rewards in due time.",
      "Your reliability makes you the foundation others build upon.",
      "Achievement comes through consistent effort rather than shortcuts."
    ]
  },
  aquarius: {
    elements: [
      "Uranus and Saturn create an interesting tension between innovation and tradition in your chart today.",
      "Your air element facilitates breakthrough thinking on old problems.",
      "Your humanitarian instincts guide you toward meaningful contributions."
    ],
    insights: [
      "Technology used mindfully enhances your unique abilities.",
      "Group collaborations highlight your valuable perspective.",
      "Independence balanced with interconnection creates your ideal environment."
    ],
    phrases: [
      "Your unconventional approach is exactly what's needed in a particular situation today.",
      "Friendships that honor your authenticity deserve special attention now.",
      "The future you envision becomes more possible through small actions today."
    ]
  },
  pisces: {
    elements: [
      "Neptune, your ruling planet, heightens your imagination and spiritual awareness today.",
      "Your water element connects you deeply to collective emotions and dreams.",
      "Your compassionate nature brings healing to difficult situations."
    ],
    insights: [
      "Creative visualization has particular power under today's celestial influences.",
      "Boundaries protect your sensitive spirit from unnecessary drain.",
      "Intuitive flashes contain valuable guidance—note them for future reference."
    ],
    phrases: [
      "Music, art, or poetry may express what words alone cannot capture for you today.",
      "Compassion for yourself creates space for genuine compassion toward others.",
      "The dream world offers insights into your waking questions."
    ]
  }
};

// Generate a detailed horoscope when the API fails or for backup purposes
function generateFallbackHoroscope(sign, date = new Date()) {
  const signData = enhancementsBySign[sign] || {
    elements: ["The cosmic forces are affecting your sign in unique ways today."],
    insights: ["Trust your intuition as you navigate through the day."],
    phrases: ["Today brings both challenges and opportunities for growth."]
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
  
  // Select specific elements, insights, and phrases for variety
  const elementIndex = Math.abs((hash >> 6) % signData.elements.length);
  const insightIndex = Math.abs((hash >> 8) % signData.insights.length);
  const phraseIndex = Math.abs((hash >> 10) % signData.phrases.length);
  
  const element = signData.elements[elementIndex];
  const insight = signData.insights[insightIndex];
  const phrase = signData.phrases[phraseIndex];
  
  // Generate lucky numbers
  const luckyNumber1 = 1 + Math.abs((hash >> 12) % 99);
  const luckyNumber2 = 1 + Math.abs((hash >> 14) % 99);
  
  // Array of possible colors
  const colors = [
    "Blue", "Red", "Green", "Purple", "Yellow", "Orange", "Pink", 
    "Teal", "Gold", "Silver", "White", "Black", "Brown", "Turquoise"
  ];
  const colorIndex = Math.abs((hash >> 16) % colors.length);
  const luckyColor = colors[colorIndex];
  
  // Generate lucky time
  const hour = Math.abs((hash >> 18) % 12) + 1;
  const minute = Math.abs((hash >> 20) % 60);
  const ampm = Math.abs((hash >> 22) % 2) === 0 ? "AM" : "PM";
  const luckyTime = `${hour}:${minute < 10 ? '0' + minute : minute} ${ampm}`;
  
  // Generate compatibility
  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const compatIndex = Math.abs((hash >> 24) % zodiacSigns.length);
  const compatibility = zodiacSigns[compatIndex];
  
  // Generate mood
  const moods = [
    "Happy", "Reflective", "Energetic", "Calm", "Ambitious", "Creative", 
    "Focused", "Relaxed", "Inspired", "Determined", "Peaceful", "Enthusiastic"
  ];
  const moodIndex = Math.abs((hash >> 26) % moods.length);
  const mood = moods[moodIndex];
  
  // Focus areas based on hash
  const focusAreas = ["career and professional life", "relationships and social connections", 
                      "health and well-being", "personal growth and self-discovery"];
  
  // Tone based on positivity value
  let tone, advice;
  if (positivity === 0) {
    tone = "The stars suggest some challenges today, but they contain valuable lessons.";
    advice = "Approach obstacles with patience and a willingness to learn.";
  } else if (positivity === 1) {
    tone = "Today brings a mix of opportunities and minor challenges.";
    advice = "Balance your energy and prioritize what truly matters.";
  } else {
    tone = "The cosmic energy flows in your favor today, creating positive openings.";
    advice = "Take initiative and embrace the possibilities that arise.";
  }
  
  // Construct the horoscope with more variety and personalization
  const intro = [
    `As a ${sign}, your natural ${positivity === 2 ? 'strengths' : 'tendencies'} are highlighted today.`,
    `The stars align in a way that particularly affects ${sign} natives today.`,
    `For ${sign}, today's cosmic weather brings interesting developments.`
  ][Math.abs((hash >> 28) % 3)];
  
  const horoscope = `${intro} ${tone} ${element} Your focus may be drawn to matters of ${focusAreas[focusArea]}. ${phrase} ${insight} ${advice} With an energy level of ${intensity}%, pace yourself accordingly and trust your instincts about when to push forward and when to rest.`;
  
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

// Add variety to horoscope texts to make them feel more unique
function enhanceHoroscopeDescription(sign, baseDescription) {
  const signData = enhancementsBySign[sign.toLowerCase()];
  if (!signData) return baseDescription;
  
  const date = new Date();
  const day = date.getDate();
  const seedValue = sign + day;
  let hash = 0;
  for (let i = 0; i < seedValue.length; i++) {
    hash = ((hash << 5) - hash) + seedValue.charCodeAt(i);
    hash |= 0;
  }
  
  // Select random enhancement elements
  const elementIndex = Math.abs(hash % signData.elements.length);
  const insightIndex = Math.abs((hash >> 2) % signData.insights.length);
  const phraseIndex = Math.abs((hash >> 4) % signData.phrases.length);
  
  const element = signData.elements[elementIndex];
  const insight = signData.insights[insightIndex];
  const phrase = signData.phrases[phraseIndex];
  
  // Create variety in the text structure
  const templates = [
    `${baseDescription} ${element} ${insight}`,
    `${element} ${baseDescription} ${phrase}`,
    `${phrase} ${baseDescription} ${insight}`,
    `Today for ${sign}, ${baseDescription} ${element}`
  ];
  
  const templateIndex = Math.abs((hash >> 6) % templates.length);
  return templates[templateIndex];
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
        
        return new Response(
          JSON.stringify(fallbackData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      
      // Enhance the description with additional content for variety
      const normalizedSign = sign.toLowerCase();
      data.description = enhanceHoroscopeDescription(normalizedSign, data.description);
      
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
