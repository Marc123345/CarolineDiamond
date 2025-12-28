import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * CSV Generator for 84-Variant Product Structure
 *
 * Generates a Shopify-compatible CSV file for products with:
 * - Option 1: Metal Color (3 values)
 * - Option 2: Diamond Type (4 values)
 * - Option 3: Ring Size (7 values)
 * - Total: 84 variants per product
 */

const STANDARDIZED_STRUCTURE = {
  option1Name: 'Metal Color',
  option1Values: ['18K Yellow Gold', '18K White Gold', '18K Rose Gold'],

  option2Name: 'Diamond Type',
  option2Values: ['0.50ct', '1.00ct', '1.50ct', 'Natural Diamond'],

  option3Name: 'Ring Size',
  option3Values: ['EU 48', 'EU 50', 'EU 52', 'EU 54', 'EU 56', 'EU 58', 'EU 60'],
};

const STANDARDIZED_PRICING = {
  '0.50ct': 1150.00,
  '1.00ct': 1350.00,
  '1.50ct': 1610.00,
  'Natural Diamond': 3360.00,
};

interface ProductConfig {
  handle: string;
  title: string;
  bodyHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
}

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

function generateVariantSKU(
  productHandle: string,
  metal: string,
  diamond: string,
  size: string
): string {
  const metalCode = metal.includes('Yellow') ? 'YG' : metal.includes('White') ? 'WG' : 'RG';
  const diamondCode = diamond.replace('.', '').replace('ct', '').replace(' ', '-');
  const sizeCode = size.replace(' ', '');
  return `${productHandle.toUpperCase()}-${metalCode}-${diamondCode}-${sizeCode}`;
}

function generateVariants(product: ProductConfig): VariantRow[] {
  const rows: VariantRow[] = [];
  let variantIndex = 0;

  STANDARDIZED_STRUCTURE.option1Values.forEach((metalColor) => {
    STANDARDIZED_STRUCTURE.option2Values.forEach((diamondType) => {
      STANDARDIZED_STRUCTURE.option3Values.forEach((ringSize) => {
        const price = STANDARDIZED_PRICING[diamondType as keyof typeof STANDARDIZED_PRICING];
        const sku = generateVariantSKU(product.handle, metalColor, diamondType, ringSize);

        const row: VariantRow = {
          Handle: product.handle,
          Title: variantIndex === 0 ? product.title : '',
          'Body (HTML)': variantIndex === 0 ? product.bodyHtml : '',
          Vendor: variantIndex === 0 ? product.vendor : '',
          'Product Category': variantIndex === 0 ? 'Jewelry & Watches > Jewelry > Rings' : '',
          Type: variantIndex === 0 ? product.productType : '',
          Tags: variantIndex === 0 ? product.tags.join(', ') : '',
          Published: variantIndex === 0 ? 'true' : '',
          'Option1 Name': STANDARDIZED_STRUCTURE.option1Name,
          'Option1 Value': metalColor,
          'Option2 Name': STANDARDIZED_STRUCTURE.option2Name,
          'Option2 Value': diamondType,
          'Option3 Name': STANDARDIZED_STRUCTURE.option3Name,
          'Option3 Value': ringSize,
          'Variant SKU': sku,
          'Variant Grams': '0',
          'Variant Inventory Tracker': '',
          'Variant Inventory Policy': 'continue',
          'Variant Fulfillment Service': 'manual',
          'Variant Price': price.toFixed(2),
          'Variant Compare At Price': '',
          'Variant Requires Shipping': 'true',
          'Variant Taxable': 'true',
          'Variant Barcode': '',
          'Image Src': '',
          'Image Position': '',
          'Image Alt Text': '',
          'Gift Card': 'false',
          'SEO Title': '',
          'SEO Description': '',
          'Google Shopping / Google Product Category': '',
          'Google Shopping / Gender': 'unisex',
          'Google Shopping / Age Group': 'adult',
          'Google Shopping / MPN': '',
          'Google Shopping / Condition': 'new',
          'Google Shopping / Custom Product': 'true',
          'Google Shopping / Custom Label 0': '',
          'Google Shopping / Custom Label 1': '',
          'Google Shopping / Custom Label 2': '',
          'Google Shopping / Custom Label 3': '',
          'Google Shopping / Custom Label 4': '',
          'Variant Image': '',
          'Variant Weight Unit': 'g',
          'Variant Tax Code': '',
          'Cost per item': '',
          'Included / Netherlands': 'true',
          Status: 'active',
        };

        rows.push(row);
        variantIndex++;
      });
    });
  });

  return rows;
}

function convertToCSV(rows: VariantRow[]): string {
  if (rows.length === 0) return '';

  const headers = Object.keys(rows[0]);
  const csvRows = [headers.join(',')];

  rows.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header as keyof VariantRow];
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}

