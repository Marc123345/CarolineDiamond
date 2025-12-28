import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = '2024-10';

if (!SHOPIFY_STORE_DOMAIN || !ADMIN_ACCESS_TOKEN) {
  console.error('❌ Missing Shopify credentials in .env file');
  process.exit(1);
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}`;

interface Variant {
  id: string;
  title: string;
  price: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  tags: string;
  variants: Variant[];
}

const PRICING = {
  withoutSideDiamonds: {
    '0.50ct': 790,
    '1.00ct': 990,
    '1.50ct': 1250,
    'Natural Diamond': 3000,
  },
  withSideDiamonds: {
    '0.50ct': 1150,
    '1.00ct': 1350,
    '1.50ct': 1610,
    'Natural Diamond': 3360,
  },
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

async function updateVariantPrice(variantId: string, price: number): Promise<boolean> {
  const response = await fetch(`${ADMIN_API_URL}/variants/${variantId.split('/').pop()}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variant: {
        id: variantId.split('/').pop(),
        price: price.toString(),
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to update variant ${variantId}: ${errorText}`);
    return false;
  }

  return true;
}

function hasSideDiamonds(product: Product): boolean | null {
  const tags = product.tags.toLowerCase();
  if (tags.includes('with-side-diamonds') || tags.includes('with side diamonds')) {
    return true;
  }
  if (tags.includes('no-side-diamonds') || tags.includes('no side diamonds')) {
    return false;
  }
  return null;
}

function getExpectedPrice(diamondType: string, withSide: boolean): number | null {
  const pricingCategory = withSide ? PRICING.withSideDiamonds : PRICING.withoutSideDiamonds;
  return pricingCategory[diamondType as keyof typeof pricingCategory] || null;
}

async function main() {
  console.log('🔧 FIXING VARIANT PRICING IN SHOPIFY\n');
  console.log('================================================================================\n');

  const dryRun = process.argv.includes('--dry-run');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  } else {
    console.log('⚠️  LIVE MODE - Changes will be applied to Shopify\n');
    console.log('Press Ctrl+C within 5 seconds to cancel...\n');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  const products = await fetchAllProducts();
  const engagementRings = products.filter(
    (p) =>
      p.tags.toLowerCase().includes('engagement') ||
      p.tags.toLowerCase().includes('ring')
  );

  console.log(`Found ${engagementRings.length} engagement ring products\n`);

  let totalUpdates = 0;
  let successfulUpdates = 0;
  let failedUpdates = 0;

  for (const product of engagementRings) {
    const sideDiamondsStatus = hasSideDiamonds(product);

    if (sideDiamondsStatus === null) {
      console.log(`⚠️  Skipping ${product.title} - missing side diamonds tag`);
      continue;
    }

    for (const variant of product.variants) {
      const diamondType = variant.option2;
      if (!diamondType) continue;

      const expectedPrice = getExpectedPrice(diamondType, sideDiamondsStatus);
      if (!expectedPrice) continue;

      const currentPrice = parseFloat(variant.price);

      if (currentPrice !== expectedPrice) {
        totalUpdates++;

        console.log(`\n📝 ${product.title}`);
        console.log(`   Variant: ${variant.title}`);
        console.log(`   Current: €${currentPrice} → Expected: €${expectedPrice}`);

        if (!dryRun) {
          const success = await updateVariantPrice(variant.id, expectedPrice);
          if (success) {
            successfulUpdates++;
            console.log(`   ✅ Updated successfully`);
          } else {
            failedUpdates++;
            console.log(`   ❌ Update failed`);
          }

          // Rate limiting - wait 500ms between updates
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          console.log(`   🔍 Would update (dry run)`);
        }
      }
    }
  }

  console.log('\n================================================================================\n');
  console.log('📊 UPDATE SUMMARY\n');
  console.log(`Total variants needing updates: ${totalUpdates}`);

  if (!dryRun) {
    console.log(`Successful updates: ${successfulUpdates} ✅`);
    console.log(`Failed updates: ${failedUpdates} ❌\n`);

    if (failedUpdates === 0 && totalUpdates > 0) {
      console.log('✅ ALL PRICING UPDATED SUCCESSFULLY!\n');
      console.log('Run verification script to confirm:');
      console.log('  npm run verify-pricing\n');
    } else if (totalUpdates === 0) {
      console.log('✅ ALL PRICING ALREADY CORRECT!\n');
    }
  } else {
    console.log('\n🔍 Dry run complete. Run without --dry-run to apply changes:\n');
    console.log('  npm run fix-pricing\n');
  }
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
