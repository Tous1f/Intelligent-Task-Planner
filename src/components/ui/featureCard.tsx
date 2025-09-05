import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export default function FeatureCard({ title, description, children, className = '' }: FeatureCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-xl backdrop-blur-sm backdrop-saturate-150 border border-white/10",
      "bg-white/90 dark:bg-slate-900/90",
      "shadow-[0_8px_16px_rgb(0_0_0/0.08)] dark:shadow-[0_8px_16px_rgb(0_0_0/0.16)]",
      "hover:shadow-[0_12px_24px_rgb(0_0_0/0.12)] dark:hover:shadow-[0_12px_24px_rgb(0_0_0/0.24)]",
      "transition-all duration-200 relative overflow-hidden",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/20 dark:from-white/0 dark:to-white/5 pointer-events-none" />
      <h3 className="text-xl font-heading font-semibold mb-3 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-muted-foreground dark:text-slate-400 mb-4 leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
}
