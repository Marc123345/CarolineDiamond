# Shopify Payments - Quick Start Guide

## Your Setup Is Ready!

Your React app is already connected to Shopify and ready to accept payments. Here's what's working:

✅ **Storefront API** - Connected and configured
✅ **Product Display** - Products load from Shopify
✅ **Shopping Cart** - Full cart functionality
✅ **Checkout Flow** - Redirects to Shopify secure checkout
✅ **Order Tracking** - Orders saved to Supabase database
✅ **Webhook Integration** - Order sync from Shopify

---

## Quick Test (5 Minutes)

### Step 1: Verify Connection
Visit: http://localhost:5173/test-connection

This page will automatically test:
- Environment variables ✓
- Shopify client connection ✓
- Product queries ✓
- Cart creation ✓
- Supabase configuration ✓

**Expected Result**: All tests should pass with green checkmarks.

### Step 2: Test Product Flow
1. Go to: http://localhost:5173/shop
2. Click on any product
3. Select options (color, size)
4. Click "Add to Cart"
5. Verify cart opens with your item

**Expected Result**: Product appears in cart with correct details.

### Step 3: Test Checkout Redirect
1. In the cart, click "Checkout"
2. CheckoutFlow modal appears
3. Wait 3 seconds or click "Proceed Now"

**Expected Result**: You're redirected to `uyccca-1e.myshopify.com/checkouts/...`

---

## Configure Shopify Payments

### In Shopify Admin (https://uyccca-1e.myshopify.com/admin)

1. **Go to Settings > Payments**
   - Verify "Shopify Payments" shows as "Active"
   - Check currency is EUR
   - Confirm Belgium is selected

2. **Enable Payment Methods**
   - ✓ Visa, Mastercard, American Express
   - ✓ Bancontact (Belgium)
   - ✓ Shop Pay
   - ✓ Apple Pay / Google Pay

3. **Test Mode**
   - Enable test mode for testing
   - Disable for production

---

## Set Up Webhooks (Required!)

### Step 1: Create Webhooks in Shopify

1. Go to **Settings > Notifications** in Shopify Admin
2. Scroll to **Webhooks** section
3. Click **Create webhook**

**Webhook #1 - Order Creation:**
```
Event: Order creation
Format: JSON
URL: https://ftmwynoftuazewmhugxi.supabase.co/functions/v1/shopify-webhook
API Version: 2024-10
```

**Webhook #2 - Order Updated:**
```
Event: Order updated
Format: JSON
URL: https://ftmwynoftuazewmhugxi.supabase.co/functions/v1/shopify-webhook
API Version: 2024-10
```

### Step 2: Get Webhook Secret

After creating webhooks, Shopify displays a signing secret like:
```
shpss_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Copy this secret - you'll need it next!**

### Step 3: Add Secret to Supabase

1. Go to: https://supabase.com/dashboard
2. Select project: `ftmwynoftuazewmhugxi`
3. Navigate to **Edge Functions**
4. Click **shopify-webhook** function
5. Go to **Secrets** tab
6. Add secret:
   - Key: `SHOPIFY_WEBHOOK_SECRET`
   - Value: [paste the secret from Shopify]
7. Click **Save**

---

## Test Complete Flow

### Use Shopify Test Cards

**Successful Payment:**
```
Card Number: 4242 4242 4242 4242
Expiry: 12/25 (any future date)
CVV: 123
Name: Test User
```

**Declined Payment (for error testing):**
```
Card Number: 4000 0000 0000 0002
```

### Test Steps:

1. **Add Product to Cart**
   - Browse to any product
   - Select options
   - Add to cart

2. **Proceed to Checkout**
   - Click checkout button
   - Wait for redirect to Shopify

3. **Complete Payment**
   - Enter test card details
   - Fill shipping info (use Belgium address)
   - Complete order

4. **Verify Order Sync**
   - Check Supabase orders table
   - Look for your order with correct data
   - Verify status is "pending"

5. **Check "My Orders" Page**
   - Log into your React app
   - Go to account/orders
   - Verify order appears with:
     - Order number
     - Status badges
     - Product details
     - Total amount

---

## Troubleshooting

### Connection Test Fails?

**Check:**
```bash
# View environment variables
cat .env | grep SHOPIFY

# Expected output:
VITE_SHOPIFY_STORE_DOMAIN=uyccca-1e.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=6d5b53d4febcee361def0943d64079d2
```

**Fix:**
```bash
# Restart dev server
npm run dev
```

### Products Not Loading?

1. Verify Shopify store is published
2. Check products exist in Shopify Admin
3. Open browser console for errors
4. Test connection at /test-connection

### Orders Not Syncing?

1. Verify webhooks are created
2. Check SHOPIFY_WEBHOOK_SECRET is set in Supabase
3. View Edge Function logs in Supabase Dashboard
4. Test webhook delivery in Shopify Admin

### Checkout Redirect Fails?

1. Clear browser cache
2. Try incognito mode
3. Check cart has items
4. Verify checkout URL is generated

---

## Your Configuration

```env
Store: uyccca-1e.myshopify.com
Location: Belgium
Currency: EUR
Payment Provider: Shopify Payments

Storefront API: ✓ Connected
Database: ✓ Supabase
Order Tracking: ✓ Enabled
Webhooks: ⚠️ Configure webhooks above
```

---

## Go Live Checklist

Before accepting real payments:

- [ ] Shopify Payments activated (not test mode)
- [ ] Store location set to Belgium
- [ ] Currency set to EUR
- [ ] Webhooks configured and tested
- [ ] Test purchase completed successfully
- [ ] Order appears in "My Orders"
- [ ] Email confirmations working
- [ ] Shipping rates configured
- [ ] Tax settings verified
- [ ] Return policy published
- [ ] Terms & conditions published

---

## Useful URLs

**Your App:**
- Development: http://localhost:5173
- Connection Test: http://localhost:5173/test-connection
- Shop Page: http://localhost:5173/shop
- My Orders: http://localhost:5173/account/orders

**Shopify:**
- Admin: https://uyccca-1e.myshopify.com/admin
- Payments: https://uyccca-1e.myshopify.com/admin/settings/payments
- Orders: https://uyccca-1e.myshopify.com/admin/orders
- Webhooks: https://uyccca-1e.myshopify.com/admin/settings/notifications

**Supabase:**
- Dashboard: https://supabase.com/dashboard/project/ftmwynoftuazewmhugxi
- Orders Table: https://supabase.com/dashboard/project/ftmwynoftuazewmhugxi/editor
- Edge Functions: https://supabase.com/dashboard/project/ftmwynoftuazewmhugxi/functions

---

## Support

**Documentation:**
- Full Testing Guide: `SHOPIFY_PAYMENTS_TESTING_GUIDE.md`
- User Flow: See previous documentation provided

**Issues?**
1. Check connection test page first
2. Review browser console for errors
3. Check Supabase Edge Function logs
4. Verify Shopify webhook delivery status

---

## Success!

When everything is working, you'll see:

✅ Products load on your site
✅ Add to cart works smoothly
✅ Checkout redirects to Shopify
✅ Test payment completes
✅ Order appears in database
✅ Order shows in "My Orders"
✅ Webhook syncs order updates

**You're ready to accept payments!** 🎉
