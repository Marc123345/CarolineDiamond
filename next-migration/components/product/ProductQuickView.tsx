'use client';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, ShoppingBag, Heart, Star, Sparkles, ZoomIn } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ProcessedProduct } from '../../types/shopify';
import { findVariantByOptions } from '../../utils/shopifyHelpers';
import { extractProductShape } from '../../utils/shapeUtils';

interface ProductQuickViewProps {
  product: ProcessedProduct | null;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  const { addToCart, loading: cartLoading } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [filteredImages, setFilteredImages] = useState<string[]>([]);
  const [customization, setCustomization] = useState({
    goldType: 'yellow',
    diamondType: 'white',
    engraving: '',
    size: ''
  });
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Initialize selected variant and options
  useEffect(() => {
    if (product && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);
      setSelectedOptions(firstVariant.selectedOptions || {});
    }
  }, [product]);

  // Filter images based on selected variant with shape support
  useEffect(() => {
    if (!product) {
      setFilteredImages([]);
      return;
    }

    if (!selectedVariant) {
      setFilteredImages(product.images || []);
      return;
    }

    // Extract shape from product metadata
    const productShape = extractProductShape(product);

    // Get shape and color options from the selected variant
    const shapeOption = selectedVariant.selectedOptions?.['Shape'] ||
                       selectedVariant.selectedOptions?.['shape'] ||
                       selectedVariant.selectedOptions?.['Form'] ||
                       productShape;

    const colorOption = selectedVariant.selectedOptions?.['Color'] ||
                       selectedVariant.selectedOptions?.['color'] ||
                       selectedVariant.selectedOptions?.['Metal'];

    // Priority 1: If variant has its own images, use those
    if (selectedVariant.images && selectedVariant.images.length > 0) {
      setFilteredImages(selectedVariant.images);
      if (currentImageIndex >= selectedVariant.images.length) {
        setCurrentImageIndex(0);
      }
      return;
    }

    // Priority 2: Use shape-based filtering if shape is available
    if (shapeOption) {
      const shapeImages = product.images?.filter((img: string) =>
        img.toLowerCase().includes(shapeOption.toLowerCase())
      ) || [];
      if (shapeImages.length > 0) {
        // Further filter by color if available
        if (colorOption) {
          const colorFilteredVariants = product.variants.filter(v => {
            const vColor = v.selectedOptions?.['Color'] || v.selectedOptions?.['color'] || v.selectedOptions?.['Metal'];
            return vColor?.toLowerCase() === colorOption.toLowerCase();
          });

          const colorImages: string[] = [];
          colorFilteredVariants.forEach(v => {
            if (v.images && v.images.length > 0) {
              colorImages.push(...v.images);
            } else if (v.image) {
              colorImages.push(v.image);
            }
          });

          if (colorImages.length > 0) {
            setFilteredImages(Array.from(new Set(colorImages)));
            if (currentImageIndex >= colorImages.length) {
              setCurrentImageIndex(0);
            }
            return;
          }
        }

        setFilteredImages(shapeImages);
        if (currentImageIndex >= shapeImages.length) {
          setCurrentImageIndex(0);
        }
        return;
      }
    }

    // Priority 3: Filter by color only
    if (colorOption) {
      const sameColorVariants = product.variants.filter(v => {
        if (!v.selectedOptions) return false;
        const vColor = v.selectedOptions['Color'] ||
                      v.selectedOptions['color'] ||
                      v.selectedOptions['Metal'];
        return vColor?.toLowerCase() === colorOption.toLowerCase();
      });

      const colorImages = sameColorVariants
        .map(v => v.image)
        .filter((img): img is string => !!img);

      const uniqueColorImages = Array.from(new Set(colorImages));

      if (uniqueColorImages.length > 0) {
        setFilteredImages(uniqueColorImages);
        if (currentImageIndex >= uniqueColorImages.length) {
          setCurrentImageIndex(0);
        }
        return;
      }
    }

    // Fallback: Show variant image first, then all product images
    if (selectedVariant.image) {
      setFilteredImages([selectedVariant.image, ...product.images.filter(img => img !== selectedVariant.image)]);
    } else {
      setFilteredImages(product.images);
    }
  }, [selectedVariant, product, currentImageIndex]);

  // Update selected variant when options change
  useEffect(() => {
    if (!product) return;

    const variant = findVariantByOptions(product, selectedOptions);
    if (variant) {
      setSelectedVariant(variant);
    }
  }, [selectedOptions, product]);

  if (!product) return null;

  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;

  const isInWishlist = wishlistState.items.some(item => item.id === product.handle);

  const handleOptionChange = (optionName: string, optionValue: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: optionValue
    }));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    setIsAddingToCart(true);
    try {
      const attributes: { key: string; value: string }[] = [];
      if (product.isCustomizable && customization.engraving) {
        attributes.push({ key: 'Gravering', value: customization.engraving });
      }
      if (product.isCustomizable && customization.size) {
        attributes.push({ key: 'Ringmaat', value: customization.size });
      }

      await addToCart(selectedVariant.id, 1, attributes.length > 0 ? attributes : undefined);
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: product.handle });
    } else {
      wishlistDispatch({ type: 'ADD_ITEM', payload: {
        id: product.handle,
        name: product.name,
        price: selectedVariant?.price || product.price,
        image: product.image,
        category: product.category
      }});
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 w-full max-w-full">
      <div className="bg-white rounded-none sm:rounded-3xl w-full max-w-full sm:max-w-6xl h-full sm:h-auto sm:max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#e5d9d2] flex-shrink-0">
          <div className="flex items-center">
            <ZoomIn className="h-6 w-6 text-[#764e3e] mr-3" />
            <h2 className="text-2xl font-semibold text-[#2c2827]">Product Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 sm:p-2 hover:bg-[#f3ede8] transition-colors duration-200 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
          >
            <X className="h-6 w-6 text-[#2c2827]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto w-full max-w-full">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-8 w-full max-w-full">
            {/* Image Gallery */}
            <div className="space-y-4 w-full max-w-full">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f8f6f3] group w-full max-w-full">
                <img
                  src={filteredImages[currentImageIndex] || selectedVariant?.image || product.image || 'https://ik.imagekit.io/qcvroy8xpd/PngItem_479625%201.png?updatedAt=1756832129082'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 max-w-full"
                />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                      isInWishlist
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 hover:bg-white text-[#2c2827] hover:text-red-500'
                    } min-w-[44px] min-h-[44px] flex items-center justify-center`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Image thumbnails - Display filtered images */}
              {filteredImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 w-full max-w-full scrollbar-hide">
                  {filteredImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 object-cover flex-shrink-0 rounded-lg border-2 transition-colors duration-200 ${
                        currentImageIndex === index
                          ? 'border-[#764e3e] shadow-lg'
                          : 'border-[#e5d9d2] hover:border-[#764e3e]'
                      } min-w-[44px] min-h-[44px]`}
                    >
                      <img
                        src={image}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg max-w-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 w-full max-w-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-[#764e3e] text-white px-3 py-1 text-sm font-medium">
                    {product.category}
                  </span>
                  <div className="flex text-[#bc9a84]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <h1 className="text-3xl font-semibold text-[#2c2827] mb-4">{product.name}</h1>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-[#764e3e]">
                    €{selectedVariant?.price.toLocaleString() || product.price.toLocaleString()}
                  </p>
                  {selectedVariant?.compareAtPrice && (
                    <p className="text-xl text-Color-Champagne-Gold line-through">
                      €{selectedVariant.compareAtPrice.toLocaleString()}
                    </p>
                  )}
                </div>
                {product.description && (
                  <p className="text-[#837f7a] leading-relaxed text-lg">{product.description}</p>
                )}
              </div>

              {/* Product Options */}
              {product.options.length > 0 && (
                <div className="bg-[#f8f6f3] p-4 sm:p-6 rounded-xl w-full max-w-full">
                  <h3 className="font-semibold text-[#2c2827] mb-4">Product Opties</h3>
                  <div className="space-y-4 w-full max-w-full">
                    {product.options.map((option) => {
                      const isColorOption = option.name.toLowerCase() === 'color' ||
                                           option.name.toLowerCase() === 'colour' ||
                                           option.name.toLowerCase() === 'metal';

                      return (
                        <div key={option.id}>
                          <label className="block text-sm font-medium text-[#2c2827] mb-2">
                            {option.name}
                          </label>
                          {selectedOptions[option.name] && (
                            <p className="text-sm text-Color-Light-300 font-medium mb-3">
                              Selected: {selectedOptions[option.name]}
                            </p>
                          )}

                          {isColorOption ? (
                            // Color swatches
                            <div className="flex flex-wrap gap-3">
                              {option.values.map((value) => {
                                const colorValue = value.toLowerCase();
                                let bgColor = '';
                                let borderColor = '';

                                // Map color names to exact colors
                                if (colorValue.includes('white') || colorValue.includes('whte')) {
                                  bgColor = '#FFFFFF';
                                  borderColor = '#D1D1D1';
                                } else if (colorValue.includes('yellow')) {
                                  bgColor = '#D3B275';
                                  borderColor = '#B8985E';
                                } else if (colorValue.includes('rose')) {
                                  bgColor = '#B76E79';
                                  borderColor = '#9D5D66';
                                } else {
                                  bgColor = '#E5E5E5';
                                  borderColor = '#999';
                                }

                                const isSelected = selectedOptions[option.name] === value;

                                return (
                                  <div key={value} className="flex flex-col items-center gap-2">
                                    <button
                                      onClick={() => handleOptionChange(option.name, value)}
                                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg transition-all duration-200 border-2 min-w-[44px] min-h-[44px] ${
                                        isSelected
                                          ? 'ring-4 ring-[#764e3e] ring-offset-2 scale-110 shadow-lg'
                                          : 'hover:ring-2 hover:ring-gray-400 hover:scale-105'
                                      }`}
                                      style={{
                                        backgroundColor: bgColor,
                                        borderColor: isSelected ? borderColor : '#e5e5e5'
                                      }}
                                      title={value}
                                      aria-label={value}
                                    />
                                    <span className={`text-xs font-medium transition-colors ${
                                      isSelected ? 'text-Color-Light-300' : 'text-Color-Champagne-Gold'
                                    }`}>
                                      {value.split(' ')[0]}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            // Regular buttons for non-color options
                            <div className="grid grid-cols-2 gap-2">
                              {option.values.map((value) => {
                                const isSelected = selectedOptions[option.name] === value;
                                return (
                                  <button
                                    key={value}
                                    onClick={() => handleOptionChange(option.name, value)}
                                    className={`p-3 border-2 transition-all duration-200 text-sm rounded-lg font-medium min-w-[44px] min-h-[44px] ${
                                      isSelected
                                        ? 'border-Color-Light-300 bg-Color-Light-300 text-Color-Netural-White shadow-lg scale-105'
                                        : 'border-Color-Light-300/30 hover:border-Color-Light-300 text-Color-Dark-500 bg-white hover:bg-Color-Light-300/5'
                                    }`}
                                  >
                                    {isSelected && <span className="mr-1">✓</span>}
                                    {value}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Features */}
              {product.features && (
                <div className="bg-[#f8f6f3] p-4 sm:p-6 rounded-xl w-full max-w-full">
                  <h3 className="font-semibold text-[#2c2827] mb-4">Kenmerken</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-[#837f7a]">
                        <Sparkles className="h-4 w-4 text-[#764e3e] mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Customization Options */}
              {product.isCustomizable && (
                <div className="bg-[#f8f6f3] p-4 sm:p-6 rounded-xl w-full max-w-full">
                  <h3 className="font-semibold text-[#2c2827] mb-4">Personalisatie Opties</h3>
                  <div className="space-y-4 w-full max-w-full">
                    <div>
                      <label className="block text-sm font-medium text-[#2c2827] mb-2">
                        Goud Type
                      </label>
                      <select
                        value={customization.goldType}
                        onChange={(e) => setCustomization({...customization, goldType: e.target.value})}
                        className="w-full max-w-full px-4 py-3 border border-[#e5d9d2] rounded-lg focus:ring-2 focus:ring-[#764e3e] focus:border-transparent"
                      >
                        <option value="yellow">Geel Goud (18k)</option>
                        <option value="white">Wit Goud (18k)</option>
                        <option value="rose">Rosé Goud (18k)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2c2827] mb-2">
                        Diamant Type
                      </label>
                      <select
                        value={customization.diamondType}
                        onChange={(e) => setCustomization({...customization, diamondType: e.target.value})}
                        className="w-full max-w-full px-4 py-3 border border-[#e5d9d2] rounded-lg focus:ring-2 focus:ring-[#764e3e] focus:border-transparent"
                      >
                        <option value="white">Witte Diamanten</option>
                        <option value="pink">Roze Diamanten</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-full">
                      <div>
                        <label className="block text-sm font-medium text-[#2c2827] mb-2">
                          Ringmaat
                        </label>
                        <input
                          type="text"
                          value={customization.size}
                          onChange={(e) => setCustomization({...customization, size: e.target.value})}
                          placeholder="Bijv. 54, 56..."
                          className="w-full max-w-full px-4 py-3 border border-[#e5d9d2] rounded-lg focus:ring-2 focus:ring-[#764e3e] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2c2827] mb-2">
                          Gravering
                        </label>
                        <input
                          type="text"
                          value={customization.engraving}
                          onChange={(e) => setCustomization({...customization, engraving: e.target.value})}
                          placeholder="Bijv. initialen..."
                          className="w-full max-w-full px-4 py-3 border border-[#e5d9d2] rounded-lg focus:ring-2 focus:ring-[#764e3e] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Materials */}
              {product.materials && (
                <div className="bg-[#f8f6f3] p-4 sm:p-6 rounded-xl w-full max-w-full">
                  <h3 className="font-semibold text-[#2c2827] mb-4">Materialen</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material, index) => (
                      <span key={index} className="bg-[#764e3e] text-white px-3 py-1 text-sm">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full max-w-full">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || cartLoading || !selectedVariant?.availableForSale}
                  className="flex-1 bg-gradient-to-r from-[#764e3e] to-[#906f53] hover:from-[#906f53] hover:to-[#764e3e] text-white py-4 px-6 font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isAddingToCart || cartLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-b-2 border-white mr-2"></div>
                      Toevoegen...
                    </>
                  ) : !selectedVariant?.availableForSale ? (
                    'Uitverkocht'
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Toevoegen aan Winkelwagen
                    </>
                  )}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                    isInWishlist
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'border-2 border-[#764e3e] text-[#764e3e] hover:bg-[#764e3e] hover:text-white'
                  } min-w-[44px] min-h-[44px] w-full sm:w-auto`}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-[#e5d9d2] p-4 sm:p-6 rounded-xl w-full max-w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm w-full max-w-full">
                  <div>
                    <h4 className="font-semibold text-[#2c2827] mb-2">Productie</h4>
                    <p className="text-[#837f7a]">{product.deliveryTime || '10-14 werkdagen'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2c2827] mb-2">Garantie</h4>
                    <p className="text-[#837f7a]">2 jaar</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2c2827] mb-2">Certificaat</h4>
                    <p className="text-[#837f7a]">HRD/GIA/IGI</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2c2827] mb-2">Handgemaakt</h4>
                    <p className="text-[#837f7a]">Antwerpen</p>
                  </div>
                  {selectedVariant && (
                    <>
                      <div>
                        <h4 className="font-semibold text-[#2c2827] mb-2">Variant</h4>
                        <p className="text-[#837f7a]">{selectedVariant.title}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2c2827] mb-2">Beschikbaarheid</h4>
                        <p className={selectedVariant.availableForSale ? 'text-green-600' : 'text-red-600'}>
                          {selectedVariant.availableForSale ? 'Op voorraad' : 'Uitverkocht'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    portalRoot
  );
};
