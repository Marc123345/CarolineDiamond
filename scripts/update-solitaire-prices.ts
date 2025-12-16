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

// Define the new solitaire ring products with correct prices
const solitaireProducts = [
  {
    title: '18K Gold Lab-Grown Diamond Solitaire Engagement Ring - 0.50ct',
    description: `Timeless elegance meets ethical luxury. This classic solitaire engagement ring features a stunning 0.50 carat lab-grown diamond (D color, VS2 clarity) set in premium 18K gold.

The brilliant round-cut diamond is secured in a traditional 4-prong setting that maximizes light reflection and showcases the stone's exceptional fire and brilliance. Handcrafted in Antwerp with meticulous attention to detail, this ring represents the perfect symbol of enduring love.

Features:
• Center Stone: 0.50 carat IGI/GIA/HRD-certified lab-grown diamond (D–VS2)
• Metal: 18K Gold (available in White, Yellow, or Rose Gold)
• Setting: Classic solitaire with secure 4-prong setting
• Band Style: Comfort-fit, 1.8-2.0mm width
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)
• Warranty: Lifetime craftsmanship guarantee

Why You'll Love It:
✓ Ethically sourced lab-grown diamond with identical properties to mined diamonds
✓ Exceptional D color grade - the highest colorless rating
✓ VS2 clarity - eye-clean with excellent brilliance
✓ Timeless solitaire design that never goes out of style
✓ Handcrafted in Antwerp's diamond district
✓ Complimentary first-time resizing
✓ Includes elegant presentation box

Perfect for proposals, anniversaries, or as a symbol of eternal commitment.

Price includes tax and official diamond certification.`,
    productType: 'Solitaire Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Solitaire', 'Round', 'shape:round', '0.50ct', 'D-VS2'],
    price: '790',
    variants: [
      { option: 'Yellow Gold', sku: 'SOLITAIRE-050-YG', price: '790' },
      { option: 'White Gold', sku: 'SOLITAIRE-050-WG', price: '790' },
      { option: 'Rose Gold', sku: 'SOLITAIRE-050-RG', price: '790' },
    ],
  },
  {
    title: '18K Gold Lab-Grown Diamond Solitaire Engagement Ring - 1.00ct',
    description: `Make a statement with this breathtaking 1.00 carat solitaire engagement ring. Featuring a full carat lab-grown diamond (D color, VS2 clarity) set in luxurious 18K gold, this ring combines impressive size with exceptional quality.

The brilliant round-cut diamond captures and reflects light from every angle, creating mesmerizing sparkle that will take her breath away. Handcrafted with precision in Antwerp, this ring represents the pinnacle of ethical luxury and timeless design.

Features:
• Center Stone: 1.00 carat IGI/GIA/HRD-certified lab-grown diamond (D–VS2)
• Metal: 18K Gold (available in White, Yellow, or Rose Gold)
• Setting: Classic solitaire with secure 4-prong setting
• Band Style: Comfort-fit, 1.8-2.0mm width
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)
• Warranty: Lifetime craftsmanship guarantee

Why You'll Love It:
✓ Full 1.00 carat center stone with maximum presence
✓ Ethically sourced lab-grown diamond
✓ Exceptional D color grade - perfectly colorless
✓ VS2 clarity - eye-clean with brilliant fire
✓ Classic design that stands the test of time
✓ Handcrafted in Antwerp's prestigious diamond district
✓ Complimentary first-time resizing
✓ Includes elegant presentation box

The perfect choice for those seeking maximum impact with ethical values.

Price includes tax and official diamond certification.`,
    productType: 'Solitaire Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Solitaire', 'Round', 'shape:round', '1.00ct', 'D-VS2'],
    price: '990',
    variants: [
      { option: 'Yellow Gold', sku: 'SOLITAIRE-100-YG', price: '990' },
      { option: 'White Gold', sku: 'SOLITAIRE-100-WG', price: '990' },
      { option: 'Rose Gold', sku: 'SOLITAIRE-100-RG', price: '990' },
    ],
  },
  {
    title: '18K Gold Lab-Grown Diamond Solitaire Engagement Ring - 1.50ct',
    description: `Experience true luxury with this magnificent 1.50 carat solitaire engagement ring. This show-stopping piece features an exceptional lab-grown diamond (D color, VS2 clarity) that commands attention while maintaining the elegance of classic design.

Set in premium 18K gold, the substantial 1.50 carat round-cut diamond delivers unparalleled brilliance and fire. This is the ultimate symbol of love - impressive in size, flawless in quality, and perfect in its simplicity. Handcrafted by master jewelers in Antwerp.

Features:
• Center Stone: 1.50 carat IGI/GIA/HRD-certified lab-grown diamond (D–VS2)
• Metal: 18K Gold (available in White, Yellow, or Rose Gold)
• Setting: Classic solitaire with secure 4-prong setting
• Band Style: Comfort-fit, 1.8-2.0mm width
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)
• Warranty: Lifetime craftsmanship guarantee

Why You'll Love It:
✓ Spectacular 1.50 carat center stone with commanding presence
✓ Ethically sourced lab-grown diamond
✓ Exceptional D color grade - the pinnacle of colorless beauty
✓ VS2 clarity - flawless to the naked eye
✓ Timeless solitaire design enhanced by impressive size
✓ Handcrafted in Antwerp by master artisans
✓ Complimentary first-time resizing
✓ Includes luxurious presentation box

For those who want to make an unforgettable statement while honoring ethical values.

Price includes tax and official diamond certification.`,
    productType: 'Solitaire Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Solitaire', 'Round', 'shape:round', '1.50ct', 'D-VS2'],
    price: '1250',
    variants: [
      { option: 'Yellow Gold', sku: 'SOLITAIRE-150-YG', price: '1250' },
      { option: 'White Gold', sku: 'SOLITAIRE-150-WG', price: '1250' },
      { option: 'Rose Gold', sku: 'SOLITAIRE-150-RG', price: '1250' },
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

async function createProductWithVariants(productData: typeof solitaireProducts[0]) {
  console.log(`\n📦 Creating product: ${productData.title}`);

  // Use REST API for simpler product creation with variants
  const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
  const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
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
  const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
  const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

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
  console.log('🔄 Starting Solitaire Ring Price Update...\n');
  console.log('📋 New Pricing Structure:');
  console.log('   • 0.50ct D-VS2: €790 (all gold colors)');
  console.log('   • 1.00ct D-VS2: €990 (all gold colors)');
  console.log('   • 1.50ct D-VS2: €1,250 (all gold colors)');
  console.log('   Tax included with HRD, IGI or GIA certificate\n');

  for (const productData of solitaireProducts) {
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
