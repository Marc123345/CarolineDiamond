# Diamonds by CS - Complete Filter & Catalog Mapping

## Product Catalog Overview

### Active Products (6)
1. **Timeless Diamond Necklace** - 9 variants
2. **Timeless Diamond Stud Earrings** - 12 variants
3. **Solitaire Engagement Ring - Model 1** - 12 variants
4. **Solitaire Engagement Ring - Model 2** - 12 variants
5. **Solitaire Engagement Ring - Model 3** - 12 variants
6. **Solitaire Engagement Ring - Model 4** - 12 variants

**Total: 57 active product variants**

### Pending Products (2)
7. Wedding Rings - TBD
8. Bracelets - TBD

---

## Filter Configuration

### 1. Jewelry Category Filter
**Purpose:** Top-level product categorization

**Options:**
- ✓ **Rings** → Shows all engagement rings (solitaire, halo)
- ✓ **Earrings** → Shows stud earrings
- ✓ **Necklaces** → Shows pendant necklaces

**Shopify Tag Mapping:**
```
Rings: ['Ring', 'Rings', 'Engagement Ring', 'Solitaire Ring', 'Halo Ring']
Earrings: ['Earring', 'Earrings', 'Studs', 'Diamond Earrings', 'studs']
Necklaces: ['Necklace', 'Necklaces', 'Diamond Necklace', 'diamond necklace']
```

---

### 2. Metal Color Filter
**Purpose:** Filter by 18K gold type

**Options:**
- ✓ **18K Rose Gold**
- ✓ **18K Yellow Gold**
- ✓ **18K White Gold**

**Shopify Variant Mapping:**
```
Rose Gold: ['rose-gold', 'Rose Gold', '18K Rose Gold', 'RG']
Yellow Gold: ['yellow-gold', 'Yellow Gold', '18K Yellow Gold', 'YG']
White Gold: ['white', 'whte-gold', 'white-gold', 'White Gold', '18K White Gold', 'WG']
```

**Applied To:** ALL products (necklaces, earrings, all ring models)

---

### 3. Diamond Origin Filter
**Purpose:** Filter by lab-grown vs natural diamonds

**Options:**
- ✓ **Lab-Grown Diamond** (with carat options)
- ✓ **Natural Diamond** (price on request)

**Shopify Variant Mapping:**
```
Lab-Grown: ['Lab-Grown Diamond', 'Lab-Grown 0.30ct', 'Lab-Grown 0.50ct',
            'Lab-Grown 1.00ct', 'Lab-Grown 1.50ct', 'D-VS2']
Natural: ['Natural Diamond', 'Natural', 'Mined Diamond']
```

**Applied To:** ALL products

---

### 4. Carat Weight Filter
**Purpose:** Filter by diamond size

**Options:**
- ✓ **0.30 ct** (Earrings only)
- ✓ **0.50 ct** (Necklaces, Earrings, Rings)
- ✓ **1.00 ct** (Necklaces, Earrings, Rings)
- ✓ **1.50 ct** (Rings only)

**Shopify Tag Mapping:**
```
0.30ct: ['0.30ct', '0.30 ct']
0.50ct: ['0.50ct', '0.50 ct']
1.00ct: ['1.00ct', '1.00 ct']
1.50ct: ['1.50ct', '1.50 ct']
```

**Product Availability:**
| Product Type | 0.30ct | 0.50ct | 1.00ct | 1.50ct |
|--------------|--------|--------|--------|--------|
| Necklaces    | -      | ✓      | ✓      | -      |
| Earrings     | ✓      | ✓      | ✓      | -      |
| Engagement Rings | -  | ✓      | ✓      | ✓      |

---

### 5. Ring Style Filter (Rings Only)
**Purpose:** Filter engagement ring styles

**Options:**
- ✓ **Solitaire** (no side diamonds)
- ✓ **Solitaire + Side Diamonds**
- ✓ **Halo** (no side diamonds)
- ✓ **Halo + Side Diamonds**

