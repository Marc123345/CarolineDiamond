# Diamonds by CS - Next.js Migration Guide

## Phase 1: Shell Creation ✅ COMPLETE

### What We've Done

**1. Next.js 16 Foundation**
- ✅ Initialized Next.js 16 with App Router
- ✅ TypeScript configured
- ✅ React 19 ready
- ✅ Turbopack enabled for faster builds

**2. Design System Migrated**
- ✅ Tailwind v3 configured with your EXACT design tokens
- ✅ All custom colors (beige, champagne gold, blacks, whites)
- ✅ Custom animations and keyframes
- ✅ Typography system (Playfair Display, Cormorant Garamond)
- ✅ Spacing, shadows, and luxury effects
- ✅ Mobile-responsive utilities
- ✅ All button styles and form inputs

**3. Core Dependencies Installed**
- ✅ @supabase/supabase-js (database)
- ✅ framer-motion (animations)
- ✅ lucide-react (icons)
- ✅ graphql + graphql-request (Shopify)
- ✅ gsap (advanced animations)
- ✅ react-intersection-observer (scroll animations)
- ✅ swiper (carousels)

**4. Configuration Files**
- ✅ next.config.ts (ImageKit + Shopify images configured)
- ✅ tailwind.config.js (full design system)
- ✅ postcss.config.js
- ✅ .env.local (all environment variables)
- ✅ globals.css (all custom styles)

**5. Utilities & Helpers**
- ✅ lib/supabase.ts (Supabase client)
- ✅ utils/imagekit.ts (Image optimization)
- ✅ styles/design-tokens.ts (Design tokens)
- ✅ Folder structure created

---

## Folder Structure

```
next-migration/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/             # React components (to migrate)
├── lib/
│   └── supabase.ts         # Supabase client
├── utils/
│   └── imagekit.ts         # Image utilities
├── styles/
│   └── design-tokens.ts    # Design tokens
├── config/                 # Config files (to migrate)
├── hooks/                  # Custom hooks (to migrate)
├── context/                # React context (to migrate)
├── types/                  # TypeScript types (to migrate)
├── data/                   # Static data (to migrate)
└── public/                 # Static assets

```

---

## Testing Your Setup

1. **Start Dev Server:**
   ```bash
   cd next-migration
   npm run dev
   ```

2. **Open:** http://localhost:3000

3. **You Should See:**
   - Your brand fonts (Playfair Display, Cormorant Garamond)
   - Your exact color palette
   - The "Phase 1 Complete" checklist
   - Responsive design working

4. **Test Build:**
   ```bash
   npm run build
   ```

---

## Phase 2: Core Components Migration (Next)

### What to Migrate:

**1. Layout Components** (Priority: HIGH)
- [ ] Header.tsx
- [ ] Footer.tsx
- [ ] MobileMenu.tsx
- [ ] DesktopNav.tsx

**2. Product Components**
- [ ] ProductCard.tsx
- [ ] ProductImageGallery.tsx
- [ ] ProductQuickView.tsx
- [ ] OptimizedImage.tsx
- [ ] ProgressiveImage.tsx

**3. UI Components**
- [ ] CartIcon.tsx
- [ ] WishlistIcon.tsx
- [ ] SearchBar.tsx
- [ ] SearchModal.tsx
- [ ] FilterSidebar.tsx
- [ ] ActiveFilterChips.tsx

**4. Context Providers**
- [ ] CartContext.tsx
- [ ] WishlistContext.tsx
- [ ] AuthContext.tsx
- [ ] TranslationContext.tsx
- [ ] ToastContext.tsx

**5. Utility Files**
- [ ] All /utils files
- [ ] All /config files
- [ ] All /hooks files

### Migration Strategy:

1. **Copy Component File**
   ```bash
   cp src/components/Header.tsx next-migration/components/Header.tsx
   ```

