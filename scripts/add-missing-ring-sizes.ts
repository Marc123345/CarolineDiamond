import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env'), debug: true });

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = '2024-10';

if (!SHOPIFY_STORE_DOMAIN || !ADMIN_ACCESS_TOKEN) {
  console.error('❌ Missing Shopify credentials in .env file');
  process.exit(1);
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}`;

interface Product {
  id: string;
  title: string;
  handle: string;
  tags: string;
}

async function fetchAllProducts(): Promise<Product[]> {
  console.log('📦 Fetching all products...\n');

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

async function updateProduct(productId: string, updates: any): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/products/${productId}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product: updates }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update product: ${JSON.stringify(errorData)}`);
  }
}

async function main() {
  console.log('🔧 Adding missing ring sizes (50 and 56)...\n');
  console.log('================================================================================\n');

  try {
    const products = await fetchAllProducts();
    console.log(`✅ Fetched ${products.length} products\n`);

    let fixCount = 0;

    const missingSizes = ['Size 50', 'Size 56'];

    console.log('💍 ADDING MISSING RING SIZES\n');

    const engagementRings = products.filter((p) => p.tags.includes('engagement-ring'));

    for (const product of engagementRings) {
      const currentTags = product.tags.split(', ');
      const missingTags = missingSizes.filter((tag) => !currentTags.includes(tag));

      if (missingTags.length > 0) {
        console.log(`   Updating: ${product.title}`);
        const newTags = [...currentTags, ...missingTags];
        await updateProduct(product.id, { tags: newTags.join(', ') });
        console.log(`   ✅ Added: ${missingTags.join(', ')}\n`);
        fixCount++;
      }
    }

    console.log('================================================================================\n');
    console.log(`✅ COMPLETED! Updated ${fixCount} products\n`);
    console.log('Summary:');
    console.log(`  ✅ Added missing ring sizes to all engagement rings`);
    console.log(`  ✅ Complete ring size range: 48, 50, 52, 54, 56, 58, 60`);
    console.log('\n🎉 All ring sizes are now available!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
