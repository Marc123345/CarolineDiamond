import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckoutCompleteRequest {
  checkoutId: string;
  cartItems: Array<{
    id: string;
    productId: string;
    variantId: string;
    productTitle: string;
    variantTitle: string;
    price: number;
    quantity: number;
    totalPrice: number;
    image?: string;
  }>;
  totalPrice: number;
  customerEmail?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const requestData: CheckoutCompleteRequest = await req.json();
    const { checkoutId, cartItems, totalPrice, customerEmail } = requestData;

    if (!checkoutId || !cartItems || cartItems.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const orderData = {
      user_id: user.id,
      customer_email: customerEmail || user.email,
      order_number: orderNumber,
      shopify_checkout_id: checkoutId,
      status: "pending",
      financial_status: "pending",
      fulfillment_status: "unfulfilled",
      currency: "EUR",
      items: cartItems.map(item => ({
        id: item.productId,
        variant_id: item.variantId,
        name: item.productTitle,
        variant: item.variantTitle,
        price: item.price,
        quantity: item.quantity,
        total: item.totalPrice,
        image: item.image || null,
      })),
      subtotal: totalPrice,
      tax: 0,
      shipping: 0,
      total: totalPrice,
      shipping_info: {},
      payment_info: {
        gateway: "shopify",
        status: "pending",
      },
      tracking_info: {},
    };

    const serviceSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: order, error: orderError } = await serviceSupabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create order", 
          details: orderError.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        order: {
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          total: order.total,
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Checkout complete error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
