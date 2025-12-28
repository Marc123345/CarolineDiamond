# Standardized 8-Product Structure

## Overview

This document describes the standardized variant structure for all 8 engagement ring products in the store. Each product follows an identical pattern with 84 variants based on three customizable options.

## Product Variant Structure

### Core Requirements

Every product must have:
- **84 variants** (3 × 4 × 7)
- **3 options** for customization
- **Standardized pricing** across all products

### Option Configuration

#### Option 1: Metal Color
- **Name**: `Metal Color`
- **Values**:
  1. `18K Yellow Gold`
  2. `18K White Gold`
  3. `18K Rose Gold`
- **Count**: 3 values

#### Option 2: Diamond Type
- **Name**: `Diamond Type`
- **Values**:
  1. `0.50ct` (Lab-Grown)
  2. `1.00ct` (Lab-Grown)
  3. `1.50ct` (Lab-Grown)
  4. `Natural Diamond`
- **Count**: 4 values

#### Option 3: Ring Size
- **Name**: `Ring Size`
- **Values**:
  1. `EU 48`
  2. `EU 50`
  3. `EU 52`
  4. `EU 54`
  5. `EU 56`
  6. `EU 58`
  7. `EU 60`
- **Count**: 7 values

## Pricing Structure

All 8 products share the same pricing structure. Price is determined **exclusively** by Diamond Type, regardless of Metal Color or Ring Size.

| Diamond Type | Price (EUR) | Variants | Total per Type |
|--------------|-------------|----------|----------------|
| 0.50ct       | €1,150.00   | 21       | All Metal × All Sizes |
| 1.00ct       | €1,350.00   | 21       | All Metal × All Sizes |
| 1.50ct       | €1,610.00   | 21       | All Metal × All Sizes |
| Natural Diamond | €3,360.00 | 21       | All Metal × All Sizes |

### Pricing Calculation
```
If Diamond Type = "0.50ct" → Price = €1,150.00
If Diamond Type = "1.00ct" → Price = €1,350.00
If Diamond Type = "1.50ct" → Price = €1,610.00
If Diamond Type = "Natural Diamond" → Price = €3,360.00
```

## The 8 Products

All products follow the same structure:

1. **Solitaire Ring with Princess Shape Diamond**
2. **Solitaire Ring with Round Diamond**
3. **Solitaire Ring with Oval Diamond**
4. **Solitaire Ring with Round Diamond and Side Diamonds**
5. **Solitaire Ring with Emerald Shape and Side Diamond**
6. **Halo Ring with Cushion Diamond and Side Diamonds**
7. **Halo Ring with Pear Shape Diamond**
8. **Halo Ring with Side Diamonds**

## Complete Variant Matrix

Each product has 84 variants following this pattern:

```
For each Metal Color (3):
  For each Diamond Type (4):
    For each Ring Size (7):
      Create variant with price based on Diamond Type
```

### Example Variants

| Variant Title | Option1 | Option2 | Option3 | Price |
|---------------|---------|---------|---------|-------|
| 18K Yellow Gold / 0.50ct / EU 48 | 18K Yellow Gold | 0.50ct | EU 48 | €1,150.00 |
| 18K Yellow Gold / 0.50ct / EU 50 | 18K Yellow Gold | 0.50ct | EU 50 | €1,150.00 |
| 18K Yellow Gold / 1.00ct / EU 48 | 18K Yellow Gold | 1.00ct | EU 48 | €1,350.00 |
| 18K White Gold / 1.50ct / EU 54 | 18K White Gold | 1.50ct | EU 54 | €1,610.00 |
| 18K Rose Gold / Natural Diamond / EU 56 | 18K Rose Gold | Natural Diamond | EU 56 | €3,360.00 |

## Implementation Guide

### Backend Setup

#### 1. Supabase Database

The database stores product models, pricing tiers, and metal options:

**Tables:**
- `ring_models` - Product definitions
- `pricing_tiers` - Price by carat/origin
- `metal_options` - Metal color configurations

**Price Calculation Function:**
```sql
calculate_variant_price(model_id, carat_weight, diamond_origin, metal_id)
```

#### 2. Shopify Integration

**Using GraphQL API:**
```bash
npm run setup-engagement-ring-variants
```

This script:
1. Adds 3 product options to each product
2. Creates 84 variants per product
3. Applies standardized pricing
4. Removes default variants

**Using CSV Import:**
```bash
npm run generate-csv
```

This generates `shopify-84-variants-import.csv` for bulk import via Shopify Admin.

### Frontend Implementation

#### Variant Selector

The `VariantSelector` component automatically handles:
- **Metal Color**: Button grid display
- **Diamond Type**: Radio list with price display
- **Ring Size**: Dropdown selector

```tsx
<VariantSelector
  product={product}
  selectedOptions={selectedOptions}
  onOptionsChange={setSelectedOptions}
/>
```

#### Price Display

Dynamic pricing updates based on Diamond Type selection:

```tsx
const selectedVariant = findVariantByOptions(product, selectedOptions);
const price = selectedVariant?.price || product.price;
```

#### Add to Cart

Full variant information is passed to cart:

```tsx
await addToCart({
  variantId: selectedVariant.id,
  quantity: 1,
  selectedOptions: {
    'Metal Color': '18K Yellow Gold',
    'Diamond Type': '1.00ct',
    'Ring Size': 'EU 54'
  }
});
```

## Variant Title Format

Each variant follows this naming convention:
```
{Metal Color} / {Diamond Type} / {Ring Size}
```

**Examples:**
- `18K Yellow Gold / 0.50ct / EU 48`
- `18K White Gold / 1.50ct / EU 56`
- `18K Rose Gold / Natural Diamond / EU 60`

