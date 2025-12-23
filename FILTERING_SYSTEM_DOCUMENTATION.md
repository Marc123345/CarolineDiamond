# Product Filtering System Documentation

## Overview
This document explains how the product filtering system works based on the actual Shopify CSV data structure.

## Data Structure (from CSV)

### Product Tags
Tags are the primary filtering mechanism. Examples from CSV:
- **Carat Weight**: `0.30ct`, `0.50ct`, `1.00ct`, `1.50ct`
- **Metal**: `18K Gold`, `Yellow Gold`, `White Gold`, `Rose Gold`
- **Category**: `Engagement Ring`, `Earrings`, `Necklace`
- **Diamond Type**: `Lab-Grown Diamond`
- **Diamond Shape**: `Round`, `Oval`, `Princess`, `Emerald`, `Pear`, `Marquise`, `Cushion` (also as `shape:round`, etc.)
- **Ring Style**: `Solitaire`, `Halo`, `Side Diamonds`, `No Side Diamonds`
- **Clarity**: `D-VS2` (appears in descriptions)
- **Certification**: `GIA`, `HRD`, `IGI` (appears in descriptions)

### Product Variants
Variants represent different metal colors for the same product:
- **Option Name**: "Metal Color" or "Color"
- **Option Values**: "Yellow Gold", "White Gold", "Rose Gold"
- **Each variant has its own**:
  - Price
  - SKU
  - Image
  - Availability

## Filter Implementation

### 1. Category Filter
**Available Options**: Rings, Earrings, Necklaces

**Tag Matching**:
- **Rings**: Looks for tags: `Engagement Ring`, `Ring`, `Rings`, `Solitaire Ring`, `Halo Ring`
- **Earrings**: Looks for tags: `Earrings`, `Earring`, `Studs`, `Diamond Earrings`
- **Necklaces**: Looks for tags: `Necklace`, `Necklaces`, `Pendant`, `Diamond Necklace`

**Implementation**: `src/utils/categoryHelpers.ts`

### 2. Carat Weight Filter
**Available Options**:
- 0.30 Carat (Earrings only)
- 0.50 Carat (All categories)
- 1.00 Carat (All categories)
- 1.50 Carat (Engagement Rings only)

**Tag Matching**:
Exact match against tags: `0.30ct`, `0.50ct`, `1.00ct`, `1.50ct`

**Implementation**: `src/utils/diamondFilterUtils.ts` → `extractCaratWeight()`

**Example**:
```typescript
// Product tag: "0.50ct"
// Filter selects: 0.50 Carat
// Result: MATCH ✓
```

### 3. Metal Color Filter
**Available Options**: 18K Yellow Gold, 18K White Gold, 18K Rose Gold

**Matching Strategy**:
1. Check variant `selectedOptions` for "Metal Color" or "Color"
2. Check product tags for metal color keywords
3. Pattern matching against variations: `yellow-gold`, `white`, `rose-gold`

**Implementation**: `src/utils/metalColorUtils.ts`

**Example from CSV**:
```
Product: "18K Gold Lab-Grown Diamond Solitaire Ring - 1.50ct"
Variant 1: Metal Color = "Yellow Gold", Price = €1250
Variant 2: Metal Color = "White Gold", Price = €1250
Variant 3: Metal Color = "Rose Gold", Price = €1250
```

### 4. Diamond Shape Filter
**Available Options**: Round, Oval, Princess, Pear, Marquise, Emerald, Cushion, Heart

**Tag Matching**:
- Explicit format: `shape:round`, `shape:oval`, etc.
- Direct tag: `Round`, `Oval`, `Princess`, etc.

**Implementation**: `src/utils/shapeUtils.ts` → `productMatchesShape()`

**Shape Availability by Ring Style**:
- **Solitaire**: Round, Oval, Princess, Pear, Marquise, Emerald
- **Solitaire + Side Diamonds**: Round, Oval, Princess, Pear, Marquise, Emerald
- **Halo**: Round, Oval, Princess, Pear, Marquise, Emerald, Cushion
- **Halo + Side Diamonds**: Round, Oval, Princess, Pear, Marquise, Emerald, Cushion

### 5. Ring Style Filter
**Available Options**:
- Solitaire (No Side Diamonds)
- Solitaire + Side Diamonds
- Halo (No Side Diamonds)
- Halo + Side Diamonds

**Tag Matching**:
- `Solitaire`, `collection:solitaire`, `No Side Diamonds`
- `Halo`, `collection:halo`
- `Side Diamonds` for variants with side stones

**Implementation**: Tags in CSV use both explicit names and collection prefixes

### 6. Diamond Type Filter
**Available Options**: Lab-Grown Diamond, Natural Diamond

**Tag Matching**:
- Lab-Grown: `Lab-Grown Diamond`, `Lab Grown`, `Lab Diamond`
- Natural: `Natural Diamond`, `Natural`, `Mined Diamond`

