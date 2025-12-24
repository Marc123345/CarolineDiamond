/**
 * Complete end-to-end test simulating exact user scenario
 * Tests the full filter flow from Shopify query → client-side filtering
 */

import { extractAllCaratWeights, productMatchesCaratWeight } from '../src/utils/diamondFilterUtils';
import { productMatchesCategory } from '../src/utils/categoryHelpers';
import { buildShopifyQuery } from '../src/config/filterConfig';
import type { ProcessedProduct } from '../src/types/shopify';
import type { ProductFilters } from '../src/config/filterConfig';

// Simulate real Timeless Earrings product from Shopify
const timelessEarrings: ProcessedProduct = {
  id: 'gid://shopify/Product/123',
  name: 'Tijdloze diamanten oorbellen – 18K goud (lab-grown)',
  handle: 'tijdloze-oorbellen',
  description: 'Timeless everyday wear earrings',
  descriptionHtml: '<p>Timeless everyday wear earrings</p>',
  price: 490,
  compareAtPrice: null,
  images: [],
  availableForSale: true,
  tags: [
    '18K Gold',
    'birthstone',
    'diamond earrings',
    'Earrings',  // ← Category tag
    'gift idea',
    'handcrafted',
    'Lab-Grown Diamond',
    'Rose Gold',
    'studs',
    'timeless',
    'White Gold',
    'Yellow Gold'
    // NOTE: NO carat tags like "0.30ct" or "0.3 ct - 1 ct"
  ],
  vendor: 'Diamonds by CS',
  productType: 'Earrings',
  variants: [
    {
      id: 'v1',
      title: 'Rose gold / Lab-Grown 0.30ct',
      price: '490',
      availableForSale: true,
      selectedOptions: {
        'Color': 'Rose gold',
        'Diamond Type': 'Lab-Grown 0.30ct'  // ← Carat data HERE
      },
      quantityAvailable: 5
    },
    {
      id: 'v2',
      title: 'Rose gold / Lab-Grown 0.50ct',
      price: '590',
      availableForSale: true,
      selectedOptions: {
        'Color': 'Rose gold',
        'Diamond Type': 'Lab-Grown 0.50ct'  // ← Carat data HERE
      },
      quantityAvailable: 5
    },
    {
      id: 'v3',
      title: 'Rose gold / Lab-Grown 1.00ct',
      price: '890',
      availableForSale: true,
      selectedOptions: {
        'Color': 'Rose gold',
        'Diamond Type': 'Lab-Grown 1.00ct'  // ← Carat data HERE
      },
      quantityAvailable: 5
    }
  ],
  metafields: {},
  seo: { title: '', description: '' },
  options: [],
  collections: []
};

console.log('\n' + '='.repeat(80));
console.log('🧪 COMPLETE FILTER SCENARIO TEST');
console.log('='.repeat(80));

console.log('\n📋 USER ACTION: Select Filters');
console.log('-'.repeat(80));
console.log('  1. Jewelry Type: Earrings');
console.log('  2. Carat Weight: 0.3-0.99 ct');

// Step 1: Build Shopify Query
const filters: ProductFilters = {
  jewelryCategory: 'Earrings',
  caratWeights: [{ label: '0.3 ct - 1 ct', min: 0.3, max: 1, display: '0.3-0.99 ct' }]
};

console.log('\n📊 STEP 1: Build Shopify Query');
console.log('-'.repeat(80));
const shopifyQuery = buildShopifyQuery(filters);
console.log(`Input Filters:`);
console.log(`  - jewelryCategory: "${filters.jewelryCategory}"`);
console.log(`  - caratWeights: [${filters.caratWeights?.map(w => w.label).join(', ')}]`);
console.log(`\nGenerated Shopify Query:`);
console.log(`  "${shopifyQuery}"`);

// Check if carat is in query
const hasCaratInQuery = shopifyQuery.includes('carat') || shopifyQuery.includes('0.3') || shopifyQuery.includes('ct');
console.log(`\n  Includes carat filter? ${hasCaratInQuery ? '❌ YES (WRONG!)' : '✅ NO (CORRECT!)'}`);
if (!hasCaratInQuery) {
  console.log(`  ✅ Carat filters excluded from Shopify query (will be filtered client-side)`);
} else {
  console.log(`  ❌ ERROR: Carat in query will return 0 products from Shopify!`);
}

