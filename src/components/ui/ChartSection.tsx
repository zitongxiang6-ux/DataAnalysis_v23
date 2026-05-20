import * as React from 'react';
import { cn } from '@/lib/utils';

interface ChartSectionProps {
  title: string;
  titleAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  chartClassName?: string;
}

export function ChartSection({
  title,
  titleAction,
  children,
  className,
  chartClassName,
}: ChartSectionProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-6',
        className
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-h3 text-text-primary">{title}</h3>
        {titleAction && (
          <div className="flex items-center gap-2">
            {titleAction}
          </div>
        )}
      </div>
      <div className={cn('w-full', chartClassName)}>
        {children}
      </div>
    </div>
  );
}
