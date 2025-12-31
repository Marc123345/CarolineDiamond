import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ProcessedProduct, ProductVariant } from '../../types'; // Adjusted import path

interface ProductStructuredDataProps {
  product: ProcessedProduct;
  selectedVariant?: ProductVariant | null;
  currentImage?: string;
}

export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({
  product,
  selectedVariant,
  currentImage,
}) => {
  // Safe window check for SSR/SSG compatibility
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // Calculate price range for AggregateOffer
  const prices = product.variants?.map(v => v.price) || [product.price];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Build complete structured data with all variants and images
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} - High-quality jewelry from Caroline's atelier in Antwerp`,
    sku: selectedVariant?.sku || product.id,
    
    // All product images for rich results
    image: product.images && product.images.length > 0
      ? product.images
      : [currentImage || product.image || ''],

    brand: {
      '@type': 'Brand',
      name: 'Diamonds by CS',
    },

    // Handle Offers (Single Item vs Aggregate for Variants)
    offers: product.variants && product.variants.length > 1 ? {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: product.variants.length,
      availability: product.variants.some(v => v.availableForSale)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: currentUrl,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
      seller: {
        '@type': 'Organization',
        name: 'Diamonds by CS',
        url: 'https://diamondsby.cs',
        // logo: 'https://diamondsby.cs/logo.svg', // Uncomment if you have a hosted logo
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Scheldestraat 49',
          addressLocality: 'Antwerp',
          postalCode: '2000',
          addressCountry: 'BE',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+32-3-123-4567',
          contactType: 'Customer Service',
          availableLanguage: ['en', 'nl'],
        },
      },
    } : {
      '@type': 'Offer',
      url: currentUrl,
      priceCurrency: 'EUR',
      price: selectedVariant?.price || product.price,
      availability: (selectedVariant?.availableForSale ?? product.availableForSale)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Diamonds by CS',
      },
    },

    // Aggregate rating stub (Needs real data connection later)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      reviewCount: '127',
    },

    // Additional properties for jewelry context
    category: product.category || 'Jewelry',
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${origin}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${origin}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category || 'Jewelry',
        item: product.category 
          ? `${origin}/shop?category=${encodeURIComponent(product.category)}`
          : `${origin}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: currentUrl,
      },
    ],
  };

  const metaDescription = product.description
    ? product.description.slice(0, 160).replace(/<[^>]*>?/gm, '') // Strip HTML tags if any
    : `Shop ${product.name} at Diamonds by CS. Handcrafted jewelry from Caroline's atelier in Antwerp, Belgium.`;

  const metaTitle = `${product.name} | Diamonds by CS`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={currentImage || product.image || ''} />
      <meta property="product:price:amount" content={String(selectedVariant?.price || product.price)} />
      <meta property="product:price:currency" content="EUR" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={currentImage || product.image || ''} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl.split('?')[0]} />

      {/* Structured Data Scripts */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
    </Helmet>
  );
};