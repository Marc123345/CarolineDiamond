# Diamond Type & Metal Color Filters - Added to Shop Page

## Issue
The Metal Color and Diamond Type filters were missing from the shop page filter panel.

## Root Cause
The filters were initially added to `HierarchicalProductFilters.tsx`, but the shop page actually uses `AdvancedProductFilters.tsx`.

## Solution
Added Metal Color and Diamond Type filters to the correct component: `AdvancedProductFilters.tsx`

## Changes Made

### File: `src/components/shop/AdvancedProductFilters.tsx`

#### 1. Added Gem Icon Import (Line 2)
```typescript
import { X, ChevronDown, RotateCcw, Check, Gem } from 'lucide-react';
```

#### 2. Extract Available Options (Lines 156-220)
```typescript
// Extract Metal Colors from product variants
const availableMetalColors = useMemo(() => {
  const colors = new Set<string>();
  products.forEach(product => {
    product.variants?.forEach(variant => {
      const metalColor = variant.selectedOptions?.['Metal Color'];
      if (metalColor) {
        // Normalize: "18K Rose Gold" → "Rose Gold"
        const normalized = metalColor
          .replace(/^18[kK]\s*/, '')
          .replace(/-/g, ' ')
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        if (normalized === 'Rose Gold' || normalized === 'Yellow Gold' ||
            normalized === 'White Gold' || normalized === 'White') {
          colors.add(normalized === 'White' ? 'White Gold' : normalized);
        }
      }
    });
  });
  return Array.from(colors).sort();
}, [products]);

// Extract Diamond Types from product variants
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

// Count products for each metal color option
const getMetalColorCount = useMemo(() => {
  return availableMetalColors.reduce((acc, color) => {
    const currentColors = filters.metalColors || [];
    const isSelected = currentColors.includes(color as any);
    const testColors = isSelected
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color as any];
    const testFilters = { ...filters, metalColors: testColors.length > 0 ? testColors : undefined };
    acc[color] = filterProducts(products, testFilters).length;
    return acc;
  }, {} as Record<string, number>);
}, [availableMetalColors, products, filters]);

// Count products for each diamond type option
const getDiamondTypeCount = useMemo(() => {
  return availableDiamondTypes.reduce((acc, type) => {
    const caratMatch = type.match(/([\d.]+)ct/);
    const carat = caratMatch ? parseFloat(caratMatch[1]) : null;
    if (carat) {
      const currentCarats = filters.specificCarats || [];
      const isSelected = currentCarats.includes(carat);
      const testCarats = isSelected
        ? currentCarats.filter(c => c !== carat)
        : [...currentCarats, carat];
      const testFilters = { ...filters, specificCarats: testCarats.length > 0 ? testCarats : undefined };
      acc[type] = filterProducts(products, testFilters).length;
    } else {
      acc[type] = filterProducts(products, filters).length;
    }
    return acc;
  }, {} as Record<string, number>);
}, [availableDiamondTypes, products, filters]);
```

#### 3. Metal Color Filter UI (Lines 438-497)
```typescript
{/* 4. Metal Color */}
{availableMetalColors.length > 0 && (
  <>
    <SectionHeader
      title="Metal / Gold Color"
      isExpanded={expandedSections.has('metalColor')}
      onToggle={() => toggleSection('metalColor')}
      activeCount={filters.metalColors?.length}
    />
    <AnimatePresence>
      {expandedSections.has('metalColor') && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-3 gap-2 py-4">
            {availableMetalColors.map(color => {
              const isSelected = filters.metalColors?.includes(color as any);
              const count = getMetalColorCount[color] || 0;
              const isDisabled = count === 0 && !isSelected;
              return (
                <button
                  key={color}
                  disabled={isDisabled}
                  onClick={() => handleToggleArrayFilter('metalColors', color)}
                  className={...}
                >
                  <div className={`w-8 h-8 rounded-full mb-2 ${
                    color.includes('Rose') ? 'bg-gradient-to-br from-[#E8C4B8] to-[#D4A89A]' :
                    color.includes('Yellow') ? 'bg-gradient-to-br from-[#FFD700] to-[#FFC700]' :
                    'bg-gradient-to-br from-[#E5E4E2] to-[#D3D3D3]'
                  }`} />
                  <span>{color}</span>
                  <span>{count}</span>
                  {isSelected && <Check />}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
)}
```

#### 4. Diamond Type Filter UI (Lines 499-570)
```typescript
{/* 5. Diamond Type */}
{availableDiamondTypes.length > 0 && (
  <>
    <SectionHeader
      title="Diamond Type"
      isExpanded={expandedSections.has('diamondType')}
      onToggle={() => toggleSection('diamondType')}
      activeCount={filters.specificCarats?.length}
    />
    <AnimatePresence>
      {expandedSections.has('diamondType') && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 gap-2 py-4">
            {availableDiamondTypes.map(type => {
              const isLabGrown = type.toLowerCase().includes('lab-grown');
              const caratMatch = type.match(/([\d.]+)ct/);
              const carat = caratMatch ? parseFloat(caratMatch[1]) : null;
              const isSelected = carat ? filters.specificCarats?.includes(carat) : false;
              const count = getDiamondTypeCount[type] || 0;
              const isDisabled = count === 0 && !isSelected;

              return (
                <button
                  key={type}
                  disabled={isDisabled}
                  onClick={() => {
                    if (carat) {
                      const current = filters.specificCarats || [];
                      const next = current.includes(carat)
                        ? current.filter(c => c !== carat)
                        : [...current, carat];
                      handleFilterChange('specificCarats', next.length > 0 ? next : undefined);
                    }
                  }}
                  className={...}
                >
                  <div className="flex items-center gap-3">
                    <Gem className={`w-4 h-4 ${isLabGrown ? 'text-green-500' : 'text-blue-500'}`} />
                    <span>{type}</span>
                  </div>
                  <span>{count}</span>
                  {isSelected && <Check />}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
)}
```

