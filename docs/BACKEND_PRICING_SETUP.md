# Backend Pricing Setup & Verification Guide

This document explains how pricing is configured in Shopify and how to verify/fix pricing issues.

## Architecture Overview

### Data Flow
```
Shopify (Source of Truth)
    ↓
Storefront API (GraphQL)
    ↓
Frontend Application
    ↓
Display to User
```

**Important:** Pricing is stored in Shopify, not in Supabase. The frontend reads prices directly from Shopify via the Storefront API.

## Pricing Structure

### Rings WITHOUT Side Diamonds
Products tagged with: `no-side-diamonds` or `No side diamonds`

| Diamond Type | Price |
|--------------|-------|
| 0.50ct | €790 |
| 1.00ct | €990 |
| 1.50ct | €1,250 |
| Natural Diamond | €3,000 |

### Rings WITH Side Diamonds
Products tagged with: `with-side-diamonds` or `With side diamonds`

| Diamond Type | Price | Difference |
|--------------|-------|------------|
| 0.50ct | €1,150 | +€360 |
| 1.00ct | €1,350 | +€360 |
| 1.50ct | €1,610 | +€360 |
| Natural Diamond | €3,360 | +€360 |

## Product Variant Structure

Each engagement ring has **84 variants** following this structure:

- **Option1 (Metal Color):** Yellow Gold, White Gold, Rose Gold
- **Option2 (Diamond Type):** 0.50ct, 1.00ct, 1.50ct, Natural Diamond
- **Option3 (Ring Size):** Size 48, 50, 52, 54, 56, 58, 60

### Pricing Rules

✅ **Metal Color** → Does NOT affect price
✅ **Ring Size** → Does NOT affect price
✅ **Diamond Type** → DOES affect price
✅ **Side Diamonds Tag** → Adds €360 to all variants

### Example Variants

Product: "Classic Solitaire Round (no side diamonds)"
- White Gold / 0.50ct / Size 52 → €790
- Yellow Gold / 0.50ct / Size 54 → €790
- Rose Gold / 1.00ct / Size 56 → €990
- White Gold / Natural Diamond / Size 52 → €3,000

Product: "Solitaire Round with Side Diamonds"
- White Gold / 0.50ct / Size 52 → €1,150
- Yellow Gold / 1.00ct / Size 54 → €1,350
- Rose Gold / 1.50ct / Size 56 → €1,610

## Required Tags

Every engagement ring product MUST have one of these tags:
- `with-side-diamonds` OR
- `no-side-diamonds`

Without this tag, the system cannot determine the correct pricing category.

## Verification Scripts

### 1. Quick Verification (Product-Level)
```bash
npm run verify-pricing
```

**What it checks:**
- Products have correct tags
- First variant has correct price
- Basic product structure

**Use when:** Quick health check of overall catalog

### 2. Detailed Verification (Variant-Level)
```bash
npm run verify-variant-pricing
```

**What it checks:**
- ALL variants (not just first)
- Exact price matching for each variant
- Consistency across metal colors and ring sizes
- Side diamond differential (+€360)
- Missing or incorrect tags

**Use when:**
- Investigating pricing discrepancies
- After making manual changes in Shopify
- Before going live

**Output Example:**
```
❌ Classic Solitaire Round (classic-solitaire-round)
   Side Diamonds: NO
   Total Variants: 84
   ❌ White Gold / 0.50ct / Size 52: Price mismatch: Expected €790, Found €800
   ❌ Yellow Gold / 1.00ct / Size 54: Price mismatch: Expected €990, Found €1000
```

## Fixing Pricing Issues

### Step 1: Identify Issues
```bash
npm run verify-variant-pricing
```

### Step 2: Preview Changes (Dry Run)
```bash
npm run fix-pricing-dry-run
```

This shows what WOULD be changed without actually making changes.

**Output Example:**
```
📝 Classic Solitaire Round
   Variant: White Gold / 0.50ct / Size 52
   Current: €800 → Expected: €790
   🔍 Would update (dry run)
```

### Step 3: Apply Changes
```bash
npm run fix-pricing
```

This updates variant prices in Shopify to match the expected pricing structure.

**Features:**
- 5-second countdown before making changes (press Ctrl+C to cancel)
- Rate limiting (500ms between updates)
- Progress reporting
- Error handling

