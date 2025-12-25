# Product Filter System

## Overview

The product filter system is designed with a specific hierarchy to optimize perceived simplicity and user experience. The order of filters has been carefully chosen based on UX best practices and follows a progressive disclosure pattern.

## ✅ IMPLEMENTED Filter Display Order

Filters are presented in the following order for optimal user experience:

1. **Ring Style** - Solitaire, Halo (with or without side diamonds) ✓
2. **Diamond Shape** - Round, Oval, Princess, Pear, etc. (shown after Ring Style selected) ✓
3. **Metal / Gold Color** - 18K White, Rose, or Yellow Gold ✓
4. **Diamond Type** - Natural Diamond vs Lab-Grown (Synthetisch) ✓
5. **Carat Weight** - 0.50ct, 1.00ct, 1.50ct, 2.00ct (shown after Diamond Type selected) ✓
6. **Price Range** - Under €1,500, €1,500-€3,000, €3,000-€5,000, Over €5,000 ✓
7. **Side Diamonds on Band** - With/Without additional diamonds (shown for applicable styles) ✓

**All filters are now live on the frontend and follow the recommended UX order!**

## Filter Hierarchy and Dependencies

### Ring Style (Primary Filter)
- **Options**: Solitaire, Solitaire + Side Diamonds, Halo, Halo + Side Diamonds
- **Affects**: Available diamond shapes
- **Category**: Rings only

### Diamond Shape (Dependent on Ring Style)
- **Available Shapes**:
  - Solitaire: Round, Oval, Princess, Pear, Marquise, Emerald, Heart
  - Halo: Round, Oval, Princess, Pear, Marquise, Emerald, Cushion, Heart
- **Multi-select**: Yes
- **Category**: Rings only

### Metal / Gold Color
- **Options**: 18K White Gold, 18K Rose Gold, 18K Yellow Gold
- **Multi-select**: Yes
- **Available for**: All jewelry categories

### Diamond Type (Natural vs Lab-Grown)
- **Options**:
  - Natural Diamond
  - Lab-Grown Diamond (Synthetisch)
- **SEO Terms**: "synthetisch" included for Dutch market search optimization
- **Certification**: All diamonds come with GIA, HRD, or IGI certification

### Carat Weight (Dependent on Diamond Type)
- **Lab-Grown Available Carats**: 0.50ct, 1.00ct, 1.50ct
- **Natural Diamond Available Carats**: 0.50ct, 1.00ct, 1.50ct, 2.00ct+
- **Multi-select**: Yes
- **Pricing**:
  - Lab-Grown 0.50ct: €790
  - Lab-Grown 1.00ct: €990
  - Lab-Grown 1.50ct: €1,250
  - Natural Diamond: Starting at €3,000

### Price Range
- **Options**:
  - Under €1,500
  - €1,500 - €3,000
  - €3,000 - €5,000
  - Over €5,000
- **Single-select**: Yes

### Side Diamonds on Band
- **Options**: With Side Diamonds / Without Side Diamonds
- **Category**: Rings only
- **Dependent on**: Ring Style selection

## Implementation Details

### Database Integration

The filter system integrates with the Supabase product catalog:
- `ring_models` table stores available models and styles
- `pricing_tiers` table contains carat-specific pricing
- `metal_options` table defines gold color options

### Shopify Query Building

Filters are translated into Shopify search queries using:
- Product tags
- Variant options
- Metafields
- Price ranges

### Progressive Disclosure (Implemented)

The filter system uses smart progressive disclosure to reduce cognitive load:

### Current Behavior

1. **Ring Style (Filter #1)** - Always visible when viewing Rings
2. **Diamond Shape (Filter #2)** - Only appears after Ring Style is selected
   - Available shapes adapt based on selected ring style
   - Cushion shape only available for Halo styles
3. **Metal / Gold Color (Filter #3)** - Always visible
4. **Diamond Type (Filter #4)** - Always visible
   - Shows "Synthetisch" terminology for Dutch SEO
5. **Carat Weight (Filter #5)** - Only appears after Diamond Type is selected
   - Lab-Grown: 0.50ct, 1.00ct, 1.50ct
   - Natural: 0.50ct, 1.00ct, 1.50ct, 2.00ct
6. **Price Range (Filter #6)** - Always visible
7. **Side Diamonds (Filter #7)** - Only appears for applicable ring styles
   - Shown for "Solitaire + Side Diamonds" and "Halo + Side Diamonds"

### Reset Behavior

Filters automatically reset dependent selections when parent changes:
- Changing Ring Style → Resets Shape selection
- Changing Diamond Type → Resets Carat Weight selection
- Changing Ring Style → Resets Side Diamonds selection

## Configuration Files

- **Filter Config**: `/src/config/filterConfig.ts`
- **Product Catalog**: `/src/lib/productCatalogDb.ts`
- **Pricing Config**: `/src/config/productPricingConfig.ts`

## Usage Example

```typescript
import {
  getFiltersInDisplayOrder,
  shouldShowFilter,
  getAvailableCarats,
  getAvailableShapes,
  FILTER_METADATA
} from '@/config/filterConfig';

// Get filters in recommended order for Rings category
const filters = getFiltersInDisplayOrder('Rings');

// Check if carat filter should be shown (depends on diamond type being selected)
const showCaratFilter = shouldShowFilter('caratWeight', activeFilters, 'Rings');

// Get available carat options based on diamond type
const availableCarats = getAvailableCarats('Lab-Grown Diamond');
// Returns: [0.50ct, 1.00ct, 1.50ct]

// Get available shapes for selected ring style
const availableShapes = getAvailableShapes('Halo');
// Returns: ['Round', 'Oval', 'Princess', 'Pear', 'Marquise', 'Emerald', 'Cushion', 'Heart']
```

## Localization

All filters support bilingual labels:
- English: `label`
- Dutch: `labelNL`

Example:
- "Diamond Type" / "Diamant Type"
- "Carat Weight" / "Karaat Gewicht"
- "Lab-Grown Diamond" / "Synthetische Diamant"

## Best Practices

1. **Always maintain the recommended order** - The order affects perceived simplicity
2. **Use progressive disclosure** - Only show relevant filters based on previous selections
3. **Provide clear feedback** - Show active filters and counts
4. **Enable multi-select where appropriate** - Shapes and metal colors support multiple selections
5. **Include search terms** - "synthetisch" for lab-grown diamonds helps with Dutch SEO

## Future Enhancements

- Dynamic filter counts based on available inventory
- Saved filter preferences per user
- Advanced filters (clarity, cut, color grades)
- Filter analytics to optimize ordering
