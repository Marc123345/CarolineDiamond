import * as fs from 'fs';

interface VariantRow {
  Handle: string;
  Title: string;
  'Body (HTML)': string;
  Vendor: string;
  'Product Category': string;
  Type: string;
  Tags: string;
  Published: string;
  'Option1 Name': string;
  'Option1 Value': string;
  'Option2 Name': string;
  'Option2 Value': string;
  'Option3 Name': string;
  'Option3 Value': string;
  'Variant SKU': string;
  'Variant Grams': string;
  'Variant Inventory Tracker': string;
  'Variant Inventory Policy': string;
  'Variant Fulfillment Service': string;
  'Variant Price': string;
  'Variant Compare At Price': string;
  'Variant Requires Shipping': string;
  'Variant Taxable': string;
  'Variant Barcode': string;
  'Image Src': string;
  'Image Position': string;
  'Image Alt Text': string;
  'Gift Card': string;
  'SEO Title': string;
  'SEO Description': string;
  'Google Shopping / Google Product Category': string;
  'Google Shopping / Gender': string;
  'Google Shopping / Age Group': string;
  'Google Shopping / MPN': string;
  'Google Shopping / Condition': string;
  'Google Shopping / Custom Product': string;
  'Google Shopping / Custom Label 0': string;
  'Google Shopping / Custom Label 1': string;
  'Google Shopping / Custom Label 2': string;
  'Google Shopping / Custom Label 3': string;
  'Google Shopping / Custom Label 4': string;
  'Variant Image': string;
  'Variant Weight Unit': string;
  'Variant Tax Code': string;
  'Cost per item': string;
  'Included / Netherlands': string;
  Status: string;
}

// Standard pricing structure
const ENGAGEMENT_RING_PRICES = {
  '0.50ct': 790,
  '1.00ct': 990,
  '1.50ct': 1250,
  'Natural': 3000
};

const NECKLACE_PRICES = {
  '0.50ct': 750,
  '1.00ct': 950,
  '1.50ct': 1210,
  'Natural': 3000
};

const EARRING_PRICES = {
  '0.50ct': 690,
  '1.00ct': 890,
  '1.50ct': 1150,
  'Natural': 3000
};

// Standard metal colors
const METAL_COLORS = ['White Gold', 'Yellow Gold', 'Rose Gold'];

// Standard diamond types with proper labels
const DIAMOND_TYPES = [
  { label: 'Lab-Grown 0.50ct DVS2', shortLabel: '0.50ct', price: '0.50ct' },
  { label: 'Lab-Grown 1.00ct DVS2', shortLabel: '1.00ct', price: '1.00ct' },
  { label: 'Lab-Grown 1.50ct DVS2', shortLabel: '1.50ct', price: '1.50ct' },
  { label: 'Natural Diamond', shortLabel: 'Natural', price: 'Natural' }
];

