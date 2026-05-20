import { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
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
    if (format) {
      if (val >= 1000000) return (val / 1000000).toFixed(decimals) + 'M';
      if (val >= 10000) return (val / 10000).toFixed(decimals) + '万';
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
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p className="text-label uppercase text-text-secondary tracking-wider mb-2">
            {label}
          </p>

          {/* Value */}
          <div className="text-data-large text-text-primary mb-2">
            {inView ? (
              <CountUp
                start={0}
                end={value}
                duration={1.5}
                decimals={decimals}
                prefix={prefix}
                suffix={suffix}
                formattingFn={(val) => `${prefix}${formatNumber(val)}${suffix}`}
                onEnd={() => setCountFinished(true)}
              />
            ) : (
              <span>{prefix}0{suffix}</span>
            )}
          </div>

          {/* Trend */}
          {trend !== undefined && <TrendIndicator trend={trend} comparison={comparison} />}
        </div>

        {/* Sparkline */}
        {sparkline && sparkline.length > 0 && (
          <div className="w-20 h-10 ml-4 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={(trend ?? 0) >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={(trend ?? 0) >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0.05} />
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
