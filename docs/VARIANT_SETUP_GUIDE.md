# Engagement Ring Variant Setup Guide

## The Critical Issue

Your engagement ring products in Shopify are missing proper variant structure. This causes major filtering and selection issues:

### Current State (BROKEN)
```
Product: Solitaire Engagement Ring – Round Diamond – 18K Gold - With side diamonds
├── Variant 1: "Default Title" at €1,150
└── NO product options defined
```

**Problems:**
- ❌ Customers can't select metal color
- ❌ Customers can't select diamond type (0.50ct, 1.00ct, 1.50ct, Natural)
- ❌ Customers can't select ring size
- ❌ Filters don't work (looking for variant titles like "0.50ct" but finding none)
- ❌ Only one price point instead of 4 different carat options

### Required State (CORRECT)
```
Product: Solitaire Engagement Ring – Round Diamond – 18K Gold - With side diamonds
├── Option 1: Metal Color (3 choices)
│   ├── 18K Yellow Gold
│   ├── 18K White Gold
│   └── 18K Rose Gold
├── Option 2: Diamond Type (4 choices)
│   ├── 0.50ct
│   ├── 1.00ct
│   ├── 1.50ct
│   └── Natural Diamond
├── Option 3: Ring Size (7 choices)
│   ├── EU 48
│   ├── EU 50
│   ├── EU 52
│   ├── EU 54
│   ├── EU 56
│   ├── EU 58
│   └── EU 60
└── 84 Variants (3 × 4 × 7)
    ├── 18K Yellow Gold / 0.50ct / EU 48: €1,150
    ├── 18K Yellow Gold / 0.50ct / EU 50: €1,150
    ├── 18K Yellow Gold / 1.00ct / EU 48: €1,350
    ├── ... (81 more variants)
    └── 18K Rose Gold / Natural Diamond / EU 60: €3,360
```

## Pricing Structure

The script automatically applies the correct pricing based on whether the product has side diamonds:

### NO Side Diamonds (Classic Solitaire)
```
0.50ct          → €790
1.00ct          → €990
1.50ct          → €1,250
Natural Diamond → €3,000
```

### WITH Side Diamonds
```
0.50ct          → €1,150  (+€360)
1.00ct          → €1,350  (+€360)
1.50ct          → €1,610  (+€360)
Natural Diamond → €3,360  (+€360)
```

The script checks the product tags for "with-side-diamonds" or "With side diamonds" to determine which pricing table to use.

## How the Script Works

### Step 1: Identify Products Needing Setup
```typescript
// Checks for products with only 1 variant named "Default Title"
function needsVariantSetup(product: Product): boolean {
  if (product.variants.length !== 1) return false;
  const variant = product.variants[0];
  return variant.title === 'Default Title' ||
         (!variant.option1 && !variant.option2 && !variant.option3);
}
```

### Step 2: Add Product Options
```typescript
// Adds 3 product options to enable variant combinations
await updateProductWithOptions(productId);
// Options: Metal Color, Diamond Type, Ring Size
```

### Step 3: Create All Variants
```typescript
// Creates 84 variants with correct pricing
METAL_COLORS.forEach((metal) => {
  DIAMOND_TYPES.forEach((diamond) => {
    RING_SIZES.forEach((size) => {
      // Create variant with appropriate price
      createVariant({
        option1: metal,
        option2: diamond,
        option3: size,
        price: pricingTable[diamond]
      });
    });
  });
});
```

### Step 4: Remove Default Variant
```typescript
// Deletes the old "Default Title" variant
await deleteDefaultVariant(productId, defaultVariantId);
```

## Running the Script

```bash
npm run setup-engagement-ring-variants
```

### Expected Output
```
🔧 Setting Up Engagement Ring Variants

================================================================================

This script will:
  1. Add 3 product options: Metal Color, Diamond Type, Ring Size
  2. Create 84 variants for each product (3 × 4 × 7)
  3. Apply correct pricing based on side diamonds

================================================================================

✅ Fetched 34 products

Found 32 engagement ring products

8 products need variant setup

Products to update:
  1. Solitaire Engagement Ring – Round Diamond – 18K Gold - With side diamonds - WITH side diamonds
  2. Solitaire Engagement Ring – Princess Diamond – 18K Gold - With side diamonds - WITH side diamonds
  ... (6 more)

⚠️  This will take approximately 16 minutes
⚠️  Do not interrupt the process

📦 Solitaire Engagement Ring – Round Diamond – 18K Gold - With side diamonds
   Pricing: WITH side diamonds
   Step 1: Adding product options...
   Step 2: Creating 84 variants...
   ✓ Created 20/84 variants
   ✓ Created 40/84 variants
   ✓ Created 60/84 variants
   ✓ Created 80/84 variants
   ✓ Created 84/84 variants
   Step 3: Removing default variant...
   ✅ Successfully set up all variants!

   Progress: 1/8 products completed

... (continues for each product)

================================================================================

✅ COMPLETED!

Summary:
  ✅ Updated 8 products
  ✅ Created 672 total variants
  ✅ Applied correct pricing structure

Next steps:
  1. Run: npm run fetch-products
  2. Test filters on the storefront
  3. Verify variant selection on product pages
```

