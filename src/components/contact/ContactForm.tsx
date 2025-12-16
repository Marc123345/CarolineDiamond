import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, User, MessageSquare, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactFormProps {
  onNavigate?: (page: string) => void;
  onSubmit?: (formData: any) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onNavigate, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    appointmentType: 'showroom'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Enhanced form submitted:', formData);
      if (onSubmit) {
        onSubmit(formData);
      }
      
      setSubmitStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          preferredContact: 'email',
          appointmentType: 'showroom'
        });
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-Color-Light-300 mr-3" />
            <h4 className="typography-h6 text-Color-Dark-500 font-semibold">Persoonlijke Gegevens</h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block typography-body font-medium text-Color-Dark-500 mb-3">
                Volledige Naam *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Uw voor- en achternaam"
className="w-full px-4 py-3.5 text-base border-2 border-Color-Light-300 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300 bg-surface hover:border-Color-Light-300 outline-none min-h-[48px]"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block typography-body font-medium text-Color-Dark-500 mb-3">
                Email Adres *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="uw.email@example.com"
className="w-full px-4 py-3.5 text-base border-2 border-Color-Light-300 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300 bg-surface hover:border-Color-Light-300 outline-none min-h-[48px]"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="phone" className="block typography-body font-medium text-Color-Dark-500 mb-3">
              Telefoonnummer
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+32 xxx xx xx xx"
              className="w-full px-4 py-4 border-2 border-Color-Light-300 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300 bg-surface hover:border-Color-Light-300 outline-none"
            />
          </div>
        </motion.div>

        {/* Contact Preferences */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center mb-4">
            <MessageSquare className="h-5 w-5 text-Color-Light-300 mr-3" />
            <h4 className="typography-h6 text-Color-Dark-500 font-semibold">Contact Voorkeuren</h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="subject" className="block typography-body font-medium text-Color-Dark-500 mb-3">
                Onderwerp *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 border-2 border-Color-Light-300 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300 bg-surface hover:border-Color-Light-300 outline-none cursor-pointer"
              >
                <option value="">Selecteer een onderwerp</option>
                <option value="engagement">Verlovingsringen</option>
                <option value="wedding">Trouwringen</option>
                <option value="custom">Maatwerk Design</option>
                <option value="memorial">Memorial Sieraden</option>
                <option value="everyday">Dagelijkse Juwelen</option>
                <option value="repair">Reparatie Service</option>
                <option value="consultation">Algemene Consultatie</option>
                <option value="other">Anders</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="preferredContact" className="block typography-body font-medium text-Color-Dark-500 mb-3">
                Voorkeur Contact
              </label>
              <select
                id="preferredContact"
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
                className="w-full px-4 py-4 border-2 border-Color-Light-300 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300 bg-surface hover:border-Color-Light-300 outline-none cursor-pointer"
              >
                <option value="email">Email</option>
                <option value="phone">Telefoon</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Appointment Type */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-Color-Light-300 mr-3" />
            <h4 className="typography-h6 text-Color-Dark-500 font-semibold">Afspraak Type</h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { value: 'showroom', label: 'Showroom Bezoek', desc: 'Persoonlijke consultatie in Antwerpen' },
              { value: 'video', label: 'Video Call', desc: 'Online consultatie via video' }
            ].map((option) => (
              <label
                key={option.value}
                className={`relative flex items-start p-6 border-2 cursor-pointer rounded-xl transition-all duration-300 hover:shadow-lg ${
                  formData.appointmentType === option.value
                    ? 'border-Color-Light-300 bg-Color-Light-300/10 shadow-lg'
                    : 'border-Color-Light-Dark/50 bg-Color-Netural-White hover:border-Color-Light-Dark'
                }`}
              >
                <input
                  type="radio"
                  name="appointmentType"
                  value={option.value}
                  checked={formData.appointmentType === option.value}
                  onChange={handleChange}
                  className="mt-1 mr-4 w-5 h-5 text-Color-Light-300 border-Color-Light-300 focus:ring-Color-Light-300"
                />
                <div className="flex-1">
                  <h5 className="typography-body font-semibold text-Color-Dark-500 mb-1">
                    {option.label}
                  </h5>
                  <p className="typography-caption text-Color-Gray-700">
                    {option.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Message */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <label htmlFor="message" className="block typography-body font-medium text-Color-Dark-500 mb-3">
            Uw Bericht *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Vertel ons over uw juwelen wensen, budget, tijdlijn, of stel uw vragen..."
            rows={6}
            className="w-full px-4 py-4 border-2 border-Color-Light-300 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300 bg-white hover:border-Color-Light-300 outline-none resize-none"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-4"
        >
          {submitStatus === 'success' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-50 border border-green-200 p-6 rounded-xl text-center"
            >
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="typography-h6 text-green-800 mb-2">Bericht Verzonden!</h4>
              <p className="typography-body text-green-600">
                Bedankt voor uw bericht. We nemen binnen 24 uur contact met u op.
              </p>
            </motion.div>
          ) : submitStatus === 'error' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 border border-red-200 p-6 rounded-xl text-center"
            >
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h4 className="typography-h6 text-red-800 mb-2">Fout Opgetreden</h4>
              <p className="typography-body text-red-600 mb-4">
                Er is een probleem opgetreden. Probeer het opnieuw of neem direct contact op.
              </p>
              <button
                type="button"
                onClick={() => setSubmitStatus('idle')}
                className="btn-secondary"
              >
                Probeer Opnieuw
              </button>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full btn-primary flex items-center justify-center py-4 px-8 text-lg ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-b-2 border-white mr-3"></div>
                  Verzenden...
                </>
              ) : (
                <>
                  <Send className="mr-3 h-5 w-5" />
                  Verstuur Bericht
                </>
              )}
            </motion.button>
          )}
          
          <p className="typography-caption text-Color-Gray-700 text-center mt-4">
            * Verplichte velden. We respecteren uw privacy en delen uw gegevens nooit.
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
};