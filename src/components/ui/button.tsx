import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'accent' | 'link' | 'default' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

export const buttonVariants = (options?: { variant?: ButtonVariant }) => {
  return cn(
    buttonStyles.base,
    options?.variant ? buttonStyles.variants[options.variant] : buttonStyles.variants.primary
  );
};

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const buttonStyles = {
  base: 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  sizes: {
    sm: 'h-8 px-3 text-xs rounded-md',
    md: 'h-9 px-4 py-2 text-sm rounded-md',
    lg: 'h-10 px-6 py-2 text-base rounded-md',
    xl: 'h-12 px-8 py-3 text-lg rounded-lg',
    icon: 'h-9 w-9 p-2',
  },
  variants: {
    primary: cn(
      'bg-accent-600 text-white dark:bg-accent-500 dark:text-slate-900',
      'hover:bg-accent-700 dark:hover:bg-accent-400',
      'shadow-lg shadow-accent-600/20 dark:shadow-accent-500/20'
    ),
    secondary: cn(
      'bg-secondary-600 text-white dark:bg-secondary-500 dark:text-slate-900',
      'hover:bg-secondary-700 dark:hover:bg-secondary-400',
      'shadow-lg shadow-secondary-600/20 dark:shadow-secondary-500/20'
    ),
    outline: cn(
      'border-2 border-accent-600 text-accent-600',
      'dark:border-accent-400 dark:text-accent-400',
      'hover:bg-accent-50 dark:hover:bg-accent-950',
      'shadow-lg shadow-accent-600/10 dark:shadow-accent-500/10'
    ),
    link: cn(
      'p-0 h-auto font-medium underline-offset-4 hover:underline',
      'text-accent-600 dark:text-accent-400'
    ),
    default: cn(
      'bg-primary bg-opacity-90 text-primary-foreground hover:bg-primary/80'
    ),
    icon: cn(
      'h-9 w-9 p-2'
    ),
    ghost: cn(
      'text-muted-foreground dark:text-slate-400',
      'hover:bg-accent-50/50 dark:hover:bg-accent-950/50',
      'hover:text-accent-600 dark:hover:text-accent-400'
    ),
    danger: cn(
      'bg-destructive text-destructive-foreground',
      'hover:bg-destructive/90',
      'shadow-lg shadow-destructive/20'
    ),
    success: cn(
      'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-50',
      'hover:bg-emerald-700 dark:hover:bg-emerald-400',
      'shadow-lg shadow-emerald-600/20 dark:shadow-emerald-500/20'
    ),
    accent: cn(
      'bg-accent-600 text-white dark:bg-accent-500',
      'hover:bg-accent-700 dark:hover:bg-accent-400',
      'shadow-lg shadow-accent-600/20 dark:shadow-accent-500/20'
    )
  }
};

const sizes = {
  sm: 'h-8 px-3 text-xs rounded-md',
  md: 'h-9 px-4 py-2 text-sm rounded-md',
  lg: 'h-10 px-6 py-2 text-base rounded-md',
  xl: 'h-12 px-8 py-3 text-lg rounded-lg',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type="button"
      disabled={isDisabled}
      className={cn(
        buttonStyles.base,
        buttonStyles.variants[variant],
        buttonStyles.sizes[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      initial={{ opacity: 1 }}
      whileHover={!isDisabled ? { scale: 1.02, opacity: 0.95 } : {}}
      whileTap={!isDisabled ? { scale: 0.98, opacity: 0.9 } : {}}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      {...props}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
}

// Specialized button variants
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="secondary" {...props} />
);

export const GhostButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="ghost" {...props} />
);

export const DangerButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="danger" {...props} />
);

export const SuccessButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="success" {...props} />
);

// Button group component
interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const ButtonGroup = ({
  children,
  className = '',
  orientation = 'horizontal'
}: ButtonGroupProps) => (
  <div className={cn(
    orientation === 'horizontal' ? 'flex space-x-2' : 'flex flex-col space-y-2',
    className
  )}>
    {children}
  </div>
);

// Floating Action Button
interface FABProps extends HTMLMotionProps<"button"> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton = ({
  position = 'bottom-right',
  children,
  className = '',
  ...props
}: FABProps) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  return (
    <motion.button
      className={cn(
        positionClasses[position],
        'w-14 h-14 bg-accent-600 hover:bg-accent-700 text-white rounded-full',
        'shadow-lg hover:shadow-xl transition-all duration-200',
        'flex items-center justify-center z-50',
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
