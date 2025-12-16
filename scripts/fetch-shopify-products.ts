#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/graphql.json`;

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

async function fetchAllProducts() {
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
            handle
            description
            tags
            productType
            vendor
            status
            createdAt
            updatedAt
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  sku
                  price
                  compareAtPrice
                  availableForSale
                  inventoryQuantity
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            options {
              id
              name
              values
            }
          }
        }
      }
    }
  `;

  let allProducts: any[] = [];
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

async function analyzeProducts() {
  const products = await fetchAllProducts();

  console.log('\n📊 Product Analysis:\n');
  console.log('='.repeat(80));

  const uniqueTags = new Set<string>();
  const shapes = new Set<string>();
  const collections = new Set<string>();
  const materials = new Set<string>();
  const stones = new Set<string>();

  products.forEach(product => {
    console.log(`\n📦 ${product.title}`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   Price: ${product.priceRangeV2.minVariantPrice.amount} ${product.priceRangeV2.minVariantPrice.currencyCode}`);
    console.log(`   Images: ${product.images.edges.length}`);

    if (product.images.edges.length > 0) {
      console.log(`   Primary Image: ${product.images.edges[0].node.url}`);
    } else {
      console.log(`   ⚠️  NO IMAGES`);
    }

    console.log(`   Tags: ${product.tags.join(', ')}`);

    product.tags.forEach((tag: string) => {
      uniqueTags.add(tag);

      if (tag.startsWith('shape:')) {
        shapes.add(tag);
      } else if (tag.startsWith('collection:')) {
        collections.add(tag);
      } else if (tag.startsWith('material:')) {
        materials.add(tag);
      } else if (tag.startsWith('stone:')) {
        stones.add(tag);
      }
    });
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Tag Summary:\n');
  console.log(`Total unique tags: ${uniqueTags.size}`);
  console.log(`\nShapes found: ${Array.from(shapes).join(', ')}`);
  console.log(`Collections found: ${Array.from(collections).join(', ')}`);
  console.log(`Materials found: ${Array.from(materials).join(', ')}`);
  console.log(`Stones found: ${Array.from(stones).join(', ')}`);

  // Save to file
  const outputPath = resolve(process.cwd(), 'src/data/shopify_products_detailed.json');
  writeFileSync(outputPath, JSON.stringify(products, null, 2));
  console.log(`\n✅ Saved detailed product data to: ${outputPath}`);
}

analyzeProducts().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
