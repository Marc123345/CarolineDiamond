# Variant-Based Metal Color and Carat Weight Filters

## Overview
Re-implemented Metal Color and Carat Weight filters to read from product variant options instead of tags, providing accurate counts based on actual variant availability.

## Implementation Date
December 30, 2025

---

## What Was Changed

### 1. New Utility Module: `src/utils/variantFilterUtils.ts`

Created comprehensive utilities for variant-based filtering:

#### Core Functions
- **`extractMetalColorsFromVariants(products)`** - Extracts all unique metal colors from product.options
- **`extractCaratWeightsFromVariants(products)`** - Extracts all carat weights from product.options
- **`standardizeMetalColor(value)`** - Normalizes metal colors to "18K Rose Gold" format
- **`standardizeCaratWeight(value)`** - Normalizes carat weights (e.g., "Lab-Grown 0.50ct", "Natural Diamond")
- **`productHasMetalColor(product, metalColor)`** - Checks if product has specific metal color variant
- **`productHasCaratWeight(product, caratWeight)`** - Checks if product has specific carat weight variant

#### Features
- Handles inconsistent naming (e.g., "0.50c" → "Lab-Grown 0.50ct")
- Standardizes to "18K Rose Gold", "18K Yellow Gold", "18K White Gold" format
- Properly sorts carat weights (lab-grown ascending, natural diamond last)

---

### 2. Updated `src/config/filterConfig.ts`

Added new filter properties to `ProductFilters` interface:

```typescript
export interface ProductFilters {
  // ... existing filters ...

  // NEW: Variant-based filters (read from product.options, not tags)
  variantMetalColors?: string[];      // e.g., ['18K Rose Gold', '18K Yellow Gold']
  variantCaratWeights?: string[];     // e.g., ['Lab-Grown 0.50ct', 'Natural Diamond']

  // ... rest of filters ...
}
```

These work independently from legacy tag-based filters.

---

### 3. Enhanced `src/components/shop/AdvancedProductFilters.tsx`

#### New Filter Sections Added

**Metal Color Filter (Section 4)**
- Reads from `product.options` array looking for "Metal Color" option
- Shows accurate counts based on available variants
- Multi-select support
- Cascades with other filters (counts update when shape/style selected)
- Display format: "18K Rose Gold", "18K Yellow Gold", "18K White Gold"

**Carat Weight Filter (Section 5)**
- Reads from `product.options` array looking for "Diamond Type" option
- Shows accurate counts based on available variants
- Multi-select support
- Cascades with metal color filter
- Display format:
  - "Lab-Grown 0.30ct"
  - "Lab-Grown 0.50ct"
  - "Lab-Grown 1.00ct"
  - "Lab-Grown 1.50ct"
  - "Natural Diamond (Price on Request)"

#### Smart Counting Logic
```typescript
// Metal color counts respect existing filters
const metalColorCounts = useMemo(() => {
  return availableMetalColors.map(metalColor => {
    const count = products.filter(p => {
      const matchCategory = !filters.jewelryCategory || getJewelryCategory(p) === filters.jewelryCategory;
      const matchStyle = !filters.ringStyle || getRingStyle(p) === filters.ringStyle;
      const matchShape = !filters.shapes?.length || /* shape logic */;
      const hasMetalColor = productHasMetalColor(p, metalColor);

      return matchCategory && matchStyle && matchShape && hasMetalColor;
    }).length;
    // ...
  });
}, [availableMetalColors, products, filters]);

// Carat weight counts respect metal color selections
const caratWeightCounts = useMemo(() => {
  return availableCaratWeights.map(caratWeight => {
    const count = products.filter(p => {
      // ... category, style, shape filters ...

      const matchMetalColor = !filters.variantMetalColors?.length ||
        filters.variantMetalColors.some(mc => productHasMetalColor(p, mc));

      const hasCaratWeight = productHasCaratWeight(p, caratWeight);

      return /* ... */ && matchMetalColor && hasCaratWeight;
    }).length;
    // ...
  });
}, [availableCaratWeights, products, filters]);
```

---

### 4. Updated `src/pages/ShopPage.tsx`

Added client-side filtering for variant-based filters:

```typescript
// Apply variant-based metal color filter
if (filterManager.filters.variantMetalColors?.length > 0) {
  result = result.filter(product => {
    return filterManager.filters.variantMetalColors!.some(metalColor =>
      productHasMetalColor(product, metalColor)
    );
  });
}

// Apply variant-based carat weight filter
if (filterManager.filters.variantCaratWeights?.length > 0) {
  result = result.filter(product => {
    return filterManager.filters.variantCaratWeights!.some(caratWeight =>
      productHasCaratWeight(product, caratWeight)
    );
  });
}
```

Added to useMemo dependencies:
- `filterManager.filters.variantMetalColors`
- `filterManager.filters.variantCaratWeights`

---

### 5. Updated `src/components/ActiveFilterChips.tsx`

Added chips for displaying active variant-based filters:

```typescript
{filters.variantMetalColors?.map(color =>
  <React.Fragment key={`variant-metal-${color}`}>
    {renderChip(color, () => {
      const updated = filters.variantMetalColors?.filter(c => c !== color);
      onRemoveFilter('variantMetalColors', updated);
    })}
  </React.Fragment>
)}

{filters.variantCaratWeights?.map(weight =>
  <React.Fragment key={`variant-carat-${weight}`}>
    {renderChip(weight, () => {
      const updated = filters.variantCaratWeights?.filter(w => w !== weight);
      onRemoveFilter('variantCaratWeights', updated);
    })}
  </React.Fragment>
)}
```

---

## How It Works

### Data Flow

