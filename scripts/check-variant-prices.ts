/**
 * Check current prices on Shopify variants to see if they match Caroline's pricing
 */

import { GraphQLClient, gql } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

const graphqlEndpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
const client = new GraphQLClient(graphqlEndpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  },
});

const QUERY = `
  query GetTimelessProducts {
    products(first: 10, query: "tag:timeless") {
      edges {
        node {
          id
          title
          tags
          productType
          variants(first: 20) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
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

// Caroline's pricing structure
const EXPECTED_PRICES = {
  'Earrings': {
    '0.30': 490,
    '0.50': 590,
    '1.00': 890
  },
  'Necklace': {
    '0.50': 750,
    '1.00': 1190
  },
  'Solitaire': {
    '0.50': 790,
    '1.00': 990,
    '1.50': 1250
  }
};

function extractCaratFromVariant(variant: any): string | null {
  const title = variant.title;
  const match = title.match(/(\d+\.?\d*)\s*ct/i);
  if (match) return match[1];

  // Check options
  for (const opt of variant.selectedOptions) {
    const optMatch = opt.value.match(/(\d+\.?\d*)\s*ct/i);
    if (optMatch) return optMatch[1];
  }

  return null;
}

function getProductCategory(product: any): string {
  if (product.tags.includes('Earrings')) return 'Earrings';
  if (product.tags.includes('Necklaces')) return 'Necklace';
  if (product.tags.includes('Rings') || product.tags.includes('Solitaire')) return 'Solitaire';
  return 'Unknown';
}

async function checkPrices() {
  try {
    console.log('\n💰 Checking Timeless Product Variant Prices\n');
    console.log('='.repeat(80));

    const data: any = await client.request(QUERY);
    const products = data.products.edges.map((edge: any) => edge.node);

    console.log(`\nFound ${products.length} Timeless products\n`);

    let totalVariants = 0;
    let correctPrices = 0;
    let incorrectPrices = 0;
    let missingPrices = 0;

    products.forEach((product: any) => {
      const category = getProductCategory(product);
      console.log(`\n📦 ${product.title}`);
      console.log(`   Category: ${category}`);
      console.log(`   Tags: ${product.tags.join(', ')}`);
      console.log('-'.repeat(80));

      product.variants.edges.forEach((edge: any) => {
        const variant = edge.node;
        totalVariants++;

        const carat = extractCaratFromVariant(variant);
        const currentPrice = parseFloat(variant.price.amount);
        const currency = variant.price.currencyCode;

        console.log(`\n  Variant: ${variant.title}`);
        console.log(`    Variant ID: ${variant.id}`);
        console.log(`    Carat: ${carat || 'Not found'}`);
        console.log(`    Current Price: ${currency} ${currentPrice}`);

        if (carat && EXPECTED_PRICES[category as keyof typeof EXPECTED_PRICES]) {
          const expectedPrice = EXPECTED_PRICES[category as keyof typeof EXPECTED_PRICES][carat as keyof typeof EXPECTED_PRICES[keyof typeof EXPECTED_PRICES]];

          if (expectedPrice) {
            console.log(`    Expected Price: EUR ${expectedPrice}`);

            if (currentPrice === expectedPrice) {
              console.log(`    ✅ Price is CORRECT`);
              correctPrices++;
            } else if (currentPrice === 0) {
              console.log(`    ❌ Price is MISSING (set to 0)`);
              missingPrices++;
            } else {
              console.log(`    ⚠️  Price is INCORRECT (should be EUR ${expectedPrice})`);
              incorrectPrices++;
            }
          } else {
            console.log(`    ⚠️  No expected price defined for ${carat}ct in ${category}`);
          }
        } else {
          console.log(`    ⚠️  Cannot determine expected price (category: ${category}, carat: ${carat})`);
        }
      });
    });

    console.log('\n' + '='.repeat(80));
    console.log('📊 PRICING SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Variants: ${totalVariants}`);
    console.log(`✅ Correct Prices: ${correctPrices}`);
    console.log(`❌ Missing Prices (€0): ${missingPrices}`);
    console.log(`⚠️  Incorrect Prices: ${incorrectPrices}`);
    console.log(`\nAction Required: ${missingPrices + incorrectPrices > 0 ? 'YES - Prices need to be updated' : 'NO - All prices are correct'}`);
    console.log('='.repeat(80));
    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkPrices();
