import { GraphQLClient } from 'graphql-request';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Enhanced logging for debugging (dev only)
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Shopify Client Initialization:', {
    domain: SHOPIFY_DOMAIN || 'MISSING',
    hasToken: !!STOREFRONT_ACCESS_TOKEN,
    tokenLength: STOREFRONT_ACCESS_TOKEN?.length || 0,
    willInitialize: !!(SHOPIFY_DOMAIN && STOREFRONT_ACCESS_TOKEN),
    env: process.env.NODE_ENV
  });
}

let shopifyClientInstance: GraphQLClient | null = null;

if (SHOPIFY_DOMAIN && STOREFRONT_ACCESS_TOKEN) {
  try {
    const apiUrl = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Creating Shopify GraphQL client:', apiUrl);
    }

    shopifyClientInstance = new GraphQLClient(apiUrl, {
      headers: {
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Shopify client initialized successfully');

      // Test connection with a simple query
      if (typeof window !== 'undefined') {
        (async () => {
          try {
            const testQuery = `{ shop { name } }`;
            const result = await shopifyClientInstance!.request(testQuery);
            console.log('✅ Shopify connection test successful:', result);
          } catch (testError) {
            console.error('❌ Shopify connection test failed:', {
              error: testError,
              message: testError instanceof Error ? testError.message : 'Unknown',
              name: testError instanceof Error ? testError.name : 'Unknown'
            });
          }
        })();
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Failed to initialize Shopify client:', error);
    }
    shopifyClientInstance = null;
  }
} else {
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Shopify client NOT initialized - Missing configuration:', {
      hasDomain: !!SHOPIFY_DOMAIN,
      hasToken: !!STOREFRONT_ACCESS_TOKEN
    });
  }
}

export const shopifyClient = shopifyClientInstance;