// Product definitions
const products = [
  // ENGAGEMENT RINGS
  {
    handle: 'solitaire-engagement-ring-round-diamond',
    title: 'Solitaire Engagement Ring – Round Diamond',
    body: 'Timeless elegance with a brilliant round diamond in your choice of 18K gold.',
    type: 'Engagement Rings',
    category: 'Engagement Rings',
    tags: 'Engagement Rings, Solitaire, Round, Lab-Grown Diamond, Natural Diamond',
    priceTable: ENGAGEMENT_RING_PRICES,
    shapes: ['Round']
  },
  {
    handle: 'solitaire-engagement-ring-princess-diamond',
    title: 'Solitaire Engagement Ring – Princess Diamond',
    body: 'Modern sophistication with a princess-cut diamond in your choice of 18K gold.',
    type: 'Engagement Rings',
    category: 'Engagement Rings',
    tags: 'Engagement Rings, Solitaire, Princess, Lab-Grown Diamond, Natural Diamond',
    priceTable: ENGAGEMENT_RING_PRICES,
    shapes: ['Princess']
  },
  {
    handle: 'halo-engagement-ring-round-diamond-no-side-diamonds',
    title: 'Halo Engagement Ring – Round Diamond – No Side Diamonds',
    body: 'Classic halo design with a brilliant round center stone, surrounded by sparkling accents.',
    type: 'Engagement Rings',
    category: 'Engagement Rings',
    tags: 'Engagement Rings, Halo, Round, No Side Diamonds, Lab-Grown Diamond, Natural Diamond',
    priceTable: ENGAGEMENT_RING_PRICES,
    shapes: ['Round']
  },
  {
    handle: 'halo-engagement-ring-round-diamond-with-side-diamonds',
    title: 'Halo Engagement Ring – Round Diamond – With Side Diamonds',
    body: 'Luxurious halo design with a brilliant round center stone, halo accents, and side diamonds.',
    type: 'Engagement Rings',
    category: 'Engagement Rings',
    tags: 'Engagement Rings, Halo, Round, With Side Diamonds, Lab-Grown Diamond, Natural Diamond',
    priceTable: ENGAGEMENT_RING_PRICES,
    shapes: ['Round']
  },
  {
    handle: 'halo-engagement-ring-princess-diamond-no-side-diamonds',
    title: 'Halo Engagement Ring – Princess Diamond – No Side Diamonds',
    body: 'Modern halo design with a princess-cut center stone, surrounded by sparkling accents.',
    type: 'Engagement Rings',
    category: 'Engagement Rings',
    tags: 'Engagement Rings, Halo, Princess, No Side Diamonds, Lab-Grown Diamond, Natural Diamond',
    priceTable: ENGAGEMENT_RING_PRICES,
    shapes: ['Princess']
  },
  {
    handle: 'halo-engagement-ring-princess-diamond-with-side-diamonds',
    title: 'Halo Engagement Ring – Princess Diamond – With Side Diamonds',
    body: 'Luxurious halo design with a princess-cut center stone, halo accents, and side diamonds.',
    type: 'Engagement Rings',
    category: 'Engagement Rings',
    tags: 'Engagement Rings, Halo, Princess, With Side Diamonds, Lab-Grown Diamond, Natural Diamond',
    priceTable: ENGAGEMENT_RING_PRICES,
    shapes: ['Princess']
  },
  {
    handle: 'halo-engagement-ring-cushion-diamond-no-side-diamonds',
    title: 'Halo Engagement Ring – Cushion Diamond – No Side Diamonds',
    body: 'Romantic halo design with a cushion-cut center stone, surrounded by sparkling accents.',
    type: 'Engagement Rings',
    category: 'Engagement Rings',
    tags: 'Engagement Rings, Halo, Cushion, No Side Diamonds, Lab-Grown Diamond, Natural Diamond',
    priceTable: ENGAGEMENT_RING_PRICES,
    shapes: ['Cushion']
  },
  {
    handle: 'halo-engagement-ring-emerald-diamond-no-side-diamonds',
    title: 'Halo Engagement Ring – Emerald Diamond – No Side Diamonds',
    body: 'Elegant halo design with an emerald-cut center stone, surrounded by sparkling accents.',
    type: 'Engagement Rings',
    category: 'Engagement Rings',
    tags: 'Engagement Rings, Halo, Emerald, No Side Diamonds, Lab-Grown Diamond, Natural Diamond',
    priceTable: ENGAGEMENT_RING_PRICES,
    shapes: ['Emerald']
  },
  // NECKLACES
  {
    handle: 'timeless-necklace',
    title: 'Timeless Necklace',
    body: 'Delicate and elegant necklace with a brilliant diamond pendant in your choice of 18K gold.',
    type: 'Necklaces',
    category: 'Necklaces',
    tags: 'Necklaces, Timeless, Lab-Grown Diamond, Natural Diamond',
    priceTable: NECKLACE_PRICES,
    shapes: []
  },
  // EARRINGS
  {
    handle: 'classic-stud-earrings',
    title: 'Classic Stud Earrings',
    body: 'Timeless diamond stud earrings in your choice of 18K gold.',
    type: 'Earrings',
    category: 'Earrings',
    tags: 'Earrings, Studs, Lab-Grown Diamond, Natural Diamond',
    priceTable: EARRING_PRICES,
    shapes: []
  }
];

// Generate CSV rows
const rows: VariantRow[] = [];

