import React from 'react';
import { ShopPage } from './ShopPage';

interface EngagementRingsPageProps {
  onNavigate: (page: string) => void;
}

export const EngagementRingsPage: React.FC<EngagementRingsPageProps> = ({ onNavigate }) => {
  return <ShopPage onNavigate={onNavigate} initialCategory="Engagement Ring" />;
};
