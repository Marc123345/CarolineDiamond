import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X, ShoppingBag, Heart, Star, Sparkles, ZoomIn, Info, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProcessedProduct, ProductVariant } from '../types/shopify';
import { findVariantByOptions } from '../utils/shopifyHelpers';
import { extractProductShape, getImagesForShape } from '../utils/shapeUtils';
import { formatPrice } from '../utils/filterUtils';

interface ProductQuickViewProps {
  product: ProcessedProduct | null;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  const { addToCart, loading: cartLoading } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Initialize options from the first variant
  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedOptions(product.variants[0].selectedOptions || {});
    }
  }, [product]);

  // Determine the active variant based on CSV Option mapping
  const selectedVariant = useMemo(() => {
    if (!product) return null;
    return findVariantByOptions(product, selectedOptions);
  }, [product, selectedOptions]);

  // Dynamic Image Gallery Logic
  const displayImages = useMemo(() => {
    if (!product) return [];
    
    // 1. If variant has specific images (Shopify standard), use those
    if (selectedVariant?.images?.length) return selectedVariant.images;
    if (selectedVariant?.image) return [selectedVariant.image, ...product.images.filter(img => img !== selectedVariant.image)];

    // 2. Otherwise, check for shape-specific imagery (CSV helper)
    const shape = selectedOptions['Shape'] || selectedOptions['shape'] || extractProductShape(product);
    if (shape) {
      const shapeImages = getImagesForShape(product, shape);
      if (shapeImages.length > 0) return shapeImages;
    }

    return product.images;
  }, [product, selectedVariant, selectedOptions]);

  if (!product) return null;

  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;

  const isInWishlist = wishlistState.items.some(item => item.id === product.handle);

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
    setCurrentImageIndex(0); // Reset gallery on change
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAddingToCart(true);
    try {
      await addToCart(selectedVariant.id, 1);
      onClose();
    } catch (error) {
      console.error('Cart Error:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-0 sm:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        
        {/* Responsive Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur shadow-lg rounded-full hover:bg-white transition-colors sm:hidden"
        >
          <X className="h-6 w-6 text-gray-900" />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid lg:grid-cols-2 gap-0 lg:gap-8">
            
            {/* Left: Premium Gallery */}
            <div className="p-4 sm:p-8 space-y-4 bg-gray-50/50">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-inner group">
                <img
                  src={displayImages[currentImageIndex] || product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {displayImages.slice(0, 5).map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${currentImageIndex === i ? 'w-6 bg-gray-900' : 'w-2 bg-gray-300'}`} />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      currentImageIndex === i ? 'border-gray-900 shadow-md scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Intelligence */}
            <div className="p-6 sm:p-10 flex flex-col justify-center space-y-8">
              <header className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-Color-Champagne-Gold px-3 py-1 bg-Color-Champagne-Gold/10 rounded-full">
                    {product.category || 'Fine Jewelry'}
                  </span>
                  <div className="flex gap-0.5 text-Color-Champagne-Gold">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(selectedVariant?.price || product.price)}
                  </span>
                  {selectedVariant?.compareAtPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(selectedVariant.compareAtPrice)}
                    </span>
                  )}
                </div>
              </header>

              {/* CSV-Mapped Options */}
              <div className="space-y-6">
                {product.options.map((option) => {
                  const isMetal = option.name === 'Metal Color';
                  const isSize = option.name === 'Ring size';
                  
                  return (
                    <div key={option.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">{option.name}</label>
                        {isSize && <button className="text-[10px] font-bold text-Color-Champagne-Gold underline">Size Guide</button>}
                      </div>

                      {isMetal ? (
                        <div className="flex gap-4">
                          {option.values.map((val) => {
                            const isSelected = selectedOptions[option.name] === val;
                            const colors: any = { 'Yellow Gold': '#E6BE8A', 'White Gold': '#D4D6D8', 'Rose Gold': '#E8C4B8' };
                            return (
                              <button
                                key={val}
                                onClick={() => handleOptionChange(option.name, val)}
                                className={`group flex flex-col items-center gap-2 transition-all ${isSelected ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                              >
                                <div 
                                  className="w-10 h-10 rounded-full border-2 p-0.5 transition-all"
                                  style={{ borderColor: isSelected ? '#000' : 'transparent' }}
                                >
                                  <div className="w-full h-full rounded-full shadow-inner" style={{ background: colors[val] || '#ccc' }} />
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-tighter">{val.split(' ')[0]}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((val) => {
                            const isSelected = selectedOptions[option.name] === val;
                            return (
                              <button
                                key={val}
                                onClick={() => handleOptionChange(option.name, val)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                                  isSelected ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'
                                }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !selectedVariant?.availableForSale}
                  className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isAddingToCart ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingBag className="h-5 w-5" />}
                  {selectedVariant?.availableForSale ? 'ADD TO BAG' : 'OUT OF STOCK'}
                </button>

                <div className="flex gap-4">
                  <button 
                    onClick={() => wishlistDispatch({ type: isInWishlist ? 'REMOVE_ITEM' : 'ADD_ITEM', payload: product })}
                    className={`flex-1 py-4 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isInWishlist ? 'bg-red-50 border-red-100 text-red-500' : 'border-gray-100 text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                    {isInWishlist ? 'IN WISHLIST' : 'SAVE FOR LATER'}
                  </button>
                  <button className="p-4 rounded-xl border-2 border-gray-100 text-gray-400 hover:text-gray-900 transition-colors">
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Micro-Copy Footer */}
              <footer className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                <div className="flex items-center gap-2"><Check className="h-3 w-3 text-green-500" /> Handmade in Antwerp</div>
                <div className="flex items-center gap-2"><Check className="h-3 w-3 text-green-500" /> Insured Shipping</div>
                <div className="flex items-center gap-2"><Check className="h-3 w-3 text-green-500" /> 18K Certified Gold</div>
                <div className="flex items-center gap-2"><Check className="h-3 w-3 text-green-500" /> Conflict-Free</div>
              </footer>
            </div>

          </div>
        </div>
        
        {/* Desktop Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
        >
          <X className="h-6 w-6 text-gray-400" />
        </button>
      </div>
    </div>,
    portalRoot
  );
};