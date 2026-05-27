import { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { TrendIndicator } from './TrendIndicator';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  format?: boolean;
  trend?: number;
  comparison?: string;
  sparkline?: number[];
  className?: string;
  delay?: number;
}

export function KpiCard({
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  format = false,
  trend,
  comparison = 'vs 上周',
  sparkline,
  className,
  delay = 0,
}: KpiCardProps) {
  const [inView, setInView] = useState(false);
  const [countFinished, setCountFinished] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setInView(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const sparklineData = sparkline?.map((val, idx) => ({ value: val, idx })) ?? [];

  const formatNumber = (val: number): string => {
    const isCurrency = prefix === '¥' || prefix === '￥' || prefix === '楼';
    if (isCurrency) {
      const sign = val < 0 ? '-' : '';
      return `${sign}￥${Math.abs(val).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    if (suffix === '%') {
      return `${val.toFixed(2)}%`;
    }

    if (format) {
      return val.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return decimals > 0 ? val.toFixed(decimals) : val.toLocaleString('zh-CN');
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        'opacity-0 translate-y-4',
        inView && 'animate-slide-up',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-label uppercase tracking-wider text-text-secondary">
            {label}
          </p>

          <div className={cn('mb-2 text-data-large text-text-primary', value < 0 && 'text-danger')}>
            {inView ? (
              <CountUp
                start={0}
                end={value}
                duration={1.5}
                decimals={decimals}
                formattingFn={(val) => formatNumber(val)}
                onEnd={() => setCountFinished(true)}
              />
            ) : (
              <span>{formatNumber(0)}</span>
            )}
          </div>

          {trend !== undefined && <TrendIndicator trend={trend} comparison={comparison} />}
        </div>

        {sparkline && sparkline.length > 0 && (
          <div className="ml-4 h-10 w-20 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={(trend ?? 0) >= 0 ? '#10B981' : '#EF4444'}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor={(trend ?? 0) >= 0 ? '#10B981' : '#EF4444'}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={(trend ?? 0) >= 0 ? '#10B981' : '#EF4444'}
                  strokeWidth={2}
                  fill={`url(#spark-${label})`}
                  isAnimationActive={countFinished}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
