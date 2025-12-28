# Shopify Product Data Migration Guide

This guide explains how to fix your Shopify product data to follow proper filtering architecture.

---

## Quick Checklist

Before you start, you need to understand:

- [ ] Product-level attributes (what the item IS)
- [ ] Variant-level attributes (options user selects)
- [ ] Which attributes belong at which level
- [ ] How to structure CSV imports properly

---

## Part 1: Audit Your Current Data

### Export Your Products

1. In Shopify Admin → Products → Export
2. Select "All products"
3. Export as CSV for Excel

### Identify Issues

Look for these problems:

#### ❌ Issue 1: Repeated Empty Rows

```csv
Handle,Title,Tags,Metafield: jewelry-type
ring-1,Solitaire Ring,"Round, White Gold",ring
ring-1,,,"ring"  ← PROBLEM: Metafield repeated
ring-1,,,"ring"  ← PROBLEM: Metafield repeated
```

**How to identify:**
- Rows where Title is empty BUT metafields are filled

**How to fix:**
- Delete metafield values from variant rows
- Keep metafields ONLY on first product row

#### ❌ Issue 2: Variant Tags

```csv
Handle,Title,Tags,Option1 Value,Option2 Value
ring-1,Solitaire Ring,"Round, White Gold",18K White Gold,1.00ct
ring-1,,"0.50ct, White Gold",18K White Gold,0.50ct  ← PROBLEM
ring-1,,"1.00ct, Rose Gold",18K Rose Gold,1.00ct   ← PROBLEM
```

**How to identify:**
- Tags column filled on variant rows
- Tags contain variant-specific values (0.50ct, Size 52)

**How to fix:**
- Clear tags from variant rows
- Move shape/metal availability to product row tags

#### ❌ Issue 3: Inconsistent Tag Spelling

```csv
Handle,Title,Tags
ring-1,Ring 1,"Round, white gold, solitaire"
ring-2,Ring 2,"round, White Gold, Solitaire"
ring-3,Ring 3,"ROUND, WHITE GOLD, SOLITAIRE"
```

**How to identify:**
- Mixed capitalization
- Extra spaces
- Different spellings

**How to fix:**
- Standardize all tags to Title Case
- Use consistent spacing
- Pick ONE spelling and stick to it

---

## Part 2: Product-Level Cleanup

### Step 1: Identify Available Options

For each product, determine:

**Which shapes can be ordered?**
```
Example: Round, Oval, Princess
```

**Which metal colors can be ordered?**
```
Example: White Gold, Rose Gold, Yellow Gold
```

**What is the design category?**
```
Example: Solitaire, Halo, Trilogy
```

**What stone types are available?**
```
Example: Natural Diamond, Lab-Grown, Gemstone
```

### Step 2: Build Product Tags

Combine all available options into product tags:

```csv
Handle,Title,Tags
solitaire-1,Classic Solitaire Ring,"Ring,Solitaire,Round,Oval,Princess,White Gold,Rose Gold,Yellow Gold,Natural Diamond,Lab-Grown"
```

This means:
- Type: Ring
- Design: Solitaire
- Shapes available: Round, Oval, Princess
- Metals available: White Gold, Rose Gold, Yellow Gold
- Stone options: Natural Diamond or Lab-Grown

### Step 3: Fill Metafields (First Row Only)

```csv
Handle,Title,Jewelry type,Ring design,Target gender
solitaire-1,Classic Solitaire Ring,ring,Solitaire,Women
solitaire-1,,,,  ← Empty on variant rows
solitaire-1,,,,  ← Empty on variant rows
```

**Standard values:**

**Jewelry type:**
- `ring`
- `necklace`
- `earring`

**Ring design:**
- `Solitaire`
- `Halo`
- `Trilogy`
- `Eternity`
- `Three Stone`

**Target gender:**
- `Women`
- `Men`
- `Unisex`

---

## Part 3: Variant-Level Cleanup

### Step 1: Structure Variant Options

Use Option1, Option2, Option3 consistently across ALL products:

