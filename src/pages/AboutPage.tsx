import React from 'react';
import { motion } from 'framer-motion';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PageHero } from '../components/PageHero';
import { StorySection } from '../components/about/StorySection';
import { PhilosophySection } from '../components/about/PhilosophySection';
import { StylingAdviceSection } from '../components/about/StylingAdviceSection';
import { ContactCTA } from '../components/about/ContactCTA';
import { User } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="overflow-hidden min-h-screen bg-Color-Netural-White"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative">
          <PageHero
            title="About Caroline"
            subtitle="Meet the artisan behind every piece"
            backgroundImage="https://diamondsbycs.com/images/uploads/upload-655239014d729.jpeg"
          />
          {/* Breadcrumbs overlay */}
          <div className="absolute top-0 left-0 right-0 z-10 pt-32 sm:pt-40">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">
              <Breadcrumbs 
                items={[
                  { label: 'About Caroline', icon: User }
                ]} 
                onNavigate={onNavigate}
                className="text-white"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Story Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <StorySection onNavigate={onNavigate} />
      </motion.div>

      {/* Philosophy Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <PhilosophySection />
      </motion.div>

      {/* Styling Advice Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <StylingAdviceSection onNavigate={onNavigate} />
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <ContactCTA onNavigate={onNavigate} />
      </motion.div>

    </motion.div>
  );
};