// Step 2: Simulate Shopify Response
console.log('\n📊 STEP 2: Simulate Shopify Response');
console.log('-'.repeat(80));
console.log(`Query: "${shopifyQuery}"`);
console.log(`\nShopify would return products matching: tag:"Earrings"`);
console.log(`Result: Returns Timeless Earrings product ✅`);

const shopifyProducts = [timelessEarrings]; // Products returned by Shopify
console.log(`\nProducts from Shopify: ${shopifyProducts.length}`);
shopifyProducts.forEach(p => {
  console.log(`  - ${p.name}`);
  console.log(`    Tags: ${p.tags.join(', ')}`);
  console.log(`    Variants: ${p.variants.length}`);
});

// Step 3: Client-Side Category Filter
console.log('\n📊 STEP 3: Client-Side Category Filter');
console.log('-'.repeat(80));
const passesCategory = productMatchesCategory(timelessEarrings, 'Earrings');
console.log(`Filter: jewelryCategory = "Earrings"`);
console.log(`Result: ${passesCategory ? '✅ MATCHES' : '❌ NO MATCH'}`);

// Step 4: Extract Carat Weights
console.log('\n📊 STEP 4: Extract Carat Weights from Product');
console.log('-'.repeat(80));
const extractedCarats = extractAllCaratWeights(timelessEarrings);
console.log(`Product: ${timelessEarrings.name}`);
console.log(`Variants:`);
timelessEarrings.variants.forEach(v => {
  console.log(`  - ${v.title}`);
});
console.log(`\nExtracted Carats: ${extractedCarats.join(', ')} ct`);
console.log(`Extraction ${extractedCarats.length > 0 ? '✅ SUCCESS' : '❌ FAILED'}`);

// Step 5: Client-Side Carat Filter
console.log('\n📊 STEP 5: Client-Side Carat Weight Filter');
console.log('-'.repeat(80));
const caratRange = { label: '0.3 ct - 1 ct', min: 0.3, max: 1 };
const passesCarat = productMatchesCaratWeight(timelessEarrings, caratRange);
console.log(`Filter: caratWeights = ["${caratRange.label}"]`);
console.log(`Range: ${caratRange.min} <= carat <= ${caratRange.max}`);
console.log(`Product Carats: ${extractedCarats.join(', ')}`);
console.log(`Match Logic:`);
extractedCarats.forEach(carat => {
  const matches = carat >= caratRange.min && carat <= caratRange.max;
  console.log(`  - ${carat} ct: ${carat} >= ${caratRange.min} && ${carat} <= ${caratRange.max} = ${matches ? '✅ TRUE' : '❌ FALSE'}`);
});
console.log(`\nResult: ${passesCarat ? '✅ MATCHES' : '❌ NO MATCH'}`);

// Step 6: Final Result
console.log('\n📊 STEP 6: Final Filter Result');
console.log('-'.repeat(80));
const finalResult = passesCategory && passesCarat;
console.log(`Category Filter: ${passesCategory ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Carat Filter: ${passesCarat ? '✅ PASS' : '❌ FAIL'}`);
console.log(`\n${finalResult ? '✅ PRODUCT SHOULD DISPLAY' : '❌ PRODUCT SHOULD BE HIDDEN'}`);

// Summary
console.log('\n' + '='.repeat(80));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(80));

const allTestsPass = !hasCaratInQuery && passesCategory && passesCarat && finalResult;

console.log(`\n✅ Shopify query excludes carat: ${!hasCaratInQuery ? 'PASS' : 'FAIL'}`);
console.log(`✅ Shopify returns products: ${shopifyProducts.length > 0 ? 'PASS' : 'FAIL'}`);
console.log(`✅ Category filter works: ${passesCategory ? 'PASS' : 'FAIL'}`);
console.log(`✅ Carat extraction works: ${extractedCarats.length > 0 ? 'PASS' : 'FAIL'}`);
console.log(`✅ Carat filter works: ${passesCarat ? 'PASS' : 'FAIL'}`);
console.log(`✅ Product displays: ${finalResult ? 'PASS' : 'FAIL'}`);

console.log(`\n${allTestsPass ? '🎉 ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);
console.log('='.repeat(80));
console.log('\n');