**Shopify Tag Mapping:**
```
Solitaire: ['Solitaire', 'Solitaire Ring', 'No Side Diamonds']
Solitaire + Side Diamonds: ['Side Diamonds', 'Solitaire + Side Diamonds']
Halo: ['Halo', 'Halo Ring', 'No Side Diamonds']
Halo + Side Diamonds: ['Halo + Side Diamonds', 'Side Diamonds']
```

**Applied To:** Rings only (not shown for necklaces/earrings)

---

### 6. Diamond Shape Filter (Rings Only)
**Purpose:** Filter by diamond cut shape

**Options:**
- ✓ **Round** (Classic brilliant)
- ✓ **Oval**
- ✓ **Princess**
- ✓ **Pear**
- ✓ **Marquise**
- ✓ **Emerald**
- ✓ **Cushion**

**Shopify Tag Mapping:**
```
Round: ['Round', 'shape:round']
Oval: ['Oval', 'shape:oval']
Princess: ['Princess', 'shape:princess']
Pear: ['Pear', 'shape:pear']
Marquise: ['Marquise', 'shape:marquise']
Emerald: ['Emerald', 'shape:emerald']
Cushion: ['Cushion', 'shape:cushion']
```

**Note:** Shape is available for ALL ring styles. In the product detail page, shape selection is a custom option (via order notes), not a variant.

---

### 7. Price Range Filter
**Purpose:** Filter by price

**Options:**
- Under €1,500
- €1,500-€3,000
- €3,000-€5,000
- Over €5,000

**Applied To:** ALL products

---

## Custom Options (Not Filterable)

These are added via Product Options App and saved to order notes:

### 1. Diamond Shape Selection
- **Type:** Dropdown/Image Swatches
- **Required:** Yes
- **Price Impact:** None
- **Values:** Round, Princess, Cushion, Emerald, Oval, Pear, Marquise, Heart
- **Note:** Saved to order notes for fulfillment

### 2. Birthstone Add-on (Optional)
- **Type:** Dropdown
- **Required:** No
- **Price Impact:** +€40 per stone
- **Values:** None, or any of 12 birthstones
- **Note:** Optional personalization, adds €40 to cart price

### 3. Engraving (Optional)
- **Type:** Text field
- **Required:** No
- **Character Limit:** 20-30 characters
- **Price Impact:** TBD
- **Note:** Personalization for jewelry pieces

---

## Product Pricing Matrix

### Necklaces (9 variants)
| Metal Color | 0.50ct Lab | 1.00ct Lab | Natural |
|-------------|------------|------------|---------|
| Yellow Gold | €750 | €1,190 | €0 (Request) |
| White Gold | €750 | €1,190 | €0 (Request) |
| Rose Gold | €750 | €1,190 | €0 (Request) |

### Earrings (12 variants)
| Metal Color | 0.30ct Lab | 0.50ct Lab | 1.00ct Lab | Natural |
|-------------|------------|------------|------------|---------|
| Yellow Gold | €490 | €590 | €890 | €0 (Request) |
| White Gold | €490 | €590 | €890 | €0 (Request) |
| Rose Gold | €490 | €590 | €890 | €0 (Request) |

### Engagement Rings (12 variants per model × 4 models = 48 variants)
| Metal Color | 0.50ct Lab | 1.00ct Lab | 1.50ct Lab | Natural |
|-------------|------------|------------|------------|---------|
| Yellow Gold | €790 | €990 | €1,250 | €0 (Request) |
| White Gold | €790 | €990 | €1,250 | €0 (Request) |
| Rose Gold | €790 | €990 | €1,250 | €0 (Request) |

---

## Filter Query Logic

### Example 1: Filter by Lab-Grown 0.50ct Rings
```
Query: tag:"Lab-Grown 0.50ct" AND tag:"Ring"
Results: 12 products (4 ring models × 3 metal colors)
```

