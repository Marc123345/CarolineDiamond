/**
 * Check actual Shopify earring products for carat data
 * This will help diagnose why the live shop shows "No products available"
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
  query GetEarrings {
    products(first: 50, query: "tag:Earrings") {
      edges {
        node {
          id
          title
          tags
          productType
          variants(first: 10) {
            edges {
              node {
                title
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

async function checkEarringsCaratData() {
  try {
    console.log('\n🔍 Checking Shopify Earring Products for Carat Data\n');
    console.log('='.repeat(70));

    const data: any = await client.request(QUERY);
    const products = data.products.edges.map((edge: any) => edge.node);

    console.log(`\nFound ${products.length} products with "Earrings" tag\n`);

    let productsWithCaratTags = 0;
    let productsWithCaratInName = 0;
    let productsWithCaratOptions = 0;
    let productsWithNoCarat = 0;

    products.forEach((product: any, index: number) => {
      console.log(`\n${index + 1}. ${product.title}`);
      console.log('-'.repeat(70));

      // Check tags
      const caratTags = product.tags.filter((tag: string) =>
        tag.match(/(\d+\.?\d*)\s*ct/i) || tag.match(/carat/i)
      );
      if (caratTags.length > 0) {
        productsWithCaratTags++;
        console.log(`  ✅ Carat Tags: ${caratTags.join(', ')}`);
      } else {
        console.log(`  ❌ No carat tags found`);
      }

      // Check name
      const nameMatch = product.title.match(/(\d+\.?\d*)\s*ct/i);
      if (nameMatch) {
        productsWithCaratInName++;
        console.log(`  ✅ Carat in Name: ${nameMatch[0]}`);
      }

      // Check variants
      const variantsWithCarat = product.variants.edges.filter((edge: any) => {
        const variant = edge.node;
        return variant.title.match(/(\d+\.?\d*)\s*ct/i) ||
          variant.selectedOptions.some((opt: any) =>
            opt.value.toString().match(/(\d+\.?\d*)\s*ct/i)
          );
      });

      if (variantsWithCarat.length > 0) {
        productsWithCaratOptions++;
        console.log(`  ✅ Variants with Carat: ${variantsWithCarat.length}`);
        variantsWithCarat.slice(0, 3).forEach((edge: any) => {
          const variant = edge.node;
          console.log(`     - Title: "${variant.title}"`);
          console.log(`       Options:`);
          variant.selectedOptions.forEach((opt: any) => {
            console.log(`         ${opt.name}: "${opt.value}"`);
          });
        });
      } else {
        console.log(`  ❌ No carat data in variants`);
        // Show first variant as example
        if (product.variants.edges.length > 0) {
          const variant = product.variants.edges[0].node;
          console.log(`     Example variant: "${variant.title}"`);
          variant.selectedOptions.forEach((opt: any) => {
            console.log(`       ${opt.name}: "${opt.value}"`);
          });
        }
      }

      // Check if product has NO carat data anywhere
      if (caratTags.length === 0 && !nameMatch && variantsWithCarat.length === 0) {
        productsWithNoCarat++;
        console.log(`  ⚠️  NO CARAT DATA FOUND ANYWHERE`);
      }

      console.log(`  All Tags: ${product.tags.join(', ')}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('\n📊 Summary:');
    console.log(`  Total Earring Products: ${products.length}`);
    console.log(`  Products with Carat in Tags: ${productsWithCaratTags}`);
    console.log(`  Products with Carat in Name: ${productsWithCaratInName}`);
    console.log(`  Products with Carat in Variants: ${productsWithCaratOptions}`);
    console.log(`  Products with NO Carat Data: ${productsWithNoCarat}`);
    console.log('\n');

    if (productsWithNoCarat > 0) {
      console.log('⚠️  WARNING: Some earrings have no carat data!');
      console.log('   These products will not appear in carat weight filters.');
    }

    if (productsWithCaratTags > 0) {
      console.log('✅ Good: Found products with carat tags.');
      console.log('   These should now work with the updated filter logic.');
    }

  } catch (error) {
    console.error('❌ Error fetching data:', error);
  }
}

checkEarringsCaratData();
