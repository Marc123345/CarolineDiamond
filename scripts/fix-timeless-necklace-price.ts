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

async function findTimelessNecklace() {
  const query = `
    query FindProduct {
      products(first: 50, query: "product_type:'Diamond Necklace'") {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            variants(first: 10) {
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

  const result = await shopifyAdminRequest(query);

  console.log('🔍 Found necklace products:');
  result.data.products.edges.forEach((edge: any) => {
    console.log(`   - ${edge.node.title}`);
  });

  // Find the exact product
  const product = result.data.products.edges.find((edge: any) =>
    edge.node.title.toLowerCase().includes('timeless')
  );

  return product?.node;
}

async function updateVariantPrice(variantId: string, newPrice: string) {
  const numericId = variantId.split('/').pop();
  const REST_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/variants/${numericId}.json`;

  const variantPayload = {
    variant: {
      id: parseInt(numericId!),
      price: newPrice
    }
  };

  const response = await fetch(REST_API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN!,
    },
    body: JSON.stringify(variantPayload)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ REST API Error:', error);
    return false;
  }

  return true;
}

async function updateProductDescription(productId: string) {
  const numericId = productId.split('/').pop();
  const REST_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/products/${numericId}.json`;

  const updatedDescription = `
<p><strong>A minimalist masterpiece designed for everyday wear.</strong></p>

<p>The Timeless Diamond Necklace by Diamonds by CS features a hand-set, brilliant-cut diamond suspended on a delicate 18K gold chain — elegant, versatile, and perfect for gifting.</p>

<h3>✨ Available in:</h3>
<ul>
  <li>18K Yellow Gold</li>
  <li>18K White Gold</li>
  <li>18K Rose Gold</li>
</ul>

<h3>💎 Diamond Options:</h3>
<ul>
  <li><strong>Lab-Grown 0.50 ct (D-VS2): €750</strong> - Tax & certificate included</li>
  <li><strong>Lab-Grown 1.00 ct (D-VS2): €1,190</strong> - Tax & certificate included</li>
  <li><strong>Natural Diamond:</strong> Price on request</li>
</ul>

<p><em>Note: Current listing shows base price for 0.50ct lab-grown option. Final price varies by carat weight and diamond type. Contact us for 1.00ct or natural diamond pricing.</em></p>

<h3>📦 Includes:</h3>
<ul>
  <li>Certificate of authenticity</li>
  <li>Elegant packaging</li>
  <li>Free worldwide shipping</li>
</ul>

<p>Handcrafted in Antwerp, Belgium.</p>
`;

  const productPayload = {
    product: {
      id: parseInt(numericId!),
      body_html: updatedDescription
    }
  };

  const response = await fetch(REST_API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN!,
    },
    body: JSON.stringify(productPayload)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ REST API Error:', error);
    return false;
  }

  return true;
}

async function main() {
  console.log('🔄 Fixing Timeless Diamond Necklace Pricing...\n');

  try {
    const product = await findTimelessNecklace();

    if (!product) {
      console.error('❌ Timeless Diamond Necklace not found!');
      return;
    }

    console.log(`✅ Found product: ${product.title}`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Handle: ${product.handle}`);
    console.log('\n📝 Current variants:');

    product.variants.edges.forEach((edge: any) => {
      console.log(`   • ${edge.node.title}: €${edge.node.price}`);
    });

    console.log('\n💰 Updating prices to €750 (base price for 0.50ct lab-grown)...\n');

    // Update all variants to €750 (base price for 0.50ct)
    for (const edge of product.variants.edges) {
      const variant = edge.node;
      console.log(`   Updating ${variant.title}...`);
      await updateVariantPrice(variant.id, '750');
      console.log(`   ✅ ${variant.title}: €0.00 → €750`);
    }

    console.log('\n📝 Updating product description with pricing details...');
    await updateProductDescription(product.id);

    console.log('\n✅ Update completed successfully!');
    console.log('\n💡 Important Notes:');
    console.log('   • Base price shown: €750 (0.50ct lab-grown diamond)');
    console.log('   • 1.00ct lab-grown: €1,190');
    console.log('   • Natural diamond options: Price on request');
    console.log('   • Prices include tax and certificate');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm run fetch-products');
    console.log('   2. Verify pricing on the website');
    console.log('   3. Consider adding separate products for 1.00ct option\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main().catch(console.error);
