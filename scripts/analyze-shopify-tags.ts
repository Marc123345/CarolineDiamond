/**
 * Shopify Tag Analysis & Migration Utility
 *
 * This script helps you:
 * 1. Analyze current product tags in Shopify
 * 2. Identify tag inconsistencies
 * 3. Generate migration recommendations
 * 4. (Optional) Bulk update tags via Admin API
 *
 * Usage:
 *   npm run analyze-tags
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const SHOPIFY_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const CANONICAL_TAGS = {
  ringTypes: ['Solitaire', 'Solitaire with Side Diamonds', 'Halo', 'Halo with Side Diamonds'],
  shapes: ['Round', 'Oval', 'Princess', 'Pear', 'Marquise', 'Emerald', 'Cushion'],
  goldColors: ['Rose Gold', 'Yellow Gold', 'White Gold'],
  stones: ['Natural Diamond', 'Lab-Grown Diamond'],
  goldPurity: ['18K Gold', '14K Gold']
};

// Tag variations that should be normalized
const TAG_NORMALIZATIONS: Record<string, string> = {
  'No Side Diamonds': 'Solitaire',
  'Side Diamonds': 'Solitaire with Side Diamonds',
  'With Side Diamonds': 'Solitaire with Side Diamonds',
  'Halo Side Diamonds': 'Halo with Side Diamonds',
  'Rose': 'Rose Gold',
  'Pink Gold': 'Rose Gold',
  'Yellow': 'Yellow Gold',
  'White': 'White Gold',
  'Natural': 'Natural Diamond',
  'Mined Diamond': 'Natural Diamond',
  'Lab Grown': 'Lab-Grown Diamond',
  'Lab Diamond': 'Lab-Grown Diamond',
  'Synthetic Diamond': 'Lab-Grown Diamond',
  '18K': '18K Gold',
  '18 Karat': '18K Gold',
  '14K': '14K Gold',
  '14 Karat': '14K Gold'
};

interface Product {
  id: string;
  title: string;
  tags: string[];
  handle: string;
}

interface TagAnalysis {
  allTags: Set<string>;
  tagFrequency: Map<string, number>;
  nonCanonicalTags: string[];
  productsByTag: Map<string, Product[]>;
  migrationSuggestions: Array<{
    productId: string;
    productTitle: string;
    currentTags: string[];
    suggestedTags: string[];
    addTags: string[];
    removeTags: string[];
  }>;
}

async function fetchAllProducts(): Promise<Product[]> {
  if (!SHOPIFY_DOMAIN || !ADMIN_TOKEN) {
    throw new Error('Missing Shopify credentials in .env');
  }

  const query = `
    query GetAllProducts($cursor: String) {
      products(first: 250, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            handle
            title
            tags
          }
        }
      }
    }
  `;

  let allProducts: Product[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { cursor } }),
    });

    const json = await response.json();

    if (json.errors) {
      throw new Error(`Shopify API Error: ${JSON.stringify(json.errors)}`);
    }

    const products = json.data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      tags: edge.node.tags,
    }));

    allProducts = [...allProducts, ...products];
    hasNextPage = json.data.products.pageInfo.hasNextPage;
    cursor = json.data.products.pageInfo.endCursor;
  }

  return allProducts;
}

function analyzeProducts(products: Product[]): TagAnalysis {
  const allTags = new Set<string>();
  const tagFrequency = new Map<string, number>();
  const productsByTag = new Map<string, Product[]>();
  const migrationSuggestions: TagAnalysis['migrationSuggestions'] = [];

  const allCanonicalTags = [
    ...CANONICAL_TAGS.ringTypes,
    ...CANONICAL_TAGS.shapes,
    ...CANONICAL_TAGS.goldColors,
    ...CANONICAL_TAGS.stones,
    ...CANONICAL_TAGS.goldPurity
  ];

  products.forEach(product => {
    const currentTags = product.tags;
    const suggestedTags = new Set<string>();
    const removeTags: string[] = [];

    currentTags.forEach(tag => {
      allTags.add(tag);
      tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);

      if (!productsByTag.has(tag)) {
        productsByTag.set(tag, []);
      }
      productsByTag.get(tag)!.push(product);

      // Check if tag needs normalization
      if (TAG_NORMALIZATIONS[tag]) {
        suggestedTags.add(TAG_NORMALIZATIONS[tag]);
        removeTags.push(tag);
      } else if (allCanonicalTags.includes(tag)) {
        suggestedTags.add(tag);
      } else {
        // Non-canonical tag - keep but flag
        suggestedTags.add(tag);
      }
    });

    // Detect missing essential tags
    const hasRingType = currentTags.some(t => CANONICAL_TAGS.ringTypes.includes(t));
    const hasShape = currentTags.some(t => CANONICAL_TAGS.shapes.includes(t));

    const addTags: string[] = [];
    if (!hasRingType) {
      // Try to infer from non-canonical tags
      if (currentTags.includes('No Side Diamonds')) {
        addTags.push('Solitaire');
      } else if (currentTags.includes('Side Diamonds')) {
        addTags.push('Solitaire with Side Diamonds');
      }
    }

    if (removeTags.length > 0 || addTags.length > 0) {
      migrationSuggestions.push({
        productId: product.id,
        productTitle: product.title,
        currentTags,
        suggestedTags: Array.from(suggestedTags).concat(addTags),
        addTags,
        removeTags
      });
    }
  });

  const nonCanonicalTags = Array.from(allTags).filter(
    tag => !allCanonicalTags.includes(tag)
  );

  return {
    allTags,
    tagFrequency,
    nonCanonicalTags,
    productsByTag,
    migrationSuggestions
  };
}

function printAnalysis(analysis: TagAnalysis, products: Product[]) {
  console.log('\n📊 SHOPIFY TAG ANALYSIS REPORT\n');
  console.log('═'.repeat(80));

  console.log(`\n📦 Total Products: ${products.length}`);
  console.log(`🏷️  Unique Tags: ${analysis.allTags.size}`);
  console.log(`⚠️  Non-Canonical Tags: ${analysis.nonCanonicalTags.length}`);
  console.log(`🔄 Products Needing Migration: ${analysis.migrationSuggestions.length}`);

  console.log('\n\n🏷️  TAG FREQUENCY\n');
  console.log('─'.repeat(80));
  const sortedTags = Array.from(analysis.tagFrequency.entries())
    .sort((a, b) => b[1] - a[1]);

  sortedTags.forEach(([tag, count]) => {
    const isCanonical = ![...analysis.nonCanonicalTags].includes(tag);
    const marker = isCanonical ? '✓' : '⚠️';
    console.log(`${marker} ${tag.padEnd(40)} (${count} products)`);
  });

  if (analysis.nonCanonicalTags.length > 0) {
    console.log('\n\n⚠️  NON-CANONICAL TAGS (Need Review)\n');
    console.log('─'.repeat(80));
    analysis.nonCanonicalTags.forEach(tag => {
      const count = analysis.tagFrequency.get(tag) || 0;
      const suggestion = TAG_NORMALIZATIONS[tag];
      if (suggestion) {
        console.log(`❌ "${tag}" → Should be: "${suggestion}" (${count} products)`);
      } else {
        console.log(`⚠️  "${tag}" (${count} products) - Consider removing or standardizing`);
      }
    });
  }

  if (analysis.migrationSuggestions.length > 0) {
    console.log('\n\n🔄 MIGRATION SUGGESTIONS\n');
    console.log('─'.repeat(80));
    analysis.migrationSuggestions.slice(0, 10).forEach((suggestion, i) => {
      console.log(`\n${i + 1}. ${suggestion.productTitle}`);
      console.log(`   ID: ${suggestion.productId}`);
      if (suggestion.removeTags.length > 0) {
        console.log(`   ❌ Remove: ${suggestion.removeTags.join(', ')}`);
      }
      if (suggestion.addTags.length > 0) {
        console.log(`   ✅ Add: ${suggestion.addTags.join(', ')}`);
      }
    });

    if (analysis.migrationSuggestions.length > 10) {
      console.log(`\n   ... and ${analysis.migrationSuggestions.length - 10} more products`);
    }
  }

  console.log('\n\n📋 CANONICAL TAG COVERAGE\n');
  console.log('─'.repeat(80));

  const checkCoverage = (tags: string[], category: string) => {
    const productsWithTag = products.filter(p =>
      p.tags.some(t => tags.includes(t))
    );
    const percentage = ((productsWithTag.length / products.length) * 100).toFixed(1);
    console.log(`${category.padEnd(30)} ${productsWithTag.length}/${products.length} (${percentage}%)`);
  };

  checkCoverage(CANONICAL_TAGS.ringTypes, 'Ring Type');
  checkCoverage(CANONICAL_TAGS.shapes, 'Shape');
  checkCoverage(CANONICAL_TAGS.goldColors, 'Gold Color');
  checkCoverage(CANONICAL_TAGS.stones, 'Diamond Type');
  checkCoverage(CANONICAL_TAGS.goldPurity, 'Gold Purity');

  console.log('\n\n💡 RECOMMENDATIONS\n');
  console.log('─'.repeat(80));
  console.log('1. Update non-canonical tags to use standard names');
  console.log('2. Add missing essential tags (Ring Type, Shape, Gold Color)');
  console.log('3. Remove redundant or unclear tags');
  console.log('4. Run this script again after updates to verify');
  console.log('\n═'.repeat(80));
  console.log('\n');
}

async function main() {
  try {
    console.log('🔍 Fetching products from Shopify...\n');
    const products = await fetchAllProducts();

    console.log(`✅ Fetched ${products.length} products\n`);

    const analysis = analyzeProducts(products);
    printAnalysis(analysis, products);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
