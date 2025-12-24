const dotenv = require('dotenv');
dotenv.config();

const query = `
  query GetProducts($query: String) {
    products(first: 50, query: $query) {
      edges {
        node {
          id
          title
          tags
        }
      }
    }
  }
`;

async function testQuery(searchQuery) {
  const response = await fetch(`https://${process.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables: { query: searchQuery } }),
  });
  return await response.json();
}

async function main() {
  // Test the exact query for: Solitaire + Side Diamonds AND Yellow Gold
  const testQuery1 = '(tag:"Solitaire + Side Diamonds") (tag:"Yellow Gold")';
  
  console.log('Testing query:', testQuery1);
  const result = await testQuery(testQuery1);
  
  console.log(`Found ${result.data.products.edges.length} products\n`);
  
  result.data.products.edges.forEach(({ node }) => {
    console.log(`- ${node.title}`);
    console.log(`  Tags: ${node.tags.join(', ')}\n`);
  });
}

main();
