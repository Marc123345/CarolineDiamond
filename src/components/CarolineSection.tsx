import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

interface CarolineSectionProps {
  onNavigate: (page: string) => void;
}

export const CarolineSection: React.FC<CarolineSectionProps> = () => {
  const { t } = useTranslation();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section
      ref={ref}
      className="luxury-section bg-gradient-to-br from-Color-Netural-White via-Color-Primary-Beige/30 to-Color-Netural-White overflow-hidden relative"
      style={{ background: 'radial-gradient(circle at 25% 25%, rgba(247,230,215,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(205,188,171,0.10) 0%, transparent 50%)' }}
    >
      {/* Subtle luxury ambient glow */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-10 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-Color-Primary-Beige/20 to-Color-Champagne-Gold/5 luxury-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-Color-Champagne-Gold/15 to-Color-Primary-Beige/3 luxury-glow"></div>
        <div className="absolute top-1/2 right-1/6 w-40 h-40 bg-gradient-to-br from-Color-Primary-Beige/10 to-Color-Champagne-Gold/2 luxury-glow"></div>
      </motion.div>

      <div className="luxury-container">
        {/* Header */}
        <div ref={inViewRef} className="text-center section-header relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-8 sm:mb-12 md:mb-16"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={inView ? { width: "80px" } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-[3px] sm:h-[4px] bg-gradient-to-r from-transparent to-Color-Champagne-Gold mr-4 sm:mr-6 md:mr-8 lg:mr-12 w-12 sm:w-16 md:w-20 lg:w-24"
            />
            <span className="text-sm sm:text-base uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-Color-Champagne-Gold font-semibold text-center">
              {t('Meet Caroline Schreiber')}
            </span>
            <motion.div 
              initial={{ width: 0 }}
              animate={inView ? { width: "80px" } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-[3px] sm:h-[4px] bg-gradient-to-l from-transparent to-Color-Champagne-Gold ml-4 sm:ml-6 md:ml-8 lg:ml-12 w-12 sm:w-16 md:w-20 lg:w-24"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="typography-h2 text-Color-Dark-500 mb-8 sm:mb-12 md:mb-16 lg:mb-20 relative font-serif"
          >
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {t('About')}
            </motion.span>{' '}
            <motion.span
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-Color-Champagne-Gold relative"
            >
              {t('Caroline')}
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: "100%" } : {}}
                transition={{ duration: 1.5, delay: 1.5 }}
                className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 lg:-bottom-6 left-0 h-[3px] sm:h-[4px] md:h-[5px] lg:h-[6px] bg-gradient-to-r from-transparent via-Color-Champagne-Gold/80 to-transparent"
              />
            </motion.span>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-Color-Gray-700 max-w-5xl mx-auto leading-relaxed px-6 sm:px-8"
          >
            {t('Discover the passion, expertise, and artistry behind every piece of jewelry.')}
            {t('Caroline\'s journey spans over 15 years in Antwerp\'s prestigious diamond district, creating personalized treasures that tell your unique story.')}
          </motion.p>
          
          {/* Unifying Element */}
          <motion.div 
            initial={{ width: 0 }}
            animate={inView ? { width: "120px" } : { width: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center relative z-10">
          {/* Content */}
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, x: -80 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-6 sm:space-y-8 lg:space-y-10 order-2 lg:order-1"
          >
            {/* Intro Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-white to-Color-Primary-Beige/40 p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl border border-Color-Champagne-Gold/30 relative overflow-hidden rounded-xl"
            >
              <div className="relative z-10">
                <div className="flex items-center mb-3 sm:mb-4 md:mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.3, rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 bg-gradient-to-br from-Color-Champagne-Gold to-Color-Champagne-Gold/80 flex items-center justify-center shadow-2xl mr-3 sm:mr-4 md:mr-6"
                  >
                    <Award className="h-5 sm:h-6 md:h-7 lg:h-8 w-5 sm:w-6 md:w-7 lg:w-8 text-Color-Netural-White" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-Color-Dark-500 font-bold font-serif">
                    {t('15+ Years of Excellence')}
                  </h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-Color-Gray-700 leading-relaxed">
                  {t('With over 15 years of experience in Antwerp\'s diamond district, Caroline creates timeless pieces that celebrate life\'s most precious moments. Every ring, necklace, and bracelet is handcrafted with love and attention to detail.')}
                </p>
              </div>
            </motion.div>

          </motion.div>

          {/* Images */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, x: 80 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative overflow-hidden shadow-2xl rounded-xl">
              <img
                src="https://diamondsbycs.com/images/uploads/upload-68b545cea1ff1.jpeg"
                alt={t('Handcrafted wedding rings')}
                className="w-full h-40 sm:h-48 lg:h-56 object-cover"
              />
            </div>

            <div className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-6 -left-3 sm:-left-4 lg:-left-6 transform -rotate-3 z-20 overflow-hidden shadow-2xl border-2 border-Color-Netural-White rounded-lg">
              <img
                src="https://diamondsbycs.com/images/uploads/upload-666be9d315beb.jpg"
                alt={t('Caroline Schreiber portrait')}
                className="w-24 sm:w-32 lg:w-40 h-30 sm:h-40 lg:h-50 object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};