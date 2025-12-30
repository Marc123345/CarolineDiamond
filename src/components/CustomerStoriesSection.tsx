import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote, Heart, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

interface CustomerStoriesSectionProps {
  onNavigate: (page: string) => void;
}

export const CustomerStoriesSection: React.FC<CustomerStoriesSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth editorial parallax
  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]));
  const textShift = useSpring(useTransform(scrollYProgress, [0, 1], [0, 50]));

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const testimonials = [
    {
      name: 'Sarah & Tom',
      text: 'Caroline heeft de perfecte verlovingsring voor ons gemaakt. Het proces was magisch en het eindresultaat overtrof al onze verwachtingen!',
      category: 'Engagement',
      date: 'Dec 2024',
      image: 'https://diamondsbycs.com/images/uploads/upload-68b545a74baf9.jpeg'
    },
    {
      name: 'Emma & David',
      text: 'Van verlovingsring tot trouwringen - Caroline begeleidde ons door het hele proces. De persoonlijke service en kwaliteit zijn ongeëvenaard.',
      category: 'Wedding Set',
      date: 'Dec 2024',
      image: 'https://diamondsbycs.com/images/uploads/upload-68b5458f5a5cf.jpeg'
    }
  ];

  return (
    <section ref={containerRef} className="relative py-32 md:py-56 bg-[#FAF9F6] overflow-hidden">
      {/* --- BACKGROUND EDITORIAL TEXT --- */}
      <div className="absolute top-1/2 left-0 w-full overflow-hidden pointer-events-none select-none opacity-[0.03]">
        <motion.span 
          style={{ x: yParallax }}
          className="text-[25vw] font-serif italic text-black whitespace-nowrap block"
        >
          Shared Memories Shared Memories
        </motion.span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <header ref={ref} className="mb-32 lg:mb-48 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-Color-Light-300 font-black mb-6 block">
              The Voice of Trust
            </span>
            <h2 className="text-6xl md:text-8xl font-serif text-Color-Dark-500 leading-[0.9] mb-12">
              Customer <br />
              <span className="italic text-Color-Light-300 ml-0 md:ml-24">Stories</span>
            </h2>
            <div className="h-px w-24 bg-Color-Champagne-Gold mx-auto md:mx-0" />
          </motion.div>
        </header>

        {/* --- JOURNAL STORIES --- */}
        <div className="space-y-40 md:space-y-64">
          {testimonials.map((story, idx) => (
            <div 
              key={idx}
              className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 lg:gap-32`}
            >
              {/* IMAGE PORTAL */}
              <div className="w-full md:w-1/2 relative">
                <motion.div 
                  style={{ y: idx % 2 === 0 ? yParallax : textShift }}
                  className="relative aspect-[4/5] overflow-hidden shadow-2xl z-20 rounded-sm"
                >
                  <img src={story.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt={story.name} />
                  <div className="absolute inset-0 bg-Color-Dark-500/5 hover:bg-transparent transition-colors duration-700" />
                </motion.div>
                
                {/* Floating Frame Detail */}
                <div className={`absolute ${idx % 2 === 0 ? '-left-8 -bottom-8' : '-right-8 -bottom-8'} w-2/3 h-2/3 border border-Color-Light-300/30 -z-10`} />
              </div>

              {/* CONTENT CARD */}
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full md:w-1/2 space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="flex text-Color-Champagne-Gold">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-black text-Color-Light-300">
                    Verified Journey
                  </span>
                </div>

                <div className="relative">
                  <Quote className="absolute -left-12 -top-4 w-20 h-20 text-Color-Secondary/40 -z-10" />
                  <p className="text-2xl md:text-4xl font-serif text-Color-Dark-500 leading-tight italic">
                    "{story.text}"
                  </p>
                </div>

                <div className="pt-8 border-t border-black/5 flex justify-between items-end">
                  <div>
                    <h4 className="text-sm uppercase tracking-[0.3em] font-black text-Color-Dark-500">{story.name}</h4>
                    <p className="text-[11px] text-Color-Gray-400 mt-1 uppercase tracking-widest">{story.category} • {story.date}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center text-Color-Light-300 opacity-40">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* --- CALL TO ACTION: THE INVITATION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-64 relative bg-Color-Dark-500 p-12 md:p-24 text-center overflow-hidden group shadow-2xl"
        >
          {/* Grain texture for the dark box */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <Quote className="w-12 h-12 text-Color-Champagne-Gold mx-auto mb-8 opacity-50" />
            <h3 className="text-4xl md:text-6xl font-serif text-white mb-8">
              Share Your <span className="italic">Diamonds Story</span>
            </h3>
            <p className="text-Color-Light-300/60 text-lg font-light mb-12 leading-relaxed">
              We horen graag over uw ervaring met Diamonds by CS. Uw verhaal kan anderen inspireren om hun perfecte juweel te vinden.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <button 
                onClick={() => onNavigate('/kind-words')}
                className="group flex items-center gap-6 text-sm uppercase tracking-[0.4em] font-black text-white"
              >
                More Stories
                <div className="w-12 h-[1px] bg-white group-hover:w-20 transition-all duration-500" />
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button 
                onClick={() => onNavigate('/contact')}
                className="px-10 py-5 bg-Color-Champagne-Gold text-Color-Dark-500 uppercase text-[10px] tracking-[0.4em] font-black hover:bg-white transition-colors duration-500"
              >
                Leave a Review
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};