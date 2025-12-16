#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { writeFileSync, readFileSync } from 'fs';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_TOKEN || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/graphql.json`;

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
}

async function shopifyAdminRequest(query: string, variables?: any) {
  const response = await fetch(ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

async function translateText(text: string): Promise<string> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        text,
        source: 'en',
        target: 'nl',
        context: 'product description for luxury diamond jewelry'
      }),
    });

    if (!response.ok) {
      console.warn(`Translation API error: ${response.status}`);
      return text; // Return original text if translation fails
    }

    const result = await response.json();
    return result.translatedText || text;
  } catch (error) {
    console.warn('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

async function getAllProducts(): Promise<Product[]> {
  const query = `
    query GetProducts($cursor: String) {
      products(first: 50, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            description
            handle
          }
        }
      }
    }
  `;

  let hasNextPage = true;
  let cursor: string | null = null;
  const allProducts: Product[] = [];

  while (hasNextPage) {
    const result = await shopifyAdminRequest(query, { cursor });
    const products = result.data.products.edges.map((edge: any) => edge.node);
    allProducts.push(...products);

    hasNextPage = result.data.products.pageInfo.hasNextPage;
    cursor = result.data.products.pageInfo.endCursor;
  }

  return allProducts;
}

async function updateProductDescription(productId: string, dutchDescription: string) {
  const mutation = `
    mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          descriptionHtml
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      id: productId,
      descriptionHtml: dutchDescription.replace(/\n/g, '<br/>')
    }
  };

  const result = await shopifyAdminRequest(mutation, variables);

  if (result.data.productUpdate.userErrors.length > 0) {
    throw new Error(JSON.stringify(result.data.productUpdate.userErrors));
  }

  return result.data.productUpdate.product;
}

async function main() {
  console.log('🌐 Starting Product Translation to Dutch...\n');

  // Get all products
  console.log('📦 Fetching products from Shopify...');
  const products = await getAllProducts();
  console.log(`✅ Found ${products.length} products\n`);

  const translations: { [handle: string]: { en: string; nl: string } } = {};
  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      console.log(`\n📝 Translating: ${product.title}`);
      console.log(`   Handle: ${product.handle}`);

      if (!product.description || product.description.trim() === '') {
        console.log('   ⚠️  No description to translate, skipping...');
        continue;
      }

      // Translate the description
      console.log('   🔄 Translating description...');
      const dutchDescription = await translateText(product.description);

      // Update product on Shopify
      console.log('   📤 Updating product on Shopify...');
      await updateProductDescription(product.id, dutchDescription);

      // Save translation for reference
      translations[product.handle] = {
        en: product.description,
        nl: dutchDescription
      };

      console.log('   ✅ Successfully translated and updated!');
      successCount++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`   ❌ Error processing ${product.title}:`, error);
      errorCount++;
    }
  }

  // Save translations to file
  const translationsPath = resolve(process.cwd(), 'src/data/product_translations.json');
  writeFileSync(translationsPath, JSON.stringify(translations, null, 2));
  console.log(`\n📄 Saved translations to: ${translationsPath}`);

  console.log('\n' + '='.repeat(80));
  console.log('✅ Translation completed!');
  console.log(`   Success: ${successCount} products`);
  console.log(`   Errors: ${errorCount} products`);
  console.log('='.repeat(80) + '\n');

  console.log('📝 Next steps:');
  console.log('   1. Run: npm run fetch-products');
  console.log('   2. Verify translations on the frontend');
  console.log('   3. Test product pages in Dutch language\n');
}

main().catch(console.error);
