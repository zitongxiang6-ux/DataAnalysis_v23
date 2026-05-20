import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title?: React.ReactNode;
  titleAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export function SectionCard({
  title,
  titleAction,
  children,
  className,
  bodyClassName,
  noPadding = false,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-[#E5E7EB] rounded-card shadow-sm mb-6',
        className
      )}
    >
      {(title || titleAction) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
          {title && (
            <h3 className="text-h3 text-text-primary">{title}</h3>
          )}
          {titleAction && (
            <div className="flex items-center gap-2">
              {titleAction}
            </div>
          )}
        </div>
      )}
      <div className={cn(!noPadding && 'p-5', bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
