import React, { InputHTMLAttributes, ReactNode, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

type InputVariant = 'default' | 'filled' | 'outlined';
type InputSize = 'sm' | 'md' | 'lg';

interface EnhancedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: InputVariant;
  size?: InputSize;
  showPasswordToggle?: boolean;
  loading?: boolean;
  className?: string;
}

const variants = {
  default: 'border-2 border-lavender-200 bg-white focus:border-lavender-400 focus:bg-lavender-50/30',
  filled: 'border-0 bg-lavender-50 focus:bg-lavender-100 focus:ring-2 focus:ring-lavender-400',
  outlined: 'border-2 border-lavender-300 bg-transparent focus:border-lavender-500 focus:bg-lavender-50/20',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
};

const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
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
      <motion.div
        className={`relative ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Label */}
        <AnimatePresence>
          {label && (
            <motion.label
              className={`
                absolute left-4 transition-all duration-300 ease-out pointer-events-none
                ${isFocused || hasValue 
                  ? 'top-0 text-xs bg-white px-2 -translate-y-1/2 text-lavender-600 font-semibold' 
                  : `top-1/2 -translate-y-1/2 text-lavender-500 ${
                    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
                  }`
                }
                ${hasError ? 'text-red-500' : ''}
                ${hasSuccess ? 'text-green-500' : ''}
              `}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.label>
          )}
        </AnimatePresence>

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <motion.div
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-lavender-400 ${
                isFocused ? 'text-lavender-600' : ''
              } ${hasError ? 'text-red-400' : ''} ${hasSuccess ? 'text-green-400' : ''}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {leftIcon}
            </motion.div>
          )}

          {/* Input Field */}
          <motion.input
            ref={ref}
            type={inputType}
            className={`
              w-full rounded-2xl transition-all duration-300 ease-out
              ${variants[variant]}
              ${sizes[size]}
              ${leftIcon ? 'pl-12' : ''}
              ${rightIcon || showPasswordToggle || hasError || hasSuccess || loading ? 'pr-12' : ''}
              ${hasError 
                ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200 text-red-900' 
                : ''
              }
              ${hasSuccess 
                ? 'border-green-300 focus:border-green-400 focus:ring-2 focus:ring-green-200' 
                : ''
              }
              focus:outline-none focus:shadow-lg
              disabled:opacity-60 disabled:cursor-not-allowed
              placeholder:text-lavender-400 placeholder:transition-colors
              ${label ? 'placeholder:opacity-0 focus:placeholder:opacity-100' : ''}
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleInputChange}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            {...props}
          />

          {/* Right Side Icons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            {/* Loading Spinner */}
            {loading && (
              <motion.div
                className="w-5 h-5 border-2 border-lavender-300 border-t-lavender-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}

            {/* Success Icon */}
            {!loading && hasSuccess && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </motion.div>
            )}

            {/* Error Icon */}
            {!loading && hasError && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
              </motion.div>
            )}

            {/* Password Toggle */}
            {!loading && showPasswordToggle && type === 'password' && (
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-lavender-400 hover:text-lavender-600 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            )}

            {/* Custom Right Icon */}
            {!loading && !hasError && !hasSuccess && !showPasswordToggle && rightIcon && (
              <motion.div
                className={`text-lavender-400 ${isFocused ? 'text-lavender-600' : ''}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {rightIcon}
              </motion.div>
            )}
          </div>
        </div>

        {/* Helper Text */}
        <AnimatePresence mode="wait">
          {(error || success || hint) && (
            <motion.div
              className="mt-2 px-4"
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error && (
                <motion.p
                  className="text-sm text-red-600 flex items-center"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </motion.p>
              )}
              {!error && success && (
                <motion.p
                  className="text-sm text-green-600 flex items-center"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  {success}
                </motion.p>
              )}
              {!error && !success && hint && (
                <motion.p
                  className="text-sm text-lavender-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {hint}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

export default EnhancedInput;

// Specialized input components for common use cases

// Search Input
interface SearchInputProps extends Omit<EnhancedInputProps, 'leftIcon' | 'type'> {
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
    <EnhancedInput
      type="search"
      leftIcon={
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          🔍
        </motion.div>
      }
      placeholder="Search..."
      onChange={handleSearch}
      {...props}
    />
  );
};

// OTP Input Component
interface OTPInputProps {
  length?: number;
  onComplete?: (value: string) => void;
  className?: string;
}

export const OTPInput = ({ length = 6, onComplete, className = '' }: OTPInputProps) => {
  const [values, setValues] = useState<string[]>(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single characters
    
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    // Move to next input
    if (value && index < length - 1) {
      setActiveIndex(index + 1);
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }

    // Call onComplete when all fields are filled
    if (newValues.every(v => v) && onComplete) {
      onComplete(newValues.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      setActiveIndex(index - 1);
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  return (
    <motion.div 
      className={`flex space-x-3 justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {values.map((value, index) => (
        <motion.input
          key={index}
          id={`otp-${index}`}
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => setActiveIndex(index)}
          className={`
            w-12 h-12 text-center text-xl font-bold rounded-xl border-2 transition-all duration-300
            ${activeIndex === index 
              ? 'border-lavender-500 bg-lavender-50 ring-4 ring-lavender-200' 
              : 'border-lavender-200 bg-white hover:border-lavender-300'
            }
            focus:outline-none focus:border-lavender-500 focus:ring-4 focus:ring-lavender-200
          `}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
          whileFocus={{ scale: 1.1 }}
        />
      ))}
    </motion.div>
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
      <motion.div
        className={`relative ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Label */}
        <AnimatePresence>
          {label && (
            <motion.label
              className={`
                absolute left-4 transition-all duration-300 ease-out pointer-events-none z-10
                ${isFocused || hasValue 
                  ? 'top-0 text-xs bg-white px-2 -translate-y-1/2 text-lavender-600 font-semibold' 
                  : 'top-4 text-base text-lavender-500'
                }
                ${hasError ? 'text-red-500' : ''}
                ${hasSuccess ? 'text-green-500' : ''}
              `}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.label>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <motion.textarea
          ref={ref}
          className={`
            w-full min-h-[100px] rounded-2xl transition-all duration-300 ease-out px-4 py-3
            ${variants[variant]}
            ${hasError 
              ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200' 
              : ''
            }
            ${hasSuccess 
              ? 'border-green-300 focus:border-green-400 focus:ring-2 focus:ring-green-200' 
              : ''
            }
            focus:outline-none focus:shadow-lg
            disabled:opacity-60 disabled:cursor-not-allowed
            placeholder:text-lavender-400 placeholder:transition-colors
            ${label ? 'placeholder:opacity-0 focus:placeholder:opacity-100' : ''}
            ${resize ? 'resize-y' : 'resize-none'}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          {...props}
        />

        {/* Helper Text */}
        <AnimatePresence mode="wait">
          {(error || success || hint) && (
            <motion.div
              className="mt-2 px-4"
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error && (
                <motion.p
                  className="text-sm text-red-600 flex items-center"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </motion.p>
              )}
              {!error && success && (
                <motion.p
                  className="text-sm text-green-600 flex items-center"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  {success}
                </motion.p>
              )}
              {!error && !success && hint && (
                <motion.p
                  className="text-sm text-lavender-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {hint}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

EnhancedTextarea.displayName = 'EnhancedTextarea';