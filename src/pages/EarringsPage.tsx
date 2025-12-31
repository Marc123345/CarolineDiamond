import React from 'react';
import { ShopPage } from './ShopPage';

export const EarringsPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => (
  <ShopPage onNavigate={onNavigate} initialCategory="Earrings" />
);