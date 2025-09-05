'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <motion.div
      className={cn(
        "p-8 rounded-xl text-center",
        "bg-white/90 dark:bg-slate-900/90",
        "backdrop-blur-sm backdrop-saturate-150",
        "border border-border/50 dark:border-white/10",
        "shadow-[0_8px_16px_rgb(0_0_0/0.08)] dark:shadow-[0_8px_16px_rgb(0_0_0/0.16)]",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {icon && (
        <div className="mx-auto w-16 h-16 rounded-2xl bg-accent-50/50 dark:bg-accent-950/50 flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-heading font-semibold mb-3 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
        {title}
      </h3>
      
      <p className="text-muted-foreground dark:text-slate-400 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </motion.div>
  );
}
