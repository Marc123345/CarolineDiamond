# Shopify API Security Configuration

## Overview
Your Shopify API tokens are securely stored and configured. This document explains the security measures in place.

## Token Storage

### Environment Variables (`.env` file)
```
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=ec760f038abaf08751c829687a9c741e
SHOPIFY_ADMIN_ACCESS_TOKEN=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
```

## Security Measures

### 1. Git Protection
- ✅ `.env` file is included in `.gitignore`
- ✅ Tokens will NEVER be committed to version control
- ✅ Safe from accidental exposure in public repositories

### 2. Token Isolation

#### Admin API Token (Backend Only)
- **Variable**: `SHOPIFY_ADMIN_ACCESS_TOKEN`
- **Prefix**: None (NOT prefixed with `VITE_`)
- **Access**: Backend scripts and server-side code ONLY
- **Capabilities**: Full admin access to your Shopify store
- **Security**: NEVER exposed to the frontend/browser

#### Storefront API Token (Frontend Safe)
- **Variable**: `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- **Prefix**: `VITE_` (included in frontend bundle)
- **Access**: Public-facing, used in browser
- **Capabilities**: Read-only access to public product data
- **Security**: Safe to expose (limited read-only permissions)

### 3. Usage Patterns

#### Backend Scripts (Node.js)
```typescript
// Scripts automatically load from .env using dotenv
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
```

#### Frontend Code (Vite/React)
```typescript
// Only VITE_ prefixed variables are available
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
```

#### Edge Functions (Supabase)
```typescript
// Set via Supabase Dashboard > Functions > Environment Variables
const ADMIN_TOKEN = Deno.env.get("SHOPIFY_ADMIN_ACCESS_TOKEN");
```

## Token Permissions

### Admin API Token
- Full read/write access to your Shopify store
- Can modify products, orders, customers, inventory
- **CRITICAL**: Must remain secret at all times
- Used in backend scripts for:
  - Product updates
  - Price synchronization
  - Tag management
  - Inventory updates

### Storefront API Token
- Read-only access to public store data
- Cannot modify any store data
- Safe for public use
- Used in frontend for:
  - Product catalog display
  - Cart management
  - Checkout flow

## Best Practices

### ✅ DO
- Keep `.env` file local and never commit it
- Use Admin API only in backend/server-side code
- Rotate tokens periodically (every 3-6 months)
- Monitor token usage in Shopify admin
- Use environment-specific tokens (dev/staging/production)

### ❌ DON'T
- Never hardcode tokens in source code
- Never prefix Admin token with `VITE_`
- Never share tokens in chat/email/slack
- Never commit tokens to git
- Never use Admin API in frontend code

## Token Rotation

When rotating tokens:
1. Generate new tokens in Shopify Admin
2. Update `.env` file with new tokens
3. Restart development server (`npm run dev`)
4. Update Supabase Edge Function secrets (if applicable)
5. Test all integrations
6. Revoke old tokens in Shopify Admin

## Emergency Response

If tokens are accidentally exposed:
1. **Immediately revoke** tokens in Shopify Admin
2. Generate new tokens
3. Update `.env` file
4. Check git history for exposure
5. If committed to git, consider it permanently compromised
6. Review Shopify audit logs for unauthorized access

## Monitoring

Regular checks:
- Review Shopify Admin > Settings > Apps > Manage private apps
- Check API usage and rate limits
- Monitor for unauthorized access attempts
- Verify token permissions are minimal required

## Created
December 24, 2025

## Last Updated
December 24, 2025
