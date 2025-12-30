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

// Define rings with side diamonds - €360 premium over base solitaire/halo
const sideDiamondRings = [
  // SOLITAIRE + SIDE DIAMONDS
  {
    title: '18K Gold Lab-Grown Diamond Solitaire Engagement Ring with Pavé Band - 0.50ct',
    description: `The perfect blend of classic solitaire elegance and modern brilliance. This stunning engagement ring features a 0.50 carat lab-grown diamond (D color, VS2 clarity) in a traditional solitaire setting, enhanced by a delicate pavé band of additional diamonds that add exceptional sparkle.

The center stone is secured in a classic 4-prong setting while the band features micro-set diamonds that catch the light from every angle. Handcrafted in Antwerp with meticulous attention to detail, this ring represents the perfect symbol of enduring love with added brilliance.

Features:
• Center Stone: 0.50 carat IGI/GIA/HRD-certified lab-grown diamond (D–VS2)
• Side Diamonds: Micro-pavé band with approximately 0.20ct total weight
• Metal: 18K Gold (available in White, Yellow, or Rose Gold)
• Setting: Classic solitaire with secure 4-prong setting + pavé band
• Band Style: Comfort-fit, 1.8-2.0mm width with diamond accent
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)
• Warranty: Lifetime craftsmanship guarantee

Why You'll Love It:
✓ Timeless solitaire design enhanced with sparkling pavé
✓ Ethically sourced lab-grown diamonds
✓ Exceptional D color grade - the highest colorless rating
✓ VS2 clarity - eye-clean with excellent brilliance
✓ Additional sparkle from side diamonds
✓ Handcrafted in Antwerp's diamond district
✓ Complimentary first-time resizing
✓ Includes elegant presentation box

Perfect for those who love classic elegance with extra sparkle.

Price includes tax and official diamond certification.`,
    productType: 'Engagement Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Solitaire', 'Solitaire + Side Diamonds', 'Round', 'shape:round', '0.50ct', 'D-VS2', 'pavé'],
    price: '1150',
    variants: [
      { option: 'Yellow Gold', sku: 'SOLITAIRE-PAVE-050-YG', price: '1150' },
      { option: 'White Gold', sku: 'SOLITAIRE-PAVE-050-WG', price: '1150' },
      { option: 'Rose Gold', sku: 'SOLITAIRE-PAVE-050-RG', price: '1150' },
    ],
  },
  {
    title: '18K Gold Lab-Grown Diamond Solitaire Engagement Ring with Pavé Band - 1.00ct',
    description: `Make a breathtaking statement with this 1.00 carat solitaire engagement ring enhanced with a sparkling pavé band. The full carat lab-grown diamond (D color, VS2 clarity) takes center stage, while micro-set side diamonds add an extra dimension of brilliance.

Set in luxurious 18K gold, the substantial 1.00 carat round-cut diamond captures attention, while the delicate pavé band creates a continuous sparkle. This is the ultimate combination of impressive size and enhanced brilliance. Handcrafted by master jewelers in Antwerp.

Features:
• Center Stone: 1.00 carat IGI/GIA/HRD-certified lab-grown diamond (D–VS2)
• Side Diamonds: Micro-pavé band with approximately 0.20ct total weight
• Metal: 18K Gold (available in White, Yellow, or Rose Gold)
• Setting: Classic solitaire with secure 4-prong setting + pavé band
• Band Style: Comfort-fit, 1.8-2.0mm width with diamond accent
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)
• Warranty: Lifetime craftsmanship guarantee

Why You'll Love It:
✓ Full 1.00 carat center stone with maximum presence
✓ Enhanced brilliance from pavé side diamonds
✓ Ethically sourced lab-grown diamonds
✓ Exceptional D color grade - perfectly colorless
✓ VS2 clarity - eye-clean with brilliant fire
✓ Classic design with modern sparkle
✓ Handcrafted in Antwerp's prestigious diamond district
✓ Complimentary first-time resizing
✓ Includes elegant presentation box

The perfect choice for maximum impact with extra sparkle.

Price includes tax and official diamond certification.`,
    productType: 'Engagement Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Solitaire', 'Solitaire + Side Diamonds', 'Round', 'shape:round', '1.00ct', 'D-VS2', 'pavé'],
    price: '1350',
    variants: [
      { option: 'Yellow Gold', sku: 'SOLITAIRE-PAVE-100-YG', price: '1350' },
      { option: 'White Gold', sku: 'SOLITAIRE-PAVE-100-WG', price: '1350' },
      { option: 'Rose Gold', sku: 'SOLITAIRE-PAVE-100-RG', price: '1350' },
    ],
  },
  {
    title: '18K Gold Lab-Grown Diamond Solitaire Engagement Ring with Pavé Band - 1.50ct',
    description: `Experience ultimate luxury with this magnificent 1.50 carat solitaire engagement ring enhanced with a dazzling pavé band. This show-stopping piece features an exceptional lab-grown diamond (D color, VS2 clarity) that commands attention, with sparkling side diamonds adding continuous brilliance.

Set in premium 18K gold, the substantial 1.50 carat round-cut diamond delivers unparalleled presence and fire, while the micro-set pavé band creates a stunning frame of sparkle. This is luxury at its finest - impressive, brilliant, and perfect. Handcrafted by master jewelers in Antwerp.

Features:
• Center Stone: 1.50 carat IGI/GIA/HRD-certified lab-grown diamond (D–VS2)
• Side Diamonds: Micro-pavé band with approximately 0.20ct total weight
• Metal: 18K Gold (available in White, Yellow, or Rose Gold)
• Setting: Classic solitaire with secure 4-prong setting + pavé band
• Band Style: Comfort-fit, 1.8-2.0mm width with diamond accent
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)
• Warranty: Lifetime craftsmanship guarantee

Why You'll Love It:
✓ Spectacular 1.50 carat center stone with commanding presence
✓ Maximum brilliance from pavé side diamonds
✓ Ethically sourced lab-grown diamonds
✓ Exceptional D color grade - the pinnacle of colorless beauty
✓ VS2 clarity - flawless to the naked eye
✓ Timeless elegance enhanced by continuous sparkle
✓ Handcrafted in Antwerp by master artisans
✓ Complimentary first-time resizing
✓ Includes luxurious presentation box

For those who want maximum impact and continuous brilliance.

Price includes tax and official diamond certification.`,
    productType: 'Engagement Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Solitaire', 'Solitaire + Side Diamonds', 'Round', 'shape:round', '1.50ct', 'D-VS2', 'pavé'],
    price: '1610',
    variants: [
      { option: 'Yellow Gold', sku: 'SOLITAIRE-PAVE-150-YG', price: '1610' },
      { option: 'White Gold', sku: 'SOLITAIRE-PAVE-150-WG', price: '1610' },
      { option: 'Rose Gold', sku: 'SOLITAIRE-PAVE-150-RG', price: '1610' },
    ],
  },
  // HALO + SIDE DIAMONDS
  {
    title: '18K Gold Lab-Grown Diamond Halo Engagement Ring with Pavé Band - 0.50ct',
    description: `Double the sparkle, double the beauty. This stunning halo engagement ring features a 0.50 carat lab-grown diamond (D color, VS2 clarity) surrounded by a halo of brilliant diamonds, PLUS a sparkling pavé band for maximum brilliance from every angle.

The center stone is embraced by a perfect circle of accent diamonds, while the band continues the sparkle with micro-set pavé diamonds. This creates an effect of continuous brilliance that catches the light with every movement. Handcrafted in Antwerp with exceptional attention to detail.

Features:
• Center Stone: 0.50 carat IGI/GIA/HRD-certified lab-grown diamond (D–VS2)
• Halo + Pavé Band: Approximately 0.35ct total weight in side diamonds
• Metal: 18K Gold (available in White, Yellow, or Rose Gold)
• Setting: Halo design with secure center setting + pavé band
• Band Style: Comfort-fit, 1.8-2.0mm width with diamond accent
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)
• Warranty: Lifetime craftsmanship guarantee

Why You'll Love It:
✓ Maximum sparkle from halo AND pavé band
✓ Makes center diamond appear larger
✓ Ethically sourced lab-grown diamonds
✓ Exceptional D color grade - perfectly colorless
✓ VS2 clarity - eye-clean with brilliant fire
✓ Vintage-inspired design with modern brilliance
✓ Handcrafted in Antwerp's diamond district
✓ Complimentary first-time resizing
✓ Includes elegant presentation box

Perfect for those who love maximum sparkle and vintage elegance.

Price includes tax and official diamond certification.`,
    productType: 'Engagement Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Halo', 'Halo + Side Diamonds', 'Round', 'shape:round', '0.50ct', 'D-VS2', 'pavé', 'vintage'],
    price: '1150',
    variants: [
      { option: 'Yellow Gold', sku: 'HALO-PAVE-050-YG', price: '1150' },
      { option: 'White Gold', sku: 'HALO-PAVE-050-WG', price: '1150' },
      { option: 'Rose Gold', sku: 'HALO-PAVE-050-RG', price: '1150' },
    ],
  },
  {
    title: '18K Gold Lab-Grown Diamond Halo Engagement Ring with Pavé Band - 1.00ct',
    description: `Experience breathtaking brilliance with this 1.00 carat halo engagement ring enhanced with a dazzling pavé band. The full carat lab-grown diamond (D color, VS2 clarity) is embraced by a halo of sparkling diamonds, while the pavé band creates continuous brilliance around the entire ring.

Set in luxurious 18K gold, the 1.00 carat center stone delivers impressive presence, amplified by the surrounding halo and enhanced by the sparkling pavé band. This is maximum brilliance meets substantial size. Handcrafted by master jewelers in Antwerp.

Features:
• Center Stone: 1.00 carat IGI/GIA/HRD-certified lab-grown diamond (D–VS2)
• Halo + Pavé Band: Approximately 0.35ct total weight in side diamonds
• Metal: 18K Gold (available in White, Yellow, or Rose Gold)
• Setting: Halo design with secure center setting + pavé band
• Band Style: Comfort-fit, 1.8-2.0mm width with diamond accent
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)
• Warranty: Lifetime craftsmanship guarantee

Why You'll Love It:
✓ Full 1.00 carat center stone with maximum presence
✓ Amplified by halo AND continuous pavé sparkle
✓ Ethically sourced lab-grown diamonds
✓ Exceptional D color grade - perfectly colorless
✓ VS2 clarity - eye-clean with brilliant fire
✓ Vintage-inspired design with impressive size
✓ Handcrafted in Antwerp's prestigious diamond district
✓ Complimentary first-time resizing
✓ Includes elegant presentation box

The perfect choice for those who want it all - size, sparkle, and brilliance.

Price includes tax and official diamond certification.`,
    productType: 'Engagement Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Halo', 'Halo + Side Diamonds', 'Round', 'shape:round', '1.00ct', 'D-VS2', 'pavé', 'vintage'],
    price: '1350',
    variants: [
      { option: 'Yellow Gold', sku: 'HALO-PAVE-100-YG', price: '1350' },
      { option: 'White Gold', sku: 'HALO-PAVE-100-WG', price: '1350' },
      { option: 'Rose Gold', sku: 'HALO-PAVE-100-RG', price: '1350' },
    ],
  },
  {
    title: '18K Gold Lab-Grown Diamond Halo Engagement Ring with Pavé Band - 1.50ct',
    description: `Experience absolute luxury with this magnificent 1.50 carat halo engagement ring enhanced with a brilliant pavé band. This show-stopping piece features an exceptional lab-grown diamond (D color, VS2 clarity) embraced by a halo of diamonds, with a sparkling pavé band creating continuous brilliance.

Set in premium 18K gold, the substantial 1.50 carat center stone commands attention, while the halo amplifies its presence and the pavé band creates a stunning frame of continuous sparkle. This is the pinnacle of brilliance and luxury. Handcrafted by master jewelers in Antwerp.

Features:
• Center Stone: 1.50 carat IGI/GIA/HRD-certified lab-grown diamond (D–VS2)
• Halo + Pavé Band: Approximately 0.35ct total weight in side diamonds
• Metal: 18K Gold (available in White, Yellow, or Rose Gold)
• Setting: Halo design with secure center setting + pavé band
• Band Style: Comfort-fit, 1.8-2.0mm width with diamond accent
• Certification: Includes official diamond certificate (HRD, IGI, or GIA)
• Warranty: Lifetime craftsmanship guarantee

Why You'll Love It:
✓ Spectacular 1.50 carat center stone with commanding presence
✓ Maximum brilliance from halo AND continuous pavé sparkle
✓ Ethically sourced lab-grown diamonds
✓ Exceptional D color grade - the pinnacle of colorless beauty
✓ VS2 clarity - flawless to the naked eye
✓ Vintage elegance with ultimate sparkle
✓ Handcrafted in Antwerp by master artisans
✓ Complimentary first-time resizing
✓ Includes luxurious presentation box

For those who demand the absolute best - maximum size and maximum brilliance.

Price includes tax and official diamond certification.`,
    productType: 'Engagement Ring',
    vendor: 'Diamonds by CS',
    tags: ['18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Halo', 'Halo + Side Diamonds', 'Round', 'shape:round', '1.50ct', 'D-VS2', 'pavé', 'vintage'],
    price: '1610',
    variants: [
      { option: 'Yellow Gold', sku: 'HALO-PAVE-150-YG', price: '1610' },
      { option: 'White Gold', sku: 'HALO-PAVE-150-WG', price: '1610' },
      { option: 'Rose Gold', sku: 'HALO-PAVE-150-RG', price: '1610' },
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

  const result = await shopifyAdminRequest(query, { query: `title:"${title}"` });
  return result.data.products.edges[0]?.node;
}

async function createProductWithVariants(productData: typeof sideDiamondRings[0]) {
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
  console.log('💎 Starting Side Diamond Ring Price Update...\n');
  console.log('📋 Pricing Structure - Base + €360 Premium:');
  console.log('   • 0.50ct with pavé: €1,150 (€790 + €360)');
  console.log('   • 1.00ct with pavé: €1,350 (€990 + €360)');
  console.log('   • 1.50ct with pavé: €1,610 (€1,250 + €360)');
  console.log('   Tax included with HRD, IGI or GIA certificate\n');
  console.log('   Styles: Solitaire + Side Diamonds, Halo + Side Diamonds\n');

  for (const productData of sideDiamondRings) {
    try {
      const existingProduct = await findProductByTitle(productData.title);

      if (existingProduct) {
        console.log(`\n📝 Updating existing product: ${productData.title}`);

        for (let i = 0; i < existingProduct.variants.edges.length; i++) {
          const variant = existingProduct.variants.edges[i].node;
          const newPrice = productData.variants[i].price;

          console.log(`   Updating ${variant.title}: €${variant.price} → €${newPrice}`);

          await updateProductPrice(variant.id, newPrice);
        }

        console.log(`✅ Updated ${existingProduct.title}`);
      } else {
        const newProduct = await createProductWithVariants(productData);
        if (newProduct) {
          console.log(`✅ Created new product: ${newProduct.title}`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error processing ${productData.title}:`, error);
    }
  }

  console.log('\n✅ Side diamond ring pricing completed!');
  console.log('\n📝 Summary:');
  console.log('   • 6 products created/updated (Solitaire & Halo with Pavé)');
  console.log('   • 3 carat weights: 0.50ct, 1.00ct, 1.50ct');
  console.log('   • €360 premium applied to all side diamond variants');
  console.log('\n📝 Next steps:');
  console.log('   1. Run: npm run fetch-products');
  console.log('   2. Verify prices on the frontend');
  console.log('   3. Test the complete checkout flow\n');
}

main().catch(console.error);
