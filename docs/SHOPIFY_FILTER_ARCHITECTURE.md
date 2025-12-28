# Shopify Filter Architecture

## The Golden Rule

**Collections filter products. Product pages select variants.**

This simple rule is the foundation of proper Shopify filtering. Understanding and following this principle prevents the most common filtering mistakes.

---

## Understanding the Three Layers

Your Shopify store has three distinct data layers:

### 1. Product-Level Attributes (WHAT the item IS)

These attributes define the product itself and should exist **once per product**, not repeated across variants.

**Examples:**
- Jewelry Type (Ring, Necklace, Earring)
- Ring Design (Solitaire, Halo, etc.)
- Target Gender (Women, Men, Unisex)
- Shapes AVAILABLE (Round, Oval, Princess) - which shapes can be ordered
- Metal Colors AVAILABLE (White Gold, Rose Gold, Yellow Gold) - which metals can be ordered
- Diamond Shape Available (which shapes this product supports)

**Where to store:**
- ✅ Product metafields (`product.metafields.shopify.jewelry-type`)
- ✅ Product tags (for shapes/metals available: `tag:Round`, `tag:White Gold`)
- ✅ Product type field (`product.productType`)

**Where NOT to store:**
- ❌ Variant options
- ❌ Variant metafields
- ❌ Duplicated across variant rows in CSV

---

### 2. Variant-Level Attributes (OPTIONS the user selects)

These are the dropdown selectors users see on product detail pages.

**Examples:**
- Carat Weight (0.50ct, 1.00ct, 1.50ct)
- Material/Metal (18K White Gold, 18K Rose Gold)
- Ring Size (52, 54, 56, 58)
- Clarity Grade (VS1, VS2, SI1)
- Certification (GIA, HRD, IGI)

**Where to store:**
- ✅ Variant options (`Option1`, `Option2`, `Option3` in Shopify)
- ✅ Variant price (different price per variant)
- ✅ Variant SKU
- ✅ Variant inventory

**Where NOT to use:**
- ❌ Collection filters (never filter collections by variant options)
- ❌ Product-level tags
- ❌ Search & Discovery filters

---

### 3. Filter-Driving Attributes (WHAT powers collection filtering)

These are the attributes that should appear in your collection filters.

**What to filter by:**
- ✅ Jewelry Type (product metafield or product type)
- ✅ Ring Design (product metafield or tag)
- ✅ Shapes Available (product tags)
- ✅ Metal Colors Available (product tags)
- ✅ Stone Type (Diamond vs Gemstone)
- ✅ Diamond Origin (Natural vs Lab-Grown) - product level
- ✅ Side Diamonds (Yes/No) - design feature
- ✅ Target Gender (product metafield)
- ✅ Availability (in stock or not)

**What NOT to filter by:**
- ❌ Specific carat weight (variant option)
- ❌ Specific ring size (variant option)
- ❌ Clarity grade (variant attribute)
- ❌ Certification (variant attribute)
- ❌ Variant price (use price range on product instead)

---

## How to Structure Your Shopify Data

### Product Row (in CSV/Shopify)

**Fill these columns:**
- `Title` - Product name
- `Body (HTML)` - Product description
- `Vendor` - Your store name
- `Product Category` - Rings, Necklaces, Earrings
- `Type` - Ring, Necklace, Earring
- `Tags` - All shapes available, all metals available, design style
- `Jewelry type (product.metafields.shopify.jewelry-type)` - ring, necklace, earring
- `Ring design (product.metafields.shopify.ring-design)` - Solitaire, Halo, etc.
- `Target gender (product.metafields.shopify.target-gender)` - Women, Men, Unisex

**Example tags for a ring product:**
```
Round, Oval, Princess, White Gold, Rose Gold, Yellow Gold, Solitaire, Diamond, Natural Diamond, Lab-Grown
```

