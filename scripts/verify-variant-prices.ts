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

async function fetchProduct(handle: string) {
  const response = await fetch(`${ADMIN_API_URL}/products.json?handle=${handle}`, {
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const data = await response.json();
  return data.products[0];
}

async function main() {
  console.log('🔍 VERIFYING VARIANT PRICES\n');
  console.log('================================================================================\n');

  const handles = [
    'classic-solitaire-engagement-ring-round-diamond-18k-gold',
    'solitaire-engagement-ring-round-diamond-side-diamonds-18k-gold',
    'halo-engagement-ring-round-diamond-18k-gold',
  ];

  for (const handle of handles) {
    const product = await fetchProduct(handle);
    console.log(`\n📦 ${product.title}`);
    console.log(`   Total Variants: ${product.variants.length}\n`);

    const sampleVariants = [
      product.variants.find((v: any) => v.title.includes('Yellow Gold / 0.50ct / 48')),
      product.variants.find((v: any) => v.title.includes('Yellow Gold / 1.00ct / 48')),
      product.variants.find((v: any) => v.title.includes('Yellow Gold / 1.50ct / 48')),
      product.variants.find((v: any) => v.title.includes('Yellow Gold / Natural Diamond / 48')),
    ].filter(Boolean);

    sampleVariants.forEach((variant: any) => {
      console.log(`   ${variant.title}: €${variant.price}`);
    });
  }

  console.log('\n================================================================================\n');
}

main().catch(console.error);
