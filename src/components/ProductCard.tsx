import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProgressiveImage } from './ProgressiveImage';
import { ProcessedProduct, ProductVariant } from '../types';
import { getInventoryStatus, getStockAlert } from '../utils/inventoryHelpers';
import { getPriceDisplay, formatPrice } from '../utils/priceHelpers';

interface ProductCardProps {
  product: ProcessedProduct;
  onQuickView?: () => void;
  usingFallback?: boolean;
  activeFilters?: {
    shapes?: string[];
    metalColors?: string[];
  };
}

const metalColors = [
  { id: 'white', label: 'White Gold', color: '#FFFFFF', border: '#D1D1D1' },
  { id: 'yellow', label: 'Yellow Gold', color: '#D3B275', border: '#B8985E' },
  { id: 'rose', label: 'Rose Gold', color: '#B76E79', border: '#9D5D66' },
  { id: 'platinum', label: 'Platinum', color: '#E5E4E2', border: '#B8B5B3' },
];

const ProductCardComponent: React.FC<ProductCardProps> = ({ product, usingFallback = false, activeFilters }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Helper to preserve current filters in navigation
  const buildProductUrl = (handle: string, color: string) => {
    const params = new URLSearchParams(searchParams);
    if (color) params.set('color', color);
    return `/product/${handle}?${params.toString()}`;
  };

  const { addToCart, loading: cartLoading } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { success, error: showError } = useToast();
  
  const [showCustomization, setShowCustomization] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Initialize with first variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants && product.variants.length > 0 ? product.variants[0] : {} as ProductVariant
  );
  
  const [selectedMetal, setSelectedMetal] = useState('white');
  const [customization, setCustomization] = useState({
    goldType: 'yellow',
    diamondType: 'white',
    engraving: '',
    size: ''
  });

  // Get available gold colors from product variants
  const availableColors = React.useMemo(() => {
    const colorSet = new Set<string>();
    product.variants.forEach(variant => {
      if (variant.selectedOptions) {
        const color =
          variant.selectedOptions['Color'] ||
          variant.selectedOptions['color'] ||
          variant.selectedOptions['Metal'] ||
          variant.selectedOptions['Metal Color'] ||
          variant.selectedOptions['Metal Type'] ||
          variant.selectedOptions['metal color'] ||
          variant.selectedOptions['metal type'];
        if (color) {
          colorSet.add(color);
        }
      }
    });
    return Array.from(colorSet);
  }, [product.variants]);

  // Map available colors to metal color swatches
  const availableMetalColors = React.useMemo(() => {
    return metalColors.filter(metal => {
      return availableColors.some(color => {
        const colorLower = color.toLowerCase();
        return colorLower.includes(metal.id) ||
               (metal.id === 'white' && colorLower.includes('whte')) ||
               (metal.id === 'yellow' && colorLower.includes('yellow')) ||
               (metal.id === 'rose' && colorLower.includes('rose')) ||
               (metal.id === 'platinum' && colorLower.includes('platinum'));
      });
    });
  }, [availableColors]);

  // Helper function to find variant matching metal color
  const findVariantByMetal = React.useCallback((metalId: string, caratWeight?: string) => {
    const colorMap: Record<string, string[]> = {
      'white': ['white gold', 'whte gold', 'white', 'whte-gold'],
      'yellow': ['yellow gold', 'yellow', 'yellow-gold'],
      'rose': ['rose gold', 'rose', 'rose-gold'],
      'platinum': ['platinum']
    };

    return product.variants.find(v => {
      if (!v.selectedOptions) return false;

      const vColor = (
        v.selectedOptions['Color'] ||
        v.selectedOptions['color'] ||
        v.selectedOptions['Metal'] ||
        v.selectedOptions['Metal Color'] ||
        v.selectedOptions['Metal Type'] ||
        v.selectedOptions['metal color'] ||
        v.selectedOptions['metal type'] ||
        ''
      ).toLowerCase();

      const colorMatch = colorMap[metalId]?.some(c => vColor.includes(c));

      if (!colorMatch) return false;

      // Optional carat check
      if (caratWeight) {
        const vDiamondType = (
          v.selectedOptions['Diamond Type'] ||
          v.selectedOptions['diamond type'] ||
          v.selectedOptions['Carat'] ||
          v.selectedOptions['carat'] ||
          v.title || ''
        ).toLowerCase();

        const normalizedCarat = caratWeight.toLowerCase().replace('ct', '').trim();
        return vDiamondType.includes(normalizedCarat);
      }

      return true;
    });
  }, [product.variants]);

  // Helper to get the correct image for the selected variant
  const getDisplayImage = React.useCallback(() => {
    // 1. Variant specific image
    if (selectedVariant?.image) return selectedVariant.image;
    
    // 2. Fallback to product image
    return product.image;
  }, [selectedVariant, product]);

  // Effect to set initial state based on active filters
  React.useEffect(() => {
    let targetMetal = 'white';
    
    if (activeFilters?.metalColors && activeFilters.metalColors.length > 0) {
      const filterColor = activeFilters.metalColors[0].toLowerCase();
      if (filterColor.includes('yellow')) targetMetal = 'yellow';
      else if (filterColor.includes('rose')) targetMetal = 'rose';
      else if (filterColor.includes('white')) targetMetal = 'white';
      else if (filterColor.includes('platinum')) targetMetal = 'platinum';
    } else {
        // Default to first available color
        if (availableMetalColors.length > 0) {
            targetMetal = availableMetalColors[0].id;
        }
    }

    setSelectedMetal(targetMetal);
    const matchingVariant = findVariantByMetal(targetMetal);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  }, [activeFilters?.metalColors, availableMetalColors, findVariantByMetal]);

  // @ts-ignore
  const isInWishlist = wishlistState.items.some(item => item.id === product.handle);
  const inventoryStatus = getInventoryStatus(selectedVariant.quantityAvailable);
  const stockAlert = getStockAlert(selectedVariant.quantityAvailable);

  const priceInfo = React.useMemo(() => {
    if (!selectedVariant || !selectedVariant.price) {
      return getPriceDisplay(product.variants, product.handle);
    }

    return {
      displayPrice: formatPrice(selectedVariant.price),
      hasMultiplePrices: false,
      minPrice: selectedVariant.price,
      maxPrice: selectedVariant.price,
      isOnSale: selectedVariant.compareAtPrice ? selectedVariant.compareAtPrice > selectedVariant.price : false,
      compareAtPrice: selectedVariant.compareAtPrice
    };
  }, [selectedVariant, product.variants, product.handle]);

  const handleAddToCart = async () => {
    if (!selectedVariant.availableForSale) {
      showError('This product is currently out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(selectedVariant.id, 1);
      setShowCustomization(false);
      success(`${product.name} added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      showError('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: product.handle });
    } else {
      wishlistDispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.handle,
          name: product.name,
          price: selectedVariant.price,
          image: product.image,
          category: product.category
        }
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden relative w-full hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      {/* Product Image */}
      <div
        className="relative aspect-square cursor-pointer bg-gray-50 overflow-hidden"
        onClick={() => navigate(buildProductUrl(product.handle, selectedMetal))}
      >
        <ProgressiveImage
          src={getDisplayImage()}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
          {inventoryStatus.available && inventoryStatus.lowStock && inventoryStatus.quantityKnown && (
            <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
              {stockAlert}
            </span>
          )}
          {product.isCustomizable && inventoryStatus.available && (
            <span className="bg-Color-Champagne-Gold text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
              Customizable
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!selectedVariant.availableForSale || isAddingToCart || cartLoading || usingFallback}
            className="p-2 rounded-full bg-white text-Color-Champagne-Gold hover:bg-Color-Champagne-Gold hover:text-white shadow-md transition-colors"
            title="Add to Cart"
          >
            {isAddingToCart ? <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" /> : <ShoppingBag className="h-5 w-5" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle();
            }}
            className={`p-2 rounded-full shadow-md transition-colors ${isInWishlist ? 'bg-white text-red-500' : 'bg-white text-gray-400 hover:text-red-500'}`}
            title="Wishlist"
          >
            <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Metal Swatches */}
        {availableMetalColors.length > 1 && (
          <div className="flex gap-1.5 mb-2">
            {availableMetalColors.map((metal) => (
              <button
                key={metal.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMetal(metal.id);
                  const v = findVariantByMetal(metal.id);
                  if (v) setSelectedVariant(v);
                }}
                className={`w-6 h-6 rounded-full border transition-all ${selectedMetal === metal.id ? 'border-Color-Champagne-Gold scale-110' : 'border-gray-300'}`}
                style={{ backgroundColor: metal.color }}
                title={metal.label}
              />
            ))}
          </div>
        )}

        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 flex-1">
          <button onClick={() => navigate(buildProductUrl(product.handle, selectedMetal))} className="hover:underline text-left">
            {product.name}
          </button>
        </h3>

        <div className="mt-auto">
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-gray-900">{priceInfo.displayPrice}</p>
            {priceInfo.isOnSale && priceInfo.compareAtPrice && (
              <p className="text-sm text-gray-500 line-through">{formatPrice(priceInfo.compareAtPrice)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCard = React.memo(ProductCardComponent);