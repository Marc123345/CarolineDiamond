import React from 'react';
import { ShopPage } from './ShopPage';

export const NecklacesPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => (
  <ShopPage onNavigate={onNavigate} initialCategory="Necklaces" />
);