2. **Update Imports:**
   - Change `import.meta.env.VITE_*` → `process.env.NEXT_PUBLIC_*`
   - Change `react-router-dom` → `next/navigation`
   - Change `<Link to=` → `<Link href=`
   - Change `useNavigate()` → `useRouter()`

3. **Image Optimization:**
   - Change `<img>` → `<Image>` from `next/image`
   - Keep your ImageKit URLs
   - Use width/height props

4. **Test Component:**
   - Import into a page
   - Check styling
   - Test functionality

---

## Phase 3: Data Layer & API Routes (After Phase 2)

**What We'll Build:**

1. **API Routes (Server-Side):**
   ```
   app/api/
   ├── shopify/
   │   ├── products/route.ts
   │   └── cart/route.ts
   └── supabase/
       └── [...]/route.ts
   ```

2. **Server Components:**
   - Fetch data on server
   - No client-side API keys
   - Better SEO

3. **Static Generation:**
   - `generateStaticParams()` for product pages
   - ISR (Incremental Static Regeneration)
   - Automatic revalidation

---

## Phase 4: Routing & Pages (After Phase 3)

**Pages to Create:**

```
app/
├── page.tsx                    # Home ✅
├── shop/page.tsx              # Shop
├── products/
│   └── [handle]/page.tsx     # Product Detail
├── about/page.tsx             # About
├── contact/page.tsx           # Contact
├── cart/page.tsx              # Cart
└── [...other pages]
```

**Dynamic Routes:**
- `/products/[handle]` - Product details
- `/collecties/[collection]` - Collections
- `/shop?category=rings` - Shop with filters

---

## Phase 5: SEO & Performance (After Phase 4)

1. **Metadata API:**
   ```typescript
   export const metadata = {
     title: 'Product Name | Diamonds by CS',
     description: '...',
     openGraph: { ... }
   }
   ```

2. **Sitemap:**
   ```typescript
   // app/sitemap.ts
   export default async function sitemap() { ... }
   ```

3. **Structured Data:**
   - Product schema
   - Organization schema
   - Breadcrumb schema

4. **Performance:**
   - Image optimization (already configured)
   - Code splitting (automatic)
   - Route prefetching (automatic)

---

## Important Notes

### Don't Touch These (They're Perfect):
- ✅ Your design system
- ✅ Your components' logic
- ✅ Your business rules
- ✅ Your styles

### What Changes:
- ❌ Routing (React Router → Next.js)
- ❌ Data fetching (client → server)
- ❌ Environment variables (VITE_ → NEXT_PUBLIC_)
- ❌ Build process (Vite → Next.js)

### Keep Using:
- ✅ Supabase (same code)
- ✅ Shopify (same queries, better location)
- ✅ ImageKit (same URLs)
- ✅ Tailwind (same classes)

---

## Time Estimates

| Phase | Estimated Time | Status |
|-------|---------------|--------|
| Phase 1: Shell | 2-3 hours | ✅ DONE |
| Phase 2: Components | 4-6 hours | 🔄 Next |
| Phase 3: Data Layer | 6-8 hours | ⏳ Pending |
| Phase 4: Routing | 4-6 hours | ⏳ Pending |
| Phase 5: SEO | 2-4 hours | ⏳ Pending |
| **Total** | **18-27 hours** | |

---

## Quick Reference

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=...
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
NEXT_PUBLIC_IMAGEKIT_BASE_URL=...
```

### Common Import Changes
```typescript
// OLD (Vite)
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

// NEW (Next.js)
import { useRouter } from 'next/navigation';
const router = useRouter();

// OLD
<Link to="/shop">Shop</Link>

// NEW
<Link href="/shop">Shop</Link>

// OLD
import.meta.env.VITE_API_KEY

// NEW
process.env.NEXT_PUBLIC_API_KEY
```

---

## Ready to Continue?

You've successfully completed Phase 1! Your Next.js shell is ready with:
- Your exact design system
- All necessary dependencies
- Proper configuration
- Working build process

**Next Step:** Phase 2 - Start migrating components. Would you like me to help with that?
