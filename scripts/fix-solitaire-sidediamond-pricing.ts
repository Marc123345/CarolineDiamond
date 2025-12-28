import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = '2024-10';

if (!SHOPIFY_STORE_DOMAIN || !ADMIN_ACCESS_TOKEN) {
  console.error('❌ Missing Shopify credentials');
  process.exit(1);
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}`;

interface Product {
  id: string;
  title: string;
  variants: Array<{
    id: string;
    title: string;
    price: string;
  }>;
}

const CORRECT_PRICING = {
  '0.50ct': '1150',
  '1.00ct': '1350',
  '1.50ct': '1610',
  'Natural Diamond': '3360',
};

async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch(`${ADMIN_API_URL}/products.json?limit=250`, {
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  return data.products;
}

async function updateVariantPrice(variantId: string, newPrice: string): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/variants/${variantId}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variant: {
        id: variantId,
        price: newPrice,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update variant: ${JSON.stringify(errorData)}`);
  }
}

async function main() {
  console.log('🔧 Fixing Solitaire with Side Diamonds Pricing...\n');
  console.log('================================================================================\n');

  const products = await fetchAllProducts();
  console.log(`✅ Fetched ${products.length} products\n`);

  const solitaireWithSide = products.filter(
    (p) => p.title.includes('Solitaire Engagement Ring') && p.title.includes('With side diamonds')
  );

  console.log(`Found ${solitaireWithSide.length} Solitaire with side diamonds products\n`);

  let updatedCount = 0;

  for (const product of solitaireWithSide) {
    console.log(`\n📦 Checking: ${product.title}`);

    let needsUpdate = false;

    for (const variant of product.variants) {
      const variantTitle = variant.title;
      let expectedPrice: string | null = null;

      if (variantTitle.includes('Lab-Grown 0.50ct') || variantTitle.includes('0.50ct')) {
        expectedPrice = CORRECT_PRICING['0.50ct'];
      } else if (variantTitle.includes('Lab-Grown 1.00ct') || variantTitle.includes('1.00ct')) {
        expectedPrice = CORRECT_PRICING['1.00ct'];
      } else if (variantTitle.includes('Lab-Grown 1.50ct') || variantTitle.includes('1.50ct')) {
        expectedPrice = CORRECT_PRICING['1.50ct'];
      } else if (variantTitle.includes('Natural Diamond')) {
        expectedPrice = CORRECT_PRICING['Natural Diamond'];
      }

      if (expectedPrice && variant.price !== expectedPrice) {
        console.log(`   Updating variant: ${variantTitle}`);
        console.log(`   €${variant.price} → €${expectedPrice}`);
        await updateVariantPrice(variant.id, expectedPrice);
        needsUpdate = true;
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }

    if (needsUpdate) {
      updatedCount++;
      console.log(`   ✅ Updated pricing`);
    } else {
      console.log(`   ✓ Pricing already correct`);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log('\n================================================================================\n');
  console.log(`✅ COMPLETED! Updated ${updatedCount} products\n`);
  console.log('Summary:');
  console.log('  Solitaire with Side Diamonds - Correct Pricing:');
  console.log('    • 0.50ct: €1,150');
  console.log('    • 1.00ct: €1,350');
  console.log('    • 1.50ct: €1,610');
  console.log('    • Natural Diamond: €3,360');
  console.log('\n🎉 All Solitaire with side diamonds now have correct pricing!\n');
}

main().catch(console.error);