async function main() {
  console.log('🔧 84-Variant CSV Generator\n');
  console.log('================================================================================');
  console.log('Structure per product:');
  console.log(`  • ${STANDARDIZED_STRUCTURE.option1Values.length} Metal Colors`);
  console.log(`  • ${STANDARDIZED_STRUCTURE.option2Values.length} Diamond Types`);
  console.log(`  • ${STANDARDIZED_STRUCTURE.option3Values.length} Ring Sizes`);
  console.log(`  • Total: ${STANDARDIZED_STRUCTURE.option1Values.length * STANDARDIZED_STRUCTURE.option2Values.length * STANDARDIZED_STRUCTURE.option3Values.length} variants per product\n`);
  console.log('Pricing:');
  Object.entries(STANDARDIZED_PRICING).forEach(([type, price]) => {
    console.log(`  • ${type}: €${price.toFixed(2)}`);
  });
  console.log('================================================================================\n');

  const exampleProducts: ProductConfig[] = [
    {
      handle: 'solitaire-princess-ring',
      title: 'Solitaire Ring with Princess Shape Diamond',
      bodyHtml: '<p>Classic timeless solitaire ring with princess cut diamond</p>',
      vendor: 'Diamonds by CS',
      productType: 'Engagement Ring',
      tags: ['engagement-ring', 'solitaire', 'princess', 'lab-grown-diamond'],
    },
    {
      handle: 'solitaire-round-ring',
      title: 'Solitaire Ring with Round Diamond',
      bodyHtml: '<p>Classic timeless solitaire ring with round brilliant diamond</p>',
      vendor: 'Diamonds by CS',
      productType: 'Engagement Ring',
      tags: ['engagement-ring', 'solitaire', 'round', 'lab-grown-diamond'],
    },
    {
      handle: 'solitaire-oval-ring',
      title: 'Solitaire Ring with Oval Diamond',
      bodyHtml: '<p>Classic timeless solitaire ring with oval diamond</p>',
      vendor: 'Diamonds by CS',
      productType: 'Engagement Ring',
      tags: ['engagement-ring', 'solitaire', 'oval', 'lab-grown-diamond'],
    },
    {
      handle: 'solitaire-round-side-diamonds',
      title: 'Solitaire Ring with Round Diamond and Side Diamonds',
      bodyHtml: '<p>Elegant solitaire ring with round diamond enhanced by side diamonds</p>',
      vendor: 'Diamonds by CS',
      productType: 'Engagement Ring',
      tags: ['engagement-ring', 'solitaire', 'round', 'with-side-diamonds', 'lab-grown-diamond'],
    },
    {
      handle: 'solitaire-emerald-side-diamonds',
      title: 'Solitaire Ring with Emerald Shape and Side Diamond',
      bodyHtml: '<p>Sophisticated solitaire ring with emerald cut diamond and side diamonds</p>',
      vendor: 'Diamonds by CS',
      productType: 'Engagement Ring',
      tags: ['engagement-ring', 'solitaire', 'emerald', 'with-side-diamonds', 'lab-grown-diamond'],
    },
    {
      handle: 'halo-cushion-side-diamonds',
      title: 'Halo Ring with Cushion Diamond and Side Diamonds',
      bodyHtml: '<p>Stunning halo ring with cushion cut diamond surrounded by smaller diamonds</p>',
      vendor: 'Diamonds by CS',
      productType: 'Engagement Ring',
      tags: ['engagement-ring', 'halo', 'cushion', 'with-side-diamonds', 'lab-grown-diamond'],
    },
    {
      handle: 'halo-pear-ring',
      title: 'Halo Ring with Pear Shape Diamond',
      bodyHtml: '<p>Beautiful halo ring with pear shaped diamond</p>',
      vendor: 'Diamonds by CS',
      productType: 'Engagement Ring',
      tags: ['engagement-ring', 'halo', 'pear', 'lab-grown-diamond'],
    },
    {
      handle: 'halo-ring-side-diamonds',
      title: 'Halo Ring with Side Diamonds',
      bodyHtml: '<p>Luxurious halo ring with side diamonds on the band</p>',
      vendor: 'Diamonds by CS',
      productType: 'Engagement Ring',
      tags: ['engagement-ring', 'halo', 'with-side-diamonds', 'lab-grown-diamond'],
    },
  ];

  console.log(`📦 Generating CSV for ${exampleProducts.length} products...\n`);

  const allRows: VariantRow[] = [];

  exampleProducts.forEach((product, index) => {
    console.log(`${index + 1}. ${product.title}`);
    const variants = generateVariants(product);
    console.log(`   ✓ Generated ${variants.length} variants`);
    allRows.push(...variants);
  });

  const csv = convertToCSV(allRows);
  const outputPath = path.resolve(process.cwd(), 'shopify-84-variants-import.csv');
  fs.writeFileSync(outputPath, csv);

  console.log('\n================================================================================');
  console.log('✅ CSV Generated Successfully!\n');
  console.log(`📄 File: ${outputPath}`);
  console.log(`📊 Total variants: ${allRows.length}`);
  console.log(`📦 Products: ${exampleProducts.length}`);
  console.log(`🔢 Variants per product: 84\n`);
  console.log('Next steps:');
  console.log('  1. Review the CSV file');
  console.log('  2. Import to Shopify: Admin → Products → Import');
  console.log('  3. Run: npm run fetch-products');
  console.log('  4. Test variant selection on storefront\n');
}

main().catch(console.error);
