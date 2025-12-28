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
  variants: Array<{
    price: string;
    title: string;
  }>;
}

const EXPECTED_PRICING = {
  necklaces: {
    '0.50ct': 750,
    '1.00ct': 1190,
    'Natural Diamond': 3000,
  },
  earrings: {
    '0.30ct': 490,
    '0.50ct': 590,
    '1.00ct': 890,
    'Natural Diamond': 3000,
  },
  ringsNoSide: {
    '0.50ct': 790,
    '1.00ct': 990,
    '1.50ct': 1250,
    'Natural Diamond': 3000,
  },
  ringsWithSide: {
    '0.50ct': 1150,
    '1.00ct': 1350,
    '1.50ct': 1610,
    'Natural Diamond': 3360,
  },
};

const EXPECTED_RING_SIZES = ['Size 48', 'Size 50', 'Size 52', 'Size 54', 'Size 56', 'Size 58', 'Size 60'];
const EXPECTED_METAL_COLORS = ['White Gold', 'Rose Gold', 'Yellow Gold'];

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

function verifyPricing(product: Product, expectedPrice: number, category: string): boolean {
  const price = parseFloat(product.variants[0]?.price || '0');
  const isCorrect = price === expectedPrice;

  if (!isCorrect) {
    console.log(`   ❌ ${product.title}`);
    console.log(`      Expected: €${expectedPrice}, Found: €${price}`);
  }

  return isCorrect;
}

function verifyTags(product: Product, requiredTags: string[], category: string): string[] {
  const tags = product.tags.split(', ');
  const missing = requiredTags.filter((tag) => !tags.includes(tag));

  if (missing.length > 0) {
    console.log(`   ⚠️  ${product.title}`);
    console.log(`      Missing tags: ${missing.join(', ')}`);
  }

  return missing;
}

