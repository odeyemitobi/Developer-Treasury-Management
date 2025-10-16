import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconColor?: 'orange' | 'purple' | 'green' | 'amber' | 'red' | 'cyan';
  className?: string;
}

export function StatCard({ label, value, icon, trend, iconColor = 'orange', className }: StatCardProps) {
  const iconColors = {
    orange: 'from-orange-600 to-orange-500 shadow-orange-500/30',
    purple: 'from-purple-600 to-purple-500 shadow-purple-500/30',
    green: 'from-green-600 to-green-500 shadow-green-500/30',
    amber: 'from-amber-600 to-amber-500 shadow-amber-500/30',
    red: 'from-red-600 to-red-500 shadow-red-500/30',
    cyan: 'from-cyan-600 to-cyan-500 shadow-cyan-500/30',
  };

  return (
    <div
      className={cn(
        'bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6',
        'hover:border-[#2a2a2a] transition-all duration-200',
        'group',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-neutral-400 mb-1 sm:mb-2 truncate">{label}</p>
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight mb-1 truncate">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-1 sm:mt-2">
              <span
                className={cn(
                  'text-xs sm:text-sm font-medium',
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-xs text-neutral-500 hidden sm:inline">this month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br shadow-lg flex-shrink-0',
            'group-hover:scale-110 transition-transform duration-200',
            iconColors[iconColor]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

