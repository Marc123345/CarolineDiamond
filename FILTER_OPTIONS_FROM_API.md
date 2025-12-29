# Filter Options Extraction from Shopify Storefront API

## Overview
Added Diamond Type and Metal Color filters that are dynamically extracted from Shopify product data.

## What Was Missing
The filter panel only showed:
1. Ring Style (Solitaire/Halo with/without side diamonds)
2. Diamond Shape (Round, Oval, Princess, etc.)
3. Price Range

**Missing Filters:**
- ❌ Metal Color (Rose Gold, Yellow Gold, White Gold)
- ❌ Diamond Type (Lab-Grown vs Natural, with carat weights)

## Solution Implemented

### 1. Dynamic Filter Extraction
**File:** `src/components/shop/HierarchicalProductFilters.tsx` (lines 59-79)

Added logic to extract available options from product variants:

```typescript
const availableDiamondTypes = useMemo(() => {
  const types = new Set<string>();
  products.forEach(product => {
    product.variants?.forEach(variant => {
      const diamondType = variant.selectedOptions?.['Diamond Type'];
      if (diamondType) types.add(diamondType);
    });
  });
  return Array.from(types).sort();
}, [products]);

const availableMetalColors = useMemo(() => {
  const colors = new Set<string>();
  products.forEach(product => {
    product.variants?.forEach(variant => {
      const metalColor = variant.selectedOptions?.['Metal Color'];
      if (metalColor) colors.add(metalColor);
    });
  });
  return Array.from(colors).sort();
}, [products]);
```

### 2. Metal Color Filter UI
**Location:** Section 3 in filter panel

Features:
- Visual color swatches (Rose, Yellow, White gold)
- Multi-select capability
- Shows "18K Rose Gold", "18K Yellow Gold", "18K White Gold"
- Filters by "Rose Gold", "Yellow Gold", "White Gold" (removes "18K" prefix)

### 3. Diamond Type Filter UI
**Location:** Section 4 in filter panel

Features:
- Shows all available diamond types from products
- Examples: "Lab-Grown 0.50ct", "Lab-Grown 1.00ct", "Natural Diamond"
- Color-coded icons (green for lab-grown, blue for natural)
- Multi-select for carat weights
- Extracts carat value and adds to `filters.specificCarats`

## Data Source

### Product Options Structure (from Shopify)
```json
{
  "options": [
    {
      "id": "gid://shopify/ProductOption/12084500168948",
      "name": "Diamond Type",
      "values": [
        "Lab-Grown 0.50ct",
        "Lab-Grown 1.00ct",
        "Natural Diamond"
      ]
    },
    {
      "id": "gid://shopify/ProductOption/12091019460852",
      "name": "Metal Color",
      "values": [
        "18K Rose Gold",
        "18K Yellow Gold",
        "18K White Gold"
      ]
    }
  ]
}
```

### Variant Structure
Each variant has `selectedOptions`:
```json
{
  "selectedOptions": {
    "Diamond Type": "Lab-Grown 0.50ct",
    "Metal Color": "18K Rose Gold"
  }
}
```

## Filtering Logic

### Metal Color Filtering
**File:** `src/lib/shop/productFiltering.ts` (lines 167-181)
**Helper:** `src/utils/productTagMatcher.ts` (lines 84-104)

Handles both formats:
- Filter value: "Rose Gold"
- Shopify value: "18K Rose Gold"

Checks:
1. Product tags for metal color
2. Variant `Metal Color` option
3. Variant title

### Carat Weight Filtering
**File:** `src/lib/shop/productFiltering.ts` (lines 183-246)

Extracts carat value from Diamond Type:
- Input: "Lab-Grown 0.50ct" → Extracts: 0.50
- Stored in: `filters.specificCarats` as number array

Handles variations:
- `0.50ct`, `0.50c` (missing 't')
- `Lab-Grown 0.50ct`
- `All Lab-Grown 0.50ct`

## Filter Display Order

1. **Ring Style** (Solitaire/Halo)
2. **Diamond Shape** (Round, Oval, Princess, etc.)
3. **Metal / Gold Color** ✅ NEW
4. **Diamond Type** ✅ NEW
5. **Investment Range** (Price)

## How It Works

