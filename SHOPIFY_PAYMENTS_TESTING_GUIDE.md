# Shopify Payments Testing Guide

This guide will help you verify that your React app is properly synchronized with Shopify Payments.

## Prerequisites

- Shopify Store: `uyccca-1e.myshopify.com`
- Store Location: Belgium
- Currency: EUR
- Shopify Payments: Must be activated

---

## Step 1: Verify Shopify Payments Setup

### 1.1 Check Payment Provider Status

1. Log into Shopify Admin: https://uyccca-1e.myshopify.com/admin
2. Navigate to **Settings > Payments**
3. Verify **Shopify Payments** shows as "Active"
4. Confirm the following are enabled:
   - ✅ Visa, Mastercard, American Express
   - ✅ Bancontact (Belgium)
   - ✅ iDEAL (if serving Dutch customers)
   - ✅ Shop Pay
   - ✅ Apple Pay / Google Pay

### 1.2 Verify Store Settings

1. Go to **Settings > General**
2. Confirm:
   - Store address: Belgium
   - Store currency: EUR (€)
   - Timezone: Europe/Brussels or appropriate

### 1.3 Check Test Mode Status

- **IMPORTANT**: For production, test mode must be OFF
- For testing, you can enable test mode temporarily
- Navigate to **Settings > Payments > Shopify Payments > Manage**
- Check test mode status

---

## Step 2: Test Storefront API Connection

### 2.1 Verify Environment Variables

Check your `.env` file contains:

```
VITE_SHOPIFY_STORE_DOMAIN=uyccca-1e.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=6d5b53d4febcee361def0943d64079d2
```

### 2.2 Test Connection in Browser

1. Start your React app: `npm run dev`
2. Open browser developer console (F12)
3. Look for these logs:
   - ✅ "Shopify client initialized successfully"
   - ✅ "Shopify connection test successful"
   - ✅ Shop name displayed

### 2.3 Test Product Loading

1. Navigate to `/shop` page
2. Verify products display with:
   - Product images
   - Product names and descriptions
   - Prices in EUR (€)
   - "Add to Cart" buttons
3. Check console for any GraphQL errors

---

## Step 3: Test Complete Checkout Flow

### 3.1 Create Test Account

1. Go to your React app
2. Click "Sign In" or "Create Account"
3. Register with a test email (e.g., test@example.com)
4. Verify email confirmation if enabled

### 3.2 Add Products to Cart

1. Browse to a product page
2. Select options (color, size, customization)
3. Click "Add to Cart"
4. Verify cart opens and shows:
   - Product image and name
   - Selected variant details
   - Correct price
   - Quantity controls
   - Cart total

### 3.3 Test Checkout Flow

1. Click "Checkout" button in cart
2. Verify CheckoutFlow modal appears showing:
   - Order summary
   - Security badges (SSL, Secure Shopify)
   - Auto-redirect countdown
3. Wait or click "Proceed Now"
4. Confirm redirect to Shopify checkout page

### 3.4 Complete Test Payment

**Use Shopify Test Cards (Belgium):**

✅ **Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/25` (any future date)
- CVV: `123`
- Name: Any name
- Postal code: Any valid Belgian postal code

✅ **Declined Payment (for testing errors):**
- Card: `4000 0000 0000 0002`

**Complete the checkout:**
1. Enter test card details
2. Fill shipping information
3. Click "Complete Order"
4. Verify success page appears

---

## Step 4: Configure Shopify Webhooks

### 4.1 Get Your Webhook URL

Your webhook endpoint is:
```
https://ftmwynoftuazewmhugxi.supabase.co/functions/v1/shopify-webhook
```

### 4.2 Add Webhooks in Shopify

1. Go to Shopify Admin
2. Navigate to **Settings > Notifications**
3. Scroll to **Webhooks** section
4. Click **Create webhook**

**Webhook 1: Order Creation**
- Event: `Order creation`
- Format: `JSON`
- URL: `https://ftmwynoftuazewmhugxi.supabase.co/functions/v1/shopify-webhook`
- API version: `2024-10` (latest stable)

