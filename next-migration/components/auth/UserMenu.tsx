'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface UserMenuProps {
  isTransparent?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isTransparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push('/');
  };

  const getUserInitials = () => {
    const fullName = user?.user_metadata?.full_name || user?.email || 'U';
    return fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center ${
          isTransparent
            ? 'text-[#CDBCAB] hover:text-white hover:bg-white/10'
            : 'text-Color-Rich-Gray hover:text-Color-Dark-500 hover:bg-Color-Light-300/10'
        }`}
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-Color-Light-300 text-white flex items-center justify-center text-sm font-medium">
          {getUserInitials()}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-Color-Netural-White shadow-2xl border border-Color-Rich-Gray/10 z-50 rounded-xl overflow-hidden">
          <div className="flex flex-col">
            {/* User Info Header */}
            <div className="flex-none p-4 border-b border-Color-Rich-Gray/10">
              <p className="font-medium text-Color-Dark-500 truncate">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-sm text-Color-Rich-Gray truncate">{user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="flex-1 flex-shrink-0 py-2">
              <a
                href="https://uyccca-1e.myshopify.com/account"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 text-left text-Color-Rich-Gray hover:bg-Color-Light-300/10 hover:text-Color-Dark-500 transition-colors flex items-center gap-3 flex-none"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBag className="flex-none h-5 w-5" />
                <span className="flex-1 flex-shrink-0">My Orders</span>
              </a>

              <a
                href="https://uyccca-1e.myshopify.com/account"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 text-left text-Color-Rich-Gray hover:bg-Color-Light-300/10 hover:text-Color-Dark-500 transition-colors flex items-center gap-3 flex-none"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="flex-none h-5 w-5" />
                <span className="flex-1 flex-shrink-0">Account Settings</span>
              </a>
            </div>

            {/* Sign Out */}
            <div className="flex-none border-t border-Color-Rich-Gray/10 py-2">
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 flex-none"
              >
                <LogOut className="flex-none h-5 w-5" />
                <span className="flex-1 flex-shrink-0">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
