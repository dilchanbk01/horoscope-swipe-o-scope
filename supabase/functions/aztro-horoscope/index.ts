
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

    // Make the request to the Aztro API
    const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign.toLowerCase()}&day=${day.toLowerCase()}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error(`Aztro API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: "Error fetching horoscope data" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
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