**Recommended structure for rings:**
- Option1 Name: `Material`
- Option1 Value: `18K White Gold`, `18K Rose Gold`, `18K Yellow Gold`
- Option2 Name: `Carat`
- Option2 Value: `0.50ct Natural`, `1.00ct Natural`, `Lab-Grown 0.50ct`
- Option3 Name: `Size` (optional, for pre-sized rings)
- Option3 Value: `52`, `54`, `56`, `58`

**Example:**
```csv
Handle,Option1 Name,Option1 Value,Option2 Name,Option2 Value
solitaire-1,Material,18K White Gold,Carat,0.50ct Natural
solitaire-1,Material,18K White Gold,Carat,1.00ct Natural
solitaire-1,Material,18K Rose Gold,Carat,0.50ct Natural
solitaire-1,Material,18K Rose Gold,Carat,1.00ct Natural
```

### Step 2: Set Variant Prices

Make sure each variant has the correct price:

```csv
Handle,Option1 Value,Option2 Value,Variant Price,Variant SKU
solitaire-1,18K White Gold,0.50ct Natural,995,SOL-WG-050-NAT
solitaire-1,18K White Gold,1.00ct Natural,1995,SOL-WG-100-NAT
solitaire-1,18K Rose Gold,0.50ct Natural,995,SOL-RG-050-NAT
solitaire-1,18K Rose Gold,1.00ct Natural,1995,SOL-RG-100-NAT
```

### Step 3: Clear Variant Tags

Variant rows should have EMPTY tags:

```csv
Handle,Title,Tags
solitaire-1,Classic Solitaire Ring,"Ring,Solitaire,Round,White Gold,Rose Gold"
solitaire-1,,,  ← Empty
solitaire-1,,,  ← Empty
```

---

## Part 4: Tag Standardization

### Standard Tag Format

Use these exact formats (Title Case, consistent spelling):

**Jewelry Types:**
```
Ring, Rings
Necklace, Necklaces
Earring, Earrings
```

**Ring Styles:**
```
Solitaire
Solitaire + Side Diamonds
Halo
Halo + Side Diamonds
Trilogy
Three Stone
Eternity
```

**Shapes:**
```
Round
Oval
Princess
Pear
Marquise
Emerald
Cushion
Heart
Asscher
Radiant
```

**Metal Colors:**
```
White Gold
Rose Gold
Yellow Gold
```

**Stone Types:**
```
Diamond
Natural Diamond
Lab-Grown Diamond
Lab-Grown
Gemstone
Sapphire
Ruby
Morganite
```

**Design Features:**
```
Side Diamonds
Pave
Channel Set
Micro Pave
```

### Tag Combination Example

```csv
Handle,Title,Tags
ring-1,Classic Solitaire,"Ring,Solitaire,Round,Oval,White Gold,Rose Gold,Natural Diamond,Lab-Grown"
ring-2,Halo Engagement Ring,"Ring,Halo,Round,Princess,White Gold,Rose Gold,Yellow Gold,Side Diamonds,Natural Diamond"
earring-1,Diamond Studs,"Earring,Studs,Round,White Gold,Rose Gold,Natural Diamond,Lab-Grown"
necklace-1,Solitaire Pendant,"Necklace,Pendant,Round,Oval,White Gold,Rose Gold,Natural Diamond"
```

---

## Part 5: CSV Template

### Product Row (First Row for Each Product)

```csv
Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Variant Price,Variant SKU,Variant Inventory Qty,Image Src,Jewelry type,Ring design,Target gender
solitaire-ring,Classic Solitaire Ring,"Beautiful solitaire ring",Diamonds by CS,Ring,"Ring,Solitaire,Round,Oval,White Gold,Rose Gold,Natural Diamond,Lab-Grown",TRUE,Material,18K White Gold,Carat,0.50ct Natural,995,SOL-WG-050-NAT,10,https://...,ring,Solitaire,Women
```

### Variant Rows (Additional Rows for Same Product)

```csv
Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Variant Price,Variant SKU,Variant Inventory Qty,Image Src,Jewelry type,Ring design,Target gender
solitaire-ring,,,,,,TRUE,Material,18K White Gold,Carat,1.00ct Natural,1995,SOL-WG-100-NAT,5,,,,
solitaire-ring,,,,,,TRUE,Material,18K Rose Gold,Carat,0.50ct Natural,995,SOL-RG-050-NAT,10,,,,
solitaire-ring,,,,,,TRUE,Material,18K Rose Gold,Carat,1.00ct Natural,1995,SOL-RG-100-NAT,5,,,,
```

