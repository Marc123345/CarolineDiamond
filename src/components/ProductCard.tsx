import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProgressiveImage } from './ProgressiveImage';
import { ProcessedProduct, ProcessedVariant } from '../types/shopify';
import { getInventoryStatus, getStockAlert } from '../utils/inventoryHelpers';
import { getPriceDisplay, formatPrice } from '../utils/priceHelpers';

interface ProductCardProps {
  product: ProcessedProduct;
  onQuickView?: () => void;
  usingFallback?: boolean;
  activeFilters?: {
    shapes?: string[];
    metalColors?: string[];
    diamondType?: { value: string; display: string; carat?: number; origin: string };
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
    params.set('color', color);
    return `/product/${handle}?${params.toString()}`;
  };
  const { addToCart, loading: cartLoading } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { success, error: showError } = useToast();
  const [showCustomization, setShowCustomization] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProcessedVariant>(
    product.variants && product.variants.length > 0 ? product.variants[0] : {} as ProcessedVariant
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
        const color = variant.selectedOptions['Color'] || variant.selectedOptions['color'] || variant.selectedOptions['Metal'];
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
  const findVariantByMetal = React.useCallback((metalId: string) => {
    const colorMap: Record<string, string[]> = {
      'white': ['white gold', 'whte gold', 'white'],
      'yellow': ['yellow gold', 'yellow'],
      'rose': ['rose gold', 'rose'],
      'platinum': ['platinum']
    };

    return product.variants.find(v => {
      if (!v.selectedOptions) return false;
      const vColor = (v.selectedOptions['Color'] || v.selectedOptions['color'] || v.selectedOptions['Metal'] || '').toLowerCase();
      return colorMap[metalId]?.some(c => vColor.includes(c));
    });
  }, [product.variants]);

  // Helper to get the correct image for the selected variant
  const getDisplayImage = React.useCallback(() => {
    // Priority 1: Use variant's specific image if it exists
    if (selectedVariant?.image) {
      return selectedVariant.image;
    }

    // Priority 2: Smart matching based on metal color and product images
    // Group variants by metal color to understand image distribution
    const metalColorGroups = new Map<string, number>();
    product.variants.forEach(v => {
      if (v.selectedOptions) {
        const color = (v.selectedOptions['Color'] || v.selectedOptions['color'] || v.selectedOptions['Metal'] || '').toLowerCase();
        metalColorGroups.set(color, (metalColorGroups.get(color) || 0) + 1);
      }
    });

    // Get the selected metal color
    const selectedColor = (selectedVariant?.selectedOptions?.['Color'] ||
                          selectedVariant?.selectedOptions?.['color'] ||
                          selectedVariant?.selectedOptions?.['Metal'] || '').toLowerCase();

    // If we have multiple images and multiple color groups
    const uniqueColors = Array.from(metalColorGroups.keys());
    if (product.images && product.images.length > 1 && uniqueColors.length > 1) {
      // Calculate which image index corresponds to this color
      // Assumption: images are ordered by color variants (common Shopify practice)
      const imagesPerColor = Math.floor(product.images.length / uniqueColors.length);
      const colorIndex = uniqueColors.indexOf(selectedColor);

      if (colorIndex >= 0 && imagesPerColor > 0) {
        const imageIndex = colorIndex * imagesPerColor;
        if (imageIndex < product.images.length) {
          return product.images[imageIndex];
        }
      }
    }

    // Priority 3: Try variant index as fallback
    const variantIndex = product.variants.indexOf(selectedVariant);
    if (variantIndex >= 0 && product.images && product.images.length > variantIndex) {
      return product.images[variantIndex];
    }

    // Priority 4: Fallback to first product image
    return product.image;
  }, [selectedVariant, product]);

  // Initialize selected variant based on active filters
  React.useEffect(() => {
    let targetMetal = 'white'; // default

    // If metal color filter is active, use that
    if (activeFilters?.metalColors && activeFilters.metalColors.length > 0) {
      const filterColor = activeFilters.metalColors[0].toLowerCase();
      if (filterColor.includes('yellow')) {
        targetMetal = 'yellow';
      } else if (filterColor.includes('rose')) {
        targetMetal = 'rose';
      } else if (filterColor.includes('white')) {
        targetMetal = 'white';
      } else if (filterColor.includes('platinum')) {
        targetMetal = 'platinum';
      }
    } else {
      // Otherwise use first available variant's color
      if (product.variants.length > 0 && product.variants[0].selectedOptions) {
        const firstColor = product.variants[0].selectedOptions['Color'] ||
                          product.variants[0].selectedOptions['color'] ||
                          product.variants[0].selectedOptions['Metal'];
        if (firstColor) {
          const colorLower = firstColor.toLowerCase();
          if (colorLower.includes('yellow')) targetMetal = 'yellow';
          else if (colorLower.includes('rose')) targetMetal = 'rose';
          else if (colorLower.includes('white') || colorLower.includes('whte')) targetMetal = 'white';
          else if (colorLower.includes('platinum')) targetMetal = 'platinum';
        }
      }
    }

    // Update selected metal
    setSelectedMetal(targetMetal);

    // Find variant matching both metal color AND diamond type filter
    let matchingVariant = null;

    if (activeFilters?.diamondType) {
      // Find variant that matches both metal and diamond type
      matchingVariant = product.variants.find(v => {
        if (!v.selectedOptions) return false;

        // Check metal color match
        const vColor = (v.selectedOptions['Color'] || v.selectedOptions['color'] || v.selectedOptions['Metal'] || '').toLowerCase();
        const colorMap: Record<string, string[]> = {
          'white': ['white gold', 'whte gold', 'white'],
          'yellow': ['yellow gold', 'yellow'],
          'rose': ['rose gold', 'rose'],
          'platinum': ['platinum']
        };
        const metalMatch = colorMap[targetMetal]?.some(c => vColor.includes(c));

        // Check diamond type match (Option2 typically contains the diamond type)
        const vDiamondType = v.option2 || '';
        const diamondMatch = vDiamondType === activeFilters.diamondType.value;

        return metalMatch && diamondMatch;
      });
    }

    // Fallback to metal-only match if no diamond type match found
    if (!matchingVariant) {
      matchingVariant = findVariantByMetal(targetMetal);
    }

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  }, [product.id, product.variants, activeFilters?.metalColors, activeFilters?.diamondType, findVariantByMetal]);


  const isInWishlist = wishlistState.items.some(item => item.id === product.handle);
  const inventoryStatus = getInventoryStatus(selectedVariant.quantityAvailable);
  const stockAlert = getStockAlert(selectedVariant.quantityAvailable);
  const priceInfo = getPriceDisplay(product.variants, product.handle);

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

  const handleCustomizationChange = (field: string, value: string) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden relative w-full hover:shadow-xl transition-all duration-300 group">
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
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {inventoryStatus.available && inventoryStatus.lowStock && inventoryStatus.quantityKnown && (
              <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                {stockAlert}
              </span>
            )}
            {inventoryStatus.available && !inventoryStatus.quantityKnown && (
              <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                Made to Order
              </span>
            )}
            {product.isCustomizable && inventoryStatus.available && (
              <span className="bg-Color-Champagne-Gold text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                Customizable
              </span>
            )}
          </div>

          {/* Action Buttons - Wishlist & Add to Cart */}
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={!selectedVariant.availableForSale || isAddingToCart || cartLoading || usingFallback}
              className={`p-3 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm ${
                !selectedVariant.availableForSale || isAddingToCart || cartLoading || usingFallback
                  ? 'bg-gray-200/80 text-gray-400 cursor-not-allowed'
                  : 'bg-white/80 text-Color-Champagne-Gold hover:bg-Color-Champagne-Gold hover:text-white'
              }`}
              aria-label="Add to cart"
              title={!selectedVariant.availableForSale ? 'Out of stock' : 'Add to cart'}
            >
              {isAddingToCart || cartLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-Color-Champagne-Gold border-t-transparent rounded-full"></div>
              ) : (
                <ShoppingBag className="h-5 w-5" />
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleWishlistToggle();
              }}
              className={`p-3 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm ${
                isInWishlist
                  ? 'bg-white text-red-500'
                  : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
              }`}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isInWishlist}
            >
              <Heart
                className={`h-5 w-5 ${isInWishlist ? 'fill-current text-red-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Product Metadata Badges - NEW */}
          <div className="flex flex-wrap gap-1.5">
            {/* Metal Color Badge */}
            {availableMetalColors.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                <div
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: availableMetalColors[0].color }}
                />
                {availableMetalColors[0].label}
              </span>
            )}

            {/* Shape Badge - Extract from product tags or metafields */}
            {(() => {
              const shape = product.tags?.find(tag =>
                ['Round', 'Oval', 'Princess', 'Pear', 'Marquise', 'Emerald', 'Cushion'].some(s =>
                  tag.toLowerCase().includes(s.toLowerCase())
                )
              );
              return shape ? (
                <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                  {shape}
                </span>
              ) : null;
            })()}

            {/* Carat Weight Badge - Extract from metafields or tags */}
            {product.metafields?.caratWeight && !product.metafields.caratWeight.includes('gid://') && (
              <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-1 rounded">
                {product.metafields.caratWeight}ct
              </span>
            )}

            {/* Category Badge */}
            {product.category && (
              <span className="bg-Color-Primary-Beige text-Color-Netural-Black text-xs font-medium px-2 py-1 rounded">
                {product.category}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[40px] leading-relaxed">
            <button
              onClick={() => navigate(buildProductUrl(product.handle, selectedMetal))}
              className="text-left w-full hover:text-Color-Netural-Black transition-colors font-medium"
            >
              {product.name}
            </button>
          </h3>

          {/* Price */}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-Color-Netural-Black">
                {priceInfo.displayPrice}
              </p>
              {priceInfo.isOnSale && priceInfo.compareAtPrice && (
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(priceInfo.compareAtPrice)}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">(incl. 21% VAT)</p>
            {priceInfo.isOnSale && (
              <span className="inline-block mt-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                Sale
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && document.getElementById('portal-root') &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface-elevated rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-hidden">
              <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Customize {product.name}
                </h3>

                <div className="space-y-6">
                  {/* Carat */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Carat
                    </label>
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      0.50 carat Dvs2
                    </p>
                  </div>

                  {/* Metal */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Metal
                    </label>
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      18k Yellow Gold
                    </p>
                  </div>

                  {/* Side Diamonds */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Side Diamonds
                    </label>
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      None
                    </p>
                  </div>

                  {/* Gold Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Gold Type
                    </label>
                    <select
                      value={customization.goldType}
                      onChange={(e) =>
                        handleCustomizationChange('goldType', e.target.value)
                      }
                      className="w-full px-4 py-3 bg-surface border border-gray-300 rounded-xl text-gray-900"
                    >
                      <option value="yellow">Yellow Gold</option>
                      <option value="white">White Gold</option>
                      <option value="rose">Rose Gold</option>
                      <option value="platinum">Platinum</option>
                    </select>
                  </div>

                  {/* Diamond Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Diamond Type
                    </label>
                    <select
                      value={customization.diamondType}
                      onChange={(e) =>
                        handleCustomizationChange('diamondType', e.target.value)
                      }
                      className="w-full px-4 py-3 bg-surface border border-gray-300 rounded-xl text-gray-900"
                    >
                      <option value="white">White Diamond</option>
                      <option value="pink">Pink Diamond</option>
                    </select>
                  </div>

                  {/* Ring Size */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Ring Size (Optional)
                    </label>
                    <input
                      type="text"
                      value={customization.size}
                      onChange={(e) =>
                        handleCustomizationChange('size', e.target.value)
                      }
                      placeholder="e.g. 7, 52, M"
                      className="w-full px-4 py-3 bg-surface border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  {/* Engraving */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Engraving (Optional)
                    </label>
                    <input
                      type="text"
                      value={customization.engraving}
                      onChange={(e) =>
                        handleCustomizationChange('engraving', e.target.value)
                      }
                      placeholder="Enter your engraving text"
                      className="w-full px-4 py-3 bg-surface border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  {/* Selected Variant */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">
                        Selected variant:
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        €{selectedVariant.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={() => setShowCustomization(false)}
                    className="flex-1 py-3 sm:py-4 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || cartLoading || !selectedVariant.availableForSale || usingFallback}
                    className={`flex-1 py-3 sm:py-4 bg-[#B4935F] hover:bg-[#9F7E4F] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isAddingToCart || cartLoading || !selectedVariant.availableForSale || usingFallback
                        ? 'opacity-75 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {isAddingToCart || cartLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      </div>
                    ) : usingFallback ? (
                      'Offline Mode - View Only'
                    ) : !selectedVariant.availableForSale ? (
                      'Not Available'
                    ) : (
                      <>
                        <div className="inline-flex items-center justify-center gap-2">
                          <ShoppingBag className="h-4 w-4" />
                          Add to Cart
                        </div>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.getElementById('portal-root')
        )}

    </>
  );
};

export const ProductCard = React.memo(ProductCardComponent);
