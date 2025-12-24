# Problem Statement: Carat Weight Filter Count and Mapping Issues

## Current Symptoms

When viewing the shop filters:
- **0.3-0.99 ct**: Shows count of **1** (should show more)
- **1.0-1.49 ct**: Shows count of **1** (should show more)
- Same issue occurs for earrings and necklaces specifically

The filters are not accurately counting products that match each carat weight range.

---

## Root Cause Analysis

### Issue 1: Duplicate Product Data Structure

The CSV catalog contains **TWO different product structures** for the same jewelry items:

#### OLD Structure (Combined Product with Variants)
```
timeless-diamond-earrings
├── Variant: rose-gold + Lab-Grown 0.50ct → €590
├── Variant: rose-gold + Lab-Grown 1.00ct → €890
├── Variant: yellow-gold + Lab-Grown 0.30ct → €490
├── Variant: yellow-gold + Lab-Grown 0.50ct → €590
├── Variant: yellow-gold + Lab-Grown 1.00ct → €890
├── Variant: whte-gold + Lab-Grown 0.30ct → €490
├── Variant: whte-gold + Lab-Grown 0.50ct → €590
└── Variant: whte-gold + Lab-Grown 1.00ct → €890

timeless-diamond-necklace
├── Variant: white + Lab-Grown 1.00ct → €1190
├── Variant: yellow-gold + Lab-Grown 0.50ct → €750
├── Variant: yellow-gold + Lab-Grown 1.00ct → €1190
├── Variant: rose-gold + Lab-Grown 0.50ct → €750
└── Variant: rose-gold + Lab-Grown 1.00ct → €1190
```

**Carat location**: In `Option2 Value` column ("Lab-Grown 0.50ct")
**Pricing**: Different price per variant based on carat + metal combination

#### NEW Structure (Separate Products per Carat)
```
timeless-diamond-stud-earrings-18k-gold-0-30ct
├── Variant: Yellow Gold → €490
├── Variant: White Gold → €490
└── Variant: Rose Gold → €490

timeless-diamond-stud-earrings-18k-gold-0-50ct
├── Variant: Yellow Gold → €590
├── Variant: White Gold → €590
└── Variant: Rose Gold → €590

timeless-diamond-stud-earrings-18k-gold-1-00ct
├── Variant: Yellow Gold → €890
├── Variant: White Gold → €890
└── Variant: Rose Gold → €890

timeless-diamond-necklace-18k-gold-0-50ct
├── Variant: Yellow Gold → €750
├── Variant: White Gold → €750
└── Variant: Rose Gold → €750

timeless-diamond-necklace-18k-gold-1-00ct
├── Variant: Yellow Gold → €1190
├── Variant: White Gold → €1190
└── Variant: Rose Gold → €1190
```

**Carat location**: In product **handle** and **title**
**Pricing**: Same price for all metal colors within each carat weight

---

### Issue 2: Inconsistent Carat Extraction

The `extractAllCaratWeights()` function in `diamondFilterUtils.ts` extracts carat from:

1. Variant `selectedOptions` → Captures OLD structure carat
2. Variant `title` → May capture NEW structure carat
3. Product `name` → Captures NEW structure carat from title
4. Product `metafields.carat`
5. Product `tags`

**Problem**: 
- For OLD products: Carat is in variant options ("Lab-Grown 0.50ct")
- For NEW products: Carat is in product title ("Timeless Diamond Stud Earrings – 18K Gold – 0.50ct")
- Both extraction methods work independently
- BUT they create inconsistent product grouping

---

### Issue 3: Filter Count Logic Issues

The filter counting happens in `useEnhancedFilterCounts.ts`:

```typescript
CARAT_WEIGHTS.forEach(weight => {
  if (productMatchesCaratWeight(product, weight)) {
    counts.caratWeights[weight.label]++;
    availability.caratWeights.add(weight.label);
  }
});
```

**How it should count**:

For **0.3-0.99 ct range**:
- ✅ `timeless-diamond-earrings` (OLD) → Has 0.30ct and 0.50ct variants → COUNT: 1 product
- ✅ `timeless-diamond-stud-earrings-18k-gold-0-30ct` (NEW) → COUNT: 1 product
- ✅ `timeless-diamond-stud-earrings-18k-gold-0-50ct` (NEW) → COUNT: 1 product  
- ✅ `timeless-diamond-necklace` (OLD) → Has 0.50ct variants → COUNT: 1 product
- ✅ `timeless-diamond-necklace-18k-gold-0-50ct` (NEW) → COUNT: 1 product
- **Expected Total**: 5 products

For **1.0-1.49 ct range**:
- ✅ `timeless-diamond-earrings` (OLD) → Has 1.00ct variants → COUNT: 1 product
- ✅ `timeless-diamond-stud-earrings-18k-gold-1-00ct` (NEW) → COUNT: 1 product
- ✅ `timeless-diamond-necklace` (OLD) → Has 1.00ct variants → COUNT: 1 product  
- ✅ `timeless-diamond-necklace-18k-gold-1-00ct` (NEW) → COUNT: 1 product
- **Expected Total**: 4 products