### Step 4: Verify Changes
```bash
npm run verify-variant-pricing
```

Should now show all variants correct.

## How Pricing Works in Frontend

### 1. Product Listing Pages (Shop/Collections)

```typescript
// ProductCard component
const selectedVariant = useMemo(() => {
  // Finds variant matching:
  // - activeFilters.metalColor (from filter)
  // - activeFilters.diamondType (from filter)
  // Returns variant with correct price
}, [activeFilters, product.variants]);

// Displays: selectedVariant.price
```

### 2. Product Detail Pages

```typescript
// ProductDetailPage component
const [selectedOptions, setSelectedOptions] = useState({
  metalColor: 'White Gold',
  diamondType: '0.50ct',
  ringSize: 'Size 52'
});

// When user changes diamondType:
setSelectedOptions({ ...selectedOptions, diamondType: '1.00ct' });

// Finds matching variant from product.variants
const selectedVariant = findVariantByOptions(product, selectedOptions);

// Price updates automatically: selectedVariant.price
```

### 3. Natural Diamond Handling

```typescript
const isNaturalDiamond = useMemo(() => {
  const diamondType = selectedVariant.option2 || '';
  return diamondType === 'Natural Diamond';
}, [selectedVariant]);

// If Natural Diamond:
// - Show "Contact Us for Price"
// - Hide "Add to Cart"
// - Show email link
```

## Shopify GraphQL Query

The frontend fetches variant data using this query:

```graphql
query GetProducts($query: String) {
  products(first: 250, query: $query) {
    edges {
      node {
        id
        title
        tags
        variants(first: 100) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
}
```

**Key Fields:**
- `variants[].price.amount` → The actual price used in frontend
- `variants[].selectedOptions` → Option1 (Metal), Option2 (Diamond), Option3 (Size)

## Troubleshooting

### Issue: Prices showing incorrectly on frontend

**Diagnosis:**
1. Check Shopify directly - are variant prices correct?
2. Run `npm run verify-variant-pricing` to identify issues
3. Check product tags - missing side diamonds tag?

**Solution:**
1. Fix tags if missing: Add `with-side-diamonds` or `no-side-diamonds`
2. Run `npm run fix-pricing` to update variant prices
3. Clear browser cache and refresh

### Issue: Price not updating when changing diamond type

**Diagnosis:**
1. Check browser console for errors
2. Verify `VariantSelector` is receiving correct props
3. Check `selectedOptions` state updates

**Solution:**
1. Verify variant exists with that combination
2. Check `findVariantByOptions` logic
3. Ensure `selectedOptions` includes all required fields

### Issue: Natural Diamond showing price instead of "Contact Us"

**Diagnosis:**
1. Check variant `option2` value
2. Verify `isNaturalDiamond` logic

**Solution:**
1. Ensure variant has `option2: "Natural Diamond"`
2. Check `isNaturalDiamond` memo is working correctly

## Testing Checklist

Before going live, verify:

- [ ] All products have correct side diamonds tags
- [ ] Run `npm run verify-variant-pricing` shows 0 issues
- [ ] Test products without side diamonds:
  - [ ] 0.50ct shows €790
  - [ ] 1.00ct shows €990
  - [ ] 1.50ct shows €1,250
  - [ ] Natural Diamond shows "Contact Us"
- [ ] Test products with side diamonds:
  - [ ] 0.50ct shows €1,150
  - [ ] 1.00ct shows €1,350
  - [ ] 1.50ct shows €1,610
  - [ ] Natural Diamond shows "Contact Us"
- [ ] Changing metal color → price stays same
- [ ] Changing ring size → price stays same
- [ ] Changing diamond type → price updates correctly

## API Credentials Required

The verification and fix scripts require these environment variables in `.env`:

```bash
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
```

**Get Admin Access Token:**
1. Go to Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps" → Create app
3. Configure Admin API scopes: `read_products`, `write_products`
4. Install app and reveal Admin API access token

## Summary

- **Source of Truth:** Shopify variant prices
- **Frontend:** Reads prices via Storefront API
- **Verification:** `npm run verify-variant-pricing`
- **Fixing:** `npm run fix-pricing`
- **Testing:** Use checklist above

All pricing is controlled in Shopify. The frontend simply displays what Shopify returns.
