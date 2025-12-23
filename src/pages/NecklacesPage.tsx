import React from 'react';
import { ShopPage } from './ShopPage';

interface NecklacesPageProps {
  onNavigate: (page: string) => void;
}

export const NecklacesPage: React.FC<NecklacesPageProps> = ({ onNavigate }) => {
  return <ShopPage onNavigate={onNavigate} initialCategory="Necklaces" />;
};
