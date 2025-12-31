import React, { useState } from 'react';
import { X, Sparkles, Mail, Phone, User, DollarSign, MessageSquare, Check } from 'lucide-react';
import { createCustomSizeRequest, CreateCustomSizeRequestInput } from '../../lib/customSizeDb'; // Adjusted path
import { CLARITY_GRADES, CERTIFICATIONS, ALL_SHAPES, METAL_COLORS } from '../../config/filterConfig'; // Adjusted path
import { useAuth } from '../../context/AuthContext'; // Adjusted path

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    if (formData.desired_carat <= 0 || formData.desired_carat > 20) {
      setError('Carat weight must be between 0.1 and 20');
      setLoading(false);
      return;
    }

    try {
      const { data, error: dbError } = await createCustomSizeRequest(formData);

      if (dbError || !data) {
        setError(dbError?.message || 'Failed to submit request');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        // Reset form
        setFormData({
          email: user?.email || '',
          phone: '',
          customer_name: user?.user_metadata?.full_name || '',
          desired_carat: 1.0,
          clarity_grade: '',
          certification: undefined,
          shape: '',
          metal_color: '',
          ring_style: '',
          ring_size: '',
          budget_min: undefined,
          budget_max: undefined,
          additional_notes: '',
        });
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const incrementCarat = () => {
    setFormData(prev => ({
      ...prev,
      desired_carat: Math.min(20, prev.desired_carat + 0.1),
    }));
  };

  const decrementCarat = () => {
    setFormData(prev => ({
      ...prev,
      desired_carat: Math.max(0.1, prev.desired_carat - 0.1),
    }));
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center animate-scale-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-Color-Netural-Black mb-2">
            Request Submitted!
          </h3>
          <p className="text-gray-600 mb-4">
            We've received your custom size request. Our team will review your specifications and contact you within 24 hours with a personalized quote.
          </p>
          <p className="text-sm text-gray-500">
            Check your email at <span className="font-semibold">{formData.email}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8 animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-Color-Champagne-Gold to-Color-Primary-Beige p-6 rounded-t-2xl z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Custom Lab-Grown Diamond</h2>
              <p className="text-white/90 text-sm mt-1">
                Tell us your dream specifications and we'll create it for you
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-Color-Netural-Black">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-Color-Champagne-Gold transition-colors"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-Color-Champagne-Gold transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-Color-Champagne-Gold transition-colors"
                  placeholder="+31 123 456 789"
                />
              </div>
            </div>
          </div>

          {/* Diamond Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-Color-Netural-Black">Diamond Specifications</h3>

            {/* Carat Weight */}
            <div>
              <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
                Desired Carat Weight *
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={decrementCarat}
                  className="w-12 h-12 bg-gray-100 rounded-lg text-Color-Netural-Black font-bold hover:bg-Color-Champagne-Gold hover:text-white transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="20"
                  value={formData.desired_carat}
                  onChange={(e) => setFormData({ ...formData, desired_carat: parseFloat(e.target.value) || 0 })}
                  className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-lg text-center text-lg font-bold focus:outline-none focus:border-Color-Champagne-Gold transition-colors"
                />
                <button
                  type="button"
                  onClick={incrementCarat}
                  className="w-12 h-12 bg-gray-100 rounded-lg text-Color-Netural-Black font-bold hover:bg-Color-Champagne-Gold hover:text-white transition-colors"
                >
                  +
                </button>
                <span className="text-sm text-gray-500 font-medium">ct</span>
              </div>
            </div>

            {/* Shape */}
            <div>
              <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
                Shape (Optional)
              </label>
              <select
                value={formData.shape}
                onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-Color-Champagne-Gold transition-colors"
              >
                <option value="">Select shape</option>
                {ALL_SHAPES.map(shape => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Clarity */}
              <div>
                <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
                  Clarity Grade (Optional)
                </label>
                <select
                  value={formData.clarity_grade}
                  onChange={(e) => setFormData({ ...formData, clarity_grade: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-Color-Champagne-Gold transition-colors"
                >
                  <option value="">Select clarity</option>
                  {CLARITY_GRADES.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              {/* Certification */}
              <div>
                <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
                  Certification (Optional)
                </label>
                <select
                  value={formData.certification || ''}
                  onChange={(e) => setFormData({ ...formData, certification: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-Color-Champagne-Gold transition-colors"
                >
                  <option value="">Select certification</option>
                  {CERTIFICATIONS.map(cert => (
                    <option key={cert} value={cert}>{cert}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Ring Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-Color-Netural-Black">Ring Specifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Metal Color */}
              <div>
                <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
                  Metal Color (Optional)
                </label>
                <select
                  value={formData.metal_color}
                  onChange={(e) => setFormData({ ...formData, metal_color: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-Color-Champagne-Gold transition-colors"
                >
                  <option value="">Select metal color</option>
                  {METAL_COLORS.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* Ring Size */}
              <div>
                <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
                  Ring Size (Optional)
                </label>
                <input
                  type="text"
                  value={formData.ring_size}
                  onChange={(e) => setFormData({ ...formData, ring_size: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-Color-Champagne-Gold transition-colors"
                  placeholder="e.g., 54, 56, 58"
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-Color-Netural-Black">Budget Range (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
                  Minimum Budget (€)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={formData.budget_min || ''}
                    onChange={(e) => setFormData({ ...formData, budget_min: parseFloat(e.target.value) || undefined })}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-Color-Champagne-Gold transition-colors"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
                  Maximum Budget (€)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={formData.budget_max || ''}
                    onChange={(e) => setFormData({ ...formData, budget_max: parseFloat(e.target.value) || undefined })}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-Color-Champagne-Gold transition-colors"
                    placeholder="5000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-Color-Netural-Black mb-2">
              Additional Notes (Optional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.additional_notes}
                onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                rows={4}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-Color-Champagne-Gold transition-colors resize-none"
                placeholder="Any special requests, preferences, or questions?"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-gray-200 text-Color-Netural-Black rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-Color-Champagne-Gold text-white rounded-lg font-semibold hover:bg-Color-Netural-Black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};