import { useRef } from 'react';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import { ClientOnly } from '../utils/safeHydration'; //

interface TawkChatProps {
  propertyId?: string;
  widgetId?: string;
}

export default function TawkChat({
  propertyId = process.env.VITE_TAWK_PROPERTY_ID,
  widgetId = process.env.VITE_TAWK_WIDGET_ID
}: TawkChatProps) {
  const tawkMessengerRef = useRef<unknown>(null);

  if (!propertyId || !widgetId) {
    return null;
  }

  // Wrap the widget in ClientOnly to prevent hydration/DOM conflicts
  return (
    <ClientOnly>
      <TawkMessengerReact
        propertyId={propertyId}
        widgetId={widgetId}
        ref={tawkMessengerRef}
      />
    </ClientOnly>
  );
}