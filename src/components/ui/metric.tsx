'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  description?: string;
  className?: string;
}

export default function Metric({
  title,
  value,
  icon,
  trend,
  description,
  className
}: MetricProps) {
  return (
    <motion.div
      className={cn(
        "p-6 rounded-xl",
        "bg-white/90 dark:bg-slate-900/90",
        "backdrop-blur-sm backdrop-saturate-150",
        "border border-border/50 dark:border-white/10",
        "shadow-[0_8px_16px_rgb(0_0_0/0.08)] dark:shadow-[0_8px_16px_rgb(0_0_0/0.16)]",
        "transition-all duration-200",
        className
      )}
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-muted-foreground dark:text-slate-400">
          {title}
        </div>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-accent-50/50 dark:bg-accent-950/50 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
          {value}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-sm font-medium",
            trend.isUpward ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          )}>
            {trend.isUpward ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {trend.value}%
          </div>
        )}
      </div>
      
      {description && (
        <p className="mt-2 text-sm text-muted-foreground dark:text-slate-400">
          {description}
        </p>
      )}
    </motion.div>
  );
}
