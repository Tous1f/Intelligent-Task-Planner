import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface EnhancedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white shadow-lg hover:shadow-xl border-0',
  secondary: 'bg-gradient-to-r from-lavender-100 to-lavender-200 hover:from-lavender-200 hover:to-lavender-300 text-lavender-700 border border-lavender-300 hover:border-lavender-400',
  ghost: 'bg-transparent hover:bg-lavender-50 text-lavender-600 hover:text-lavender-700 border border-transparent hover:border-lavender-200',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl border-0',
  success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl border-0',
};

const sizes = {
  sm: 'px-3 py-2 text-sm font-medium rounded-xl',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl',
  lg: 'px-6 py-3 text-base font-semibold rounded-2xl',
  xl: 'px-8 py-4 text-lg font-bold rounded-2xl',
};

export default function EnhancedButton({
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
}: EnhancedButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      {...props}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-4 focus:ring-lavender-200
        disabled:opacity-60 disabled:cursor-not-allowed
        transform-gpu
        ${className}
      `}
      whileHover={!isDisabled ? { scale: 1.02, y: -1 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98, y: 0 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Loading spinner or left icon */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mr-2"
        >
          <Loader2 className="w-4 h-4" />
        </motion.div>
      ) : (
        icon && iconPosition === 'left' && (
          <motion.div
            className="mr-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )
      )}

      {/* Button text */}
      <motion.span
        className="relative"
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        {children}
      </motion.span>

      {/* Right icon */}
      {!loading && icon && iconPosition === 'right' && (
        <motion.div
          className="ml-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      )}

      {/* Ripple effect overlay */}
      <motion.div
        className="absolute inset-0 rounded-inherit bg-white opacity-0"
        whileTap={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: 'none' }}
      />
    </motion.button>
  );
}

// Specialized button variants for common use cases

export const PrimaryButton = (props: Omit<EnhancedButtonProps, 'variant'>) => (
  <EnhancedButton variant="primary" {...props} />
);

export const SecondaryButton = (props: Omit<EnhancedButtonProps, 'variant'>) => (
  <EnhancedButton variant="secondary" {...props} />
);

export const GhostButton = (props: Omit<EnhancedButtonProps, 'variant'>) => (
  <EnhancedButton variant="ghost" {...props} />
);

export const DangerButton = (props: Omit<EnhancedButtonProps, 'variant'>) => (
  <EnhancedButton variant="danger" {...props} />
);

export const SuccessButton = (props: Omit<EnhancedButtonProps, 'variant'>) => (
  <EnhancedButton variant="success" {...props} />
);

// Button group component for related actions
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
  <motion.div
    className={`
      flex ${orientation === 'horizontal' ? 'flex-row space-x-2' : 'flex-col space-y-2'}
      ${className}
    `}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Floating Action Button
interface FABProps extends Omit<EnhancedButtonProps, 'size' | 'variant'> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton = ({ 
  position = 'bottom-right',
  children,
  className = '',
  ...props 
}: FABProps) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.5 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <EnhancedButton
        variant="primary"
        size="lg"
        className={`
          rounded-full w-14 h-14 shadow-2xl hover:shadow-3xl
          bg-gradient-to-r from-lavender-500 to-lavender-600
          hover:from-lavender-600 hover:to-lavender-700
          ${className}
        `}
        {...props}
      >
        {children}
      </EnhancedButton>
    </motion.div>
  );
};
