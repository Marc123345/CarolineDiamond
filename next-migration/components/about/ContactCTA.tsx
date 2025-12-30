'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Phone, Mail, Star, Calendar, Clock, Car, Award, Shield, Gem } from 'lucide-react';
import { contactInfo, reviewsInfo } from '../../config/siteConfig';

interface ContactCTAProps {
  onNavigate: (page: string) => void;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ onNavigate }) => {
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
      className="section-spacing bg-gradient-to-br from-Color-Netural-Black via-Color-Dark-500 to-Color-Netural-Black text-Color-Netural-White relative overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y: isMobile ? 0 : backgroundY }}
        className="absolute inset-0 opacity-30 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-Color-Light-300/20 to-Color-Light-300/5 rounded-full animate-luxury-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-60 sm:w-72 h-60 sm:h-72 bg-gradient-to-br from-Color-Light-300/15 to-Color-Light-300/3 rounded-full animate-premium-pulse" />
      </motion.div>

      <div className="content-container container-spacing relative z-10">
        {/* Reviews */}
        <motion.div
          ref={inViewRef}
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 80 }}
          animate={isMobile ? { opacity: 1 } : (inView ? { opacity: 1, y: 0 } : {})}
          transition={isMobile ? { duration: 0 } : { duration: 1 }}
          className="mb-16"
        >
          <motion.div
            drag={isMobile ? false : "x"}
            dragConstraints={isMobile ? {} : { left: -60, right: 60 }}
            className="bg-gradient-to-r from-Color-Light-300/25 to-Color-Light-300/15 p-6 sm:p-8 md:p-12 rounded-2xl border border-Color-Light-300/40 max-w-3xl mx-auto relative overflow-hidden cursor-grab active:cursor-grabbing"
          >
            <div className="relative z-10 text-center">
              {/* Rating */}
              <div className="flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-Color-Light-300 mr-2 fill-current" />
                <h3 className="text-xl sm:text-2xl font-bold">{reviewsInfo.platform}</h3>
              </div>
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-Color-Light-300 mr-3">
                  {reviewsInfo.rating}
                </span>
                <div className="flex text-Color-Light-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-sm sm:text-base text-Color-Netural-White">
                Based on {reviewsInfo.totalReviews} reviews
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your <span className="text-Color-Light-300">Dream Jewelry?</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-Color-Light-300 max-w-3xl mx-auto">
            Visit our showroom in Antwerp's diamond district for a consultation and discover how we
            can bring your vision to life.
          </p>
        </div>

        {/* Contact Options */}
        <motion.div
          drag={isMobile ? false : "x"}
          dragConstraints={isMobile ? {} : { left: -80, right: 80 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 cursor-grab active:cursor-grabbing"
        >
          {[
            {
              icon: MapPin,
              title: 'Visit Our Showroom',
              primary: contactInfo.address.street,
              secondary: `${contactInfo.address.postalCode} ${contactInfo.address.city}`,
              action: '/contact',
            },
            {
              icon: Phone,
              title: 'Call Us',
              primary: contactInfo.phone,
              secondary: 'Available daily',
              action: `tel:${contactInfo.phone}`,
            },
            {
              icon: Mail,
              title: 'Email Us',
              primary: contactInfo.email,
              secondary: 'Replies within 24h',
              action: `mailto:${contactInfo.email}`,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={isMobile ? {} : { scale: 1.05, y: -5 }}
              whileTap={isMobile ? {} : { scale: 0.95 }}
              onClick={() =>
                item.action.startsWith('/') ? onNavigate(item.action) : window.open(item.action)
              }
              className="bg-gradient-to-br from-Color-Light-300/20 to-Color-Light-300/10 p-6 rounded-xl border border-Color-Light-300/30 text-center cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-Color-Light-300 rounded-full">
                <item.icon className="h-8 w-8 text-Color-Netural-White" />
              </div>
              <h4 className="font-bold text-lg sm:text-xl mb-2">{item.title}</h4>
              <p className="text-Color-Light-300 font-medium">{item.primary}</p>
              <p className="text-sm text-Color-Netural-White">{item.secondary}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Showroom Image + Features */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-6">
              Showroom <span className="text-Color-Light-300">Experience</span>
            </h3>
            <div className="space-y-4">
              {[
                { icon: Clock, title: 'Flexible Hours', desc: contactInfo.hours },
                { icon: Car, title: 'Free Parking', desc: contactInfo.parking.address },
                { icon: Award, title: 'Expert Guidance', desc: 'Personal advice from Caroline' },
                { icon: Shield, title: 'Private Viewing', desc: 'Exclusive sessions available' },
              ].map((f, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 5, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center bg-Color-Light-300/10 p-4 rounded-lg border border-Color-Light-300/20"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-Color-Light-300 rounded mr-3">
                    <f.icon className="h-5 w-5 text-Color-Netural-White" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm sm:text-base">{f.title}</h5>
                    <p className="text-xs sm:text-sm text-Color-Light-300">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden rounded-xl shadow-xl"
          >
            <img
              src="https://images.pexels.com/photos/3856033/pexels-photo-3856033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Showroom Interior"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="font-bold text-lg">Private Consultation</h4>
              <p className="text-sm text-Color-Light-300">Experience our collection in luxury</p>
            </div>
          </motion.div>
        </div>

        {/* Unifying Element */}
        <motion.div 
          initial={{ width: 0 }}
          animate={inView ? { width: "200px" } : { width: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
        />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('/contact')}
            className="bg-Color-Light-300 text-Color-Netural-White font-semibold py-3 px-6 transition-all duration-300 hover:bg-Color-Light-300/90 hover:shadow-lg active:scale-95 rounded-lg flex items-center justify-center text-base"
          >
            <Calendar className="mr-2 h-5 w-5" /> Make Appointment
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('/shop')}
            className="border-2 border-Color-Light-300 text-Color-Light-300 bg-transparent font-semibold py-3 px-6 transition-all duration-300 hover:bg-Color-Light-300 hover:text-Color-Netural-Black hover:shadow-lg active:scale-95 rounded-lg flex items-center justify-center text-base"
          >
            <Gem className="mr-2 h-5 w-5" /> View Portfolio
          </motion.button>
        </div>
      </div>
    </section>
  );
};
