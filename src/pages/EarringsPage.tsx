import React from 'react';
import { ShopPage } from './ShopPage';

interface EarringsPageProps {
  onNavigate: (page: string) => void;
}

export const EarringsPage: React.FC<EarringsPageProps> = ({ onNavigate }) => {
  return <ShopPage onNavigate={onNavigate} initialCategory="Earrings" />;
};
