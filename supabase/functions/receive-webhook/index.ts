
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.34.0'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check if it's a POST request with webhook data
    if (req.method === 'POST') {
      const requestData = await req.json()
      console.log('Received webhook data:', JSON.stringify(requestData))
      
      // Store the webhook data in Supabase
      const { data, error } = await supabase
        .from('properties')
        .upsert(requestData.properties || [], { 
          onConflict: 'id',
          ignoreDuplicates: false
        })
      
      if (error) throw error
      
      return new Response(
        JSON.stringify({ success: true, message: "Webhook data stored successfully" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // If it's a GET request, retrieve the featured properties
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('featured', true)
      .limit(3)
    
    if (error) throw error
    
    console.log(`Returning ${properties?.length || 0} featured properties`)
    
    // If no properties exist, return demo properties
    if (!properties || properties.length === 0) {
      console.log('No properties found, returning demo data')
      return new Response(
        JSON.stringify({ success: true, message: "Webhook received successfully" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify(properties),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error.message)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
