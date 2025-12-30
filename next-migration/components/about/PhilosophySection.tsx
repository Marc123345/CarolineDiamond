import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, ArrowUpRight } from 'lucide-react';
import { aboutContent } from '../../config/aboutConfig';

export const PhilosophySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  // Spring-smoothed parallax for background elements
  const bgShift = useSpring(useTransform(scrollYProgress, [0, 1], [0, -120]));

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-56 bg-white overflow-hidden"
    >
      {/* --- PREMIUM TEXTURE & BG ELEMENTS --- */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <motion.div style={{ y: bgShift }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[40vw] h-[40vw] bg-Color-Secondary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30vw] h-[30vw] bg-Color-Light-300/10 rounded-full blur-[100px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER: DRAMATIC SCALE --- */}
        <header ref={headerRef} className="mb-32 lg:mb-48">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.8em] text-Color-Light-300 font-black mb-6 block">
                Our Core Values
              </span>
              <h2 className="text-6xl md:text-8xl font-serif text-Color-Dark-500 leading-[0.9]">
                Crafting <br />
                <span className="italic text-Color-Light-300 ml-0 md:ml-20">Perfection</span>
              </h2>
            </div>
            <p className="text-xl text-Color-Gray-600 font-light leading-relaxed max-w-sm">
              Beyond the brilliance of the stone lies a philosophy of ethics, heritage, and the pursuit of the sublime.
            </p>
          </motion.div>
        </header>

        {/* --- PHILOSOPHY: THE ART GALLERY VIEW --- */}
        <div className="space-y-40 md:space-y-64">
          {aboutContent.philosophy.map((item: any, index: number) => (
            <div 
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-32`}
            >
              {/* Large Image Reveal */}
              <motion.div 
                initial={{ clipPath: 'inset(10% 10% 10% 10%)', opacity: 0 }}
                whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full md:w-1/2 aspect-[4/5] overflow-hidden shadow-2xl relative group"
              >
                <motion.img
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 2 }}
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-Color-Dark-500/10 group-hover:bg-transparent transition-colors duration-700" />
              </motion.div>

              {/* Content Column */}
              <div className="w-full md:w-1/2 relative">
                <span className="absolute -top-20 -left-10 text-[12rem] font-serif text-Color-Secondary/30 select-none -z-10">
                  0{index + 1}
                </span>
                
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <h3 className="text-4xl md:text-5xl font-serif text-Color-Dark-500 mb-8 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-lg text-Color-Gray-700 font-light leading-loose mb-10">
                    {item.description}
                  </p>

                  {item.features && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {item.features.map((f: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-Color-Secondary/10 border border-Color-Light-300/10 rounded-lg">
                          <Star className="w-3 h-3 text-Color-Light-300 fill-Color-Light-300" />
                          <span className="text-xs uppercase tracking-widest text-Color-Dark-500 font-bold">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* --- SHOWCASE: OVERLAPPING COLLAGE --- */}
        <div className="mt-64 relative h-[600px] md:h-[800px] hidden md:block">
           <motion.div 
             whileInView={{ y: -50, opacity: 1 }}
             initial={{ y: 0, opacity: 0 }}
             className="absolute top-0 left-0 w-1/3 aspect-[3/4] z-20 shadow-2xl overflow-hidden"
           >
              <img src="https://diamondsbycs.com/images/uploads/upload-655239166023c.JPG" className="w-full h-full object-cover" />
           </motion.div>

           <motion.div 
             whileInView={{ y: 50, opacity: 1 }}
             initial={{ y: 0, opacity: 0 }}
             transition={{ delay: 0.2 }}
             className="absolute top-1/4 left-1/4 w-1/2 aspect-video z-10 shadow-2xl border-[15px] border-white overflow-hidden"
           >
              <img src="https://diamondsbycs.com/images/uploads/upload-65523dbbebb62.JPG" className="w-full h-full object-cover" />
           </motion.div>

           <motion.div 
             whileInView={{ x: -30, opacity: 1 }}
             initial={{ x: 0, opacity: 0 }}
             transition={{ delay: 0.4 }}
             className="absolute bottom-0 right-0 w-1/3 aspect-square z-30 shadow-2xl overflow-hidden"
           >
              <img src="https://diamondsbycs.com/images/uploads/upload-65523dcc422c0.JPG" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
           </motion.div>

           <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md p-12 text-center border border-Color-Light-300/30">
                <p className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-bold mb-4">Discovery</p>
                <h4 className="text-3xl font-serif text-Color-Dark-500">The Essence of Elegance</h4>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
};