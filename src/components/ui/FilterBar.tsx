import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search, RotateCcw, Download, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FilterBarProps {
  children?: React.ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  showSearch?: boolean;
  showRefresh?: boolean;
  showExport?: boolean;
  className?: string;
  rightActions?: React.ReactNode;
}

export function FilterBar({
  children,
  searchPlaceholder = '搜索关键词...',
  searchValue,
  onSearchChange,
  onRefresh,
  onExport,
  showSearch = true,
  showRefresh = true,
  showExport = true,
  className,
  rightActions,
}: FilterBarProps) {
  return (
    <div className={cn('bg-surface border border-[#E5E7EB] rounded-card p-4 mb-6', className)}>
      <div className="flex flex-wrap items-center gap-4">
        {/* Left side: custom filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {children}

          {/* Search input */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-9 pr-4 h-9 w-[240px] max-w-[360px] rounded-input border-[#E5E7EB] bg-surface text-body placeholder:text-text-tertiary focus-visible:border-primary focus-visible:ring-primary-light focus-visible:ring-2"
              />
            </div>
          )}
        </div>

        {/* Right side: actions */}
        <div className="flex items-center gap-2">
          {showRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="gap-1.5 text-body-small text-text-secondary border-[#E5E7EB] hover:bg-[#F3F4F6] hover:text-text-primary"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              刷新
            </Button>
          )}
          {showExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="gap-1.5 text-body-small text-text-secondary border-[#E5E7EB] hover:bg-[#F3F4F6] hover:text-text-primary"
            >
              <Download className="w-3.5 h-3.5" />
              导出
            </Button>
          )}
          {rightActions}
        </div>
      </div>
    </div>
  );
}

// Filter chip component
interface FilterChipProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

export function FilterChip({ label, onRemove, className }: FilterChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-7 px-2.5 rounded-badge bg-primary-light border border-primary/30 text-primary text-body-small font-medium',
        className
      )}
    >
      {label}
      <button
        onClick={onRemove}
        className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
      >
        <Filter className="w-3 h-3" />
      </button>
    </span>
  );
}
