import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MessageCircle, Sparkles, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { contactInfo } from '../config/siteConfig';

interface NaturalDiamondPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImage?: string;
  variantTitle?: string;
}

export const NaturalDiamondPriceModal: React.FC<NaturalDiamondPriceModalProps> = ({
  isOpen,
  onClose,
  productName,
  productImage,
  variantTitle,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create WhatsApp message
      const variantInfo = variantTitle ? ` (${variantTitle})` : '';
      const whatsappMessage = encodeURIComponent(
        `Hi! I'm interested in a Natural Diamond price quote:\n\n` +
        `Product: ${productName}${variantInfo}\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone || 'Not provided'}\n\n` +
        `${formData.message || 'Please provide pricing and availability information.'}`
      );

      // Open WhatsApp
      window.open(`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`, '_blank');

      setSubmitted(true);
      toast.success('Request sent! Opening WhatsApp...', 3000);

      // Reset after delay
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.', 5000);
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const variantInfo = variantTitle ? ` (${variantTitle})` : '';
    const message = `Hi, I'm interested in getting a Natural Diamond price quote for: ${productName}${variantInfo}`;
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleCall = () => {
    window.location.href = `tel:${contactInfo.phone}`;
  };

  const handleEmail = () => {
    const variantInfo = variantTitle ? ` (${variantTitle})` : '';
    const subject = `Natural Diamond Price Quote Request: ${productName}`;
    const body = `Hi,\n\nI'm interested in getting a price quote for a Natural Diamond:\n\nProduct: ${productName}${variantInfo}\n\nPlease provide pricing and availability information.\n\nThank you!`;
    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <>
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-Color-Light-300 to-Color-Light-300/80 p-6 text-white z-10 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Sparkles className="h-7 w-7 mr-3" />
                      <div>
                        <h2 className="text-2xl font-bold">Request Natural Diamond Price</h2>
                        <p className="text-sm text-white/90 mt-1">Expert consultation available</p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Product Info */}
                  <div className="bg-[#f8f6f3] p-4 rounded-lg">
                    <div className="flex gap-4">
                      {productImage && (
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-Color-Dark-500 mb-1 break-words">{productName}</h3>
                        {variantTitle && (
                          <p className="text-sm text-Color-Champagne-Gold mb-2">{variantTitle}</p>
                        )}
                        <p className="text-xs text-Color-Rich-Gray leading-relaxed">
                          Natural diamonds are priced based on the 4Cs (Cut, Clarity, Color, Carat) and current market rates.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Contact Options */}
                  <div>
                    <h3 className="text-lg font-semibold text-Color-Dark-500 mb-3">
                      Contact Us Directly
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={handleWhatsApp}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors min-h-[48px]"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-medium">WhatsApp</span>
                      </button>
                      <button
                        onClick={handleCall}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors min-h-[48px]"
                      >
                        <Phone className="h-5 w-5" />
                        <span className="font-medium">Call</span>
                      </button>
                      <button
                        onClick={handleEmail}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-Color-Light-300 hover:bg-Color-Light-300/90 text-white rounded-lg transition-colors min-h-[48px]"
                      >
                        <Mail className="h-5 w-5" />
                        <span className="font-medium">Email</span>
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or submit a request form</span>
                    </div>
                  </div>

                  {/* Request Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-Color-Dark-500 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-Color-Light-300/50 rounded-lg focus:ring-2 focus:ring-Color-Light-300 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-Color-Dark-500 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-Color-Light-300/50 rounded-lg focus:ring-2 focus:ring-Color-Light-300 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-Color-Dark-500 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-Color-Light-300/50 rounded-lg focus:ring-2 focus:ring-Color-Light-300 focus:border-transparent"
                          placeholder="+32 471 76 22 98"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-Color-Dark-500 mb-1">
                        Additional Details
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-Color-Light-300/50 rounded-lg focus:ring-2 focus:ring-Color-Light-300 focus:border-transparent resize-none"
                        placeholder="Any specific requirements or questions..."
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border-2 border-Color-Light-300/50 text-Color-Dark-500 font-semibold rounded-lg hover:bg-Color-Light-300/5 transition-colors min-h-[48px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-Color-Light-300 to-Color-Light-300/80 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
                      >
                        <MessageCircle className="h-5 w-5" />
                        {isSubmitting ? 'Sending...' : 'Send via WhatsApp'}
                      </button>
                    </div>
                  </form>

                  {/* Info Note */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 leading-relaxed">
                      <strong>Why request a quote?</strong> Natural diamond prices vary based on the 4Cs
                      (Cut, Clarity, Color, Carat), current market conditions, and certification. We'll
                      provide you with a personalized quote with complete transparency.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Request Sent!
                </h3>
                <p className="text-gray-600">
                  Opening WhatsApp...
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
