'use client';

import React from 'react';
import {
  Phone, Mail, MapPin, Instagram, Facebook,
  Award, Shield, Heart, Star, ChevronUp, ArrowUpRight, Diamond
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/TranslationContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#FAF9F6] text-Color-Dark-500 pt-24 pb-12 overflow-hidden border-t border-Color-Champagne-Gold/10">
      {/* --- BACKGROUND LUXURY ELEMENTS --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Giant Background Watermark */}
      <div className="absolute bottom-[-5%] left-[-5%] text-[20vw] font-serif text-Color-Champagne-Gold/5 whitespace-nowrap select-none pointer-events-none uppercase italic">
        Antwerp Heritage
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* --- TOP ROW: BRANDING & ASCENSION --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 pb-20 border-b border-Color-Champagne-Gold/10">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => onNavigate('/')}
          >
            <img src="/logo.svg" alt="Diamonds by CS" className="h-20 w-auto" />
          </motion.div>

          <div className="flex items-center gap-12">
            <div className="hidden lg:block text-right">
              <span className="block text-[10px] uppercase tracking-[0.4em] text-Color-Light-300 font-bold mb-1">Established</span>
              <span className="text-sm font-serif italic text-Color-Dark-500">MCMXCVIII — Antwerp</span>
            </div>
            <motion.button 
              onClick={scrollToTop}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-full border border-Color-Champagne-Gold/30 flex items-center justify-center group-hover:bg-Color-Dark-500 group-hover:text-white transition-all duration-500">
                <ChevronUp className="w-5 h-5" />
              </div>
              <span className="text-[9px] uppercase tracking-widest mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Top</span>
            </motion.button>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="py-24 grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Column 1: The Manifesto Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <div className="bg-white/40 backdrop-blur-xl p-10 lg:p-14 border border-white/60 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-Color-Champagne-Gold transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top" />
              
              <Diamond className="w-8 h-8 text-Color-Champagne-Gold mb-8 opacity-50" />
              <h3 className="text-3xl font-serif text-Color-Dark-500 mb-6 leading-tight">
                Crafting Legacies <br /> 
                <span className="italic font-light">in the Heart of Antwerp.</span>
              </h3>
              <p className="text-Color-Gray-600 font-light leading-loose mb-10 text-lg">
                Every stone is selected with precision, and every setting is forged with passion. We don't just sell jewelry; we preserve moments for generations.
              </p>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-Color-Dark-500 text-white px-4 py-2 rounded-sm">
                  <Award className="w-3 h-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Heritage Certified</span>
                </div>
                <div className="flex items-center gap-2 border border-Color-Dark-500 px-4 py-2 rounded-sm">
                  <Shield className="w-3 h-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Dark-500">100% Conflict Free</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Navigation (Editorial Style) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-12">
            {[
              { title: 'The Atelier', links: ['Our Story', 'Process', 'Reviews', 'Contact'] },
              { title: 'Collections', links: ['Engagement', 'Signature', 'Bespoke', 'Care'] }
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-black mb-10">
                  {section.title}
                </h4>
                <ul className="space-y-6">
                  {section.links.map(link => (
                    <li key={link}>
                      <button 
                        onClick={() => onNavigate('#')}
                        className="group flex items-center gap-3 text-sm font-medium text-Color-Dark-500 hover:text-Color-Champagne-Gold transition-colors"
                      >
                        <span className="w-0 h-[1px] bg-Color-Champagne-Gold group-hover:w-4 transition-all duration-500" />
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Column 3: The Trust Row */}
          <div className="lg:col-span-3 space-y-12">
             <div className="space-y-4">
               <h4 className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-black">Visit the District</h4>
               <p className="text-sm font-medium leading-relaxed">
                 Schupstraat 9-11,<br />
                 2018 Antwerpen, Belgium
               </p>
               <a href="tel:+32471762298" className="inline-flex items-center gap-2 text-Color-Champagne-Gold font-bold group">
                 +32 471 76 22 98
                 <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </a>
             </div>

             <div className="p-8 bg-Color-Secondary/20 border border-Color-Champagne-Gold/10">
                <div className="flex gap-1 text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <p className="text-2xl font-serif text-Color-Dark-500 mb-2">5.0 / 5.0</p>
                <p className="text-[10px] uppercase tracking-widest text-Color-Gray-500 font-bold mb-4">136 Verified Google Reviews</p>
                <div className="h-[1px] w-full bg-Color-Champagne-Gold/20 mb-4" />
                <div className="flex justify-between items-center grayscale opacity-50">
                  <img src="https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2024.svg" className="h-6" alt="HRD" />
                  <img src="https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2025.svg" className="h-6" alt="GIA" />
                </div>
             </div>
          </div>
        </div>

        {/* --- BOTTOM BAR: PHILANTHROPY & LEGAL --- */}
        <div className="pt-12 border-t border-Color-Champagne-Gold/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-Color-Champagne-Gold/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-Color-Champagne-Gold fill-Color-Champagne-Gold" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-Color-Dark-500">Giving Back</p>
              <p className="text-[11px] text-Color-Gray-500 font-medium">10% of revenue supports National Park Rescue</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex gap-6">
              <Instagram className="w-4 h-4 hover:text-Color-Champagne-Gold cursor-pointer transition-colors" />
              <Facebook className="w-4 h-4 hover:text-Color-Champagne-Gold cursor-pointer transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">
              © 2025 • Diamonds by CS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};