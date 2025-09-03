import React, { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export default function FeatureCard({ title, description, children, className = '' }: FeatureCardProps) {
  return (
    <div className={`p-6 bg-lavender-100 rounded-xl shadow hover:bg-lavender-200 transition ${className}`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-lavender-700 mb-4">{description}</p>
      {children}
    </div>
  );
}
