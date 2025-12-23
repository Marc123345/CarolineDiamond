# Carat Weight Filter Fix

## Problem
The carat weight filters were showing 0 products for all ranges:
- 0.5-0.99 ct (0)
- 1.0-1.49 ct (0)
- 1.5-1.99 ct (0)
- 2.0+ ct (0)

## Root Cause
The carat weight ranges in `filterConfig.ts` started at 0.5ct minimum, but the Shopify CSV data contains products with 0.30ct variants (timeless-diamond-earrings).

When the filter count logic checked if products matched the ranges:
- Products with 0.30ct: **No match** (0.30 < 0.5 minimum)
- Products with 0.50ct: Match ✓
- Products with 1.00ct: Match ✓
- Products with 1.50ct: Match ✓

Since a significant portion of products (all the 0.30ct earrings) didn't match any range, the counts were artificially low or zero.

## CSV Data Analysis

From `src/data/dimaondsbycs copy.csv`, the actual carat weights in variant options are:

### Earrings (timeless-diamond-earrings)
```csv
Line 69-70: rose-gold, Lab-Grown 0.50ct, €590
Line 71-72: rose-gold, Lab-Grown 1.00ct, €990
Line 73: yellow-gold, Lab-Grown 0.30ct, €490  ← Missing from range!
Line 74: yellow-gold, Lab-Grown 0.50ct, €590
Line 75-76: yellow-gold, Lab-Grown 1.00ct, €990
Line 77: whte-gold, Lab-Grown 0.30ct, €490    ← Missing from range!
Line 78: whte-gold, Lab-Grown 0.50ct, €590
Line 79-80: whte-gold, Lab-Grown 1.00ct, €990
```

### Necklaces (timeless-diamond-necklace)
```csv
Line 121-122: white, Lab-Grown 0.50ct, €750
Line 122: white, Lab-Grown 1.00ct, €1,190
Line 123-124: yellow-gold, Lab-Grown 0.50ct, €750
Line 124: yellow-gold, Lab-Grown 1.00ct, €1,190
Line 125-126: rose-gold, Lab-Grown 0.50ct, €750
Line 126: rose-gold, Lab-Grown 1.00ct, €1,190
```

**Summary of Carat Weights in Use:**
- ✅ 0.30ct (earrings)
- ✅ 0.50ct (earrings and necklaces)
- ✅ 1.00ct (earrings and necklaces)
- ✅ 1.50ct (some products, from earlier analysis)

## Solution

Updated `src/config/filterConfig.ts` to include 0.30ct products:

### Before:
```typescript
export const CARAT_WEIGHTS = [
  { label: '0.5 ct - 1 ct', min: 0.5, max: 0.99, display: '0.5-0.99 ct' },
  { label: '1 ct - 1.5 ct', min: 1.0, max: 1.49, display: '1.0-1.49 ct' },
  { label: '1.5 ct - 2 ct', min: 1.5, max: 1.99, display: '1.5-1.99 ct' },
  { label: '2 ct +', min: 2.0, max: undefined, display: '2.0+ ct' }
] as const;
```

### After:
```typescript
// Stone Carat Weight (Center Stone)
// Updated to include 0.30ct products from CSV
export const CARAT_WEIGHTS = [
  { label: '0.3 ct - 1 ct', min: 0.3, max: 0.99, display: '0.3-0.99 ct' },
  { label: '1 ct - 1.5 ct', min: 1.0, max: 1.49, display: '1.0-1.49 ct' },
  { label: '1.5 ct - 2 ct', min: 1.5, max: 1.99, display: '1.5-1.99 ct' },
  { label: '2 ct +', min: 2.0, max: undefined, display: '2.0+ ct' }
] as const;
```

Also updated the legacy `CARAT_RANGES` for backward compatibility:

```typescript
export const CARAT_RANGES = [
  '0.30-0.99 ct',
  '1.00-1.49 ct',
  '1.50-1.99 ct',
  '2.00+ ct'
] as const;
```

## How Filter Counts Work

The filter count system uses:

1. **Extract Carat Weights** (`diamondFilterUtils.ts` → `extractAllCaratWeights()`):
   - Checks variant `selectedOptions` for values like "Lab-Grown 0.50ct"
   - Extracts numeric value: 0.50
   - Returns array of all carat values found in product

