# Hierarchical Jewelry Filter System

## Overview

This document describes the new hierarchical filtering system for the Diamonds by CS jewelry e-commerce platform. The system implements a multi-level filter structure that matches the business requirements for organizing and displaying jewelry products with intelligent filter dependencies and visual feedback.

## Architecture

### 1. Database Schema

**New Tables:**

- `ring_type_definitions` - Stores ring type categories (Solitaire, Halo, with/without side diamonds)
- `diamond_shape_definitions` - Diamond shape information with SVG icons
- `stone_type_hierarchy` - Diamond and gemstone type hierarchies
- `filter_dependencies` - Defines parent-child filter relationships
- `filter_availability_rules` - Rules for which shapes are available per ring type
- `product_filter_cache` - Performance optimization cache for filter counts

**Migration File:** `supabase/migrations/[timestamp]_create_hierarchical_filter_system.sql`

### 2. Filter Hierarchy Structure

The filter system follows a four-level hierarchy (A → B → C → D):

#### Level A: Ring Type
- Solitaire
- Solitaire + Side Diamonds
- Halo
- Halo + Side Diamonds

**Behavior:** Selecting a ring type resets the shape selection to show only compatible shapes.

#### Level B: Metal Color (18K Gold)
- Rose Gold (18K)
- Yellow Gold (18K)
- White Gold (18K)

**Display:** Visual color swatches with product counts

#### Level C: Diamond Shape
Available shapes depend on selected ring type:
- Solitaire/Solitaire + Side: Round, Oval, Princess, Pear, Marquise, Emerald
- Halo/Halo + Side: Round, Oval, Princess, Pear, Marquise, Emerald, Cushion

**Display:** Visual shape icons with SVG representations

#### Level D: Stone Type
Primary selection: Diamond or Gemstone

**Diamond Branch:**
- Natural Diamond
- Lab-Grown Diamond

**Gemstone Branch:**
- Sapphire (Blue)
- Sapphire (Pink)
- Sapphire (Yellow)
- Morganite (Pink)
- Ruby (Red)

**Display:** Gemstones shown with color indicators

### 3. Key Components

#### `HierarchicalProductFilters.tsx`
Main filter component implementing the hierarchical UI layout.

**Features:**
- Collapsible sections with smooth animations
- Visual icons for ring types and shapes
- Color swatches for metal selection
- Cascading filter reset logic
- Real-time product count updates
- Mobile-responsive with bottom sheet

#### `ShapeIcons.tsx`
Provides SVG icons for all diamond shapes and ring styles.

**Exports:**
- `ShapeIcon` - Renders diamond shape icons
- `RingStyleIcon` - Renders ring type icons with side diamond indicators

#### `hierarchicalFilterDb.ts`
Database interaction layer for filter system.

**Functions:**
- `getRingTypeDefinitions()` - Fetch all ring types
- `getDiamondShapeDefinitions()` - Fetch all shapes
- `getStoneTypeHierarchy()` - Fetch diamond/gemstone hierarchy
- `getFilterDependencies()` - Fetch filter dependencies
- `getAvailableShapesForRingType()` - Get compatible shapes for ring type
- `getCachedFilterCount()` - Retrieve cached product counts
- `setCachedFilterCount()` - Cache product counts for performance

#### `useHierarchicalFilters.ts`
Custom React hook for managing filter state with cascading dependencies.

**Features:**
- Automatic dependent filter reset
- Filter validation
- State synchronization
- Dependency tracking

### 4. Filter Configuration

**File:** `src/config/filterConfig.ts`

**Key Updates:**
- Expanded `RING_STYLES` to include side diamond variants
- Added `METAL_COLOR_LABELS` for 18K specification
- Updated `SHAPES_BY_STYLE` with complete mappings
- Enhanced `TAG_MAPPINGS` for Shopify product matching
- Updated `buildShopifyQuery()` to support new ring styles

### 5. Visual Design

#### Desktop Layout
- Collapsible sections labeled A, B, C, D
- Visual hierarchy with indentation for sub-filters
- Large touch targets for all interactive elements
- Product counts displayed next to each option
- Clear visual indication of selected state

#### Mobile Layout
- Full-screen bottom sheet overlay
- Sticky header with "Solitaire Rings" title
- Scrollable filter sections
- Sticky "Apply Filters" button at bottom
- Smooth slide-up animation