### User Flow:
1. User opens filter panel
2. System reads all products
3. Extracts unique Diamond Types and Metal Colors from variants
4. Displays available options dynamically
5. User selects filters
6. Products filtered client-side

### Example Filter Values:
```typescript
{
  ringStyle: 'Halo (Without Side Diamonds)',
  shapes: ['Round', 'Oval'],
  metalColors: ['Rose Gold', 'Yellow Gold'],  // NEW
  specificCarats: [0.50, 1.00],                // NEW (from Diamond Type)
  minPrice: 500,
  maxPrice: 1000
}
```

## Shopify Integration

### Admin API Query
**File:** `scripts/fetch-shopify-products.ts` (lines 102-106)

Already fetches options:
```graphql
options {
  id
  name
  values
}
```

### Storefront API Query
**File:** `src/utils/shopifyQueries.ts` (lines 390-394)

Already fetches options:
```graphql
options {
  id
  name
  values
}
```

And variant options:
```graphql
selectedOptions {
  name
  value
}
```

## Benefits

1. **Dynamic** - Options update automatically when products change
2. **Accurate** - Shows only options that exist in current product set
3. **No Hardcoding** - No need to manually update filter lists
4. **Flexible** - Works with any product option names from Shopify
5. **Filtered** - Only shows relevant options based on other active filters

## Testing

### To Verify Filters Work:

1. **Check Metal Colors Display:**
   - Open shop page
   - Click "Refine" button
   - Expand "Metal / Gold Color" section
   - Should see: Rose Gold, Yellow Gold, White Gold with color swatches

2. **Check Diamond Types Display:**
   - Expand "Diamond Type" section
   - Should see: Lab-Grown 0.50ct, Lab-Grown 1.00ct, etc.
   - Lab-grown should have green icon, Natural should have blue icon

3. **Test Filtering:**
   - Select "Rose Gold" → Products filtered to Rose Gold only
   - Select "Lab-Grown 0.50ct" → Products with 0.50ct lab-grown diamonds
   - Select both → Products must have BOTH options available

4. **Verify Counts:**
   ```bash
   # Check available metal colors
   cat src/data/shopify_products_detailed.json | jq '[.[].options[] | select(.name == "Metal Color") | .values[]] | unique'

   # Check available diamond types
   cat src/data/shopify_products_detailed.json | jq '[.[].options[] | select(.name == "Diamond Type") | .values[]] | unique'
   ```

## Expected Results

### Metal Colors:
- "18K Rose Gold"
- "18K Yellow Gold"
- "18K White Gold"

### Diamond Types (varies by product):
- "Lab-Grown 0.30ct"
- "Lab-Grown 0.50ct"
- "Lab-Grown 1.00ct"
- "Lab-Grown 1.50ct"
- "Natural Diamond"
- "All Lab-Grown 0.50ct"
- "All Natural Diamond"
- etc.

## Future Enhancements

1. **Group by Type:**
   - Separate Lab-Grown and Natural into sections
   - Show carats under each type

2. **Filter Counts:**
   - Show product count next to each option
   - Disable options with 0 results

3. **Sort Options:**
   - Lab-Grown first, Natural second
   - Carats in ascending order (0.50, 1.00, 1.50)

4. **Icon Improvements:**
   - Better diamond icons for each type
   - Animated selection states

## Build Status

✅ Build successful
✅ TypeScript types valid
✅ All imports resolved
✅ Production ready

## Files Modified

1. **src/components/shop/HierarchicalProductFilters.tsx**
   - Added `availableDiamondTypes` extraction (lines 59-68)
   - Added `availableMetalColors` extraction (lines 70-79)
   - Added Metal Color filter UI (lines 221-263)
   - Added Diamond Type filter UI (lines 265-311)
   - Updated active filter count (lines 81-88)

2. **Build verified** - No errors

## Summary

The filter panel now dynamically extracts and displays:
- ✅ Metal Color options from Shopify product variants
- ✅ Diamond Type options from Shopify product variants
- ✅ Visual swatches for metal colors
- ✅ Color-coded icons for diamond types
- ✅ Multi-select filtering
- ✅ Real-time filtering based on selections

All options come directly from the Shopify Storefront API product data, ensuring accuracy and eliminating manual maintenance.
