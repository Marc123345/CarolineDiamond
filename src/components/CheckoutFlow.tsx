import React, { useEffect, useState } from 'react';
import { ExternalLink, ShoppingBag, Shield, CreditCard, CheckCircle } from 'lucide-react';
import { createCheckoutOrder } from '../lib/ordersDb';
import { ProcessedCartItem } from '../types/shopify';

interface CheckoutFlowProps {
  checkoutUrl: string;
  checkoutId: string;
  cartItems: ProcessedCartItem[];
  totalPrice: number;
  customerEmail?: string;
  onClose?: () => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  checkoutUrl,
  checkoutId,
  cartItems,
  totalPrice,
  customerEmail,
  onClose
}) => {
  const [orderCreated, setOrderCreated] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    const createOrder = async () => {
      setCreatingOrder(true);
      try {
        const { error } = await createCheckoutOrder(
          checkoutId,
          cartItems,
          totalPrice,
          customerEmail
        );

        if (error) {
          console.error('Failed to create order:', error);
          setOrderError('Failed to track order. You can still proceed to checkout.');
        } else {
          setOrderCreated(true);
        }
      } catch (err) {
        console.error('Error creating order:', err);
        setOrderError('Failed to track order. You can still proceed to checkout.');
      } finally {
        setCreatingOrder(false);
      }
    };

    createOrder();
  }, [checkoutId, cartItems, totalPrice, customerEmail]);

  useEffect(() => {
    if (!creatingOrder) {
      const timer = setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [checkoutUrl, creatingOrder]);

  const handleProceed = () => {
    window.location.href = checkoutUrl;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        {/* Icon */}
        <div className="w-20 h-20 bg-Color-Champagne-Gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          {orderCreated ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <ShoppingBag className="w-10 h-10 text-Color-Champagne-Gold" />
          )}
        </div>

        {/* Title */}
        <h2 className="typography-h4 text-center mb-4">Checkout</h2>

        {/* Description */}
        <p className="typography-body text-gray-600 text-center mb-6">
          {creatingOrder
            ? 'Preparing your order...'
            : orderCreated
            ? 'Order tracked! Redirecting to secure checkout...'
            : 'You will be redirected to our secure Shopify checkout page to complete your purchase.'
          }
        </p>

        {/* Error Message */}
        {orderError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800 text-center">{orderError}</p>
          </div>
        )}

        {/* Features */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">SSL encrypted checkout</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">Multiple payment options</span>
          </div>
          <div className="flex items-center gap-3">
            <ExternalLink className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">Secure Shopify platform</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-Color-Champagne-Gold animate-[progress_3s_ease-in-out]" />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleProceed}
            className="flex-1 py-3 bg-Color-Champagne-Gold text-white rounded-lg hover:bg-Color-Champagne-Gold/90 transition font-medium flex items-center justify-center gap-2"
          >
            Proceed Now
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Auto-redirect notice */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Redirecting automatically in 3 seconds...
        </p>
      </div>

      <style>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
