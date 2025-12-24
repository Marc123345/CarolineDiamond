import { useRef } from 'react';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

interface TawkChatProps {
  propertyId?: string;
  widgetId?: string;
}

export default function TawkChat({
  propertyId = import.meta.env.VITE_TAWK_PROPERTY_ID,
  widgetId = import.meta.env.VITE_TAWK_WIDGET_ID
}: TawkChatProps) {
  const tawkMessengerRef = useRef<unknown>(null);

  // Silently skip if not configured (optional feature)
  if (!propertyId || !widgetId) {
    return null;
  }

  return (
    <TawkMessengerReact
      propertyId={propertyId}
      widgetId={widgetId}
      ref={tawkMessengerRef}
    />
  );
}