## SKU Format

SKUs follow this pattern:
```
{PRODUCT-HANDLE}-{METAL-CODE}-{DIAMOND-CODE}-{SIZE-CODE}
```

**Metal Codes:**
- `YG` = Yellow Gold
- `WG` = White Gold
- `RG` = Rose Gold

**Diamond Codes:**
- `050CT` = 0.50ct
- `100CT` = 1.00ct
- `150CT` = 1.50ct
- `NATURAL` = Natural Diamond

**Examples:**
- `SOLITAIRE-ROUND-YG-100CT-EU54`
- `HALO-PEAR-WG-050CT-EU48`
- `SOLITAIRE-PRINCESS-RG-NATURAL-EU60`

## Verification Checklist

After implementation, verify:

- [ ] Each product has exactly 84 variants
- [ ] All variants have correct option values
- [ ] Pricing matches Diamond Type specification
- [ ] No variants have "Default Title"
- [ ] All Metal Colors are present (3)
- [ ] All Diamond Types are present (4)
- [ ] All Ring Sizes are present (7)
- [ ] Frontend displays all options correctly
- [ ] Price updates dynamically when Diamond Type changes
- [ ] Add to cart works for all variants
- [ ] Filters work correctly on shop page

## Testing Scenarios

### 1. Price Consistency Test
```
For each product:
  Select "0.50ct" → Verify price = €1,150.00
  Select "1.00ct" → Verify price = €1,350.00
  Select "1.50ct" → Verify price = €1,610.00
  Select "Natural Diamond" → Verify price = €3,360.00
```

### 2. Option Availability Test
```
For each product:
  Verify 3 Metal Colors are selectable
  Verify 4 Diamond Types are selectable
  Verify 7 Ring Sizes are selectable
```

### 3. Variant Selection Test
```
For each product:
  Select: 18K Yellow Gold + 1.00ct + EU 54
  Verify: Correct variant found
  Verify: Price = €1,350.00
  Verify: Can add to cart
```

### 4. Filter Integration Test
```
On shop page:
  Apply Diamond Type filter = "1.00ct"
  Verify: All 8 products appear
  Verify: Each shows "From €1,350"
```

## Troubleshooting

### Issue: Products show "Default Title"
**Solution**: Run `npm run setup-engagement-ring-variants`

### Issue: Wrong number of variants
**Expected**: 84 variants per product
**Solution**: Delete all variants and re-run setup script

### Issue: Price not updating on frontend
**Check**:
1. Variant has correct price in Shopify
2. `selectedOptions` includes Diamond Type
3. `findVariantByOptions` returns correct variant

### Issue: "Not available with current selection"
**Check**:
1. All 84 variants exist in Shopify
2. Variants are marked as available for sale
3. Option values match exactly (case-sensitive)

## Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run setup-engagement-ring-variants` | Setup variants via Shopify API |
| `npm run generate-csv` | Generate CSV for bulk import |
| `npm run fetch-products` | Sync products from Shopify |
| `npm run verify-pricing` | Verify all prices are correct |

## Database Schema

### Ring Models
```sql
CREATE TABLE ring_models (
  model_id text PRIMARY KEY,
  name_en text,
  name_nl text,
  style text,
  has_side_diamonds boolean
);
```

### Pricing Tiers
```sql
CREATE TABLE pricing_tiers (
  model_id text REFERENCES ring_models(model_id),
  carat_weight decimal(4,2),
  diamond_origin text, -- 'natural' or 'lab-grown'
  price_incl_tax decimal(10,2),
  UNIQUE(model_id, carat_weight, diamond_origin)
);
```

### Metal Options
```sql
CREATE TABLE metal_options (
  metal_id text PRIMARY KEY,
  display_name text,
  hex_color text,
  price_modifier decimal(10,2) DEFAULT 0
);
```

## API Integration

### Shopify GraphQL Query

```graphql
query getProduct($handle: String!) {
  product(handle: $handle) {
    id
    title
    options {
      id
      name
      values
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          price
          selectedOptions {
            name
            value
          }
          availableForSale
        }
      }
    }
  }
}
```

### Price Calculation in Frontend

```typescript
const STANDARDIZED_PRICING = {
  '0.50ct': 1150.00,
  '1.00ct': 1350.00,
  '1.50ct': 1610.00,
  'Natural Diamond': 3360.00,
};

function getPrice(diamondType: string): number {
  return STANDARDIZED_PRICING[diamondType] || 0;
}
```

## Performance Optimization

### Caching Strategy
- Cache product data from Shopify (5 min TTL)
- Store pricing in Supabase for quick lookup
- Use frontend state for variant selection

### Loading Strategy
- Lazy load variant images
- Pre-fetch selected variant data
- Show loading states during price updates

## Maintenance

### Adding New Products
1. Create product in Shopify
2. Add to 8-product list
3. Run setup script
4. Verify all 84 variants
5. Test frontend integration

### Updating Prices
1. Update `STANDARDIZED_PRICING` constant
2. Run price update script
3. Verify in Shopify Admin
4. Clear frontend cache
5. Test on storefront

### Bulk Operations
Use Shopify CSV import for:
- Mass price updates
- Adding new size options
- Updating metal colors

## Support & Resources

- **Shopify API Docs**: https://shopify.dev/docs/api/admin-graphql
- **Supabase Docs**: https://supabase.com/docs
- **Project Scripts**: `/scripts` directory
- **Documentation**: `/docs` directory

---

**Last Updated**: 2025-12-28
**Version**: 1.0.0
**Status**: Production Ready
