import React from 'react';
import { ToastMessage } from '@/hooks/use-toast';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  return (
    <div
      className={`mb-2 w-96 rounded-md p-4 shadow-lg text-white ${
        toast.type === 'error'
          ? 'bg-destructive'
          : toast.type === 'success'
          ? 'bg-sage-500'
          : 'bg-lavender-500'
      }`}
    >
      {toast.title && <strong className="block mb-1">{toast.title}</strong>}
      {toast.description && <p>{toast.description}</p>}
      <button
        className="mt-2 underline text-sm"
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        Dismiss
      </button>
    </div>
  );
}
