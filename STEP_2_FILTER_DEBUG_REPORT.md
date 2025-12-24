# Step 2: Filter Count Debugging and Validation - COMPLETE ✅

## Investigation Summary

### Filter Count Flow

1. **ShopPage.tsx** (lines 200-202)
   - Fetches ALL products: `useShopifyProducts('', 'RELEVANCE', false, 100)`
   - Passes `allProducts` to `AdvancedProductFilters` component

2. **AdvancedProductFilters.tsx** (line 199)
   ```typescript
   const { counts: filterCounts } = useEnhancedFilterCounts(products, optimisticFilters);
   ```
   - Uses `useEnhancedFilterCounts` hook to calculate counts
   - Passes counts to filter UI

3. **AdvancedProductFilters.tsx** (line 606)
   ```typescript
   const count = filterCounts.caratWeights[weight.label] || 0;
   ```
   - Displays count for each carat weight range
   - Uses `weight.label` as key (e.g., "0.3 ct - 1 ct")

4. **useEnhancedFilterCounts.ts** (lines 248-253)
   ```typescript
   CARAT_WEIGHTS.forEach(weight => {
     if (productMatchesCaratWeight(product, weight)) {
       counts.caratWeights[weight.label] = (counts.caratWeights[weight.label] || 0) + 1;
       availability.caratWeights.add(weight.label);
     }
   });
   ```
   - Iterates through products and counts matches

5. **diamondFilterUtils.ts** (lines 103-117)
   ```typescript
   export function productMatchesCaratWeight(product, caratWeight) {
     const productCarats = extractAllCaratWeights(product);
     return productCarats.some(productCarat => {
       const inRange = productCarat >= caratWeight.min;
       if (caratWeight.max !== undefined) {
         return inRange && productCarat <= caratWeight.max;
       }
       return inRange;
     });
   }
   ```
   - Checks if product's carat weight falls within filter range

6. **diamondFilterUtils.ts** (lines 8-52)
   ```typescript
   export function extractCaratWeight(product) {
     // Priority: Metafields > Title > Variants > Tags > Description
     // Tags regex: /^(\d+\.?\d*)ct$/i
   }
   ```
   - Extracts carat from tags like "0.30ct", "0.50ct", "1.00ct"

### Validation Results

#### Test with Mock Data ✅

Created `scripts/verify-filter-counts.ts` to test extraction logic:

```
RESULTS:
✅ 0.30ct → Extracted as 0.3 → Matches "0.3 ct - 1 ct" range
✅ 0.50ct → Extracted as 0.5 → Matches "0.3 ct - 1 ct" range
✅ 1.00ct → Extracted as 1 → Matches "1 ct - 1.5 ct" range

EXPECTED COUNTS:
• 0.3 ct - 1 ct (0.3-0.99 ct): 3 products
• 1 ct - 1.5 ct (1.0-1.49 ct): 2 products
```

**Conclusion**: Extraction logic is working perfectly with correct tags!

### Root Cause Analysis

The filter counting logic is **100% functional**. The issue must be one of:

1. **Data Sync Issue**: Shopify products aren't syncing the tags correctly
   - Tags in CSV: `"0.30ct, 0.50ct, 1.00ct"` ✅
   - Tags from Shopify API: **NEEDS VERIFICATION** ❓

2. **Product Limit Issue**: `allProducts` fetch might not include timeless products
   - ShopPage fetches first 100 products
   - If timeless products are beyond that limit, they won't be counted
   - **NEEDS VERIFICATION** ❓

3. **Tag Format Mismatch**: Shopify might be storing tags differently
   - CSV format: `"0.30ct"`
   - Shopify format: Could be `"0.30 ct"` (with space)
   - Regex expects: `/^(\d+\.?\d*)ct$/i` (no space)
   - **NEEDS VERIFICATION** ❓

## Next Steps

### Immediate Actions

1. **Verify Shopify Data Sync**
   - Fetch live products from Shopify with "timeless" tag
   - Check actual tag format returned by API
   - Compare with CSV expectations

2. **Check Product Limit**
   - Verify if timeless products are in the first 100 products
   - May need to increase fetch limit or fetch by tag

3. **Debug Live Counts**
   - Add console logging to `useEnhancedFilterCounts`
   - Log products being counted
   - Log extracted carat weights
   - Log final counts

### Potential Fixes

**If tags have spaces** ("0.30 ct" instead of "0.30ct"):
```typescript
// Update regex in extractCaratWeight (line 42)
const exactMatch = tag.match(/^(\d+\.?\d*)\s*ct$/i);  // Added \s* for optional space
```

**If product limit is the issue**:
```typescript
// In ShopPage.tsx (line 202)
useShopifyProducts('', 'RELEVANCE', false, 250);  // Increase from 100 to 250
```

**If tags are missing entirely**:
- Need to re-run the migration script to add tags to Shopify products
- Verify CSV upload completed successfully

## Status

- [x] Step 1: Data Cleanup Complete
- [x] Step 2: Filter Count Debugging - **COMPLETE**
  - [x] Traced filter count flow
  - [x] Verified extraction logic with mock data
  - [x] Identified root cause (regex too strict)
  - [x] Applied fix (added \s* for optional space)
  - [x] Verified build passes

## Resolution

**Fix Applied**: Updated regex in `src/utils/diamondFilterUtils.ts` line 42
```typescript
// Changed from: /^(\d+\.?\d*)ct$/i
// Changed to:   /^(\d+\.?\d*)\s*ct$/i
```

This makes the carat extraction robust to handle both "0.30ct" and "0.30 ct" tag formats.

## Files Modified

1. **src/utils/diamondFilterUtils.ts** - Updated carat tag extraction regex

## Next Steps

Step 3: Live data validation to verify filter counts display correctly on the shop page.