**Current behavior**: Showing count of **1** for each range

**Possible reasons**:
1. Only OLD products are being counted (OLD earrings + OLD necklaces = 2, but showing 1)
2. Only NEW products are being counted (but not all NEW products exist for each range)
3. Extraction is failing for one product structure
4. Products are being filtered out by other active filters

---

### Issue 4: Pricing Inconsistencies

**OLD Product Pricing** (variant-level):
```
Earrings:
  0.30ct + any metal → €490
  0.50ct + any metal → €590
  1.00ct + any metal → €890

Necklaces:
  0.50ct + any metal → €750
  1.00ct + any metal → €1190
```

**NEW Product Pricing** (product-level):
```
Each NEW product has uniform pricing across all metal colors
```

**Problem**: If both product structures are active in the catalog:
- Users see duplicate products (same jewelry, same specs, same price)
- Filters count them separately
- Product cards may show incorrect pricing if defaulting to wrong variant

---

### Issue 5: "Natural Diamond" Placeholder Variants

The OLD combined products have placeholder variants with **€0.00 price**:

```csv
rose-gold,Natural Diamond,0.00
yellow-gold,Natural Diamond,0.00
whte-gold,Natural Diamond,0.00
```

**Problem**:
- These variants should not be displayed
- They might interfere with filter counting
- Price €0.00 could trigger "Under €1,500" filter incorrectly

---

## Data Verification

### Actual CSV Data Structure

**OLD Combined Products** (2 products):
1. `timeless-diamond-earrings` - 11 variants (8 active + 3 "Natural Diamond" placeholders)
2. `timeless-diamond-necklace` - 6 variants (5 active + possibly 1 placeholder)

**NEW Separate Products** (5 products):
1. `timeless-diamond-stud-earrings-18k-gold-0-30ct` - 3 variants (one per metal)
2. `timeless-diamond-stud-earrings-18k-gold-0-50ct` - 3 variants
3. `timeless-diamond-stud-earrings-18k-gold-1-00ct` - 3 variants  
4. `timeless-diamond-necklace-18k-gold-0-50ct` - 3 variants
5. `timeless-diamond-necklace-18k-gold-1-00ct` - 3 variants

**Total**: 7 products representing the same 2 jewelry items

---

## Impact on User Experience

### 1. Confusing Filter Counts
- User sees "0.3-0.99 ct (1)" but expects to see multiple products
- User sees "1.0-1.49 ct (1)" but expects earrings AND necklaces
- Filters appear broken or inaccurate

### 2. Duplicate Products in Catalog
- Same earrings appear twice:
  - Once as combined product with carat selector
  - Once as 3 separate products per carat weight
- Clutters the catalog
- Confuses customers

### 3. Inconsistent Product Experience
- Some products have carat as a selectable option
- Other products require navigating to different product pages for different carats
- Inconsistent UX pattern

### 4. Pricing Display Issues
- Product cards may show wrong price if selecting wrong default variant
- Price changes unexpectedly when switching between variants
- "Natural Diamond" variants with €0.00 could display incorrectly

---

## Expected Behavior

### For Carat Filter Counts:

**When no filters are active**:
- 0.3-0.99 ct: Should show **5 products** (if both OLD and NEW exist) OR **2 products** (if only OLD) OR **3 products** (if only NEW)
- 1.0-1.49 ct: Should show **4 products** (if both OLD and NEW exist) OR **2 products** (if only OLD or NEW)

**When "Earrings" category is selected**:
- 0.3-0.99 ct: Should show earrings products only
- 1.0-1.49 ct: Should show earrings products only

**When "Necklaces" category is selected**:
- 0.3-0.99 ct: Should show necklaces products (if 0.3ct necklaces exist)
- 1.0-1.49 ct: Should show necklaces products only

---

## Technical Analysis

### Carat Extraction Code (diamondFilterUtils.ts)

```typescript
export function extractAllCaratWeights(product: ProcessedProduct): number[] {
  const carats = new Set<number>();

  // ✅ WORKS: Extracts from variant options (OLD structure)
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      if (variant.selectedOptions) {
        Object.values(variant.selectedOptions).forEach(value => {
          const optionMatch = String(value).match(/(\d+\.?\d*)\s*ct/i);
          if (optionMatch) {
            const val = parseFloat(optionMatch[1]);
            if (!isNaN(val) && val > 0 && val < 10) carats.add(val);
          }
        });
      }
      
      // ✅ WORKS: Extracts from variant title (backup)
      const titleMatch = variant.title?.match(/(\d+\.?\d*)\s*ct/i);
      if (titleMatch) {
        const val = parseFloat(titleMatch[1]);
        if (!isNaN(val) && val > 0 && val < 10) carats.add(val);
      }
    });
  }

  // ✅ WORKS: Extracts from product name (NEW structure)
  if (product.name) {
    const matches = product.name.matchAll(/(\d+\.?\d*)\s*ct/gi);
    for (const match of matches) {
      const carat = parseFloat(match[1]);
      if (!isNaN(carat) && carat > 0) carats.add(carat);
    }
  }

  return Array.from(carats).sort((a, b) => a - b);
}
```

