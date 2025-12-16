import React from 'react';
import { ShopPage } from './ShopPage';

interface FineJewelryPageProps {
  onNavigate: (page: string) => void;
}

export const FineJewelryPage: React.FC<FineJewelryPageProps> = ({ onNavigate }) => {
  return <ShopPage onNavigate={onNavigate} initialCategory="Fine Jewelry" />;
};
