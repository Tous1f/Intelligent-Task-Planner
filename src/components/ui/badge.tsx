'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'default',
  size = 'md',
  children,
  className
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-accent-50/50 dark:bg-accent-950/50 text-accent-700 dark:text-accent-300',
    secondary: 'bg-secondary-50/50 dark:bg-secondary-950/50 text-secondary-700 dark:text-secondary-300',
    success: 'bg-emerald-50/50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
    warning: 'bg-amber-50/50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
    error: 'bg-rose-50/50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full',
        'backdrop-blur-sm backdrop-saturate-150',
        'transition-colors duration-200',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