These tags indicate:
- Available shapes: Round, Oval, Princess
- Available metals: White Gold, Rose Gold, Yellow Gold
- Design: Solitaire
- Stone options: Natural Diamond or Lab-Grown

### Variant Rows (in CSV/Shopify)

**Fill these columns:**
- `Option1 Name` - Material
- `Option1 Value` - 18K White Gold
- `Option2 Name` - Carat
- `Option2 Value` - 1.00ct Natural
- `Variant Price` - €1,500
- `Variant SKU` - RING-SOL-WG-100
- `Variant Inventory Qty` - 5

**Leave EMPTY on variant rows:**
- ❌ Title
- ❌ Body (HTML)
- ❌ Tags
- ❌ Metafield columns (jewelry-type, ring-design, etc.)

---

## Common Anti-Patterns (DON'T DO THIS)

### ❌ Anti-Pattern 1: Variant Tags

**Wrong:**
```
Product Row: Title = "Solitaire Ring", Tags = "Ring, Solitaire"
Variant Row 1: Tags = "0.50ct, White Gold, Round"
Variant Row 2: Tags = "1.00ct, Rose Gold, Oval"
```

**Why it's wrong:**
- Creates duplicate products in search results
- Breaks collection filtering
- Causes inconsistent filter counts

**Right:**
```
Product Row: Title = "Solitaire Ring", Tags = "Ring, Solitaire, Round, Oval, White Gold, Rose Gold, Natural Diamond, Lab-Grown"
Variant Row 1: Option1 = "18K White Gold", Option2 = "0.50ct Natural"
Variant Row 2: Option1 = "18K Rose Gold", Option2 = "1.00ct Natural"
```

### ❌ Anti-Pattern 2: Metafields on Variant Rows

**Wrong:**
```csv
Handle,Title,Jewelry type,Ring design
solitaire-ring,Solitaire Ring,ring,Solitaire
solitaire-ring,,ring,Solitaire    ← Duplicate!
solitaire-ring,,ring,Solitaire    ← Duplicate!
```

**Why it's wrong:**
- Wastes storage
- Can cause Shopify bugs
- Slows down imports

**Right:**
```csv
Handle,Title,Jewelry type,Ring design
solitaire-ring,Solitaire Ring,ring,Solitaire
solitaire-ring,,,    ← Empty metafields
solitaire-ring,,,    ← Empty metafields
```

### ❌ Anti-Pattern 3: Filtering by Variant Options in Collections

**Wrong Query:**
```javascript
// DON'T do this
buildShopifyQuery({
  caratWeight: "1.00ct"  // Variant option - don't filter collections by this
})

// Results in:
"variants.option2:1.00ct"  // ❌ Wrong level
```

**Why it's wrong:**
- Doesn't work reliably in Shopify Storefront API
- Breaks filter counts
- Confuses users (why am I seeing products with other carat weights?)

**Right Approach:**
```javascript
// DO this instead - show all products, filter variants on product page
buildShopifyQuery({
  jewelryCategory: "Rings",
  ringStyle: "Solitaire",
  shapes: ["Round", "Oval"]  // Shapes AVAILABLE, not selected
})

// Then on product page, let user select:
// - Which shape they want
// - Which carat weight they want
// - Which metal color they want
// → These become variant selections
```

---

## Implementation in Your Codebase

### Shopify Query Builder (`buildShopifyQuery`)

**What it filters (Product-level):**
```javascript
export function buildShopifyQuery(filters: ProductFilters): string {
  // ✅ Product type
  if (filters.jewelryCategory) {
    parts.push(`tag:"${filters.jewelryCategory}"`);
  }

  // ✅ Ring design
  if (filters.ringStyle) {
    parts.push(`tag:"${filters.ringStyle}"`);
  }

  // ✅ Shapes AVAILABLE (product tags)
  if (filters.shapes?.length) {
    parts.push(`(tag:"Round" OR tag:"Oval")`);
  }

  // ✅ Metal Colors AVAILABLE (product tags)
  if (filters.metalColors?.length) {
    parts.push(`(tag:"White Gold" OR tag:"Rose Gold")`);
  }

  return parts.join(' AND ');
}
```

