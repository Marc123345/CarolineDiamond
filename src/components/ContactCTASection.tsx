import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Phone, Mail, MapPin, Calendar, Clock, 
  Car, Award, Shield, Heart, ArrowRight, Gem 
} from 'lucide-react';
import { contactInfo } from '../config/siteConfig';

interface ContactCTASectionProps {
  onNavigate: (page: string) => void;
}

export const ContactCTASection: React.FC<ContactCTASectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax values for editorial depth
  const yShift = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]));
  const opacityFade = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section 
      ref={containerRef}
      className="relative py-32 md:py-56 bg-Color-Netural-Black overflow-hidden"
    >
      {/* --- LUXURY BACKGROUND ENGINE --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Diamond Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-Color-Champagne-Gold rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: THE INVITATION */}
          <div className="lg:col-span-7">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[10px] uppercase tracking-[0.6em] text-Color-Light-300 font-black mb-8 block">
                The Final Masterpiece
              </span>
              
              <h2 className="text-5xl md:text-8xl font-serif text-white leading-[0.9] mb-12">
                Your Legacy <br />
                <span className="italic text-Color-Champagne-Gold ml-0 md:ml-20">Starts Here.</span>
              </h2>

              <p className="text-xl text-Color-Light-300/60 font-light leading-relaxed max-w-xl mb-16">
                Let us escort you through the journey of a lifetime. Whether it's a legacy diamond or a bespoke setting, your vision deserves the Antwerp standard.
              </p>

              {/* Showroom Features List */}
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: Shield, title: 'Secure Environment', desc: '100% Privacy in the Diamond District' },
                  { icon: Car, title: 'Complimentary Access', desc: 'Private Parking at our Showroom' },
                  { icon: Award, title: 'Certified Expertise', desc: 'Direct access to IGI/GIA Experts' },
                  { icon: Clock, title: 'Flexible Schedule', desc: 'Bookings outside of normal hours' }
                ].map((feat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="flex gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-Color-Champagne-Gold transition-colors duration-500">
                      <feat.icon className="w-4 h-4 text-Color-Champagne-Gold" />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest font-black text-white mb-1">{feat.title}</h4>
                      <p className="text-[11px] text-Color-Gray-500 font-medium leading-relaxed">{feat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: THE CONCIERGE LEDGER */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            <motion.div 
              style={{ y: yShift }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 md:p-14 space-y-12 rounded-sm shadow-2xl"
            >
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-Color-Light-300 block">Direct Access</span>
                <div className="h-px w-full bg-gradient-to-r from-Color-Champagne-Gold/40 to-transparent" />
              </div>

              {/* Contact Links */}
              {[
                { label: 'Voice', value: contactInfo.phone, icon: Phone, action: `tel:${contactInfo.phone}` },
                { label: 'Digital', value: contactInfo.email, icon: Mail, action: `mailto:${contactInfo.email}` },
                { label: 'Showroom', value: 'District Antwerp', icon: MapPin, action: '/contact' }
              ].map((link, i) => (
                <button 
                  key={i}
                  onClick={() => link.action.startsWith('/') ? onNavigate(link.action) : window.open(link.action)}
                  className="w-full flex items-center justify-between group py-4 border-b border-white/5 hover:border-Color-Champagne-Gold/50 transition-all duration-500"
                >
                  <div className="flex items-center gap-6">
                    <link.icon className="w-5 h-5 text-Color-Light-300 group-hover:text-Color-Champagne-Gold transition-colors" />
                    <div className="text-left">
                      <span className="block text-[8px] uppercase tracking-widest text-Color-Gray-500 font-black mb-1">{link.label}</span>
                      <span className="block text-lg font-serif text-white group-hover:text-Color-Champagne-Gold transition-colors">{link.value}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-Color-Champagne-Gold group-hover:translate-x-2 transition-all" />
                </button>
              ))}

              {/* Main Booking CTA */}
              <button
                onClick={() => onNavigate('/contact')}
                className="w-full relative group overflow-hidden bg-Color-Champagne-Gold text-Color-Netural-Black py-6 uppercase text-xs tracking-[0.5em] font-black transition-all duration-500"
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  Request Consultation
                  <Gem className="w-4 h-4 animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
              </button>
            </motion.div>

            {/* Decorative Offset Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 0.15, scale: 1 }}
              className="absolute -bottom-24 -right-12 w-64 h-64 pointer-events-none -z-10"
            >
              <img 
                src="https://diamondsbycs.com/images/uploads/upload-656a00eee5ad1.jpeg" 
                className="w-full h-full object-cover grayscale rounded-full" 
                alt="" 
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};