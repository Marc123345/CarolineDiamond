/**
 * Check ALL products to verify pricing is correct based on Caroline's pricing structure
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
  query GetAllProducts {
    products(first: 50) {
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

// Caroline's complete pricing structure
const EXPECTED_PRICES: Record<string, Record<string, number>> = {
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
  },
  'Halo': {
    '0.50': 1390,
    '1.00': 1790,
    '1.50': 2290
  }
};

function extractCaratFromVariant(variant: any): string | null {
  const title = variant.title;
  const match = title.match(/(\d+\.?\d*)\s*ct/i);
  if (match) return match[1];

  for (const opt of variant.selectedOptions) {
    const optMatch = opt.value.match(/(\d+\.?\d*)\s*ct/i);
    if (optMatch) return optMatch[1];
  }

  return null;
}

function getProductCategory(product: any): string {
  const tags = product.tags.map((t: string) => t.toLowerCase());

  if (tags.includes('earrings') || tags.includes('earring')) return 'Earrings';
  if (tags.includes('necklaces') || tags.includes('necklace')) return 'Necklace';
  if (tags.includes('halo')) return 'Halo';
  if (tags.includes('solitaire') || tags.includes('engagement ring')) return 'Solitaire';
  if (tags.includes('rings') || tags.includes('ring')) return 'Rings';

  return 'Unknown';
}

function isNaturalDiamond(variant: any): boolean {
  const title = variant.title.toLowerCase();
  if (title.includes('natural')) return true;

  for (const opt of variant.selectedOptions) {
    if (opt.value.toLowerCase().includes('natural')) return true;
  }

  return false;
}

async function checkAllPrices() {
  try {
    console.log('\n💰 Checking ALL Product Prices Against Caroline\'s Pricing\n');
    console.log('='.repeat(80));

    const data: any = await client.request(QUERY);
    const products = data.products.edges.map((edge: any) => edge.node);

    console.log(`\nFound ${products.length} products\n`);

    let totalVariants = 0;
    let correctPrices = 0;
    let incorrectPrices = 0;
    let missingPrices = 0;
    let naturalDiamonds = 0;
    let unknownCategory = 0;

    const issuesByProduct: Array<{product: string, variant: string, issue: string}> = [];

    products.forEach((product: any) => {
      const category = getProductCategory(product);

      console.log(`\n📦 ${product.title}`);
      console.log(`   Category: ${category}`);
      console.log(`   Product Type: ${product.productType}`);
      console.log(`   Tags: ${product.tags.slice(0, 5).join(', ')}${product.tags.length > 5 ? '...' : ''}`);

      let hasIssues = false;

      product.variants.edges.forEach((edge: any) => {
        const variant = edge.node;
        totalVariants++;

        const carat = extractCaratFromVariant(variant);
        const currentPrice = parseFloat(variant.price.amount);
        const isNatural = isNaturalDiamond(variant);

        // Natural diamonds should be €0 (Price on Request)
        if (isNatural) {
          naturalDiamonds++;
          if (currentPrice !== 0) {
            console.log(`   ⚠️  ${variant.title}: Natural Diamond should be €0, currently €${currentPrice}`);
            issuesByProduct.push({
              product: product.title,
              variant: variant.title,
              issue: `Natural Diamond price should be €0, currently €${currentPrice}`
            });
            hasIssues = true;
          }
          return;
        }

        // Check lab-grown diamond prices
        if (category === 'Unknown') {
          unknownCategory++;
          return;
        }

        if (carat && EXPECTED_PRICES[category]) {
          const expectedPrice = EXPECTED_PRICES[category][carat];

          if (expectedPrice) {
            if (currentPrice === expectedPrice) {
              correctPrices++;
            } else if (currentPrice === 0) {
              console.log(`   ❌ ${variant.title}: Missing price (€0), should be €${expectedPrice}`);
              issuesByProduct.push({
                product: product.title,
                variant: variant.title,
                issue: `Missing price, should be €${expectedPrice}`
              });
              missingPrices++;
              hasIssues = true;
            } else {
              console.log(`   ⚠️  ${variant.title}: Wrong price (€${currentPrice}), should be €${expectedPrice}`);
              issuesByProduct.push({
                product: product.title,
                variant: variant.title,
                issue: `Wrong price €${currentPrice}, should be €${expectedPrice}`
              });
              incorrectPrices++;
              hasIssues = true;
            }
          }
        }
      });

      if (!hasIssues && category !== 'Unknown') {
        console.log(`   ✅ All prices correct`);
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('📊 PRICING AUDIT SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Variants Checked: ${totalVariants}`);
    console.log(`✅ Correct Lab-Grown Prices: ${correctPrices}`);
    console.log(`❌ Missing Prices (€0): ${missingPrices}`);
    console.log(`⚠️  Incorrect Prices: ${incorrectPrices}`);
    console.log(`🔹 Natural Diamond Variants (€0 expected): ${naturalDiamonds}`);
    console.log(`❓ Unknown Category: ${unknownCategory}`);

    if (issuesByProduct.length > 0) {
      console.log('\n' + '='.repeat(80));
      console.log('⚠️  ISSUES REQUIRING ATTENTION');
      console.log('='.repeat(80));
      issuesByProduct.forEach(({product, variant, issue}, index) => {
        console.log(`${index + 1}. ${product}`);
        console.log(`   Variant: ${variant}`);
        console.log(`   Issue: ${issue}`);
        console.log('');
      });
    }

    console.log('='.repeat(80));
    console.log(`\n${issuesByProduct.length === 0 ? '✅ All prices are correct!' : '⚠️  Action Required: Fix ' + issuesByProduct.length + ' pricing issues'}`);
    console.log('='.repeat(80));
    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAllPrices();
