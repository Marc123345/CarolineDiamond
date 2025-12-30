import { GraphQLClient } from 'graphql-request';
import type { ProcessedProduct, ShopifyProductsResponse, ProductVariant, ProductOption } from '../types';

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// 1. CLIENT INITIALIZATION
// ==========================================
console.log('🔍 Shopify Client Initialization:', {
  domain: SHOPIFY_DOMAIN || 'MISSING',
  hasToken: !!STOREFRONT_ACCESS_TOKEN,
  tokenLength: STOREFRONT_ACCESS_TOKEN?.length || 0,
  tokenPreview: STOREFRONT_ACCESS_TOKEN ? `${STOREFRONT_ACCESS_TOKEN.substring(0, 4)}...` : 'NONE',
  willInitialize: !!(SHOPIFY_DOMAIN && STOREFRONT_ACCESS_TOKEN),
  env: import.meta.env.MODE
});

let shopifyClientInstance: GraphQLClient | null = null;

if (SHOPIFY_DOMAIN && STOREFRONT_ACCESS_TOKEN) {
  try {
    const apiUrl = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;
    console.log('✅ Creating Shopify GraphQL client:', apiUrl);

    shopifyClientInstance = new GraphQLClient(apiUrl, {
      headers: {
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Shopify client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Shopify client:', error);
    shopifyClientInstance = null;
  }
} else {
  console.error('❌ Shopify client NOT initialized - Missing configuration');
}

export const shopifyClient = shopifyClientInstance;


// 2. DATA CLEANING UTILITIES
// ==========================================
const DATA_FIXES: Record<string, string> = {
  '0.50c': '0.50ct',
  'Rose Gold': '18K Rose Gold',
  '18k Rose Gold': '18K Rose Gold',
  'Yellow Gold': '18K Yellow Gold',
  'White Gold': '18K White Gold',
  'Diamond': 'Natural Diamond',
  'Ring size': 'Ring Size',
  'Ring Size:': 'Ring Size'
};

const cleanValue = (val: string): string => {
  if (!val) return '';
  const trimmed = val.trim();
  return DATA_FIXES[trimmed] || trimmed;
};

// 3. GRAPHQL QUERY
// ==========================================
const PRODUCTS_QUERY = `
  query GetProducts {
    products(first: 250) {
      edges {
        node {
          id
          title
          handle
          description
          vendor
          tags
          availableForSale
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 5) {
            edges { node { url altText } }
          }
          options {
            id
            name
            values
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                availableForSale
                quantityAvailable
                image { url altText }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

// 4. FETCH & MAP FUNCTION
// ==========================================
export const fetchAllProducts = async (): Promise<ProcessedProduct[]> => {
  if (!shopifyClient) {
    console.error('⚠️ Cannot fetch products: Shopify Client not initialized');
    return [];
  }

  try {
    const data = await shopifyClient.request<ShopifyProductsResponse>(PRODUCTS_QUERY);
    
    // Transform Shopify Response -> ProcessedProduct
    const processed = data.products.edges.map(({ node: p }) => {
      
      // Map Variants (and clean data)
      const variants: ProductVariant[] = p.variants.edges.map(({ node: v }) => ({
        id: v.id,
        title: v.title,
        price: parseFloat(v.price.amount),
        compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : undefined,
        availableForSale: v.availableForSale,
        quantityAvailable: v.quantityAvailable,
        image: v.image?.url,
        // TRANSFORM: Clean the option values here!
        selectedOptions: v.selectedOptions.reduce((acc, opt) => {
          const cleanName = cleanValue(opt.name); // Fix "Ring size" -> "Ring Size"
          const cleanVal = cleanValue(opt.value); // Fix "0.50c" -> "0.50ct"
          acc[cleanName] = cleanVal;
          return acc;
        }, {} as Record<string, string>)
      }));

      // Map Options (and clean data)
      const options: ProductOption[] = p.options.map(opt => ({
        id: opt.id,
        name: cleanValue(opt.name),
        values: opt.values.map(cleanValue)
      }));

      // Map Product
      return {
        id: p.id,
        handle: p.handle,
        name: p.title,
        description: p.description,
        price: parseFloat(p.priceRange.minVariantPrice.amount),
        images: p.images.edges.map(img => img.node.url),
        image: p.images.edges[0]?.node.url || '',
        category: p.productType || 'Jewelry',
        vendor: p.vendor,
        tags: p.tags,
        availableForSale: p.availableForSale,
        variants: variants,
        options: options,
      };
    });

    console.log(`✅ Fetched and processed ${processed.length} products`);
    return processed;

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
};