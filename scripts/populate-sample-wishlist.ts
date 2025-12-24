#!/usr/bin/env node

/**
 * Populate Sample Wishlist Data
 *
 * This script creates sample wishlist entries for testing using real Shopify products.
 *
 * BEFORE RUNNING:
 * 1. Ensure you have a test user account
 * 2. Update USER_EMAIL below with your test user's email
 * 3. Run: npx tsx scripts/populate-sample-wishlist.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// UPDATE THIS WITH YOUR TEST USER EMAIL
const USER_EMAIL = 'test@example.com';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  priceRangeV2: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
      };
    }>;
  };
  productType: string;
}

async function getTestUserId(): Promise<string | null> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    console.log('⚠️  Could not fetch users. You may need admin API access.');
    console.log('   Please sign up a test user manually and update the script with their ID.');
    return null;
  }

  const data = await response.json();
  const user = data.users?.find((u: any) => u.email === USER_EMAIL);

  return user?.id || null;
}

async function addWishlistItem(userId: string, product: ShopifyProduct) {
  const wishlistItem = {
    user_id: userId,
    product_id: product.id,
    product_name: product.title,
    product_price: parseFloat(product.priceRangeV2.minVariantPrice.amount),
    product_image: product.images.edges[0]?.node.url || null,
    product_category: product.productType || 'Juwelen',
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/wishlist_items`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(wishlistItem),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to add wishlist item: ${error}`);
  }

  return wishlistItem;
}

async function populateWishlist() {
  console.log('🎯 Populating sample wishlist data...\n');

  // Load product data
  const productsPath = resolve(process.cwd(), 'src/data/shopify_products_detailed.json');
  const products: ShopifyProduct[] = JSON.parse(readFileSync(productsPath, 'utf-8'));

  console.log(`📦 Found ${products.length} products in data file`);

  // For demo purposes, let's create a mock user ID
  // In production, you would get this from actual authentication
  const mockUserId = '00000000-0000-0000-0000-000000000001';

  console.log(`\n👤 Using user ID: ${mockUserId}`);
  console.log('⚠️  Note: This is a demo. In production, use real user IDs from authentication.\n');

  // Select a few interesting products for the wishlist
  const selectedProducts = [
    products.find(p => p.title.includes('Oval Solitaire')),
    products.find(p => p.title.includes('Halo') && p.title.includes('Round')),
    products.find(p => p.title.includes('Marquise')),
    products.find(p => p.title.includes('Princess')),
    products.find(p => p.title.includes('Emerald')),
  ].filter(Boolean) as ShopifyProduct[];

  if (selectedProducts.length === 0) {
    console.log('❌ No suitable products found in data file');
    process.exit(1);
  }

  console.log(`✅ Selected ${selectedProducts.length} products for wishlist\n`);

  let added = 0;
  let skipped = 0;

  for (const product of selectedProducts) {
    try {
      console.log(`➕ Adding: ${product.title}`);
      await addWishlistItem(mockUserId, product);
      added++;
      console.log(`   ✓ Added successfully`);
    } catch (error) {
      console.log(`   ⚠️  Skipped (may already exist)`);
      skipped++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Wishlist Population Complete!');
  console.log('='.repeat(60));
  console.log(`✅ Added:   ${added} items`);
  console.log(`⏭️  Skipped: ${skipped} items`);
  console.log('='.repeat(60));

  console.log('\n📝 Next Steps:');
  console.log('1. Sign up with email: test@example.com');
  console.log('2. Log in and check your wishlist');
  console.log('3. Or query the database directly:');
  console.log(`   SELECT * FROM wishlist_items WHERE user_id = '${mockUserId}';`);
}

populateWishlist().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
