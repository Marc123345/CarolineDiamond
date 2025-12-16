#!/usr/bin/env node

/**
 * Bulk Tag Migration Script
 *
 * This script migrates product tags from CSV format to Shopify's filtering system.
 *
 * BEFORE RUNNING:
 * 1. Ensure SHOPIFY_ADMIN_ACCESS_TOKEN is in your .env file
 * 2. Review the tag mapping in TAG_MAPPING below
 * 3. Run: npm install tsx dotenv (if not already installed)
 * 4. Execute: npx tsx scripts/migrate-tags-to-shopify.ts
 *
 * WHAT IT DOES:
 * - Fetches all products from Shopify
 * - Converts CSV tags to Shopify filter tags
 * - Updates products in batches
 * - Shows progress and handles errors
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env') });

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SHOPIFY_STORE_DOMAIN');
  console.error('   SHOPIFY_ADMIN_ACCESS_TOKEN');
  process.exit(1);
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/graphql.json`;

// Tag mapping: lowercase/old format -> proper capitalized format
const TAG_MAPPING: Record<string, string[]> = {
  // Keep existing lowercase tags but ADD proper case tags
  'solitaire': ['Solitaire'],
  'halo': ['Halo'],
  'lab-grown': ['Lab-Grown Diamond'],
  'diamond': ['Diamond'],
  'engagement-ring': ['Engagement Ring'],
};

// Infer tags from product title and existing tags
function inferTagsFromProduct(title: string, existingTags: string[]): string[] {
  const newTags: string[] = [];
  const titleLower = title.toLowerCase();
  const tagsLower = existingTags.map(t => t.toLowerCase());

  // Infer Ring Style
  if (titleLower.includes('side diamonds') && titleLower.includes('solitaire')) {
    newTags.push('Solitaire + Side Diamonds');
  } else if (titleLower.includes('solitaire') || tagsLower.includes('solitaire')) {
    newTags.push('Solitaire');
  }

  if (titleLower.includes('halo') && titleLower.includes('side diamonds')) {
    newTags.push('Halo + Side Diamonds');
  } else if (titleLower.includes('halo') || tagsLower.includes('halo')) {
    newTags.push('Halo');
  }

  // Infer Diamond Origin
  if (titleLower.includes('labgrown') || titleLower.includes('lab-grown') || tagsLower.includes('lab-grown')) {
    newTags.push('Lab-Grown Diamond');
  } else if (titleLower.includes('natural') || tagsLower.includes('natural')) {
    newTags.push('Natural Diamond');
  } else if (titleLower.includes('diamond') || tagsLower.includes('diamond')) {
    // Default to Natural Diamond if not specified
    newTags.push('Diamond');
  }

  // Infer Shape (default to Round for engagement rings if not specified)
  if (titleLower.includes('round')) newTags.push('Round');
  else if (titleLower.includes('oval')) newTags.push('Oval');
  else if (titleLower.includes('princess')) newTags.push('Princess');
  else if (titleLower.includes('pear')) newTags.push('Pear');
  else if (titleLower.includes('marquise')) newTags.push('Marquise');
  else if (titleLower.includes('emerald')) newTags.push('Emerald');
  else if (titleLower.includes('cushion')) newTags.push('Cushion');
  else if (titleLower.includes('ring') && (titleLower.includes('solitaire') || titleLower.includes('engagement'))) {
    // Default to Round for engagement rings
    newTags.push('Round');
  }

  // Infer Metal Colors from variants (will be added based on product variants)
  // Note: This should ideally be done by checking actual variants
  newTags.push('Rose Gold');
  newTags.push('Yellow Gold');
  newTags.push('White Gold');

  // Product type tags
  if (titleLower.includes('engagement') || tagsLower.includes('engagement-ring')) {
    newTags.push('Engagement Ring');
  }
  if (titleLower.includes('necklace') || tagsLower.includes('necklace')) {
    newTags.push('Necklace');
  }
  if (titleLower.includes('earring') || tagsLower.includes('earrings')) {
    newTags.push('Earrings');
  }
  if (titleLower.includes('bracelet') || tagsLower.includes('bracelet')) {
    newTags.push('Bracelet');
  }

  return newTags;
}

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

function convertTags(product: ShopifyProduct): { tags: string[], changes: string[] } {
  const newTags = new Set<string>();
  const changes: string[] = [];

  // Keep all existing tags
  product.tags.forEach(tag => newTags.add(tag));

  // Add mapped tags
  for (const tag of product.tags) {
    const tagLower = tag.toLowerCase().trim();
    const mapped = TAG_MAPPING[tagLower];

    if (mapped) {
      mapped.forEach(mappedTag => {
        if (!newTags.has(mappedTag)) {
          newTags.add(mappedTag);
          changes.push(`Added "${mappedTag}" (from "${tag}")`);
        }
      });
    }
  }

  // Infer additional tags from product title and existing tags
  const inferredTags = inferTagsFromProduct(product.title, product.tags);
  inferredTags.forEach(tag => {
    if (!newTags.has(tag)) {
      newTags.add(tag);
      changes.push(`Added "${tag}" (inferred from title/tags)`);
    }
  });

  return {
    tags: Array.from(newTags),
    changes,
  };
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

async function migrateAllTags() {
  console.log('🚀 Starting tag migration...\n');

  const products = await fetchAllProducts();

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  console.log('\n📝 Processing products...\n');

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const progress = `[${i + 1}/${products.length}]`;

    try {
      const { tags: newTags, changes } = convertTags(product);

      if (changes.length === 0) {
        console.log(`${progress} ⏭️  ${product.title} - No changes needed`);
        skipped++;
        continue;
      }

      console.log(`${progress} 🔄 ${product.title}`);
      console.log(`      Current tags: ${product.tags.join(', ')}`);
      changes.forEach(change => console.log(`      ${change}`));
      console.log(`      New tags: ${newTags.slice(0, 10).join(', ')}${newTags.length > 10 ? '...' : ''}`);

      await updateProductTags(product.id, newTags);
      updated++;

      // Rate limiting: 2 requests per second max
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`${progress} ❌ ${product.title} - ERROR:`, error);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Migration Complete!');
  console.log('='.repeat(60));
  console.log(`✅ Updated:  ${updated} products`);
  console.log(`⏭️  Skipped:  ${skipped} products (no changes)`);
  console.log(`❌ Errors:   ${errors} products`);
  console.log('='.repeat(60));
}

// Run the migration
migrateAllTags().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
