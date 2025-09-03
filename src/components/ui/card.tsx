import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 transition-shadow hover:shadow-xl ${className}`}
      style={{ borderRadius: '12px' }}
    >
      {children}
    </div>
  );
}
