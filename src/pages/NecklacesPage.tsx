import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopPage } from './ShopPage';

interface NecklacesPageProps {
  onNavigate: (page: string) => void;
}

export const NecklacesPage: React.FC<NecklacesPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/shop?category=necklaces', { replace: true });
  }, [navigate]);

  return <ShopPage onNavigate={onNavigate} initialCategory="Necklaces" />;
};
