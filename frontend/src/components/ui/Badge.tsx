import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-neutral-800 text-neutral-200 border border-neutral-700',
    success: 'bg-green-600/20 text-green-400 border border-green-600/30',
    warning: 'bg-amber-600/20 text-amber-400 border border-amber-600/30',
    danger: 'bg-red-600/20 text-red-400 border border-red-600/30',
    info: 'bg-orange-600/20 text-orange-400 border border-orange-600/30',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