**Key points:**
- Title, Body, Vendor, Type: ONLY on first row
- Tags: ONLY on first row
- Metafields (jewelry type, etc.): ONLY on first row
- Variants: ONLY Option values, Price, SKU, Inventory differ

---

## Part 6: Validation Checklist

Before importing, verify:

### Product-Level Checks

- [ ] Each product has Title on first row only
- [ ] Tags are ONLY on first row
- [ ] Tags are Title Case and consistent
- [ ] Tags include ALL shapes available
- [ ] Tags include ALL metals available
- [ ] Tags include design category
- [ ] Tags include stone type options
- [ ] Metafields filled ONLY on first row

### Variant-Level Checks

- [ ] All variants use same Option names
- [ ] Option values are consistent across products
- [ ] Each variant has unique SKU
- [ ] Each variant has correct price
- [ ] Variant rows have empty Title/Tags/Metafields
- [ ] No variant-specific tags (0.50ct, Size 52, etc.)

### Tag Consistency Checks

- [ ] All shape tags use same spelling
- [ ] All metal tags use same format
- [ ] No extra spaces in tags
- [ ] No lowercase/uppercase mixing
- [ ] No plurals mixed with singulars

---

## Part 7: Import Process

### Step 1: Backup

1. Export current products to CSV
2. Save copy as `products-backup-[date].csv`
3. Keep this backup safe

### Step 2: Test with Small Batch

1. Select 5-10 products to fix first
2. Create new CSV with correct format
3. Import to Shopify
4. Verify filters work correctly
5. Check filter counts are accurate

### Step 3: Full Migration

1. Once test batch works, migrate all products
2. Import in batches of 100-200 products
3. Verify each batch before continuing
4. Monitor for errors

### Step 4: Verify

After migration:

1. Check collection filters show correct counts
2. Verify selecting filters shows right products
3. Test product pages show correct variant options
4. Confirm no duplicate products
5. Test search functionality

---

## Part 8: Maintenance

### When Adding New Products

Follow this template:

1. **Product row:**
   - Fill: Title, Body, Vendor, Type
   - Tags: All shapes available + all metals available + design + stone types
   - Metafields: jewelry-type, ring-design, target-gender

2. **Variant rows:**
   - Fill: Option values, Price, SKU, Inventory
   - Leave empty: Title, Body, Tags, Metafields

### When Updating Products

- Update tags on product row if adding new shape/metal options
- Update variant options if changing available selections
- Never add variant-specific values to tags

### Monthly Audits

Run these checks monthly:

```bash
# Check for variant tags
npm run check-variant-tags

# Check for duplicate metafields
npm run check-duplicate-metafields

# Validate tag consistency
npm run validate-tag-spelling
```

---

## Common Questions

### Q: Should ring size be a variant option?

**A:** Usually NO. Most jewelry is custom-sized after ordering. If you sell pre-sized rings, use Option3 for size, but this is rare.

### Q: What about carat weight in product title?

**A:** Keep titles generic like "Classic Solitaire Ring". Don't put "Classic Solitaire Ring 0.50ct" - the carat is selected via variants.

### Q: Can I filter by price range?

**A:** Yes, but do it client-side after fetching products. Price varies by variant, so it's not a good product-level filter.

### Q: Should I use metafields or tags?

**A:** Use BOTH:
- Metafields: Structured data (jewelry-type, ring-design)
- Tags: Filter options (shapes, metals, design features)

### Q: How many variants per product?

**A:** Depends on your options:
- 3 metals × 4 carats = 12 variants
- 3 metals × 4 carats × 8 sizes = 96 variants (only if pre-sized)

Keep it under 100 variants per product for best performance.

---

## Next Steps

1. **Read** `SHOPIFY_FILTER_ARCHITECTURE.md` for the theory
2. **Export** your current product data
3. **Audit** using checklist in Part 1
4. **Clean** product-level data (Parts 2-4)
5. **Fix** variant-level data (Part 3)
6. **Test** with small batch (Part 7)
7. **Migrate** all products
8. **Verify** filters work correctly

Good luck with your migration!
