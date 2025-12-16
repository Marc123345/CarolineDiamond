import React, { useState } from 'react';
import { X, MessageCircle, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NecklaceVariant } from '../config/necklaceVariantsConfig';
import { useTranslate } from '../hooks/useTranslate';

interface PriceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: NecklaceVariant | null;
}

export const PriceRequestModal: React.FC<PriceRequestModalProps> = ({
  isOpen,
  onClose,
  variant
}) => {
  const t = useTranslate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!variant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const variantDetails = `${variant.metalColor} - ${variant.diamondType} - ${variant.caratWeight}`;
    const whatsappMessage = encodeURIComponent(
      `Hi! I'm interested in the Timeless Diamond Necklace:\n\n` +
      `Configuration: ${variantDetails}\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Message: ${message || 'Please provide pricing information.'}`
    );

    window.open(`https://wa.me/32471762298?text=${whatsappMessage}`, '_blank');
    setSubmitted(true);

    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 2000);
  };

  const handleDirectContact = (method: 'whatsapp' | 'email' | 'phone') => {
    const variantDetails = `${variant.metalColor} - ${variant.diamondType} - ${variant.caratWeight}`;

    switch (method) {
      case 'whatsapp':
        const whatsappMsg = encodeURIComponent(
          `Hi! I'm interested in the Timeless Diamond Necklace (${variantDetails}). Could you provide pricing information?`
        );
        window.open(`https://wa.me/32471762298?text=${whatsappMsg}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:info@diamondsbycs.com?subject=Price Request - Timeless Diamond Necklace&body=I'm interested in the Timeless Diamond Necklace: ${variantDetails}`;
        break;
      case 'phone':
        window.location.href = 'tel:+32471762298';
        break;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {!submitted ? (
              <>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {t('Request Price Quote')}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('Natural Diamond Pricing')}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                {/* Selected Variant Info */}
                <div className="p-6 bg-gradient-to-r from-[#CDBCAB]/10 to-[#CDBCAB]/5 border-b border-[#CDBCAB]/20">
                  <p className="text-xs text-gray-500 mb-2">{t('Selected Configuration')}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {t('Metal')}: {variant.metalColor}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {t('Diamond Type')}: {variant.diamondType}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {t('Carat Weight')}: {variant.caratWeight}
                    </p>
                  </div>
                </div>

                {/* Quick Contact Options */}
                <div className="p-6 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    {t('Quick Contact')}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleDirectContact('whatsapp')}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-[#CDBCAB] hover:bg-[#CDBCAB]/5 transition-all"
                    >
                      <MessageCircle className="w-6 h-6 text-[#25D366]" />
                      <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleDirectContact('email')}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-[#CDBCAB] hover:bg-[#CDBCAB]/5 transition-all"
                    >
                      <Mail className="w-6 h-6 text-[#CDBCAB]" />
                      <span className="text-xs font-medium text-gray-700">Email</span>
                    </button>
                    <button
                      onClick={() => handleDirectContact('phone')}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-[#CDBCAB] hover:bg-[#CDBCAB]/5 transition-all"
                    >
                      <Phone className="w-6 h-6 text-[#CDBCAB]" />
                      <span className="text-xs font-medium text-gray-700">Call</span>
                    </button>
                  </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    {t('Or fill out the form below and we\'ll contact you shortly')}
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Name')} *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CDBCAB] focus:border-transparent"
                      placeholder={t('Your name')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Email')} *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CDBCAB] focus:border-transparent"
                      placeholder={t('your@email.com')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Phone')}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CDBCAB] focus:border-transparent"
                      placeholder="+32 471 76 22 98"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Message')}
                    </label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CDBCAB] focus:border-transparent resize-none"
                      placeholder={t('Any additional information...')}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#CDBCAB] to-[#B9A892] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {t('Send Request via WhatsApp')}
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    {t('We typically respond within 24 hours')}
                  </p>
                </form>
              </>
            ) : (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <MessageCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('Request Sent!')}
                </h3>
                <p className="text-gray-600">
                  {t('Opening WhatsApp...')}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
