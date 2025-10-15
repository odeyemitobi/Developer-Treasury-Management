import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'white' | 'success' | 'danger';
}

export function Spinner({ size = 'md', className, color = 'primary' }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  const colors = {
    primary: 'border-blue-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    success: 'border-green-500 border-t-transparent',
    danger: 'border-red-500 border-t-transparent',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizes[size],
        colors[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

