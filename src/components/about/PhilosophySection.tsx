import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star } from 'lucide-react';
import { aboutContent } from '../../config/aboutConfig';

export const PhilosophySection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Check if user is on mobile
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      ref={ref}
      className="section-spacing bg-gradient-to-br from-Color-Netural-White via-Color-Secondary/20 to-Color-Netural-White premium-texture relative overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y: isMobile ? 0 : backgroundY }}
        className="absolute inset-0 opacity-20 pointer-events-none"
      >
        <div className="absolute top-1/4 right-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-br from-Color-Light-300/25 to-Color-Light-300/5 rounded-full animate-luxury-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-56 sm:w-64 h-56 sm:h-64 bg-gradient-to-br from-Color-Light-300/20 to-Color-Light-300/3 rounded-full animate-premium-pulse" />
      </motion.div>

      <div className="content-container container-spacing relative z-10">
        {/* Header */}
        <motion.div
          ref={inViewRef}
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 60 }}
          animate={isMobile ? { opacity: 1 } : (inView ? { opacity: 1, y: 0 } : {})}
          transition={isMobile ? { duration: 0 } : { duration: 1 }}
          className="text-center section-header"
        >
          <h2 className="typography-h1 text-Color-Dark-500 mb-6">
            Crafting <span className="text-Color-Light-300">Perfection</span>
          </h2>
          <p className="typography-body-xl text-Color-Gray-700 max-w-3xl mx-auto leading-relaxed">
            Every piece we create embodies our core values of excellence, authenticity, and timeless
            beauty. Discover what makes Diamonds by CS truly exceptional.
          </p>
          
          {/* Unifying Element */}
          <motion.div 
            initial={{ width: 0 }}
            animate={inView ? { width: "120px" } : { width: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
          />
        </motion.div>

        {/* Philosophy Cards - swipeable on mobile */}
        <motion.div
          drag={isMobile ? false : "x"}
          dragConstraints={isMobile ? {} : { left: -120, right: 120 }}
          dragElastic={isMobile ? 0 : 0.2}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 cursor-grab active:cursor-grabbing"
        >
          {aboutContent.philosophy.map((item, index) => (
            <motion.div
              key={index}
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 60 }}
              animate={isMobile ? { opacity: 1 } : (inView ? { opacity: 1, y: 0 } : {})}
              transition={isMobile ? { duration: 0 } : { duration: 0.6, delay: 0.3 * index }}
              whileHover={isMobile ? {} : { y: -10, scale: 1.03 }}
              whileTap={isMobile ? {} : { scale: 0.97 }}
              className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/40 shadow-xl border border-Color-Light-300/30 overflow-hidden relative rounded-xl"
            >
              {/* Icon */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-Color-Light-300 flex items-center justify-center shadow-lg rounded-full">
                <item.icon className="h-6 w-6 text-white" />
              </div>

              {/* Image */}
              <div className="h-48 sm:h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h4 className="text-xl font-bold mb-3 text-Color-Dark-500">{item.title}</h4>
                <p className="text-Color-Gray-700 mb-4">{item.description}</p>
                {item.features && (
                  <ul className="space-y-2">
                    {item.features.map((f: string, i: number) => (
                      <motion.li
                        key={i}
                        whileTap={isMobile ? {} : { scale: 0.95 }}
                        className="flex items-center text-sm text-Color-Gray-700"
                      >
                        <Star className="h-4 w-4 text-Color-Light-300 mr-2" /> {f}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Image Showcase - swipeable on mobile */}
        <motion.div
          drag={isMobile ? false : "x"}
          dragConstraints={isMobile ? {} : { left: -150, right: 150 }}
          dragElastic={isMobile ? 0 : 0.25}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-grab active:cursor-grabbing"
        >
          {[
            {
              src: 'https://diamondsbycs.com/images/uploads/upload-655239166023c.JPG',
              title: 'Timeless Elegance',
            },
            {
              src: 'https://diamondsbycs.com/images/uploads/upload-65523dbbebb62.JPG',
              title: 'Personal Touch',
            },
            {
              src: 'https://diamondsbycs.com/images/uploads/upload-65523dcc422c0.JPG',
              title: 'Ethical Beauty',
            },
          ].map((img, idx) => (
            <motion.div
              key={idx}
              whileTap={isMobile ? { scale: 0.97 } : { scale: 0.97 }}
              whileHover={isMobile ? {} : { scale: 1.05 }}
              className="relative overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-lg font-bold">{img.title}</h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};