**Default**: All current products in CSV are Lab-Grown

### 7. Price Range Filter
**Ranges**:
- Under €500
- €500 - €750
- €750 - €1,000
- €1,000 - €1,500
- €1,500+

**CSV Price Examples**:
- Earrings 0.30ct: €490
- Earrings 0.50ct: €590
- Earrings 1.00ct: €890
- Necklace 0.50ct: €750
- Necklace 1.00ct: €1,190
- Solitaire Ring 0.50ct: €790
- Solitaire Ring 1.00ct: €990
- Solitaire Ring 1.50ct: €1,250

### 8. Clarity Grade Filter
**Available Options**: FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3

**CSV Format**: `D-VS2` (D = color grade, VS2 = clarity grade)

**Matching**:
- Tags: `D-VS2`, `VS2`
- Description text containing clarity notation

**Implementation**: `src/utils/diamondFilterUtils.ts` → `extractClarityGrade()`

### 9. Certification Filter
**Available Options**: GIA, HRD, IGI

**CSV Location**: Product descriptions contain certification references

**Example**:
```
"• Center Stone: 1.00 carat IGI/GIA/HRD-certified lab-grown diamond (D–VS2)"
```

**Implementation**: Searches descriptions and tags for certification mentions

## Filter Combination Logic

### Client-Side Filters
Applied after Shopify query returns results:
- Category (for accurate matching)
- Shape (using both tags and variants)
- Metal Color (using variant data)
- Carat Weight (exact tag matching)
- Clarity Grade
- Certification
- In Stock Only
- Ring Sizes

### Shopify Query Filters
Built into GraphQL query:
- Search text
- Price range
- General tag matching

## Performance Optimizations

### Caching
- Shape extraction results are cached per product ID
- Metal color extraction results are cached
- Filter counts are memoized during a single filter session

### Parallel Filtering
Multiple independent filters can be checked simultaneously using Set operations

### Debouncing
Filter changes are debounced (150ms) to prevent excessive re-renders

## Testing Filter Logic

### Test a Specific Product

```typescript
import { extractCaratWeight } from './utils/diamondFilterUtils';
import { productMatchesShape } from './utils/shapeUtils';
import { productMatchesMetalColor } from './utils/metalColorUtils';

// Test product from CSV
const product = {
  id: 'test-id',
  name: '18K Gold Lab-Grown Diamond Solitaire Ring - 1.50ct',
  tags: ['1.50ct', '18K Gold', 'Engagement Ring', 'Lab-Grown Diamond', 'Round', 'shape:round', 'Solitaire'],
  variants: [
    { selectedOptions: { 'Metal Color': 'Yellow Gold' }, price: 1250 },
    { selectedOptions: { 'Metal Color': 'White Gold' }, price: 1250 },
  ]
};

// Test filters
console.log('Carat:', extractCaratWeight(product)); // Should return 1.5
console.log('Is Round?', productMatchesShape(product, 'Round')); // Should return true
console.log('Is Yellow Gold?', productMatchesMetalColor(product, 'Yellow Gold')); // Should return true
```

## Common Issues & Solutions

### Issue 1: Product Not Appearing in Category Filter
**Solution**: Check that product has the exact category tag from CSV:
- Use `Engagement Ring` not `Ring` for engagement rings
- Use `Earrings` (plural) for earring products
- Use `Necklace` (singular) for necklace products

### Issue 2: Carat Weight Not Matching
**Solution**: Ensure tags use exact format: `0.30ct`, `0.50ct`, `1.00ct`, `1.50ct`

### Issue 3: Metal Color Not Filtering
**Solution**: Check that variants have `selectedOptions` with "Metal Color" or "Color" key

### Issue 4: Shape Not Filtering
**Solution**: Ensure products have both explicit shape tag AND `shape:` prefixed tag

## File Reference

- **Filter Configuration**: `src/config/filterConfig.ts`
- **Category Matching**: `src/utils/categoryHelpers.ts`
- **Shape Matching**: `src/utils/shapeUtils.ts`
- **Metal Color Matching**: `src/utils/metalColorUtils.ts`
- **Diamond Filters**: `src/utils/diamondFilterUtils.ts`
- **Price Helpers**: `src/utils/priceHelpers.ts`
- **Main Shop Page**: `src/pages/ShopPage.tsx`

## CSV Data Validation Checklist

Before importing products, ensure:
- [ ] Category tags are consistent: "Engagement Ring", "Earrings", "Necklace"
- [ ] Carat tags use exact format: "0.30ct", "0.50ct", "1.00ct", "1.50ct"
- [ ] Shape tags include both formats: "Round" AND "shape:round"
- [ ] Ring style tags are clear: "Solitaire", "Halo", "Side Diamonds"
- [ ] All variants have "Metal Color" option defined
- [ ] Clarity mentioned in description as "D-VS2" format
- [ ] Certification (GIA/HRD/IGI) mentioned in description
