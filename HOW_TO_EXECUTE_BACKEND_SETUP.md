# HOW TO EXECUTE PRODUCT SETUP - BACKEND CHANGES

This guide explains how to actually create the products in Shopify (make backend changes).

## Option 1: Run Locally (Quickest - 5 minutes)

### Step 1: Get Shopify API Credentials

1. Log into Shopify Admin: https://uyccca-1e.myshopify.com/admin
2. Go to **Settings** → **Apps and sales channels** → **Develop apps**
3. Click **Create an app** (or select existing app)
4. Name it "Product Setup Script"
5. Click **Configure Admin API scopes**
6. Enable these permissions:
   - ✅ `write_products` - Create and update products
   - ✅ `read_products` - Read product data
7. Click **Save**
8. Click **Install app** to your store
9. Click **Reveal token once** and copy the **Admin API access token**
10. Go to **API credentials** tab
11. Under **Storefront API access token**, click **Configure** and enable:
    - ✅ Read products
    - ✅ Read product listings
12. Copy the **Storefront API access token**

### Step 2: Create .env File

In the project root, create a file named `.env`:

```env
VITE_SHOPIFY_STORE_DOMAIN=uyccca-1e.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=paste-your-storefront-token-here
SHOPIFY_ADMIN_ACCESS_TOKEN=paste-your-admin-token-here
```

### Step 3: Run the Setup

```bash
# Install dependencies (if not already installed)
npm install

# Run all product setup at once
npm run setup-all-products
```

**Expected output:**
```
🔄 Starting Necklace Product Setup...
✅ Product created with all variants successfully!
   Total variants: 9

🔄 Starting Earring Product Setup...
✅ Product created with all variants successfully!
   Total variants: 12

🔄 Starting Solitaire Engagement Ring Setup...
✅ Created: 4 products
   Total variants created: 48

✅ All products setup completed!
✅ Products fetched and synced!
```

### Step 4: Verify

1. Log into Shopify Admin
2. Go to **Products**
3. You should see:
   - ✅ Timeless Diamond Necklace (9 variants)
   - ✅ Timeless Diamond Stud Earrings (12 variants)
   - ✅ Classic Solitaire Engagement Ring – Model 1 (12 variants)
   - ✅ Classic Solitaire Engagement Ring – Model 2 (12 variants)
   - ✅ Classic Solitaire Engagement Ring – Model 3 (12 variants)
   - ✅ Classic Solitaire Engagement Ring – Model 4 (12 variants)

**Total: 6 products, 69 variants**

---

## Option 2: Run via GitHub Actions (If you prefer not to run locally)

### Step 1: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these 3 secrets:

**Secret 1:**
- Name: `VITE_SHOPIFY_STORE_DOMAIN`
- Value: `uyccca-1e.myshopify.com`

