import {
  UNIFIED_TIMELESS_NECKLACE,
  findMatchingVariant,
  formatPrice,
  getAvailableFilters,
  type NecklaceVariant
} from '../src/config/necklaceVariantsConfig';

console.log('🧪 Testing Timeless Necklace Pricing Logic\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test 1: Verify all variants exist
console.log('✅ Test 1: Verify All Variants');
console.log(`   Total variants: ${UNIFIED_TIMELESS_NECKLACE.variants.length}`);
console.log(`   Expected: 12 (3 metals × 2 diamond types × 2 carats)`);

if (UNIFIED_TIMELESS_NECKLACE.variants.length === 12) {
  console.log('   ✓ PASSED\n');
} else {
  console.log('   ✗ FAILED\n');
}

// Test 2: Lab-Grown 0.50ct pricing
console.log('✅ Test 2: Lab-Grown 0.50ct Variants (Should be €750)');
const labGrown050ct = [
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'White Gold', 'Lab-Grown', '0.50 ct'),
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'Yellow Gold', 'Lab-Grown', '0.50 ct'),
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'Rose Gold', 'Lab-Grown', '0.50 ct'),
];

let test2Passed = true;
labGrown050ct.forEach((variant) => {
  if (!variant) {
    console.log(`   ✗ Variant not found`);
    test2Passed = false;
    return;
  }
  const formattedPrice = formatPrice(variant);
  const expected = '€750';
  const status = formattedPrice === expected ? '✓' : '✗';
  console.log(`   ${status} ${variant.metalColor}: ${formattedPrice} (Expected: ${expected})`);
  if (formattedPrice !== expected) test2Passed = false;
});
console.log(`   ${test2Passed ? '✓ PASSED' : '✗ FAILED'}\n`);

// Test 3: Lab-Grown 1.00ct pricing
console.log('✅ Test 3: Lab-Grown 1.00ct Variants (Should be €1,190)');
const labGrown100ct = [
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'White Gold', 'Lab-Grown', '1.00 ct'),
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'Yellow Gold', 'Lab-Grown', '1.00 ct'),
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'Rose Gold', 'Lab-Grown', '1.00 ct'),
];

let test3Passed = true;
labGrown100ct.forEach((variant) => {
  if (!variant) {
    console.log(`   ✗ Variant not found`);
    test3Passed = false;
    return;
  }
  const formattedPrice = formatPrice(variant);
  const expected = '€1.190'; // Dutch formatting uses dot for thousands
  const status = formattedPrice === expected ? '✓' : '✗';
  console.log(`   ${status} ${variant.metalColor}: ${formattedPrice} (Expected: ${expected})`);
  if (formattedPrice !== expected) test3Passed = false;
});
console.log(`   ${test3Passed ? '✓ PASSED' : '✗ FAILED'}\n`);

// Test 4: Natural diamond variants (Price on Request)
console.log('✅ Test 4: Natural Diamond Variants (Should be "Price on Request")');
const natural050ct = [
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'White Gold', 'Natural', '0.50 ct'),
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'Yellow Gold', 'Natural', '0.50 ct'),
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'Rose Gold', 'Natural', '0.50 ct'),
];
const natural100ct = [
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'White Gold', 'Natural', '1.00 ct'),
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'Yellow Gold', 'Natural', '1.00 ct'),
  findMatchingVariant(UNIFIED_TIMELESS_NECKLACE.variants, 'Rose Gold', 'Natural', '1.00 ct'),
];

let test4Passed = true;
[...natural050ct, ...natural100ct].forEach((variant) => {
  if (!variant) {
    console.log(`   ✗ Variant not found`);
    test4Passed = false;
    return;
  }
  const formattedPrice = formatPrice(variant);
  const expected = 'Price on Request';
  const status = formattedPrice === expected ? '✓' : '✗';
  console.log(`   ${status} ${variant.metalColor} ${variant.caratWeight}: ${formattedPrice}`);
  if (formattedPrice !== expected) test4Passed = false;
});
console.log(`   ${test4Passed ? '✓ PASSED' : '✗ FAILED'}\n`);

// Test 5: Filter logic
console.log('✅ Test 5: Filter Logic');
const noFilters = getAvailableFilters(UNIFIED_TIMELESS_NECKLACE.variants, {});
console.log(`   No filters: ${noFilters.metalColors.length} metals, ${noFilters.diamondTypes.length} types, ${noFilters.caratWeights.length} carats`);

const labGrownFilter = getAvailableFilters(UNIFIED_TIMELESS_NECKLACE.variants, { diamondType: 'Lab-Grown' });
console.log(`   Lab-Grown selected: ${labGrownFilter.metalColors.length} metals, ${labGrownFilter.caratWeights.length} carats`);

const test5Passed = noFilters.metalColors.length === 3 &&
                    noFilters.diamondTypes.length === 2 &&
                    noFilters.caratWeights.length === 2 &&
                    labGrownFilter.metalColors.length === 3 &&
                    labGrownFilter.caratWeights.length === 2;
console.log(`   ${test5Passed ? '✓ PASSED' : '✗ FAILED'}\n`);

// Test 6: Price display when no variant selected
console.log('✅ Test 6: Price Display (No Selection)');
const noSelection = formatPrice(undefined);
const expected6 = 'Select options';
const test6Passed = noSelection === expected6;
console.log(`   Result: "${noSelection}" (Expected: "${expected6}")`);
console.log(`   ${test6Passed ? '✓ PASSED' : '✗ FAILED'}\n`);

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n📊 TEST SUMMARY\n');
const allPassed = test2Passed && test3Passed && test4Passed && test5Passed && test6Passed;
if (allPassed) {
  console.log('✅ ALL TESTS PASSED!');
  console.log('\n✨ Pricing Logic Summary:');
  console.log('   • Lab-Grown 0.50 ct → €750 ✓');
  console.log('   • Lab-Grown 1.00 ct → €1,190 ✓');
  console.log('   • Natural diamonds → "Price on Request" ✓');
  console.log('   • Filter logic working correctly ✓');
  console.log('   • Default state shows "Select options" ✓');
} else {
  console.log('❌ SOME TESTS FAILED - Please review above');
  process.exit(1);
}
