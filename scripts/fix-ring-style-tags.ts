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
  console.log('🔧 Fixing ring style tags...\n');
  console.log('================================================================================\n');

  try {
    const products = await fetchAllProducts();
    console.log(`✅ Fetched ${products.length} products\n`);

    let fixCount = 0;

    // Fix Solitaire products with side diamonds
    console.log('💍 FIXING SOLITAIRE + SIDE DIAMONDS TAGS\n');

    const solitaireSideDiamonds = products.filter((p) => {
      const tags = p.tags.toLowerCase();
      return (
        tags.includes('solitaire') &&
        tags.includes('with-side-diamonds') &&
        !tags.includes('solitaire + side diamonds')
      );
    });

    for (const product of solitaireSideDiamonds) {
      console.log(`   Updating: ${product.title}`);
      const currentTags = product.tags.split(', ');
      const newTags = [...currentTags, 'Solitaire + Side Diamonds'];
      await updateProduct(product.id, { tags: newTags.join(', ') });
      console.log(`   ✅ Added "Solitaire + Side Diamonds" tag\n`);
      fixCount++;
    }

    // Fix Halo products with side diamonds
    console.log('💍 FIXING HALO + SIDE DIAMONDS TAGS\n');

    const haloSideDiamonds = products.filter((p) => {
      const tags = p.tags.toLowerCase();
      return (
        tags.includes('halo') &&
        tags.includes('with-side-diamonds') &&
        !tags.includes('halo + side diamonds')
      );
    });

    for (const product of haloSideDiamonds) {
      console.log(`   Updating: ${product.title}`);
      const currentTags = product.tags.split(', ');
      const newTags = [...currentTags, 'Halo + Side Diamonds'];
      await updateProduct(product.id, { tags: newTags.join(', ') });
      console.log(`   ✅ Added "Halo + Side Diamonds" tag\n`);
      fixCount++;
    }

    // Add "Solitaire" tag to classic solitaire products without side diamonds
    console.log('💍 ENSURING PLAIN SOLITAIRE TAGS\n');

    const plainSolitaires = products.filter((p) => {
      const tags = p.tags.toLowerCase();
      const title = p.title.toLowerCase();
      return (
        title.includes('solitaire') &&
        !tags.includes('with-side-diamonds') &&
        tags.includes('no-side-diamonds')
      );
    });

    for (const product of plainSolitaires) {
      const currentTags = product.tags.split(', ');
      if (!currentTags.includes('Solitaire') && !currentTags.includes('solitaire')) {
        console.log(`   Updating: ${product.title}`);
        const newTags = [...currentTags, 'Solitaire'];
        await updateProduct(product.id, { tags: newTags.join(', ') });
        console.log(`   ✅ Added "Solitaire" tag\n`);
        fixCount++;
      }
    }

    // Add "Halo" tag to halo products without side diamonds
    console.log('💍 ENSURING PLAIN HALO TAGS\n');

    const plainHalos = products.filter((p) => {
      const tags = p.tags.toLowerCase();
      const title = p.title.toLowerCase();
      return (
        title.includes('halo') &&
        !tags.includes('with-side-diamonds') &&
        tags.includes('no-side-diamonds')
      );
    });

    for (const product of plainHalos) {
      const currentTags = product.tags.split(', ');
      if (!currentTags.includes('Halo') && !currentTags.includes('halo')) {
        console.log(`   Updating: ${product.title}`);
        const newTags = [...currentTags, 'Halo'];
        await updateProduct(product.id, { tags: newTags.join(', ') });
        console.log(`   ✅ Added "Halo" tag\n`);
        fixCount++;
      }
    }

    console.log('================================================================================\n');
    console.log(`✅ COMPLETED! Fixed ${fixCount} products\n`);
    console.log('Summary:');
    console.log(`  ✅ Fixed ${solitaireSideDiamonds.length} Solitaire + Side Diamonds products`);
    console.log(`  ✅ Fixed ${haloSideDiamonds.length} Halo + Side Diamonds products`);
    console.log('\n🎉 All ring style tags have been corrected!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
