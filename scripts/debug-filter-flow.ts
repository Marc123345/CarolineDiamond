/**
 * Debug script to trace filter flow with exact user scenario
 * Scenario: User selects Earrings + Carat Weight filter
 */

import { extractAllCaratWeights, productMatchesCaratWeight } from '../src/utils/diamondFilterUtils';
import { productMatchesCategory } from '../src/utils/categoryHelpers';
import type { ProcessedProduct } from '../src/types/shopify';

// Real earring product
const earringProduct: ProcessedProduct = {
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
    'Earrings',
    'Lab-Grown Diamond',
    'Rose Gold',
    'Yellow Gold',
    'White Gold'
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
    }
  ],
  metafields: {},
  seo: { title: '', description: '' },
  options: [],
  collections: []
};

console.log('\n🔍 Debug Filter Flow\n');
console.log('='.repeat(70));

// Step 1: Check category filter
console.log('\n📋 Step 1: Apply Jewelry Category Filter');
console.log('-'.repeat(70));
const matchesCategory = productMatchesCategory(earringProduct, 'Earrings');
console.log(`Product: ${earringProduct.name}`);
console.log(`Filter: jewelryCategory = "Earrings"`);
console.log(`Result: ${matchesCategory ? '✅ MATCHES' : '❌ NO MATCH'}`);

// Step 2: Extract carat weights
console.log('\n📋 Step 2: Extract Carat Weights');
console.log('-'.repeat(70));
const carats = extractAllCaratWeights(earringProduct);
console.log(`Extracted carats: ${carats.join(', ')} ct`);
console.log(`Has carat data: ${carats.length > 0 ? '✅ YES' : '❌ NO'}`);

// Step 3: Check carat weight filter matching
console.log('\n📋 Step 3: Apply Carat Weight Filter');
console.log('-'.repeat(70));
const caratRange = { label: '0.3 ct - 1 ct', min: 0.3, max: 1 };
const matchesCarat = productMatchesCaratWeight(earringProduct, caratRange);
console.log(`Filter: caratWeights = ["0.3 ct - 1 ct"]`);
console.log(`Range: min=${caratRange.min}, max=${caratRange.max}`);
console.log(`Result: ${matchesCarat ? '✅ MATCHES' : '❌ NO MATCH'}`);

// Step 4: Combined filter check
console.log('\n📋 Step 4: Combined Filter Check');
console.log('-'.repeat(70));
const passesBothFilters = matchesCategory && matchesCarat;
console.log(`Category Filter: ${matchesCategory ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Carat Filter: ${matchesCarat ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Combined Result: ${passesBothFilters ? '✅ SHOULD DISPLAY' : '❌ SHOULD HIDE'}`);

console.log('\n' + '='.repeat(70));
console.log('\n🎯 Expected Behavior:');
console.log('  When Filters:');
console.log('    - jewelryCategory: "Earrings"');
console.log('    - caratWeights: ["0.3 ct - 1 ct"]');
console.log('  Then:');
console.log('    - Product SHOULD be displayed ✅');
console.log('    - Count should show: "0.3-0.99 ct (1)"');
console.log('\n');
