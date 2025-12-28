# Quick Start: 8-Product Standardized Structure

## TL;DR

All 8 engagement ring products have identical structure:
- **84 variants** each (3 metals × 4 diamond types × 7 sizes)
- **Same pricing** for all products
- **Dynamic selection** on frontend

## Setup in 3 Steps

### 1. Generate & Import Variants

**Option A: Via Shopify API (Recommended)**
```bash
npm run setup-engagement-ring-variants
```
⏱️ Takes ~16 minutes for 8 products

**Option B: Via CSV Import**
```bash
npm run generate-csv
```
Then upload `shopify-84-variants-import.csv` in Shopify Admin → Products → Import

### 2. Sync Products to Frontend
```bash
npm run fetch-products
```

### 3. Verify
```bash
npm run verify-pricing
```

## The Structure

```
Product Options:
├── Option 1: Metal Color (3 values)
│   ├── 18K Yellow Gold
│   ├── 18K White Gold
│   └── 18K Rose Gold
├── Option 2: Diamond Type (4 values)
│   ├── 0.50ct → €1,150
│   ├── 1.00ct → €1,350
│   ├── 1.50ct → €1,610
│   └── Natural Diamond → €3,360
└── Option 3: Ring Size (7 values)
    ├── EU 48
    ├── EU 50
    ├── EU 52
    ├── EU 54
    ├── EU 56
    ├── EU 58
    └── EU 60

Total: 3 × 4 × 7 = 84 variants per product
```

## Pricing Logic

```typescript
const price = {
  '0.50ct': 1150,
  '1.00ct': 1350,
  '1.50ct': 1610,
  'Natural Diamond': 3360
}[diamondType];
```

**Key Point**: Price depends ONLY on Diamond Type, not on Metal Color or Ring Size.

## The 8 Products

1. Solitaire Princess
2. Solitaire Round
3. Solitaire Oval
4. Solitaire Round + Side Diamonds
5. Solitaire Emerald + Side Diamonds
6. Halo Cushion + Side Diamonds
7. Halo Pear
8. Halo + Side Diamonds

## Frontend Behavior

When user selects options:
1. **Metal Color** → Updates visual (button selection)
2. **Diamond Type** → Updates price immediately
3. **Ring Size** → No price change (dropdown selection)

## Verification Checklist

- [ ] Each product has 84 variants
- [ ] Selecting "1.00ct" shows €1,350 for ALL products
- [ ] All 3 metal colors available
- [ ] All 7 ring sizes available
- [ ] Price updates when Diamond Type changes
- [ ] Can add any variant to cart

## Common Issues

| Issue | Fix |
|-------|-----|
| Product shows "Default Title" | Run setup script |
| Only 1 variant exists | Run setup script |
| Wrong prices | Update `STANDARDIZED_PRICING` and re-run |
| Frontend not updating | Run `npm run fetch-products` |
| 404 on product page | Check product handle matches |

## Files to Reference

| File | Purpose |
|------|---------|
| `scripts/setup-engagement-ring-variants.ts` | API-based setup |
| `scripts/generate-84-variant-csv.ts` | CSV generation |
| `docs/STANDARDIZED_8_PRODUCT_STRUCTURE.md` | Full documentation |
| `src/components/VariantSelector.tsx` | Frontend component |

## Testing Locally

1. Start dev server: `npm run dev`
2. Navigate to any of the 8 products
3. Select different Diamond Types
4. Verify price changes correctly
5. Test add to cart

## Production Deployment

1. Run setup script on production Shopify
2. Verify all variants created
3. Test checkout flow
4. Monitor for any errors

---

**Need Help?** See `docs/STANDARDIZED_8_PRODUCT_STRUCTURE.md` for complete documentation.
