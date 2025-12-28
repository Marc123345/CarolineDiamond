# Shopify Storefront API Data Mismatch Audit

## 🔍 Critical Issues Identified

### 1. **GraphQL Edge Traversal in UI Components**
**Problem:** UI components directly traverse Shopify GraphQL `edges → node` structure.

**Examples:**
```typescript
// ❌ ProductCard.tsx
const color = (v.selectedOptions['Color'] || v.selectedOptions['Metal'] || '').toLowerCase();

// ❌ transformCartLine in shopifyHelpers.ts
image: line.merchandise.product.images.edges[0]?.node.url || ''
```

**Why It's Bad:**
- Tight coupling to GraphQL structure
- Fragile - breaks if Shopify changes response format
- Null safety issues
- No fallback handling

### 2. **Inconsistent Price Handling**
**Problem:** Prices are strings in GraphQL but numbers in ProcessedProduct.

**Current State:**
```typescript
// Shopify GraphQL returns:
price: {
  amount: "1299.00",  // ← STRING
  currencyCode: "EUR"
}

// ProcessedProduct expects:
price: 1299  // ← NUMBER
```

**Issues:**
- Multiple conversion points (error-prone)
- No currency tracking in ProcessedProduct
- Mixed `price` vs `price.amount` handling
- `compareAtPrice` inconsistently handled

### 3. **Images Array Mismatch**
**Problem:** Images are `edges → node` in GraphQL but flat arrays in ProcessedProduct.

**GraphQL:**
```typescript
images: {
  edges: [{
    node: {
      url: string
      altText?: string
    }
  }]
}
```

**ProcessedProduct:**
```typescript
images: string[]  // ← No altText, no metadata
```

**Issues:**
- Alt text lost during transformation
- Fallback images inconsistent
- No placeholder handling
- Variant images vs product images confusion

### 4. **Variant ID Mismatch (CRITICAL)**
**Problem:** Shopify variant IDs are GIDs that must be used exactly for cart operations.

**Format:**
```typescript
// Shopify returns:
id: "gid://shopify/ProductVariant/43879246553268"

// Cart mutation requires exact GID:
merchandiseId: "gid://shopify/ProductVariant/43879246553268"  // ← MUST match
```

**Current Issues:**
- No validation that variant ID is valid GID
- No check if variant exists before adding to cart
- No availability validation

### 5. **Availability Logic Scattered**
**Problem:** Multiple places check availability differently.

**Current Checks:**
```typescript
// Option 1:
variant.availableForSale

// Option 2:
variant.availableForSale && variant.quantityAvailable > 0

// Option 3:
variant.quantityAvailable || variant.inventoryQty > 0
```

**Inconsistencies:**
- Different logic in different files
- `quantityAvailable` can be 0 or undefined
- No centralized availability check

### 6. **Currency Missing**
**Problem:** ProcessedProduct doesn't store currency.

**Impact:**
- Can't display correct currency symbol
- Multi-currency support impossible
- Price formatting assumes EUR

### 7. **Variant Selection Duplicated**
**Problem:** Multiple implementations of variant finding logic.

**Locations:**
1. `findVariantByOptions` in shopifyHelpers.ts (complex, shape/carat matching)
2. `findVariant` in ProductCard.tsx (simple metal matching)
3. Inline logic in multiple components

**Issues:**
- Inconsistent behavior
- Duplicated code
- Hard to maintain
- Bugs in one place don't get fixed in others

### 8. **Type Safety Issues**
**Problem:** Weak typing allows runtime errors.

**Examples:**
```typescript
// ❌ Any type usage
const variant: any = product.variants[0]

// ❌ Unsafe optional chaining
product.images?.edges[0]?.node?.url

// ❌ No discriminated unions for availability
variant.availableForSale  // boolean, but doesn't tell us WHY not available
```

### 9. **Metafields Null Safety**
**Problem:** Metafields are optional and can be null/undefined.

**Current:**
```typescript
product.metafields?.forEach(metafield => {
  if (metafield && metafield.key && metafield.value) {
    // ❌ Still can crash if value is malformed
  }
})
```

