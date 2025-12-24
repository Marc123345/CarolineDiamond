import { extractCaratWeight, extractAllCaratWeights, productMatchesCaratWeight } from '../src/utils/diamondFilterUtils';
import { CARAT_WEIGHTS } from '../src/config/filterConfig';
import { ProcessedProduct } from '../src/types/shopify';

const mockTimelessProducts: Partial<ProcessedProduct>[] = [
  {
    id: '1',
    name: 'Timeless Diamond Stud Earrings – 18K Gold – 0.30ct',
    handle: 'timeless-diamond-stud-earrings-18k-gold-0-30ct',
    tags: ['0.30ct', '18k gold', 'D-VS2', 'Earrings', 'Lab-Grown Diamond', 'studs', 'timeless'],
    price: 490
  },
  {
    id: '2',
    name: 'Timeless Diamond Stud Earrings – 18K Gold – 0.50ct',
    handle: 'timeless-diamond-stud-earrings-18k-gold-0-50ct',
    tags: ['0.50ct', '18k gold', 'D-VS2', 'Earrings', 'Lab-Grown Diamond', 'studs', 'timeless'],
    price: 590
  },
  {
    id: '3',
    name: 'Timeless Diamond Stud Earrings – 18K Gold – 1.00ct',
    handle: 'timeless-diamond-stud-earrings-18k-gold-1-00ct',
    tags: ['1.00ct', '18k gold', 'D-VS2', 'Earrings', 'Lab-Grown Diamond', 'studs', 'timeless'],
    price: 890
  },
  {
    id: '4',
    name: 'Timeless Diamond Necklace – 18K Gold – 0.50ct',
    handle: 'timeless-diamond-necklace-18k-gold-0-50ct',
    tags: ['0.50ct', '18k gold', 'D-VS2', 'Necklace', 'Lab-Grown Diamond', 'timeless'],
    price: 750
  },
  {
    id: '5',
    name: 'Timeless Diamond Necklace – 18K Gold – 1.00ct',
    handle: 'timeless-diamond-necklace-18k-gold-1-00ct',
    tags: ['1.00ct', '18k gold', 'D-VS2', 'Necklace', 'Lab-Grown Diamond', 'timeless'],
    price: 1190
  }
];

console.log('🔍 CARAT WEIGHT FILTER VALIDATION\n');
console.log('Testing against 5 timeless products from cleaned CSV\n');
console.log('═'.repeat(70));

mockTimelessProducts.forEach((product, index) => {
  console.log(`\n${index + 1}. ${product.handle}`);
  console.log(`   Title: ${product.name}`);
  console.log(`   Tags: ${product.tags?.join(', ')}`);

  const caratTags = product.tags?.filter(tag => /\d+\.\d+ct/.test(tag));
  console.log(`   Carat tag: ${caratTags?.join(', ') || 'NONE FOUND'}`);

  const singleCarat = extractCaratWeight(product as ProcessedProduct);
  const allCarats = extractAllCaratWeights(product as ProcessedProduct);

  console.log(`   ✓ Extracted single: ${singleCarat}`);
  console.log(`   ✓ Extracted all: [${allCarats.join(', ')}]`);

  console.log(`   Matches filter ranges:`);
  CARAT_WEIGHTS.forEach(weight => {
    const matches = productMatchesCaratWeight(product as ProcessedProduct, weight);
    if (matches) {
      console.log(`      ✅ ${weight.label} (${weight.display})`);
    }
  });
});

console.log('\n' + '═'.repeat(70));
console.log('\n📊 EXPECTED FILTER COUNTS\n');

CARAT_WEIGHTS.forEach(weight => {
  const count = mockTimelessProducts.filter(p =>
    productMatchesCaratWeight(p as ProcessedProduct, weight)
  ).length;

  const productHandles = mockTimelessProducts
    .filter(p => productMatchesCaratWeight(p as ProcessedProduct, weight))
    .map(p => p.handle);

  console.log(`\n${weight.label} (${weight.display}): ${count} products`);
  if (count > 0) {
    productHandles.forEach(h => console.log(`   • ${h}`));
  }
});

console.log('\n' + '═'.repeat(70));
console.log('\n✅ VALIDATION COMPLETE');
console.log('\nExpected counts:');
console.log('   • 0.3 ct - 1 ct (0.3-0.99 ct): 4 products');
console.log('   • 1 ct - 1.5 ct (1.0-1.49 ct): 2 products');
console.log('   • 1.5 ct - 2 ct (1.5-1.99 ct): 0 products');
console.log('   • 2 ct + (2.0+ ct): 0 products');
