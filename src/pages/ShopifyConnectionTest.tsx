import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, AlertCircle, ExternalLink, Copy, RefreshCw } from 'lucide-react';
import { shopifyClient } from '../utils/shopifyClient';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const ShopifyConnectionTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [shopData, setShopData] = useState<any>(null);

  const updateTest = (name: string, status: TestResult['status'], message: string, details?: any) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        return prev.map(t => t.name === name ? { name, status, message, details } : t);
      }
      return [...prev, { name, status, message, details }];
    });
  };

  const runTests = async () => {
    setTesting(true);
    setTests([]);

    updateTest('environment', 'pending', 'Checking environment variables...');

    const shopDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
    const accessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!shopDomain || !accessToken) {
      updateTest('environment', 'error', 'Missing environment variables', {
        shopDomain: !!shopDomain,
        accessToken: !!accessToken
      });
      setTesting(false);
      return;
    }

    updateTest('environment', 'success', 'Environment variables configured', {
      shopDomain,
      tokenLength: accessToken.length
    });

    updateTest('client', 'pending', 'Testing Shopify client initialization...');

    if (!shopifyClient) {
      updateTest('client', 'error', 'Shopify client not initialized');
      setTesting(false);
      return;
    }

    updateTest('client', 'success', 'Shopify client initialized successfully');

    updateTest('connection', 'pending', 'Testing connection to Shopify...');

    try {
      const shopQuery = `
        query {
          shop {
            name
            primaryDomain {
              url
            }
            paymentSettings {
              acceptedCardBrands
              supportedDigitalWallets
            }
          }
        }
      `;

      const result: any = await shopifyClient.request(shopQuery);

      if (result?.shop) {
        setShopData(result.shop);
        updateTest('connection', 'success', 'Successfully connected to Shopify store', result.shop);
      } else {
        updateTest('connection', 'error', 'Unexpected response from Shopify');
      }
    } catch (error: any) {
      updateTest('connection', 'error', `Connection failed: ${error.message}`, error);
      setTesting(false);
      return;
    }

    updateTest('products', 'pending', 'Testing product queries...');

    try {
      const productsQuery = `
        query {
          products(first: 5) {
            edges {
              node {
                id
                title
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      `;

      const result: any = await shopifyClient.request(productsQuery);

      if (result?.products?.edges) {
        const productCount = result.products.edges.length;
        updateTest('products', 'success', `Successfully loaded ${productCount} products`, {
          count: productCount,
          products: result.products.edges.slice(0, 3)
        });
      } else {
        updateTest('products', 'warning', 'No products found in store');
      }
    } catch (error: any) {
      updateTest('products', 'error', `Product query failed: ${error.message}`, error);
    }

    updateTest('cart', 'pending', 'Testing cart creation...');

    try {
      const cartCreateQuery = `
        mutation {
          cartCreate(input: {}) {
            cart {
              id
              checkoutUrl
            }
          }
        }
      `;

      const result: any = await shopifyClient.request(cartCreateQuery);

      if (result?.cartCreate?.cart) {
        updateTest('cart', 'success', 'Cart creation working', {
          cartId: result.cartCreate.cart.id,
          hasCheckoutUrl: !!result.cartCreate.cart.checkoutUrl
        });
      } else {
        updateTest('cart', 'error', 'Cart creation failed');
      }
    } catch (error: any) {
      updateTest('cart', 'error', `Cart creation failed: ${error.message}`, error);
    }

    updateTest('supabase', 'pending', 'Checking Supabase configuration...');

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      updateTest('supabase', 'error', 'Missing Supabase environment variables');
    } else {
      updateTest('supabase', 'success', 'Supabase configured', {
        url: supabaseUrl,
        hasKey: !!supabaseKey
      });
    }

    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'pending':
        return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'pending':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Shopify Payments Connection Test
              </h1>
              <p className="text-gray-600">
                Verify your React app is properly connected to Shopify
              </p>
            </div>
            <button
              onClick={runTests}
              disabled={testing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Testing...' : 'Re-run Tests'}
            </button>
          </div>

          {shopData && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-green-900 mb-2">
                    Connected to: {shopData.name}
                  </h2>
                  <div className="space-y-2 text-sm text-green-800">
                    <p>
                      <strong>Store URL:</strong>{' '}
                      <a
                        href={shopData.primaryDomain?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-900"
                      >
                        {shopData.primaryDomain?.url}
                        <ExternalLink className="inline h-3 w-3 ml-1" />
                      </a>
                    </p>
                    {shopData.paymentSettings?.acceptedCardBrands && (
                      <p>
                        <strong>Accepted Cards:</strong>{' '}
                        {shopData.paymentSettings.acceptedCardBrands.join(', ')}
                      </p>
                    )}
                    {shopData.paymentSettings?.supportedDigitalWallets && (
                      <p>
                        <strong>Digital Wallets:</strong>{' '}
                        {shopData.paymentSettings.supportedDigitalWallets.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 transition-all ${getStatusColor(test.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(test.status)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 capitalize mb-1">
                      {test.name}
                    </h3>
                    <p className="text-sm text-gray-700">{test.message}</p>

                    {test.details && (
                      <details className="mt-3">
                        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900 font-medium">
                          View Details
                        </summary>
                        <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                          <pre className="text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(test.details, null, 2))}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy to Clipboard
                          </button>
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!testing && tests.length > 0 && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="space-y-3 text-sm text-gray-700">
                {tests.every(t => t.status === 'success') ? (
                  <>
                    <p className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      All tests passed! Your Shopify connection is working perfectly.
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p className="font-medium text-gray-900 mb-2">Complete Setup:</p>
                      <ol className="list-decimal list-inside space-y-2 pl-2">
                        <li>Verify Shopify Payments is activated in your Shopify Admin</li>
                        <li>Configure webhooks for order synchronization</li>
                        <li>Test a complete purchase flow with test cards</li>
                        <li>Check orders appear in "My Orders" page</li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="flex items-center gap-2 text-yellow-700">
                      <AlertCircle className="h-4 w-4" />
                      Some tests failed. Review the errors above.
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p className="font-medium text-gray-900 mb-2">Common Issues:</p>
                      <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>Check your .env file has correct VITE_SHOPIFY_STORE_DOMAIN</li>
                        <li>Verify VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN is valid</li>
                        <li>Ensure Storefront API access is enabled in Shopify Admin</li>
                        <li>Restart dev server after changing environment variables</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              For detailed testing instructions, see{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                SHOPIFY_PAYMENTS_TESTING_GUIDE.md
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
