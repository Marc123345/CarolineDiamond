import { graphQLClient } from '../src/utils/shopifyClient';
import { extractCaratWeight, extractAllCaratWeights, productMatchesCaratWeight } from '../src/utils/diamondFilterUtils';
import { CARAT_WEIGHTS } from '../src/config/filterConfig';
import { ProcessedProduct } from '../src/types/shopify';

const PRODUCTS_QUERY = `
  query GetTimelessProducts {
    products(first: 50, query: "tag:timeless") {
      edges {
        node {
          id
          title
          handle
          tags
          variants(first: 5) {
            edges {
              node {
                id
                title
                price {
                  amount
                }
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

interface ShopifyResponse {
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        tags: string[];
        variants: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              price: { amount: string };
              selectedOptions: Array<{ name: string; value: string }>;
            };
          }>;
        };
      };
    }>;
  };
}

async function testCaratExtraction() {
  console.log('🔍 Testing Carat Weight Filter Logic\n');

  try {
    const response = await graphQLClient.request<ShopifyResponse>(PRODUCTS_QUERY);
    const products = response.products.edges.map(edge => edge.node);

    console.log(`Found ${products.length} products with "timeless" tag\n`);

    // Test each product
    products.forEach(product => {
      console.log(`\n📦 ${product.handle}`);
      console.log(`   Title: ${product.title}`);
      console.log(`   Tags: ${product.tags.join(', ')}`);

      // Find carat-related tags
      const caratTags = product.tags.filter(tag =>
        tag.toLowerCase().includes('ct') || tag.match(/\d+\.\d+/)
      );
      console.log(`   Carat tags: ${caratTags.join(', ')}`);

      // Convert to ProcessedProduct format
      const processedProduct: Partial<ProcessedProduct> = {
        id: product.id,
        name: product.title,
        handle: product.handle,
        tags: product.tags,
        variants: product.variants.edges.map(v => ({
          id: v.node.id,
          title: v.node.title,
          price: parseFloat(v.node.price.amount),
          availableForSale: true,
          selectedOptions: v.node.selectedOptions.reduce((acc, opt) => {
            acc[opt.name] = opt.value;
            return acc;
          }, {} as Record<string, string>)
        }))
      };

      // Test extraction
      const singleCarat = extractCaratWeight(processedProduct as ProcessedProduct);
      const allCarats = extractAllCaratWeights(processedProduct as ProcessedProduct);

      console.log(`   ✓ Extracted single carat: ${singleCarat}`);
      console.log(`   ✓ Extracted all carats: [${allCarats.join(', ')}]`);

      // Test matching against filter ranges
      console.log(`   Filter matches:`);
      CARAT_WEIGHTS.forEach(weight => {
        const matches = productMatchesCaratWeight(processedProduct as ProcessedProduct, weight);
        if (matches) {
          console.log(`      ✓ ${weight.label} (${weight.display})`);
        }
      });
    });

    // Summary: Count products by carat range
    console.log(`\n\n📊 FILTER COUNT SUMMARY\n`);
    CARAT_WEIGHTS.forEach(weight => {
      const count = products.filter(p => {
        const processedProduct: Partial<ProcessedProduct> = {
          id: p.id,
          name: p.title,
          handle: p.handle,
          tags: p.tags,
          variants: p.variants.edges.map(v => ({
            id: v.node.id,
            title: v.node.title,
            price: parseFloat(v.node.price.amount),
            availableForSale: true,
            selectedOptions: v.node.selectedOptions.reduce((acc, opt) => {
              acc[opt.name] = opt.value;
              return acc;
            }, {} as Record<string, string>)
          }))
        };
        return productMatchesCaratWeight(processedProduct as ProcessedProduct, weight);
      }).length;

      console.log(`${weight.label} (${weight.display}): ${count} products`);
    });

  } catch (error) {
    console.error('❌ Error testing carat extraction:', error);
  }
}

testCaratExtraction();
