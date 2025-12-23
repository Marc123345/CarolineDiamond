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

// Define the 4 solitaire engagement ring models
const engagementRingProducts = [
  {
    title: 'Classic Solitaire Engagement Ring – Model 1',
    handle: 'classic-solitaire-engagement-ring-model-1',
    description: `Solitaire engagement ring, available in yellow, rose, and white 18k gold. Tax included with HRD, IGI, or GIA certificate.

Timeless elegance meets ethical luxury. This classic solitaire engagement ring features a stunning lab-grown diamond (D color, VS2 clarity) set in premium 18K gold.

The brilliant round-cut diamond is secured in a traditional 4-prong setting that maximizes light reflection and showcases the stone's exceptional fire and brilliance. Handcrafted in Antwerp with meticulous attention to detail, this ring represents the perfect symbol of enduring love.

Features:
• Center Stone: IGI/GIA/HRD-certified lab-grown diamond (D–VS2)
• Metal: 18K Gold (available in White, Yellow, or Rose Gold)
• Setting: Classic solitaire with secure 4-prong setting
• Band Style: Comfort-fit, 1.8-2.0mm width
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)
• Warranty: Lifetime craftsmanship guarantee

💎 Diamond Options:
• Lab-Grown 0.50ct: €790
• Lab-Grown 1.00ct: €990
• Lab-Grown 1.50ct: €1,250
• Natural Diamond: Price on request

Why You'll Love It:
✓ Ethically sourced lab-grown diamond with identical properties to mined diamonds
✓ Exceptional D color grade - the highest colorless rating
✓ VS2 clarity - eye-clean with excellent brilliance
✓ Timeless solitaire design that never goes out of style
✓ Handcrafted in Antwerp's diamond district
✓ Complimentary first-time resizing
✓ Includes elegant presentation box

Perfect for proposals, anniversaries, or as a symbol of eternal commitment.`,
    productType: 'Engagement Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Solitaire', 'Yellow Gold', 'White Gold', 'Rose Gold', 'Round', 'shape:round'],
    variants: [
      // Lab-Grown 0.50ct - 3 colors
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING1-LG050-YG', price: '790' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING1-LG050-WG', price: '790' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING1-LG050-RG', price: '790' },
      // Lab-Grown 1.00ct - 3 colors
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING1-LG100-YG', price: '990' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING1-LG100-WG', price: '990' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING1-LG100-RG', price: '990' },
      // Lab-Grown 1.50ct - 3 colors
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING1-LG150-YG', price: '1250' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING1-LG150-WG', price: '1250' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING1-LG150-RG', price: '1250' },
      // Natural Diamond - 3 colors (price = 0 for "Price on Request")
      { color: '18K Yellow Gold', diamondType: 'Natural Diamond', sku: 'RING1-NAT-YG', price: '0' },
      { color: '18K White Gold', diamondType: 'Natural Diamond', sku: 'RING1-NAT-WG', price: '0' },
      { color: '18K Rose Gold', diamondType: 'Natural Diamond', sku: 'RING1-NAT-RG', price: '0' },
    ],
  },
  {
    title: 'Classic Solitaire Engagement Ring – Model 2',
    handle: 'classic-solitaire-engagement-ring-model-2',
    description: `Solitaire engagement ring, available in yellow, rose, and white 18k gold. Tax included with HRD, IGI, or GIA certificate.

Elegant solitaire design with a slightly tapered band for enhanced comfort and modern aesthetic. This engagement ring features a stunning lab-grown diamond (D color, VS2 clarity) set in premium 18K gold.

💎 Diamond Options:
• Lab-Grown 0.50ct: €790
• Lab-Grown 1.00ct: €990
• Lab-Grown 1.50ct: €1,250
• Natural Diamond: Price on request

Handcrafted in Antwerp, Belgium.`,
    productType: 'Engagement Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Solitaire', 'Yellow Gold', 'White Gold', 'Rose Gold', 'Round', 'shape:round'],
    variants: [
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING2-LG050-YG', price: '790' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING2-LG050-WG', price: '790' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING2-LG050-RG', price: '790' },
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING2-LG100-YG', price: '990' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING2-LG100-WG', price: '990' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING2-LG100-RG', price: '990' },
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING2-LG150-YG', price: '1250' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING2-LG150-WG', price: '1250' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING2-LG150-RG', price: '1250' },
      { color: '18K Yellow Gold', diamondType: 'Natural Diamond', sku: 'RING2-NAT-YG', price: '0' },
      { color: '18K White Gold', diamondType: 'Natural Diamond', sku: 'RING2-NAT-WG', price: '0' },
      { color: '18K Rose Gold', diamondType: 'Natural Diamond', sku: 'RING2-NAT-RG', price: '0' },
    ],
  },
  {
    title: 'Classic Solitaire Engagement Ring – Model 3',
    handle: 'classic-solitaire-engagement-ring-model-3',
    description: `Solitaire engagement ring, available in yellow, rose, and white 18k gold. Tax included with HRD, IGI, or GIA certificate.

Cathedral setting solitaire design featuring a raised center stone with arch-like shoulders. This engagement ring showcases a stunning lab-grown diamond (D color, VS2 clarity) set in premium 18K gold.

💎 Diamond Options:
• Lab-Grown 0.50ct: €790
• Lab-Grown 1.00ct: €990
• Lab-Grown 1.50ct: €1,250
• Natural Diamond: Price on request

Handcrafted in Antwerp, Belgium.`,
    productType: 'Engagement Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Solitaire', 'Yellow Gold', 'White Gold', 'Rose Gold', 'Round', 'shape:round'],
    variants: [
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING3-LG050-YG', price: '790' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING3-LG050-WG', price: '790' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING3-LG050-RG', price: '790' },
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING3-LG100-YG', price: '990' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING3-LG100-WG', price: '990' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING3-LG100-RG', price: '990' },
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING3-LG150-YG', price: '1250' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING3-LG150-WG', price: '1250' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING3-LG150-RG', price: '1250' },
      { color: '18K Yellow Gold', diamondType: 'Natural Diamond', sku: 'RING3-NAT-YG', price: '0' },
      { color: '18K White Gold', diamondType: 'Natural Diamond', sku: 'RING3-NAT-WG', price: '0' },
      { color: '18K Rose Gold', diamondType: 'Natural Diamond', sku: 'RING3-NAT-RG', price: '0' },
    ],
  },
  {
    title: 'Classic Solitaire Engagement Ring – Model 4',
    handle: 'classic-solitaire-engagement-ring-model-4',
    description: `Solitaire engagement ring, available in yellow, rose, and white 18k gold. Tax included with HRD, IGI, or GIA certificate.

Sleek modern solitaire with knife-edge band detail. This engagement ring features a stunning lab-grown diamond (D color, VS2 clarity) set in premium 18K gold with contemporary styling.

💎 Diamond Options:
• Lab-Grown 0.50ct: €790
• Lab-Grown 1.00ct: €990
• Lab-Grown 1.50ct: €1,250
• Natural Diamond: Price on request

Handcrafted in Antwerp, Belgium.`,
    productType: 'Engagement Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Solitaire', 'Yellow Gold', 'White Gold', 'Rose Gold', 'Round', 'shape:round'],
    variants: [
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING4-LG050-YG', price: '790' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING4-LG050-WG', price: '790' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 0.50ct', sku: 'RING4-LG050-RG', price: '790' },
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING4-LG100-YG', price: '990' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING4-LG100-WG', price: '990' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 1.00ct', sku: 'RING4-LG100-RG', price: '990' },
      { color: '18K Yellow Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING4-LG150-YG', price: '1250' },
      { color: '18K White Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING4-LG150-WG', price: '1250' },
      { color: '18K Rose Gold', diamondType: 'Lab-Grown 1.50ct', sku: 'RING4-LG150-RG', price: '1250' },
      { color: '18K Yellow Gold', diamondType: 'Natural Diamond', sku: 'RING4-NAT-YG', price: '0' },
      { color: '18K White Gold', diamondType: 'Natural Diamond', sku: 'RING4-NAT-WG', price: '0' },
      { color: '18K Rose Gold', diamondType: 'Natural Diamond', sku: 'RING4-NAT-RG', price: '0' },
    ],
  },
];

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