1. **Product Loading** → ShopPage fetches all products from Shopify
2. **Variant Extraction** → `extractMetalColorsFromVariants()` scans `product.options` for "Metal Color"
3. **Standardization** → Names normalized to consistent format ("18K Rose Gold")
4. **Count Calculation** → Counts products that have each variant option
5. **Filter Application** → Client-side filtering checks if product has selected variant
6. **Display** → Shows accurate counts and filtered results

### Example Product Structure

```json
{
  "id": "product-123",
  "title": "Solitaire Engagement Ring - Round",
  "options": [
    {
      "id": "opt-1",
      "name": "Metal Color",
      "values": ["Rose Gold", "Yellow Gold", "White Gold"]
    },
    {
      "id": "opt-2",
      "name": "Diamond Type",
      "values": ["Lab-Grown 0.50ct", "Lab-Grown 1.00ct", "Natural Diamond"]
    }
  ],
  "variants": [
    {
      "id": "var-1",
      "selectedOptions": {
        "Metal Color": "Rose Gold",
        "Diamond Type": "Lab-Grown 0.50ct"
      }
    }
    // ... more variants
  ]
}
```

### Filter Matching Logic

When user selects "18K Rose Gold":
1. System looks at `product.options` array
2. Finds "Metal Color" option
3. Checks if "Rose Gold" is in `values` array
4. Standardizes to "18K Rose Gold"
5. Product is included if match found

---

## Benefits

### ✅ Accuracy
- Counts based on actual variant availability
- No more discrepancies between tags and variants
- Users see exactly what's available

### ✅ Performance
- Client-side filtering is fast
- Counts calculated in useMemo for efficiency
- Cascading filters update smoothly

### ✅ Maintainability
- Single source of truth: `product.options`
- No need to maintain separate tag mappings
- Shopify manages variant options

### ✅ User Experience
- Multi-select support for both filters
- Real-time count updates
- Clear visual feedback with chips
- Disabled states for unavailable options

---

## Testing Checklist

- [x] Build succeeds without errors
- [x] Filters appear in AdvancedProductFilters component
- [x] Metal Color filter shows accurate counts
- [x] Carat Weight filter shows accurate counts
- [x] Multi-select works for both filters
- [x] Counts update when other filters change (cascading)
- [x] ActiveFilterChips display selected filters
- [x] Removing chips works correctly
- [x] Client-side filtering applies correctly
- [x] No TypeScript errors

---

## Future Enhancements

Potential improvements for future iterations:

1. **Ring Size Filter** - Apply same variant-based approach
2. **URL Persistence** - Add metal color and carat weight to URL params
3. **Saved Searches** - Include variant filters in saved filter presets
4. **Analytics** - Track which variant combinations are most popular
5. **Visual Swatches** - Show color swatches for metal colors

---

## Files Modified

1. ✅ Created: `src/utils/variantFilterUtils.ts`
2. ✅ Updated: `src/config/filterConfig.ts`
3. ✅ Updated: `src/components/shop/AdvancedProductFilters.tsx`
4. ✅ Updated: `src/pages/ShopPage.tsx`
5. ✅ Updated: `src/components/ActiveFilterChips.tsx`
6. ✅ Updated: `src/utils/shopifyHelpers.ts` - Fixed options extraction

---

## Bug Fix: Options Array Extraction

### Issue
Products loaded from the local JSON file (`shopify_products_detailed.json`) did not have an `options` array, causing filter counts to show "0" even when products were available.

### Root Cause
The GraphQL query fetches the `options` field when calling Shopify API, but the local JSON file was missing this field. The `transformShopifyProduct` function was attempting to access `product.options` without fallback logic.

### Solution
Updated `transformShopifyProduct` in `src/utils/shopifyHelpers.ts` to build the `options` array from variant data when not provided:

```typescript
// Build options array from product.options if available, otherwise from variants
let options: Array<{ id: string; name: string; values: string[] }> = [];

if (product.options && product.options.length > 0) {
  options = product.options.map(opt => ({
    id: opt.id,
    name: opt.name,
    values: opt.values
  }));
} else {
  // Build options from variants if not provided
  const optionsMap = new Map<string, Set<string>>();

  product.variants.edges.forEach(edge => {
    edge.node.selectedOptions.forEach(opt => {
      if (!optionsMap.has(opt.name)) {
        optionsMap.set(opt.name, new Set());
      }
      optionsMap.get(opt.name)!.add(opt.value);
    });
  });

  options = Array.from(optionsMap.entries()).map(([name, values], index) => ({
    id: `${product.id}-option-${index}`,
    name,
    values: Array.from(values)
  }));
}
```

This ensures that:
1. If `product.options` exists (from GraphQL), use it directly
2. If `product.options` is missing (from JSON file), build it from `variants.edges[].node.selectedOptions`
3. All products now have a consistent `options` array structure

---

## Migration Notes

### For Developers

The new variant-based filters (`variantMetalColors`, `variantCaratWeights`) work alongside legacy filters:

- **Old**: `filters.metalColors` (tag-based)
- **New**: `filters.variantMetalColors` (variant-based)

Both can coexist during transition period. Legacy filters can be phased out once all products have proper variant options configured.

### For Content Managers

Ensure products have these options configured in Shopify:

1. **Metal Color** option with values:
   - Rose Gold
   - Yellow Gold
   - White Gold

2. **Diamond Type** option with values:
   - Lab-Grown 0.30ct
   - Lab-Grown 0.50ct
   - Lab-Grown 1.00ct
   - Lab-Grown 1.50ct
   - Natural Diamond

The system will standardize these to display format automatically.

---

## Summary

Successfully implemented variant-based filtering for Metal Color and Carat Weight, providing users with accurate product counts based on actual variant availability. The filters integrate seamlessly with existing filter system and provide a superior user experience with real-time count updates and proper cascading behavior.