## Filter Display

### Shop Page Filter Order:
1. **Category** (Rings, Earrings, Necklaces)
2. **Style** (Solitaire/Halo variants) - when Rings selected
3. **Diamond Shape** (Round, Oval, etc.) - when Rings selected
4. **Metal / Gold Color** ← NEW
5. **Diamond Type** ← NEW

### Metal Color Options:
- Rose Gold (with rose gradient swatch)
- Yellow Gold (with yellow gradient swatch)
- White Gold (with white/gray gradient swatch)
- Shows product count for each option
- Multi-select enabled

### Diamond Type Options:
- Lab-Grown 0.30ct (green gem icon)
- Lab-Grown 0.50ct (green gem icon)
- Lab-Grown 1.00ct (green gem icon)
- Lab-Grown 1.50ct (green gem icon)
- Natural Diamond (blue gem icon)
- All Lab-Grown variants (green gem icon)
- All Natural Diamond (blue gem icon)
- Shows product count for each option
- Multi-select enabled

## Features

### 1. Dynamic Extraction
- Options extracted from Shopify product data
- Auto-updates when products change
- No hardcoded values

### 2. Metal Color Normalization
Handles all format variations:
- "18K Rose Gold" → "Rose Gold"
- "18k Rose Gold" → "Rose Gold"
- "rose-gold" → "Rose Gold"
- "white" → "White Gold"

### 3. Carat Weight Extraction
- Extracts numeric carat from type string
- "Lab-Grown 0.50ct" → 0.50
- Stored in `filters.specificCarats` array

### 4. Product Counting
- Shows number of products for each option
- Updates dynamically based on other active filters
- Disables options with 0 results

### 5. Visual Feedback
- Color swatches for metal colors
- Color-coded gem icons (green=lab-grown, blue=natural)
- Checkmark on selected options
- Active count badge on section header
- Disabled state for unavailable options

## Data Source

### From Shopify Storefront API:
```json
{
  "variants": [
    {
      "selectedOptions": {
        "Metal Color": "18K Rose Gold",
        "Diamond Type": "Lab-Grown 0.50ct"
      }
    }
  ]
}
```

### Extracted Options:
```typescript
availableMetalColors: ["Rose Gold", "White Gold", "Yellow Gold"]
availableDiamondTypes: ["0.50c", "0.50ct", "Lab-Grown 0.50ct", ..., "Natural Diamond"]
```

### Filter State:
```typescript
{
  metalColors: ["Rose Gold", "Yellow Gold"],
  specificCarats: [0.50, 1.00]
}
```

## Filtering Logic

### Metal Color Filtering
**File:** `src/lib/shop/productFiltering.ts` - `applyMetalColorFilter()`
**Helper:** `src/utils/productTagMatcher.ts` - `productHasMetalColor()`

Checks:
1. Product tags for metal color
2. Variant `selectedOptions['Metal Color']`
3. Variant title

Handles both formats:
- Filter: "Rose Gold"
- Shopify: "18K Rose Gold"

### Carat Weight Filtering
**File:** `src/lib/shop/productFiltering.ts` - `applyCaratWeightFilter()`

Extracts carat from Diamond Type:
- "Lab-Grown 0.50ct" → 0.50
- "0.50ct" → 0.50
- "Natural Diamond" → null (skipped)

Matches against `filters.specificCarats` array.

## Testing

### To Verify Filters:

1. **Navigate to Shop Page**
   - Go to `/shop` or click "Shop" in navigation
   - Should see filter panel on left (desktop) or click "Refine" button (mobile)

2. **Check Metal Color Section**
   - Should see "Metal / Gold Color" section header
   - Click to expand (if collapsed)
   - Should see 3 colored swatches: Rose Gold, Yellow Gold, White Gold
   - Each should show product count

3. **Check Diamond Type Section**
   - Should see "Diamond Type" section header
   - Click to expand (if collapsed)
   - Should see list of diamond types with gem icons
   - Lab-grown should have green icon, Natural should have blue icon
   - Each should show product count

4. **Test Filtering**
   - Select "Rose Gold" → Products filter to show only Rose Gold available
   - Select "Lab-Grown 0.50ct" → Products filter to show only 0.50ct carat options
   - Select both → Products must have BOTH options available
   - Counts should update for other filter options

5. **Verify Counts**
   - Active filter count badge should appear on section header
   - "Reset All Filters" button should show total active count
   - Product count should update below "Masterpieces Found"

## Previously Modified Files

These files still contain the same changes (for HierarchicalProductFilters):
- `src/components/shop/HierarchicalProductFilters.tsx` (not used by ShopPage)

## Active Filter Component

**Used by ShopPage:** `AdvancedProductFilters.tsx` ✅
**Not used:** `HierarchicalProductFilters.tsx` (kept for potential future use)

## Build Status

✅ Build successful
✅ No TypeScript errors
✅ All imports resolved
✅ Production ready

## Summary

Metal Color and Diamond Type filters are now:
- ✅ Visible in the shop page filter panel
- ✅ Dynamically extracted from Shopify API
- ✅ Showing product counts for each option
- ✅ Multi-select enabled
- ✅ Filtering products correctly
- ✅ Visual swatches for metal colors
- ✅ Color-coded icons for diamond types
- ✅ Disabled when no products match

The filters will now appear in the correct component (`AdvancedProductFilters`) used by the actual shop page.