#### Visual Elements
- **Ring Type Cards:** 2-column grid with icons and counts
- **Metal Colors:** Circular color swatches with 18K labels
- **Shapes:** 3-column grid with diamond shape icons
- **Stone Types:** Full-width buttons with hierarchical sub-options
- **Gemstones:** Color-coded badges showing stone color

### 6. User Experience Flow

1. **Initial State:** All filter sections expanded by default
2. **Ring Type Selection:** User selects ring style → Shape options update
3. **Metal Color Selection:** Multiple selections allowed via visual swatches
4. **Shape Selection:** Only compatible shapes shown based on ring type
5. **Stone Type:** Diamond or Gemstone → Sub-options appear with indentation
6. **Apply:** Filters update product list in real-time

### 7. Performance Optimizations

- **Filter Count Caching:** Product counts cached for 1 hour
- **Debounced Updates:** 300ms debounce on filter changes
- **Memoized Calculations:** React.memo and useMemo for expensive operations
- **Batch Updates:** Multiple filter changes batched together
- **Lazy Loading:** Filter definitions loaded on demand

### 8. Mobile Responsiveness

**Breakpoints:**
- Mobile: < 768px (bottom sheet)
- Desktop: ≥ 768px (sidebar)

**Touch Targets:**
- Minimum 44px × 44px for all interactive elements
- Increased spacing for touch-friendly interaction
- Swipe-to-close gesture on mobile overlay

### 9. Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader announcements for filter updates
- Focus management in modals
- Semantic HTML structure
- High contrast color choices

### 10. Integration with Shopify

**Product Matching:**
- Updated tag mappings for new ring styles
- Support for "Side Diamonds" tag variations
- Metal color exact matching with 18K specification
- Shape filtering with multiple tag variations
- Stone type hierarchical querying

**Query Building:**
- `buildShopifyQuery()` generates optimized Shopify queries
- Supports OR operations for multi-select filters
- Proper tag escaping and quotation
- Hierarchical tag relationships

### 11. Testing Checklist

- [ ] All ring types display correctly
- [ ] Shape options update when ring type changes
- [ ] Metal color swatches show accurate colors
- [ ] Stone type hierarchy expands/collapses properly
- [ ] Diamond/Gemstone sub-options appear correctly
- [ ] Product counts update in real-time
- [ ] Mobile bottom sheet opens and closes smoothly
- [ ] Filter chips display active selections
- [ ] Clear all filters works properly
- [ ] URL updates reflect filter state
- [ ] Back button restores previous filter state
- [ ] Shopify queries return correct products

### 12. Future Enhancements

- Filter presets (e.g., "Popular Choices", "Budget Friendly")
- Saved filter combinations
- Filter history
- A/B testing for filter layouts
- Advanced filtering (clarity, carat weight, certification)
- Visual comparison mode for metal colors
- Filter analytics and insights

## Files Modified/Created

### New Files
- `src/components/shop/HierarchicalProductFilters.tsx`
- `src/components/shop/ShapeIcons.tsx`
- `src/lib/hierarchicalFilterDb.ts`
- `src/hooks/useHierarchicalFilters.ts`
- `supabase/migrations/[timestamp]_create_hierarchical_filter_system.sql`

### Modified Files
- `src/config/filterConfig.ts` - Expanded ring styles and tag mappings
- `src/pages/ShopPage.tsx` - Integrated hierarchical filters
- `src/index.css` - Added fadeIn animation

## Usage Examples

### Basic Filter Usage
```typescript
import { HierarchicalProductFilters } from './components/shop/HierarchicalProductFilters';

<HierarchicalProductFilters
  filters={currentFilters}
  onFiltersChange={handleFilterChange}
  products={productList}
/>
```

### With Mobile Support
```typescript
<HierarchicalProductFilters
  filters={filters}
  onFiltersChange={setFilters}
  onClose={() => setIsOpen(false)}
  isMobile={true}
  products={products}
/>
```

### Using the Hook
```typescript
import { useHierarchicalFilters } from './hooks/useHierarchicalFilters';

const { filters, updateFilter, clearFilters } = useHierarchicalFilters(
  initialFilters,
  {
    onFiltersChange: handleChange,
    enableDependencyTracking: true
  }
);
```

## Support

For questions or issues with the hierarchical filter system, contact the development team or refer to the codebase documentation.
