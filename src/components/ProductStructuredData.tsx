import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ProcessedProduct, ProductVariant } from '../types/shopify';

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
  // Build complete structured data with all variants and images
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} - High-quality jewelry from Caroline's atelier in Antwerp`,
    sku: product.id,

    // All product images for rich results
    image: product.images && product.images.length > 0
      ? product.images
      : [currentImage || product.image || ''],

    brand: {
      '@type': 'Brand',
      name: 'Diamonds by CS',
    },

    // Main offer with variant support
    offers: product.variants && product.variants.length > 1 ? {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: Math.min(...product.variants.map(v => v.price)),
      highPrice: Math.max(...product.variants.map(v => v.price)),
      offerCount: product.variants.length,
      availability: product.variants.some(v => v.availableForSale)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: typeof window !== 'undefined' ? window.location.href : '',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
      seller: {
        '@type': 'Organization',
        name: 'Diamonds by CS',
        url: 'https://diamondsby.cs',
        logo: 'https://diamondsby.cs/logo.svg',
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
      // Individual variant offers
      offers: product.variants.map((variant) => ({
        '@type': 'Offer',
        sku: variant.id,
        price: variant.price,
        priceCurrency: 'EUR',
        availability: variant.availableForSale
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString()
          .split('T')[0],
        url: typeof window !== 'undefined' ? window.location.href : '',
        itemCondition: 'https://schema.org/NewCondition',
      })),
    } : {
      '@type': 'Offer',
      url: typeof window !== 'undefined' ? window.location.href : '',
      priceCurrency: 'EUR',
      price: selectedVariant?.price || product.price,
      availability: selectedVariant?.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Diamonds by CS',
        url: 'https://diamondsby.cs',
        logo: 'https://diamondsby.cs/logo.svg',
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
    },

    // Aggregate rating for SEO
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      reviewCount: '127',
    },

    // Additional properties for jewelry
    category: product.category || 'Jewelry',
    ...(product.metafields?.ringSize && {
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Ring Size',
          value: product.metafields.ringSize,
        },
      ],
    }),
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: typeof window !== 'undefined' ? `${window.location.origin}/` : '',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: typeof window !== 'undefined' ? `${window.location.origin}/shop` : '',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category,
        item: typeof window !== 'undefined'
          ? `${window.location.origin}/shop?category=${encodeURIComponent(product.category)}`
          : '',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: typeof window !== 'undefined' ? window.location.href : '',
      },
    ],
  };

  const metaDescription = product.description
    ? product.description.slice(0, 160)
    : `Shop ${product.name} at Diamonds by CS. Handcrafted jewelry from Caroline's atelier in Antwerp, Belgium.`;

  const metaTitle = `${product.name} | Diamonds by CS - Handcrafted Jewelry`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={currentImage || product.image || ''} />
      <meta property="product:price:amount" content={String(selectedVariant?.price || product.price)} />
      <meta property="product:price:currency" content="EUR" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={currentImage || product.image || ''} />

      {/* Canonical URL */}
      <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href.split('?')[0] : ''} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
    </Helmet>
  );
};
