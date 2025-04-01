
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Airtable API configuration
const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
const AIRTABLE_BASE_ID = Deno.env.get("AIRTABLE_BASE_ID");
const AIRTABLE_TABLE_NAME = "Contacts"; // Change this to match your table name

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

console.log("AIRTABLE_API_KEY exists:", !!AIRTABLE_API_KEY);
console.log("AIRTABLE_BASE_ID exists:", !!AIRTABLE_BASE_ID);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("Missing Airtable configuration");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }

  try {
    // Parse the request body
    console.log("Request body length:", req.headers.get("content-length"));
    const requestBody = await req.text();
    console.log("Request body preview:", requestBody.substring(0, 100));
    
    const formData = JSON.parse(requestBody);
    console.log("Processed form data:", formData);

    // Create a Supabase client using the Deno runtime
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store submission in the database first
    const { data: submissionData, error: submissionError } = await supabase
      .from("contact_submissions")
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        preferred_contact_method: formData.preferredContactMethod,
        sync_status: "processing",
      })
      .select()
      .single();

    if (submissionError) {
      console.error("Database insertion error:", submissionError);
      throw new Error(`Failed to save contact submission: ${submissionError.message}`);
    }

    // Send to Airtable
    console.log("Sending to Airtable...");
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    
    const airtableResponse = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              "Name": formData.name,
              "Email": formData.email,
              "Phone": formData.phone,
              "Message": formData.message,
              "Preferred Contact Method": formData.preferredContactMethod,
              "Submission Date": new Date().toISOString(),
            },
          },
        ],
      }),
    });

    if (!airtableResponse.ok) {
      const errorText = await airtableResponse.text();
      console.error("Airtable error:", errorText);
      throw new Error(`Airtable API error: ${airtableResponse.status} - ${errorText}`);
    }

    const airtableData = await airtableResponse.json();
    console.log("Airtable response:", airtableData);

    // Update the database record with the Airtable record ID
    if (airtableData.records && airtableData.records.length > 0) {
      const airtableRecordId = airtableData.records[0].id;
      
      const { error: updateError } = await supabase
        .from("contact_submissions")
        .update({
          airtable_record_id: airtableRecordId,
          sync_status: "completed",
        })
        .eq("id", submissionData.id);

      if (updateError) {
        console.error("Error updating record with Airtable ID:", updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact form submitted successfully to Airtable",
        submissionId: submissionData.id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
