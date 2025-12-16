import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { CarolineSection } from '../components/CarolineSection';
import { ShopByCategory } from '../components/ShopByCategory';
import { ShopByShape } from '../components/ShopByShape';
import { CustomerStoriesSection } from '../components/CustomerStoriesSection';
import { ContactCTASection } from '../components/ContactCTASection';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden min-h-screen bg-white"
      >
      {/* Hero Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Hero onNavigate={onNavigate} />
      </motion.div>

      {/* Shop by Shape */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <ShopByShape onNavigate={onNavigate} />
      </motion.div>

      {/* Brand Story (Caroline) */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <CarolineSection onNavigate={onNavigate} />
      </motion.div>

      {/* Shop by Category */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <ShopByCategory onNavigate={onNavigate} />
      </motion.div>

      {/* Customer Stories */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <CustomerStoriesSection onNavigate={onNavigate} />
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <ContactCTASection onNavigate={onNavigate} />
      </motion.div>
      </motion.div>
    </>
  );
};