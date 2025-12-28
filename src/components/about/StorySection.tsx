import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Gem, Shield, Diamond, Crown, ArrowRight } from 'lucide-react';
import { aboutContent } from '../../config/aboutConfig';

interface StorySectionProps {
  onNavigate: (page: string) => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]));

  return (
    <section
      ref={containerRef}
      className="relative py-32 sm:py-48 bg-[#FCFAFB] overflow-hidden"
    >
      {/* Editorial Background Text */}
      <div className="absolute top-20 left-10 text-[15rem] font-serif text-Color-Secondary opacity-[0.05] select-none pointer-events-none whitespace-nowrap">
        HERITAGE & CRAFT
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- DYNAMIC HEADER --- */}
        <div ref={ref} className="mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <span className="text-xs uppercase tracking-[0.6em] text-Color-Light-300 font-bold mb-4 block">
              The Artisan Behind the Brand
            </span>
            <h1 className="text-6xl md:text-8xl font-serif text-Color-Dark-500 leading-none">
              Over <span className="italic text-Color-Light-300">Caroline</span>
            </h1>
          </motion.div>
        </div>

        {/* --- MAIN STORY COLLAGE --- */}
        <div className="grid lg:grid-cols-12 gap-0 items-center">
          
          {/* Portrait with Offset Frame */}
          <div className="lg:col-span-5 relative mb-20 lg:mb-0">
            <motion.div 
              style={{ y: yParallax }}
              className="relative z-20"
            >
              <div className="absolute -inset-4 border border-Color-Light-300/30 -z-10 translate-x-8 translate-y-8" />
              <img
                src="https://diamondsbycs.com/images/uploads/upload-655239166023c.JPG"
                alt="Caroline Schreiber"
                className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl"
              />
              <div className="absolute bottom-0 right-0 bg-Color-Dark-500 p-8 text-white translate-x-10 -translate-y-10 hidden md:block">
                <p className="font-serif text-2xl italic">"Crafting legacies, <br/> one diamond at a time."</p>
              </div>
            </motion.div>
          </div>

          {/* Value Blocks - Staggered Slide-in */}
          <div className="lg:col-span-7 lg:pl-24 space-y-16">
            {[
              { icon: Crown, title: 'Heritage & Expertise', text: 'Decades of experience in the Antwerp diamond sector, delivering unparalleled craftsmanship.' },
              { icon: Diamond, title: 'Direct Access', text: 'Partnering directly with Antwerp jewelers to provide up to 50% better value than traditional retail.' },
              { icon: Gem, title: 'Handmade Excellence', text: 'Every piece is fully handcrafted in Antwerp using conflict-free diamonds and premium gold.' }
            ].map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="group flex gap-8 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 border border-Color-Light-300 flex items-center justify-center group-hover:bg-Color-Light-300 transition-colors duration-500">
                  <block.icon className="w-5 h-5 text-Color-Light-300 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-Color-Dark-500 uppercase tracking-widest mb-3">
                    {block.title}
                  </h3>
                  <p className="text-Color-Gray-600 leading-relaxed font-light text-lg">
                    {block.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- SEAL OF AUTHENTICITY (Trust Row) --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-40 p-12 bg-white border-y border-Color-Light-300/20 flex flex-wrap justify-center gap-16 items-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
        >
          <img src="https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2024.svg" className="h-10" alt="HRD Antwerp" />
          <img src="https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2025.svg" className="h-10" alt="GIA" />
          <img src="https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2026.svg" className="h-10" alt="IGI" />
          <div className="h-12 w-[1px] bg-Color-Light-300/30 hidden md:block" />
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-Color-Dark-500">
            Certified Conflict-Free Diamonds
          </p>
        </motion.div>

        {/* --- THE GALLERY (Masonry Feel) --- */}
        <div className="mt-40 grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2 row-span-2 overflow-hidden group">
             <motion.img 
              whileHover={{ scale: 1.05 }}
              src="https://diamondsbycs.com/images/uploads/upload-65523dbbebb62.JPG" 
              className="w-full h-full object-cover" 
             />
          </div>
          <div className="overflow-hidden h-64">
             <img src="https://diamondsbycs.com/images/uploads/upload-65523dcc422c0.JPG" className="w-full h-full object-cover grayscale" />
          </div>
          <div className="overflow-hidden h-64">
             <img src="https://diamondsbycs.com/images/uploads/upload-6557810d1692c.jpeg" className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-2 h-80 overflow-hidden">
             <img src="https://diamondsbycs.com/images/uploads/upload-655239014d729.jpeg" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* --- CALL TO ACTION --- */}
        <motion.div 
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          className="mt-32 text-center"
        >
          <button 
            onClick={() => onNavigate('/contact')}
            className="group relative inline-flex items-center gap-4 text-Color-Dark-500 text-sm uppercase tracking-[0.4em] font-bold"
          >
            Start Your Story with Caroline
            <div className="w-12 h-[1px] bg-Color-Dark-500 group-hover:w-20 transition-all duration-500" />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};