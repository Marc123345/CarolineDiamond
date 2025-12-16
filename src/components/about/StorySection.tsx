import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Gem, Heart, Sparkles, Shield, Clock, Star, Diamond, Crown } from 'lucide-react';
import { aboutContent } from '../../config/aboutConfig';

interface StorySectionProps {
  onNavigate: (page: string) => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onNavigate }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
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
      className="section-spacing bg-gradient-to-br from-Color-Netural-White via-Color-Secondary/30 to-Color-Netural-White luxury-texture relative overflow-hidden"
    >
      {/* Parallax BG */}
      <motion.div style={{ y: isMobile ? 0 : backgroundY }} className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-Color-Light-300/20 to-Color-Light-300/5 rounded-full animate-luxury-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-72 h-56 sm:h-72 bg-gradient-to-br from-Color-Light-300/15 to-Color-Light-300/3 rounded-full animate-premium-pulse" />
      </motion.div>

      <div className="content-container container-spacing relative z-10">
        {/* Hero Title */}
        <motion.div
          ref={inViewRef}
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 60 }}
          animate={isMobile ? { opacity: 1 } : (inView ? { opacity: 1, y: 0 } : {})}
          transition={isMobile ? { duration: 0 } : { duration: 1 }}
          className="text-center section-header"
        >
          <h1 className="typography-h1 text-Color-Dark-500 mb-6">
            Over Caroline
          </h1>
          <p className="typography-body-xl text-Color-Gray-700 max-w-3xl mx-auto">
            Jouw ideeën, onze inspiratie
          </p>
          
          {/* Unifying Element */}
          <motion.div 
            initial={{ width: 0 }}
            animate={inView ? { width: "140px" } : { width: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
          />
        </motion.div>

        {/* Story Content Grid */}
        <motion.div
          drag={isMobile ? false : "x"}
          dragConstraints={isMobile ? {} : { left: -100, right: 100 }}
          dragElastic={isMobile ? 0 : 0.2}
          className="grid lg:grid-cols-12 gap-12 mb-12 cursor-grab active:cursor-grabbing"
        >
          {/* Left column */}
          <div className="lg:col-span-7 space-y-8">
            {[
              {
                icon: Award,
                title: 'De beste expertise',
                text: 'De beste expertise tijdens je zoektocht naar het perfecte juweel.',
                sub: 'Rijke ervaring in personal styling zodat we het perfecte juweel voor je vinden',
              },
              {
                icon: Crown,
                title: 'Erfgoed in diamantsector',
                text: 'Onze familie is al jarenlang aan de slag in de diamantsector met uiterste vakkennis als onze erfenis',
                sub: 'Service, kwaliteit en 100% discretie staan centraal',
              },
              {
                icon: Diamond,
                title: 'De allerbeste prijs',
                text: 'Tot wel 50% voordeliger dankzij onze samenwerking met een erkend Antwerpse juwelierszaak en diamanthandelaar',
                sub: 'Al deze troeven zorgen ervoor dat wij voor u het perfecte juweel creëren aan de beste prijs.',
              },
              {
                icon: Gem,
                title: 'Handgemaakte excellence',
                text: 'Onze juwelen worden in Antwerpen volledig met de hand gemaakt door onze vakmannen. We gebruiken de meest kwalitatieve materialen en conflict-vrije diamanten.',
                sub: 'Elke juweel komt met een 2 jaar garantie: altijd welkom voor een herstelling of grote kuis van je juweel. Diamonds by CS maakt het dragen van een juweel toegankelijk voor iedereen.',
              },
            ].map((block, i) => (
              <motion.div
                key={i}
                whileTap={isMobile ? {} : { scale: 0.97 }}
                whileHover={isMobile ? {} : { scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 p-8 shadow-lg border border-Color-Light-300/30"
              >
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-Color-Light-300 flex items-center justify-center mr-4 shadow-lg">
                    <block.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="typography-h3 text-Color-Dark-500">{block.title}</h3>
                </div>
                <p className="typography-body-lg text-Color-Gray-700 mb-2">{block.text}</p>
                <p className="text-sm text-Color-Gray-600">{block.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Right column - portrait */}
          <div className="lg:col-span-5">
            <motion.div
              whileTap={isMobile ? {} : { scale: 0.98 }}
              whileHover={isMobile ? {} : { scale: 1.03 }}
              className="relative overflow-hidden shadow-2xl"
            >
              <img
                src="https://diamondsbycs.com/images/uploads/upload-655239166023c.JPG"
                alt="Caroline Schreiber - Master Jeweler"
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="font-bold text-lg">Caroline Schreiber</h4>
                <p className="text-sm">Master Jeweler & Designer</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Achievements - swipeable */}
        <motion.div
          drag={isMobile ? false : "x"}
          dragConstraints={isMobile ? {} : { left: -120, right: 120 }}
          dragElastic={isMobile ? 0 : 0.2}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 cursor-grab active:cursor-grabbing"
        >
          {aboutContent.achievements.map((ach, i) => (
            <motion.div
              key={i}
              whileHover={isMobile ? {} : { scale: 1.05, y: -5 }}
              whileTap={isMobile ? {} : { scale: 0.95 }}
              className="p-6 bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 shadow-lg border border-Color-Light-300/30 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-Color-Light-300 flex items-center justify-center shadow-lg">
                <ach.icon className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-semibold mb-2 text-Color-Dark-500">{ach.title}</h4>
              <p className="text-sm text-Color-Gray-700">{ach.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Certificate Section */}
        <motion.div 
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 60 }}
          animate={isMobile ? { opacity: 1 } : (inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 })}
          transition={isMobile ? { duration: 0 } : { duration: 0.8, delay: 1.2 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-Color-Netural-White to-Color-Secondary/30 p-12 rounded-2xl shadow-xl border border-Color-Light-300/30 max-w-4xl mx-auto">
            <h3 className="typography-h4 text-Color-Dark-500 mb-8 flex items-center justify-center">
              <Shield className="h-6 w-6 text-Color-Light-300 mr-3" />
              Gecertificeerde Kwaliteit
            </h3>
            <p className="typography-body text-Color-Gray-700 mb-8 max-w-2xl mx-auto">
              Alle onze diamanten komen met officiële certificering van de meest gerespecteerde instituten ter wereld
            </p>
            <div className="flex items-center justify-center gap-8">
              {[
                { name: 'HRD Antwerp', logo: 'https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2024.svg?updatedAt=1757411304217', desc: 'Antwerp Diamond Certification' },
                { name: 'GIA', logo: 'https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2025.svg?updatedAt=1757411304418', desc: 'Gemological Institute of America' },
                { name: 'IGI', logo: 'https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2026.svg?updatedAt=1757411303262', desc: 'International Gemological Institute' }
              ].map((cert, index) => (
                <motion.div
                  key={index}
                  whileHover={isMobile ? {} : { scale: 1.1, y: -5 }}
                  transition={isMobile ? { duration: 0 } : { duration: 0.3 }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={cert.logo}
                      alt={`${cert.name} Certificate`}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <h4 className="typography-caption text-Color-Dark-500 font-bold mb-1">{cert.name}</h4>
                  <p className="text-xs text-Color-Gray-700">{cert.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gallery - swipeable */}
        <motion.div
          drag={isMobile ? false : "x"}
          dragConstraints={isMobile ? {} : { left: -150, right: 150 }}
          dragElastic={isMobile ? 0 : 0.25}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 cursor-grab active:cursor-grabbing"
        >
          {[
            { src: 'https://diamondsbycs.com/images/uploads/upload-655239014d729.jpeg', title: 'Diamonds by CS' },
            { src: 'https://diamondsbycs.com/images/uploads/upload-65523dbbebb62.JPG', title: 'Expertise in Diamonds' },
            { src: 'https://diamondsbycs.com/images/uploads/upload-65523dcc422c0.JPG', title: 'Personal Service' },
            { src: 'https://diamondsbycs.com/images/uploads/upload-6557810d1692c.jpeg', title: 'Wedding Styling' },
          ].map((img, i) => (
            <motion.div
              key={i}
              whileTap={isMobile ? {} : { scale: 0.97 }}
              whileHover={isMobile ? {} : { scale: 1.05 }}
              className="relative overflow-hidden rounded-lg shadow-md"
            >
              <img src={img.src} alt={img.title} className="w-full h-40 object-cover" />
              <div className="absolute bottom-2 left-2 text-white text-sm drop-shadow-lg">{img.title}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};