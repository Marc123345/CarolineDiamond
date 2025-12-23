import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useShopifyProduct } from '../hooks/useShopifyProducts';
import { findVariantByOptions, ensureRingSizeOption } from '../utils/shopifyHelpers';
import { extractProductShape, getImagesForShape, shapesMatch } from '../utils/shapeUtils';
import { useCart } from '../context/CartContext';
import { ProductVariant } from '../types/shopify';
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Heart,
  Sparkles,
  Shield,
  Truck,
  WifiOff,
  AlertCircle,
  Check,
  Award,
  Phone,
  Calendar,
  Gem,
  Package,
  RefreshCw,
  X
} from 'lucide-react';
import { WireframeImage } from '../components/WireframeImage';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { contactInfo } from '../config/siteConfig';
import { trackProductView, trackProductCartAdd } from '../lib/productPerformanceDb';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { updateProductMeta } from '../utils/seoHelpers';

// Helper function to safely format prices with fallback
const formatPrice = (price: number | undefined): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0';
  }
  return price.toLocaleString();
};

export const ProductDetailPage: React.FC = () => {
  const { id: handle } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Add onNavigate function for breadcrumbs with filter preservation
  const onNavigate = (path: string) => {
    // If navigating back to shop, preserve filters from URL
    if (path.startsWith('/shop')) {
      const params = new URLSearchParams(searchParams);
      params.delete('color'); // Remove color param as it's product-specific
      const queryString = params.toString();
      navigate(queryString ? `${path.split('?')[0]}?${queryString}` : path);
    } else {
      navigate(path);
    }
  };

  const { addToCart, loading: cartLoading } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const toast = useToast();

  // Fetch product from Shopify
  const { product: rawProduct, loading, error, usingFallback } = useShopifyProduct(handle || '');

  // Ensure ring products have Size option
  const product = rawProduct ? ensureRingSizeOption(rawProduct) : rawProduct;

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
  const [showTrustSignals, setShowTrustSignals] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const isInWishlist = wishlistState.items.some((item) => item.id === handle);

  // Calculate current image early for use in useEffect
  const currentImage = filteredImages[selectedImageIndex] || selectedVariant?.image || product?.image;

  // Initialize selected options and variant when product loads, considering color from URL
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) {
      // Only warn if we're not in a loading state (actual error vs initial render)
      if (!loading && product) {
        console.warn('ProductDetailPage: Product has no variants available');
      }
      return;
    }

    try {
      const colorParam = searchParams.get('color');
      const categoryParam = searchParams.get('category');
      let variantToSelect: ProductVariant | null = null;

      // If color parameter exists, try to find matching variant
      if (colorParam) {
        const colorMap: Record<string, string[]> = {
          'white': ['white gold', 'whte gold', 'white', 'wit'],
          'yellow': ['yellow gold', 'yellow', 'geel'],
          'rose': ['rose gold', 'rose', 'rosé'],
          'platinum': ['platinum', 'platina']
        };

        const normalizedColor = colorParam.toLowerCase().trim();
        const searchTerms = colorMap[normalizedColor] || [normalizedColor];

        // Find variant matching the color parameter
        variantToSelect = product.variants.find(v => {
          if (!v.selectedOptions) return false;

          // Check multiple option keys for color
          const colorKeys = ['Color', 'color', 'Metal', 'metal', 'Kleur', 'kleur'];
          const vColor = colorKeys
            .map(key => v.selectedOptions?.[key])
            .find(val => val !== undefined);

          if (!vColor) return false;

          const vColorLower = vColor.toLowerCase();
          return searchTerms.some(term => vColorLower.includes(term));
        }) || null;

        if (!variantToSelect) {
          console.warn(`No variant found for color: ${colorParam}`);
        }
      }

      // Default to first available variant if no color match
      if (!variantToSelect) {
        variantToSelect = product.variants.find(v => v.availableForSale) || product.variants[0];
      }

      if (variantToSelect) {
        setSelectedVariant(variantToSelect);
        setSelectedOptions(variantToSelect.selectedOptions || {});

        // Track product view
        trackProductView(product.id, variantToSelect.id).catch(err =>
          console.error('Failed to track product view:', err)
        );
      } else {
        console.error('ProductDetailPage: No variant could be selected');
      }
    } catch (err) {
      console.error('Error initializing product variant:', err);
      // Fallback to first variant on error
      if (product.variants.length > 0) {
        const fallbackVariant = product.variants[0];
        setSelectedVariant(fallbackVariant);
        setSelectedOptions(fallbackVariant.selectedOptions || {});
      }
    }
  }, [product, searchParams]);

  // Show trust signals after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTrustSignals(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Update SEO meta tags when product or variant changes
  useEffect(() => {
    if (product && selectedVariant) {
      updateProductMeta(product, selectedVariant, currentImage);
    }
  }, [product, selectedVariant, currentImage]);

  // Update selected variant when options change
  useEffect(() => {
    if (!product || !product.variants || Object.keys(selectedOptions).length === 0) return;

    try {
      const variant = findVariantByOptions(product, selectedOptions);
      if (variant && variant.id !== selectedVariant?.id) {
        setSelectedVariant(variant);
      }
    } catch (err) {
      console.error('Error updating variant:', err);
    }
  }, [selectedOptions, product, selectedVariant?.id]);

  // Filter images based on selected variant with improved shape handling
  useEffect(() => {
    if (!product) {
      setFilteredImages([]);
      return;
    }

    if (!selectedVariant) {
      setFilteredImages(product.images || []);
      return;
    }

    // Extract shape from product metadata (tags, title, metafields)
    const productShape = extractProductShape(product);

    // Get shape and color options from the selected variant
    const shapeOption = selectedVariant.selectedOptions?.['Shape'] ||
                       selectedVariant.selectedOptions?.['shape'] ||
                       selectedVariant.selectedOptions?.['Form'] ||
                       productShape; // Fallback to product-level shape

    const colorOption = selectedVariant.selectedOptions?.['Color'] ||
                       selectedVariant.selectedOptions?.['color'] ||
                       selectedVariant.selectedOptions?.['Metal'];

    // Priority 1: If variant has its own images array, use those
    if (selectedVariant.images && selectedVariant.images.length > 0) {
      setFilteredImages(selectedVariant.images);
      setSelectedImageIndex(0);
      return;
    }

    // Priority 2: If variant has a single image, find related images
    if (selectedVariant.image) {
      // Find all variants with matching attributes to get related images
      const relatedVariants = product.variants.filter(v => {
        if (!v.selectedOptions) return false;

        const vShape = v.selectedOptions['Shape'] || v.selectedOptions['shape'] || v.selectedOptions['Form'];
        const vColor = v.selectedOptions['Color'] || v.selectedOptions['color'] || v.selectedOptions['Metal'];

        // Match by shape first (highest priority) using normalized comparison
        const shapeMatch = shapeOption ? shapesMatch(vShape || '', shapeOption) : true;
        const colorMatch = colorOption ? vColor?.toLowerCase() === colorOption.toLowerCase() : true;

        return shapeMatch && colorMatch;
      });

      // Collect images from related variants (including their images arrays)
      const relatedImages: string[] = [];
      relatedVariants.forEach(v => {
        if (v.images && v.images.length > 0) {
          relatedImages.push(...v.images);
        } else if (v.image) {
          relatedImages.push(v.image);
        }
      });

      // Remove duplicates and ensure selected variant's image is first
      const uniqueImages = Array.from(new Set([selectedVariant.image, ...relatedImages]));

      if (uniqueImages.length > 0) {
        setFilteredImages(uniqueImages);
        setSelectedImageIndex(0);
        return;
      }
    }

    // Priority 3: Use shape-based image mapping if shape is available
    if (shapeOption) {
      const shapeImages = getImagesForShape(product, shapeOption);
      if (shapeImages.length > 0) {
        // Filter by color if color option is selected
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
            if (selectedImageIndex >= colorImages.length) {
              setSelectedImageIndex(0);
            }
            return;
          }
        }

        setFilteredImages(shapeImages);
        if (selectedImageIndex >= shapeImages.length) {
          setSelectedImageIndex(0);
        }
        return;
      }
    }

    // Fallback: Use all product images
    setFilteredImages(product.images || []);
    setSelectedImageIndex(0);
  }, [selectedVariant, product]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-Color-Light-300 mx-auto mb-4"></div>
          <p className="typography-body text-Color-Gray-700">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state with better messaging
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-Color-Light-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-Color-Netural-White" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-Color-Netural-Black mb-4">
            {error ? 'Unable to Load Product' : 'Product Not Found'}
          </h2>
          <p className="text-base text-gray-600 mb-2 leading-relaxed">
            {error ? (
              <span>We're having trouble loading this product. This may be a temporary issue.</span>
            ) : (
              <span>The product you are looking for does not exist or may have been moved.</span>
            )}
          </p>
          {handle && (
            <p className="text-sm text-gray-500 mb-8 font-mono bg-gray-100 p-2 rounded">
              Product ID: {handle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete('color');
                params.delete('category');
                const queryString = params.toString();
                navigate(queryString ? `/shop?${queryString}` : '/shop');
              }}
              className="px-6 py-3 bg-Color-Netural-Black text-white font-semibold rounded-lg hover:bg-Color-Champagne-Gold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center min-h-[48px]"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Shop
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white border-2 border-Color-Netural-Black text-Color-Netural-Black font-semibold rounded-lg hover:bg-Color-Netural-Black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center min-h-[48px]"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Collections
            </button>
          </div>
          {error && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
              <p className="text-sm text-blue-800 font-semibold mb-2">Need Help?</p>
              <p className="text-sm text-blue-600">
                Contact us at <a href="mailto:info@diamondsbycs.com" className="underline">info@diamondsbycs.com</a> or call <a href="tel:+32471762298" className="underline">+32 471 76 22 98</a>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleOptionChange = (optionName: string, optionValue: string) => {
    // Update selected options
    const newSelectedOptions = {
      ...selectedOptions,
      [optionName]: optionValue
    };
    setSelectedOptions(newSelectedOptions);

    // Special handling for Size option - update customization state too
    if (optionName.toLowerCase() === 'size' || optionName.toLowerCase() === 'ring size') {
      setCustomization({ ...customization, size: optionValue });
    }

    // Immediately find and set the matching variant for instant feedback
    if (product) {
      const matchingVariant = findVariantByOptions(product, newSelectedOptions);

      if (matchingVariant && matchingVariant.id !== selectedVariant?.id) {
        setSelectedVariant(matchingVariant);
        // Reset image index to show the first image of the new variant
        setSelectedImageIndex(0);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !product) {
      console.error('Cannot add to cart: Missing variant or product');
      toast.warning('Please select a product variant first', 3000);
      return;
    }

    if (!selectedVariant.availableForSale) {
      console.warn('Cannot add to cart: Variant not available for sale');
      toast.error('This variant is currently out of stock', 4000);
      return;
    }

    if (!selectedVariant.id) {
      console.error('Cannot add to cart: Variant missing ID');
      toast.error('Invalid product variant. Please refresh the page.', 4000);
      return;
    }

    // Check if this is a ring product and if size is required
    const hasSizeOption = product.options?.some(
      opt => opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'ring size'
    );

    if (hasSizeOption) {
      const sizeSelected = selectedOptions['Size'] || selectedOptions['Ring Size'] || customization.size;

      if (!sizeSelected) {
        toast.warning('Please select a ring size before adding to cart', 4000);
        return;
      }
    }

    setIsAddingToCart(true);

    try {
      // Create attributes for custom options
      const attributes: { key: string; value: string }[] = [];

      // Get ring size from either selectedOptions or customization
      const ringSize = selectedOptions['Size'] || selectedOptions['Ring Size'] || customization.size;

      if (ringSize) {
        attributes.push({ key: 'Ringmaat', value: ringSize });
      }

      if (customization.engraving) {
        attributes.push({ key: 'Gravering', value: customization.engraving });
      }

      if (customization.goldType) {
        attributes.push({ key: 'Goud Type', value: customization.goldType });
      }
      if (customization.diamondType) {
        attributes.push({ key: 'Diamant Type', value: customization.diamondType });
      }

      // Try to add to cart
      try {
        await addToCart(selectedVariant.id, 1, attributes.length > 0 ? attributes : undefined);

        toast.success('Product added to cart!', 3000);

        // Track cart add for analytics
        await trackProductCartAdd(product.id, selectedVariant.id);

        // Cart drawer automatically opens via CartContext setIsOpen(true)

      } catch (cartError: any) {
        console.error('❌ Failed to add to cart:', cartError);
        console.error('Cart error type:', cartError?.constructor?.name);
        console.error('Cart error message:', cartError?.message);

        // Show user-friendly error via toast
        toast.error(
          cartError?.message || 'Unable to add item to cart. Please try again.',
          5000
        );

        setIsAddingToCart(false);
        return;
      }
    } catch (error: any) {
      console.error('❌ Error adding to cart:', error);
      toast.error(
        'An unexpected error occurred. Please refresh the page and try again.',
        5000
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: handle || '' });
    } else {
      wishlistDispatch({
        type: 'ADD_ITEM',
        payload: {
          id: handle || '',
          name: product.name,
          price: selectedVariant?.price || product.price,
          image: selectedVariant?.image || product.image,
          category: product.category,
        },
      });
    }
  };

  const currentPrice = selectedVariant?.price || product.price;
  const currentComparePrice = selectedVariant?.compareAtPrice;

  const productTabs = [
    { id: 'details', label: 'Product Details', icon: Gem }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Show fallback notice if using offline data */}
      {usingFallback && (
        <div className="bg-blue-50 border-b border-blue-200 p-2 sm:p-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center">
              <WifiOff className="h-5 w-5 text-blue-600 mr-3" />
              <p className="text-xs sm:typography-caption text-blue-800">
                Viewing offline product data. Live Shopify sync will restore automatically.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28">
        <Breadcrumbs
          items={[
            { label: 'Shop', path: '/shop', icon: ShoppingBag },
            { label: product.category || 'Products', path: `/shop?category=${encodeURIComponent(product.category || 'all')}` },
            { label: product.name || 'Product' },
          ]}
          onNavigate={onNavigate}
        />
      </div>

      {/* Trust Signals Banner */}
      <AnimatePresence>
      </AnimatePresence>

      {/* Product Detail - with bottom padding for sticky bar */}
      <div className="pb-24 sm:pb-28">
        <section className="py-12 sm:py-20 lg:py-32 xl:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Product Images with Gallery */}
            <ProductImageGallery
              images={filteredImages.length > 0 ? filteredImages : [product.image || '']}
              productName={product.name}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />

            {/* Product Info */}
            <div className="space-y-8 sm:space-y-10">
              {/* Certificate Logos - Moved to top */}
              {product.features?.some(feature => feature.includes('HRD') || feature.includes('GIA') || feature.includes('IGI') || feature.includes('Gecertificeerd')) && (
                <div className="flex items-center justify-center gap-6 py-4 bg-[#f8f6f3] rounded-lg">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mx-auto shadow-sm">
                      <img
                        src="https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2024.svg?updatedAt=1757411304217"
                        alt="HRD Certificate"
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mx-auto shadow-sm">
                      <img
                        src="https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2025.svg?updatedAt=1757411304418"
                        alt="GIA Certificate"
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mx-auto shadow-sm">
                      <img
                        src="https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2026.svg?updatedAt=1757411303262"
                        alt="IGI Certificate"
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                  <span className="bg-Color-Light-300 text-Color-Netural-White px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full">
                    {product.category}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2c2827] mb-3 sm:mb-4 leading-tight">{product.name}</h1>
                
                {/* Price with urgency */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <motion.p
                      key={`price-${currentPrice}`}
                      initial={{ opacity: 0.5, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold text-Color-Light-300"
                    >
                      €{formatPrice(currentPrice)}
                    </motion.p>
                    {currentComparePrice && (
                      <div className="flex flex-col">
                        <p className="text-lg sm:text-xl lg:text-2xl text-Color-Champagne-Gold line-through">€{formatPrice(currentComparePrice)}</p>
                        <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                          Save €{formatPrice(currentComparePrice - (currentPrice || 0))}
                        </span>
                      </div>
                    )}
                  </div>
                  {selectedVariant && !selectedVariant.availableForSale && (
                    <div className="flex items-center mt-2 text-red-600 bg-red-50 p-2 sm:p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Deze variant is uitverkocht</span>
                    </div>
                  )}
                </div>
                
                {/* Quick Benefits */}
                <p className="text-sm sm:text-base lg:text-lg text-[#837f7a] leading-relaxed mb-4 sm:mb-6">{product.description}</p>
              </div>

              {/* Product Options */}
              {product.options.length > 0 && (
                <div className="bg-[#f8f6f3] p-4 sm:p-6 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-[#2c2827] mb-3 sm:mb-4 flex items-center">
                    <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-Color-Light-300 mr-2" />
                    Product Options
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {product.options.map((option) => {
                      const isColorOption = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour';

                      return (
                        <div key={option.id}>
                          <label className="block text-xs sm:text-sm font-semibold text-[#2c2827] mb-1">
                            {option.name}
                          </label>
                          {selectedOptions[option.name] && (
                            <p className="text-sm text-Color-Light-300 font-medium mb-3">
                              Selected: {selectedOptions[option.name]}
                            </p>
                          )}

                          {option.name.toLowerCase() === 'size' || option.name.toLowerCase() === 'ring size' ? (
                            // Ring size selector with grid layout
                            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                              {option.values.map((value) => {
                                const isSelected = selectedOptions[option.name] === value || customization.size === value;
                                return (
                                  <button
                                    key={value}
                                    onClick={() => handleOptionChange(option.name, value)}
                                    className={`p-2 sm:p-3 border-2 transition-all duration-200 text-xs sm:text-sm rounded-lg font-medium relative ${
                                      isSelected
                                        ? 'border-Color-Light-300 bg-Color-Light-300 text-Color-Netural-White shadow-lg scale-105 ring-2 ring-Color-Light-300 ring-offset-2'
                                        : 'border-Color-Light-300/30 hover:border-Color-Light-300 text-Color-Dark-500 bg-white hover:bg-Color-Light-300/5'
                                    }`}
                                    aria-label={`Select ring size ${value}`}
                                  >
                                    <span className={`absolute top-0 right-0 -mt-1 -mr-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                      ✓
                                    </span>
                                    {value}
                                  </button>
                                );
                              })}
                            </div>
                          ) : isColorOption ? (
                            // Color swatches for gold colors - Large card design
                            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                              {option.values.map((value) => {
                                const colorValue = value.toLowerCase();
                                let bgColor = '';

                                // Map color names to exact colors matching reference image
                                if (colorValue.includes('white') || colorValue.includes('whte')) {
                                  bgColor = '#C0C0C0'; // Silver/White Gold
                                } else if (colorValue.includes('yellow')) {
                                  bgColor = '#D4AF37'; // Yellow Gold
                                } else if (colorValue.includes('rose')) {
                                  bgColor = '#D8A7A2'; // Rose Gold
                                } else {
                                  bgColor = '#E5E5E5';
                                }

                                const isSelected = selectedOptions[option.name] === value;
                                const displayName = colorValue.includes('rose') ? 'Rose Gold' :
                                                   colorValue.includes('yellow') ? 'Yellow Gold' :
                                                   'White Gold';

                                return (
                                  <button
                                    key={value}
                                    onClick={() => handleOptionChange(option.name, value)}
                                    className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl transition-all duration-200 ${
                                      isSelected
                                        ? 'bg-white border-2 border-[#764e3e] shadow-lg scale-105'
                                        : 'bg-white border-2 border-gray-200 hover:border-[#764e3e] hover:shadow-md'
                                    }`}
                                  >
                                    <div
                                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-3 shadow-sm"
                                      style={{ backgroundColor: bgColor }}
                                    />
                                    <span className={`text-sm sm:text-base font-semibold text-center ${
                                      isSelected ? 'text-[#764e3e]' : 'text-[#2c2827]'
                                    }`}>
                                      {displayName}
                                    </span>
                                    {/* Product count - you can make this dynamic */}
                                    <span className="text-xs text-gray-500 mt-1">(4)</span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            // Regular buttons for non-color options
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                              {option.values.map((value) => {
                                const isSelected = selectedOptions[option.name] === value;
                                return (
                                  <button
                                    key={value}
                                    onClick={() => handleOptionChange(option.name, value)}
                                    className={`p-2 sm:p-3 border-2 transition-all duration-200 text-xs sm:text-sm rounded-lg font-medium ${
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

              {/* Customization */}
              {product.isCustomizable && (
                <div className="bg-[#f8f6f3] p-4 sm:p-6 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-[#2c2827] mb-3 sm:mb-4 flex items-center">
                    <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-Color-Light-300 mr-2" />
                    Personalisatie Opties
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#2c2827] mb-2">Goud Type</label>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {['yellow', 'white', 'rose'].map((type) => (
                          <span
                            key={type}
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border-2 transition-all duration-200 cursor-pointer ${
                              customization.goldType === type
                                ? 'bg-Color-Light-300 text-Color-Netural-White border-Color-Light-300 shadow-md'
                                : 'bg-white text-Color-Dark-500 border-Color-Light-300/50 hover:border-Color-Light-300 hover:bg-Color-Light-300/10'
                            }`}
                            onClick={() => setCustomization({ ...customization, goldType: type })}
                          >
                            <span className="w-2 h-2 rounded-full mr-2" style={{
                              backgroundColor: type === 'yellow' ? '#FFD700' : type === 'white' ? '#E5E5E5' : '#E8B4B8'
                            }}></span>
                            {type === 'yellow' ? 'Geel' : type === 'white' ? 'Wit' : 'Rosé'} Goud
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#2c2827] mb-2">Diamant Type</label>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {['white', 'pink'].map((type) => (
                          <span
                            key={type}
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border-2 transition-all duration-200 cursor-pointer ${
                              customization.diamondType === type
                                ? 'bg-Color-Light-300 text-Color-Netural-White border-Color-Light-300 shadow-md'
                                : 'bg-white text-Color-Dark-500 border-Color-Light-300/50 hover:border-Color-Light-300 hover:bg-Color-Light-300/10'
                            }`}
                            onClick={() => setCustomization({ ...customization, diamondType: type })}
                          >
                            <span className="w-2 h-2 rounded-full mr-2" style={{
                              backgroundColor: type === 'white' ? '#FFFFFF' : '#FFB6C1'
                            }}></span>
                            {type === 'white' ? 'Wit' : 'Roze'}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-[#2c2827] mb-2">Ringmaat</label>
                        <input
                          type="text"
                          value={customization.size}
                          onChange={(e) => setCustomization({ ...customization, size: e.target.value })}
                          placeholder="Bijv. 54, 56..."
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-Color-Light-300/50 focus:ring-2 focus:ring-Color-Light-300 focus:border-transparent rounded-lg text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-[#2c2827] mb-2">Gravering</label>
                        <input
                          type="text"
                          value={customization.engraving}
                          onChange={(e) => setCustomization({ ...customization, engraving: e.target.value })}
                          placeholder="Bijv. initialen..."
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-Color-Light-300/50 focus:ring-2 focus:ring-Color-Light-300 focus:border-transparent rounded-lg text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="bg-gradient-to-r from-Color-Light-300 to-Color-Light-300/80 p-6 rounded-xl shadow-xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-4 rounded-lg transition-all duration-200 flex items-center justify-center ${
                      isInWishlist
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`h-6 w-6 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || cartLoading || !selectedVariant?.availableForSale}
                    className={`flex-1 px-8 py-4 bg-white text-Color-Light-300 font-bold rounded-lg transition-all duration-300 flex items-center justify-center text-lg ${
                      isAddingToCart || cartLoading || !selectedVariant?.availableForSale
                        ? 'opacity-75 cursor-not-allowed'
                        : 'hover:shadow-2xl hover:scale-105'
                    }`}
                  >
                    {isAddingToCart || cartLoading ? (
                      <>
                        <div className="animate-spin h-6 w-6 border-b-2 border-Color-Light-300 mr-3"></div>
                        <span>Toevoegen aan winkelwagen...</span>
                      </>
                    ) : !selectedVariant?.availableForSale ? (
                      <>
                        <AlertCircle className="mr-3 h-6 w-6" />
                        <span>Niet beschikbaar</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="mr-3 h-6 w-6" />
                        <span>Toevoegen aan winkelwagen</span>
                      </>
                    )}
                  </button>
                </div>

                {selectedVariant && selectedVariant.availableForSale && (
                  <div className="mt-4 text-center">
                    <p className="text-white/90 text-sm flex items-center justify-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Veilig betalen via Shopify • Gratis verzending • 14 dagen retour
                    </p>
                  </div>
                )}
              </div>

              {/* Product Features */}
              {product.features && product.features.length > 0 && (
                <div className="bg-[#f8f6f3] p-4 sm:p-6 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-[#2c2827] mb-3 sm:mb-4">Kenmerken</h3>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-[#837f7a] text-sm sm:text-base">
                        <Sparkles className="h-3 sm:h-4 w-3 sm:w-4 text-Color-Light-300 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Enhanced Product Information Tabs */}
              <div className="bg-white border border-Color-Light-300 rounded-lg overflow-hidden">
                {/* Tab Headers */}
                <div className="flex border-b border-Color-Light-300 overflow-x-auto">
                  {productTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'border-b-2 border-Color-Light-300 text-Color-Light-300 bg-Color-Light-300/5'
                          : 'text-Color-Champagne-Gold hover:text-Color-Netural-Black'
                      }`}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === 'details' && (
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-[#2c2827] mb-4">Product Specifications</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              {product.productType && (
                                <div className="flex justify-between">
                                  <span className="text-Color-Netural-Black">Type:</span>
                                  <span className="font-medium">{product.productType}</span>
                                </div>
                              )}
                              {product.metafields?.ringDesign && (
                                <div className="flex justify-between">
                                  <span className="text-Color-Netural-Black">Design:</span>
                                  <span className="font-medium capitalize">{product.metafields.ringDesign}</span>
                                </div>
                              )}
                              {product.metafields?.jewelryMaterial && !product.metafields.jewelryMaterial.includes('gid://') && (
                                <div className="flex justify-between">
                                  <span className="text-Color-Netural-Black">Material:</span>
                                  <span className="font-medium capitalize">
                                    {product.metafields.jewelryMaterial.includes(';')
                                      ? product.metafields.jewelryMaterial.split(';').join(', ')
                                      : product.metafields.jewelryMaterial}
                                  </span>
                                </div>
                              )}
                              {!product.metafields?.jewelryMaterial && (
                                <div className="flex justify-between">
                                  <span className="text-Color-Netural-Black">Material:</span>
                                  <span className="font-medium">18K Gold</span>
                                </div>
                              )}
                              {product.metafields?.colorPattern && !product.metafields.colorPattern.includes('gid://') && (
                                <div className="flex justify-between">
                                  <span className="text-Color-Netural-Black">Colors:</span>
                                  <span className="font-medium capitalize">
                                    {product.metafields.colorPattern.includes(';')
                                      ? product.metafields.colorPattern.split(';').join(', ')
                                      : product.metafields.colorPattern}
                                  </span>
                                </div>
                              )}
                              {!product.metafields?.colorPattern && (
                                <div className="flex justify-between">
                                  <span className="text-Color-Netural-Black">Colors:</span>
                                  <span className="font-medium">White Gold, Yellow Gold, Rose Gold</span>
                                </div>
                              )}
                              {product.metafields?.jewelryType && !product.metafields.jewelryType.includes('gid://') && (
                                <div className="flex justify-between">
                                  <span className="text-Color-Netural-Black">Category:</span>
                                  <span className="font-medium capitalize">{product.metafields.jewelryType.replace('-', ' ')}</span>
                                </div>
                              )}
                              {!product.metafields?.jewelryType && (
                                <div className="flex justify-between">
                                  <span className="text-Color-Netural-Black">Category:</span>
                                  <span className="font-medium">{product.category}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-3">
                              {product.metafields?.ringSize && !product.metafields.ringSize.includes('gid://') && (
                                <div className="flex justify-between">
                                  <span className="text-Color-Netural-Black">Available Sizes:</span>
                                  <span className="font-medium">
                                    {product.metafields.ringSize.includes(';')
                                      ? product.metafields.ringSize.split(';').slice(0, 3).join(', ') + '...'
                                      : product.metafields.ringSize}
                                  </span>
                                </div>
                              )}
                              {!product.metafields?.ringSize && (
                                <div className="flex justify-between">
                                  <span className="text-Color-Netural-Black">Available Sizes:</span>
                                  <span className="font-medium">48, 50, 52, 54...</span>
                                </div>
                              )}
                              {product.metafields?.targetGender && !product.metafields.targetGender.includes('gid://') && (
                                <div className="flex justify-between">
                                  <span className="text-Color-Netural-Black">For:</span>
                                  <span className="font-medium capitalize">{product.metafields.targetGender}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-Color-Netural-Black">Certificate:</span>
                                <span className="font-medium">HRD/GIA/IGI</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-Color-Netural-Black">Origin:</span>
                                <span className="font-medium">Antwerp, Belgium</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-Color-Netural-Black">Delivery:</span>
                                <span className="font-medium">{product.deliveryTime || '10-14 days'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}


                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>


              {/* Expert Consultation CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-r from-Color-Light-300 to-Color-Light-300/80 text-Color-Netural-White p-6 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">Need Expert Advice?</h4>
                    <p className="text-sm text-Color-Netural-White/90">Speak with Caroline about customization</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(`tel:${contactInfo.phone}`)}
                      className="p-3 bg-Color-Netural-White/20 hover:bg-Color-Netural-White/30 rounded-lg transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onNavigate('/contact')}
                      className="p-3 bg-Color-Netural-White/20 hover:bg-Color-Netural-White/30 rounded-lg transition-colors"
                    >
                      <Calendar className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>


              {/* Materials */}
              {product.materials && product.materials.length > 0 && (
                <div className="bg-[#f8f6f3] p-4 sm:p-6 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-[#2c2827] mb-3 sm:mb-4">Materialen</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.materials.map((material, index) => (
                      <span key={index} className="bg-Color-Light-300 text-Color-Netural-White px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant Information */}
              {selectedVariant && (
                <div className="bg-[#f8f6f3] p-4 sm:p-6 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-[#2c2827] mb-3 sm:mb-4">Geselecteerde Variant</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-[#837f7a]">Variant:</span>
                      <span className="text-xs sm:text-sm font-medium text-[#2c2827] break-words">{selectedVariant.title}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-[#837f7a]">Prijs:</span>
                      <motion.span
                        key={`variant-price-${selectedVariant.price}`}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm sm:text-base font-bold text-Color-Light-300"
                      >
                        €{formatPrice(selectedVariant.price)}
                      </motion.span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-[#837f7a]">Beschikbaarheid:</span>
                      <span className={`text-xs sm:text-sm font-medium flex items-center ${selectedVariant.availableForSale ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedVariant.availableForSale ? (
                          <><Check className="h-3 sm:h-4 w-3 sm:w-4 inline mr-1" />Op voorraad</>
                        ) : (
                          <><AlertCircle className="h-3 sm:h-4 w-3 sm:w-4 inline mr-1" />Uitverkocht</>
                        )}
                      </span>
                    </div>
                    {selectedVariant.quantityAvailable && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-xs sm:text-sm text-[#837f7a]">Voorraad:</span>
                        <span className="text-xs sm:text-sm font-medium text-[#2c2827]">{selectedVariant.quantityAvailable} stuks</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
        </section>
      </div>

      {/* Sticky Add to Cart Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm shadow-2xl border-t border-Color-Light-300 safe-area-bottom"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Product Summary */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={currentImage || product.image || 'https://ik.imagekit.io/qcvroy8xpd/PngItem_479625%201.png?updatedAt=1756832129082'}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-[#2c2827] truncate">{product.name}</h3>
                <motion.p
                  key={`mobile-price-${currentPrice}`}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="text-lg font-bold text-Color-Light-300"
                >
                  €{formatPrice(currentPrice)}
                </motion.p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlistToggle}
                className={`p-3 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isInWishlist
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-Color-Netural-White text-Color-Netural-Black hover:bg-Color-Secondary'
                }`}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </motion.button>

              {/* Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={isAddingToCart || cartLoading || !selectedVariant?.availableForSale}
                className={`px-6 py-3 bg-gradient-to-r from-Color-Light-300 to-Color-Light-300/80 hover:from-Color-Light-300/80 hover:to-Color-Light-300 text-Color-Netural-White font-semibold rounded-lg transition-all duration-300 flex items-center justify-center min-w-[140px] ${
                  isAddingToCart || cartLoading || !selectedVariant?.availableForSale ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                {isAddingToCart || cartLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-Color-Netural-White mr-2"></div>
                    <span className="hidden sm:inline">Toevoegen...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : !selectedVariant?.availableForSale ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Uitverkocht</span>
                    <span className="sm:hidden">Uit</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Toevoegen</span>
                    <span className="sm:hidden">Add</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Removed demo checkout modal - real Shopify cart flow only */}
      {false && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-Color-Light-300 to-Color-Light-300/80 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="h-8 w-8 mr-3" />
                  <h2 className="text-2xl font-bold">Checkout Preview</h2>
                </div>
                <button
                  onClick={() => setShowDemoCheckout(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Order Summary */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-Color-Light-300" />
                  Order Summary
                </h3>
                <div className="flex gap-4">
                  <img
                    src={currentImage || product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-Color-Dark-500">{product.name}</h4>
                    <p className="text-sm text-Color-Rich-Gray mt-1">
                      {selectedVariant?.title}
                    </p>
                    {customization.size && (
                      <p className="text-sm text-Color-Rich-Gray">Ringmaat: {customization.size}</p>
                    )}
                    {customization.engraving && (
                      <p className="text-sm text-Color-Rich-Gray">Gravering: {customization.engraving}</p>
                    )}
                    <motion.p
                      key={`cart-preview-price-${currentPrice}`}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="text-xl font-bold text-Color-Light-300 mt-2"
                    >
                      €{formatPrice(currentPrice)}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Checkout Steps Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Next Steps:</h3>

                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Cart Review</h4>
                    <p className="text-sm text-green-700">Review your items and quantities</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Checkout</h4>
                    <p className="text-sm text-blue-700">Redirected to Shopify's payment page</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Order Tracking</h4>
                    <p className="text-sm text-purple-700">Your order is saved and tracked in "My Orders"</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800">Payment Complete</h4>
                    <p className="text-sm text-orange-700">Order confirmed and synced automatically</p>
                  </div>
                </div>
              </div>

              {/* Trust Signals */}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDemoCheckout(false)}
                  className="flex-1 px-6 py-3 border-2 border-Color-Light-300 text-Color-Light-300 font-semibold rounded-lg hover:bg-Color-Light-300/5 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    setShowDemoCheckout(false);
                    alert('In production, this would redirect to Shopify checkout!\n\nOrder would be:\n• Created in database\n• Tracked for you\n• Synced after payment\n• Visible in "My Orders"');
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-Color-Light-300 to-Color-Light-300/80 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};