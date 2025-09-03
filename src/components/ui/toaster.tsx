'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #DFD8F9',
          color: '#3E2772',
        },
        className: 'sonner-toast',
        descriptionClassName: 'sonner-description',
      }}
      theme="light"
      richColors
      expand={true}
      visibleToasts={4}
    />
  );
}
