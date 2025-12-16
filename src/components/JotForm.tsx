import React, { useEffect, useRef } from 'react';

interface JotFormProps {
  formId: string;
  className?: string;
}

export const JotForm: React.FC<JotFormProps> = ({ formId, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create script element
    const script = document.createElement('script');
    script.src = `https://form.jotform.com/jsform/${formId}`;
    script.type = 'text/javascript';
    script.async = true;

    // Append script to container
    container.appendChild(script);

    // Cleanup function
    return () => {
      if (container && script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, [formId]);

  return <div ref={containerRef} className={className} />;
};
