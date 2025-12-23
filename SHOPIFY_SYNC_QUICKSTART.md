# Shopify Sync - Quick Start

Your Shopify backend synchronization system is ready! Here's how to activate it.

## What's Already Done ✅

- Edge functions deployed to Supabase
- Database tables created
- Frontend hooks ready
- Cron job function deployed
- Real-time inventory monitoring enabled

## 5-Minute Setup

### 1. Configure Shopify Webhooks (3 minutes)

Go to Shopify Admin → Settings → Notifications → Webhooks

**Create two webhooks:**

**Webhook 1: Order Creation**
- Event: `Order creation`
- URL: `https://YOUR-PROJECT.supabase.co/functions/v1/shopify-webhook`
- Format: JSON
- Version: 2024-10

**Webhook 2: Order Updated**
- Event: `Order updated`
- URL: `https://YOUR-PROJECT.supabase.co/functions/v1/shopify-webhook`
- Format: JSON
- Version: 2024-10

### 2. Set Up Inventory Sync (2 minutes)

**Option A: Using cron-job.org (Easiest)**

1. Sign up at https://cron-job.org
2. Create new cron job:
   - Title: "Inventory Sync"
   - URL: `https://YOUR-PROJECT.supabase.co/functions/v1/inventory-sync-cron`
   - Schedule: Every 30 minutes
   - Method: POST
   - Headers:
     ```
     Authorization: Bearer YOUR-SUPABASE-ANON-KEY
     Content-Type: application/json
     ```

**Option B: Using Supabase Cron Extension**

Run this SQL in Supabase SQL Editor:

```sql
SELECT cron.schedule(
  'inventory-sync-job',
  '*/30 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR-PROJECT.supabase.co/functions/v1/inventory-sync-cron',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR-ANON-KEY',
      'Content-Type', 'application/json'
    )
  );
  $$
);
```

### 3. Test It (1 minute)

**Test webhook:**
1. Create a test order in Shopify
2. Check Supabase Dashboard → Table Editor → `orders` table
3. You should see your order appear within 1 minute

**Test inventory sync:**
1. Trigger manual sync:
   ```bash
   curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/inventory-sync \
     -H "Authorization: Bearer YOUR-ANON-KEY"
   ```
2. Check `inventory_snapshots` table for new entries

## Using the System

### Show Inventory Status on Product Pages

```tsx
import { InventoryStatus } from '../components/InventoryStatus';

<InventoryStatus
  productId={product.id}
  variantId={selectedVariant?.id}
  showQuantity={true}
/>
```

### Track Product Performance

Already integrated! Every product view and cart add is automatically tracked.

### Monitor Sync Health

Add to admin dashboard:

```tsx
import { SyncStatusWidget } from '../components/admin/SyncStatusWidget';

<SyncStatusWidget />
```

## What Gets Synced

### Orders (Real-time via Webhooks)
- Order number, status, items
- Customer info, shipping address
- Payment status, totals
- Shopify order ID for reference

### Inventory (Every 30 minutes)
- Product availability
- Quantity on hand
- Price updates
- Low stock alerts

### Product Performance (Real-time)
- Page views
- Add to cart events
- Purchase tracking
- Revenue attribution

## Troubleshooting

**Orders not appearing?**
- Check webhook URL is correct
- Verify webhooks are active in Shopify
- Check function logs: `supabase functions logs shopify-webhook`

**Inventory not syncing?**
- Verify cron job is running
- Check Shopify API credentials in `.env`
- Test manual sync: `curl -X POST [sync-url]`

**Performance tracking not working?**
- Check database functions exist in migrations
- Verify Supabase client is configured
- Check browser console for errors

## Next Steps

1. ✅ Set up webhooks (3 mins)
2. ✅ Configure cron sync (2 mins)
3. ✅ Test both systems (1 min)
4. 📊 Add admin dashboard (optional)
5. 🔔 Configure low stock alerts (optional)

Everything is ready - just needs activation!

For detailed documentation, see: `SHOPIFY_BACKEND_SYNC_SETUP.md`
