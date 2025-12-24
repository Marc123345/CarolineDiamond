import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface RingCustomizationModalProps {
  product: any;
  onClose: () => void;
}

export const RingCustomizationModal: React.FC<RingCustomizationModalProps> = ({ 
  product, 
  onClose 
}) => {
  const { addToCart, loading: cartLoading } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [customization, setCustomization] = useState({
    carat: '0.50 carat Dvs2',
    metal: '18k Yellow Gold',
    sideDiamonds: 'None',
    goldType: 'Yellow Gold',
    diamondType: 'White Diamond',
    ringSize: '',
    engraving: ''
  });

  const handleCustomizationChange = (field: string, value: string) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      // Create attributes for custom options
      const attributes: { key: string; value: string }[] = [];
      if (customization.engraving) {
        attributes.push({ key: 'Engraving', value: customization.engraving });
      }
      if (customization.ringSize) {
        attributes.push({ key: 'Ring Size', value: customization.ringSize });
      }
      attributes.push({ key: 'Gold Type', value: customization.goldType });
      attributes.push({ key: 'Diamond Type', value: customization.diamondType });

      // For demo purposes, we'll use the first variant
      const variantId = product.variants[0]?.id || 'demo-variant';
      await addToCart(variantId, 1, attributes);
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-Color-Light-300 max-h-[90vh] overflow-hidden">
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-Color-Netural-Black">
              {product.name}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-Color-Netural-White rounded-lg transition-colors duration-200"
            >
              <X className="h-6 w-6 text-Color-Netural-Black" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Carat */}
            <div>
              <label className="block text-sm font-semibold text-Color-Netural-Black mb-2">
                Carat
              </label>
              <p className="text-Color-Netural-Black font-medium">
                {customization.carat}
              </p>
            </div>

            {/* Metal */}
            <div>
              <label className="block text-sm font-semibold text-Color-Netural-Black mb-2">
                Metal
              </label>
              <p className="text-Color-Netural-Black font-medium">
                {customization.metal}
              </p>
            </div>

            {/* Side Diamonds */}
            <div>
              <label className="block text-sm font-semibold text-Color-Netural-Black mb-2">
                Side Diamonds
              </label>
              <p className="text-Color-Netural-Black font-medium">
                {customization.sideDiamonds}
              </p>
            </div>

            {/* Gold Type */}
            <div>
              <label className="block text-sm font-semibold text-Color-Netural-Black mb-2">
                Gold Type
              </label>
              <select
                value={customization.goldType}
                onChange={(e) => handleCustomizationChange('goldType', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-Color-Light-300 rounded-xl text-Color-Netural-Black focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300"
              >
                <option value="Yellow Gold">Yellow Gold</option>
                <option value="White Gold">White Gold</option>
                <option value="Rose Gold">Rose Gold</option>
              </select>
            </div>

            {/* Diamond Type */}
            <div>
              <label className="block text-sm font-semibold text-Color-Netural-Black mb-2">
                Diamond Type
              </label>
              <select
                value={customization.diamondType}
                onChange={(e) => handleCustomizationChange('diamondType', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-Color-Light-300 rounded-xl text-Color-Netural-Black focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300"
              >
                <option value="White Diamond">White Diamond</option>
                <option value="Pink Diamond">Pink Diamond</option>
              </select>
            </div>

            {/* Ring Size */}
            <div>
              <label className="block text-sm font-semibold text-Color-Netural-Black mb-2">
                Ring Size (Optional)
              </label>
              <input
                type="text"
                value={customization.ringSize}
                onChange={(e) => handleCustomizationChange('ringSize', e.target.value)}
                placeholder="e.g. 7, 52, M"
                className="w-full px-4 py-3 bg-white border border-Color-Light-300 rounded-xl text-Color-Netural-Black focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300"
              />
            </div>

            {/* Engraving */}
            <div>
              <label className="block text-sm font-semibold text-Color-Netural-Black mb-2">
                Engraving (Optional)
              </label>
              <input
                type="text"
                value={customization.engraving}
                onChange={(e) => handleCustomizationChange('engraving', e.target.value)}
                placeholder="Enter your engraving text"
                className="w-full px-4 py-3 bg-white border border-Color-Light-300 rounded-xl text-Color-Netural-Black focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300"
              />
            </div>

            {/* Selected Variant */}
            <div className="bg-gradient-to-r from-Color-Netural-White to-Color-Netural-White p-4 rounded-xl border border-Color-Light-300">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-Color-Netural-Black">
                  Selected variant:
                </span>
                <span className="text-lg font-bold text-Color-Light-300">
                  €{product.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-3 sm:py-4 bg-Color-Secondary text-Color-Netural-Black rounded-xl hover:bg-Color-Secondary transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || cartLoading}
              className={`flex-1 py-3 sm:py-4 bg-Color-Light-300 hover:bg-Color-Light-300/80 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center ${
                isAddingToCart || cartLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isAddingToCart || cartLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    portalRoot
  );
};