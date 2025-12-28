# Two-Tier Pricing System for Diamond Jewelry

## Overview

The store implements a **two-tier pricing structure** based on whether products have side diamonds. This ensures consistent pricing across all 84-variant products while maintaining a €360 price premium for products with side diamonds.

## Pricing Structure

### WITHOUT Side Diamonds (Classic Solitaire / Halo without side diamonds)

| Diamond Type | Price (EUR) |
|-------------|-------------|
| 0.50ct | €790.00 |
| 1.00ct | €990.00 |
| 1.50ct | €1,250.00 |
| Natural Diamond | €3,000.00 |

### WITH Side Diamonds (Solitaire + Side Diamonds / Halo + Side Diamonds)

| Diamond Type | Price (EUR) |
|-------------|-------------|
| 0.50ct | €1,150.00 |
| 1.00ct | €1,350.00 |
| 1.50ct | €1,610.00 |
| Natural Diamond | €3,360.00 |

### Price Difference

- **Lab-Grown Diamonds**: €360 more with side diamonds
- **Natural Diamonds**: €360 more with side diamonds

## Product Identification

Products are identified by the `with-side-diamonds` tag in Shopify:

```typescript
// Products WITHOUT side diamonds
tags: ['engagement-ring', 'solitaire', 'princess', 'lab-grown-diamond']

// Products WITH side diamonds
tags: ['engagement-ring', 'solitaire', 'round', 'with-side-diamonds', 'lab-grown-diamond']
```

## Variant Structure (Standardized for ALL Products)

Every product uses the same 84-variant structure:

- **Option 1: Metal Color** (3 values)
  - 18K Yellow Gold
  - 18K White Gold
  - 18K Rose Gold

- **Option 2: Diamond Type** (4 values)
  - 0.50ct
  - 1.00ct
  - 1.50ct
  - Natural Diamond

- **Option 3: Ring Size** (7 values)
  - EU 48, EU 50, EU 52, EU 54, EU 56, EU 58, EU 60

**Total: 84 variants per product (3 × 4 × 7)**

## Implementation Files

### 1. CSV Generator (`scripts/generate-84-variant-csv.ts`)

Generates Shopify-compatible CSV files with correct pricing based on `hasSideDiamonds` flag:

```typescript
const PRICING_WITH_SIDE_DIAMONDS = {
  '0.50ct': 1150.00,
  '1.00ct': 1350.00,
  '1.50ct': 1610.00,
  'Natural Diamond': 3360.00,
};

const PRICING_WITHOUT_SIDE_DIAMONDS = {
  '0.50ct': 790.00,
  '1.00ct': 990.00,
  '1.50ct': 1250.00,
  'Natural Diamond': 3000.00,
};
```

### 2. Variant Setup Script (`scripts/setup-engagement-ring-variants.ts`)

Automatically applies correct pricing when setting up products via Shopify Admin API:

```typescript
const hasSideDiamonds = product.tags.toLowerCase().includes('with-side-diamonds');
const pricingTier = hasSideDiamonds
  ? PRICING_WITH_SIDE_DIAMONDS
  : PRICING_WITHOUT_SIDE_DIAMONDS;
```

### 3. Frontend Configuration (`src/config/productPricingConfig.ts`)

Provides pricing data and helper functions for the frontend:

```typescript
export const SOLITAIRE_NO_SIDE_DIAMONDS_PRICING: PriceTier[] = [...]
export const SOLITAIRE_WITH_SIDE_DIAMONDS_PRICING: PriceTier[] = [...]
export const NATURAL_DIAMOND_BASE_PRICE = 3000;
export const NATURAL_DIAMOND_WITH_SIDE_PRICE = 3360;
```

## Example Products (Current Catalog)

### WITHOUT Side Diamonds (4 products)

1. Solitaire Ring with Princess Shape Diamond
2. Solitaire Ring with Round Diamond
3. Solitaire Ring with Oval Diamond
4. Halo Ring with Pear Shape Diamond

### WITH Side Diamonds (4 products)

1. Solitaire Ring with Round Diamond and Side Diamonds
2. Solitaire Ring with Emerald Shape and Side Diamond
3. Halo Ring with Cushion Diamond and Side Diamonds
4. Halo Ring with Side Diamonds

## Usage

### Generate CSV for Import

```bash
npm run generate-csv
```

This creates `shopify-84-variants-import.csv` with 672 variants (8 products × 84 variants) using correct pricing.

### Setup via API

```bash
npm run setup-engagement-ring-variants
```

This automatically:
1. Detects products with/without side diamonds via tags
2. Creates 84 variants per product
3. Applies correct pricing tier

### Verify Pricing

```bash
npm run verify-pricing
```

## Adding New Products

When adding new products, ensure:

1. **Tag correctly**: Add `with-side-diamonds` tag if product has side stones
2. **Use same structure**: Always use the 3 standard options (Metal Color, Diamond Type, Ring Size)
3. **Run scripts**: Use CSV generator or setup script to ensure consistent pricing

## Frontend Filtering

The frontend can filter products by side diamonds using the tag:

```typescript
// Filter to show only products WITH side diamonds
const withSideDiamonds = products.filter(p =>
  p.tags.includes('with-side-diamonds')
);

// Filter to show only products WITHOUT side diamonds
const withoutSideDiamonds = products.filter(p =>
  !p.tags.includes('with-side-diamonds')
);
```

## Quality Assurance

All products maintain:
- ✅ Same variant structure (84 variants)
- ✅ Same option names across all products
- ✅ Correct pricing based on side diamond presence
- ✅ Compatible with Shopify Storefront API filtering
- ✅ Consistent user experience across catalog

## Benefits

1. **Consistency**: Same structure across all products
2. **Flexibility**: Easy to add new products with either pricing tier
3. **Transparency**: Clear €360 premium for side diamonds
4. **Scalability**: Can expand to 33+ products without changes to core structure
5. **Filtering**: Tags enable easy filtering in frontend
