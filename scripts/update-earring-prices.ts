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

// Define the earring stud products with correct prices
const earringProducts = [
  {
    title: 'Timeless Diamond Stud Earrings – 18K Gold – 0.30ct',
    description: `Elegant, timeless, and designed for everyday wear — these diamond stud earrings embody classic beauty in its purest form.

Available in 18K Yellow, White, and Rose Gold, each pair features 0.30 carat total weight of lab-grown diamonds (D-VS2 clarity). Handcrafted in Antwerp with meticulous attention to detail.

Features:
• Total Carat Weight: 0.30ct (0.15ct per earring)
• Diamond Quality: D color, VS2 clarity, lab-grown
• Metal: 18K Gold (available in Yellow, White, or Rose Gold)
• Setting: Classic 4-prong stud setting
• Backing: Secure screw-back or push-back closure
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)

Why You'll Love Them:
✓ Perfect for everyday wear
✓ Timeless design that never goes out of style
✓ Ethically sourced lab-grown diamonds
✓ Exceptional D color grade - perfectly colorless
✓ VS2 clarity - eye-clean with brilliant sparkle
✓ Handcrafted in Antwerp's diamond district
✓ Includes elegant presentation box

Available Diamond Shapes:
• Round (Classic)
• Princess
• Cushion
• Oval
• Emerald
• Pear
• Radiant
• Asscher

Also available with natural diamonds - price on request.
Can be personalized with your birthstone for a meaningful gift.

Perfect holiday gift idea!

Price includes tax and official diamond certification.
Includes luxury packaging and free worldwide shipping.`,
    productType: 'Diamond Earrings',
    vendor: 'Diamonds by CS',
    tags: ['18k gold', 'Earrings', 'Lab-Grown Diamond', 'studs', 'timeless', 'yellow gold', 'white gold', 'rose gold', '0.30ct', 'D-VS2', 'gift idea', 'birthstone', 'handcrafted'],
    price: '490',
    variants: [
      { option: 'Yellow Gold', sku: 'EARRING-030-YG', price: '490' },
      { option: 'White Gold', sku: 'EARRING-030-WG', price: '490' },
      { option: 'Rose Gold', sku: 'EARRING-030-RG', price: '490' },
    ],
  },
  {
    title: 'Timeless Diamond Stud Earrings – 18K Gold – 0.50ct',
    description: `Make a statement with these stunning 0.50 carat diamond stud earrings. Elegant, timeless, and designed for everyday wear — these earrings combine classic beauty with noticeable presence.

Available in 18K Yellow, White, and Rose Gold, each pair features 0.50 carat total weight of lab-grown diamonds (D-VS2 clarity). Handcrafted in Antwerp with meticulous attention to detail.

Features:
• Total Carat Weight: 0.50ct (0.25ct per earring)
• Diamond Quality: D color, VS2 clarity, lab-grown
• Metal: 18K Gold (available in Yellow, White, or Rose Gold)
• Setting: Classic 4-prong stud setting
• Backing: Secure screw-back or push-back closure
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)

Why You'll Love Them:
✓ Perfect balance of size and elegance
✓ Timeless design that never goes out of style
✓ Ethically sourced lab-grown diamonds
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
• Radiant
• Asscher

Also available with natural diamonds - price on request.
Can be personalized with your birthstone for a meaningful gift.

Perfect holiday gift idea!

Price includes tax and official diamond certification.
Includes luxury packaging and free worldwide shipping.`,
    productType: 'Diamond Earrings',
    vendor: 'Diamonds by CS',
    tags: ['18k gold', 'Earrings', 'Lab-Grown Diamond', 'studs', 'timeless', 'yellow gold', 'white gold', 'rose gold', '0.50ct', 'D-VS2', 'gift idea', 'birthstone', 'handcrafted'],
    price: '590',
    variants: [
      { option: 'Yellow Gold', sku: 'EARRING-050-YG', price: '590' },
      { option: 'White Gold', sku: 'EARRING-050-WG', price: '590' },
      { option: 'Rose Gold', sku: 'EARRING-050-RG', price: '590' },
    ],
  },
  {
    title: 'Timeless Diamond Stud Earrings – 18K Gold – 1.00ct',
    description: `Experience true luxury with these magnificent 1.00 carat diamond stud earrings. These show-stopping earrings deliver impressive presence while maintaining the timeless elegance of classic design.

Available in 18K Yellow, White, and Rose Gold, each pair features a full 1.00 carat total weight of lab-grown diamonds (D-VS2 clarity). Handcrafted in Antwerp with master craftsmanship.

Features:
• Total Carat Weight: 1.00ct (0.50ct per earring)
• Diamond Quality: D color, VS2 clarity, lab-grown
• Metal: 18K Gold (available in Yellow, White, or Rose Gold)
• Setting: Classic 4-prong stud setting
• Backing: Secure screw-back closure
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)

Why You'll Love Them:
✓ Full carat weight with maximum presence
✓ Timeless design enhanced by impressive size
✓ Ethically sourced lab-grown diamonds
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
• Radiant
• Asscher

Also available with natural diamonds - price on request.
Can be personalized with your birthstone for a meaningful gift.

Perfect holiday gift idea!

Price includes tax and official diamond certification.
Includes luxury packaging and free worldwide shipping.`,
    productType: 'Diamond Earrings',
    vendor: 'Diamonds by CS',
    tags: ['18k gold', 'Earrings', 'Lab-Grown Diamond', 'studs', 'timeless', 'yellow gold', 'white gold', 'rose gold', '1.00ct', 'D-VS2', 'gift idea', 'birthstone', 'handcrafted'],
    price: '890',
    variants: [
      { option: 'Yellow Gold', sku: 'EARRING-100-YG', price: '890' },
      { option: 'White Gold', sku: 'EARRING-100-WG', price: '890' },
      { option: 'Rose Gold', sku: 'EARRING-100-RG', price: '890' },
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

async function createProductWithVariants(productData: typeof earringProducts[0]) {
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
  console.log('🔄 Starting Diamond Stud Earring Price Update...\n');
  console.log('📋 New Pricing Structure:');
  console.log('   • 0.30ct D-VS2: €490 (all gold colors)');
  console.log('   • 0.50ct D-VS2: €590 (all gold colors)');
  console.log('   • 1.00ct D-VS2: €890 (all gold colors)');
  console.log('   Tax included with HRD, IGI or GIA certificate\n');
  console.log('   Available in multiple diamond shapes: Round, Princess, Cushion, Oval, Emerald, Pear, Radiant, Asscher');
  console.log('   Also available with natural diamonds (price on request)\n');

  for (const productData of earringProducts) {
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
