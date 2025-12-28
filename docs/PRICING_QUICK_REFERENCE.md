# Pricing Quick Reference

## At a Glance

| Diamond Type | WITHOUT Side Diamonds | WITH Side Diamonds | Difference |
|-------------|----------------------|-------------------|------------|
| 0.50ct | €790 | €1,150 | +€360 |
| 1.00ct | €990 | €1,350 | +€360 |
| 1.50ct | €1,250 | €1,610 | +€360 |
| Natural Diamond | €3,000 | €3,360 | +€360 |

## Product Breakdown

### WITHOUT Side Diamonds (€790 - €3,000)

1. **Solitaire Ring with Princess Shape Diamond**
   - Handle: `solitaire-princess-ring`
   - Tags: `engagement-ring`, `solitaire`, `princess`, `lab-grown-diamond`

2. **Solitaire Ring with Round Diamond**
   - Handle: `solitaire-round-ring`
   - Tags: `engagement-ring`, `solitaire`, `round`, `lab-grown-diamond`

3. **Solitaire Ring with Oval Diamond**
   - Handle: `solitaire-oval-ring`
   - Tags: `engagement-ring`, `solitaire`, `oval`, `lab-grown-diamond`

4. **Halo Ring with Pear Shape Diamond**
   - Handle: `halo-pear-ring`
   - Tags: `engagement-ring`, `halo`, `pear`, `lab-grown-diamond`

### WITH Side Diamonds (€1,150 - €3,360)

1. **Solitaire Ring with Round Diamond and Side Diamonds**
   - Handle: `solitaire-round-side-diamonds`
   - Tags: `engagement-ring`, `solitaire`, `round`, `with-side-diamonds`, `lab-grown-diamond`

2. **Solitaire Ring with Emerald Shape and Side Diamond**
   - Handle: `solitaire-emerald-side-diamonds`
   - Tags: `engagement-ring`, `solitaire`, `emerald`, `with-side-diamonds`, `lab-grown-diamond`

3. **Halo Ring with Cushion Diamond and Side Diamonds**
   - Handle: `halo-cushion-side-diamonds`
   - Tags: `engagement-ring`, `halo`, `cushion`, `with-side-diamonds`, `lab-grown-diamond`

4. **Halo Ring with Side Diamonds**
   - Handle: `halo-ring-side-diamonds`
   - Tags: `engagement-ring`, `halo`, `with-side-diamonds`, `lab-grown-diamond`

## Total Catalog

- **8 Products** (4 without side diamonds + 4 with side diamonds)
- **672 Total Variants** (8 products × 84 variants each)
- **2 Price Tiers** (€360 difference between tiers)

## Commands

```bash
# Generate CSV with all products and correct pricing
npm run generate-csv

# Setup variants via Shopify Admin API
npm run setup-engagement-ring-variants

# Verify all pricing is correct
npm run verify-pricing

# Fetch latest product data from Shopify
npm run fetch-products
```

## CSV Location

Generated CSV file: `shopify-84-variants-import.csv`

Ready to import via:
**Shopify Admin → Products → Import**
