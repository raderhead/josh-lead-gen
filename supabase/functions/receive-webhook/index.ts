
import { serve } from "https://deno.land/std@0.210.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

// Set up CORS headers
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
    // Set up the Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://xfmguaamogzirnnqktwz.supabase.co';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'GET') {
      // Handle GET request - return all properties
      const { data, error } = await supabase
        .from('properties')
        .select('*');

      if (error) {
        console.error('Error fetching properties:', error);
        return new Response(
          JSON.stringify({ success: false, message: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    else if (req.method === 'POST') {
      // Handle POST request - store incoming property data
      const propertyData = await req.json();
      console.log('Received property data:', propertyData);

      // Generate a unique ID if not provided
      const id = propertyData.id || crypto.randomUUID();

      // Define the data to insert
      const propertyRecord = {
        id,
        title: propertyData.title || `Property at ${propertyData.address || 'Unknown Location'}`,
        address: propertyData.address || null,
        description: propertyData.description || null,
        price: String(propertyData.price) || null,
        size: String(propertyData.sqft) || null,
        type: propertyData.propertyType || null,
        image_url: Array.isArray(propertyData.images) && propertyData.images.length > 0 
          ? propertyData.images[0] 
          : null,
        featured: propertyData.isFeatured || true,
        received_at: new Date().toISOString(),
      };

      // Insert the property data
      const { data, error } = await supabase
        .from('properties')
        .upsert(propertyRecord, { onConflict: 'id' })
        .select();

      if (error) {
        console.error('Error storing property data:', error);
        return new Response(
          JSON.stringify({ success: false, message: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Property data stored successfully', data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return error for other methods
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
