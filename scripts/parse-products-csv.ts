import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CSVRow {
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
  'Variant Price': string;
  'Variant Compare At Price': string;
  'Variant Inventory Qty': string;
  'Variant Requires Shipping': string;
  'Variant Taxable': string;
  'Image Src': string;
  'Image Position': string;
  'Image Alt Text': string;
  'Age group (product.metafields.shopify.age-group)': string;
  'Color (product.metafields.shopify.color-pattern)': string;
  'Jewelry material (product.metafields.shopify.jewelry-material)': string;
  'Jewelry type (product.metafields.shopify.jewelry-type)': string;
  'Ring design (product.metafields.shopify.ring-design)': string;
  'Ring size (product.metafields.shopify.ring-size)': string;
  'Target gender (product.metafields.shopify.target-gender)': string;
  Status: string;
}

interface ProductImage {
  src: string;
  position: number;
  alt?: string;
}

interface ProductMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

interface ParsedProduct {
  handle: string;
  title: string;
  bodyHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  published: boolean;
  price: string;
  compareAtPrice?: string;
  inventoryQty: number;
  requiresShipping: boolean;
  taxable: boolean;
  images: ProductImage[];
  metafields: ProductMetafield[];
  status: string;
}

function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');

  const rows: CSVRow[] = [];
  let currentRow = '';
  let inQuotes = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
        currentRow += char;
      } else {
        currentRow += char;
      }
    }

    if (!inQuotes) {
      if (currentRow.trim()) {
        const values = parseCSVLine(currentRow);
        const row: any = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index] || '';
        });
        rows.push(row as CSVRow);
      }
      currentRow = '';
    } else {
      currentRow += '\n';
    }
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function groupProductsByHandle(rows: CSVRow[]): Map<string, ParsedProduct> {
  const products = new Map<string, ParsedProduct>();

  for (const row of rows) {
    const handle = row.Handle;

    if (!handle) continue;

    if (!products.has(handle)) {
      // First row for this product - contains all product data
      const tags = row.Tags ? row.Tags.split(',').map(t => t.trim()) : [];

      const metafields: ProductMetafield[] = [];

      // Add metafields if they exist
      if (row['Age group (product.metafields.shopify.age-group)']) {
        metafields.push({
          namespace: 'shopify',
          key: 'age-group',
          value: row['Age group (product.metafields.shopify.age-group)'],
          type: 'single_line_text_field'
        });
      }

      if (row['Color (product.metafields.shopify.color-pattern)']) {
        metafields.push({
          namespace: 'shopify',
          key: 'color-pattern',
          value: row['Color (product.metafields.shopify.color-pattern)'],
          type: 'single_line_text_field'
        });
      }

      if (row['Jewelry material (product.metafields.shopify.jewelry-material)']) {
        metafields.push({
          namespace: 'shopify',
          key: 'jewelry-material',
          value: row['Jewelry material (product.metafields.shopify.jewelry-material)'],
          type: 'single_line_text_field'
        });
      }

      if (row['Jewelry type (product.metafields.shopify.jewelry-type)']) {
        metafields.push({
          namespace: 'shopify',
          key: 'jewelry-type',
          value: row['Jewelry type (product.metafields.shopify.jewelry-type)'],
          type: 'single_line_text_field'
        });
      }

      if (row['Ring design (product.metafields.shopify.ring-design)']) {
        metafields.push({
          namespace: 'shopify',
          key: 'ring-design',
          value: row['Ring design (product.metafields.shopify.ring-design)'],
          type: 'single_line_text_field'
        });
      }

      if (row['Ring size (product.metafields.shopify.ring-size)']) {
        metafields.push({
          namespace: 'shopify',
          key: 'ring-size',
          value: row['Ring size (product.metafields.shopify.ring-size)'],
          type: 'single_line_text_field'
        });
      }

      if (row['Target gender (product.metafields.shopify.target-gender)']) {
        metafields.push({
          namespace: 'shopify',
          key: 'target-gender',
          value: row['Target gender (product.metafields.shopify.target-gender)'],
          type: 'single_line_text_field'
        });
      }

      products.set(handle, {
        handle,
        title: row.Title,
        bodyHtml: row['Body (HTML)'],
        vendor: row.Vendor,
        productType: row.Type,
        tags,
        published: row.Published === 'true',
        price: row['Variant Price'],
        compareAtPrice: row['Variant Compare At Price'] || undefined,
        inventoryQty: parseInt(row['Variant Inventory Qty']) || 0,
        requiresShipping: row['Variant Requires Shipping'] === 'true',
        taxable: row['Variant Taxable'] === 'true',
        images: [],
        metafields,
        status: row.Status
      });
    }

    // Add image if present
    if (row['Image Src']) {
      const product = products.get(handle)!;
      product.images.push({
        src: row['Image Src'],
        position: parseInt(row['Image Position']) || product.images.length + 1,
        alt: row['Image Alt Text'] || undefined
      });
    }
  }

  return products;
}

function main() {
  const csvPath = path.join(__dirname, '../src/data/products_export.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  console.log('Parsing CSV file...');
  const rows = parseCSV(csvContent);
  console.log(`Parsed ${rows.length} rows`);

  console.log('Grouping products by handle...');
  const productsMap = groupProductsByHandle(rows);
  const products = Array.from(productsMap.values());
  console.log(`Found ${products.length} unique products`);

  // Sort images by position
  products.forEach(product => {
    product.images.sort((a, b) => a.position - b.position);
  });

  // Output summary
  console.log('\n=== Product Summary ===');
  products.forEach((product, index) => {
    console.log(`\n${index + 1}. ${product.title}`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   Type: ${product.productType}`);
    console.log(`   Price: $${product.price}`);
    console.log(`   Images: ${product.images.length}`);
    console.log(`   Tags: ${product.tags.join(', ')}`);
    console.log(`   Metafields: ${product.metafields.length}`);
    if (product.metafields.length > 0) {
      product.metafields.forEach(mf => {
        console.log(`     - ${mf.key}: ${mf.value}`);
      });
    }
  });

  // Save parsed products to JSON
  const outputPath = path.join(__dirname, '../src/data/parsed_products.json');
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
  console.log(`\n✓ Parsed products saved to: ${outputPath}`);

  // Create Shopify import format
  const shopifyImportData = products.map(product => ({
    product: {
      title: product.title,
      body_html: product.bodyHtml,
      vendor: product.vendor,
      product_type: product.productType,
      tags: product.tags.join(', '),
      published: product.published,
      status: product.status,
      variants: [{
        price: product.price,
        compare_at_price: product.compareAtPrice,
        inventory_quantity: product.inventoryQty,
        requires_shipping: product.requiresShipping,
        taxable: product.taxable
      }],
      images: product.images.map(img => ({
        src: img.src,
        position: img.position,
        alt: img.alt
      })),
      metafields: product.metafields
    }
  }));

  const shopifyOutputPath = path.join(__dirname, '../src/data/shopify_import.json');
  fs.writeFileSync(shopifyOutputPath, JSON.stringify(shopifyImportData, null, 2));
  console.log(`✓ Shopify import data saved to: ${shopifyOutputPath}`);
}

main();
