
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredContactMethod: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    
    // Log the received form data
    console.log("Received form data:", formData);

    // Send email to the real estate agent
    const agentEmailResponse = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["Josh.Rader@McCullerProperties.com"], // Agent's email
      subject: "New Contact Form Submission",
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Message:</strong> ${formData.message}</p>
        <p><strong>Preferred Contact Method:</strong> ${formData.preferredContactMethod}</p>
      `,
    });
    
    console.log("Agent email sent:", agentEmailResponse);
    
    // Send confirmation email to the client
    const clientEmailResponse = await resend.emails.send({
      from: "McCuller Properties <onboarding@resend.dev>",
      to: [formData.email],
      subject: "Thank you for contacting McCuller Properties",
      html: `
        <h1>Thank you for contacting us, ${formData.name}!</h1>
        <p>We have received your message and will get back to you soon.</p>
        <p>Here's a summary of your inquiry:</p>
        <hr />
        <p>${formData.message}</p>
        <hr />
        <p>We'll contact you via your preferred method: ${formData.preferredContactMethod}.</p>
        <p>Best regards,<br>Josh Rader<br>McCuller Properties</p>
      `,
    });
    
    console.log("Client email sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
