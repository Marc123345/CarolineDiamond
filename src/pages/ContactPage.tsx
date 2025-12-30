import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PageHero } from '../components/PageHero';
import { GoogleMap } from '../components/GoogleMap';
import { MapPin, Phone, Mail, Clock, Sparkles, Gem, Calendar } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Luxury Entrance Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 }
    }
  };

  const itemVars = {
    hidden: { y: 40, opacity: 0, filter: 'blur(10px)' },
    show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#FCFAFB] min-h-screen overflow-hidden"
    >
      {/* --- HERO SECTION --- */}
      <section className="relative group">
        <PageHero
          title="Let's Create Together"
          subtitle="Begin Your Legacy"
          backgroundImage="https://diamondsbycs.com/images/uploads/upload-656f1b6c4faa8.jpeg"
        />
        
        {/* Editorial Breadcrumbs overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-24 sm:pt-32 lg:pt-36 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pointer-events-auto">
            <Breadcrumbs
              items={[{ label: 'The Concierge', icon: MapPin }]}
              onNavigate={onNavigate}
              className="text-white/80 hover:text-white transition-colors duration-500"
            />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FCFAFB] to-transparent" />
      </section>

      {/* --- CONTENT ENGINE --- */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-48">
        <motion.div 
          variants={containerVars}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-12 gap-20 items-start"
        >
          
          {/* LEFT: THE INVITATION STORY */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div variants={itemVars}>
              <span className="text-[10px] uppercase tracking-[0.6em] text-Color-Light-300 font-black mb-6 block">
                The Antwerp Atelier
              </span>
              <h2 className="text-5xl md:text-7xl font-serif text-Color-Dark-500 leading-[0.9] mb-8">
                Request a <br />
                <span className="italic text-Color-Champagne-Gold ml-0 md:ml-12">Consultation.</span>
              </h2>
              <p className="text-xl text-Color-Gray-600 font-light leading-relaxed max-w-sm">
                Every masterpiece begins with a conversation. We invite you to our showroom for a private discovery of the world's finest diamonds.
              </p>
            </motion.div>

            {/* Direct Interaction Links */}
            <div className="space-y-4 pt-8">
              {[
                { label: 'Voice', value: '+31 6 12345678', icon: Phone, action: 'tel:+31612345678' },
                { label: 'Digital', value: 'info@diamondsbycs.com', icon: Mail, action: 'mailto:info@diamondsbycs.com' }
              ].map((link, idx) => (
                <motion.button 
                  key={idx}
                  variants={itemVars}
                  onClick={() => window.open(link.action)}
                  className="w-full flex items-center justify-between group py-6 border-b border-black/[0.04] hover:border-Color-Champagne-Gold/50 transition-all duration-700"
                >
                  <div className="flex items-center gap-6">
                    <link.icon className="w-5 h-5 text-Color-Light-300 group-hover:text-Color-Champagne-Gold transition-colors" />
                    <div className="text-left">
                      <span className="block text-[9px] uppercase tracking-widest text-Color-Gray-400 font-black mb-1">{link.label}</span>
                      <span className="block text-xl font-serif text-Color-Dark-500 group-hover:text-Color-Champagne-Gold transition-colors">{link.value}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-black/10 group-hover:text-Color-Champagne-Gold group-hover:translate-x-2 transition-all duration-500" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* RIGHT: SHOWROOM LEDGER CARD */}
          <div className="lg:col-span-7">
            <motion.div 
              variants={itemVars}
              className="bg-white p-10 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.04)] border border-black/[0.02] rounded-sm relative overflow-hidden"
            >
              {/* Subtle texture overlay */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <MapPin className="w-5 h-5 text-Color-Champagne-Gold" />
                      <h4 className="text-[11px] uppercase tracking-widest font-black text-Color-Dark-500">The Showroom</h4>
                    </div>
                    <address className="not-italic text-Color-Gray-600 font-light space-y-1">
                      <p className="text-lg text-Color-Dark-500 font-medium">Diamonds by CS</p>
                      <p>Herengracht 450</p>
                      <p>Amsterdam, Netherlands</p>
                    </address>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <Clock className="w-5 h-5 text-Color-Champagne-Gold" />
                      <h4 className="text-[11px] uppercase tracking-widest font-black text-Color-Dark-500">Presence</h4>
                    </div>
                    <p className="text-lg font-serif italic text-Color-Dark-500">Strictly by Appointment Only</p>
                    <p className="text-[11px] text-Color-Gray-400 mt-2">Mon — Sat: 10:00 - 19:00</p>
                  </div>
                </div>

                {/* Main Action Button */}
                <div className="flex flex-col justify-end">
                   <button 
                    onClick={() => onNavigate('/book')}
                    className="w-full relative group overflow-hidden bg-Color-Dark-500 text-white py-6 uppercase text-[10px] tracking-[0.5em] font-black transition-all duration-700 hover:bg-black"
                   >
                     <span className="relative z-10 flex items-center justify-center gap-4">
                       Book Private Visit <Calendar className="w-4 h-4" />
                     </span>
                     <div className="absolute inset-0 bg-Color-Champagne-Gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
                   </button>
                </div>
              </div>

              {/* MAP INTEGRATION */}
              <div className="mt-16 h-80 rounded-sm overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border border-black/[0.05]">
                <GoogleMap />
              </div>
            </motion.div>
          </div>

        </motion.div>
      </main>

      {/* FOOTER ATMOSPHERE */}
      <div className="py-24 text-center opacity-20 group">
        <Gem className="w-8 h-8 text-Color-Champagne-Gold mx-auto mb-6 group-hover:scale-125 transition-transform duration-1000" />
        <span className="text-[9px] uppercase tracking-[0.5em] font-black">Est. 2009 • Antwerp Heritage</span>
      </div>
    </motion.div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);