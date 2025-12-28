import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = '2024-10';

if (!SHOPIFY_STORE_DOMAIN || !ADMIN_ACCESS_TOKEN) {
  console.error('❌ Missing Shopify credentials in .env file');
  console.error('Required: VITE_SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN');
  process.exit(1);
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}`;

interface Variant {
  id: string;
  title: string;
  price: string;
  option1: string | null; // Metal Color
  option2: string | null; // Diamond Type
  option3: string | null; // Ring Size
}

interface Product {
  id: string;
  title: string;
  handle: string;
  tags: string;
  product_type: string;
  variants: Variant[];
}

// EXPECTED PRICING STRUCTURE FROM SHOPIFY
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

const DIAMOND_TYPES = ['0.50ct', '1.00ct', '1.50ct', 'Natural Diamond'];
const METAL_COLORS = ['White Gold', 'Yellow Gold', 'Rose Gold'];

async function fetchAllProducts(): Promise<Product[]> {
  let allProducts: Product[] = [];
  let hasNextPage = true;
  let pageInfo: string | null = null;

  while (hasNextPage) {
    const url = pageInfo
      ? `${ADMIN_API_URL}/products.json?limit=250&page_info=${pageInfo}`
      : `${ADMIN_API_URL}/products.json?limit=250`;

    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    allProducts = [...allProducts, ...data.products];

    const linkHeader = response.headers.get('Link');
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/page_info=([^&>]+)/);
      pageInfo = match ? match[1] : null;
    } else {
      hasNextPage = false;
    }
  }

  return allProducts;
}

function hasSideDiamonds(product: Product): boolean | null {
  const tags = product.tags.toLowerCase();
  if (tags.includes('with-side-diamonds') || tags.includes('with side diamonds')) {
    return true;
  }
  if (tags.includes('no-side-diamonds') || tags.includes('no side diamonds')) {
    return false;
  }
  return null; // Cannot determine
}

function getExpectedPrice(diamondType: string, withSide: boolean): number | null {
  const pricingCategory = withSide ? PRICING.withSideDiamonds : PRICING.withoutSideDiamonds;
  return pricingCategory[diamondType as keyof typeof pricingCategory] || null;
}

function verifyVariant(
  product: Product,
  variant: Variant,
  withSide: boolean
): { isValid: boolean; message?: string } {
  const diamondType = variant.option2;
  if (!diamondType) {
    return { isValid: false, message: 'Missing Option2 (Diamond Type)' };
  }

  const expectedPrice = getExpectedPrice(diamondType, withSide);
  if (expectedPrice === null) {
    return { isValid: false, message: `Unknown diamond type: ${diamondType}` };
  }

  const actualPrice = parseFloat(variant.price);
  if (actualPrice !== expectedPrice) {
    return {
      isValid: false,
      message: `Price mismatch: Expected €${expectedPrice}, Found €${actualPrice}`,
    };
  }

  return { isValid: true };
}

async function main() {
  console.log('🔍 DETAILED VARIANT PRICING VERIFICATION\n');
  console.log('================================================================================\n');

  const products = await fetchAllProducts();
  console.log(`✅ Fetched ${products.length} total products\n`);

  // Filter engagement rings
  const engagementRings = products.filter(
    (p) =>
      p.tags.toLowerCase().includes('engagement') ||
      p.tags.toLowerCase().includes('ring') ||
      p.product_type.toLowerCase().includes('ring')
  );

  console.log(`💍 Found ${engagementRings.length} engagement ring products\n`);
  console.log('================================================================================\n');

  let totalVariants = 0;
  let correctVariants = 0;
  let incorrectVariants = 0;
  let productsWithIssues: string[] = [];

  for (const product of engagementRings) {
    const sideDiamondsStatus = hasSideDiamonds(product);

    if (sideDiamondsStatus === null) {
      console.log(`⚠️  ${product.title}`);
      console.log(`   Missing side diamonds tag - cannot determine pricing category`);
      console.log(`   Tags: ${product.tags}\n`);
      productsWithIssues.push(product.handle);
      continue;
    }

    let productHasIssues = false;
    const variantIssues: string[] = [];

    for (const variant of product.variants) {
      totalVariants++;

      const result = verifyVariant(product, variant, sideDiamondsStatus);

      if (result.isValid) {
        correctVariants++;
      } else {
        incorrectVariants++;
        productHasIssues = true;
        variantIssues.push(`   ❌ ${variant.title}: ${result.message}`);
      }
    }

    if (productHasIssues) {
      console.log(`❌ ${product.title} (${product.handle})`);
      console.log(`   Side Diamonds: ${sideDiamondsStatus ? 'YES' : 'NO'}`);
      console.log(`   Total Variants: ${product.variants.length}`);
      variantIssues.forEach((issue) => console.log(issue));
      console.log('');
      productsWithIssues.push(product.handle);
    }
  }

  console.log('\n================================================================================\n');
  console.log('📊 VERIFICATION SUMMARY\n');
  console.log(`Total Products Checked: ${engagementRings.length}`);
  console.log(`Total Variants Checked: ${totalVariants}`);
  console.log(`Correct Variants: ${correctVariants} ✅`);
  console.log(`Incorrect Variants: ${incorrectVariants} ❌`);
  console.log(`Products with Issues: ${productsWithIssues.length}\n`);

  if (productsWithIssues.length > 0) {
    console.log('Products requiring attention:');
    productsWithIssues.forEach((handle) => console.log(`  - ${handle}`));
    console.log('');
  }

  console.log('================================================================================\n');
  console.log('📋 EXPECTED PRICING STRUCTURE\n');
  console.log('RINGS WITHOUT SIDE DIAMONDS:');
  console.log('  • 0.50ct: €790');
  console.log('  • 1.00ct: €990');
  console.log('  • 1.50ct: €1,250');
  console.log('  • Natural Diamond: €3,000\n');

  console.log('RINGS WITH SIDE DIAMONDS:');
  console.log('  • 0.50ct: €1,150 (+€360)');
  console.log('  • 1.00ct: €1,350 (+€360)');
  console.log('  • 1.50ct: €1,610 (+€360)');
  console.log('  • Natural Diamond: €3,360 (+€360)\n');

  console.log('VERIFICATION RULES:');
  console.log('  ✓ Metal color should NOT affect price');
  console.log('  ✓ Ring size should NOT affect price');
  console.log('  ✓ Diamond type SHOULD affect price');
  console.log('  ✓ Side diamonds add €360 to all variants\n');

  console.log('================================================================================\n');

  if (incorrectVariants === 0 && productsWithIssues.length === 0) {
    console.log('✅ ALL VARIANT PRICING IS CORRECT!\n');
    console.log('Your Shopify backend is properly configured.\n');
  } else {
    console.log('⚠️  PRICING ISSUES DETECTED!\n');
    console.log('Run this command to see how to fix:');
    console.log('  npm run fix-pricing\n');
  }
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
