import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PageHero } from '../components/PageHero';
import { GoogleMap } from '../components/GoogleMap';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

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

      {/* Contact Information */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-light mb-8">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-neutral-600 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Visit Our Showroom</h3>
                  <p className="text-neutral-600">Diamonds by Caroline Schonewille</p>
                  <p className="text-neutral-600">Amsterdam, Netherlands</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-neutral-600 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Call Us</h3>
                  <p className="text-neutral-600">+31 6 12345678</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-neutral-600 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Email Us</h3>
                  <p className="text-neutral-600">info@diamondsbycs.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-neutral-600 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Opening Hours</h3>
                  <p className="text-neutral-600">By Appointment Only</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <GoogleMap />
          </div>
        </div>
      </div>
    </div>
  );
};