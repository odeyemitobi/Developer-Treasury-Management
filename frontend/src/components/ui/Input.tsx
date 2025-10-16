import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 sm:px-4 sm:py-3 bg-[#0a0a0a] border rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-neutral-500 outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            error ? 'border-red-500/50' : 'border-[#262626] hover:border-[#404040]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

