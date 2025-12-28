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
  variants: Array<{
    id: string;
    price: string;
  }>;
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

async function deleteProduct(productId: string): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/products/${productId}.json`, {
    method: 'DELETE',
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.statusText}`);
  }
}

async function createProduct(productData: any): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/products.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product: productData }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create product: ${JSON.stringify(errorData)}`);
  }

  const result = await response.json();
  return result.product;
}

async function updateVariantPrice(variantId: string, price: string): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/variants/${variantId}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variant: {
        id: variantId,
        price: price,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update variant: ${JSON.stringify(errorData)}`);
  }
}

async function main() {
  console.log('🔧 Starting product inconsistency fixes...\n');
  console.log('================================================================================\n');

  try {
    const products = await fetchAllProducts();
    console.log(`✅ Fetched ${products.length} products\n`);

    let fixCount = 0;

    // ========================================
    // 1. FIX TITLE ISSUES
    // ========================================
    console.log('📝 FIXING TITLE ISSUES\n');

    // Fix 1: Classic Solitaire Round - Missing hyphen
    const roundSolitaire = products.find(
      (p) => p.handle === 'classic-solitaire-engagement-ring-round-diamond-18k-gold'
    );
    if (roundSolitaire && roundSolitaire.title.includes('No side diamonds')) {
      console.log(`   Fixing: ${roundSolitaire.title}`);
      const newTitle = roundSolitaire.title.replace(
        'No side diamonds',
        '- No side diamonds'
      );
      await updateProduct(roundSolitaire.id, { title: newTitle });
      console.log(`   ✅ Updated to: ${newTitle}\n`);
      fixCount++;
    }

    // Fix 2: Halo Princess - Capital S
    const haloPrincess = products.find(
      (p) => p.handle === 'halo-engagement-ring-princess-diamond-18k-gold'
    );
    if (haloPrincess && haloPrincess.title.includes('No Side Diamonds')) {
      console.log(`   Fixing: ${haloPrincess.title}`);
      const newTitle = haloPrincess.title.replace('No Side Diamonds', 'No side diamonds');
      await updateProduct(haloPrincess.id, { title: newTitle });
      console.log(`   ✅ Updated to: ${newTitle}\n`);
      fixCount++;
    }

    // ========================================
    // 2. FIX TAG ISSUES
    // ========================================
    console.log('🏷️  FIXING TAG INCONSISTENCIES\n');

    // Fix: Classic Solitaire Round - Wrong tag format
    if (roundSolitaire && roundSolitaire.tags.includes('No side diamonds')) {
      console.log(`   Fixing tags for: ${roundSolitaire.title}`);
      const newTags = roundSolitaire.tags
        .split(', ')
        .map((tag) => (tag === 'No side diamonds' ? 'no-side-diamonds' : tag))
        .join(', ');
      await updateProduct(roundSolitaire.id, { tags: newTags });
      console.log(`   ✅ Fixed tag format\n`);
      fixCount++;
    }

    // ========================================
    // 3. ADD METAL AVAILABILITY TAGS
    // ========================================
    console.log('💍 ADDING METAL AVAILABILITY TAGS\n');

    const metalTags = ['White Gold', 'Rose Gold', 'Yellow Gold'];
    const engagementRings = products.filter((p) => p.tags.includes('engagement-ring'));

    for (const product of engagementRings) {
      const currentTags = product.tags.split(', ');
      const hasMissingMetalTags = metalTags.some((metal) => !currentTags.includes(metal));

      if (hasMissingMetalTags) {
        const newTags = [...currentTags, ...metalTags.filter((m) => !currentTags.includes(m))];
        console.log(`   Adding metal tags to: ${product.title}`);
        await updateProduct(product.id, { tags: newTags.join(', ') });
        console.log(`   ✅ Added: ${metalTags.join(', ')}\n`);
        fixCount++;
      }
    }

    // ========================================
    // 4. FIX PRICING ERRORS
    // ========================================
    console.log('💰 FIXING PRICING ERRORS\n');

    const pricingFixes = [
      {
        handle: 'solitaire-engagement-ring-princess-diamond-side-diamonds-18k-gold',
        correctPrice: '1150.00',
      },
      {
        handle: 'solitaire-engagement-ring-cushion-diamond-side-diamonds-18k-gold',
        correctPrice: '1150.00',
      },
    ];

    for (const fix of pricingFixes) {
      const product = products.find((p) => p.handle === fix.handle);
      if (product) {
        const variant = product.variants[0];
        if (variant && variant.price !== fix.correctPrice) {
          console.log(`   Fixing price for: ${product.title}`);
          console.log(`   Current: €${variant.price} → New: €${fix.correctPrice}`);
          await updateVariantPrice(variant.id, fix.correctPrice);
          console.log(`   ✅ Price updated\n`);
          fixCount++;
        }
      }
    }

    // ========================================
    // 5. DELETE GENERIC PRODUCTS
    // ========================================
    console.log('🗑️  DELETING GENERIC PRODUCTS\n');

    const genericProducts = [
      'solitaire-ring-classic-18k-gold',
      'solitaire-ring-side-diamonds-18k-gold',
      'halo-ring-side-diamonds-18k-gold',
      'halo-ring-18k-gold',
    ];

    for (const handle of genericProducts) {
      const product = products.find((p) => p.handle === handle);
      if (product) {
        console.log(`   Deleting: ${product.title}`);
        await deleteProduct(product.id);
        console.log(`   ✅ Deleted\n`);
        fixCount++;
      }
    }

    // ========================================
    // 6. CREATE MISSING PRODUCTS
    // ========================================
    console.log('➕ CREATING MISSING PRODUCTS\n');

    // Missing Product 1: Solitaire Marquise with Side Diamonds
    const hasMarquiseSolitaire = products.some(
      (p) => p.handle === 'solitaire-engagement-ring-marquise-diamond-side-diamonds-18k-gold'
    );

    if (!hasMarquiseSolitaire) {
      console.log('   Creating: Solitaire Marquise with Side Diamonds');
      await createProduct({
        title: 'Solitaire Engagement Ring – Marquise Diamond – 18K Gold - With side diamonds',
        handle: 'solitaire-engagement-ring-marquise-diamond-side-diamonds-18k-gold',
        product_type: 'Engagement Ring',
        tags: '18k-gold, diamond, engagement-ring, lab-grown, marquise-diamond, solitaire, with-side-diamonds, White Gold, Rose Gold, Yellow Gold',
        vendor: 'Diamonds by CS',
        status: 'active',
        variants: [
          {
            price: '1150.00',
            inventory_management: 'shopify',
            inventory_quantity: 10,
          },
        ],
      });
      console.log('   ✅ Created\n');
      fixCount++;
    }

    // Missing Product 2: Solitaire Heart with Side Diamonds
    const hasHeartSolitaire = products.some(
      (p) => p.handle === 'solitaire-engagement-ring-heart-diamond-side-diamonds-18k-gold'
    );

    if (!hasHeartSolitaire) {
      console.log('   Creating: Solitaire Heart with Side Diamonds');
      await createProduct({
        title: 'Solitaire Engagement Ring – Heart Diamond – 18K Gold - With side diamonds',
        handle: 'solitaire-engagement-ring-heart-diamond-side-diamonds-18k-gold',
        product_type: 'Engagement Ring',
        tags: '18k-gold, diamond, engagement-ring, heart-diamond, lab-grown, solitaire, with-side-diamonds, White Gold, Rose Gold, Yellow Gold',
        vendor: 'Diamonds by CS',
        status: 'active',
        variants: [
          {
            price: '1150.00',
            inventory_management: 'shopify',
            inventory_quantity: 10,
          },
        ],
      });
      console.log('   ✅ Created\n');
      fixCount++;
    }

    // ========================================
    // SUMMARY
    // ========================================
    console.log('================================================================================\n');
    console.log(`✅ COMPLETED! Made ${fixCount} fixes/changes\n`);
    console.log('Summary:');
    console.log('  ✅ Fixed title inconsistencies');
    console.log('  ✅ Fixed tag formatting');
    console.log('  ✅ Added metal availability tags to all engagement rings');
    console.log('  ✅ Fixed pricing errors');
    console.log('  ✅ Deleted generic products');
    console.log('  ✅ Created missing products');
    console.log('\n🎉 All product inconsistencies have been resolved!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
