import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Play, Camera, Heart, Star, Crown, Sparkles, 
  Award, Gem, Diamond, Users, ArrowRight 
} from 'lucide-react';
import { collectiesContent } from '../../config/collectiesConfig';

interface CollectionContentProps {
  activeCollection: string;
  onNavigate: (page: string) => void;
}

export const CollectionContent: React.FC<CollectionContentProps> = ({
  activeCollection,
  onNavigate
}) => {
  const collection = collectiesContent.collections[activeCollection];
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth parallax and scaling for the "Exhibition" feel
  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]));
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);

  // Dynamic Theme Mapping
  const theme = useMemo(() => {
    const themes: Record<string, { bg: string; accent: string; icon: any; text: string }> = {
      'heartbeat': { bg: 'from-[#FFF5F5] to-[#FFFFFF]', accent: '#E53E3E', icon: Heart, text: 'NATURE' },
      'ann-demeulemeester': { bg: 'from-[#F8F8F8] to-[#FFFFFF]', accent: '#1A1A1A', icon: Sparkles, text: 'AVANT-GARDE' },
      'carey': { bg: 'from-[#FFF0F6] to-[#FFFFFF]', accent: '#D53F8C', icon: Users, text: 'SISTERHOOD' },
      'think-pink': { bg: 'from-[#FFF5F7] to-[#FFFFFF]', accent: '#D53F8C', icon: Heart, text: 'HOPE' },
      'kim-van-oncen': { bg: 'from-[#F0F5FF] to-[#FFFFFF]', accent: '#3182CE', icon: Star, text: 'GLAMOUR' },
    };
    return themes[activeCollection] || { bg: 'from-white to-gray-50', accent: '#C9A86A', icon: Diamond, text: 'COLLECTION' };
  }, [activeCollection]);

  if (!collection) return null;

  return (
    <section 
      ref={containerRef}
      className={`relative py-32 lg:py-48 bg-gradient-to-br ${theme.bg} overflow-hidden`}
    >
      {/* --- BACKGROUND STORYTELLING --- */}
      <div className="absolute top-10 left-0 w-full overflow-hidden pointer-events-none select-none">
        <motion.span 
          style={{ x: yParallax }}
          className="text-[12rem] lg:text-[20rem] font-serif text-black/[0.03] whitespace-nowrap block"
        >
          {theme.text} {theme.text} {theme.text}
        </motion.span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- EXHIBITION HEADER --- */}
        <div className="flex flex-col items-center text-center mb-32">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="mb-12 relative"
          >
            <div className="w-24 h-24 border border-Color-Champagne-Gold/30 rotate-45 absolute -inset-2 animate-pulse" />
            <div className="w-20 h-20 bg-white shadow-2xl flex items-center justify-center relative z-10">
              <theme.icon className="w-10 h-10" style={{ color: theme.accent }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] uppercase tracking-[0.8em] text-Color-Champagne-Gold font-black mb-6 block">
              Exclusive Showcase
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-Color-Dark-500 leading-none mb-8">
              {collection.title.split(' ')[0]} <br />
              <span className="italic font-light text-Color-Champagne-Gold">
                {collection.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-xl text-Color-Gray-600 font-light max-w-2xl mx-auto leading-relaxed italic">
              {collection.subtitle}
            </p>
          </motion.div>
        </div>

        {/* --- DYNAMIC CONTENT BLOCKS --- */}
        <div className="space-y-40 lg:space-y-64">
          {collection.sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-32 items-center`}
            >
              {/* IMAGE COLUMN WITH PARALLAX SCALE */}
              <div className="w-full lg:w-3/5 relative">
                <motion.div 
                  style={{ scale: imageScale }}
                  className="relative aspect-[4/5] lg:aspect-video overflow-hidden shadow-2xl rounded-sm"
                >
                  <img 
                    src={collection.images?.[idx] || "https://diamondsbycs.com/images/uploads/upload-6556a2eac8217.JPG"} 
                    className="w-full h-full object-cover"
                    alt={section.title || "Collection Visual"}
                  />
                  <div className="absolute inset-0 bg-Color-Dark-500/5 hover:bg-transparent transition-colors duration-700" />
                </motion.div>
                
                {/* Floating Accent Detail */}
                <motion.div 
                  style={{ y: yParallax }}
                  className="absolute -bottom-10 -right-10 w-40 h-40 bg-white p-6 shadow-xl hidden lg:flex flex-col justify-center"
                >
                  <Gem className="w-6 h-6 text-Color-Champagne-Gold mb-2" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Handcrafted Heritage</span>
                </motion.div>
              </div>

              {/* TEXT COLUMN WITH GLASS PANELS */}
              <div className="w-full lg:w-2/5">
                <div className="relative p-8 lg:p-0">
                  <h3 className="text-4xl font-serif text-Color-Dark-500 mb-8 leading-tight">
                    {section.title}
                  </h3>
                  <div className="space-y-6">
                    {section.content.map((p, pi) => (
                      <p key={pi} className="text-lg text-Color-Gray-600 font-light leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                  
                  {section.centerText && (
                    <div className="mt-12 p-8 bg-white/50 backdrop-blur-md border-l-4 border-Color-Champagne-Gold italic text-Color-Dark-500 font-medium">
                      "{section.centerText}"
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- THE CINEMATIC "MAKING OF" --- */}
        <motion.div 
          className="mt-64 relative bg-Color-Dark-500 aspect-video lg:aspect-[21/9] overflow-hidden group shadow-2xl"
        >
          <img 
            src="https://diamondsbycs.com/images/uploads/upload-656f1771ce3c7.jpg" 
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-24 h-24 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm mb-8 group-hover:bg-white group-hover:text-Color-Dark-500 transition-all"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </motion.button>
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-4">Behind the Craft</span>
            <h4 className="text-4xl font-serif">A Film of Artistry</h4>
          </div>
        </motion.div>

        {/* --- CALL TO ACTION --- */}
        <footer className="mt-48 text-center border-t border-Color-Champagne-Gold/20 pt-24">
          <h2 className="text-4xl md:text-6xl font-serif text-Color-Dark-500 mb-12">
            Experience the <span className="italic text-Color-Champagne-Gold">{collection.title}</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <button 
              onClick={() => onNavigate('/shop')}
              className="px-12 py-5 bg-Color-Dark-500 text-white uppercase text-xs tracking-[0.4em] font-bold hover:bg-Color-Champagne-Gold transition-colors duration-500"
            >
              View All Pieces
            </button>
            <button 
              onClick={() => onNavigate('/contact')}
              className="px-12 py-5 border border-Color-Dark-500 text-Color-Dark-500 uppercase text-xs tracking-[0.4em] font-bold hover:bg-Color-Dark-500 hover:text-white transition-all duration-500"
            >
              Request Access
            </button>
          </div>
        </footer>

      </div>
    </section>
  );
};