import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'bordered';
  noPadding?: boolean;
}

export function Card({
  children,
  className,
  title,
  subtitle,
  action,
  variant = 'default',
  noPadding = false
}: CardProps) {
  const variants = {
    default: 'bg-[#0a0a0a] border border-[#1a1a1a] shadow-lg',
    elevated: 'bg-[#0a0a0a] border border-[#1a1a1a] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200',
    glass: 'bg-[#0a0a0a]/60 border border-[#1a1a1a] backdrop-blur-xl shadow-2xl',
    bordered: 'bg-transparent border-2 border-[#2a2a2a] shadow-none',
  };

  return (
    <div className={cn(
      'rounded-lg sm:rounded-xl overflow-hidden',
      variants[variant],
      className
    )}>
      {(title || subtitle || action) && (
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 border-b border-[#1a1a1a] flex items-center justify-between bg-[#0a0a0a]/50 gap-3">
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight truncate">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 sm:mt-1.5 truncate">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-3 sm:p-4 lg:p-6'}>
        {children}
      </div>
    </div>
  );
}

