import React from 'react';
import { ShopPage } from './ShopPage';

interface WeddingRingsPageProps {
  onNavigate: (page: string) => void;
}

export const WeddingRingsPage: React.FC<WeddingRingsPageProps> = ({ onNavigate }) => {
  return <ShopPage onNavigate={onNavigate} initialCategory="Wedding Rings" />;
};
