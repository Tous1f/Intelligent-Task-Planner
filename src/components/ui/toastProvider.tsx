'use client';

import React from 'react';
import { useToast } from '@/hooks/use-toast';
import Toast from './Toast';

export default function ToastProvider() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 flex flex-col space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}