**Webhook 2: Order Updated**
- Event: `Order updated`
- Format: `JSON`
- URL: Same as above
- API version: `2024-10`

5. Click **Save** for each webhook

### 4.3 Get Webhook Secret

1. After creating webhooks, Shopify displays a signing secret
2. Copy this secret (it looks like: `shpss_xxxxx...`)
3. **IMPORTANT**: Save this secret - you'll need it next

---

## Step 5: Configure Supabase Edge Function

### 5.1 Add Webhook Secret to Supabase

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ftmwynoftuazewmhugxi`
3. Navigate to **Edge Functions** (left sidebar)
4. Click on **shopify-webhook** function
5. Go to **Secrets** tab
6. Add new secret:
   - Key: `SHOPIFY_WEBHOOK_SECRET`
   - Value: [paste the secret from Shopify]
7. Click **Save**

### 5.2 Deploy Edge Function

If you haven't deployed the webhook function yet:

```bash
# Make sure you're in project directory
cd /path/to/project

# Deploy the function
npx supabase functions deploy shopify-webhook
```

---

## Step 6: Test Order Synchronization

### 6.1 Complete a Test Order

1. Go through complete checkout flow again
2. Complete payment with test card
3. Note the order number from Shopify confirmation

### 6.2 Verify Order in Supabase

1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. Open `orders` table
4. Look for your test order
5. Verify it contains:
   - ✅ Order number matching Shopify
   - ✅ User ID linked to your account
   - ✅ Status: "pending" or "processing"
   - ✅ All cart items in `items` JSON field
   - ✅ Correct total amount
   - ✅ `shopify_checkout_id` populated

### 6.3 Check Webhook Logs

1. In Supabase Dashboard, go to **Edge Functions**
2. Click **shopify-webhook**
3. View **Logs** tab
4. Look for webhook execution logs
5. Verify no errors appear

### 6.4 Verify in Shopify Admin

1. Go to Shopify Admin
2. Navigate to **Orders**
3. Find your test order
4. Check webhook delivery:
   - Click on order
   - Scroll to **Timeline**
   - Look for webhook events
   - Should show "200 OK" status

---

## Step 7: Test Frontend Order Display

### 7.1 View My Orders Page

1. In your React app, log in with test account
2. Navigate to **My Orders** page
3. Verify your test order appears in list

### 7.2 Check Order Details

Verify the order displays:
- ✅ Order number (e.g., ORD-1234567890-ABC123)
- ✅ Order date (formatted correctly)
- ✅ Status badge (color-coded)
- ✅ Financial status (paid/pending)
- ✅ Fulfillment status (unfulfilled/fulfilled)
- ✅ Product images and names
- ✅ Quantities and prices
- ✅ Total amount
- ✅ "Synced with Shopify" indicator

### 7.3 Test Order Updates

1. In Shopify Admin, update order status:
   - Mark as "Fulfilled" or add tracking
2. Wait 1-2 minutes for webhook
3. Refresh "My Orders" page in React app
4. Verify changes appear

---

## Step 8: Test Different Payment Methods

### 8.1 Test Credit Cards

Test with different card types:
- ✅ Visa: `4242 4242 4242 4242`
- ✅ Mastercard: `5555 5555 5555 4444`
- ✅ American Express: `3782 822463 10005`

### 8.2 Test Bancontact (Belgium)

1. During checkout, select Bancontact
2. Use test credentials provided by Shopify
3. Complete payment
4. Verify order syncs correctly

### 8.3 Test Payment Declines

1. Use decline test card: `4000 0000 0000 0002`
2. Complete checkout
3. Verify proper error handling
4. Confirm no order created in database

---

## Step 9: Test Mobile Experience

### 9.1 Mobile Checkout Flow

1. Open site on mobile device or use responsive mode
2. Test complete flow:
   - Browse products
   - Add to cart
   - Open cart drawer
   - Proceed to checkout
3. Verify:
   - ✅ Touch targets are 44px minimum
   - ✅ Cart scrolls properly
   - ✅ Buttons are easily tappable
   - ✅ Text is readable
   - ✅ Checkout redirect works

### 9.2 Mobile Payment Methods

Test that Shopify checkout shows:
- ✅ Apple Pay (on iOS Safari)
- ✅ Google Pay (on Android Chrome)
- ✅ Standard card entry
- ✅ Mobile-optimized layout

---

## Step 10: Production Readiness

### 10.1 Security Checklist

- ✅ Shopify Payments in LIVE mode (not test)
- ✅ HTTPS enabled on your domain
- ✅ Environment variables secured
- ✅ Webhook secrets configured
- ✅ API tokens have correct permissions

### 10.2 Performance Checklist

- ✅ Products load quickly (< 2 seconds)
- ✅ Cart operations are instant
- ✅ Images optimized
- ✅ No console errors
- ✅ Database queries efficient

### 10.3 Customer Experience Checklist

- ✅ Clear pricing in EUR
- ✅ Shipping costs displayed
- ✅ Tax information shown
- ✅ Return policy accessible
- ✅ Contact information visible
- ✅ Order confirmation emails sent

---

## Troubleshooting

### Issue: Products Not Loading

**Check:**
- Environment variables are set correctly
- Shopify store is published
- Storefront API access token has correct permissions
- Console shows any GraphQL errors

**Solution:**
```bash
# Verify .env file
cat .env | grep SHOPIFY

