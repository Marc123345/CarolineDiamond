# Shopify Backend Synchronization Setup

Complete guide to setting up real-time synchronization between Shopify and your application backend.

## Overview

The synchronization system consists of:

1. **Edge Functions** (Already Deployed ✅)
   - `shopify-webhook` - Receives order webhooks from Shopify
   - `inventory-sync` - Syncs inventory from Shopify Storefront API
   - `checkout-complete` - Records checkout completions
   - `inventory-sync-cron` - Scheduled inventory sync job

2. **Database Tables** (Already Created ✅)
   - `inventory_snapshots` - Inventory history
   - `inventory_alerts` - Low stock/out of stock alerts
   - `orders` - Order tracking
   - `product_performance` - Views, adds, purchases

3. **Frontend Hooks** (Just Created ✅)
   - `useProductPerformance` - Track product interactions
   - `useInventoryStatus` - Real-time inventory monitoring
   - `syncHelpers` - Manual sync utilities

## Step 1: Configure Shopify Webhooks

### Get Your Webhook URLs

Your edge functions are deployed at:

```
Webhook URL: https://[YOUR-PROJECT-REF].supabase.co/functions/v1/shopify-webhook
```

Replace `[YOUR-PROJECT-REF]` with your Supabase project reference.

### Create Webhook Secret

1. Generate a secure random string (32+ characters):
   ```bash
   openssl rand -base64 32
   ```

2. Add to Supabase Edge Function secrets:
   ```bash
   supabase secrets set SHOPIFY_WEBHOOK_SECRET=your_generated_secret
   ```

### Set Up Webhooks in Shopify

1. Go to **Shopify Admin** → **Settings** → **Notifications**
2. Scroll to **Webhooks** section
3. Click **Create webhook**

#### Orders/Create Webhook

- **Event**: `Order creation`
- **Format**: `JSON`
- **URL**: `https://[YOUR-PROJECT-REF].supabase.co/functions/v1/shopify-webhook`
- **Webhook API version**: `2024-10`

#### Orders/Updated Webhook

- **Event**: `Order updated`
- **Format**: `JSON`
- **URL**: `https://[YOUR-PROJECT-REF].supabase.co/functions/v1/shopify-webhook`
- **Webhook API version**: `2024-10`

4. Click **Save webhook**

### Verify Webhook Configuration

Test webhooks by creating a test order in Shopify:

```bash
# Check if order was recorded in database
psql [YOUR-SUPABASE-CONNECTION-STRING] -c "SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;"
```

## Step 2: Set Up Inventory Sync Schedule

### Option A: Supabase Cron (Recommended)

1. Deploy the cron function:
   ```bash
   supabase functions deploy inventory-sync-cron
   ```

2. Set up cron secret:
   ```bash
   supabase secrets set CRON_SECRET=$(openssl rand -base64 32)
   ```

3. Configure cron job in Supabase Dashboard:
   - Go to **Database** → **Cron Jobs**
   - Create new cron job:
     ```sql
     SELECT
       net.http_post(
         url := 'https://[YOUR-PROJECT-REF].supabase.co/functions/v1/inventory-sync-cron',
         headers := jsonb_build_object(
           'Content-Type', 'application/json',
           'Authorization', 'Bearer ' || '[YOUR-ANON-KEY]',
           'X-Cron-Secret', '[YOUR-CRON-SECRET]'
         )
       ) AS request_id;
     ```
   - Schedule: `*/30 * * * *` (every 30 minutes)
   - Timezone: Your local timezone

### Option B: External Cron Service

Use a service like **cron-job.org** or **EasyCron**:

1. Create account on cron service
2. Add new cron job:
   - **URL**: `https://[YOUR-PROJECT-REF].supabase.co/functions/v1/inventory-sync`
   - **Method**: POST
   - **Headers**:
     ```
     Authorization: Bearer [YOUR-ANON-KEY]
     Content-Type: application/json
     ```
   - **Schedule**: Every 30 minutes

### Manual Sync (Testing)

Trigger sync manually from your app:

```typescript
import { triggerInventorySync } from './utils/syncHelpers';

// Trigger sync
const result = await triggerInventorySync();
console.log('Sync result:', result);
```

## Step 3: Update Product Pages

### Add Performance Tracking

Update `ProductDetailPage.tsx`:

```typescript
import { useProductPerformance } from '../hooks/useProductPerformance';
import { useInventoryStatus } from '../hooks/useInventoryStatus';

function ProductDetailPage() {
  const { product } = useShopifyProduct(handle);
  const { trackProductView, trackCartAdd } = useProductPerformance();
  const { quantityAvailable, isLowStock, isOutOfStock, loading } =
    useInventoryStatus(product?.id, selectedVariant?.id);

  useEffect(() => {
    if (product?.id) {
      trackProductView(product.id, selectedVariant?.id);
    }
  }, [product?.id, selectedVariant?.id]);

  const handleAddToCart = async () => {
    await trackCartAdd(product.id, selectedVariant?.id);
    // ... rest of add to cart logic
  };

  // Show inventory status
  {isOutOfStock && <Badge variant="error">Out of Stock</Badge>}
  {isLowStock && <Badge variant="warning">Only {quantityAvailable} left!</Badge>}
}
```

