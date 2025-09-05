import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={cn(
      "rounded-xl bg-white backdrop-blur-sm backdrop-saturate-150 border border-white/10",
      "dark:bg-slate-900/50 dark:border-white/5",
      "shadow-[0_8px_16px_rgb(0_0_0/0.08)] dark:shadow-[0_8px_16px_rgb(0_0_0/0.16)]",
      "transition-all duration-200 ease-in-out hover:shadow-[0_12px_24px_rgb(0_0_0/0.12)] dark:hover:shadow-[0_12px_24px_rgb(0_0_0/0.24)]",
      "relative overflow-hidden",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/20 dark:from-white/0 dark:to-white/5 pointer-events-none" />
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
    {children}
  </div>
);

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className = '' }: CardTitleProps) => (
  <h3 className={cn(
    "text-xl font-heading font-semibold leading-none tracking-tight",
    "bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent",
    "dark:from-accent-400 dark:to-accent-500",
    className
  )}>
    {children}
  </h3>
);

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const CardDescription = ({ children, className = '' }: CardDescriptionProps) => (
  <p className={cn(
    "text-sm text-muted-foreground leading-relaxed",
    "dark:text-slate-400",
    className
  )}>
    {children}
  </p>
);

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = '' }: CardContentProps) => (
  <div className={cn("p-6 pt-0", className)}>
    {children}
  </div>
);

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => (
  <div className={cn("flex items-center p-6 pt-0", className)}>
    {children}
  </div>
);
