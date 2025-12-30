import { GraphQLClient } from 'graphql-request';

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Enhanced logging for debugging (dev only)
if (import.meta.env.DEV) {
  console.log('🔍 Shopify Client Initialization:', {
    domain: SHOPIFY_DOMAIN || 'MISSING',
    hasToken: !!STOREFRONT_ACCESS_TOKEN,
    tokenLength: STOREFRONT_ACCESS_TOKEN?.length || 0,
    willInitialize: !!(SHOPIFY_DOMAIN && STOREFRONT_ACCESS_TOKEN),
    env: import.meta.env.MODE
  });
}

let shopifyClientInstance: GraphQLClient | null = null;

if (SHOPIFY_DOMAIN && STOREFRONT_ACCESS_TOKEN) {
  try {
    const apiUrl = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;

    if (import.meta.env.DEV) {
      console.log('✅ Creating Shopify GraphQL client:', apiUrl);
    }

    shopifyClientInstance = new GraphQLClient(apiUrl, {
      headers: {
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (import.meta.env.DEV) {
      console.log('✅ Shopify client initialized successfully');

      // Test connection with a simple query
      (async () => {
        try {
          const testQuery = `{ shop { name } }`;
          const result = await shopifyClientInstance.request(testQuery);
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
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ Failed to initialize Shopify client:', error);
    }
    shopifyClientInstance = null;
  }
} else {
  if (import.meta.env.DEV) {
    console.error('❌ Shopify client NOT initialized - Missing configuration:', {
      hasDomain: !!SHOPIFY_DOMAIN,
      hasToken: !!STOREFRONT_ACCESS_TOKEN
    });
  }
}

export const shopifyClient = shopifyClientInstance;
