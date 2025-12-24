# Shopify Tag Migration Guide

## Problem

Your products show "No Solitaire rings" because Shopify products have **lowercase tags** (`solitaire`, `halo`, `lab-grown`) but your filter system expects **proper case tags** (`Solitaire`, `Halo`, `Lab-Grown Diamond`).

## Solution

Run the bulk tag migration script to automatically add proper tags to all your Shopify products.

---

## Step 1: Get Shopify Admin API Access Token

1. **Go to your Shopify Admin**: https://uyccca-1e.myshopify.com/admin

2. **Navigate to**: Settings → Apps and sales channels → Develop apps

3. **Click**: "Create an app" (or use existing app)
   - App name: "Product Tag Manager" (or any name you like)

4. **Configure Admin API scopes**:
   - Click "Configure Admin API scopes"
   - Enable these permissions:
     - ✅ `read_products`
     - ✅ `write_products`
   - Click "Save"

5. **Install the app**:
   - Click "Install app"
   - Confirm installation

6. **Get the Admin API access token**:
   - Click "Reveal token once" under "Admin API access token"
   - **COPY THIS TOKEN** - you'll only see it once!
   - Format: `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

7. **Add token to your .env file**:
   ```bash
   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_actual_token_here
   ```

---

## Step 2: Run the Migration Script

### Preview what will change (Dry Run)

First, analyze your current tags:

```bash
npm run analyze-tags
```

This shows:
- Current tags on all products
- What tags will be added
- Products that need updates

### Run the actual migration

```bash
npm run migrate-tags
```

This will:
1. Fetch all products from Shopify
2. Keep existing lowercase tags (for backward compatibility)
3. Add proper case tags: `Solitaire`, `Halo`, `Lab-Grown Diamond`, etc.
4. Infer missing tags from product titles
5. Update each product automatically

**Example output:**
```
[1/50] 🔄 Solitaire Ring with Labgrown Diamond
      Current tags: engagement-ring, diamond, halo, solitaire, lab-grown
      Added "Solitaire" (from "solitaire")
      Added "Lab-Grown Diamond" (from "lab-grown")
      Added "Round" (inferred from title/tags)
      Added "Rose Gold" (inferred from title/tags)
      Added "Yellow Gold" (inferred from title/tags)
      Added "White Gold" (inferred from title/tags)
      New tags: engagement-ring, diamond, halo, solitaire, lab-grown, Solitaire, Lab-Grown Diamond, Round, Rose Gold...
```

---

## Step 3: Verify the Fix

1. **Check in Shopify Admin**:
   - Go to Products → View any ring product
   - Tags section should now show both:
     - Old: `solitaire`, `lab-grown`
     - New: `Solitaire`, `Lab-Grown Diamond`, `Round`, etc.

2. **Test on your website**:
   - Go to Shop page
   - Click "Solitaire" filter
   - You should now see products!

---

## What Tags Will Be Added?

### Ring Styles
- `Solitaire` (for products with "solitaire" tag or in title)
- `Solitaire + Side Diamonds` (for products with "side diamonds" in title)
- `Halo` (for products with "halo" tag or in title)
- `Halo + Side Diamonds` (for halo rings with side diamonds)

### Diamond Origin
- `Lab-Grown Diamond` (from "lab-grown" or "labgrown")
- `Natural Diamond` (from "natural" or default for diamond rings)
- `Diamond` (generic diamond tag)

### Shapes (inferred or explicit)
- `Round`, `Oval`, `Princess`, `Pear`, `Marquise`, `Emerald`, `Cushion`
- Default to `Round` for engagement rings without explicit shape

### Metal Colors (inferred from variants)
- `Rose Gold`
- `Yellow Gold`
- `White Gold`

### Product Types
- `Engagement Ring`
- `Necklace`
- `Earrings`
- `Bracelet`

---

## Troubleshooting

### Error: "Missing required environment variables"
→ Make sure you added `SHOPIFY_ADMIN_ACCESS_TOKEN` to your `.env` file

### Error: "Shopify API error: 401"
→ Your Admin API token is invalid. Get a new one from Shopify Admin

### Error: "GraphQL errors: insufficient permissions"
→ Make sure your app has `read_products` and `write_products` permissions enabled

### Products still not showing in filters
→ Clear your browser cache and reload the page. The Shopify Storefront API may take a few minutes to index new tags.

---

## Alternative: Manual Tag Update

If you prefer to manually update tags:

1. Go to Shopify Admin → Products
2. For each Solitaire ring, add these tags:
   - `Solitaire` (capital S)
   - `Lab-Grown Diamond` or `Natural Diamond`
   - `Round` (or appropriate shape)
   - `Rose Gold`, `Yellow Gold`, `White Gold`

---

## Need Help?

If the migration script fails or you need assistance:

1. Check the console output for specific error messages
2. Run `npm run analyze-tags` to see current tag status
3. Verify your Admin API token has the correct permissions
4. Contact Shopify support if API access issues persist

---

## Summary

**Before Migration:**
```json
{
  "tags": ["engagement-ring", "diamond", "halo", "solitaire", "lab-grown"]
}
```

**After Migration:**
```json
{
  "tags": [
    "engagement-ring", "diamond", "halo", "solitaire", "lab-grown",
    "Solitaire", "Lab-Grown Diamond", "Round",
    "Rose Gold", "Yellow Gold", "White Gold", "Engagement Ring"
  ]
}
```

✅ Filters will now work correctly!
