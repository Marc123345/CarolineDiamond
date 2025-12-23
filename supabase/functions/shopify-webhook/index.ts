import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Shopify-Hmac-SHA256, X-Shopify-Topic, X-Shopify-Shop-Domain",
};

const SHOPIFY_WEBHOOK_SECRET = Deno.env.get("SHOPIFY_WEBHOOK_SECRET");

function verifyShopifyWebhook(body: string, hmacHeader: string | null): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET || !hmacHeader) {
    return false;
  }

  const hash = createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("base64");

  return hash === hmacHeader;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.text();
    const hmacHeader = req.headers.get("X-Shopify-Hmac-SHA256");
    const topic = req.headers.get("X-Shopify-Topic");
    const shopDomain = req.headers.get("X-Shopify-Shop-Domain");

    if (!verifyShopifyWebhook(body, hmacHeader)) {
      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orderData = JSON.parse(body);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (topic === "orders/create" || topic === "orders/updated") {
      const customerEmail = orderData.email;
      let userId = null;

      if (customerEmail) {
        const { data: userData } = await supabase
          .from("auth.users")
          .select("id")
          .eq("email", customerEmail)
          .maybeSingle();

        userId = userData?.id;
      }

      const orderRecord = {
        user_id: userId,
        order_number: orderData.name || orderData.order_number,
        status: orderData.financial_status === "paid" ? "processing" : "pending",
        items: orderData.line_items.map((item: any) => ({
          id: item.product_id,
          variant_id: item.variant_id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          image: item.properties?.image_url || null,
        })),
        subtotal: parseFloat(orderData.subtotal_price || "0"),
        tax: parseFloat(orderData.total_tax || "0"),
        shipping: parseFloat(orderData.total_shipping_price_set?.shop_money?.amount || "0"),
        total: parseFloat(orderData.total_price || "0"),
        shipping_info: {
          address: orderData.shipping_address,
          email: orderData.email,
          phone: orderData.phone,
        },
        payment_info: {
          gateway: orderData.payment_gateway_names?.[0] || "unknown",
          status: orderData.financial_status,
        },
        notes: orderData.note || null,
      };

      const { data, error } = await supabase
        .from("orders")
        .upsert(orderRecord, {
          onConflict: "order_number",
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving order:", error);
        return new Response(JSON.stringify({ error: "Failed to save order", details: error }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, order: data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Webhook received but not processed", topic }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal server error", message: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
