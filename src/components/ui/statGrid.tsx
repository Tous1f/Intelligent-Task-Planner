'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatGridProps {
  items: Array<{
    title: string;
    value: string | number;
    icon?: ReactNode;
    color?: string;
    description?: string;
  }>;
  className?: string;
}

export default function StatGrid({ items, className }: StatGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          className={cn(
            "p-6 rounded-xl",
            "bg-white/90 dark:bg-slate-900/90",
            "backdrop-blur-sm backdrop-saturate-150",
            "border border-border/50 dark:border-white/10",
            "shadow-[0_8px_16px_rgb(0_0_0/0.08)] dark:shadow-[0_8px_16px_rgb(0_0_0/0.16)]",
            "transition-all duration-200"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
        >
          {item.icon && (
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                "bg-gradient-to-r",
                item.color || "from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500"
              )}
            >
              {item.icon}
            </div>
          )}
          <div className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
            {item.value}
          </div>
          <div className="mt-1 text-sm font-medium text-muted-foreground dark:text-slate-400">
            {item.title}
          </div>
          {item.description && (
            <p className="mt-2 text-sm text-muted-foreground/80 dark:text-slate-400/80">
              {item.description}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
