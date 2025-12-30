'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Palette, Heart, Users, Star, Crown, Sparkles, Camera, Scissors, Shirt, Gem, ArrowRight } from 'lucide-react';

interface StylingAdviceSectionProps {
  onNavigate: (page: string) => void;
}

export const StylingAdviceSection: React.FC<StylingAdviceSectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth parallax for images
  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]));
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]));

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  return (
    <section 
      ref={containerRef} 
      className="relative py-24 sm:py-40 bg-[#FAF9F6] overflow-hidden"
    >
      {/* Subtle Grain Overlay for Luxury Feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- SECTION HEADER --- */}
        <header className="mb-24 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start"
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-Color-Light-300 font-bold mb-6 flex items-center">
              <span className="w-12 h-[1px] bg-Color-Light-300 mr-4" />
              Signature Experience
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-Color-Dark-500 leading-[1.1] mb-8">
              Styling Advies <br />
              <span className="italic font-light ml-0 md:ml-24 text-Color-Light-300">
                Bruid & Bruidegom
              </span>
            </h2>
          </motion.div>
        </header>

        {/* --- MAIN CONTENT ASYMMETRIC GRID --- */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-4 items-start">
          
          {/* LEFT COLUMN: The Expert Text */}
          <div className="lg:col-span-5 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="relative">
                <p className="text-xl md:text-2xl text-Color-Gray-700 leading-relaxed font-light italic">
                  "Caroline is dé expert op het gebied van styling, met 12 jaar ervaring als vaste styliste bij Maasmechelen Village."
                </p>
                <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-Color-Light-300 to-transparent opacity-30" />
              </div>

              <p className="text-Color-Gray-600 leading-loose text-lg font-light">
                Haar expertise helpt u bij het maken van de juiste keuzes op het gebied van kleding, 
                make-up en haar. Wij creëren een visuele harmonie die verder gaat dan mode; 
                het is een weerspiegeling van uw essentie.
              </p>

              {/* Service List with Minimalist Lines */}
              <div className="pt-8 space-y-4">
                {[
                  { icon: Shirt, label: 'Clothing Consultation' },
                  { icon: Sparkles, label: 'Color & Style Analysis' },
                  { icon: Camera, label: 'Style Photography' },
                  { icon: Scissors, label: 'Hair & Makeup Direction' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: 10 }}
                    className="flex items-center group cursor-pointer border-b border-Color-Light-300/10 pb-4"
                  >
                    <item.icon className="w-5 h-5 text-Color-Light-300 mr-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm uppercase tracking-widest text-Color-Dark-500 group-hover:text-Color-Light-300 transition-colors">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: The Visual Collage */}
          <div className="lg:col-span-7 relative pt-20 lg:pt-0">
            {/* Main Feature Image */}
            <motion.div 
              style={{ y: y1 }}
              className="relative aspect-[4/5] overflow-hidden shadow-2xl z-20 w-4/5 ml-auto"
            >
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5 }}
                src="https://diamondsbycs.com/images/uploads/upload-6557810d1692c.jpeg" 
                className="w-full h-full object-cover"
                alt="Expert Styling"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-Color-Dark-500/10" />
            </motion.div>

            {/* Floating Decorative Elements */}
            <motion.div 
              style={{ y: y2 }}
              className="absolute -left-4 top-1/3 w-1/2 aspect-square bg-Color-Secondary p-4 shadow-xl z-30"
            >
              <div className="w-full h-full border border-Color-Light-300/30 p-8 flex flex-col justify-end">
                <span className="text-6xl font-serif text-Color-Light-300 block mb-2">12</span>
                <span className="text-xs uppercase tracking-tighter text-Color-Dark-500 font-bold">Years of Excellence</span>
              </div>
            </motion.div>

            {/* Secondary Image with Mask Reveal */}
            <motion.div 
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -bottom-20 right-0 w-2/3 aspect-video shadow-2xl z-40 overflow-hidden"
            >
              <img 
                src="https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                alt="Wedding Party"
              />
            </motion.div>
          </div>
        </div>

        {/* --- STATS / SOCIAL PROOF SECTION --- */}
        <div className="mt-48 lg:mt-64 grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: 'Happy Brides', value: '200+' },
             { label: 'Group Styling', value: '500+' },
             { label: 'Style Portfolio', value: '1k+' },
             { label: 'Design Awards', value: '04' }
           ].map((stat, i) => (
             <div key={i} className="text-center border-l border-Color-Light-300/20 px-4">
                <span className="block text-3xl font-serif text-Color-Dark-500 mb-2">{stat.value}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-Color-Gray-500 font-bold">{stat.label}</span>
             </div>
           ))}
        </div>

        {/* --- CTA: THE INVITATION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 bg-Color-Dark-500 text-Color-Netural-White p-12 lg:p-24 relative overflow-hidden text-center group"
        >
          {/* Animated Background Aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(205,188,171,0.1)_0%,transparent_70%)] group-hover:scale-110 transition-transform duration-1000" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <Crown className="w-12 h-12 text-Color-Light-300 mx-auto mb-8 opacity-50" />
            <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
              Ready for Your <br /> Perfect Wedding Style?
            </h3>
            <p className="text-Color-Light-300/80 mb-12 text-lg font-light tracking-wide">
              Book a private consultation to discuss your complete vision, from heritage jewelry to bridal party coordination.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <button 
                onClick={() => onNavigate('/contact')}
                className="relative overflow-hidden px-10 py-5 bg-Color-Light-300 text-Color-Dark-500 font-bold uppercase text-xs tracking-widest hover:text-Color-Netural-White transition-colors duration-500 group/btn"
              >
                <span className="relative z-10">Book Consultation</span>
                <div className="absolute inset-0 bg-Color-Dark-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
              </button>
              
              <button 
                onClick={() => onNavigate('/shop')}
                className="text-Color-Light-300 uppercase text-xs tracking-[0.3em] font-bold flex items-center group/link"
              >
                Explore Collection
                <ArrowRight className="ml-4 w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};