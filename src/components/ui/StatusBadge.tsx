import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Info } from 'lucide-react';

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing' | 'pending' | 'completed' | 'failed';

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
  showDot?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const variantConfig: Record<StatusVariant, { bg: string; text: string; border: string; icon: React.ReactNode; dot: string }> = {
  success: {
    bg: 'bg-success-light',
    text: 'text-success',
    border: 'border-success/20',
    icon: <CheckCircle2 className="w-3 h-3" />,
    dot: 'bg-success',
  },
  completed: {
    bg: 'bg-success-light',
    text: 'text-success',
    border: 'border-success/20',
    icon: <CheckCircle2 className="w-3 h-3" />,
    dot: 'bg-success',
  },
  warning: {
    bg: 'bg-warning-light',
    text: 'text-warning',
    border: 'border-warning/20',
    icon: <AlertTriangle className="w-3 h-3" />,
    dot: 'bg-warning',
  },
  pending: {
    bg: 'bg-warning-light',
    text: 'text-warning',
    border: 'border-warning/20',
    icon: <Clock className="w-3 h-3" />,
    dot: 'bg-warning',
  },
  danger: {
    bg: 'bg-danger-light',
    text: 'text-danger',
    border: 'border-danger/20',
    icon: <XCircle className="w-3 h-3" />,
    dot: 'bg-danger',
  },
  failed: {
    bg: 'bg-danger-light',
    text: 'text-danger',
    border: 'border-danger/20',
    icon: <XCircle className="w-3 h-3" />,
    dot: 'bg-danger',
  },
  info: {
    bg: 'bg-info-light',
    text: 'text-info',
    border: 'border-info/20',
    icon: <Info className="w-3 h-3" />,
    dot: 'bg-info',
  },
  processing: {
    bg: 'bg-primary-light',
    text: 'text-primary',
    border: 'border-primary/20',
    icon: <Clock className="w-3 h-3" />,
    dot: 'bg-primary',
  },
  neutral: {
    bg: 'bg-gray-100',
    text: 'text-text-secondary',
    border: 'border-gray-200',
    icon: <Info className="w-3 h-3" />,
    dot: 'bg-text-tertiary',
  },
};

export function StatusBadge({ variant, children, showDot = true, className, size = 'md' }: StatusBadgeProps) {
  const config = variantConfig[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-badge border font-semibold whitespace-nowrap',
        config.bg,
        config.text,
        config.border,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-badge-text',
        className
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
      )}
      {children}
    </span>
  );
}
