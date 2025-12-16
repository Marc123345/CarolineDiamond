import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getUserProfile, updateUserProfile, getOrCreateUserProfile } from '../lib/userProfileDb';

interface AccountSettingsPageProps {
  onNavigate: (page: string) => void;
}

export const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      setLoading(true);
      const { data: profile, error: profileError } = await getOrCreateUserProfile(user.id);

      if (profileError) {
        setError('Failed to load profile');
        console.error('Profile load error:', profileError);
      } else if (profile) {
        setFullName(profile.full_name || '');
        setPhone(profile.phone || '');
      }

      setLoading(false);
    };

    loadProfile();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    setError('');
    setSuccess('');

    const { error: updateError } = await updateUserProfile(user.id, {
      full_name: fullName,
      phone: phone
    });

    if (updateError) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', updateError);
    } else {
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-Color-Netural-White py-20 sm:py-32 lg:py-40">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex items-center justify-center py-20">
            <Loader className="h-8 w-8 animate-spin text-Color-Light-300" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-Color-Netural-White py-20 sm:py-32 lg:py-40">
      <div className="max-w-3xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="mb-12">
          <Breadcrumbs
            items={[
              { label: 'Account Settings', icon: User }
            ]}
            onNavigate={onNavigate}
          />
        </div>

        <div className="bg-white border border-Color-Rich-Gray/10 p-8">
          <h1 className="font-serif text-h2 text-Color-Dark-500 mb-8">Account Settings</h1>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-Color-Rich-Gray mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-Color-Rich-Gray" />
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-12 pr-4 py-3 border border-Color-Rich-Gray/30 bg-Color-Netural-White text-Color-Rich-Gray cursor-not-allowed rounded"
                />
              </div>
              <p className="mt-1 text-xs text-Color-Rich-Gray">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-Color-Rich-Gray mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-Color-Rich-Gray" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-Color-Rich-Gray/30 bg-white text-Color-Dark-500 focus:outline-none focus:ring-2 focus:ring-Color-Light-300 rounded"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-Color-Rich-Gray mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-Color-Rich-Gray" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-Color-Rich-Gray/30 bg-white text-Color-Dark-500 focus:outline-none focus:ring-2 focus:ring-Color-Light-300 rounded"
                  placeholder="+32 123 456 789"
                />
              </div>
              <p className="mt-1 text-xs text-Color-Rich-Gray">Optional - for order updates and notifications</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-Color-Light-300 text-white font-medium hover:bg-Color-Light-Dark transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
