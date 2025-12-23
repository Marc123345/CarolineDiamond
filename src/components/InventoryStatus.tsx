import React from 'react';
import { AlertCircle, Check, Package } from 'lucide-react';
import { useInventoryStatus } from '../hooks/useInventoryStatus';

interface InventoryStatusProps {
  productId: string;
  variantId?: string;
  showQuantity?: boolean;
  className?: string;
}

export const InventoryStatus: React.FC<InventoryStatusProps> = ({
  productId,
  variantId,
  showQuantity = true,
  className = ''
}) => {
  const { quantityAvailable, isLowStock, isOutOfStock, loading } = useInventoryStatus(
    productId,
    variantId
  );

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-400 ${className}`}>
        <Package className="w-4 h-4 animate-pulse" />
        <span className="text-sm">Checking availability...</span>
      </div>
    );
  }

  if (isOutOfStock) {
    return (
      <div className={`flex items-center gap-2 text-red-600 ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span className="font-medium text-sm">Out of Stock</span>
      </div>
    );
  }

  if (isLowStock) {
    return (
      <div className={`flex items-center gap-2 text-orange-600 ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span className="font-medium text-sm">
          {showQuantity ? `Only ${quantityAvailable} left in stock` : 'Low Stock'}
        </span>
      </div>
    );
  }

  if (quantityAvailable > 0) {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        <Check className="w-4 h-4" />
        <span className="font-medium text-sm">In Stock</span>
        {showQuantity && quantityAvailable <= 20 && (
          <span className="text-xs text-gray-500">({quantityAvailable} available)</span>
        )}
      </div>
    );
  }

  return null;
};
