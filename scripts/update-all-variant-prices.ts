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

const PRICING = {
  'lab-grown': {
    'no-side': {
      0.5: 790,
      1.0: 990,
      1.5: 1250,
    },
    'with-side': {
      0.5: 1150,
      1.0: 1350,
      1.5: 1610,
    },
  },
  natural: {
    'no-side': 3000,
    'with-side': 3360,
  },
};

async function fetchAllProducts() {
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

async function updateVariantPrice(variantId: string, price: number) {
  const response = await fetch(`${ADMIN_API_URL}/variants/${variantId}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variant: {
        id: variantId,
        price: price.toString(),
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update variant: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

function hasSideDiamonds(product: any): boolean {
  const tags = product.tags.split(', ').map((t: string) => t.toLowerCase());
  return tags.some((tag: string) => tag === 'with-side-diamonds' || tag === 'with side diamonds');
}

function getCaratWeight(variantTitle: string): number | null {
  const match = variantTitle.match(/(\d+\.\d+)ct/);
  return match ? parseFloat(match[1]) : null;
}

function isNatural(variantTitle: string): boolean {
  return variantTitle.toLowerCase().includes('natural');
}

function calculatePrice(product: any, variant: any): number | null {
  const withSide = hasSideDiamonds(product);
  const sideKey = withSide ? 'with-side' : 'no-side';
  const variantTitle = variant.title || '';

  if (isNatural(variantTitle)) {
    return PRICING.natural[sideKey];
  }

  const carat = getCaratWeight(variantTitle);
  if (carat && PRICING['lab-grown'][sideKey][carat]) {
    return PRICING['lab-grown'][sideKey][carat];
  }

  return null;
}

async function main() {
  console.log('💰 UPDATING ALL ENGAGEMENT RING VARIANT PRICES\n');
  console.log('================================================================================\n');

  const products = await fetchAllProducts();
  const engagementRings = products.filter((p: any) => p.tags.includes('engagement-ring'));

  console.log(`Found ${engagementRings.length} engagement ring products\n`);

  let totalVariants = 0;
  let updatedVariants = 0;
  let skippedVariants = 0;
  let errorVariants = 0;

  for (const product of engagementRings) {
    console.log(`\n📦 ${product.title}`);
    const withSide = hasSideDiamonds(product);
    console.log(`   Side Diamonds: ${withSide ? 'YES' : 'NO'}`);
    console.log(`   Variants: ${product.variants.length}`);

    for (const variant of product.variants) {
      totalVariants++;
      const currentPrice = parseFloat(variant.price);
      const correctPrice = calculatePrice(product, variant);

      if (!correctPrice) {
        console.log(`   ⚠️  Could not calculate price for variant: ${variant.title}`);
        skippedVariants++;
        continue;
      }

      if (currentPrice === correctPrice) {
        console.log(`   ✓ ${variant.title}: €${currentPrice} (already correct)`);
        skippedVariants++;
        continue;
      }

      try {
        await updateVariantPrice(variant.id, correctPrice);
        console.log(`   ✅ ${variant.title}: €${currentPrice} → €${correctPrice}`);
        updatedVariants++;

        await new Promise((resolve) => setTimeout(resolve, 250));
      } catch (error) {
        console.error(`   ❌ Failed to update ${variant.title}: ${error}`);
        errorVariants++;
      }
    }
  }

  console.log('\n================================================================================\n');
  console.log('📊 SUMMARY:\n');
  console.log(`   Total Variants: ${totalVariants}`);
  console.log(`   Updated: ${updatedVariants}`);
  console.log(`   Already Correct: ${skippedVariants}`);
  console.log(`   Errors: ${errorVariants}`);
  console.log('\n✅ Price update complete!\n');
}

main().catch(console.error);
