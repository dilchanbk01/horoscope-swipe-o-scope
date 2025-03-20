
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    console.log(`Successfully fetched horoscope for ${sign} (${day})`);
    
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