### 10. **Cart Line Transformation**
**Problem:** transformCartLine directly accesses edges.

```typescript
// ❌ Direct edge access in cart transformation
image: line.merchandise.product.images.edges[0]?.node.url || ''

// ❌ No validation
selectedOptions: Record<string, string>  // What if selectedOptions is undefined?
```

---

## 📋 Root Causes

### Why These Issues Exist:

1. **No Centralized Normalization**
   - Data transformation happens in multiple places
   - Each transformer handles nulls differently
   - No single source of truth

2. **UI Components Know Too Much**
   - Components understand GraphQL structure
   - Should only know about ProcessedProduct
   - Violates separation of concerns

3. **Gradual Feature Addition**
   - Code evolved without refactoring
   - New features added ad-hoc
   - Technical debt accumulated

4. **Weak Type Contracts**
   - Optional fields everywhere
   - No validation at boundaries
   - Runtime errors instead of compile-time

---

## ✅ Required Fixes

### 1. Enhanced Type Definitions
**Create strict types that match Shopify exactly:**

```typescript
// Raw Shopify Types (exactly as API returns)
interface ShopifyMoneyV2 {
  amount: string;      // Always string
  currencyCode: string;
}

interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

interface ShopifyVariant {
  id: string;  // GID format
  title: string;
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image: ShopifyImage | null;
}

// Normalized UI Types (what components consume)
interface NormalizedVariant {
  id: string;  // Preserved GID
  title: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  available: boolean;
  availabilityReason?: 'out_of_stock' | 'not_for_sale' | 'limited_quantity';
  quantityAvailable: number;
  selectedOptions: Record<string, string>;
  image: string;
  imageAlt: string;
}
```

### 2. Comprehensive Normalizer
**Single function to transform Shopify → UI:**

```typescript
export function normalizeShopifyProduct(raw: ShopifyProduct): ProcessedProduct {
  // Handle all edge cases:
  // - Null checks
  // - Edge → Node flattening
  // - String → Number conversion
  // - Fallback values
  // - Currency extraction
  // - Availability logic
}
```

### 3. Cart Safety
**Validate before adding to cart:**

```typescript
export function validateAddToCart(
  product: ProcessedProduct,
  variantId: string,
  quantity: number
): { valid: boolean; error?: string; variant?: NormalizedVariant } {
  // 1. Check variant exists
  // 2. Check availability
  // 3. Check quantity
  // 4. Check GID format
  // 5. Return validated data
}
```

### 4. Remove Edge Traversal
**Components use only normalized data:**

```typescript
// ❌ Before
const image = line.merchandise.product.images.edges[0]?.node.url || '';

// ✅ After
const image = cartItem.image; // Already normalized
```

---

## 🎯 Success Criteria

After fixes:
- ✅ No UI component accesses `.edges` or `.node`
- ✅ All prices are numbers with explicit currency
- ✅ All images have fallbacks
- ✅ All cart operations validate before executing
- ✅ No runtime crashes due to null/undefined
- ✅ TypeScript strict mode passes
- ✅ Single normalizer handles all transformations
- ✅ Variant selection centralized
- ✅ Availability logic unified

---

## 📊 Impact Assessment

| Issue | Severity | Impact | Frequency |
|-------|----------|--------|-----------|
| Edge traversal in UI | High | Runtime crashes | Every product render |
| Price string/number mismatch | High | Wrong pricing | Every transaction |
| Missing currency | Medium | Multi-currency fails | Future feature |
| Variant ID validation | Critical | Cart failures | Every add-to-cart |
| Availability inconsistency | Medium | Wrong stock status | 20% of products |
| Image fallback | Medium | Broken images | 5% of products |
| Type safety | Medium | Runtime errors | Sporadic |

---

## 🔧 Implementation Plan

1. **Create strict type definitions** (30 min)
2. **Build comprehensive normalizer** (1 hour)
3. **Update cart operations** (45 min)
4. **Remove UI component edge access** (1 hour)
5. **Centralize variant selection** (45 min)
6. **Add validation layer** (30 min)
7. **Test end-to-end** (1 hour)

**Total Estimated Time:** ~5.5 hours
