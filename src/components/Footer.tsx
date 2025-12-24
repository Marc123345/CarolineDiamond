import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Award, Shield, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/TranslationContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  return (
    <footer className="bg-Color-Primary-Beige text-Color-Dark-500 relative overflow-hidden">
      {/* Subtle moving background */}
      <motion.div
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 25% 25%, rgba(205,188,171,0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(205,188,171,0.06) 0%, transparent 50%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Logo at top */}
        <div className="pt-10 sm:pt-12 md:pt-16 pb-8 sm:pb-10 md:pb-12 border-b border-Color-Champagne-Gold/30">
          <button
            onClick={() => onNavigate('/')}
            aria-label="Go to home"
            className="flex-shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-Color-Light-300"
          >
            <img
              src="/logo.svg"
              alt="Diamonds by CS Logo"
              className="h-14 sm:h-16 md:h-20 w-auto transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
            />
          </button>
        </div>

        <div className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16">

            {/* Brand + Story */}
            <div className="lg:col-span-4 space-y-6 sm:space-y-8 md:space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/60 p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-Color-Champagne-Gold/30 backdrop-blur-sm shadow-md"
              >
                <h3 className="text-base sm:text-lg md:typography-h5 font-bold mb-3 sm:mb-4 flex items-center text-Color-Dark-500">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-Color-Champagne-Gold rounded-full mr-2 sm:mr-3">
                    <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white fill-current" />
                  </span>
                  {t('Handcrafted in Antwerp')}
                </h3>
                <p className="text-sm sm:typography-body text-Color-Rich-Gray leading-relaxed">
                  {t('Every piece of jewelry is lovingly handcrafted in the heart of Antwerp\'s diamond district, blending traditional techniques with modern artistry.')}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                  {[
                    { icon: Award, text: t('15+ Years Experience') },
                    { icon: Shield, text: t('HRD Certified') },
                    { icon: Star, text: t('5.0 Google Rating') }
                  ].map((badge, idx) => (
                    <div key={idx} className="flex items-center bg-Color-Champagne-Gold/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-Color-Champagne-Gold/40">
                      <badge.icon className="h-3 w-3 sm:h-4 sm:w-4 text-Color-Champagne-Gold mr-1.5 sm:mr-2" />
                      <span className="text-xs sm:typography-caption text-Color-Dark-500/90">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Social */}
              <div>
                <h4 className="text-sm sm:typography-h6 font-semibold mb-3 sm:mb-4 text-Color-Dark-500">{t('Follow Our Journey')}</h4>
                <div className="flex space-x-3 sm:space-x-4">
                  {[Instagram, Facebook].map((Icon, idx) => (
                    <motion.a
                      key={idx}
                      href="#"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-10 h-10 sm:w-11 sm:h-11 bg-Color-Champagne-Gold rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:bg-Color-Dark-500 transition-colors duration-300"
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              <div>
                <h3 className="text-base sm:typography-h5 font-bold mb-3 sm:mb-4 md:mb-5 text-Color-Dark-500">{t('Shop')}</h3>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    { page: '/shop', label: t('All Jewelry') },
                    { page: '/shop/engagement-rings', label: t('Engagement Rings') },
                    { page: '/shop/wedding-rings', label: t('Wedding Rings') },
                    { page: '/shop/fine-jewelry', label: t('Fine Jewelry') },
                  ].map(link => (
                    <li key={link.page}>
                      <button
                        onClick={() => onNavigate(link.page)}
                        className="typography-body text-Color-Rich-Gray hover:text-Color-Champagne-Gold transition-all"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="typography-h5 font-bold mb-5 text-Color-Dark-500">{t('Company')}</h3>
                <ul className="space-y-3">
                  {[
                    { page: '/about', label: t('Our Story') },
                    { page: '/collecties', label: t('Collections') },
                    { page: '/contact', label: t('Contact Us') },
                  ].map(link => (
                    <li key={link.page}>
                      <button
                        onClick={() => onNavigate(link.page)}
                        className="typography-body text-Color-Rich-Gray hover:text-Color-Champagne-Gold transition-all"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="typography-h5 font-bold mb-5 text-Color-Dark-500">{t('Jewelry')}</h3>
                <ul className="space-y-3">
                  {[
                    { page: '/shop/earrings', label: t('Diamond Earrings') },
                    { page: '/shop/necklaces', label: t('Diamond Necklaces') },
                  ].map(link => (
                    <li key={link.page}>
                      <button
                        onClick={() => onNavigate(link.page)}
                        className="typography-body text-Color-Rich-Gray hover:text-Color-Champagne-Gold transition-all"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="typography-h5 font-bold mb-5 text-Color-Dark-500">{t('Contact')}</h3>

              <div className="space-y-4">
                <a href="tel:+32471762298" className="flex items-start space-x-3 text-Color-Rich-Gray hover:text-Color-Champagne-Gold transition-colors">
                  <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="typography-body">+32 471 76 22 98</span>
                </a>

                <a href="mailto:info@diamondsbycs.com" className="flex items-start space-x-3 text-Color-Rich-Gray hover:text-Color-Champagne-Gold transition-colors">
                  <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="typography-body">info@diamondsbycs.com</span>
                </a>

                <div className="flex items-start space-x-3 text-Color-Rich-Gray">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="typography-body">Schupstraat 9-11</p>
                    <p className="typography-body">2018 Antwerpen</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <p className="typography-body text-Color-Dark-500 font-semibold mb-2">Openingstijden:</p>
                <p className="typography-body text-Color-Rich-Gray">Alle dagen open op afspraak,</p>
                <p className="typography-body text-Color-Rich-Gray">ook op zondag!</p>
              </div>

              {/* Google Reviews Widget */}
              <div className="bg-white/60 p-6 rounded-2xl border border-Color-Champagne-Gold/30 backdrop-blur-sm shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="typography-h5 font-bold text-Color-Dark-500">5.0</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="typography-caption text-Color-Rich-Gray">136 {t('reviews')}</p>
                  </div>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                    alt="Google"
                    className="h-6"
                  />
                </div>
                <a
                  href="https://www.google.com/search?q=diamonds+by+cs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-Color-Champagne-Gold hover:text-Color-Dark-500 typography-body font-semibold transition-colors"
                >
                  Bekijk alle reviews →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Charity Banner */}
        <div className="border-t border-Color-Champagne-Gold/30 py-8">
          <div className="flex items-center justify-center space-x-3 text-Color-Dark-500">
            <Heart className="h-5 w-5 text-Color-Champagne-Gold fill-current" />
            <p className="typography-body font-semibold">
              10% van de omzet gaan naar National Park Rescue
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-Color-Champagne-Gold/30 pt-8 pb-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <p className="typography-body text-Color-Rich-Gray">
                © 2025 Diamonds by CS. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="typography-caption text-Color-Rich-Gray">
                {t('Designed and developed by')}
              </p>
              <span className="typography-caption text-Color-Champagne-Gold font-semibold">
                Popkorn
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
