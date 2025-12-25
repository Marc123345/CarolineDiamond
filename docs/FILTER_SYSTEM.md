# Product Filter System

## Overview

The product filter system is designed with a specific hierarchy to optimize perceived simplicity and user experience. The order of filters has been carefully chosen based on UX best practices.

## Filter Display Order

Filters are presented in the following order for optimal user experience:

1. **Ring Style** - Solitaire, Halo (with or without side diamonds)
2. **Diamond Shape** - Round, Oval, Princess, Pear, etc.
3. **Metal / Gold Color** - 18K White, Rose, or Yellow Gold
4. **Diamond Type** - Natural Diamond vs Lab-Grown (Synthetisch)
5. **Carat Weight** - 0.50ct, 1.00ct, 1.50ct, 2.00ct
6. **Price Range** - Budget-based filtering
7. **Side Diamonds on Band** - Additional diamonds on the ring band

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

### Progressive Disclosure

Filters are shown/hidden based on:
1. Selected jewelry category
2. Dependencies on other filter selections
3. Available product options

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
