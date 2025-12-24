import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CustomSizeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomSizeRequestModal: React.FC<CustomSizeRequestModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    size: '',
    email: '',
    notes: ''
  });

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Request Custom Size</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Desired Ring Size
            </label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
              placeholder="e.g., 7.5"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
              rows={3}
              placeholder="Any special requirements..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#8B7355] text-white py-3 rounded-lg hover:bg-[#6d5a43] transition-colors"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};
