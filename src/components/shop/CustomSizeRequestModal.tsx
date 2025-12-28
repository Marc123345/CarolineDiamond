import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Mail, Phone, User, Euro, 
  MessageSquare, Check, Gem, ArrowRight, Minus, Plus 
} from 'lucide-react';
import { createCustomSizeRequest, CreateCustomSizeRequestInput } from '../../lib/customSizeDb';
import { CLARITY_GRADES, CERTIFICATIONS, ALL_SHAPES, METAL_COLORS } from '../../config/filterConfig';
import { useAuth } from '../../context/AuthContext';

interface CustomSizeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledData?: Partial<CreateCustomSizeRequestInput>;
}

export const CustomSizeRequestModal: React.FC<CustomSizeRequestModalProps> = ({
  isOpen,
  onClose,
  prefilledData,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateCustomSizeRequestInput>({
    email: user?.email || prefilledData?.email || '',
    phone: prefilledData?.phone || '',
    customer_name: user?.user_metadata?.full_name || prefilledData?.customer_name || '',
    desired_carat: prefilledData?.desired_carat || 1.0,
    clarity_grade: prefilledData?.clarity_grade || '',
    certification: prefilledData?.certification,
    shape: prefilledData?.shape || '',
    metal_color: prefilledData?.metal_color || '',
    ring_style: prefilledData?.ring_style || '',
    ring_size: prefilledData?.ring_size || '',
    budget_min: prefilledData?.budget_min,
    budget_max: prefilledData?.budget_max,
    additional_notes: prefilledData?.additional_notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email) { setError('Email is required'); setLoading(false); return; }

    try {
      const { data, error: dbError } = await createCustomSizeRequest(formData);
      if (dbError) throw dbError;
      setSuccess(true);
      setTimeout(() => { onClose(); setSuccess(false); }, 3000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-Color-Dark-500/60 backdrop-blur-xl"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative w-full max-w-4xl bg-white shadow-[0_50px_100px_rgba(0,0,0,0.3)] rounded-sm overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* --- LEFT: ATELIER SIDEBAR --- */}
            <div className="hidden md:flex md:w-1/3 bg-Color-Dark-500 p-10 flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              <Gem className="absolute -right-12 -top-12 w-48 h-48 text-Color-Champagne-Gold/10 rotate-12" />
              
              <div className="relative z-10">
                <Sparkles className="w-8 h-8 text-Color-Champagne-Gold mb-6" />
                <h2 className="text-3xl font-serif text-white leading-tight mb-4">The Custom <br />Selection</h2>
                <p className="text-xs uppercase tracking-[0.3em] text-Color-Light-300 font-bold">Guided Atelier</p>
              </div>

              <div className="relative z-10 space-y-6">
                <div className="h-px w-12 bg-Color-Champagne-Gold" />
                <p className="text-sm text-Color-Light-300/60 leading-relaxed italic">
                  "Every masterpiece begins with a vision. Tell us yours, and our Antwerp master artisans will bring it to life."
                </p>
              </div>
            </div>

            {/* --- RIGHT: THE CONSULTATION FORM --- */}
            <div className="flex-1 flex flex-col bg-[#FAF9F6] overflow-hidden">
              <header className="p-6 border-b border-black/5 flex items-center justify-between">
                 <span className="text-[10px] uppercase tracking-[0.4em] font-black text-Color-Light-300">Specifications Ledger</span>
                 <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </header>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 no-scrollbar">
                
                {/* Section 1: Identity */}
                <motion.section variants={itemVars} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="space-y-6">
                  <h3 className="text-sm uppercase tracking-widest font-black text-Color-Dark-500 border-b border-black/5 pb-2">01. Your Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400">Full Name</label>
                      <input 
                        required
                        value={formData.customer_name}
                        onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                        className="w-full bg-transparent border-b border-black/10 focus:border-Color-Champagne-Gold outline-none py-2 font-serif text-lg transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400">Digital Address</label>
                      <input 
                        type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-transparent border-b border-black/10 focus:border-Color-Champagne-Gold outline-none py-2 font-serif text-lg transition-colors" 
                      />
                    </div>
                  </div>
                </motion.section>

                {/* Section 2: The Gem Specifications */}
                <motion.section variants={itemVars} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="space-y-8">
                  <h3 className="text-sm uppercase tracking-widest font-black text-Color-Dark-500 border-b border-black/5 pb-2">02. Gemstone Blueprint</h3>
                  
                  {/* Carat Stepper */}
                  <div className="flex flex-col items-center gap-4 py-6 bg-white border border-black/5 rounded-sm">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-Color-Light-300">Desired Carat Weight</label>
                    <div className="flex items-center gap-10">
                      <button type="button" onClick={() => setFormData(p => ({...p, desired_carat: Math.max(0.1, p.desired_carat - 0.1)}))} className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Minus className="w-4 h-4"/></button>
                      <span className="text-5xl font-serif italic text-Color-Dark-500">{formData.desired_carat.toFixed(1)}<span className="text-sm uppercase font-bold not-italic ml-2 tracking-widest opacity-30">ct</span></span>
                      <button type="button" onClick={() => setFormData(p => ({...p, desired_carat: Math.min(20, p.desired_carat + 0.1)}))} className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Plus className="w-4 h-4"/></button>
                    </div>
                  </div>

                  {/* Visual Shape Selection */}
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400">Select Shape</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {ALL_SHAPES.map(s => (
                        <button
                          key={s} type="button"
                          onClick={() => setFormData({...formData, shape: s})}
                          className={`py-3 px-1 border transition-all duration-500 flex flex-col items-center gap-2 ${formData.shape === s ? 'border-Color-Dark-500 bg-Color-Dark-500 text-white' : 'border-black/5 hover:border-Color-Champagne-Gold text-Color-Dark-500'}`}
                        >
                          <Gem className={`w-4 h-4 ${formData.shape === s ? 'text-Color-Champagne-Gold' : 'opacity-20'}`} />
                          <span className="text-[9px] uppercase tracking-tighter font-black">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* Section 3: Setting & Investment */}
                <motion.section variants={itemVars} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="space-y-8 pb-10">
                  <h3 className="text-sm uppercase tracking-widest font-black text-Color-Dark-500 border-b border-black/5 pb-2">03. Setting & Investment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400">Metal Preference</label>
                       <div className="flex gap-3">
                         {METAL_COLORS.map(color => (
                           <button 
                            key={color} type="button"
                            onClick={() => setFormData({...formData, metal_color: color})}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${formData.metal_color === color ? 'border-Color-Champagne-Gold scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
                            style={{ backgroundColor: color.toLowerCase().includes('rose') ? '#E7C1B1' : color.toLowerCase().includes('white') ? '#E5E7EB' : '#F3CF7A' }}
                           />
                         ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400">Investment Range (€)</label>
                      <div className="flex items-center gap-4">
                        <input placeholder="Min" type="number" onChange={(e) => setFormData({...formData, budget_min: Number(e.target.value)})} className="w-full bg-transparent border-b border-black/10 focus:border-Color-Champagne-Gold outline-none py-2 text-sm" />
                        <ArrowRight className="w-3 h-3 opacity-20" />
                        <input placeholder="Max" type="number" onChange={(e) => setFormData({...formData, budget_max: Number(e.target.value)})} className="w-full bg-transparent border-b border-black/10 focus:border-Color-Champagne-Gold outline-none py-2 text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400">Additional Aspirations</label>
                    <textarea 
                      rows={3}
                      value={formData.additional_notes}
                      onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                      placeholder="Share any specific design references or stories..."
                      className="w-full bg-white border border-black/5 p-4 outline-none focus:border-Color-Champagne-Gold transition-colors text-sm resize-none"
                    />
                  </div>
                </motion.section>

                {/* Submit */}
                <footer className="sticky bottom-0 bg-[#FAF9F6] pt-6 pb-2">
                  <button 
                    disabled={loading}
                    className="w-full group relative overflow-hidden bg-Color-Dark-500 text-white py-6 uppercase text-xs tracking-[0.5em] font-black hover:bg-black transition-all"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {loading ? 'Transmitting Specs...' : 'Initialize Commission'}
                      <Check className={`w-4 h-4 transition-all ${loading ? 'animate-pulse' : 'group-hover:translate-x-1'}`} />
                    </span>
                    <div className="absolute inset-0 bg-Color-Champagne-Gold translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                  </button>
                  {error && <p className="text-center text-red-500 text-[10px] uppercase font-bold mt-4 tracking-widest">{error}</p>}
                </footer>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success View */}
      {success && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[300] bg-Color-Dark-500 flex items-center justify-center p-8 text-center"
        >
          <div className="max-w-md space-y-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-20 h-20 bg-Color-Champagne-Gold rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-4xl font-serif text-white">Request Sealed</h3>
            <p className="text-Color-Light-300/60 leading-relaxed font-light">
              Your specifications have been transmitted to our Antwerp studio. A master consultant will reach out via <span className="text-white font-medium">{formData.email}</span> within 24 hours.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};