## Why This Fixes the Filters

The frontend filter code looks for variant titles containing specific strings:

```typescript
// productHasDiamondType function in productTagMatcher.ts
export function productHasDiamondType(product: ProcessedProduct, diamondType: string): boolean {
  return product.variants.some(variant => {
    const title = variant.title?.toLowerCase() || '';
    return title.includes(diamondType.toLowerCase());
  });
}
```

### Before (Broken)
```
Variants:
├── "Default Title" (doesn't contain "0.50ct")

Filter for "0.50ct": ❌ Returns 0 products
```

### After (Fixed)
```
Variants:
├── "18K Yellow Gold / 0.50ct / EU 48" (contains "0.50ct" ✓)
├── "18K Yellow Gold / 0.50ct / EU 50" (contains "0.50ct" ✓)
├── "18K White Gold / 0.50ct / EU 48" (contains "0.50ct" ✓)
└── ... (21 more variants with "0.50ct")

Filter for "0.50ct": ✅ Returns this product
```

## Verification Checklist

After running the script:

### ✅ Check Product Structure
1. Go to Shopify Admin → Products
2. Open any engagement ring product
3. Verify you see 3 options:
   - Metal Color (3 values)
   - Diamond Type (4 values)
   - Ring Size (7 values)
4. Verify you see 84 variants listed

### ✅ Check Variant Pricing
1. Check a "No Side Diamonds" product:
   - 0.50ct variants: €790
   - 1.00ct variants: €990
   - 1.50ct variants: €1,250
   - Natural Diamond variants: €3,000

2. Check a "With Side Diamonds" product:
   - 0.50ct variants: €1,150
   - 1.00ct variants: €1,350
   - 1.50ct variants: €1,610
   - Natural Diamond variants: €3,360

### ✅ Test Frontend Filters
1. Go to storefront → Shop page
2. Apply "Diamond Type" filter for "0.50ct"
3. Should see all 32 engagement rings (all have 0.50ct option)
4. Apply "Metal Color" filter for "White Gold"
5. Should see all 32 engagement rings (all have White Gold option)
6. Check filter counts - should be accurate now

### ✅ Test Product Page
1. Click on any engagement ring
2. Should see 3 dropdown selectors:
   - Metal Color
   - Diamond Type
   - Ring Size
3. Change Diamond Type → price should update
4. Change Metal Color → should work
5. Change Ring Size → should work

## Important Notes

### Rate Limiting
The script includes delays to respect Shopify's rate limits:
- 600ms between variant creation calls
- 500ms between product updates
- This is why it takes ~2 minutes per product

### Do Not Interrupt
If the script is interrupted midway:
- Some products may have partial variant setup
- Re-run the script - it will skip already-completed products
- The script checks if a product needs setup before modifying it

### Backup
Before running, consider:
1. Export your products to CSV from Shopify Admin
2. Keep a backup in case you need to revert
3. Test on a single product first (modify the script to process only 1 product)

## Troubleshooting

### Issue: Script fails with rate limit error
**Solution:** The script already includes delays. If still failing, increase the delay values:
```typescript
await new Promise((resolve) => setTimeout(resolve, 1000)); // Increase from 600ms
```

### Issue: Some products still have "Default Title"
**Solution:**
1. Check if the product has tags "engagement-ring"
2. Manually delete the default variant from Shopify Admin
3. Re-run the script

### Issue: Variants have wrong prices
**Solution:**
1. Check the product tags - should have "with-side-diamonds" or "no-side-diamonds"
2. Run `npm run verify-pricing` to check pricing structure
3. Run `npm run fix-solitaire-sidediamond-pricing` if needed

### Issue: Filter counts still wrong
**Solution:**
1. Run `npm run fetch-products` to refresh product data
2. Clear browser cache
3. Check console for any errors
4. Verify variants have correct titles (should include "0.50ct", "1.00ct", etc.)

## Related Scripts

- `npm run verify-pricing` - Verify all products have correct pricing
- `npm run fetch-products` - Refresh product data from Shopify
- `npm run add-missing-ring-sizes` - Add missing ring size tags
- `npm run fix-solitaire-sidediamond-pricing` - Fix pricing on side diamond products

## Next Steps After Running

1. ✅ Run the variant setup script
2. ✅ Verify a few products manually in Shopify Admin
3. ✅ Run `npm run fetch-products` to refresh frontend data
4. ✅ Test filters on the storefront
5. ✅ Test product variant selection
6. ✅ Verify checkout flow with selected variants
7. ✅ Update any other product types (necklaces, earrings) if needed
