# COMPLETE PRODUCT SETUP GUIDE

## Overview
This guide will help you set up all required products with proper variant structures including Natural Diamond options.

## What This Setup Does

### Product Structure
All products will have **TWO OPTIONS**:
1. **Color**: 18K Yellow Gold, 18K White Gold, 18K Rose Gold (3 options)
2. **Diamond Type**: Lab-Grown sizes + Natural Diamond

This creates a matrix of variants where customers can select both their preferred metal color AND diamond type.

### Products to Be Created/Updated

#### 1. Timeless Diamond Necklace
- **Variants**: 9 total (3 colors × 3 diamond types)
- **Diamond Types**:
  - Lab-Grown 0.50ct: €750
  - Lab-Grown 1.00ct: €1,190
  - Natural Diamond: €0 (Price on Request)

#### 2. Timeless Diamond Stud Earrings  
- **Variants**: 12 total (3 colors × 4 diamond types)
- **Diamond Types**:
  - Lab-Grown 0.30ct: €490
  - Lab-Grown 0.50ct: €590
  - Lab-Grown 1.00ct: €890
  - Natural Diamond: €0 (Price on Request)

#### 3. Four Solitaire Engagement Ring Models
- **4 Separate Products** (Model 1, 2, 3, 4)
- **Variants per model**: 12 total (3 colors × 4 diamond types)
- **Diamond Types**:
  - Lab-Grown 0.50ct: €790
  - Lab-Grown 1.00ct: €990
  - Lab-Grown 1.50ct: €1,250
  - Natural Diamond: €0 (Price on Request)

---

## Prerequisites

### 1. Environment Setup
You need a `.env` file in the project root with:

```env
VITE_SHOPIFY_STORE_DOMAIN=uyccca-1e.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-token
```

**Where to find these:**
- Log into Shopify Admin: `https://uyccca-1e.myshopify.com/admin`
- Navigate to **Settings** → **Apps and sales channels** → **Develop apps**
- Create or select your custom app
- Copy the **Admin API access token** (needs `write_products` permission)
- Copy the **Storefront API access token** (needs read permissions)

### 2. Node.js and npm
Make sure you have Node.js installed:
```bash
node --version  # Should be v16 or higher
npm --version
```

---

## Step-by-Step Setup Instructions

### Option A: Run All Products at Once (Recommended)

This will set up necklaces, earrings, and all 4 engagement ring models in one go:

```bash
npm run setup-all-products
```

**What this does:**
1. Creates/updates Necklace with 9 variants
2. Creates/updates Earrings with 12 variants
3. Creates 4 Engagement Ring models with 12 variants each
4. Fetches all products to sync with the frontend

**Expected output:**
```
✅ Necklace product setup completed!
✅ Earring product setup completed!
✅ Solitaire Engagement Ring setup completed!
   Created: 4 products
   Total variants created: 48
✅ Products fetched and synced!
```

---

### Option B: Run Individual Scripts

If you prefer to set up products one at a time:

#### 1. Setup Necklaces
```bash
npm run setup-necklaces
```

This creates: **Timeless Diamond Necklace** with 9 variants

#### 2. Setup Earrings
```bash
npm run setup-earrings
```

This creates: **Timeless Diamond Stud Earrings** with 12 variants

#### 3. Setup Engagement Rings
```bash
npm run setup-engagement-rings
```

This creates: **4 Engagement Ring Models** (48 total variants)

#### 4. Sync Products to Frontend
After running any setup script, sync the products:
```bash
npm run fetch-products
```

---

## Verification Steps

After running the setup scripts, verify everything is correct:

### 1. Check Shopify Admin
Log into: `https://uyccca-1e.myshopify.com/admin/products`

**Verify:**
- [ ] "Timeless Diamond Necklace" has 9 variants (3 colors × 3 diamond types)
- [ ] "Timeless Diamond Stud Earrings" has 12 variants (3 colors × 4 diamond types)
- [ ] 4 "Classic Solitaire Engagement Ring – Model X" products exist
- [ ] Each engagement ring model has 12 variants (3 colors × 4 diamond types)
- [ ] All products are set to "Active" status
- [ ] Natural Diamond variants show €0.00 price

### 2. Check Product Options
For each product in Shopify Admin, verify it has TWO options:

**Option 1: Color**
- 18K Yellow Gold
- 18K White Gold  
- 18K Rose Gold

**Option 2: Diamond Type** (varies by product)
- Necklace: Lab-Grown 0.50ct, Lab-Grown 1.00ct, Natural Diamond
- Earrings: Lab-Grown 0.30ct, Lab-Grown 0.50ct, Lab-Grown 1.00ct, Natural Diamond
- Rings: Lab-Grown 0.50ct, Lab-Grown 1.00ct, Lab-Grown 1.50ct, Natural Diamond

### 3. Test on Frontend

