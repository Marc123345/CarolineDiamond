# Add to Cart & Checkout Flow - Troubleshooting Guide

## Expected Flow

When you click **"Toevoegen aan winkelwagen"** (Add to Cart), here's what should happen:

### Step 1: Add to Cart Button Click
- Button shows "Toevoegen aan winkelwagen..." (Adding to cart...)
- Console logs: `🛒 Adding to cart: { variantId, quantity, attributes }`

### Step 2: Item Added to Cart
- Console logs: `✅ Successfully added to cart - cart should be opening`
- Console logs: `🛒 CartContext: addToCart called`
- Console logs: `✅ CartContext: Item added successfully, opening cart...`
- Console logs: `✅ CartContext: Cart opened (isOpen set to true)`

### Step 3: Cart Drawer Opens Automatically
- A full-screen overlay appears with dark backdrop
- Cart slides in showing your items
- You should see:
  - Your product with image and details
  - Quantity controls (+/-)
  - Price and total
  - **Big "Checkout" button at the bottom**

### Step 4: Click Checkout Button
- Console logs: `🚀 Proceeding to checkout...`
- Console logs: `Checkout URL: https://...`
- Console logs: `✅ Opening checkout flow modal...`

### Step 5: Checkout Flow Modal Appears
- Modal shows "Checkout" title
- "Preparing your order..." message
- Security badges (SSL, multiple payments, Shopify)
- Progress bar animation
- "Proceed Now" button
- "Auto-redirecting in 3 seconds..."

### Step 6: Redirect to Shopify
- You're redirected to: `https://uyccca-1e.myshopify.com/checkouts/...`
- Shopify checkout page loads
- Complete payment with test card

---

## Troubleshooting

### Issue 1: Cart Doesn't Open After Clicking "Add to Cart"

**Check browser console for:**
```
❌ Failed to add to cart: [error message]
```

**Possible Causes:**
1. **Shopify API Error** - Check connection test at `/test-connection`
2. **Network Issue** - Check browser network tab for failed requests
3. **Invalid Variant ID** - Product variant might be missing

**Solutions:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "Add to Cart" again
4. Look for error messages (red text starting with ❌)
5. Share the error message for specific help

### Issue 2: Cart Opens But Shows Empty

**Check console for:**
```
✅ CartContext: Item added successfully
```
But cart is empty.

**Solutions:**
1. Refresh the page
2. Clear browser cache (Ctrl+Shift+Del)
3. Try in incognito mode
4. Check if Shopify store is published

### Issue 3: Can't Find Checkout Button

**The checkout button should be:**
- At the bottom of the cart drawer
- Big button with text "Checkout"
- Blue/primary color
- Has arrow icon →

**If you don't see it:**
1. Scroll down in the cart drawer
2. Check if cart has items (checkout disabled when empty)
3. Make sure cart drawer is fully visible

### Issue 4: Clicking Checkout Does Nothing

**Check console for:**
```
❌ Cannot proceed to checkout - missing URL or cart
```

**Solutions:**
1. Close and reopen cart
2. Remove item and add again
3. Check `/test-connection` page for API issues

### Issue 5: Checkout Modal Doesn't Redirect

**Check console for:**
```
✅ Opening checkout flow modal...
```

**If modal opens but doesn't redirect:**
1. Click "Proceed Now" button manually
2. Check browser blocks pop-ups/redirects
3. Look for JavaScript errors in console

---

## Testing Steps

### Test 1: Verify Shopify Connection
```bash
# Start dev server
npm run dev

# Open browser
http://localhost:5173/test-connection

# Expected: All tests show green checkmarks ✅
```

### Test 2: Test Add to Cart Flow
```bash
# Open a product page
http://localhost:5173/product/[any-product-handle]

# Open browser console (F12 > Console tab)

# Click "Toevoegen aan winkelwagen"

# Expected console output:
🛒 Adding to cart: ...
✅ Successfully added to cart - cart should be opening
🛒 CartContext: addToCart called
✅ CartContext: Item added successfully, opening cart...
✅ CartContext: Cart opened (isOpen set to true)
```

### Test 3: Test Checkout Flow
```bash
# After cart opens, find the "Checkout" button at bottom

# Click it

# Expected console output:
🚀 Proceeding to checkout...
Checkout URL: https://uyccca-1e.myshopify.com/checkouts/...
Cart: { id: "...", checkoutUrl: "..." }
✅ Opening checkout flow modal...
```

### Test 4: Test Complete Purchase
```bash
# After redirect to Shopify:

# Use test card:
Card: 4242 4242 4242 4242
Expiry: 12/25
CVV: 123

# Complete payment

# Check order in:
- Shopify Admin: Orders
- Your app: /account/orders
- Supabase: orders table
```

---

## Common Console Errors & Solutions

### Error: "Shopify client not available"
**Solution:** Check environment variables in `.env`:
```
VITE_SHOPIFY_STORE_DOMAIN=uyccca-1e.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=6d5b53d4febcee361def0943d64079d2
```
Restart dev server after changes.

### Error: "Cannot add to cart: Missing variant or product"
**Solution:** The product variant is invalid. Check:
1. Product exists in Shopify
2. Variant is available for sale
3. Product has proper options configured

### Error: "Failed to fetch cart"
**Solution:**
1. Check network connection
2. Verify Shopify store is accessible
3. Try `/test-connection` page
4. Clear localStorage and try again

### Error: "Cannot proceed to checkout - missing URL or cart"
**Solution:**
1. Cart wasn't created properly
2. Remove items from cart
3. Add items again
4. Try refreshing the page

