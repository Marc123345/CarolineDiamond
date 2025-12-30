import { GraphQLClient } from 'graphql-request';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SHOPIFY_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

console.log('🔍 Testing Shopify Connection...\n');
console.log('Configuration:');
console.log('  Domain:', SHOPIFY_DOMAIN || 'MISSING');
console.log('  Token:', STOREFRONT_ACCESS_TOKEN ? `${STOREFRONT_ACCESS_TOKEN.substring(0, 8)}...` : 'MISSING');
console.log('  Token Length:', STOREFRONT_ACCESS_TOKEN?.length || 0);
console.log('');

if (!SHOPIFY_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
  console.error('❌ Missing required environment variables!');
  process.exit(1);
}

const apiUrl = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;
console.log('API URL:', apiUrl);
console.log('');

const client = new GraphQLClient(apiUrl, {
  headers: {
    'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  },
});

async function testConnection() {
  try {
    console.log('Testing basic shop query...');
    const shopQuery = `{ shop { name primaryDomain { url } } }`;
    const shopResult: any = await client.request(shopQuery);
    console.log('✅ Shop Connection Successful!');
    console.log('   Shop Name:', shopResult.shop.name);
    console.log('   Domain:', shopResult.shop.primaryDomain.url);
    console.log('');

    console.log('Testing products query...');
    const productsQuery = `
      query {
        products(first: 5) {
          edges {
            node {
              id
              title
              handle
              tags
              availableForSale
            }
          }
        }
      }
    `;
    const productsResult: any = await client.request(productsQuery);
    const products = productsResult.products.edges;
    console.log(`✅ Products Query Successful! Found ${products.length} products:`);
    products.forEach((edge: any, idx: number) => {
      console.log(`   ${idx + 1}. ${edge.node.title} (${edge.node.handle})`);
      console.log(`      Tags: ${edge.node.tags.join(', ')}`);
      console.log(`      Available: ${edge.node.availableForSale}`);
    });
    console.log('');
    console.log('🎉 All tests passed! Shopify connection is working correctly.');
  } catch (error: any) {
    console.error('❌ Connection test failed!');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
    process.exit(1);
  }
}

testConnection();