**Analysis**: 
- The extraction logic is correct and comprehensive
- It successfully extracts from both OLD and NEW structures
- The issue is NOT with extraction

### Filter Count Code (useEnhancedFilterCounts.ts)

```typescript
CARAT_WEIGHTS.forEach(weight => {
  if (productMatchesCaratWeight(product, weight)) {
    counts.caratWeights[weight.label]++;  // ← Count is incremented
    availability.caratWeights.add(weight.label);
  }
});
```

**Analysis**:
- Each product is counted once per range it matches
- A product with both 0.30ct and 1.00ct variants will increment BOTH counters
- Logic appears correct

---

## Hypothesis: Why Count Shows "1"

### Hypothesis A: Only Counting One Product Type
**Possible**: The system is loading either:
- Only the OLD combined products (2 products total)
- Only the NEW separate products (5 products total)

If loading only OLD products:
- `timeless-diamond-earrings` matches 0.3-0.99 ct → COUNT: 1
- `timeless-diamond-earrings` matches 1.0-1.49 ct → COUNT: 1  
- `timeless-diamond-necklace` matches 0.3-0.99 ct → COUNT: 1 (already counted earrings)
- `timeless-diamond-necklace` matches 1.0-1.49 ct → COUNT: 1 (already counted earrings)

**Wait, this doesn't explain the count of 1 either.**

### Hypothesis B: Active Filters Excluding Products
**Possible**: Another filter is active (e.g., "Lab-Grown Diamond" or specific category) that's excluding one of the two products.

Example:
- If "Earrings" filter is active → Only counts earring products → Count: 1 per range ✅
- If "Necklaces" filter is active → Only counts necklace products → Count: 1 per range ✅

### Hypothesis C: Variant Matching Issue
**Possible**: The filter is checking if ACTIVE filters match, and one product's variants don't match.

Example:
- User selected "Yellow Gold" metal
- OLD `timeless-diamond-earrings` has yellow-gold variants → Matches
- OLD `timeless-diamond-necklace` has "white" (not "yellow-gold") for 1.00ct → Doesn't match
- Result: Count shows 1 (only earrings)

---

## Questions to Investigate

1. **Which products are actually loaded?**
   - Are both OLD and NEW products loaded from Shopify?
   - Or is only one set being imported?

2. **Are there active filters?**
   - Is there a category filter ("Earrings" or "Necklaces") pre-applied?
   - Is there a metal color filter pre-selected?

3. **Are "Natural Diamond" variants interfering?**
   - Do the €0.00 placeholder variants cause issues?
   - Should they be filtered out during data loading?

4. **Should we keep both product structures?**
   - **Option A**: Keep only OLD combined products (carat as variant option)
   - **Option B**: Keep only NEW separate products (carat in product title)
   - **Option C**: Keep both but hide one set from catalog

---

## Recommended Solutions

### Immediate Fix (Debugging)
1. Add console logging to `useEnhancedFilterCounts.ts` to see which products are being counted
2. Log which products match each carat range
3. Check if category or metal filters are pre-applied

### Short-term Fix (Data Cleanup)
1. **Choose one product structure** and remove the other from CSV:
   - **Recommended**: Keep NEW structure (separate products per carat)
   - Simpler pricing model (uniform per product)
   - Cleaner product pages
   - Easier inventory management

2. **Filter out "Natural Diamond" placeholder variants**:
   - Add validation to skip variants with price €0.00
   - Or remove them from CSV entirely

3. **Fix missing variants**:
   - Add white gold 0.50ct necklace variant
   - Add rose gold 0.30ct earring variants  
   - Ensure all combinations exist

### Long-term Fix (Architecture)
1. **Standardize product data structure** across all jewelry types
2. **Use metafields** for carat weight instead of title/variant parsing:
   ```json
   {
     "metafields": {
       "caratWeight": 0.50,
       "caratMin": 0.50,
       "caratMax": 1.00
     }
   }
   ```
3. **Implement product variant validation** during CSV import
4. **Add automated tests** for filter count accuracy

---

## Files to Investigate

1. `src/data/dimaondsbycs.csv` - Source data
2. `src/utils/diamondFilterUtils.ts` - Carat extraction logic
3. `src/hooks/useEnhancedFilterCounts.ts` - Filter count calculation
4. `src/hooks/useShopifyProducts.ts` - Product loading
5. `src/pages/ShopPage.tsx` - Filter state management
6. `src/config/filterConfig.ts` - CARAT_WEIGHTS ranges

---

## Next Steps

1. **Verify which products are loaded** in browser console
2. **Check for pre-applied filters** that might be hiding products
3. **Decide on product structure strategy** (OLD vs NEW)
4. **Clean up CSV data** to remove duplicates
5. **Test filter counts** after cleanup
6. **Document product data standards** for future additions