---

## Visual Guide: Where to Click

### 1. Product Page
```
┌─────────────────────────────────────┐
│  Product Name                        │
│  €2,500                              │
│                                      │
│  [Image]                             │
│                                      │
│  Options: Color, Size, etc.          │
│                                      │
│  ┌─────────────────────────────────┐│
│  │ Toevoegen aan winkelwagen       ││  ← CLICK HERE
│  └─────────────────────────────────┘│
│                                      │
│  Veilig betalen via Shopify •        │
│  Gratis verzending • 14 dagen retour │
└─────────────────────────────────────┘
```

### 2. Cart Drawer (Should Open Automatically)
```
┌─────────────────────────────────────┐
│  ← Winkelwagen               [X]     │
│                                      │
│  ┌─────────────────────────────────┐│
│  │ [Image] Product Name            ││
│  │         €2,500  [−] 1 [+]       ││
│  └─────────────────────────────────┘│
│                                      │
│  Subtotal: €2,500                    │
│  Verzending: GRATIS                  │
│  Totaal: €2,500                      │
│                                      │
│  ┌─────────────────────────────────┐│
│  │ Checkout →                      ││  ← CLICK HERE
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### 3. Checkout Flow Modal (Appears After Clicking Checkout)
```
┌─────────────────────────────────────┐
│           [Shopping Bag Icon]        │
│                                      │
│             Checkout                 │
│                                      │
│  You will be redirected to our       │
│  secure Shopify checkout page        │
│                                      │
│  ✓ SSL encrypted checkout            │
│  ✓ Multiple payment options          │
│  ✓ Secure Shopify platform           │
│                                      │
│  [████████░░░░░░░░] Progress         │
│                                      │
│  ┌─────────┐  ┌──────────────────┐ │
│  │ Cancel  │  │ Proceed Now →    │ │  ← CLICK HERE
│  └─────────┘  └──────────────────┘ │
│                                      │
│  Redirecting automatically in 3s...  │
└─────────────────────────────────────┘
```

### 4. Shopify Checkout (After Redirect)
```
┌─────────────────────────────────────┐
│  [Shopify Logo]                      │
│                                      │
│  Contact Information                 │
│  ┌─────────────────────────────────┐│
│  │ Email                           ││
│  └─────────────────────────────────┘│
│                                      │
│  Shipping Address                    │
│  ┌─────────────────────────────────┐│
│  │ First name, Last name           ││
│  │ Address, City, Postal code      ││
│  └─────────────────────────────────┘│
│                                      │
│  Payment                             │
│  ┌─────────────────────────────────┐│
│  │ Card: 4242 4242 4242 4242      ││
│  │ Expiry: 12/25  CVV: 123         ││
│  └─────────────────────────────────┘│
│                                      │
│  ┌─────────────────────────────────┐│
│  │ Complete Order                  ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## Debug Mode

To see detailed logging, open browser console (F12) and watch for:

**Adding to Cart:**
- 🛒 messages show cart operations
- ✅ messages show successful steps
- ❌ messages show errors

**Example of successful flow:**
```
🛒 Adding to cart: { variantId: "...", quantity: 1 }
✅ Successfully added to cart - cart should be opening
🛒 CartContext: addToCart called
✅ CartContext: Item added successfully, opening cart...
✅ CartContext: Cart opened (isOpen set to true)

[User clicks Checkout button]

🚀 Proceeding to checkout...
Checkout URL: https://uyccca-1e.myshopify.com/checkouts/...
✅ Opening checkout flow modal...

[Automatic redirect after 3 seconds]
```

---

## Still Having Issues?

1. **Run Connection Test**
   - Visit: http://localhost:5173/test-connection
   - All tests should be green ✅
   - If any fail, fix those first

2. **Check Browser Console**
   - Press F12 to open DevTools
   - Click Console tab
   - Look for red error messages
   - Share the error for specific help

3. **Try Incognito Mode**
   - Open incognito/private window
   - Test the flow again
   - This rules out cache/extension issues

4. **Clear Browser Data**
   - Press Ctrl+Shift+Delete
   - Clear cache and cookies
   - Restart browser
   - Test again

5. **Check Shopify Store**
   - Log into Shopify Admin
   - Verify products exist
   - Check store is published
   - Ensure variants have inventory

---

## Success Indicators

You know it's working when:

✅ Cart opens automatically after adding item
✅ Product appears in cart with correct details
✅ "Checkout" button is visible at bottom
✅ Clicking Checkout opens modal
✅ Modal redirects to Shopify after 3 seconds
✅ Shopify checkout page loads successfully
✅ Test payment completes
✅ Order appears in "My Orders" page

---

## Quick Reference

**Add to Cart Flow:**
Product Page → Click "Toevoegen aan winkelwagen" → Cart Opens → Click "Checkout" → Checkout Modal → Redirect to Shopify → Complete Payment

**Console Commands:**
```javascript
// Check if cart is open
localStorage.getItem('shopify_cart_id')

// Clear cart (if stuck)
localStorage.removeItem('shopify_cart_id')
// Then refresh page
```

**URLs to Test:**
- Connection Test: http://localhost:5173/test-connection
- Shop: http://localhost:5173/shop
- Sample Product: http://localhost:5173/product/[any-handle]
- My Orders: http://localhost:5173/account/orders

**Test Card:**
- Card: 4242 4242 4242 4242
- Expiry: 12/25
- CVV: 123
- Name: Any name
