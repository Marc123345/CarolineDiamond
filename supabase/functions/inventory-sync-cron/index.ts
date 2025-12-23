import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const INVENTORY_SYNC_URL = Deno.env.get("SUPABASE_URL") + "/functions/v1/inventory-sync";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    const cronSecret = Deno.env.get("CRON_SECRET");
    const providedSecret = req.headers.get("X-Cron-Secret");

    if (cronSecret && providedSecret !== cronSecret) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid cron secret" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Starting scheduled inventory sync...");

    const response = await fetch(INVENTORY_SYNC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Inventory sync failed:", errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Inventory sync failed",
          details: errorText,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = await response.json();
    console.log("Inventory sync completed:", result);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Inventory sync completed successfully",
        result,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Cron job error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Cron job failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});