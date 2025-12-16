import dotenv from 'dotenv';
dotenv.config();

const query = `
  query {
    products(first: 3, query: "tag:Solitaire") {
      edges {
        node {
          id
          title
          tags
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                }
                availableForSale
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

const response = await fetch(`https://${process.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },
  body: JSON.stringify({ query }),
});

const data = await response.json();

console.log('Current Product Structure:\n');

data.data.products.edges.forEach(({ node }) => {
  console.log(`📦 ${node.title}`);
  console.log(`   Tags: ${node.tags.join(', ')}`);
  console.log(`   Variants (${node.variants.edges.length}):`);
  
  node.variants.edges.forEach(({ node: variant }) => {
    console.log(`     ${variant.title} - €${variant.price.amount}`);
    variant.selectedOptions.forEach(opt => {
      console.log(`       ${opt.name}: ${opt.value}`);
    });
  });
  console.log('');
});
