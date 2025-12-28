import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShoppingBag, Heart, Sparkles, Shield, Truck, 
  WifiOff, AlertCircle, Check, Award, Phone, Calendar, Gem, 
  Package, RefreshCw, X, ChevronRight 
} from 'lucide-react';

// Sub-components & Hooks
import { useShopifyProduct } from '../hooks/useShopifyProducts';
import { ensureRingSizeOption, findVariantByOptions } from '../utils/shopifyHelpers';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { contactInfo } from '../config/siteConfig';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { VariantSelector } from '../components/VariantSelector';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const ProductDetailPage: React.FC = () => {
  const { id: handle } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, loading: cartLoading } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const toast = useToast();

  // Core Data Fetching
  const { product: rawProduct, loading, error, usingFallback } = useShopifyProduct(handle || '');
  const product = useMemo(() => rawProduct ? ensureRingSizeOption(rawProduct) : null, [rawProduct]);

  // UI State
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('specifications');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isInWishlist = wishlistState.items.some((item) => item.id === handle);

  // Initialize Selections
  useEffect(() => {
    if (!product?.variants?.length) return;
    const initialVariant = product.variants.find(v => v.availableForSale) || product.variants[0];
    setSelectedVariant(initialVariant);
    setSelectedOptions(initialVariant.selectedOptions || {});
  }, [product]);

  // Sync Variant on Option Change
  useEffect(() => {
    if (!product || !Object.keys(selectedOptions).length) return;
    const variant = findVariantByOptions(product, selectedOptions);
    if (variant && variant.id !== selectedVariant?.id) setSelectedVariant(variant);
  }, [selectedOptions, product]);

  const isNaturalDiamond = useMemo(() => {
    const type = selectedVariant?.selectedOptions?.['Diamond Type'] || '';
    return type.includes('Natural');
  }, [selectedVariant]);

  if (loading) return <LoadingState />;
  if (error || !product) return <ErrorState onBack={() => navigate('/shop')} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#FCFAFB]">
      
      {/* --- STATUS NOTIFICATION --- */}
      <AnimatePresence>
        {usingFallback && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="bg-blue-50/80 backdrop-blur-md border-b border-blue-100 py-3 text-center">
             <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-800 flex items-center justify-center gap-3">
               <WifiOff className="w-3 h-3" /> Digital Continuity Active • Local Cache
             </p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-24">
        {/* Navigation Context */}
        <div className="mb-12">
          <Breadcrumbs
            items={[
              { label: 'Collections', path: '/shop', icon: ShoppingBag },
              { label: product.category || 'Jewelry' },
              { label: product.name }
            ]}
            onNavigate={navigate}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          {/* --- LEFT: VISUAL STORYTELLING --- */}
          <div className="space-y-8 sticky top-32">
            <ProductImageGallery
              images={product.images || []}
              productName={product.name}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />
            
            {/* Certificate Ledger */}
            <div className="grid grid-cols-3 gap-4">
              {['IGI', 'GIA', 'HRD'].map((cert) => (
                <div key={cert} className="bg-white p-4 flex flex-col items-center justify-center border border-black/[0.03] group hover:border-Color-Champagne-Gold transition-all duration-700">
                  <span className="text-[10px] font-black text-Color-Light-300 group-hover:text-Color-Dark-500">{cert}</span>
                  <span className="text-[8px] uppercase tracking-tighter opacity-40 mt-1">Certified</span>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: THE ATELIER CONFIGURATOR --- */}
          <div className="space-y-12">
            
            {/* Product Identity */}
            <header className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-black">
                  {product.category || 'Handcrafted Excellence'}
                </span>
                <div className="h-px flex-1 bg-black/[0.05]" />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif text-Color-Dark-500 leading-tight">
                {product.name}
              </h1>
              
              {/* Dynamic Price Reveal */}
              <div className="flex items-baseline gap-6 pt-4">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={selectedVariant?.id}
                    initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                    className="text-4xl font-serif italic text-Color-Dark-500"
                  >
                    €{selectedVariant?.price?.toLocaleString() || product.price?.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
                {selectedVariant?.compareAtPrice && (
                  <span className="text-xl text-Color-Light-300 line-through opacity-40">
                    €{selectedVariant.compareAtPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </header>

            {/* Narrative Description */}
            <p className="text-lg text-Color-Gray-500 font-light leading-relaxed max-w-xl">
              {product.description}
            </p>

            {/* Selection Vault */}
            <div className="bg-white border border-black/[0.03] p-8 space-y-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-4 h-4 text-Color-Champagne-Gold" />
                <h3 className="text-xs uppercase tracking-[0.3em] font-black text-Color-Dark-500">Curate Specifications</h3>
              </div>
              
              <VariantSelector
                product={product}
                selectedOptions={selectedOptions}
                onOptionsChange={setSelectedOptions}
              />

              {/* Trust Micro-Ledger */}
              <div className="pt-8 border-t border-black/[0.03] grid grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-Color-Primary-Beige/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-Color-Champagne-Gold" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-500">Antwerp Insured Delivery</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-Color-Primary-Beige/20 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-Color-Champagne-Gold" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-500">14-Day Private Return</span>
                </div>
              </div>
            </div>

            {/* Specifications & Heritage Tabs */}
            <div className="space-y-6">
               <nav className="flex gap-10 border-b border-black/[0.05]">
                 {['specifications', 'craftsmanship'].map(t => (
                   <button 
                    key={t} onClick={() => setActiveTab(t)}
                    className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-black transition-all relative ${activeTab === t ? 'text-Color-Dark-500' : 'text-Color-Light-300'}`}
                   >
                     {t}
                     {activeTab === t && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-px bg-Color-Champagne-Gold" />}
                   </button>
                 ))}
               </nav>
               
               <div className="min-h-[200px]">
                 {activeTab === 'specifications' ? (
                   <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                     {Object.entries(selectedVariant?.selectedOptions || {}).map(([k, v]) => (
                       <div key={k} className="flex flex-col gap-1">
                         <span className="text-[9px] uppercase tracking-widest font-bold text-Color-Gray-400">{k}</span>
                         <span className="text-sm font-medium text-Color-Dark-500">{v}</span>
                       </div>
                     ))}
                     <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-Color-Gray-400">Metal Finish</span>
                        <span className="text-sm font-medium text-Color-Dark-500">18K Solid Gold</span>
                     </div>
                   </div>
                 ) : (
                   <p className="text-sm text-Color-Gray-500 leading-loose italic">
                     Every Diamond by CS piece is individually forged in the heart of Antwerp’s diamond district, combining 15 years of legacy expertise with conflict-free, hand-selected stones.
                   </p>
                 )}
               </div>
            </div>

            {/* Expert Advice CTA */}
            <div className="bg-Color-Dark-500 p-8 flex items-center justify-between group overflow-hidden relative">
              <Gem className="absolute -right-4 -top-4 w-24 h-24 text-white/[0.03] rotate-12" />
              <div className="relative z-10">
                <h4 className="text-white text-lg font-serif italic mb-1">Seek Personal Guidance?</h4>
                <p className="text-Color-Light-300/60 text-xs tracking-widest font-light">Consult with our master artisans.</p>
              </div>
              <button 
                onClick={() => onNavigate('/contact')}
                className="relative z-10 w-12 h-12 rounded-full bg-Color-Champagne-Gold flex items-center justify-center hover:bg-white transition-colors duration-500"
              >
                <ArrowRight className="w-5 h-5 text-Color-Dark-500" />
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* --- FLOATING COMMAND PILL (Add to Cart) --- */}
      <motion.div 
        initial={{ y: 100 }} animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[95vw] max-w-4xl"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-full p-2 flex items-center justify-between gap-4">
          
          {/* Summary Preview */}
          <div className="hidden sm:flex items-center gap-4 pl-6">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-black/5">
              <img src={product.image} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-black text-Color-Dark-500 truncate max-w-[120px]">{product.name}</p>
              <p className="text-[11px] font-serif italic text-Color-Champagne-Gold">€{selectedVariant?.price?.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex-1 sm:flex-none flex items-center gap-2 pr-2">
            <button 
              onClick={() => wishlistDispatch({ type: isInWishlist ? 'REMOVE_ITEM' : 'ADD_ITEM', payload: product })}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isInWishlist ? 'bg-red-500 text-white' : 'bg-black/5 text-Color-Dark-500 hover:bg-black/10'}`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>

            {isNaturalDiamond ? (
              <button 
                onClick={() => navigate('/contact')}
                className="flex-1 sm:flex-none px-10 h-14 bg-Color-Dark-500 text-white rounded-full uppercase text-[10px] tracking-[0.4em] font-black hover:bg-black transition-all flex items-center justify-center gap-4"
              >
                Inquire Price <Phone className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button 
                onClick={handleAddToCart}
                disabled={cartLoading || isAddingToCart || !selectedVariant?.availableForSale}
                className="flex-1 sm:flex-none px-10 h-14 bg-Color-Dark-500 text-white rounded-full uppercase text-[10px] tracking-[0.4em] font-black hover:bg-black transition-all flex items-center justify-center gap-4 group"
              >
                {isAddingToCart ? 'Preserving...' : 'Add to Collection'}
                <ShoppingBag className="w-4 h-4 text-Color-Champagne-Gold group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

// --- HELPER STATES ---
const LoadingState = () => (
  <div className="h-screen flex flex-col items-center justify-center space-y-6">
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
      <Sparkles className="w-10 h-10 text-Color-Champagne-Gold" />
    </motion.div>
    <span className="text-[10px] uppercase tracking-[0.5em] font-black text-Color-Light-300">Unveiling Masterpiece</span>
  </div>
);

const ErrorState = ({ onBack }: { onBack: () => void }) => (
  <div className="h-screen flex flex-col items-center justify-center text-center px-6">
    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8">
       <X className="w-8 h-8 text-red-500" />
    </div>
    <h2 className="text-3xl font-serif text-Color-Dark-500 mb-4">Piece Unattainable</h2>
    <p className="text-Color-Gray-500 max-w-sm mx-auto mb-10 leading-relaxed">We could not retrieve this specific curation. It may have been retired or moved to our private vault.</p>
    <button onClick={onBack} className="px-10 py-4 bg-Color-Dark-500 text-white uppercase text-[10px] tracking-widest font-black">Return to Collections</button>
  </div>
);