import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PageHero } from '../components/PageHero';
import { ContactInfo } from '../components/contact/ContactInfo';
import { MapPin } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {

  return (
    <div className="bg-Color-Netural-White">
      <div className="relative">
        <PageHero 
          title="Let's Create Together"
          subtitle="Contact"
          backgroundImage="https://diamondsbycs.com/images/uploads/upload-656f1b6c4faa8.jpeg"
        />
        {/* Breadcrumbs overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 pt-32 sm:pt-40">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">
            <Breadcrumbs 
              items={[
                { label: 'Contact & Showroom', icon: MapPin }
              ]} 
              onNavigate={onNavigate}
              className="text-white"
            />
          </div>
        </div>
      </div>
      
      {/* Contact Information and Form */}
      <ContactInfo onNavigate={onNavigate} />
    </div>
  );
};