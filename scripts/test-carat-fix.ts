/**
 * Test script to validate carat weight filter fix
 * Tests both extractCaratWeight and extractAllCaratWeights functions
 */

import { extractCaratWeight, extractAllCaratWeights, productMatchesCaratWeight } from '../src/utils/diamondFilterUtils';
import type { ProcessedProduct } from '../src/types/shopify';

// Mock products with different carat tag formats
const mockProducts: Partial<ProcessedProduct>[] = [
  {
    name: 'Timeless Earrings 0.30ct',
    tags: ['0.30ct', 'Earrings', 'Rose Gold'],
    variants: []
  },
  {
    name: 'Timeless Earrings 0.50ct',
    tags: ['0.50 ct', 'Earrings', 'Yellow Gold'], // Note: space before ct
    variants: []
  },
  {
    name: 'Timeless Necklace 1.00ct',
    tags: ['1.00ct', 'Necklaces', 'White Gold'],
    variants: []
  },
  {
    name: 'Timeless Necklace 1.50ct',
    tags: ['1.50 ct', 'Necklaces', 'Rose Gold'], // Note: space before ct
    variants: []
  },
  {
    name: 'Ring without carat tag',
    tags: ['Rings', 'Rose Gold'],
    variants: []
  }
];

// Define carat weight ranges (from filterConfig)
const caratRanges = [
  { label: '0.3 ct - 1 ct', min: 0.3, max: 1 },
  { label: '1 ct - 1.5 ct', min: 1, max: 1.5 },
  { label: '1.5 ct - 2 ct', min: 1.5, max: 2 }
];

console.log('\n🔍 Carat Weight Filter Fix Validation\n');
console.log('='.repeat(60));

// Test 1: Single extraction
console.log('\n📊 Test 1: Single Carat Extraction (extractCaratWeight)');
console.log('-'.repeat(60));
mockProducts.forEach(product => {
  const carat = extractCaratWeight(product as ProcessedProduct);
  console.log(`Product: ${product.name}`);
  console.log(`  Tags: ${product.tags?.join(', ')}`);
  console.log(`  Extracted: ${carat !== null ? carat + ' ct' : 'None'}`);
  console.log('');
});

// Test 2: All carats extraction
console.log('\n📊 Test 2: All Carats Extraction (extractAllCaratWeights)');
console.log('-'.repeat(60));
mockProducts.forEach(product => {
  const carats = extractAllCaratWeights(product as ProcessedProduct);
  console.log(`Product: ${product.name}`);
  console.log(`  Tags: ${product.tags?.join(', ')}`);
  console.log(`  Extracted: ${carats.length > 0 ? carats.join(', ') + ' ct' : 'None'}`);
  console.log('');
});

// Test 3: Filter matching
console.log('\n📊 Test 3: Filter Range Matching (productMatchesCaratWeight)');
console.log('-'.repeat(60));
caratRanges.forEach(range => {
  const matches = mockProducts.filter(product =>
    productMatchesCaratWeight(product as ProcessedProduct, range)
  );
  console.log(`Range: ${range.label}`);
  console.log(`  Matches: ${matches.length} products`);
  matches.forEach(p => console.log(`    - ${p.name}`));
  console.log('');
});

// Test 4: Count summary
console.log('\n📊 Test 4: Count Summary (Expected Filter UI Counts)');
console.log('-'.repeat(60));
caratRanges.forEach(range => {
  const count = mockProducts.filter(product =>
    productMatchesCaratWeight(product as ProcessedProduct, range)
  ).length;
  console.log(`${range.label}: ${count} product${count !== 1 ? 's' : ''}`);
});

console.log('\n' + '='.repeat(60));
console.log('\n✅ Validation Complete!\n');
console.log('Expected Results:');
console.log('  - 0.3 ct - 1 ct: 2 products (0.30ct, 0.50ct)');
console.log('  - 1 ct - 1.5 ct: 1 product (1.00ct)');
console.log('  - 1.5 ct - 2 ct: 1 product (1.50ct)');
console.log('\nNote: Products with "0.50 ct" (space) should now be detected!');
console.log('');
