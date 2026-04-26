// AI-powered vintage clothing price estimator using Lovable AI Gateway (Gemini vision)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EstimateRequest {
  brand: string;
  size: string;
  use: string;
  category?: string;
  notes?: string;
  photoUrls: string[]; // public URLs to images (or signed URLs)
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: EstimateRequest = await req.json();
    const { brand, size, use, category, notes, photoUrls } = body;

    if (!brand || !size || !use) {
      return new Response(
        JSON.stringify({ error: "brand, size, and use are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      {
        type: "text",
        text: `Estimate the resale value (in USD) of this second-hand clothing item at a curated vintage shop in San Jose, California (Black & Brown).

Item details:
- Brand: ${brand}
- Size: ${size}
- Category: ${category || "(not specified)"}
- Customer description of use/condition: ${use}
- Additional notes: ${notes || "(none)"}

Look closely at any provided photos and assess: visible wear, fabric quality, era/style, current resale demand, and brand desirability.

Respond by calling the provide_estimate tool with a low-end and high-end USD price, the apparent condition (Excellent / Good / Fair), and a short 2-3 sentence reasoning the customer can read.`,
      },
    ];

    for (const url of (photoUrls || []).slice(0, 4)) {
      userContent.push({ type: "image_url", image_url: { url } });
    }

    const aiBody = {
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a vintage clothing pricing expert for Black & Brown, a curated thrift store. You give fair, honest resale estimates. Always call the provide_estimate tool — never reply in plain text.",
        },
        { role: "user", content: userContent },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "provide_estimate",
            description: "Provide a structured second-hand price estimate.",
            parameters: {
              type: "object",
              properties: {
                price_low: { type: "number", description: "Low-end USD price estimate" },
                price_high: { type: "number", description: "High-end USD price estimate" },
                condition: {
                  type: "string",
                  enum: ["Excellent", "Good", "Fair"],
                  description: "Apparent condition based on photos and description",
                },
                reasoning: {
                  type: "string",
                  description: "2-3 sentence customer-friendly explanation of the estimate",
                },
              },
              required: ["price_low", "price_high", "condition", "reasoning"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "provide_estimate" } },
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aiBody),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error", response.status, text);
      return new Response(
        JSON.stringify({ error: "Failed to generate estimate" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in AI response", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "AI did not return a structured estimate" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const args = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(args), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("estimate-price error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
