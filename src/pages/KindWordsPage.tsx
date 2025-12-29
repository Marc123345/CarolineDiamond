import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Heart, Gem, Sparkles, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PageHero } from '../components/PageHero';
import { VideoTestimonial } from '../components/VideoTestimonial';

interface KindWordsPageProps {
  onNavigate: (page: string) => void;
}

export const KindWordsPage: React.FC<KindWordsPageProps> = ({ onNavigate }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  // Parallax for editorial depth
  const { scrollYProgress } = useScroll();
  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]));

  const testimonials = [
    {
      id: 'sarah-michael-engagement',
      customerName: 'Sarah & Michael',
      location: 'Antwerpen',
      project: 'Custom Engagement Ring',
      videoSrc: 'https://ik.imagekit.io/qcvroy8xpd/Video_1.mp4',
      videoPoster: 'https://diamondsbycs.com/images/uploads/upload-68b545a74baf9.jpeg',
      duration: '3:45',
      category: 'The Engagement',
      quote: 'Caroline made our dream ring come true. The whole process was magical and the result exceeded all our expectations!'
    },
    {
      id: 'emma-morse-bracelet',
      customerName: 'Emma',
      location: 'Gent',
      project: 'Morse Code Bracelet',
      videoSrc: 'https://ik.imagekit.io/qcvroy8xpd/Video.mp4',
      videoPoster: 'https://diamondsbycs.com/images/uploads/upload-68b5458f5a5cf.jpeg',
      duration: '2:30',
      category: 'Signature Piece',
      quote: 'The morse code bracelet with my daughters name is so meaningful. I wear it every day and think of her.'
    },
    {
      id: 'robert-memorial-ring',
      customerName: 'Robert',
      location: 'Brussel',
      project: 'Memorial Ring',
      videoSrc: 'https://ik.imagekit.io/qcvroy8xpd/Video_2.mp4',
      videoPoster: 'https://diamondsbycs.com/images/uploads/upload-68b545cea1ff1.jpeg',
      duration: '4:15',
      category: 'Heritage Craft',
      quote: 'Caroline understood exactly what I needed during this difficult time. The memorial ring helps me keep my wife close to my heart.'
    }
  ];

  const itemVars = {
    hidden: { y: 40, opacity: 0, filter: 'blur(10px)' },
    show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#FAF9F6] min-h-screen">
      
      {/* --- HERO: THE FIRST IMPRESSION --- */}
      <section className="relative">
        <PageHero 
          title="Kind Words" 
          subtitle="Real stories from our cherished customers" 
          backgroundImage="https://ik.imagekit.io/qcvroy8xpd/envato-labs-ai-8555b3b5-cb34-48c1-a320-9eb1bf8bf453.jpg" 
        />
        <div className="absolute top-0 left-0 right-0 z-20 pt-24 sm:pt-32 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pointer-events-auto">
            <Breadcrumbs items={[{ label: 'The Voice of Trust', icon: Star }]} onNavigate={onNavigate} className="text-white/80" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF9F6] to-transparent" />
      </section>

      {/* --- CONTENT SECTION: STORIES --- */}
      <section className="relative py-24 md:py-48 overflow-hidden">
        {/* Subtle Watermark Parallax */}
        <motion.div style={{ y: yParallax }} className="absolute top-1/4 left-0 text-[18vw] font-serif italic text-black/[0.02] whitespace-nowrap pointer-events-none select-none">
          Shared Memories Shared Memories
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          
          {/* Header Area */}
          <div ref={ref} className="mb-32 max-w-3xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }} 
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="text-[10px] uppercase tracking-[0.6em] text-Color-Light-300 font-black mb-8 block"
            >
              The Antwerp Journal
            </motion.span>
            
            <h2 className="text-6xl md:text-8xl font-serif text-Color-Dark-500 leading-[0.85] mb-12">
              Customer <br />
              <span className="italic text-Color-Champagne-Gold ml-0 md:ml-24">Testimonials.</span>
            </h2>
            
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl text-Color-Gray-600 font-light leading-relaxed italic"
            >
              "Beyond the brilliance of the stone lies the depth of the story. These are the moments we have been honored to preserve in gold."
            </motion.p>
          </div>

          {/* Testimonial Gallery */}
          <motion.div 
            variants={{ show: { transition: { staggerChildren: 0.2 } } }} 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
          >
            {testimonials.map((story) => (
              <motion.div key={story.id} variants={itemVars} className="group">
                <div className="relative overflow-hidden rounded-sm shadow-2xl border border-black/[0.03] transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)]">
                  {/* Shimmer Effect */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-[-20deg] z-20 pointer-events-none"
                  />

                  <VideoTestimonial {...story} featured={true} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FINAL CTA: THE CALL TO ARTISTRY --- */}
      <section className="py-32 md:py-56 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto bg-Color-Dark-500 rounded-sm overflow-hidden relative group shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
        >
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="relative z-10 p-12 md:p-24 text-center space-y-12">
            <div className="flex flex-col items-center">
               <Gem className="w-10 h-10 text-Color-Champagne-Gold mb-8 opacity-50" />
               <h2 className="text-4xl md:text-6xl font-serif text-white italic">Begin Your Journey</h2>
               <p className="text-Color-Light-300/60 font-light text-lg md:text-xl mt-8 max-w-2xl mx-auto leading-relaxed">
                 Every great love story deserves a masterpiece. Allow us to help you curate your own unforgettable moment.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
              <button 
                onClick={() => onNavigate('/contact')}
                className="group flex items-center gap-6 text-[10px] uppercase tracking-[0.5em] font-black text-white"
              >
                Start Your Story
                <div className="w-12 h-px bg-white group-hover:w-20 transition-all duration-500" />
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>

              <button 
                onClick={() => onNavigate('/shop')}
                className="px-10 py-5 bg-Color-Champagne-Gold text-Color-Dark-500 uppercase text-[10px] tracking-[0.4em] font-black hover:bg-white transition-colors duration-500"
              >
                Explore Collection
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer safe zone */}
      <div className="h-24 bg-[#FAF9F6]" />
    </motion.div>
  );
};