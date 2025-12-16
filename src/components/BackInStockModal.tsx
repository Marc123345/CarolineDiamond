import React, { useState } from 'react';
import { Bell, Mail } from 'lucide-react';
import { requestBackInStockNotification } from '../utils/inventoryHelpers';
import { useAuth } from '../context/AuthContext';
import { Modal, FormField, TextInput, Alert } from './shared';
import { Button } from './shared/Button';
import { useTranslation } from '../context/TranslationContext';

interface BackInStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  variantId: string;
  productName: string;
  variantTitle?: string;
}

export const BackInStockModal: React.FC<BackInStockModalProps> = ({
  isOpen,
  onClose,
  productId,
  variantId,
  productName,
  variantTitle
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await requestBackInStockNotification({
      email,
      product_id: productId,
      variant_id: variantId,
      product_name: productName,
      variant_title: variantTitle,
      user_id: user?.id
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail(user?.email || '');
      }, 2000);
    } else {
      setError(result.error || 'Failed to subscribe. Please try again.');
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setSuccess(false);
      setError(null);
      setEmail(user?.email || '');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      showCloseButton={!loading}
      closeOnOverlayClick={!loading}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-Color-Champagne-Gold to-Color-Primary-Beige text-white p-6 -m-6 mb-6 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <Bell className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold">{t('Back in Stock Alert')}</h3>
            <p className="text-white/90 text-sm">{t('Get notified when available')}</p>
          </div>
        </div>
      </div>

      {success ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <Bell className="h-10 w-10 text-green-600" />
          </div>
          <h4 className="text-xl font-serif font-bold text-Color-Netural-Black mb-2">
            You're all set!
          </h4>
          <p className="text-gray-600 text-center">
            We'll notify you when {productName} {variantTitle && `(${variantTitle})`} is back in stock.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-Color-Netural-Black mb-2">
              {productName}
            </h4>
            {variantTitle && (
              <p className="text-sm text-gray-600 mb-3">{variantTitle}</p>
            )}
            <p className="text-sm text-gray-600">
              Be the first to know when this item is back in stock.
            </p>
          </div>

          {error && (
            <Alert type="error" message={error} className="mb-4" />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Email Address"
              id="email-input"
              required
              error={error ? 'Please try again' : undefined}
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <TextInput
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  className="pl-10"
                  error={!!error}
                />
              </div>
            </FormField>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleClose}
                disabled={loading}
                variant="secondary"
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !email}
                loading={loading}
                variant="primary"
                fullWidth
              >
                Notify Me
              </Button>
            </div>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            We'll send you one email when this item is back in stock. You can unsubscribe at any time.
          </p>
        </>
      )}
    </Modal>
  );
};
