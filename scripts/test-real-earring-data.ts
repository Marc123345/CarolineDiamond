/**
 * Test with EXACT real data from Shopify to verify extraction works
 */

import { extractAllCaratWeights, productMatchesCaratWeight } from '../src/utils/diamondFilterUtils';
import type { ProcessedProduct } from '../src/types/shopify';

// Recreate the EXACT structure of the real Tijdloze earrings product
const realEarringProduct: ProcessedProduct = {
  id: 'test-1',
  name: 'Tijdloze diamanten oorbellen – 18K goud (lab-grown)',
  handle: 'tijdloze-oorbellen',
  description: '',
  descriptionHtml: '',
  price: 0,
  compareAtPrice: null,
  images: [],
  availableForSale: true,
  tags: [
    '18K Gold',
    'birthstone',
    'diamond earrings',
    'Earrings',
    'gift idea',
    'handcrafted',
    'Lab-Grown Diamond',
    'Rose Gold',
    'studs',
    'timeless',
    'White Gold',
    'Yellow Gold'
  ],
  vendor: '',
  productType: 'Earrings',
  variants: [
    {
      id: 'v1',
      title: 'Rose gold / Lab-Grown 0.30ct',
      price: '0',
      availableForSale: true,
      selectedOptions: {
        'Color': 'Rose gold',
        'Diamond Type': 'Lab-Grown 0.30ct'
      },
      quantityAvailable: 1
    },
    {
      id: 'v2',
      title: 'Rose gold / Lab-Grown 0.50ct',
      price: '0',
      availableForSale: true,
      selectedOptions: {
        'Color': 'Rose gold',
        'Diamond Type': 'Lab-Grown 0.50ct'
      },
      quantityAvailable: 1
    },
    {
      id: 'v3',
      title: 'Rose gold / Lab-Grown 1.00ct',
      price: '0',
      availableForSale: true,
      selectedOptions: {
        'Color': 'Rose gold',
        'Diamond Type': 'Lab-Grown 1.00ct'
      },
      quantityAvailable: 1
    },
    {
      id: 'v4',
      title: 'Yellow gold / Lab-Grown 0.30ct',
      price: '0',
      availableForSale: true,
      selectedOptions: {
        'Color': 'Yellow gold',
        'Diamond Type': 'Lab-Grown 0.30ct'
      },
      quantityAvailable: 1
    }
  ],
  metafields: {},
  seo: {
    title: '',
    description: ''
  },
  options: [],
  collections: []
};

// Define carat weight ranges
const caratRanges = [
  { label: '0.3 ct - 1 ct', min: 0.3, max: 1 },
  { label: '1 ct - 1.5 ct', min: 1, max: 1.5 }
];

console.log('\n🔍 Testing Real Earring Product Data\n');
console.log('='.repeat(70));

console.log('\n📦 Product: Tijdloze diamanten oorbellen');
console.log('-'.repeat(70));

// Test extraction
const extractedCarats = extractAllCaratWeights(realEarringProduct);
console.log(`\n✅ Extracted Carat Weights: ${extractedCarats.join(', ')} ct`);
console.log(`   Found ${extractedCarats.length} unique carat values`);

// Test each variant
console.log('\n📊 Variant Analysis:');
realEarringProduct.variants.forEach((variant, index) => {
  console.log(`\n  Variant ${index + 1}: ${variant.title}`);
  console.log(`    selectedOptions:`, JSON.stringify(variant.selectedOptions, null, 6));

  // Check if this variant's options contain carat data
  Object.entries(variant.selectedOptions).forEach(([key, value]) => {
    const match = String(value).match(/(\d+\.?\d*)\s*ct/i);
    if (match) {
      console.log(`    ✅ Found carat in "${key}": ${match[0]} → ${match[1]} ct`);
    }
  });
});

// Test filter matching
console.log('\n📊 Filter Range Matching:');
console.log('-'.repeat(70));
caratRanges.forEach(range => {
  const matches = productMatchesCaratWeight(realEarringProduct, range);
  console.log(`\n  Range: ${range.label}`);
  console.log(`  Matches: ${matches ? '✅ YES' : '❌ NO'}`);
  if (matches) {
    console.log(`  This product SHOULD appear when this filter is selected`);
  }
});

console.log('\n' + '='.repeat(70));
console.log('\n🎯 Expected Behavior:');
console.log('  - Product should be counted in "0.3 ct - 1 ct" range (has 0.30ct, 0.50ct, 1.00ct)');
console.log('  - Product should be counted in "1 ct - 1.5 ct" range (has 1.00ct)');
console.log('  - Selecting either filter should SHOW this product');
console.log('\n');
