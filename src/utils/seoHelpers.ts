import { ProcessedProduct, ProductVariant } from '../types/shopify';

export const updateProductMeta = (
  product: ProcessedProduct,
  selectedVariant?: ProductVariant | null,
  currentImage?: string
) => {
  const metaDescription = product.description
    ? product.description.slice(0, 160)
    : `Shop ${product.name} at Diamonds by CS. Handcrafted jewelry from Caroline's atelier in Antwerp, Belgium.`;

  const metaTitle = `${product.name} | Diamonds by CS - Handcrafted Jewelry`;

  document.title = metaTitle;

  updateMetaTag('name', 'description', metaDescription);
  updateMetaTag('property', 'og:title', metaTitle);
  updateMetaTag('property', 'og:description', metaDescription);
  updateMetaTag('property', 'og:image', currentImage || product.image || '');
  updateMetaTag('property', 'og:type', 'product');
  updateMetaTag('property', 'product:price:amount', String(selectedVariant?.price || product.price));
  updateMetaTag('property', 'product:price:currency', 'EUR');

  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} - High-quality jewelry from Caroline's atelier in Antwerp`,
    image: currentImage || product.image || '',
    brand: {
      '@type': 'Brand',
      name: 'Diamonds by CS',
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: 'EUR',
      price: selectedVariant?.price || product.price,
      availability: selectedVariant?.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
      seller: {
        '@type': 'Organization',
        name: 'Diamonds by CS',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Scheldestraat 49',
          addressLocality: 'Antwerp',
          postalCode: '2000',
          addressCountry: 'BE',
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
  };

  updateStructuredData('product-schema', structuredData);
};

const updateMetaTag = (attribute: string, key: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const updateStructuredData = (id: string, data: any) => {
  let script = document.getElementById(id);

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
};
