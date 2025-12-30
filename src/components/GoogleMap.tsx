import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { contactInfo } from '../config/siteConfig';

interface GoogleMapProps {
  className?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Create script element to load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // Get coordinates from config
      const location = contactInfo.coordinates;

      // Create map
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 16,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#f8f6f3' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#CDBCAB' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#2c2827' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#2c2827' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#e5d9d2' }]
          }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true
      });

      mapInstanceRef.current = map;

      // Add custom marker
      const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: `Diamonds by CS - ${contactInfo.address.street}, ${contactInfo.address.city}`,
        animation: google.maps.Animation.DROP
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: 'Cormorant Garamond', Georgia, serif; padding: 12px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #2c2827;">Diamonds by CS</h3>
            <p style="margin: 0 0 8px 0; color: #837f7a; font-size: 14px; line-height: 1.5;">
              ${contactInfo.address.street}<br/>
              ${contactInfo.address.postalCode} ${contactInfo.address.city}, ${contactInfo.address.country}
            </p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${contactInfo.address.street}, ${contactInfo.address.city}, ${contactInfo.address.country}`)}"
              target="_blank"
              rel="noopener noreferrer"
              style="display: inline-block; margin-top: 8px; padding: 8px 16px; background: #CDBCAB; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;"
            >
              Get Directions
            </a>
          </div>
        `
      });

      // Open info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    };

    loadGoogleMaps();

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`rounded-xl overflow-hidden shadow-2xl border-2 border-Color-Light-300/30 ${className}`}
    >
      <div
        ref={mapRef}
        className="w-full h-full min-h-[400px]"
        style={{ background: '#f8f6f3' }}
      />
    </motion.div>
  );
};
