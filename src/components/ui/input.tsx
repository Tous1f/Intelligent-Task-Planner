import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && <label className="mb-1 font-semibold text-lavender-700">{label}</label>}
      <input
        {...props}
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lavender-400 transition shadow-sm ${
          error ? 'border-red-500' : 'border-lavender-300'
        }`}
      />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
    </div>
  );
}
