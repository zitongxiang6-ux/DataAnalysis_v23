import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  trend: number;
  comparison?: string;
  className?: string;
  showIcon?: boolean;
}

export function TrendIndicator({
  trend,
  comparison = 'vs 上周',
  className,
  showIcon = true,
}: TrendIndicatorProps) {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;

  return (
    <div className={cn('flex items-center gap-1.5 text-caption font-semibold', className)}>
      {showIcon && (
        <span
          className={cn(
            'flex items-center',
            isPositive && 'text-success',
            isNeutral && 'text-text-tertiary',
            !isPositive && !isNeutral && 'text-danger'
          )}
        >
          {isPositive && <ArrowUp className="w-3.5 h-3.5" />}
          {isNeutral && <Minus className="w-3.5 h-3.5" />}
          {!isPositive && !isNeutral && <ArrowDown className="w-3.5 h-3.5" />}
        </span>
      )}
      <span
        className={cn(
          isPositive && 'text-success',
          isNeutral && 'text-text-tertiary',
          !isPositive && !isNeutral && 'text-danger'
        )}
      >
        {isPositive && '+'}{trend.toFixed(1)}%
      </span>
      <span className="text-text-tertiary font-normal">{comparison}</span>
    </div>
  );
}
