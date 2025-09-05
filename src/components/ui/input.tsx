import React, { InputHTMLAttributes, ReactNode, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type InputVariant = 'default' | 'filled' | 'outlined';
type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  icon?: ReactNode;  // Added icon prop
  variant?: InputVariant;
  size?: InputSize;
  showPasswordToggle?: boolean;
  loading?: boolean;
  className?: string;
}

const variants = {
  default: cn(
    'border border-border/50 dark:border-white/10',
    'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm backdrop-saturate-150',
    'focus:border-accent-500 focus:bg-accent-50/30 dark:focus:bg-accent-950/30',
    'transition-colors duration-200'
  ),
  filled: cn(
    'border-0',
    'bg-accent-50/50 dark:bg-accent-950/50',
    'focus:bg-accent-100/50 dark:focus:bg-accent-900/50',
    'focus:ring-2 focus:ring-accent-500',
    'transition-colors duration-200'
  ),
  outlined: cn(
    'border-2 border-border dark:border-white/20',
    'bg-transparent',
    'focus:border-accent-500 focus:bg-accent-50/20 dark:focus:bg-accent-950/20',
    'transition-colors duration-200'
  ),
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    success,
    hint,
    leftIcon,
    rightIcon,
    variant = 'default',
    size = 'md',
    showPasswordToggle = false,
    loading = false,
    className = '',
    type = 'text',
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const inputType = showPasswordToggle && type === 'password'
      ? (showPassword ? 'text' : 'password')
      : type;

    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className={cn(
            "block text-sm font-medium mb-2 transition-colors duration-200",
            hasError ? 'text-red-600' : hasSuccess ? 'text-green-600' : 'text-gray-700'
          )}>
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full rounded-lg transition-all duration-200 focus:outline-none focus:ring-0",
              variants[variant],
              sizes[size],
              leftIcon ? 'pl-10' : '',
              (rightIcon || loading || hasError || hasSuccess || showPasswordToggle) ? 'pr-10' : '',
              hasError ? 'border-red-500 bg-red-50/30' : '',
              hasSuccess ? 'border-green-500 bg-green-50/30' : '',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleInputChange}
            {...props}
          />

          {/* Right Side Icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {/* Loading Spinner */}
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}

            {/* Success Icon */}
            {!loading && hasSuccess && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}

            {/* Error Icon */}
            {!loading && hasError && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}

            {/* Password Toggle */}
            {!loading && showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}

            {/* Custom Right Icon */}
            {!loading && !hasError && !hasSuccess && !showPasswordToggle && rightIcon && (
              <div className="text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Helper Text */}
        {(error || success || hint) && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2"
            >
              {error && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </p>
              )}
              {!error && success && (
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {success}
                </p>
              )}
              {!error && !success && hint && (
                <p className="text-sm text-gray-500">
                  {hint}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Specialized input components
interface SearchInputProps extends Omit<InputProps, 'type'> {
  onSearch?: (value: string) => void;
  searchDelay?: number;
}

export const SearchInput = ({ onSearch, searchDelay = 300, ...props }: SearchInputProps) => {
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    if (onSearch) {
      const timeout = setTimeout(() => {
        onSearch(e.target.value);
      }, searchDelay);
      setSearchTimeout(timeout);
    }
    if (props.onChange) props.onChange(e);
  };

  return (
    <Input
      type="text"
      placeholder="Search..."
      onChange={handleSearch}
      {...props}
    />
  );
};

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  variant?: InputVariant;
  resize?: boolean;
}

export const EnhancedTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    label,
    error,
    success,
    hint,
    variant = 'default',
    resize = true,
    className = '',
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(e.target.value.length > 0);
      if (props.onChange) props.onChange(e);
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className={cn(
            "block text-sm font-medium mb-2 transition-colors duration-200",
            hasError ? 'text-red-600' : hasSuccess ? 'text-green-600' : 'text-gray-700'
          )}>
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-lg transition-all duration-200 focus:outline-none focus:ring-0",
            variants[variant],
            sizes.md,
            hasError ? 'border-red-500 bg-red-50/30' : '',
            hasSuccess ? 'border-green-500 bg-green-50/30' : '',
            resize ? 'resize-y' : 'resize-none',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          {...props}
        />

        {/* Helper Text */}
        {(error || success || hint) && (
          <div className="mt-2">
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
            {!error && success && (
              <p className="text-sm text-green-600 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                {success}
              </p>
            )}
            {!error && !success && hint && (
              <p className="text-sm text-gray-500">
                {hint}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

EnhancedTextarea.displayName = 'EnhancedTextarea';
