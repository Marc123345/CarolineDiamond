#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/graphql.json`;

async function shopifyAdminRequest(query: string, variables?: any) {
  const response = await fetch(ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

// Define the earring stud products with Diamond Type variants
const earringProduct = {
  title: 'Timeless Diamond Stud Earrings – 18K Gold',
  handle: 'timeless-diamond-stud-earrings',
  description: `Timeless everyday wear earrings, available in yellow, rose, and white 18k gold. Tax & certificate included.

Elegant, timeless, and designed for everyday wear — these diamond stud earrings by Diamonds by CS embody classic beauty in its purest form.

Available in 18K Yellow, White, and Rose Gold, each pair is handcrafted in Antwerp and set with lab-grown or natural diamonds.

✨ Diamond Options:
• Lab-Grown 0.30 ct (D-VS2): €490
• Lab-Grown 0.50 ct (D-VS2): €590
• Lab-Grown 1.00 ct (D-VS2): €890
• Natural Diamond: Price on request

💎 Customizations:
• Choose your diamond shape (Round, Princess, Cushion, Oval, Emerald, Pear, Radiant, Asscher)
• Personalize with your birthstone for a meaningful gift

🎁 Perfect Holiday Gift Idea
• Discover your birthstone on our website
• Tax & certificate included
• Luxury packaging and free worldwide shipping

Handcrafted in Antwerp, Belgium.`,
  productType: 'Diamond Earrings',
  vendor: 'Diamonds by CS',
  tags: ['18K Gold', 'Earrings', 'Lab-Grown Diamond', 'studs', 'timeless', 'Yellow Gold', 'White Gold', 'Rose Gold', 'gift idea', 'birthstone', 'handcrafted'],
  variants: [
    // Lab-Grown 0.30ct - 3 colors
    { color: '18K Yellow Gold', diamondType: 'Lab-Grown 0.30ct', sku: 'EAR-LG030-YG', price: '490' },
    { color: '18K White Gold', diamondType: 'Lab-Grown 0.30ct', sku: 'EAR-LG030-WG', price: '490' },
    { color: '18K Rose Gold', diamondType: 'Lab-Grown 0.30ct', sku: 'EAR-LG030-RG', price: '490' },
    // Lab-Grown 0.50ct - 3 colors
    { color: '18K Yellow Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'EAR-LG050-YG', price: '590' },
    { color: '18K White Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'EAR-LG050-WG', price: '590' },
    { color: '18K Rose Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'EAR-LG050-RG', price: '590' },
    // Lab-Grown 1.00ct - 3 colors
    { color: '18K Yellow Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'EAR-LG100-YG', price: '890' },
    { color: '18K White Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'EAR-LG100-WG', price: '890' },
    { color: '18K Rose Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'EAR-LG100-RG', price: '890' },
    // Natural Diamond - 3 colors (price = 0 for "Price on Request")
    { color: '18K Yellow Gold', diamondType: 'Natural Diamond', sku: 'EAR-NAT-YG', price: '0' },
    { color: '18K White Gold', diamondType: 'Natural Diamond', sku: 'EAR-NAT-WG', price: '0' },
    { color: '18K Rose Gold', diamondType: 'Natural Diamond', sku: 'EAR-NAT-RG', price: '0' },
  ],
};

async function findProductByHandle(handle: string) {
  const query = `
    query FindProduct($query: String!) {
      products(first: 1, query: $query) {
        edges {
          node {
            id
            title
            handle
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  price
                  sku
                }
              }
            }
          }
        }
      }
    }
  `;

  const result = await shopifyAdminRequest(query, { query: `handle:${handle}` });
  return result.data.products.edges[0]?.node;
}

async function createProductWithVariants(productData: typeof earringProduct) {
  console.log(`\n📦 Creating product: ${productData.title}`);

  const REST_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/products.json`;

  const productPayload = {
    product: {
      title: productData.title,
      handle: productData.handle,
      body_html: productData.description.replace(/\n/g, '<br/>'),
      vendor: productData.vendor,
      product_type: productData.productType,
      tags: productData.tags.join(', '),
      status: 'active',
      options: [
        {
          name: 'Color',
          values: ['18K Yellow Gold', '18K White Gold', '18K Rose Gold']
        },
        {
          name: 'Diamond Type',
          values: ['Lab-Grown 0.30ct', 'Lab-Grown 0.50ct', 'Lab-Grown 1.00ct', 'Natural Diamond']
        }
      ],
      variants: productData.variants.map(v => ({
        option1: v.color,
        option2: v.diamondType,
        price: v.price,
        sku: v.sku,
        inventory_policy: 'continue',
        inventory_management: null
      }))
    }
  };

  const response = await fetch(REST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN!,
    },
    body: JSON.stringify(productPayload)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ REST API Error:', error);
    return null;
  }

  const result = await response.json();
  console.log('✅ Product created with all variants successfully!');
  console.log(`   Product ID: ${result.product.id}`);
  console.log(`   Total variants: ${result.product.variants.length}`);

  // Group by diamond type for display
  const byDiamondType: { [key: string]: any[] } = {};
  result.product.variants.forEach((v: any) => {
    if (!byDiamondType[v.option2]) byDiamondType[v.option2] = [];
    byDiamondType[v.option2].push(v);
  });

  for (const [diamondType, variants] of Object.entries(byDiamondType)) {
    console.log(`\n   ${diamondType}:`);
    for (const variant of variants) {
      console.log(`   ✓ ${variant.option1}: €${variant.price}`);
    }
  }

  return result.product;
}

async function deleteProduct(productId: string) {
  // Extract numeric ID from GraphQL ID
  const numericId = productId.split('/').pop();
  const REST_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/products/${numericId}.json`;

  const response = await fetch(REST_API_URL, {
    method: 'DELETE',
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN!,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Error deleting product:', error);
    return false;
  }

  return true;
}

async function main() {
  console.log('🔄 Starting Earring Product Setup with Diamond Type Variants...\n');
  console.log('📋 Product Structure:');
  console.log('   Product: Timeless Diamond Stud Earrings');
  console.log('   Options: Color (3) × Diamond Type (4) = 12 variants total');
  console.log('\n💎 Pricing:');
  console.log('   • Lab-Grown 0.30ct (all colors): €490');
  console.log('   • Lab-Grown 0.50ct (all colors): €590');
  console.log('   • Lab-Grown 1.00ct (all colors): €890');
  console.log('   • Natural Diamond (all colors): €0 (Price on Request)');
  console.log('   Tax & certificate included\n');

  try {
    // Check if product exists
    const existingProduct = await findProductByHandle(earringProduct.handle);

    if (existingProduct) {
      console.log(`\n⚠️  Found existing product: ${existingProduct.title}`);
      console.log(`   Existing product has ${existingProduct.variants.edges.length} variants`);
      console.log('   Will delete and recreate with new structure...');
      
      const deleted = await deleteProduct(existingProduct.id);
      if (deleted) {
        console.log('✅ Old product deleted');
        // Wait a bit before recreating
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error('❌ Failed to delete old product. Aborting.');
        process.exit(1);
      }
    }

    // Create new product
    const newProduct = await createProductWithVariants(earringProduct);
    if (newProduct) {
      console.log(`\n✅ Successfully created: ${newProduct.title}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${earringProduct.title}:`, error);
  }

  console.log('\n✅ Earring product setup completed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Run: npm run fetch-products');
  console.log('   2. Verify product shows 12 variants on the frontend');
  console.log('   3. Test Natural Diamond "Price on Request" functionality');
  console.log('   4. Test diamond shape selector');
  console.log('   5. Test birthstone selector with +€40 pricing\n');
}

main().catch(console.error);
