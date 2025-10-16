import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 relative overflow-hidden';

  const variants = {
    primary: 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg hover:shadow-orange-500/50 border border-orange-500/20 hover:border-orange-400/30',
    secondary: 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg hover:shadow-orange-500/50 border border-orange-500/20 hover:border-orange-400/30',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/50 border border-red-500/20 hover:border-red-400/30',
    success: 'bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/50 border border-green-500/20 hover:border-green-400/30',
    ghost: 'bg-transparent hover:bg-[#1a1a1a] text-neutral-300 hover:text-white border border-transparent hover:border-[#262626]',
    outline: 'bg-transparent hover:bg-[#0a0a0a] text-white border-2 border-[#2a2a2a] hover:border-orange-500/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm',
    md: 'px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base',
    lg: 'px-5 py-2.5 text-base sm:px-7 sm:py-3.5 sm:text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}