**Start the dev server:**
```bash
npm run dev
```

**Test checklist:**
- [ ] All products appear in the shop
- [ ] Each product shows the correct number of variants in dropdown
- [ ] Selecting "Natural Diamond" shows "Price on Request" instead of price
- [ ] "Add to Cart" button changes to "Request Price Quote" for Natural Diamond
- [ ] Clicking "Request Price Quote" opens the modal
- [ ] Diamond Shape selector appears and works
- [ ] Birthstone selector appears and adds €40 to price
- [ ] Lab-grown diamonds can be added to cart normally

---

## What the Scripts Do

### Script Behavior
Each script will:
1. **Check if product exists** by handle
2. **Delete old product** if it exists (to ensure clean variant structure)
3. **Create new product** with proper 2-option setup:
   - Option 1: Color (3 values)
   - Option 2: Diamond Type (3-4 values)
4. **Generate all variant combinations** automatically
5. **Set prices** according to specifications
6. **Set Natural Diamond price to €0** for "Price on Request" functionality

### Safety Features
- Products are identified by unique handles (won't duplicate)
- Old products are deleted before recreation (ensures clean structure)
- Includes delays to avoid Shopify API rate limiting
- Detailed console output shows progress
- Error handling for failed operations

---

## Troubleshooting

### Issue: "Missing required environment variables"
**Solution:** Create `.env` file with proper credentials (see Prerequisites section)

### Issue: "Shopify API error: 401"
**Solution:** Check that your `SHOPIFY_ADMIN_ACCESS_TOKEN` is correct and has `write_products` permission

### Issue: "Product already exists but can't be deleted"
**Solution:** Manually delete the product in Shopify Admin, then re-run the script

### Issue: "Rate limit exceeded"
**Solution:** Wait a few minutes and try again. Scripts include delays but Shopify may still throttle

### Issue: Products created but not showing on frontend
**Solution:** Run `npm run fetch-products` to sync Shopify products with the frontend

---

## Frontend Features (Already Implemented)

The frontend already supports these features:

### 1. Natural Diamond Detection
- Automatically detects when variant price is €0
- Shows "Price on Request" instead of €0
- Replaces "Add to Cart" with "Request Price Quote" button

### 2. Diamond Shape Selector
- Appears on all product pages
- 8 shape options: Round, Princess, Cushion, Emerald, Oval, Pear, Marquise, Heart
- No additional cost
- Selection saved to cart attributes

### 3. Birthstone Selector
- Optional add-on
- 12 birthstone options (January-December)
- +€40 per stone
- Real-time price calculation
- Selection saved to cart attributes

### 4. Price on Request Modal
- Opens when "Request Price Quote" is clicked
- Allows customer to enter contact details
- Integrates with WhatsApp, Email, Phone
- Captures product details and customer selections

---

## Product Images

**Important:** These scripts create products without images. You'll need to:

1. Log into Shopify Admin
2. Go to each product
3. Upload product images
4. Assign images to specific variants if needed

**Recommended:**
- Main product image should show the product clearly
- Add multiple angles/views
- Consider adding lifestyle shots
- Ensure images are high quality (min 2000x2000px)

---

## Next Steps After Setup

### Immediate (Required)
1. **Run the setup scripts** (see instructions above)
2. **Add product images** in Shopify Admin
3. **Test complete checkout flow** with lab-grown diamonds
4. **Test Natural Diamond "Request Quote" flow**

### Short Term
1. **Activate Shopify Checkout Profile** (Settings → Checkout)
2. **Configure payment methods**
3. **Set up shipping zones and rates**
4. **Test on mobile devices**

### Medium Term
1. **Add Wedding Rings** (when Caroline provides details)
2. **Add Bracelets** (when pricing is confirmed)
3. **Install Product Options App** if additional customization needed
4. **Set up email notifications** for price quote requests

---

## Summary Table

| Product | Variants | Diamond Types | Lab-Grown Prices | Natural |
|---------|----------|---------------|------------------|---------|
| Necklace | 9 | 0.50ct, 1.00ct | €750, €1,190 | On request |
| Earrings | 12 | 0.30ct, 0.50ct, 1.00ct | €490, €590, €890 | On request |
| Ring Model 1-4 | 12 each | 0.50ct, 1.00ct, 1.50ct | €790, €990, €1,250 | On request |

**Total:** 6 products, 69 variants

All products:
- 3 metal colors (Yellow, White, Rose 18K Gold)
- Tax & certificate included
- Handcrafted in Antwerp

---

## Support

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Review script output for specific error messages
3. Verify environment variables are set correctly
4. Check Shopify API permissions
5. Ensure products aren't locked by other apps/integrations

For questions about the scripts themselves, review the script files in `scripts/` directory.

---

**Last Updated:** December 2024  
**Status:** Ready to Execute