async function createProductWithVariants(productData: typeof engagementRingProducts[0]) {
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
          values: ['Lab-Grown 0.50ct', 'Lab-Grown 1.00ct', 'Lab-Grown 1.50ct', 'Natural Diamond']
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
  console.log('🔄 Starting Solitaire Engagement Ring Setup (4 Models)...\n');
  console.log('📋 Product Structure:');
  console.log('   4 Models × (Color (3) × Diamond Type (4)) = 12 variants per model');
  console.log('   Total: 48 variants across all models');
  console.log('\n💎 Pricing (same for all models):');
  console.log('   • Lab-Grown 0.50ct (all colors): €790');
  console.log('   • Lab-Grown 1.00ct (all colors): €990');
  console.log('   • Lab-Grown 1.50ct (all colors): €1,250');
  console.log('   • Natural Diamond (all colors): €0 (Price on Request)');
  console.log('   Tax & certificate included\n');

  let createdCount = 0;
  let updatedCount = 0;

  for (const productData of engagementRingProducts) {
    try {
      // Check if product exists
      const existingProduct = await findProductByHandle(productData.handle);

      if (existingProduct) {
        console.log(`\n⚠️  Found existing product: ${existingProduct.title}`);
        console.log(`   Existing product has ${existingProduct.variants.edges.length} variants`);
        console.log('   Will delete and recreate with new structure...');
        
        const deleted = await deleteProduct(existingProduct.id);
        if (deleted) {
          console.log('✅ Old product deleted');
          updatedCount++;
          // Wait a bit before recreating
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.error('❌ Failed to delete old product. Skipping.');
          continue;
        }
      }

      // Create new product
      const newProduct = await createProductWithVariants(productData);
      if (newProduct) {
        console.log(`\n✅ Successfully created: ${newProduct.title}`);
        createdCount++;
      }

      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Error processing ${productData.title}:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Solitaire Engagement Ring setup completed!');
  console.log(`   Created: ${createdCount} products`);
  console.log(`   Updated: ${updatedCount} products`);
  console.log(`   Total variants created: ${(createdCount + updatedCount) * 12}`);
  console.log('='.repeat(60));
  
  console.log('\n📝 Next steps:');
  console.log('   1. Run: npm run fetch-products');
  console.log('   2. Verify 4 engagement ring models appear on the frontend');
  console.log('   3. Verify each model has 12 variants (3 colors × 4 diamond types)');
  console.log('   4. Test Natural Diamond "Price on Request" functionality');
  console.log('   5. Test diamond shape selector');
  console.log('   6. Test birthstone selector with +€40 pricing\n');
}

main().catch(console.error);
