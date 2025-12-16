import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ShoppingBag, Heart, Search, Package } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: 'cart' | 'wishlist' | 'search' | 'orders' | 'default';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'default'
}) => {
  // Default icons based on variant
  const defaultIcons = {
    cart: ShoppingBag,
    wishlist: Heart,
    search: Search,
    orders: Package,
    default: ShoppingBag
  };

  const Icon = icon || defaultIcons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      {/* Icon with Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1
        }}
        className="mb-6"
      >
        <div className="relative">
          {/* Decorative circle background */}
          <div className="absolute inset-0 bg-gradient-to-br from-Color-Primary-Beige to-Color-Secondary rounded-full blur-2xl opacity-40 animate-pulse" />

          <div className="relative w-24 h-24 bg-gradient-to-br from-Color-Champagne-Gold to-Color-Light-300 rounded-full flex items-center justify-center shadow-xl">
            <Icon className="h-12 w-12 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="typography-h4 text-Color-Dark-500 mb-3"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="typography-body text-gray-600 max-w-md mb-8"
      >
        {description}
      </motion.p>

      {/* Action Buttons */}
      {(actionLabel || secondaryActionLabel) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {actionLabel && onAction && (
            <Button
              variant="primary"
              size="lg"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="outline"
              size="lg"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </motion.div>
      )}

      {/* Decorative elements */}
      <div className="mt-12 grid grid-cols-3 gap-4 opacity-20">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="w-16 h-16 bg-Color-Primary-Beige rounded-lg"
          />
        ))}
      </div>
    </motion.div>
  );
};

// Preset components for common use cases
export const EmptyCart: React.FC<{ onShopNow: () => void }> = ({ onShopNow }) => (
  <EmptyState
    variant="cart"
    title="Your Cart is Empty"
    description="Looks like you haven't added anything to your cart yet. Start shopping to find your perfect piece of jewelry."
    actionLabel="Shop Now"
    onAction={onShopNow}
  />
);

export const EmptyWishlist: React.FC<{ onBrowse: () => void }> = ({ onBrowse }) => (
  <EmptyState
    variant="wishlist"
    title="No Items in Wishlist"
    description="Save your favorite jewelry pieces to your wishlist and never lose track of them."
    actionLabel="Browse Collection"
    onAction={onBrowse}
  />
);

export const EmptySearchResults: React.FC<{ searchQuery?: string; onClearSearch: () => void; onBrowseAll: () => void }> = ({
  searchQuery,
  onClearSearch,
  onBrowseAll
}) => (
  <EmptyState
    variant="search"
    title="No Results Found"
    description={searchQuery ? `We couldn't find any products matching "${searchQuery}". Try different keywords or browse our collection.` : "Try searching for rings, diamonds, or other jewelry."}
    actionLabel="Browse All Products"
    onAction={onBrowseAll}
    secondaryActionLabel={searchQuery ? "Clear Search" : undefined}
    onSecondaryAction={searchQuery ? onClearSearch : undefined}
  />
);

export const EmptyOrders: React.FC<{ onShopNow: () => void }> = ({ onShopNow }) => (
  <EmptyState
    variant="orders"
    title="No Orders Yet"
    description="You haven't placed any orders yet. Start shopping to discover our exquisite collection of handcrafted jewelry."
    actionLabel="Start Shopping"
    onAction={onShopNow}
  />
);
