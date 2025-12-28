import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Palette, Heart, Users, Star, Crown, Sparkles, Camera, Scissors, Shirt, Gem } from 'lucide-react';

interface StylingAdviceSectionProps {
  onNavigate: (page: string) => void;
}

export const StylingAdviceSection: React.FC<StylingAdviceSectionProps> = ({ onNavigate }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
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
    <section ref={ref} className="py-20 sm:py-32 lg:py-40 xl:py-48 bg-gradient-to-br from-Color-Secondary via-Color-Netural-White to-Color-Secondary luxury-texture relative overflow-hidden">
      {/* Enhanced Parallax Background Elements */}
      <motion.div 
        style={{ y: isMobile ? 0 : backgroundY }}
        className="absolute inset-0 opacity-15 pointer-events-none"
      >
        <div className="absolute top-24 left-1/4 w-64 h-64 bg-gradient-to-br from-Color-Light-300/25 to-Color-Light-300/5 rounded-full animate-luxury-glow"></div>
        <div className="absolute bottom-24 right-1/4 w-48 h-48 bg-gradient-to-br from-Color-Light-300/20 to-Color-Light-300/3 rounded-full animate-premium-pulse"></div>
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-gradient-to-br from-Color-Light-300/15 to-Color-Light-300/2 rounded-full animate-diamond-sparkle"></div>
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 relative z-10">
        {/* Section Header */}
        <motion.div 
          ref={inViewRef}
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 80 }}
          animate={isMobile ? { opacity: 1 } : (inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 })}
          transition={isMobile ? { duration: 0 } : { duration: 1 }}
          className="text-center mb-14"
        >
          <motion.div 
            initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            animate={isMobile ? { opacity: 1, scale: 1 } : (inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 })}
            transition={isMobile ? { duration: 0 } : { duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center justify-center mb-8"
          >
            <motion.div 
              initial={isMobile ? { width: "80px" } : { width: 0 }}
              animate={isMobile ? { width: "80px" } : (inView ? { width: "80px" } : { width: 0 })}
              transition={isMobile ? { duration: 0 } : { duration: 1, delay: 0.5 }}
              className="h-[3px] bg-gradient-to-r from-transparent to-Color-Light-300 mr-6"
            />
            <span className="typography-caption uppercase tracking-[0.3em] text-Color-Light-300 font-semibold">
              Styling advies
            </span>
            <motion.div 
              initial={isMobile ? { width: "80px" } : { width: 0 }}
              animate={isMobile ? { width: "80px" } : (inView ? { width: "80px" } : { width: 0 })}
              transition={isMobile ? { duration: 0 } : { duration: 1, delay: 0.7 }}
              className="h-[3px] bg-gradient-to-l from-transparent to-Color-Light-300 ml-6"
            />
          </motion.div>
          
          <motion.h2 
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 40 }}
            animate={isMobile ? { opacity: 1 } : (inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 })}
            transition={isMobile ? { duration: 0 } : { duration: 1, delay: 0.5 }}
            className="typography-h1 text-Color-Dark-500 mb-8 relative"
          >
            <span>Styling advies voor bruid & bruidegom</span>
          </motion.h2>
          
          {/* Unifying Element */}
          <motion.div 
            initial={{ width: 0 }}
            animate={inView ? { width: "180px" } : { width: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-10 mb-32">
          {/* Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: -80 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-7 space-y-12"
          >
            {/* Maasmechelen Experience */}
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/40 p-10 shadow-2xl border border-Color-Light-300/30 relative overflow-hidden"
            >
              <motion.div
                animate={{ 
                  backgroundPosition: ["0% 0%", "100% 100%"],
                  opacity: [0.05, 0.15, 0.05]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 premium-texture"
              />
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <motion.div 
                    whileHover={{ 
                      scale: 1.3, 
                      rotate: 360,
                      boxShadow: "0 0 40px rgba(205,188,171,0.8)"
                    }}
                    transition={{ duration: 0.8 }}
                    className="w-16 h-16 bg-gradient-to-br from-Color-Light-300 to-Color-Light-300/80 flex items-center justify-center shadow-2xl mr-6"
                  >
                    <Palette className="h-8 w-8 text-Color-Netural-White" />
                  </motion.div>
                  <div>
                    <h3 className="typography-h3 text-Color-Dark-500 font-bold mb-2">
                      Styling advies voor bruid & bruidegom
                    </h3>
                    <p className="typography-body text-Color-Light-300 font-medium">
                      Expert Styling
                    </p>
                  </div>
                </div>
                
                <p className="typography-body-xl text-Color-Gray-700 leading-relaxed mb-8">
                  Caroline is dé expert op het gebied van styling en heeft maar liefst 12 jaar als vaste styliste bij Maasmechelen Village gewerkt. Haar ervaring en expertise maken haar dé persoon om jou te helpen bij het maken van de juiste keuzes op het gebied van kleding, make-up en haar, inclusief een kleur- en stijlanalyse.
                </p>
                
                {/* Styling Services Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: Shirt, title: 'Clothing Consultation', desc: 'Perfect outfit coordination' },
                    { icon: Sparkles, title: 'Color Analysis', desc: 'Find your perfect palette' },
                    { icon: Camera, title: 'Style Photography', desc: 'Capture your best look' },
                    { icon: Scissors, title: 'Hair & Makeup', desc: 'Complete styling advice' }
                  ].map((service, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                      whileHover={{ scale: 1.05, y: -3 }}
                      className="bg-Color-Netural-White/80 p-6 shadow-lg border border-Color-Light-300/50 backdrop-blur-sm"
                    >
                      <service.icon className="h-8 w-8 text-Color-Light-300 mb-3" />
                      <h4 className="typography-h6 text-Color-Dark-500 font-bold mb-2">{service.title}</h4>
                      <p className="typography-caption text-Color-Gray-700">{service.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Wedding Styling Services */}
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-r from-Color-Netural-Black to-Color-Dark-500 text-Color-Netural-White p-10 shadow-2xl relative overflow-hidden"
            >
              <motion.div
                animate={{ 
                  backgroundPosition: ["0% 0%", "100% 100%"],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 silk-texture"
              />
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <motion.div 
                    whileHover={{ 
                      scale: 1.3, 
                      rotate: 360,
                      boxShadow: "0 0 40px rgba(205,188,171,0.6)"
                    }}
                    transition={{ duration: 0.8 }}
                    className="w-16 h-16 bg-Color-Light-300 flex items-center justify-center shadow-2xl mr-6"
                  >
                    <Crown className="h-8 w-8 text-Color-Netural-White" />
                  </motion.div>
                  <h3 className="typography-h3 text-Color-Netural-White font-bold">
                    Complete Wedding Styling
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <p className="typography-body-xl text-Color-Light-300 leading-relaxed font-medium">
                    Maar dat is nog niet alles: wist je dat Caroline ook beschikbaar is voor trouwstyling? Zo zorgt ze voor een unieke en uniforme stijl voor jouw bruidsmeisjes, familie of vrienden. Met Caroline aan jouw zijde kan jouw trouwdag niet meer stuk.
                  </p>
                  
                  {/* Custom Pricing Badge */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center bg-Color-Light-300/20 border border-Color-Light-300/40 px-6 py-3 shadow-xl"
                  >
                    <Star className="h-5 w-5 text-Color-Light-300 mr-2 fill-current" />
                    <span className="typography-body text-Color-Light-300 font-bold">De prijs wordt op maat gemaakt.</span>
                  </motion.div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-8 right-8 w-12 h-12 bg-Color-Light-300/20 rounded-full"
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                className="absolute bottom-8 left-8 w-8 h-8 bg-Color-Light-300/15 rounded-full"
              />
            </motion.div>
          </motion.div>

          {/* Visual Column */}
          <motion.div 
            initial={{ opacity: 0, x: 80 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Main Styling Image */}
            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: 1,
                boxShadow: "0 40px 80px rgba(0,0,0,0.3)"
              }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="relative overflow-hidden shadow-2xl">
                <img
                  src="https://diamondsbycs.com/images/uploads/upload-6557810d1692c.jpeg"
                  alt="Wedding Styling Consultation"
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Experience Badge */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360, 720],
                    boxShadow: [
                      "0 0 20px rgba(205,188,171,0.4)",
                      "0 0 40px rgba(205,188,171,0.8)",
                      "0 0 20px rgba(205,188,171,0.4)"
                    ]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 right-6 w-20 h-20 bg-Color-Light-300/95 flex items-center justify-center shadow-2xl"
                >
                  <span className="typography-h6 text-Color-Netural-White font-bold">12Y</span>
                </motion.div>
                
                {/* Bottom Info */}
                <div className="absolute bottom-8 left-8 right-8">
                  <h4 className="typography-h4 text-Color-Netural-White font-bold mb-2" style={{ textShadow: '3px 3px 12px rgba(0,0,0,0.9)' }}>
                    Professional Styling
                  </h4>
                  <p className="typography-body-lg text-Color-Light-300 font-medium" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                    Complete wedding coordination
                  </p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.4, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 w-16 h-16 bg-Color-Light-300 shadow-2xl"
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-6 -right-6 w-12 h-12 bg-Color-Light-300 shadow-xl"
              />
            </motion.div>

            {/* Styling Services Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { src: 'https://images.pexels.com/photos/6945014/pexels-photo-6945014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', title: 'Bridal Styling', icon: Crown },
                { src: 'https://images.pexels.com/photos/7691743/pexels-photo-7691743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', title: 'Color Analysis', icon: Palette }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.2) }}
                  whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                  className="relative overflow-hidden rounded-2xl shadow-xl group"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Service Icon */}
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-4 right-4 w-12 h-12 bg-Color-Light-300/90 rounded-full flex items-center justify-center shadow-xl"
                  >
                    <item.icon className="h-6 w-6 text-Color-Netural-White" />
                  </motion.div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="typography-body text-Color-Netural-White font-semibold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                      {item.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Wedding Party Coordination */}
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.8, delay: 1 }}
              whileHover={{ scale: 1.03, y: -8 }}
              className="relative overflow-hidden rounded-2xl shadow-2xl group"
            >
              <img
                src="https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Wedding Party Styling"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              
              {/* Overlay Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center">
                  <h4 className="typography-h4 text-Color-Netural-White font-bold mb-3" style={{ textShadow: '3px 3px 12px rgba(0,0,0,0.9)' }}>
                    Wedding Party Coordination
                  </h4>
                  <p className="typography-body-lg text-Color-Light-300" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                    Bridesmaids • Family • Friends
                  </p>
                </div>
              </motion.div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="typography-h5 text-Color-Netural-White font-bold mb-2" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                  Complete Wedding Styling
                </h4>
                <p className="typography-body text-Color-Light-300" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                  Unique and consistent style for your entire wedding party
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Showcase Column */}
          <motion.div 
            initial={{ opacity: 0, x: 80 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Before/After Styling */}
            <div className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/40 p-8 shadow-xl border border-Color-Light-300/30">
              <h4 className="typography-h5 text-Color-Dark-500 font-bold mb-6 text-center">
                Styling Transformation
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative overflow-hidden shadow-lg mb-3"
                  >
                    <img
                      src="https://diamondsbycs.com/images/uploads/upload-660bbaa346b8b.jpg"
                      alt="Before Styling"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs">
                      Before
                    </div>
                  </motion.div>
                  <p className="typography-caption text-Color-Gray-700">Initial Consultation</p>
                </div>
                <div className="text-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative overflow-hidden shadow-lg mb-3"
                  >
                    <img
                      src="https://diamondsbycs.com/images/uploads/upload-65410338df678.jpeg"
                      alt="After Styling"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs">
                      After
                    </div>
                  </motion.div>
                  <p className="typography-caption text-Color-Gray-700">Styled Perfection</p>
                </div>
              </div>
            </div>

            {/* Styling Portfolio */}
            <motion.div 
              whileHover={{ scale: 1.03, y: -8 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden shadow-2xl group"
            >
              <img
                src="https://diamondsbycs.com/images/uploads/upload-666709f4042ad.jpg"
                alt="Styling Portfolio"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              
              {/* Portfolio Badge */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 20px rgba(205,188,171,0.4)",
                    "0 0 40px rgba(205,188,171,0.8)",
                    "0 0 20px rgba(205,188,171,0.4)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 left-6 bg-Color-Light-300/95 px-4 py-2 shadow-xl"
              >
                <span className="typography-body text-Color-Netural-White font-bold">Portfolio</span>
              </motion.div>
              
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="typography-h4 text-Color-Netural-White font-bold mb-3" style={{ textShadow: '3px 3px 12px rgba(0,0,0,0.9)' }}>
                  Styling Expertise
                </h4>
                <p className="typography-body-lg text-Color-Light-300" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                  12 years of professional styling experience
                </p>
              </div>
            </motion.div>

            {/* Service Highlights */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, title: 'Group Styling', count: '500+' },
                { icon: Heart, title: 'Happy Brides', count: '200+' }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: 1.2 + (index * 0.2) }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/40 p-6 shadow-lg border border-Color-Light-300/30 text-center"
                >
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-Color-Light-300 flex items-center justify-center mx-auto mb-3 shadow-lg"
                  >
                    <stat.icon className="h-6 w-6 text-Color-Netural-White" />
                  </motion.div>
                  <div className="typography-h4 text-Color-Light-300 font-bold mb-1">{stat.count}</div>
                  <p className="typography-caption text-Color-Gray-700 font-medium">{stat.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 80 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="text-center"
        >
          <motion.div 
            whileHover={{ scale: 1.02, y: -10 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-Color-Netural-Black via-Color-Dark-500 to-Color-Netural-Black text-Color-Netural-White p-16 shadow-2xl border border-Color-Light-300/30 max-w-5xl mx-auto relative overflow-hidden"
          >
            {/* Background Pattern */}
            <motion.div
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%"],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 luxury-texture"
            />
            
            <div className="relative z-10">
              <motion.h3 
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                className="typography-h2 text-Color-Netural-White mb-8"
              >
                Ready for Your Perfect Wedding Style?
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 2 }}
                className="typography-body-xl text-Color-Light-300 mb-12 max-w-3xl mx-auto"
              >
                Book a consultation to discuss your complete wedding styling needs, from jewelry to complete bridal party coordination
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, delay: 2.2 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/contact')}
                  className="border-2 border-Color-Light-300 text-Color-Light-300 bg-transparent font-semibold py-4 px-10 transition-all duration-300 hover:bg-Color-Light-300 hover:text-Color-Netural-Black hover:shadow-lg active:scale-95 rounded-lg flex items-center justify-center"
                >
                  <Crown className="mr-3 h-5 w-5" />
                  Book Styling Consultation
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.6, delay: 2.4 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/shop')}
                  className="bg-Color-Light-300 text-Color-Netural-White font-semibold py-4 px-10 transition-all duration-300 hover:bg-Color-Light-300/90 hover:shadow-lg active:scale-95 rounded-lg flex items-center justify-center"
                >
                  <Gem className="mr-3 h-5 w-5" />
                  View Jewelry Collection
                </motion.button>
              </div>
            </div>
            
            {/* Floating Accent Elements */}
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
                rotate: [0, 360, 720]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-8 right-8 w-16 h-16 bg-Color-Light-300/20 rounded-full"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.7, 0.2],
                rotate: [0, -360, -720]
              }}
              transition={{ duration: 6, repeat: Infinity, delay: 2 }}
              className="absolute bottom-8 left-8 w-12 h-12 bg-Color-Light-300/15 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};