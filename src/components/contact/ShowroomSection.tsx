import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  MapPin,
  Clock,
  Car,
  Train,
  Coffee,
  Shield,
  Award,
  Heart,
  Calendar,
  Phone,
  Navigation,
  Gem,
  Palette
} from 'lucide-react';
import { contactInfo } from '../../config/siteConfig';
import { GoogleMap } from '../GoogleMap';

interface ShowroomSectionProps {
  onNavigate?: (path: string) => void;
}

export const ShowroomSection: React.FC<ShowroomSectionProps> = ({ onNavigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-20 sm:py-32 lg:py-40 xl:py-48 bg-gradient-to-br from-Color-Netural-Black via-Color-Dark-500 to-Color-Netural-Black text-Color-Netural-White relative overflow-hidden">
      {/* Background floating shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -25, 0], rotate: [0, 15, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-1/4 w-40 h-40 bg-gradient-to-br from-Color-Light-300/15 to-Color-Light-300/5 rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -12, 0], scale: [1, 0.85, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-24 left-1/4 w-32 h-32 bg-gradient-to-br from-Color-Light-300/12 to-Color-Light-300/4 rounded-full"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">
        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-8"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={inView ? { width: "64px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-[2px] bg-Color-Light-300 mr-4"
            />
            <span className="typography-caption uppercase tracking-[0.2em] text-Color-Light-300 font-medium">
              Antwerp Experience
            </span>
            <motion.div 
              initial={{ width: 0 }}
              animate={inView ? { width: "64px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-[2px] bg-Color-Light-300 ml-4"
            />
          </motion.div>
          
          <h2 className="typography-h2 text-Color-Netural-White mb-8 relative">
            Visit Our <span className="text-Color-Light-300">Showroom</span>
          </h2>
          
          {/* Unifying Element */}
          <motion.div 
            initial={{ width: 0 }}
            animate={inView ? { width: "160px" } : { width: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
          />
          
          <p className="typography-body-xl text-Color-Light-300 max-w-4xl mx-auto leading-relaxed">
            Experience our jewelry collection in person at our elegant showroom in the heart of Antwerp's diamond district.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Details */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Location Card */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-Color-Light-300/20 to-Color-Light-300/10 p-8 rounded-2xl border border-Color-Light-300/30 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-Color-Light-300 rounded-full flex items-center justify-center shadow-lg mr-4"
                  >
                    <MapPin className="h-6 w-6 text-Color-Netural-White" />
                  </motion.div>
                  <h3 className="typography-h5 text-Color-Netural-White font-bold">Showroom Locatie</h3>
                </div>
                <div className="space-y-3 typography-body-lg text-Color-Light-300">
                  <p className="font-semibold">{contactInfo.address.street}</p>
                  <p>{contactInfo.address.postalCode} {contactInfo.address.city}</p>
                  <p className="typography-body text-Color-Light-300/80">Hart van het diamantkwartier</p>
                </div>
              </div>
            </motion.div>

            {/* Hours + Transportation */}
            <div className="grid gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-r from-Color-Light-300/20 to-Color-Light-300/10 p-6 rounded-xl border border-Color-Light-300/30"
              >
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-Color-Light-300 mr-3" />
                  <h4 className="typography-h6 text-Color-Netural-White font-bold">Openingstijden</h4>
                </div>
                <p className="typography-body text-Color-Light-300 font-semibold">{contactInfo.hours}</p>
                <p className="typography-caption text-Color-Light-300/80">
                  Flexibele afspraken mogelijk voor uw gemak
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-r from-Color-Light-300/20 to-Color-Light-300/10 p-6 rounded-xl border border-Color-Light-300/30"
              >
                <div className="flex items-center mb-4">
                  <Navigation className="h-6 w-6 text-Color-Light-300 mr-3" />
                  <h4 className="typography-h6 text-Color-Netural-White font-bold">Bereikbaarheid</h4>
                </div>
                <div className="space-y-3">
                  <p className="flex items-center typography-body text-Color-Light-300">
                    <Car className="h-4 w-4 mr-3 text-Color-Light-300" /> 
                    Gratis parkeren - {contactInfo.parking.address}
                  </p>
                  <p className="flex items-center typography-body text-Color-Light-300">
                    <Train className="h-4 w-4 mr-3 text-Color-Light-300" /> 
                    10 min lopen vanaf Centraal Station
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Map */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8"
          >
            <GoogleMap className="h-[500px]" />

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-Color-Light-300/20 to-Color-Light-300/10 p-6 rounded-xl border border-Color-Light-300/30"
            >
              <h4 className="typography-h6 text-Color-Netural-White font-bold mb-4">Plan Your Visit</h4>
              <p className="typography-body text-Color-Light-300 mb-4">
                Located in the heart of Antwerp's diamond district, our showroom offers a luxurious and private consultation experience.
              </p>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Schupstraat+9-11+Antwerpen+Belgium"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border-2 border-Color-Light-300 text-Color-Light-300 bg-transparent font-semibold py-3 px-6 transition-all duration-300 hover:bg-Color-Light-300 hover:text-Color-Netural-Black rounded-lg"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Get Directions
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
