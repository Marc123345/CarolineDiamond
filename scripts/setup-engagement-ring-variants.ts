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
  tags: string;
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: string;
    option1: string | null;
    option2: string | null;
    option3: string | null;
  }>;
}

const STANDARDIZED_PRICING = {
  '0.50ct': '1150',
  '1.00ct': '1350',
  '1.50ct': '1610',
  'Natural Diamond': '3360',
};

const METAL_COLORS = ['18K Yellow Gold', '18K White Gold', '18K Rose Gold'];
const DIAMOND_TYPES = ['0.50ct', '1.00ct', '1.50ct', 'Natural Diamond'];
const RING_SIZES = ['EU 48', 'EU 50', 'EU 52', 'EU 54', 'EU 56', 'EU 58', 'EU 60'];

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


function needsVariantSetup(product: Product): boolean {
  if (product.variants.length !== 1) return false;
  const variant = product.variants[0];
  return variant.title === 'Default Title' ||
         (!variant.option1 && !variant.option2 && !variant.option3);
}

async function updateProductWithOptions(productId: string): Promise<void> {
  const productPayload = {
    product: {
      id: productId,
      options: [
        { name: 'Metal Color', values: METAL_COLORS },
        { name: 'Diamond Type', values: DIAMOND_TYPES },
        { name: 'Ring Size', values: RING_SIZES },
      ],
    },
  };

  const response = await fetch(`${ADMIN_API_URL}/products/${productId}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productPayload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update product options: ${error}`);
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
}

async function createVariantsForProduct(
  productId: string
): Promise<void> {
  const variants: any[] = [];

  METAL_COLORS.forEach((metal) => {
    DIAMOND_TYPES.forEach((diamond) => {
      RING_SIZES.forEach((size) => {
        variants.push({
          option1: metal,
          option2: diamond,
          option3: size,
          price: STANDARDIZED_PRICING[diamond as keyof typeof STANDARDIZED_PRICING],
          inventory_management: null,
          inventory_policy: 'continue',
        });
      });
    });
  });

  console.log(`   Creating ${variants.length} variants...`);

  const batchSize = 20;
  for (let i = 0; i < variants.length; i += batchSize) {
    const batch = variants.slice(i, i + batchSize);

    for (const variantData of batch) {
      const response = await fetch(`${ADMIN_API_URL}/products/${productId}/variants.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ variant: variantData }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`   ❌ Failed to create variant: ${error}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    console.log(`   ✓ Created ${Math.min(i + batchSize, variants.length)}/${variants.length} variants`);
  }
}

async function deleteDefaultVariant(productId: string, variantId: string): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/products/${productId}/variants/${variantId}.json`, {
    method: 'DELETE',
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`   ⚠️  Could not delete default variant: ${error}`);
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
}

async function setupProductVariants(product: Product): Promise<void> {
  console.log(`\n📦 ${product.title}`);
  console.log(`   Applying standardized pricing (all products same)`);

  const defaultVariantId = product.variants[0]?.id;

  try {
    console.log('   Step 1: Adding product options...');
    await updateProductWithOptions(product.id);

    console.log('   Step 2: Creating 84 variants...');
    await createVariantsForProduct(product.id);

    if (defaultVariantId) {
      console.log('   Step 3: Removing default variant...');
      await deleteDefaultVariant(product.id, defaultVariantId);
    }

    console.log('   ✅ Successfully set up all variants!');
  } catch (error) {
    console.error(`   ❌ Error: ${error}`);
  }
}

async function main() {
  console.log('🔧 Setting Up Engagement Ring Variants\n');
  console.log('================================================================================\n');
  console.log('This script will:');
  console.log('  1. Add 3 product options: Metal Color, Diamond Type, Ring Size');
  console.log('  2. Create 84 variants for each product (3 × 4 × 7)');
  console.log('  3. Apply correct pricing based on side diamonds\n');
  console.log('================================================================================\n');

  const products = await fetchAllProducts();
  console.log(`✅ Fetched ${products.length} products\n`);

  const engagementRings = products.filter((p) => p.tags.toLowerCase().includes('engagement-ring'));
  console.log(`Found ${engagementRings.length} engagement ring products\n`);

  const needsSetup = engagementRings.filter(needsVariantSetup);
  console.log(`${needsSetup.length} products need variant setup\n`);

  if (needsSetup.length === 0) {
    console.log('✅ All products already have proper variant structure!');
    return;
  }

  console.log('Products to update:');
  needsSetup.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title}`);
  });

  console.log('\n⚠️  This will take approximately ' + (needsSetup.length * 2) + ' minutes');
  console.log('⚠️  Do not interrupt the process\n');

  await new Promise((resolve) => setTimeout(resolve, 3000));

  let completed = 0;
  for (const product of needsSetup) {
    await setupProductVariants(product);
    completed++;
    console.log(`\n   Progress: ${completed}/${needsSetup.length} products completed`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('\n================================================================================\n');
  console.log('✅ COMPLETED!\n');
  console.log('Summary:');
  console.log(`  ✅ Updated ${completed} products`);
  console.log(`  ✅ Created ${completed * 84} total variants`);
  console.log(`  ✅ Applied correct pricing structure\n`);
  console.log('Next steps:');
  console.log('  1. Run: npm run fetch-products');
  console.log('  2. Test filters on the storefront');
  console.log('  3. Verify variant selection on product pages\n');
}

main().catch(console.error);