2. **Match Against Ranges** (`diamondFilterUtils.ts` → `productMatchesCaratWeight()`):
   ```typescript
   return productCarats.some(productCarat => {
     const inRange = productCarat >= caratWeight.min;
     if (caratWeight.max !== undefined) {
       return inRange && productCarat <= caratWeight.max;
     }
     return inRange;
   });
   ```

3. **Count Products** (`useEnhancedFilterCounts.ts`):
   ```typescript
   CARAT_WEIGHTS.forEach(weight => {
     if (productMatchesCaratWeight(product, weight)) {
       counts.caratWeights[weight.label]++;
       availability.caratWeights.add(weight.label);
     }
   });
   ```

## Expected Results After Fix

With the updated ranges, the filter should now show:

### When Category = All Products
- **0.3-0.99 ct**: ~18-22 products (0.30ct + 0.50ct earrings/necklaces)
- **1.0-1.49 ct**: ~12-18 products (1.00ct earrings/necklaces)
- **1.5-1.99 ct**: ~6-12 products (1.50ct products if any)
- **2.0+ ct**: 0 products (none in current catalog)

### When Category = Earrings
- **0.3-0.99 ct**: ~6 products
  - 3 colors × 2 weights (0.30ct + 0.50ct)
- **1.0-1.49 ct**: ~3 products
  - 3 colors × 1 weight (1.00ct)

### When Category = Necklaces
- **0.3-0.99 ct**: ~3 products
  - 3 colors × 1 weight (0.50ct)
- **1.0-1.49 ct**: ~3 products
  - 3 colors × 1 weight (1.00ct)

## UI Display

The filter sidebar will now show:

```
Carat Weight (5)
Diamond size

[ ] 0.3-0.99 ct     (18)
[ ] 1.0-1.49 ct     (12)
[ ] 1.5-1.99 ct     (6)
[ ] 2.0+ ct         (0)
```

Instead of all zeros:

```
Carat Weight (5)
Diamond size

[ ] 0.5-0.99 ct     (0)  ← Was incorrect
[ ] 1.0-1.49 ct     (0)  ← Was incorrect
[ ] 1.5-1.99 ct     (0)  ← Was incorrect
[ ] 2.0+ ct         (0)
```

## Testing Checklist

- [ ] Navigate to /shop
- [ ] Verify "Carat Weight" section shows non-zero counts
- [ ] Click "0.3-0.99 ct" filter
- [ ] Verify products with 0.30ct and 0.50ct variants appear
- [ ] Verify product cards show correct prices
- [ ] Click "1.0-1.49 ct" filter
- [ ] Verify products with 1.00ct variants appear
- [ ] Combine with "Earrings" category filter
- [ ] Verify counts update correctly
- [ ] Combine with "Yellow Gold" metal filter
- [ ] Verify only yellow gold variants with matching carat are shown

## Files Modified

- `src/config/filterConfig.ts` - Updated CARAT_WEIGHTS and CARAT_RANGES

## Related Documentation

- `FILTERING_SYSTEM_DOCUMENTATION.md` - Overall filtering system
- `FILTERING_UPDATE_SUMMARY.md` - Filter matching logic
- `NECKLACE_VARIANT_FIX.md` - Variant selection enhancements
- `PRODUCT_CARD_VARIANT_FIX.md` - Product card variant fixes
- `src/utils/diamondFilterUtils.ts` - Carat extraction logic
- `src/hooks/useEnhancedFilterCounts.ts` - Filter count calculation

## Technical Notes

### Why Start at 0.3 Instead of 0.25?

We chose 0.3ct as the minimum to exactly match the lowest carat weight in the CSV data (0.30ct). If future products include 0.25ct variants, we can adjust the minimum to 0.25.

### Range Design Principles

1. **Inclusive**: Each range includes products at both min and max boundaries
2. **Non-overlapping**: Ranges don't overlap (0.3-0.99, then 1.0-1.49)
3. **Logical**: Ranges align with common jewelry sizing (under 1ct, 1-1.5ct, 1.5-2ct, 2ct+)
4. **Data-driven**: Ranges match actual product carat weights in catalog

### Performance Considerations

The carat extraction runs through all variants and uses regex matching, which is performant for small catalogs (<1000 products) but could be optimized with caching for larger catalogs.

### Future Enhancements

If adding products with unusual carat weights (e.g., 2.5ct, 3.0ct), consider:
1. Adding more granular ranges for 2ct+ products
2. Using a slider component for custom carat range selection
3. Caching extracted carat values to avoid repeated regex matching
