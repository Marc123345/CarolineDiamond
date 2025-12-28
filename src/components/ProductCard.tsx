import React, { useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Sparkles, ChevronRight, X, Ruler, PenTool } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProgressiveImage } from './ProgressiveImage';
import { ProcessedProduct, ProcessedVariant } from '../types/shopify';
import { getInventoryStatus } from '../utils/inventoryHelpers';
import { getPriceDisplay, formatPrice } from '../utils/priceHelpers';

interface ProductCardProps {
  product: ProcessedProduct;
  activeFilters?: any;
}

const METALS = [
  { id: 'white', label: 'White Gold', bg: 'bg-[#E5E4E2]', gradient: 'from-[#D1D1D1] to-[#FFFFFF]' },
  { id: 'yellow', label: 'Yellow Gold', bg: 'bg-[#D3B275]', gradient: 'from-[#B8985E] to-[#D3B275]' },
  { id: 'rose', label: 'Rose Gold', bg: 'bg-[#B76E79]', gradient: 'from-[#9D5D66] to-[#B76E79]' },
];

export const ProductCard: React.FC<ProductCardProps> = ({ product, activeFilters }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, loading: cartLoading } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { success, error: showError } = useToast();

  const [selectedMetal, setSelectedMetal] = useState('white');
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Logic to find variants and images remains optimized
  const findVariant = useCallback((metalId: string) => {
    return product.variants.find(v => {
      const color = (v.selectedOptions['Color'] || v.selectedOptions['Metal'] || '').toLowerCase();
      return color.includes(metalId);
    }) || product.variants[0];
  }, [product.variants]);

  const selectedVariant = useMemo(() => findVariant(selectedMetal), [selectedMetal, findVariant]);
  const priceInfo = getPriceDisplay(product.variants, product.handle);
  const isInWishlist = wishlistState.items.some(item => item.id === product.handle);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-white rounded-sm overflow-hidden transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
    >
      {/* --- IMAGE SECTION --- */}
      <div 
        className="relative aspect-[4/5] overflow-hidden bg-[#F9F9F9] cursor-pointer"
        onClick={() => navigate(`/product/${product.handle}?color=${selectedMetal}`)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMetal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <ProgressiveImage
              src={selectedVariant.image || product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating Action Bar (Glassmorphism) */}
        <motion.div 
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/70 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-white/50 z-20"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setShowQuickAdd(true); }}
            className="p-3 bg-Color-Dark-500 text-white rounded-full hover:bg-Color-Champagne-Gold transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-black/10 mx-1" />
          <button
            onClick={(e) => { e.stopPropagation(); /* wishlist logic */ }}
            className={`p-3 rounded-full transition-colors ${isInWishlist ? 'text-red-500' : 'text-Color-Dark-500 hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        </motion.div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isCustomizable && (
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold bg-white/90 backdrop-blur-sm text-Color-Dark-500 px-3 py-1 border border-black/5">
              Bespoke
            </span>
          )}
        </div>
      </div>

      {/* --- DETAILS SECTION --- */}
      <div className="p-6 flex flex-col flex-1">
        {/* Metal Selector Swatches */}
        <div className="flex gap-2 mb-4">
          {METALS.map((metal) => (
            <button
              key={metal.id}
              onMouseEnter={() => setSelectedMetal(metal.id)}
              className={`w-5 h-5 rounded-full relative transition-transform duration-300 ${selectedMetal === metal.id ? 'scale-125' : 'hover:scale-110'}`}
            >
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${metal.gradient} border border-black/10`} />
              {selectedMetal === metal.id && (
                <motion.div layoutId="swatch-border" className="absolute -inset-1 border border-Color-Champagne-Gold rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Product Meta */}
        <div className="flex items-center gap-3 mb-2 opacity-50">
          <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-500">
            {product.category || 'Jewelry'}
          </span>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-500">
            {selectedVariant.title.split('/')[0]}
          </span>
        </div>

        {/* Name & Price */}
        <h3 className="font-serif text-lg text-Color-Dark-500 mb-4 line-clamp-1 group-hover:text-Color-Champagne-Gold transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tighter text-Color-Dark-500">
              {priceInfo.displayPrice}
            </span>
            <span className="text-[9px] uppercase tracking-tighter text-Color-Gray-400 mt-1">
              incl. 21% VAT
            </span>
          </div>
          <button 
            className="text-[10px] uppercase tracking-[0.2em] font-black text-Color-Champagne-Gold flex items-center gap-1 group/btn"
            onClick={() => navigate(`/product/${product.handle}`)}
          >
            Details 
            <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};