### Add Real-Time Inventory Badge

Create `InventoryBadge.tsx`:

```typescript
import { useInventoryStatus } from '../hooks/useInventoryStatus';

export function InventoryBadge({ productId, variantId }: Props) {
  const { quantityAvailable, isLowStock, isOutOfStock, loading } =
    useInventoryStatus(productId, variantId);

  if (loading) return null;
  if (isOutOfStock) return <span className="text-red-600">Out of Stock</span>;
  if (isLowStock) return <span className="text-orange-600">Only {quantityAvailable} left</span>;
  if (quantityAvailable > 0) return <span className="text-green-600">In Stock</span>;
  return null;
}
```

## Step 4: Monitor Synchronization

### View Sync Status

```typescript
import { checkSyncStatus, getInventoryAlerts } from './utils/syncHelpers';

const { lastSync } = await checkSyncStatus();
console.log('Last inventory sync:', lastSync);

const { alerts } = await getInventoryAlerts();
console.log('Active alerts:', alerts);
```

### Database Queries

Check recent inventory snapshots:

```sql
SELECT
  product_id,
  variant_id,
  quantity_available,
  snapshot_at
FROM inventory_snapshots
ORDER BY snapshot_at DESC
LIMIT 20;
```

Check inventory alerts:

```sql
SELECT
  alert_type,
  product_id,
  variant_id,
  current_quantity,
  acknowledged,
  created_at
FROM inventory_alerts
WHERE acknowledged = false
ORDER BY created_at DESC;
```

Check order sync:

```sql
SELECT
  order_number,
  status,
  total,
  created_at,
  shopify_order_id
FROM orders
ORDER BY created_at DESC
LIMIT 10;
```

## Step 5: Test Complete Flow

### Test Order Webhook

1. Create test order in Shopify
2. Check logs in Supabase:
   ```bash
   supabase functions logs shopify-webhook --tail
   ```
3. Verify order in database:
   ```sql
   SELECT * FROM orders WHERE order_number = 'TEST-ORDER-123';
   ```

### Test Inventory Sync

1. Trigger manual sync:
   ```bash
   curl -X POST https://[YOUR-PROJECT-REF].supabase.co/functions/v1/inventory-sync \
     -H "Authorization: Bearer [YOUR-ANON-KEY]" \
     -H "Content-Type: application/json"
   ```

2. Check response and logs
3. Verify snapshots in database

### Test Real-Time Updates

1. Open product page in browser
2. Update inventory in Shopify Admin
3. Wait for next sync (max 30 minutes)
4. Verify inventory badge updates automatically

## Troubleshooting

### Webhooks Not Working

1. Check webhook secret is set correctly:
   ```bash
   supabase secrets list
   ```

2. Verify webhook URL in Shopify settings

3. Check edge function logs:
   ```bash
   supabase functions logs shopify-webhook --tail
   ```

4. Test webhook manually:
   ```bash
   curl -X POST [YOUR-WEBHOOK-URL] \
     -H "X-Shopify-Topic: orders/create" \
     -H "X-Shopify-Hmac-SHA256: test" \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

### Inventory Not Syncing

1. Check Shopify credentials in `.env`:
   ```
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
   ```

2. Test Storefront API access:
   ```bash
   curl -X POST https://your-store.myshopify.com/api/2024-07/graphql.json \
     -H "X-Shopify-Storefront-Access-Token: YOUR-TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"query": "{ shop { name } }"}'
   ```

3. Check function logs:
   ```bash
   supabase functions logs inventory-sync --tail
   ```

### Performance Tracking Not Recording

1. Verify RPC functions exist:
   ```sql
   SELECT routine_name FROM information_schema.routines
   WHERE routine_schema = 'public'
   AND routine_name LIKE 'track_%';
   ```

2. Check function implementation in migration:
   `supabase/migrations/20251012150434_create_product_performance_functions.sql`

3. Test manually:
   ```sql
   SELECT track_product_view('test-product-id', 'test-variant-id');
   ```

## Success Criteria

Your synchronization is working when:

- ✅ Orders appear in `orders` table within 1 minute of Shopify checkout
- ✅ Inventory snapshots update every 30 minutes
- ✅ Low stock alerts appear in `inventory_alerts` table
- ✅ Product performance metrics increment on user actions
- ✅ Inventory badges update in real-time on product pages
- ✅ Out of stock products show accurate status

## Monitoring Dashboard (Optional)

Create an admin dashboard to monitor sync health:

```typescript
// AdminDashboard.tsx
function SyncMonitor() {
  const [status, setStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      const { lastSync } = await checkSyncStatus();
      const { alerts } = await getInventoryAlerts();
      setStatus(lastSync);
      setAlerts(alerts);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Sync Status</h2>
      <p>Last sync: {status ? new Date(status).toLocaleString() : 'Never'}</p>
      <p>Active alerts: {alerts.length}</p>
      {alerts.map(alert => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
```

## Next Steps

1. ✅ Configure Shopify webhooks (10 mins)
2. ✅ Set up inventory sync cron job (5 mins)
3. ✅ Update product pages with tracking (15 mins)
4. ✅ Test complete flow (10 mins)
5. 📊 Create monitoring dashboard (optional, 30 mins)

Your backend synchronization will then be fully operational!
