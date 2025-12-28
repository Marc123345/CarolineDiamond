import React from 'react';
import { 
  Phone, Mail, MapPin, Instagram, Facebook, 
  Award, Shield, Heart, Star, ChevronUp 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/TranslationContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation Variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <footer className="bg-Color-Primary-Beige text-Color-Dark-500 relative overflow-hidden border-t border-Color-Champagne-Gold/20">
      {/* Subtle Ambient Background */}
      <motion.div
        animate={{ 
          opacity: [0.03, 0.08, 0.03],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle at 10% 10%, rgba(205,188,171,0.15) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(205,188,171,0.1) 0%, transparent 40%)' 
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Top Section: Logo & Back to Top */}
        <div className="pt-12 pb-8 flex justify-between items-end border-b border-Color-Champagne-Gold/20">
          <button
            onClick={() => onNavigate('/')}
            className="group transition-transform duration-500 hover:scale-105"
          >
            <img src="/logo.svg" alt="Logo" className="h-16 md:h-20 w-auto" />
          </button>
          
          <button 
            onClick={scrollToTop}
            className="p-3 rounded-full border border-Color-Champagne-Gold/30 hover:bg-Color-Champagne-Gold hover:text-white transition-all duration-300 group"
            aria-label="Back to top"
          >
            <ChevronUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 grid lg:grid-cols-12 gap-12 lg:gap-16"
        >
          {/* Column 1: Brand Story */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-Color-Champagne-Gold/20 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-white/40 backdrop-blur-md p-8 rounded-2xl border border-white/60 shadow-sm">
                <h3 className="uppercase tracking-[0.2em] text-xs font-bold mb-4 flex items-center text-Color-Dark-500">
                  <Heart className="h-4 w-4 text-Color-Champagne-Gold mr-2 fill-current" />
                  {t('Handcrafted in Antwerp')}
                </h3>
                <p className="text-sm leading-relaxed text-Color-Rich-Gray italic">
                  "{t('Every piece of jewelry is lovingly handcrafted in the heart of Antwerp\'s diamond district, blending traditional techniques with modern artistry.')}"
                </p>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  {[
                    { icon: Award, text: '15+ Years' },
                    { icon: Shield, text: 'HRD Certified' }
                  ].map((badge, i) => (
                    <span key={i} className="flex items-center text-[10px] uppercase tracking-widest bg-Color-Dark-500 text-white px-3 py-1 rounded-full">
                      <badge.icon className="h-3 w-3 mr-1.5" /> {badge.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.3em] font-bold">{t('Follow Us')}</h4>
              <div className="flex space-x-4">
                {[Instagram, Facebook].map((Icon, idx) => (
                  <a key={idx} href="#" className="text-Color-Dark-500 hover:text-Color-Champagne-Gold transition-colors">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants} className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {[
              { title: t('Shop'), links: ['All Jewelry', 'Engagement Rings', 'Wedding Rings'] },
              { title: t('Company'), links: ['Our Story', 'Collections', 'Reviews'] },
              { title: t('Care'), links: ['Returns', 'Privacy', 'Terms'] }
            ].map((section) => (
              <div key={section.title}>
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-6">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map(link => (
                    <li key={link}>
                      <button 
                        onClick={() => onNavigate('#')}
                        className="text-sm text-Color-Rich-Gray hover:text-Color-Dark-500 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-Color-Champagne-Gold after:transition-all hover:after:w-full"
                      >
                        {t(link)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Column 3: Contact & Google Trust */}
          <motion.div variants={itemVariants} className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-6">{t('Visit Us')}</h3>
              <div className="space-y-4 text-sm text-Color-Rich-Gray">
                <a href="tel:+32471762298" className="flex items-center group">
                  <Phone className="h-4 w-4 mr-3 group-hover:text-Color-Champagne-Gold transition-colors" />
                  +32 471 76 22 98
                </a>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 mt-1" />
                  <span>Schupstraat 9-11,<br />2018 Antwerpen</span>
                </div>
              </div>
            </div>

            {/* Google Review Seal */}
            <div className="bg-white/40 border border-white/60 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-serif font-bold">5.0</span>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-tighter text-Color-Rich-Gray mb-2">136 verified google reviews</p>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-Color-Champagne-Gold hover:underline">
                View All Reviews →
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Charity & Legal */}
        <div className="border-t border-Color-Champagne-Gold/10 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3 bg-Color-Champagne-Gold/5 px-6 py-2 rounded-full border border-Color-Champagne-Gold/10">
              <Heart className="h-4 w-4 text-Color-Champagne-Gold fill-current" />
              <p className="text-xs font-medium tracking-wide">
                10% of revenue supports <span className="font-bold">National Park Rescue</span>
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-[10px] uppercase tracking-widest text-Color-Rich-Gray">
                © 2025 Diamonds by CS • Designed by <span className="text-Color-Dark-500 font-bold">Popkorn</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};