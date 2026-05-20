import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { cn } from '@/lib/utils';
import {
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  route?: string;
  children?: { key: string; label: string; route: string; queryTab?: string }[];
}

const navItems: NavItem[] = [
  {
    key: 'sales-reports',
    label: '销售报告管理',
    icon: FileText,
    route: '/report-center',
  },
  {
    key: 'my-sales-reports',
    label: '我的销售报告',
    icon: FileText,
    route: '/my-sales-reports',
  },
  {
    key: 'report-query',
    label: '报表查询',
    icon: Activity,
    route: '/realtime-reports',
    children: [
      { key: 'department', label: '部门出货统计', route: '/realtime-reports', queryTab: 'department' },
      { key: 'salesperson-monthly', label: '业务出货统计', route: '/realtime-reports', queryTab: 'salesperson-monthly' },
      { key: 'channel', label: '客户出货统计', route: '/realtime-reports', queryTab: 'channel' },
      { key: 'target', label: '季度目标统计', route: '/realtime-reports', queryTab: 'target' },
      { key: 'rebate', label: '返点测算', route: '/realtime-reports', queryTab: 'rebate' },
      { key: 'config', label: '配置规则', route: '/realtime-reports', queryTab: 'config' },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'report-query': false,
  });

  const currentPath = location.pathname;

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (route?: string) => {
    if (!route) return false;
    return currentPath === route || currentPath.startsWith(route + '/');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-surface border-r border-[#E5E7EB] z-50 flex flex-col transition-all duration-300',
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
      )}
    >
      {/* Logo Area */}
      <div className="h-topbar flex items-center justify-center border-b border-[#E5E7EB] flex-shrink-0 px-4">
        {collapsed ? (
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-h3 text-text-primary tracking-tight">AnalyticsHub</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-3 px-2">
        {navItems.map((item) => {
          const active = isActive(item.route);
          const hasChildren = item.children && item.children.length > 0;
          const expanded = expandedGroups[item.key];
          const Icon = item.icon;

          if (collapsed) {
            return (
              <div key={item.key} className="mb-1">
                <button
                  onClick={() => {
                    if (hasChildren) {
                      onToggleCollapse();
                      setTimeout(() => toggleGroup(item.key), 350);
                    } else if (item.route) {
                      navigate(item.route);
                    }
                  }}
                  className={cn(
                    'w-10 h-10 mx-auto flex items-center justify-center rounded-md transition-colors duration-150',
                    active
                      ? 'bg-primary-light text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-[#F3F4F6]'
                  )}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </div>
            );
          }

          return (
            <div key={item.key} className="mb-0.5">
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleGroup(item.key);
                  } else if (item.route) {
                    navigate(item.route);
                  }
                }}
                className={cn(
                  'w-full h-10 flex items-center gap-3 px-3 rounded-md transition-colors duration-150 text-left',
                  active
                    ? 'bg-primary-light text-primary border-l-2 border-l-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-[#F3F4F6] border-l-2 border-l-transparent'
                )}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span className={cn('flex-1 text-nav-item', active && 'text-nav-active')}>{item.label}</span>
                {hasChildren && (
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 text-text-tertiary transition-transform duration-200',
                      expanded && 'rotate-180'
                    )}
                  />
                )}
              </button>

              {/* Submenu */}
              {hasChildren && expanded && (
                <div className="mt-0.5 ml-4 pl-3 border-l border-[#E5E7EB]">
                  {item.children!.map((child) => {
                    const childActive = currentPath === child.route && (!child.queryTab || searchParams.get('tab') === child.queryTab);
                    return (
                      <button
                        key={child.key}
                        onClick={() => navigate(child.queryTab ? `${child.route}?tab=${child.queryTab}` : child.route)}
                        className={cn(
                          'w-full h-9 flex items-center px-3 rounded-md transition-colors duration-150 text-left text-body-small',
                          childActive
                            ? 'text-primary bg-primary-light'
                            : 'text-text-secondary hover:text-text-primary hover:bg-[#F3F4F6]'
                        )}
                      >
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="flex-shrink-0 border-t border-[#E5E7EB] p-2">
        <button
          onClick={onToggleCollapse}
          className={cn(
            'w-full h-9 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-[#F3F4F6] transition-colors duration-150',
            collapsed && 'w-10 mx-auto'
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-1.5" />
              <span className="text-body-small">收起</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export { navItems };
export type { NavItem };
