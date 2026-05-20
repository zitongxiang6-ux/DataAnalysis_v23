import { cn } from '@/lib/utils';

export interface TabItem {
  key: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export function TabSwitcher({ tabs, activeKey, onChange, className }: TabSwitcherProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center bg-[#F3F4F6] rounded-md p-[3px] gap-[3px]',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'relative px-4 py-1.5 rounded text-sm font-medium transition-all duration-150 whitespace-nowrap',
            activeKey === tab.key
              ? 'bg-surface text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
