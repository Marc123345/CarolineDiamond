# Quick Start: Timeless Necklace Variant System

## What Was Built

A unified variant selector for the Timeless Diamond Necklace that lets customers configure:
- **Metal Color**: White Gold, Yellow Gold, or Rose Gold
- **Diamond Type**: Lab-Grown or Natural
- **Carat Weight**: 0.50 ct or 1.00 ct

## Pricing

| Diamond Type | Carat | Price |
|--------------|-------|-------|
| Lab-Grown | 0.50 ct | €750 |
| Lab-Grown | 1.00 ct | €1,190 |
| Natural | 0.50 ct | Price on Request |
| Natural | 1.00 ct | Price on Request |

## How to Access

Visit any of these URLs:
- `/product/timeless-diamond-necklace`
- `/product/timeless-diamond-necklace-18k-gold-0-50ct`
- `/product/timeless-diamond-necklace-18k-gold-1-00ct`

All URLs show the same unified experience with variant selector.

## Key Features

### ✨ Dynamic Filtering
Filters update in real-time based on availability - if a combination doesn't exist, that option is disabled.

### 💰 Smart Pricing
- Lab-grown diamonds show exact price
- Natural diamonds show "Price on Request"
- Never shows €0.00

### 📱 Price Request Flow
For natural diamonds:
1. Select variant options
2. Click "Request Price Quote"
3. Modal opens with 3 quick contact options (WhatsApp, Email, Phone)
4. Or fill form to send WhatsApp message with details

### 📦 Trust Signals
Displays:
- HRD/IGI/GIA Certification
- Free Worldwide Shipping
- Lifetime Warranty
- Gift Box Included

## Component Structure

```
TimelessNecklaceProductPage
├── ProductImageGallery (images)
├── TimelessNecklaceVariantSelector (filters)
│   ├── Metal Color Selection
│   ├── Diamond Type Selection
│   ├── Carat Weight Selection
│   ├── Price Display
│   └── Add to Cart / Request Price button
└── PriceRequestModal (for natural diamonds)
    ├── Quick Contact (WhatsApp/Email/Phone)
    └── Contact Form
```

## Extending to Other Products

To add variant filtering to another product:

1. Create config file in `src/config/[product]VariantsConfig.ts`
2. Define variant interface and combinations
3. Create selector component `src/components/[Product]VariantSelector.tsx`
4. Create product page `src/pages/[Product]ProductPage.tsx`
5. Add routes in `App.tsx`
6. Build and test

## Configuration

All variant data is in `src/config/necklaceVariantsConfig.ts`:

```typescript
export const TIMELESS_NECKLACE_VARIANTS: NecklaceVariant[] = [
  {
    metalColor: 'White Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.50 ct',
    price: 750,
    shopifyHandle: 'timeless-diamond-necklace-18k-gold-0-50ct',
    available: true
  },
  // ... more variants
];
```

To update:
- **Add variant**: Add new object to array
- **Change price**: Update `price` field
- **Disable variant**: Set `available: false`
- **Add option**: Extend variant interface and update selectors

## Testing

```bash
# Build project
npm run build

# Navigate to:
http://localhost:5173/product/timeless-diamond-necklace

# Test:
1. Select each metal color ✓
2. Select diamond type ✓
3. Select carat weight ✓
4. Verify price displays correctly ✓
5. Test "Add to Cart" for lab-grown ✓
6. Test "Request Price" for natural ✓
```

## Maintenance

### Update Prices
Edit `src/config/necklaceVariantsConfig.ts`:
```typescript
price: 750, // Change value here
```

### Add New Variant
Add to `TIMELESS_NECKLACE_VARIANTS` array:
```typescript
{
  metalColor: 'Platinum',
  diamondType: 'Lab-Grown',
  caratWeight: '0.75 ct',
  price: 950,
  shopifyHandle: 'timeless-diamond-necklace-platinum-075ct',
  available: true
}
```

### Disable Variant Temporarily
```typescript
available: false, // Set to false
```

## Support

For questions or issues:
- Check `TIMELESS_NECKLACE_VARIANT_SYSTEM.md` for full documentation
- Review component code in `src/components/`
- Test in development mode first
- Build before deploying: `npm run build`
