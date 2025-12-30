import React, { memo } from 'react';
import { Sparkles, Shield, RefreshCw, Minus, Plus } from 'lucide-react';
import { VariantSelector } from '../VariantSelector';
import type { ProcessedProduct } from '../../types/shopify';

interface PurchasePanelProps {
  product: ProcessedProduct;
  selectedOptions: Record<string, string>;
  quantity: number;
  onOptionsChange: (options: Record<string, string>) => void;
  onQuantityChange: (quantity: number) => void;
}

export const PurchasePanel = memo<PurchasePanelProps>(({
  product,
  selectedOptions,
  quantity,
  onOptionsChange,
  onQuantityChange
}) => {
  const incrementQuantity = () => onQuantityChange(quantity + 1);
  const decrementQuantity = () => onQuantityChange(Math.max(1, quantity - 1));

  return (
    <div className="bg-white border border-black/[0.03] p-8 space-y-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="w-4 h-4 text-Color-Champagne-Gold" />
        <h3 className="text-xs uppercase tracking-[0.3em] font-black text-Color-Dark-500">
          Curate Specifications
        </h3>
      </div>

      <VariantSelector
        product={product}
        selectedOptions={selectedOptions}
        onOptionsChange={onOptionsChange}
      />

      <div className="space-y-3">
        <label className="text-[9px] uppercase tracking-widest font-bold text-Color-Gray-400">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 h-10 text-center border border-black/10 rounded text-sm font-medium focus:outline-none focus:border-Color-Champagne-Gold"
            aria-label="Quantity"
          />
          <button
            onClick={incrementQuantity}
            className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-all"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-8 border-t border-black/[0.03] grid grid-cols-2 gap-8">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-Color-Primary-Beige/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-Color-Champagne-Gold" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-500">
            Antwerp Insured Delivery
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-Color-Primary-Beige/20 flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-Color-Champagne-Gold" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-500">
            14-Day Private Return
          </span>
        </div>
      </div>
    </div>
  );
});

PurchasePanel.displayName = 'PurchasePanel';
