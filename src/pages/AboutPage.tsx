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
  // Motion settings for "expensive" entrance feel
  const sectionVariants = {
    initial: { y: 80, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white"
    >
      {/* --- HERO: THE FIRST IMPRESSION --- */}
      <section className="relative group">
        <PageHero
          title="About Caroline"
          subtitle="The visionary artisan behind the Antwerp legacy."
          backgroundImage="https://diamondsbycs.com/images/uploads/upload-655239014d729.jpeg"
        />
        
        {/* Refined Breadcrumbs Placement */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-24 sm:pt-32 lg:pt-36 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pointer-events-auto">
            <Breadcrumbs 
              items={[{ label: 'The Artisan', icon: User }]} 
              onNavigate={onNavigate}
              className="text-white/80 hover:text-white transition-colors duration-500"
            />
          </div>
        </div>
        
        {/* Gradient Shadow to anchor the Hero to the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* --- MAIN PAGE CONTENT FLOW --- */}
      <main className="relative z-10 flex flex-col items-center">
        
        {/* Story Section: Generous vertical padding for narrative focus */}
        <motion.section 
          variants={sectionVariants} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }}
          className="w-full py-24 md:py-48 lg:py-64"
        >
          <StorySection onNavigate={onNavigate} />
        </motion.section>

        {/* Minimalist Divider */}
        <div className="w-24 h-px bg-black/[0.05]" />

        {/* Philosophy Section */}
        <motion.section 
          variants={sectionVariants} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }}
          className="w-full py-24 md:py-48 lg:py-64 bg-[#FCFAFB]"
        >
          <PhilosophySection />
        </motion.section>

        {/* Styling Advice Section */}
        <motion.section 
          variants={sectionVariants} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }}
          className="w-full py-24 md:py-48 lg:py-64"
        >
          <StylingAdviceSection onNavigate={onNavigate} />
        </motion.section>

        {/* --- FINAL CTA: THE CALL TO ACTION --- */}
        <motion.section 
          variants={sectionVariants} initial="initial" whileInView="animate" viewport={{ once: true }}
          className="w-full pb-32 md:pb-56"
        >
          <div className="max-w-6xl mx-auto px-6">
            <ContactCTA onNavigate={onNavigate} />
          </div>
        </motion.section>

      </main>

      {/* Footer safe area padding */}
      <div className="h-24 bg-white" />
    </motion.div>
  );
};