### Example 2: Filter by Rose Gold Necklaces
```
Query: tag:"rose-gold" AND tag:"Necklace"
Results: 3 products (0.50ct Lab, 1.00ct Lab, Natural)
```

### Example 3: Filter by Solitaire + Yellow Gold + 1.00ct
```
Query: tag:"Solitaire" AND tag:"yellow-gold" AND tag:"1.00ct"
Results: 4 products (4 solitaire ring models)
```

---

## Natural Diamond Handling

**Behavior:** When "Natural Diamond" variant is selected:
- Price shows €0 or "Price on Request"
- "Add to Cart" button is hidden or disabled
- "Contact Us" or "Request Quote" button is shown
- Customer can contact via WhatsApp, email, or contact form

**Implementation:** Conditional logic via Product Options App or custom theme code

---

## Filter Availability by Product Type

| Filter | Necklaces | Earrings | Rings |
|--------|-----------|----------|-------|
| Metal Color | ✓ | ✓ | ✓ |
| Diamond Origin | ✓ | ✓ | ✓ |
| Carat Weight | ✓ | ✓ | ✓ |
| Ring Style | - | - | ✓ |
| Diamond Shape | - | - | ✓ |
| Price Range | ✓ | ✓ | ✓ |

---

## Implementation Status

### ✅ Completed
- [x] Filter configuration synced with CSV data
- [x] Metal color variants properly mapped
- [x] Carat weight filters (0.30, 0.50, 1.00, 1.50)
- [x] Diamond origin filters (Lab-Grown, Natural)
- [x] Category filters (Rings, Earrings, Necklaces)
- [x] Ring style filters (Solitaire, Halo)
- [x] Shape filters (Round, Oval, Princess, etc.)
- [x] Price range filters
- [x] Removed birthstone/shape from product detail variants

### ⏳ Pending
- [ ] Wedding Rings product setup (awaiting info from Caroline)
- [ ] Bracelets product setup (awaiting pricing from Caroline)
- [ ] Engraving pricing confirmation
- [ ] Product images for all 4 engagement ring models

---

## Testing Checklist

### Filter Testing
- [ ] Filter by each metal color (Rose, Yellow, White)
- [ ] Filter by each carat weight (0.30, 0.50, 1.00, 1.50)
- [ ] Filter by diamond origin (Lab-Grown, Natural)
- [ ] Filter by category (Rings, Earrings, Necklaces)
- [ ] Filter by ring style (Solitaire, Halo)
- [ ] Filter by shape (Round, Oval, Princess, etc.)
- [ ] Combine multiple filters
- [ ] Verify product counts match expected results

### Product Detail Page Testing
- [ ] Select metal color variant
- [ ] Select diamond type variant
- [ ] Price updates correctly
- [ ] Natural Diamond shows contact option
- [ ] Shape selector works (custom option)
- [ ] Birthstone selector adds €40
- [ ] Add to cart with all options

### Mobile Testing
- [ ] Filters work on mobile view
- [ ] Variant selection on mobile
- [ ] Custom options on mobile

---

## Notes

1. **Variant vs Custom Options:**
   - **Variants** = Metal Color + Diamond Type (affects inventory & price)
   - **Custom Options** = Shape + Birthstone + Engraving (no new variants)

2. **Why This Structure:**
   - Avoids 1000+ variant combinations
   - Keeps pricing clear
   - Allows unlimited customization
   - Maintains inventory tracking

3. **Shape Handling:**
   - Shapes don't affect price
   - Customer selects shape at checkout
   - Shape preference saved to order notes
   - Fulfillment team creates with selected shape

4. **Birthstone Handling:**
   - Optional add-on (+€40)
   - Added via Product Options App
   - Updates cart price dynamically
   - Saved to order notes

---

## Support Contact

For questions about:
- Wedding Rings → Contact Caroline
- Bracelets Pricing → Contact Caroline
- Engraving Pricing → Contact Caroline
- Product Photos → Pending delivery