products.forEach((product, productIndex) => {
  METAL_COLORS.forEach((metalColor, metalIndex) => {
    DIAMOND_TYPES.forEach((diamondType, diamondIndex) => {
      const isFirstRow = metalIndex === 0 && diamondIndex === 0;
      const price = product.priceTable[diamondType.price as keyof typeof product.priceTable];

      const row: VariantRow = {
        Handle: product.handle,
        Title: isFirstRow ? product.title : '',
        'Body (HTML)': isFirstRow ? product.body : '',
        Vendor: isFirstRow ? 'Diamonds by Caroline Scheltjens' : '',
        'Product Category': isFirstRow ? product.category : '',
        Type: isFirstRow ? product.type : '',
        Tags: isFirstRow ? product.tags : '',
        Published: isFirstRow ? 'TRUE' : '',
        'Option1 Name': isFirstRow ? 'Metal Color' : '',
        'Option1 Value': metalColor,
        'Option2 Name': isFirstRow ? 'Diamond Type' : '',
        'Option2 Value': diamondType.label,
        'Option3 Name': '',
        'Option3 Value': '',
        'Variant SKU': `${product.handle}-${metalColor.toLowerCase().replace(' ', '-')}-${diamondType.shortLabel.toLowerCase().replace('.', '')}`,
        'Variant Grams': '0',
        'Variant Inventory Tracker': 'shopify',
        'Variant Inventory Policy': 'deny',
        'Variant Fulfillment Service': 'manual',
        'Variant Price': price.toString(),
        'Variant Compare At Price': '',
        'Variant Requires Shipping': 'TRUE',
        'Variant Taxable': 'TRUE',
        'Variant Barcode': '',
        'Image Src': '',
        'Image Position': '',
        'Image Alt Text': '',
        'Gift Card': 'FALSE',
        'SEO Title': isFirstRow ? `${product.title} | Diamonds by Caroline Scheltjens` : '',
        'SEO Description': isFirstRow ? product.body : '',
        'Google Shopping / Google Product Category': '',
        'Google Shopping / Gender': '',
        'Google Shopping / Age Group': '',
        'Google Shopping / MPN': '',
        'Google Shopping / Condition': 'new',
        'Google Shopping / Custom Product': 'TRUE',
        'Google Shopping / Custom Label 0': '',
        'Google Shopping / Custom Label 1': '',
        'Google Shopping / Custom Label 2': '',
        'Google Shopping / Custom Label 3': '',
        'Google Shopping / Custom Label 4': '',
        'Variant Image': '',
        'Variant Weight Unit': 'g',
        'Variant Tax Code': '',
        'Cost per item': '',
        'Included / Netherlands': 'TRUE',
        Status: 'active'
      };

      rows.push(row);
    });
  });
});

// Convert to CSV
const headers = Object.keys(rows[0]) as (keyof VariantRow)[];
const csvContent = [
  headers.join(','),
  ...rows.map(row =>
    headers.map(header => {
      const value = row[header];
      // Escape values that contain commas or quotes
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  )
].join('\n');

// Write to file
const outputPath = 'shopify-corrected-products.csv';
fs.writeFileSync(outputPath, csvContent, 'utf-8');

console.log('✅ CSV Generated Successfully!');
console.log(`📁 File: ${outputPath}`);
console.log(`📊 Total Products: ${products.length}`);
console.log(`📦 Total Variants: ${rows.length}`);
console.log('');
console.log('🔧 FIXES APPLIED:');
console.log('✓ Removed duplicate variants (rose-gold, yellow-gold, white)');
console.log('✓ Standardized option names to "Metal Color" and "Diamond Type"');
console.log('✓ Fixed all pricing to match Caroline\'s structure');
console.log('✓ Removed ring size variants (customers add via order notes)');
console.log('✓ Standardized diamond labels to "Lab-Grown X.XXct DVS2" format');
console.log('✓ All Halo rings use standard engagement ring pricing');
console.log('');
console.log('📋 PRODUCT BREAKDOWN:');
products.forEach(p => {
  const variantCount = METAL_COLORS.length * DIAMOND_TYPES.length;
  console.log(`   • ${p.title}: ${variantCount} variants`);
});
console.log('');
console.log('💰 PRICING STRUCTURE:');
console.log('   Engagement Rings: €790 / €990 / €1,250 / €3,000');
console.log('   Necklaces: €750 / €950 / €1,210 / €3,000');
console.log('   Earrings: €690 / €890 / €1,150 / €3,000');
