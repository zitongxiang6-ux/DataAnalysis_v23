import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        'h-10 flex items-center justify-center border-t border-[#E5E7EB] bg-surface text-caption text-text-secondary',
        className
      )}
    >
      <p>&copy; 2025 AnalyticsHub V1.0. All rights reserved.</p>
    </footer>
  );
}
