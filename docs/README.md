# Documentation Index

This folder contains documentation for the Shopify filtering system and product data structure.

---

## Quick Start

**New to this project?** Start here:

1. Read [`FILTER_SYSTEM_FIXES.md`](./FILTER_SYSTEM_FIXES.md) - **Start here!**
   - Summary of what was wrong and what was fixed
   - Before/after comparisons
   - Quick overview

2. Read [`SHOPIFY_FILTER_ARCHITECTURE.md`](./SHOPIFY_FILTER_ARCHITECTURE.md) - **Understand the theory**
   - The Golden Rule: Collections filter products, product pages select variants
   - Three layers of data (product, variant, filter)
   - Common anti-patterns to avoid
   - How the codebase implements this

3. Read [`SHOPIFY_DATA_MIGRATION.md`](./SHOPIFY_DATA_MIGRATION.md) - **Fix your data**
   - Step-by-step migration guide
   - CSV templates
   - Tag standardization
   - Validation checklist

---

## Document Descriptions

### [`FILTER_SYSTEM_FIXES.md`](./FILTER_SYSTEM_FIXES.md)
**What:** Summary of fixes to the filtering system
**When to read:** First! This gives you the high-level overview
**Key topics:**
- What was broken and why
- What was fixed and how
- Files that changed
- Next steps

### [`SHOPIFY_FILTER_ARCHITECTURE.md`](./SHOPIFY_FILTER_ARCHITECTURE.md)
**What:** Complete guide to proper Shopify filtering
**When to read:** After FILTER_SYSTEM_FIXES, before migrating data
**Key topics:**
- The Golden Rule explained
- Three layers of data (product, variant, filter)
- Product-level vs variant-level attributes
- Common anti-patterns and how to avoid them
- Implementation in this codebase
- Testing your filters
- Benefits of proper architecture

### [`SHOPIFY_DATA_MIGRATION.md`](./SHOPIFY_DATA_MIGRATION.md)
**What:** Step-by-step guide for fixing Shopify product data
**When to read:** When you're ready to fix your Shopify data
**Key topics:**
- Audit your current data
- Product-level cleanup (tags, metafields)
- Variant-level cleanup (options, prices)
- Tag standardization
- CSV templates
- Import process
- Validation checklist
- Maintenance tips

### [`FILTER_SYSTEM.md`](./FILTER_SYSTEM.md)
**What:** Original documentation about the filter system (legacy)
**When to read:** For historical context
**Status:** May be outdated after recent changes

### [`PRODUCT_CATALOG_SUMMARY.md`](./PRODUCT_CATALOG_SUMMARY.md)
**What:** Summary of product catalog features
**When to read:** To understand product catalog implementation
**Status:** Current

---

## Common Tasks

### I want to understand what was wrong
→ Read [`FILTER_SYSTEM_FIXES.md`](./FILTER_SYSTEM_FIXES.md)

### I want to learn the correct model
→ Read [`SHOPIFY_FILTER_ARCHITECTURE.md`](./SHOPIFY_FILTER_ARCHITECTURE.md)

### I want to fix my Shopify data
→ Read [`SHOPIFY_DATA_MIGRATION.md`](./SHOPIFY_DATA_MIGRATION.md)

### I want to add a new product
→ Follow the template in [`SHOPIFY_DATA_MIGRATION.md`](./SHOPIFY_DATA_MIGRATION.md) Part 8

### I want to add a new filter type
→ Read "Implementation" section in [`SHOPIFY_FILTER_ARCHITECTURE.md`](./SHOPIFY_FILTER_ARCHITECTURE.md)

### I'm getting wrong filter counts
→ Your Shopify data needs fixing - see [`SHOPIFY_DATA_MIGRATION.md`](./SHOPIFY_DATA_MIGRATION.md)

### I'm not sure if a tag should be product or variant level
→ Read "Three Layers" section in [`SHOPIFY_FILTER_ARCHITECTURE.md`](./SHOPIFY_FILTER_ARCHITECTURE.md)

---

## Key Concepts

### The Golden Rule
```
Collections filter products.
Product pages select variants.
```

This means:
- **Collections** show you which PRODUCTS match your criteria (e.g., "show me Solitaire rings")
- **Product pages** let you SELECT which variant you want (e.g., "I want 0.50ct in White Gold")

### Product-Level Attributes
What the product IS. Example:
- Jewelry Type: Ring
- Design: Solitaire
- Shapes Available: Round, Oval, Princess
- Metals Available: White Gold, Rose Gold, Yellow Gold

### Variant-Level Attributes
Options the user SELECTS. Example:
- Selected Shape: Round
- Selected Carat: 1.00ct
- Selected Metal: 18K White Gold
- Selected Size: 54

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│  Collections Filter PRODUCTS            │
│                                          │
│  "Show me Solitaire Rings"              │
│  ↓                                       │
│  Filters by product tags:                │
│  - tag:Ring                              │
│  - tag:Solitaire                         │
│  - tag:Round (available)                 │
│  - tag:White Gold (available)            │
│                                          │
│  Result: List of matching PRODUCTS       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Product Page Selects VARIANTS          │
│                                          │
│  "Which one do you want?"                │
│  ↓                                       │
│  User selects:                           │
│  - Shape: Round                          │
│  - Carat: 1.00ct                         │
│  - Metal: 18K White Gold                 │
│                                          │
│  Result: Specific variant with price     │
└─────────────────────────────────────────┘
```

---

## Validation Tools

The codebase includes validation utilities:

```typescript
import { validateProductForFiltering } from '../utils/shopifyFilterBuilder';

// Validate a single product
const validation = validateProductForFiltering(product);
if (!validation.isValid) {
  console.error(validation.issues);
}
```

See [`SHOPIFY_DATA_MIGRATION.md`](./SHOPIFY_DATA_MIGRATION.md) Part 7 for usage examples.

---

## Questions?

If something isn't clear:

1. Check if it's covered in one of the three main docs
2. Look at examples in the docs (there are many)
3. Use the validation script to check your data
4. Review the "Common Questions" sections

---

## Contributing

When adding documentation:

1. Follow the existing structure
2. Include code examples
3. Add to this index
4. Use clear headings for easy navigation

---

Last Updated: 2025-12-28
