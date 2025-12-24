import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: {
    amount: string;
    currencyCode: string;
  };
}

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const shopifyStoreDomain = Deno.env.get("VITE_SHOPIFY_STORE_DOMAIN");
    const shopifyAccessToken = Deno.env.get(
      "VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN",
    );

    if (!shopifyStoreDomain || !shopifyAccessToken) {
      throw new Error("Shopify credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const shopifyEndpoint = `https://${
      shopifyStoreDomain.replace(/^https?:\/\//, "").replace(/\/$/, "")
    }/api/2024-07/graphql.json`;

    const query = `
      query getAllProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node {
              id
              handle
              title
              variants(first: 50) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    quantityAvailable
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    let allProducts: ShopifyProduct[] = [];
    let hasNextPage = true;
    let after: string | null = null;

    while (hasNextPage) {
      const response = await fetch(shopifyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": shopifyAccessToken,
        },
        body: JSON.stringify({
          query,
          variables: { first: 50, after },
        }),
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const products = data.data.products.edges.map(
        (edge: any) => edge.node,
      );
      allProducts = allProducts.concat(products);

      hasNextPage = data.data.products.pageInfo.hasNextPage;
      after = data.data.products.pageInfo.endCursor;
    }

    const snapshots: any[] = [];
    const alerts: any[] = [];
    const LOW_STOCK_THRESHOLD = 5;

    for (const product of allProducts) {
      for (const variantEdge of product.variants.edges) {
        const variant = variantEdge.node;
        const quantity = variant.quantityAvailable || 0;

        snapshots.push({
          product_id: product.id,
          variant_id: variant.id,
          sku: null,
          quantity_available: quantity,
          price: parseFloat(variant.price.amount),
        });

        if (quantity === 0) {
          alerts.push({
            product_id: product.id,
            variant_id: variant.id,
            alert_type: "out_of_stock",
            current_quantity: quantity,
            threshold: LOW_STOCK_THRESHOLD,
          });
        } else if (quantity <= LOW_STOCK_THRESHOLD) {
          alerts.push({
            product_id: product.id,
            variant_id: variant.id,
            alert_type: "low_stock",
            current_quantity: quantity,
            threshold: LOW_STOCK_THRESHOLD,
          });
        }
      }
    }

    if (snapshots.length > 0) {
      const { error: snapshotError } = await supabase
        .from("inventory_snapshots")
        .insert(snapshots);

      if (snapshotError) {
        console.error("Error inserting snapshots:", snapshotError);
      }
    }

    if (alerts.length > 0) {
      for (const alert of alerts) {
        const { data: existingAlert } = await supabase
          .from("inventory_alerts")
          .select("id")
          .eq("variant_id", alert.variant_id)
          .eq("alert_type", alert.alert_type)
          .eq("acknowledged", false)
          .maybeSingle();

        if (!existingAlert) {
          await supabase.from("inventory_alerts").insert(alert);
        }
      }
    }

    const syncResults = {
      success: true,
      timestamp: new Date().toISOString(),
      products_synced: allProducts.length,
      variants_synced: snapshots.length,
      alerts_created: alerts.length,
    };

    return new Response(JSON.stringify(syncResults), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Inventory sync error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      },
    );
  }
});