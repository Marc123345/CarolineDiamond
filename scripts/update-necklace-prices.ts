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

// Define the necklace products with correct prices
const necklaceProducts = [
  {
    title: 'Timeless Diamond Necklace – 18K Gold – 0.50ct',
    description: `A minimalist masterpiece designed for everyday wear. The Timeless Diamond Necklace features a stunning 0.50 carat brilliant-cut diamond suspended on a delicate 18K gold chain — elegant, versatile, and perfect for any occasion.

Handcrafted in Antwerp with meticulous attention to detail, this necklace combines timeless design with ethical luxury. The single diamond pendant catches the light beautifully, creating subtle sparkle that complements any outfit.

Features:
• Center Stone: 0.50 carat brilliant-cut lab-grown diamond (D color, VS2 clarity)
• Metal: 18K Gold (available in Yellow, White, or Rose Gold)
• Chain Length: 16-18 inches adjustable
• Chain Style: Delicate cable chain
• Setting: Four-prong basket setting
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)

Why You'll Love It:
✓ Perfect for everyday wear and special occasions
✓ Timeless, minimalist design that never goes out of style
✓ Ethically sourced lab-grown diamond
✓ Exceptional D color grade - perfectly colorless
✓ VS2 clarity - eye-clean with brilliant fire
✓ Handcrafted in Antwerp's diamond district
✓ Includes elegant presentation box

Available Diamond Shapes:
• Round (Classic)
• Princess
• Cushion
• Oval
• Emerald
• Pear
• Heart
• And more custom shapes

Also available with natural diamonds - price on request.
Perfect holiday gift idea for someone special!

Price includes tax and official diamond certification.
Includes luxury packaging and free worldwide shipping.`,
    productType: 'Diamond Necklace',
    vendor: 'Diamonds by CS',
    tags: ['18k gold', 'Necklace', 'Lab-Grown Diamond', 'timeless', 'yellow gold', 'white gold', 'rose gold', '0.50ct', 'D-VS2', 'gift idea', 'handcrafted', 'diamond necklace'],
    price: '750',
    variants: [
      { option: 'Yellow Gold', sku: 'NECKLACE-050-YG', price: '750' },
      { option: 'White Gold', sku: 'NECKLACE-050-WG', price: '750' },
      { option: 'Rose Gold', sku: 'NECKLACE-050-RG', price: '750' },
    ],
  },
  {
    title: 'Timeless Diamond Necklace – 18K Gold – 1.00ct',
    description: `Make a statement with this breathtaking 1.00 carat diamond necklace. The Timeless Diamond Necklace features a full carat brilliant-cut diamond suspended on a delicate 18K gold chain — combining impressive presence with elegant refinement.

Handcrafted in Antwerp with master craftsmanship, this necklace is the ultimate symbol of luxury and sophistication. The substantial 1.00 carat diamond pendant creates stunning sparkle that draws admiring glances, perfect for both everyday elegance and special occasions.

Features:
• Center Stone: 1.00 carat brilliant-cut lab-grown diamond (D color, VS2 clarity)
• Metal: 18K Gold (available in Yellow, White, or Rose Gold)
• Chain Length: 16-18 inches adjustable
• Chain Style: Delicate cable chain
• Setting: Four-prong basket setting
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)

Why You'll Love It:
✓ Full carat center stone with maximum presence
✓ Timeless design enhanced by impressive size
✓ Ethically sourced lab-grown diamond
✓ Exceptional D color grade - perfectly colorless
✓ VS2 clarity - flawless to the naked eye
✓ Handcrafted in Antwerp by master artisans
✓ Includes luxurious presentation box

Available Diamond Shapes:
• Round (Classic)
• Princess
• Cushion
• Oval
• Emerald
• Pear
• Heart
• And more custom shapes

Also available with natural diamonds - price on request.
The ultimate luxury gift that will be treasured forever!

Price includes tax and official diamond certification.
Includes luxury packaging and free worldwide shipping.`,
    productType: 'Diamond Necklace',
    vendor: 'Diamonds by CS',
    tags: ['18k gold', 'Necklace', 'Lab-Grown Diamond', 'timeless', 'yellow gold', 'white gold', 'rose gold', '1.00ct', 'D-VS2', 'gift idea', 'handcrafted', 'diamond necklace'],
    price: '1190',
    variants: [
      { option: 'Yellow Gold', sku: 'NECKLACE-100-YG', price: '1190' },
      { option: 'White Gold', sku: 'NECKLACE-100-WG', price: '1190' },
      { option: 'Rose Gold', sku: 'NECKLACE-100-RG', price: '1190' },
    ],
  },
];

async function findProductByTitle(title: string) {
  const query = `
    query FindProduct($query: String!) {
      products(first: 10, query: $query) {
        edges {
          node {
            id
            title
            handle
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

  const result = await shopifyAdminRequest(query, { query: `title:${title}` });
  return result.data.products.edges[0]?.node;
}

async function createProductWithVariants(productData: typeof necklaceProducts[0]) {
  console.log(`\n📦 Creating product: ${productData.title}`);

  const REST_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/products.json`;

  const productPayload = {
    product: {
      title: productData.title,
      body_html: productData.description.replace(/\n/g, '<br/>'),
      vendor: productData.vendor,
      product_type: productData.productType,
      tags: productData.tags.join(', '),
      status: 'active',
      options: [
        {
          name: 'Metal Color',
          values: ['Yellow Gold', 'White Gold', 'Rose Gold']
        }
      ],
      variants: productData.variants.map(v => ({
        option1: v.option,
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

  for (const variant of result.product.variants) {
    console.log(`   ✓ ${variant.option1}: €${variant.price}`);
  }

  return result.product;
}

async function updateProductPrice(variantId: string, newPrice: string) {
  // Extract numeric ID from GraphQL ID (gid://shopify/ProductVariant/123456)
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

async function main() {
  console.log('🔄 Starting Diamond Necklace Price Update...\n');
  console.log('📋 New Pricing Structure:');
  console.log('   • 0.50ct D-VS2: €750 (all gold colors)');
  console.log('   • 1.00ct D-VS2: €1,190 (all gold colors)');
  console.log('   Tax included with HRD, IGI or GIA certificate\n');
  console.log('   Available in multiple diamond shapes: Round, Princess, Cushion, Oval, Emerald, Pear, Heart, and more');
  console.log('   Also available with natural diamonds (price on request)');
  console.log('   Perfect for everyday wear and special occasions\n');

  for (const productData of necklaceProducts) {
    try {
      // Check if product exists
      const existingProduct = await findProductByTitle(productData.title);

      if (existingProduct) {
        console.log(`\n📝 Updating existing product: ${productData.title}`);

        // Update prices for each variant
        for (let i = 0; i < existingProduct.variants.edges.length; i++) {
          const variant = existingProduct.variants.edges[i].node;
          const newPrice = productData.variants[i].price;

          console.log(`   Updating ${variant.title}: €${variant.price} → €${newPrice}`);

          await updateProductPrice(
            variant.id,
            newPrice
          );
        }

        console.log(`✅ Updated ${existingProduct.title}`);
      } else {
        // Create new product
        const newProduct = await createProductWithVariants(productData);
        if (newProduct) {
          console.log(`✅ Created new product: ${newProduct.title}`);
        }
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error processing ${productData.title}:`, error);
    }
  }

  console.log('\n✅ Price update completed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Run: npm run fetch-products');
  console.log('   2. Verify prices on the frontend');
  console.log('   3. Test the complete checkout flow\n');
}

main().catch(console.error);