**Secret 2:**
- Name: `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- Value: (paste your storefront token from Step 1 above)

**Secret 3:**
- Name: `SHOPIFY_ADMIN_ACCESS_TOKEN`
- Value: (paste your admin token from Step 1 above)

### Step 2: Run the Workflow

1. Go to **Actions** tab in your GitHub repository
2. Click **Setup Shopify Products** workflow
3. Click **Run workflow** button
4. Select which products to setup:
   - **all** - Creates all 6 products (recommended)
   - **necklaces** - Creates necklace only
   - **earrings** - Creates earrings only
   - **engagement-rings** - Creates 4 ring models only
5. Click **Run workflow**

The workflow will:
- Install dependencies
- Create .env file from secrets
- Run the setup scripts
- Create all products in Shopify

### Step 3: Monitor Progress

- Watch the workflow run in real-time in the Actions tab
- When complete, check Shopify Admin to verify products

---

## What Happens When Scripts Run

### The scripts will:

1. **Check for existing products** by handle
2. **Delete old products** if they exist (to ensure clean variant structure)
3. **Create new products** with 2-option setup:
   - Option 1: Color (3 values)
   - Option 2: Diamond Type (3-4 values depending on product)
4. **Generate all variants** automatically (color × diamond type)
5. **Set prices** according to specifications
6. **Set Natural Diamond price to €0** for "Price on Request" functionality
7. **Mark products as Active** so they appear in the store

### Products Created:

#### 1. Timeless Diamond Necklace
- **Handle:** `timeless-diamond-necklace`
- **Variants:** 9 (3 colors × 3 diamond types)
- **Prices:** €750, €1,190, €0

#### 2. Timeless Diamond Stud Earrings
- **Handle:** `timeless-diamond-stud-earrings`
- **Variants:** 12 (3 colors × 4 diamond types)
- **Prices:** €490, €590, €890, €0

#### 3. Classic Solitaire Engagement Ring – Model 1
- **Handle:** `classic-solitaire-engagement-ring-model-1`
- **Variants:** 12 (3 colors × 4 diamond types)
- **Prices:** €790, €990, €1,250, €0

#### 4. Classic Solitaire Engagement Ring – Model 2
- **Handle:** `classic-solitaire-engagement-ring-model-2`
- **Variants:** 12 (3 colors × 4 diamond types)
- **Prices:** €790, €990, €1,250, €0

#### 5. Classic Solitaire Engagement Ring – Model 3
- **Handle:** `classic-solitaire-engagement-ring-model-3`
- **Variants:** 12 (3 colors × 4 diamond types)
- **Prices:** €790, €990, €1,250, €0

#### 6. Classic Solitaire Engagement Ring – Model 4
- **Handle:** `classic-solitaire-engagement-ring-model-4`
- **Variants:** 12 (3 colors × 4 diamond types)
- **Prices:** €790, €990, €1,250, €0

---

## After Setup is Complete

### 1. Add Product Images (IMPORTANT)

Products are created **without images**. You need to add them:

1. Log into Shopify Admin
2. Go to **Products**
3. Click on each product
4. Click **Add media** 
5. Upload product images
6. Drag to reorder if needed
7. Click **Save**

**Recommended images:**
- Main product shot (clear, well-lit)
- Multiple angles
- Close-up of details
- Lifestyle/on-model shots
- Minimum 2000×2000px resolution

### 2. Test on Frontend

```bash
npm run dev
```

Visit: http://localhost:5173

**Test:**
- [ ] All 6 products appear
- [ ] Variant dropdowns work
- [ ] Selecting "Natural Diamond" shows "Price on Request"
- [ ] "Request Price Quote" button opens modal
- [ ] Diamond shape selector works
- [ ] Birthstone selector adds €40
- [ ] Lab-grown diamonds can be added to cart
- [ ] Checkout flow works

### 3. Activate Checkout (if not already done)

1. Go to Shopify Admin → **Settings** → **Checkout**
2. Find your checkout profile
3. Click **Activate** if it's in preview mode
4. This removes `profile_preview_token` from URLs

---

## Troubleshooting

### Error: "Missing required environment variables"
**Cause:** .env file not created or tokens missing  
**Fix:** Create .env file with all 3 variables (see Step 2 above)

### Error: "Shopify API error: 401"
**Cause:** Invalid or missing API token  
**Fix:** Get new tokens from Shopify Admin (see Step 1 above)

### Error: "Shopify API error: 403"
**Cause:** API token doesn't have required permissions  
**Fix:** Go to Shopify Admin → Apps → Your app → Configure → Enable `write_products` permission

### Error: "Rate limit exceeded"
**Cause:** Too many API calls in short time  
**Fix:** Wait 2-3 minutes and run again. Scripts have delays but Shopify may still throttle.

### Products created but not showing on frontend
**Cause:** Products not synced  
**Fix:** Run `npm run fetch-products`

### Variants not showing correctly
**Cause:** Old product structure conflicting  
**Fix:** Manually delete products in Shopify Admin and re-run scripts

---

## Running Individual Scripts

If you want to set up products one at a time:

```bash
# Just necklaces
npm run setup-necklaces

# Just earrings  
npm run setup-earrings

# Just engagement rings (4 models)
npm run setup-engagement-rings

# Fetch products after any setup
npm run fetch-products
```

---

## Expected Timeline

- **Get API credentials:** 2-3 minutes
- **Create .env file:** 1 minute
- **Run scripts:** 2-3 minutes
- **Add product images:** 15-30 minutes
- **Test and verify:** 5-10 minutes

**Total:** 25-47 minutes

---

## Success Criteria

✅ You're done when:
- [ ] All 6 products exist in Shopify Admin
- [ ] Each product has the correct number of variants
- [ ] All variants show correct prices
- [ ] Natural Diamond variants show €0
- [ ] Products have images
- [ ] Products appear on frontend
- [ ] Natural Diamond shows "Request Quote" button
- [ ] Lab-grown diamonds can be purchased
- [ ] Diamond shape selector works
- [ ] Birthstone selector works

---

## Need Help?

1. Check script console output for errors
2. Review Shopify Admin for created products
3. Verify API permissions in Shopify Admin
4. Check .env file has all 3 variables
5. Try running scripts individually to isolate issues

---

**Ready to execute? Follow Option 1 (Local) for quickest setup!** 🚀

Last Updated: December 23, 2024
