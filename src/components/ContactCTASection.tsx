import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Phone, Mail, MapPin, Calendar, Clock, Car, Award, Shield, Heart
} from 'lucide-react';
import { contactInfo } from '../config/siteConfig';

interface ContactCTASectionProps {
  onNavigate: (page: string) => void;
}

export const ContactCTASection: React.FC<ContactCTASectionProps> = ({ onNavigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="section-spacing bg-gradient-to-br from-Color-Netural-Black via-Color-Dark-500 to-Color-Netural-Black text-Color-Netural-White relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 15, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-1/4 w-40 h-40 bg-gradient-to-br from-Color-Light-300/15 to-Color-Light-300/5 rounded-full"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -12, 0],
            scale: [1, 0.85, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-24 left-1/4 w-32 h-32 bg-gradient-to-br from-Color-Light-300/12 to-Color-Light-300/4 rounded-full"
        />
      </div>
      
      <div className="content-container container-spacing relative z-10">
        {/* Header */}
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center section-header"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-8 sm:mb-10"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="w-16 sm:w-18 h-16 sm:h-18 bg-Color-Light-300 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
            >
              <Heart className="h-8 sm:h-9 w-8 sm:w-9 text-Color-Netural-White fill-current" />
            </motion.div>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-Color-Netural-White mb-6 sm:mb-8 relative">
            <span className="font-bold text-white">Ready for Your Perfect Ring?</span>
          </h2>
          
          {/* Unifying Element */}
          <motion.div 
            initial={{ width: 0 }}
            animate={inView ? { width: "200px" } : { width: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl lg:text-3xl text-Color-Light-300 max-w-5xl mx-auto leading-relaxed px-4"
          >
            Let us help you create a moment that will last forever. Book your personal consultation today and discover how we can bring your vision to life with unmatched expertise and care.
          </motion.p>
        </motion.div>

        {/* Contact Options Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16"
        >
          {[
            {
              icon: Phone,
              title: 'Bel Direct',
              primary: contactInfo.phone,
              secondary: 'Beschikbaar dagelijks',
              action: `tel:${contactInfo.phone}`,
              color: 'from-green-500 to-green-600'
            },
            {
              icon: Mail,
              title: 'Email Ons',
              primary: contactInfo.email,
              secondary: 'Snelle reactie binnen 24u',
              action: `mailto:${contactInfo.email}`,
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: MapPin,
              title: 'Bezoek Showroom',
              primary: contactInfo.address.street,
              secondary: 'Hart van diamantkwartier',
              action: '/contact',
              color: 'from-purple-500 to-purple-600'
            }
          ].map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 1 + (index * 0.1) }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-gradient-to-br from-Color-Light-300/20 to-Color-Light-300/10 p-8 rounded-xl border border-Color-Light-300/30 text-center cursor-pointer group"
              onClick={() => contact.action.startsWith('/') ? onNavigate(contact.action) : window.open(contact.action)}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-r ${contact.color} rounded-full flex items-center justify-center mx-auto mb-8 sm:mb-10 shadow-lg`}
              >
                <contact.icon className="h-10 sm:h-12 w-10 sm:w-12 text-white" />
              </motion.div>
              <h4 className="text-xl sm:text-2xl text-Color-Netural-White font-bold mb-4 sm:mb-6 group-hover:text-Color-Light-300 transition-colors duration-300">
                {contact.title}
              </h4>
              <p className="text-lg sm:text-xl text-Color-Light-300 font-medium mb-3 sm:mb-4">
                {contact.primary}
              </p>
              <p className="text-base text-Color-Light-300/80">
                {contact.secondary}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Showroom Experience */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid lg:grid-cols-2 gap-10 items-center"
        >
          {/* Left: Features */}
          <div className="space-y-8">
            <h3 className="typography-h3 text-Color-Netural-White mb-8">
              Showroom <span className="text-Color-Light-300">Experience</span>
            </h3>
            
            <div className="space-y-6">
              {[
                { icon: Clock, title: 'Flexible Hours', desc: contactInfo.hours },
                { icon: Car, title: 'Free Parking', desc: contactInfo.parking.address },
                { icon: Award, title: 'Expert Guidance', desc: 'Personal advice from Caroline' },
                { icon: Shield, title: 'Private Viewing', desc: 'Exclusive sessions available' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 1.4 + (index * 0.1) }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="flex items-center bg-Color-Light-300/10 p-6 rounded-xl border border-Color-Light-300/20 group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-Color-Light-300 rounded-full flex items-center justify-center mr-4 shadow-lg"
                  >
                    <feature.icon className="h-6 w-6 text-Color-Netural-White" />
                  </motion.div>
                  <div>
                    <h5 className="typography-h6 text-Color-Netural-White font-bold mb-1 group-hover:text-Color-Light-300 transition-colors duration-300">
                      {feature.title}
                    </h5>
                    <p className="typography-body text-Color-Light-300/80">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden rounded-2xl shadow-2xl group"
          >
            <img
              src="https://diamondsbycs.com/images/uploads/upload-656a00eee5ad1.jpeg"
              alt="Diamonds by CS Showroom"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h4 className="typography-h4 text-Color-Netural-White font-bold mb-3" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                Private Consultation
              </h4>
              <p className="typography-body text-Color-Light-300" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                Experience our collection in luxury
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('/contact')}
            className="border-2 border-Color-Light-300 text-Color-Light-300 bg-transparent font-semibold py-4 px-10 transition-all duration-300 hover:bg-Color-Light-300 hover:text-Color-Netural-Black hover:shadow-lg active:scale-95 rounded-lg focus:outline-none focus:ring-2 focus:ring-Color-Light-300 focus:ring-offset-2 flex items-center justify-center min-h-[44px]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.125rem' }}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Book Consultation
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};