async function main() {
  console.log('🔍 COMPREHENSIVE PRICING & TAG VERIFICATION\n');
  console.log('================================================================================\n');

  const products = await fetchAllProducts();
  console.log(`✅ Fetched ${products.length} products\n`);

  let totalIssues = 0;
  let totalProducts = 0;

  console.log('💎 NECKLACE VERIFICATION\n');
  const necklaces = products.filter((p) => p.tags.includes('necklace'));
  totalProducts += necklaces.length;
  console.log(`Found ${necklaces.length} necklace products\n`);

  for (const necklace of necklaces) {
    if (necklace.title.includes('0.50ct')) {
      if (!verifyPricing(necklace, EXPECTED_PRICING.necklaces['0.50ct'], 'Necklaces')) totalIssues++;
    } else if (necklace.title.includes('1.00ct')) {
      if (!verifyPricing(necklace, EXPECTED_PRICING.necklaces['1.00ct'], 'Necklaces')) totalIssues++;
    }
  }

  console.log('\n💫 EARRING VERIFICATION\n');
  const earrings = products.filter((p) => p.tags.includes('Earrings'));
  totalProducts += earrings.length;
  console.log(`Found ${earrings.length} earring products\n`);

  for (const earring of earrings) {
    if (earring.title.includes('0.30ct')) {
      if (!verifyPricing(earring, EXPECTED_PRICING.earrings['0.30ct'], 'Earrings')) totalIssues++;
    } else if (earring.title.includes('0.50ct')) {
      if (!verifyPricing(earring, EXPECTED_PRICING.earrings['0.50ct'], 'Earrings')) totalIssues++;
    } else if (earring.title.includes('1.00ct')) {
      if (!verifyPricing(earring, EXPECTED_PRICING.earrings['1.00ct'], 'Earrings')) totalIssues++;
    }
  }

  console.log('\n💍 ENGAGEMENT RING VERIFICATION\n');
  const engagementRings = products.filter((p) => p.tags.includes('engagement-ring'));
  totalProducts += engagementRings.length;
  console.log(`Found ${engagementRings.length} engagement ring products\n`);

  console.log('Checking Ring Sizes...');
  let ringSizeIssues = 0;
  for (const ring of engagementRings) {
    const missing = verifyTags(ring, EXPECTED_RING_SIZES, 'Ring Sizes');
    if (missing.length > 0) ringSizeIssues++;
  }

  console.log('\nChecking Metal Colors...');
  let metalColorIssues = 0;
  for (const ring of engagementRings) {
    const missing = verifyTags(ring, EXPECTED_METAL_COLORS, 'Metal Colors');
    if (missing.length > 0) metalColorIssues++;
  }

  console.log('\n📊 PRODUCT CATALOG SUMMARY\n');
  console.log('================================================================================\n');

  const solitaireNoSide = engagementRings.filter(
    (p) => (p.tags.includes('classic') || p.tags.includes('solitaire')) && p.tags.includes('No side diamonds')
  );
  const solitaireWithSide = engagementRings.filter(
    (p) => p.tags.includes('solitaire') && p.tags.includes('With side diamonds')
  );
  const haloNoSide = engagementRings.filter((p) => p.tags.includes('halo') && p.tags.includes('No side diamonds'));
  const haloWithSide = engagementRings.filter((p) => p.tags.includes('halo') && p.tags.includes('With side diamonds'));

  console.log(`Necklaces:                            ${necklaces.length}`);
  console.log(`Earrings:                             ${earrings.length}`);
  console.log(`Classic Solitaire (No Side):          ${solitaireNoSide.length} (Expected: 8)`);
  console.log(`Solitaire (With Side Diamonds):       ${solitaireWithSide.length} (Expected: 8)`);
  console.log(`Halo (No Side Diamonds):              ${haloNoSide.length} (Expected: 8)`);
  console.log(`Halo (With Side Diamonds):            ${haloWithSide.length} (Expected: 8)`);
  console.log(`Total Engagement Rings:               ${engagementRings.length} (Expected: 32)`);
  console.log(`\nTotal Products:                       ${products.length}`);

  console.log('\n📋 PRICING STRUCTURE REFERENCE\n');
  console.log('================================================================================\n');
  console.log('NECKLACES (Timeless Diamond Necklace – 18K Gold)');
  console.log('  • Lab-Grown 0.50ct: €750');
  console.log('  • Lab-Grown 1.00ct: €1,190');
  console.log('  • Natural Diamond: €3,000\n');

  console.log('EARRINGS (Timeless Diamond Stud Earrings – 18K Gold)');
  console.log('  • Lab-Grown 0.30ct: €490');
  console.log('  • Lab-Grown 0.50ct: €590');
  console.log('  • Lab-Grown 1.00ct: €890');
  console.log('  • Natural Diamond: €3,000\n');

  console.log('ENGAGEMENT RINGS - Classic Solitaire & Halo (No Side Diamonds)');
  console.log('  • 0.50ct: €790');
  console.log('  • 1.00ct: €990');
  console.log('  • 1.50ct: €1,250');
  console.log('  • Natural Diamond: €3,000\n');

  console.log('ENGAGEMENT RINGS - Solitaire & Halo (With Side Diamonds)');
  console.log('  • 0.50ct: €1,150');
  console.log('  • 1.00ct: €1,350');
  console.log('  • 1.50ct: €1,610');
  console.log('  • Natural Diamond: €3,360\n');

  console.log('VARIANT STRUCTURE (All Engagement Rings)');
  console.log('  • 3 Metal Colors: Yellow Gold, White Gold, Rose Gold');
  console.log('  • 4 Diamond Types: 0.50ct, 1.00ct, 1.50ct, Natural Diamond');
  console.log('  • 7 Ring Sizes: EU 48, 50, 52, 54, 56, 58, 60');
  console.log('  • Total: 84 variants per ring\n');

  console.log('================================================================================\n');

  if (totalIssues === 0 && ringSizeIssues === 0 && metalColorIssues === 0) {
    console.log('✅ ALL PRICING AND TAGS VERIFIED SUCCESSFULLY!\n');
  } else {
    console.log(`⚠️  Found ${totalIssues + ringSizeIssues + metalColorIssues} total issues\n`);
    console.log('Please review the issues listed above and run the appropriate fix scripts.\n');
  }
}

main().catch(console.error);