# Restart dev server
npm run dev
```

### Issue: Checkout Redirect Fails

**Check:**
- Cart contains items
- Shopify checkout URL is valid
- No browser console errors

**Solution:**
- Clear browser cache
- Try incognito mode
- Check cart data structure

### Issue: Orders Not Syncing

**Check:**
- Webhooks are configured in Shopify
- Webhook secret matches in Supabase
- Edge function logs show webhook receipt
- No HMAC signature validation errors

**Solution:**
1. Verify webhook URL is correct
2. Check Edge Function logs in Supabase
3. Test webhook manually in Shopify Admin
4. Ensure SHOPIFY_WEBHOOK_SECRET is set

### Issue: Payment Declines

**Check:**
- Using correct test card numbers
- Test mode is enabled if testing
- Card details are complete
- Billing address matches

**Solution:**
- Use Shopify's official test cards
- Check Shopify Payments status
- Review payment gateway logs

---

## Success Criteria

Your integration is successful when:

1. ✅ Products display correctly with EUR pricing
2. ✅ Cart operations work smoothly
3. ✅ Checkout redirects to Shopify successfully
4. ✅ Test payments process without errors
5. ✅ Orders appear in Supabase database
6. ✅ Orders display in "My Orders" page
7. ✅ Webhooks sync order updates
8. ✅ All payment methods work
9. ✅ Mobile experience is smooth
10. ✅ No console errors or warnings

---

## Next Steps After Testing

Once testing is complete and successful:

1. **Switch to Live Mode**
   - Disable test mode in Shopify Payments
   - Update to live API credentials if needed
   - Test with real payment (small amount)

2. **Monitor First Real Orders**
   - Watch for webhook delivery
   - Verify order sync happens
   - Check customer email confirmations

3. **Set Up Monitoring**
   - Monitor Edge Function logs
   - Track failed webhook deliveries
   - Set up error alerting

4. **Launch**
   - Announce to customers
   - Monitor first week closely
   - Gather feedback

---

## Support Resources

**Shopify Documentation:**
- Payments: https://help.shopify.com/en/manual/payments
- Webhooks: https://shopify.dev/docs/admin-api/webhooks
- Storefront API: https://shopify.dev/docs/storefront-api

**Supabase Documentation:**
- Edge Functions: https://supabase.com/docs/guides/functions
- Database: https://supabase.com/docs/guides/database

**Contact Support:**
- Shopify Support: https://help.shopify.com
- Supabase Support: https://supabase.com/support
