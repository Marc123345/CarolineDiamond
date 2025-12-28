import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

interface CarolineSectionProps {
  onNavigate: (page: string) => void;
}

export const CarolineSection: React.FC<CarolineSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth, high-end motion values
  const yShift = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]));
  const rotateSeal = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section 
      ref={containerRef}
      className="relative py-32 md:py-56 bg-[#FAF9F6] overflow-hidden"
    >
      {/* --- BACKGROUND WATERMARK --- */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <motion.span 
          style={{ x: yShift }}
          className="text-[20vw] font-serif italic text-black/[0.02] whitespace-nowrap absolute top-1/2 -translate-y-1/2 left-0"
        >
          Caroline Schreiber Caroline Schreiber
        </motion.span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT: THE STORYTELLER (Text) */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[10px] uppercase tracking-[0.6em] text-Color-Light-300 font-black mb-8 block">
                The Visionary Artisan
              </span>
              
              <h2 className="text-6xl md:text-8xl font-serif text-Color-Dark-500 leading-[0.85] mb-12">
                Over <br />
                <span className="italic text-Color-Light-300 ml-0 md:ml-20">Caroline</span>
              </h2>

              <div className="space-y-8 max-w-lg">
                <p className="text-xl md:text-2xl text-Color-Gray-700 font-light leading-relaxed italic">
                  "{t('Discover the passion, expertise, and artistry behind every piece of jewelry.')}"
                </p>
                
                <p className="text-lg text-Color-Gray-500 font-light leading-loose">
                  {t('Caroline\'s journey spans over 15 years in Antwerp\'s prestigious diamond district, creating personalized treasures that tell your unique story.')}
                </p>

                {/* Legacy Counter */}
                <div className="pt-10 flex items-center gap-12 border-t border-black/5">
                  <div className="flex flex-col">
                    <span className="text-4xl font-serif text-Color-Dark-500">15+</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Light-300">Years Excellence</span>
                  </div>
                  <div className="w-px h-12 bg-black/5" />
                  <div className="flex flex-col">
                    <span className="text-4xl font-serif text-Color-Dark-500">1k+</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Light-300">Handcrafted Tales</span>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ gap: '2rem' }}
                  onClick={() => onNavigate('/about')}
                  className="pt-12 flex items-center gap-6 text-sm uppercase tracking-[0.4em] font-black group"
                >
                  Full Heritage
                  <div className="w-12 h-[1px] bg-Color-Dark-500 group-hover:w-24 transition-all duration-500" />
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: THE ATELIER (Visual Collage) */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative aspect-[4/5] w-full">
              
              {/* Main Portrait with Shutter Reveal */}
              <motion.div 
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                className="absolute right-0 top-0 w-4/5 h-full overflow-hidden shadow-2xl z-10"
              >
                <motion.img 
                  style={{ scale: useTransform(scrollYProgress, [0, 1], [1.2, 1]) }}
                  src="https://diamondsbycs.com/images/uploads/upload-666be9d315beb.jpg" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  alt="Caroline Schreiber"
                />
              </motion.div>

              {/* Offset Lifestyle Image */}
              <motion.div 
                style={{ y: yShift }}
                className="absolute -left-10 bottom-10 w-3/5 aspect-square bg-white p-4 shadow-2xl z-20"
              >
                <div className="w-full h-full overflow-hidden relative">
                  <img 
                    src="https://diamondsbycs.com/images/uploads/upload-68b545cea1ff1.jpeg" 
                    className="w-full h-full object-cover"
                    alt="Atwerp Atelier"
                  />
                  <div className="absolute inset-0 bg-Color-Dark-500/10" />
                </div>
              </motion.div>

              {/* Rotating Heritage Seal */}
              <motion.div 
                style={{ rotate: rotateSeal }}
                className="absolute -top-12 -left-12 w-32 h-32 z-30 hidden md:block"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                  <text className="text-[8px] uppercase tracking-[2px] font-bold fill-Color-Light-300">
                    <textPath xlinkHref="#circlePath">
                      • Authentic Antwerp Craftsmanship • Established Heritage •
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="w-6 h-6 text-Color-Champagne-Gold" />
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};