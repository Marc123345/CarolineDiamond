import React from 'react';
import { Phone, Mail, MapPin, Clock, Car, Navigation } from 'lucide-react';
import { contactInfo } from '../../config/siteConfig';
import { motion } from 'framer-motion';
import { GoogleMap } from '../GoogleMap';

interface ContactInfoProps {
  onNavigate: (page: string) => void;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-Color-Netural-White">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">

        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="typography-h2 text-Color-Dark-500 mb-4">
            Get in <span className="text-Color-Light-300">Touch</span>
          </h2>
          <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
            We're here to help you create the perfect jewelry piece. Fill out the form below and we'll respond within 24 hours.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Left Column: Contact Details */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Contact Methods */}
            <div className="bg-white rounded-xl shadow-lg border border-Color-Light-300/20 p-6 space-y-4">
              <h3 className="typography-h5 text-Color-Dark-500 mb-6">Contact Information</h3>

              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-Color-Secondary/30 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 bg-Color-Light-300 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-5 w-5 text-Color-Netural-White" />
                </div>
                <div>
                  <h4 className="typography-body font-semibold text-Color-Dark-500 mb-1">Phone</h4>
                  <p className="typography-body text-Color-Gray-700">{contactInfo.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-Color-Secondary/30 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 bg-Color-Light-300 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-5 w-5 text-Color-Netural-White" />
                </div>
                <div>
                  <h4 className="typography-body font-semibold text-Color-Dark-500 mb-1">Email</h4>
                  <p className="typography-body text-Color-Gray-700">{contactInfo.email}</p>
                </div>
              </a>

              <div className="flex items-start space-x-4 p-4 rounded-lg">
                <div className="w-10 h-10 bg-Color-Light-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-Color-Netural-White" />
                </div>
                <div>
                  <h4 className="typography-body font-semibold text-Color-Dark-500 mb-1">Address</h4>
                  <p className="typography-body text-Color-Gray-700">
                    {contactInfo.address.street}<br />
                    {contactInfo.address.postalCode} {contactInfo.address.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-lg border border-Color-Light-300/20 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-Color-Light-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-Color-Netural-White" />
                </div>
                <div>
                  <h4 className="typography-body font-semibold text-Color-Dark-500 mb-2">Business Hours</h4>
                  <p className="typography-body text-Color-Gray-700">{contactInfo.hours}</p>
                </div>
              </div>
            </div>

            {/* Parking Information */}
            <div className="bg-Color-Secondary/30 rounded-xl border border-Color-Light-300/20 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-Color-Light-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <Car className="h-5 w-5 text-Color-Netural-White" />
                </div>
                <div>
                  <h4 className="typography-body font-semibold text-Color-Dark-500 mb-2">Free Parking</h4>
                  <p className="typography-body text-Color-Gray-700 mb-2">
                    {contactInfo.parking.address}<br />
                    {contactInfo.address.postalCode} {contactInfo.address.city}
                  </p>
                  <p className="typography-caption text-Color-Light-300 italic">
                    Please let us know in advance to reserve a spot
                  </p>
                </div>
              </div>
            </div>

            {/* Certification Logos */}
            <div className="bg-white rounded-xl shadow-lg border border-Color-Light-300/20 p-6">
              <h4 className="typography-body font-semibold text-Color-Dark-500 mb-4 text-center">
                Official Certification
              </h4>
              <div className="flex items-center justify-center gap-4">
                {[
                  { name: 'HRD', logo: 'https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2024.svg?updatedAt=1757411304217' },
                  { name: 'GIA', logo: 'https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2025.svg?updatedAt=1757411304418' },
                  { name: 'IGI', logo: 'https://ik.imagekit.io/qcvroy8xpd/Wedding%20Rings/ENGAGEMENT%20RINGSSS/asset%2026.svg?updatedAt=1757411303262' }
                ].map((cert, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm border border-Color-Light-300/20"
                  >
                    <img
                      src={cert.logo}
                      alt={`${cert.name} Certificate`}
                      className="w-14 h-14 object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-xl border border-Color-Light-300/20 p-8">
              <h3 className="typography-h4 text-Color-Dark-500 mb-2">
                Send us a Message
              </h3>
              <p className="typography-body text-Color-Gray-700 mb-8">
                Fill out the form and we'll get back to you within 24 hours to schedule your personal consultation.
              </p>

              <div className="w-full overflow-hidden">
                <iframe
                  id="JotFormIFrame-252893068974474"
                  title="General Inquiry Contact Form"
                  onLoad={() => window.parent.scrollTo(0,0)}
                  allow="geolocation; microphone; camera; fullscreen; payment"
                  src="https://form.jotform.com/252893068974474"
                  frameBorder="0"
                  style={{
                    width: '100%',
                    minWidth: '100%',
                    maxWidth: '100%',
                    height: '1200px',
                    border: 'none',
                    overflow: 'hidden'
                  }}
                  scrolling="no"
                />
              </div>
              <script src='https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js'></script>
              <script dangerouslySetInnerHTML={{
                __html: `window.jotformEmbedHandler("iframe[id='JotFormIFrame-252893068974474']", "https://form.jotform.com/")`
              }} />
            </div>
          </motion.div>
        </div>

        {/* Google Map Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="typography-h3 text-Color-Dark-500 mb-4">
              Visit Our <span className="text-Color-Light-300">Showroom</span>
            </h3>
            <p className="typography-body text-Color-Gray-700 max-w-2xl mx-auto">
              Located in the heart of Antwerp's diamond district. Experience our collection in person.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <GoogleMap className="h-[500px]" />
            </div>

            {/* Directions Info */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg border border-Color-Light-300/20 p-6">
                <h4 className="typography-h5 text-Color-Dark-500 mb-4">How to Find Us</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-Color-Light-300 flex-shrink-0 mt-1" />
                    <div>
                      <p className="typography-body-sm font-semibold text-Color-Dark-500">Showroom Address</p>
                      <p className="typography-body-sm text-Color-Gray-700">
                        {contactInfo.address.street}<br />
                        {contactInfo.address.postalCode} {contactInfo.address.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Car className="h-5 w-5 text-Color-Light-300 flex-shrink-0 mt-1" />
                    <div>
                      <p className="typography-body-sm font-semibold text-Color-Dark-500">By Car</p>
                      <p className="typography-body-sm text-Color-Gray-700">
                        Free parking at {contactInfo.parking.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Navigation className="h-5 w-5 text-Color-Light-300 flex-shrink-0 mt-1" />
                    <div>
                      <p className="typography-body-sm font-semibold text-Color-Dark-500">Public Transport</p>
                      <p className="typography-body-sm text-Color-Gray-700">
                        10 min walk from Antwerpen-Centraal Station
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Schupstraat+9-11+Antwerpen+Belgium"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center border-2 border-Color-Light-300 text-Color-Light-300 bg-Color-Dark-500 font-semibold py-4 px-6 transition-all duration-300 hover:bg-Color-Light-300 hover:text-Color-Netural-White rounded-lg shadow-lg hover:shadow-xl"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Get Directions
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
