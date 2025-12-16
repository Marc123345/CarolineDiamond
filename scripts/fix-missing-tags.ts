#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/graphql.json`;

const SHAPE_MAPPINGS: Record<string, string> = {
  'oval': 'shape:oval',
  'round': 'shape:round',
  'pear': 'shape:pear',
  'marquise': 'shape:marquise',
  'princess': 'shape:princess',
  'emerald': 'shape:emerald',
  'cushion': 'shape:cushion',
  'asscher': 'shape:asscher',
  'radiant': 'shape:radiant',
};

interface ShopifyProduct {
  id: string;
  title: string;
  tags: string[];
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

async function fetchAllProducts(): Promise<ShopifyProduct[]> {
  console.log('📦 Fetching all products from Shopify...');

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
            tags
          }
        }
      }
    }
  `;

  let allProducts: ShopifyProduct[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const data = await shopifyAdminRequest(query, { cursor });
    const products = data.data.products.edges.map((edge: any) => edge.node);
    allProducts = allProducts.concat(products);

    hasNextPage = data.data.products.pageInfo.hasNextPage;
    cursor = data.data.products.pageInfo.endCursor;

    process.stdout.write(`\r   Fetched ${allProducts.length} products...`);
  }

  console.log(`\n✅ Fetched ${allProducts.length} products`);
  return allProducts;
}

async function updateProductTags(productId: string, tags: string[]) {
  const mutation = `
    mutation UpdateProductTags($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          tags
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
      tags: tags,
    },
  };

  const data = await shopifyAdminRequest(mutation, variables);

  if (data.data.productUpdate.userErrors?.length > 0) {
    throw new Error(
      `User errors: ${JSON.stringify(data.data.productUpdate.userErrors)}`
    );
  }

  return data.data.productUpdate.product;
}

function fixProductTags(product: ShopifyProduct): { tags: string[], changes: string[] } {
  const newTags = new Set(product.tags);
  const changes: string[] = [];

  // Check for shape tags - if we have a plain shape tag, ensure we also have the prefixed version
  for (const tag of product.tags) {
    const tagLower = tag.toLowerCase().trim();
    const prefixedShape = SHAPE_MAPPINGS[tagLower];

    if (prefixedShape && !product.tags.includes(prefixedShape)) {
      newTags.add(prefixedShape);
      changes.push(`Added: "${prefixedShape}"`);
    }
  }

  // Remove "Unknown" tags
  if (newTags.has('Unknown')) {
    newTags.delete('Unknown');
    changes.push('Removed: "Unknown"');
  }

  // Fix "Side Diamonds:Unknown" tags
  if (Array.from(newTags).some(t => t.includes('Side Diamonds:Unknown'))) {
    Array.from(newTags).forEach(t => {
      if (t.includes('Side Diamonds:Unknown')) {
        newTags.delete(t);
        changes.push(`Removed: "${t}"`);
      }
    });
  }

  return {
    tags: Array.from(newTags),
    changes,
  };
}

async function fixAllTags() {
  console.log('🔧 Starting tag fix process...\n');

  const products = await fetchAllProducts();

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  console.log('\n📝 Processing products...\n');

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const progress = `[${i + 1}/${products.length}]`;

    try {
      const { tags: newTags, changes } = fixProductTags(product);

      if (changes.length === 0) {
        console.log(`${progress} ⏭️  ${product.title} - No changes needed`);
        skipped++;
        continue;
      }

      console.log(`${progress} 🔄 ${product.title}`);
      changes.forEach(change => console.log(`      ${change}`));

      await updateProductTags(product.id, newTags);
      updated++;

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`${progress} ❌ ${product.title} - ERROR:`, error);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Tag Fix Complete!');
  console.log('='.repeat(60));
  console.log(`✅ Updated:  ${updated} products`);
  console.log(`⏭️  Skipped:  ${skipped} products (no changes)`);
  console.log(`❌ Errors:   ${errors} products`);
  console.log('='.repeat(60));
}

fixAllTags().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
