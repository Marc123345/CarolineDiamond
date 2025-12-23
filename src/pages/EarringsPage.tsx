import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopPage } from './ShopPage';

interface EarringsPageProps {
  onNavigate: (page: string) => void;
}

export const EarringsPage: React.FC<EarringsPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/shop?category=earrings', { replace: true });
  }, [navigate]);

  return <ShopPage onNavigate={onNavigate} initialCategory="Earrings" />;
};
