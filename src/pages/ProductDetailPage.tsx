import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ArrowLeft, ShoppingBag, Heart, Sparkles, Shield, 
  AlertCircle, Check, Phone, Calendar, Gem 
} from 'lucide-react';

// Hooks & Context
import { useShopifyProduct } from '../hooks/useShopifyProducts'; // Assumes you added the singular hook
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

// Components
import { Breadcrumbs } from '../components/shared/Breadcrumbs'; // Adjusted path
import { ProductImageGallery } from '../components/product/ProductImageGallery'; // Adjusted path
import { ProductStructuredData } from '../components/product/ProductStructuredData'; // For SEO

// Utils & Types
import { findVariantByOptions } from '../utils/shopifyHelpers'; // Adjusted path
import { extractProductShape, getImagesForShape, shapesMatch } from '../utils/shapeUtils'; // Adjusted path
import { ProductVariant } from '../types'; // Adjusted path
import { contactInfo } from '../config/siteConfig';
import { trackProductView, trackProductCartAdd } from '../lib/productPerformanceDb';
import { updateProductMeta } from '../utils/seoHelpers';

// Helper function to safely format prices
const formatPrice = (price: number | undefined): string => {
  if (price === undefined || price === null || isNaN(price)) return '0';
  return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const ProductDetailPage: React.FC = () => {
  const { id: handle } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onNavigate = (path: string) => {
    if (path.startsWith('/shop')) {
      const params = new URLSearchParams(searchParams);
      params.delete('color'); 
      const queryString = params.toString();
      navigate(queryString ? `${path.split('?')[0]}?${queryString}` : path);
    } else {
      navigate(path);
    }
  };

  const { addToCart, loading: cartLoading } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { success, error: showError, warning } = useToast();

  // Fetch product
  const { product, loading, error, usingFallback } = useShopifyProduct(handle || '');

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [filteredImages, setFilteredImages] = useState<string[]>([]);
  const [customization, setCustomization] = useState({
    goldType: 'yellow',
    diamondType: 'white',
    engraving: '',
    size: '',
  });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // @ts-ignore
  const isInWishlist = wishlistState.items.some((item) => item.id === handle);

  // Filter out system options
  const visibleProductOptions = useMemo(() => {
    if (!product?.options) return [];
    return product.options.filter(option => {
      const name = option.name.toLowerCase();
      return name !== 'title' && name !== 'default title'; 
      // Note: We keep Color/Size visible to render them, but might style them differently
    });
  }, [product?.options]);

  const currentImage = filteredImages[selectedImageIndex] || selectedVariant?.image || product?.image;

  // Initialize Variant based on URL or Default
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) return;

    try {
      const colorParam = searchParams.get('color');
      let variantToSelect: ProductVariant | null = null;

      if (colorParam) {
        // Try to find variant matching URL color
        variantToSelect = product.variants.find(v => {
          if (!v.selectedOptions) return false;
          // Check common color keys
          const vColor = v.selectedOptions['Color'] || v.selectedOptions['Metal'] || v.selectedOptions['color'];
          return vColor && vColor.toLowerCase().includes(colorParam.toLowerCase());
        }) || null;
      }

      // Default to first available
      if (!variantToSelect) {
        variantToSelect = product.variants.find(v => v.availableForSale) || product.variants[0];
      }

      if (variantToSelect) {
        setSelectedVariant(variantToSelect);
        setSelectedOptions(variantToSelect.selectedOptions || {});
        trackProductView(product.id, variantToSelect.id);
      }
    } catch (err) {
      console.error('Error initializing variant:', err);
    }
  }, [product, searchParams]);

  // Update SEO
  useEffect(() => {
    if (product && selectedVariant && currentImage) {
      updateProductMeta(product, selectedVariant, currentImage);
    }
  }, [product, selectedVariant, currentImage]);

  // Update variant when options change
  useEffect(() => {
    if (!product || !product.variants || Object.keys(selectedOptions).length === 0) return;
    const variant = findVariantByOptions(product, selectedOptions);
    if (variant && variant.id !== selectedVariant?.id) {
      setSelectedVariant(variant);
    }
  }, [selectedOptions, product]);

  // Smart Image Filtering
  useEffect(() => {
    if (!product || !selectedVariant) return;

    // 1. Variant specific images
    if (selectedVariant.images && selectedVariant.images.length > 0) {
      setFilteredImages(selectedVariant.images);
      setSelectedImageIndex(0);
      return;
    }

    // 2. Filter by Color if available
    const colorOption = selectedVariant.selectedOptions?.['Color'] || selectedVariant.selectedOptions?.['Metal'];
    if (colorOption && product.images.length > 0) {
        // This is a basic heuristic; advanced setups use alt text or metafields
        // For now, fallback to all images if no specific logic
        setFilteredImages(product.images); 
    } else {
        setFilteredImages(product.images || []);
    }
    
    // Ensure index is valid
    setSelectedImageIndex(0);
  }, [selectedVariant, product]);

  // Handlers
  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
    
    // Update customization state if relevant
    if (name.toLowerCase().includes('size')) {
        setCustomization(prev => ({ ...prev, size: value }));
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !product) return;
    if (!selectedVariant.availableForSale) {
        showError('This variant is out of stock');
        return;
    }

    setIsAddingToCart(true);
    try {
        const attributes = [];
        if (customization.engraving) attributes.push({ key: 'Engraving', value: customization.engraving });
        
        await addToCart(selectedVariant.id, 1, attributes.length ? attributes : undefined);
        success('Added to cart');
        trackProductCartAdd(product.id, selectedVariant.id);
    } catch (err) {
        showError('Failed to add to cart');
    } finally {
        setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: product!.handle });
    } else {
      wishlistDispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product!.handle,
          name: product!.name,
          price: selectedVariant?.price || product!.price,
          image: product!.image,
          category: product!.category,
        },
      });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-2 border-gray-300 border-t-black rounded-full" /></div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const currentPrice = selectedVariant?.price || product.price;

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Data */}
      <ProductStructuredData product={product} selectedVariant={selectedVariant} currentImage={currentImage} />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        <Breadcrumbs
          items={[
            { label: 'Shop', onClick: () => onNavigate('/shop') },
            { label: product.category || 'Product' },
            { label: product.name }
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Gallery */}
          <div className="space-y-6">
            <ProductImageGallery
              images={filteredImages.length ? filteredImages : [product.image]}
              productName={product.name}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />
          </div>

          {/* Right: Details */}
          <div className="space-y-8">
            <div>
                <span className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</span>
                <h1 className="text-3xl font-serif text-gray-900 mt-2 mb-4">{product.name}</h1>
                <div className="flex items-end gap-4">
                    <p className="text-2xl font-medium text-gray-900">€{formatPrice(currentPrice)}</p>
                    {selectedVariant?.compareAtPrice && (
                        <p className="text-lg text-gray-400 line-through mb-1">€{formatPrice(selectedVariant.compareAtPrice)}</p>
                    )}
                </div>
            </div>

            {/* Options */}
            <div className="space-y-6 border-t border-b border-gray-100 py-6">
                {visibleProductOptions.map(option => (
                    <div key={option.id}>
                        <label className="block text-sm font-medium text-gray-900 mb-2">{option.name}</label>
                        <div className="flex flex-wrap gap-2">
                            {option.values.map(value => {
                                const isSelected = selectedOptions[option.name] === value;
                                // Basic Color Swatch Logic
                                const isColor = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('metal');
                                const colorMap: any = { 'Yellow Gold': '#E6C676', 'White Gold': '#E5E5E5', 'Rose Gold': '#E7Bba9' };
                                
                                if (isColor && colorMap[value]) {
                                    return (
                                        <button
                                            key={value}
                                            onClick={() => handleOptionChange(option.name, value)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${isSelected ? 'border-gray-900 scale-110' : 'border-transparent hover:border-gray-300'}`}
                                            style={{ backgroundColor: colorMap[value] }}
                                            title={value}
                                        />
                                    );
                                }

                                return (
                                    <button
                                        key={value}
                                        onClick={() => handleOptionChange(option.name, value)}
                                        className={`px-4 py-2 border rounded text-sm transition-all ${
                                            isSelected 
                                            ? 'border-gray-900 bg-gray-900 text-white' 
                                            : 'border-gray-200 hover:border-gray-900 text-gray-700'
                                        }`}
                                    >
                                        {value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Custom Engraving */}
                {product.isCustomizable && (
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                            <Sparkles className="w-4 h-4 mr-1 text-yellow-600" />
                            Engraving (Optional)
                        </label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded p-2 text-sm focus:border-gray-900 outline-none"
                            placeholder="e.g., A & B 2024"
                            value={customization.engraving}
                            onChange={e => setCustomization(prev => ({ ...prev, engraving: e.target.value }))}
                        />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !selectedVariant?.availableForSale}
                    className={`flex-1 py-4 px-6 text-white font-medium rounded shadow-lg transition-all flex items-center justify-center gap-2 ${
                        !selectedVariant?.availableForSale 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gray-900 hover:bg-gray-800 hover:shadow-xl'
                    }`}
                >
                    {isAddingToCart ? 'Adding...' : !selectedVariant?.availableForSale ? 'Out of Stock' : (
                        <>
                            <ShoppingBag className="w-5 h-5" />
                            Add to Cart
                        </>
                    )}
                </button>
                <button
                    onClick={handleWishlistToggle}
                    className={`p-4 border rounded transition-colors ${
                        isInWishlist ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-600 hover:border-gray-900'
                    }`}
                >
                    <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Info Tabs / Accordion */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>In stock - Ships within {product.deliveryTime || '1-3 days'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>2 Year Warranty & Authenticity Certificate</span>
                </div>
                {contactInfo.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-900" />
                        <span>Need help? Call us at <a href={`tel:${contactInfo.phone}`} className="underline hover:text-gray-900">{contactInfo.phone}</a></span>
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="prose prose-sm text-gray-600 mt-8 border-t border-gray-100 pt-8">
                <h3 className="text-gray-900 font-medium text-lg mb-2">Description</h3>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};