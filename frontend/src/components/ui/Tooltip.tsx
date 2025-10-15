'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ children, content, position = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-sm text-white bg-neutral-900 rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            positions[position],
            className
          )}
        >
          {content}
          <div
            className={cn(
              'absolute w-2 h-2 bg-neutral-900 border-neutral-700 rotate-45',
              position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b',
              position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2 border-l border-t',
              position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2 border-t border-r',
              position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2 border-b border-l'
            )}
          />
        </div>
      )}
    </div>
  );
}