**What it does NOT filter (Variant-level):**
```javascript
// ❌ DON'T filter by these in collection queries:
// - Carat weight (variant option)
// - Ring size (variant option)
// - Clarity (variant attribute)
// - Certification (variant attribute)
//
// These are selected on the product detail page
```

### Client-Side Filtering (ShopPage.tsx)

**Only for price ranges:**
```javascript
const filteredProducts = useMemo(() => {
  let result = shopifyProducts;

  // ✅ Price range (better UX client-side)
  if (filters.minPrice || filters.maxPrice) {
    result = result.filter(p =>
      p.price >= filters.minPrice && p.price <= filters.maxPrice
    );
  }

  // ❌ Don't filter by variant options here
  return result;
}, [shopifyProducts, filters.minPrice, filters.maxPrice]);
```

---

## Fixing Your Data

### Step 1: Clean Product Tags

Make sure each product is tagged with:
- ✅ All shapes it supports (Round, Oval, etc.)
- ✅ All metals it supports (White Gold, Rose Gold, etc.)
- ✅ Design category (Solitaire, Halo, etc.)
- ✅ Stone type (Diamond, Natural Diamond, Lab-Grown, etc.)
- ❌ NO variant-specific values (0.50ct, Size 52, etc.)

### Step 2: Clean Variant Options

Make sure variants use Option1, Option2, Option3 for:
- Material/Metal (18K White Gold, 18K Rose Gold)
- Carat (0.50ct Natural, 1.00ct Natural, Lab-Grown 0.50ct)
- Size (52, 54, 56) - if applicable

### Step 3: Clean Metafields

Fill product metafields ONLY on the first product row:
- `jewelry-type`: ring, necklace, earring
- `ring-design`: Solitaire, Halo, Trilogy, etc.
- `target-gender`: Women, Men, Unisex
- `jewelry-material`: 18K Gold (product-level material, not color)

Leave variant rows with empty metafield columns.

### Step 4: Validate with Script

```typescript
import { validateProductForFiltering } from './utils/shopifyFilterBuilder';

products.forEach(product => {
  const validation = validateProductForFiltering(product);
  if (!validation.isValid) {
    console.error(`Product ${product.title}:`, validation.issues);
  }
});
```

---

## Benefits of This Architecture

1. **Filters work reliably** - No more broken filter counts or missing products
2. **Better performance** - Server-side filtering is faster than client-side
3. **Cleaner data** - No duplication, no confusion
4. **Easier maintenance** - Clear separation of concerns
5. **Shopify best practices** - Works with Search & Discovery, Online Store 2.0
6. **Scalable** - Works with 10 products or 10,000 products

---

## Testing Your Filters

### Good Signs:
- ✅ Filter counts are accurate
- ✅ Selecting a filter shows only matching products
- ✅ Products appear in multiple filter combinations if applicable
- ✅ No duplicate products in results
- ✅ Variant options appear on product page, not in filters

### Bad Signs:
- ❌ Filter counts don't match actual results
- ❌ Some products missing from expected filters
- ❌ Selecting multiple filters shows no results
- ❌ Same product appears multiple times
- ❌ Filters include variant-specific values (carat, size)

---

## Summary

**Product-level (Collections):**
- What type of jewelry (Ring, Necklace)
- What design (Solitaire, Halo)
- What shapes AVAILABLE (Round, Oval, Princess)
- What metals AVAILABLE (White Gold, Rose Gold)
- What stone types (Diamond, Gemstone)

**Variant-level (Product Page):**
- Which specific carat (0.50ct, 1.00ct)
- Which specific metal color (18K White Gold)
- Which specific size (52, 54, 56)
- Which specific price

**Remember:**
Collections filter products (WHAT it is).
Product pages select variants (WHICH one you want).
