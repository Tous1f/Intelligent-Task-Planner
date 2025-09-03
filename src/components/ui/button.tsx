import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-lavender-500 text-white hover:bg-lavender-600 focus:ring-2 focus:ring-lavender-400',
  secondary: 'bg-lavender-100 text-lavender-700 hover:bg-lavender-200 focus:ring-2 focus:ring-lavender-300',
  ghost: 'bg-transparent text-lavender-500 hover:bg-lavender-100 focus:ring-2 focus:ring-lavender-200',
};

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
