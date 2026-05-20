import { useState, useRef, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  ChevronRight,
  User,
  LogOut,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { navItems } from './Sidebar';

interface NavbarProps {
  className?: string;
}

function getBreadcrumb(pathname: string, searchParams: URLSearchParams): { label: string; route?: string }[] {
  const segments: { label: string; route?: string }[] = [];

  for (const item of navItems) {
    if (item.route && pathname === item.route && !item.children) {
      segments.push({ label: item.label, route: item.route });
      return segments;
    }
    if (item.children) {
      for (const child of item.children) {
        const tabMatch = !child.queryTab || searchParams.get('tab') === child.queryTab;
        if (pathname === child.route && tabMatch) {
          segments.push({ label: item.label, route: item.route });
          segments.push({ label: child.label, route: child.route + (child.queryTab ? `?tab=${child.queryTab}` : '') });
          return segments;
        }
      }
      if (pathname === item.route) {
        segments.push({ label: item.label, route: item.route });
        return segments;
      }
    }
  }

  const routeMap: Record<string, string> = {
    '/report-center': '销售报告管理',
    '/my-sales-reports': '我的销售报告',
    '/weekly-report': '周报统计',
    '/monthly-quarterly': '月报/季报',
    '/channel-dealer': '渠道经销商',
    '/quarterly-target': '季度目标追踪',
    '/rebate-calculation': '返利计算',
    '/realtime-reports': '报表查询',
    '/top-customer': '大客户追踪',
    '/rebate-review': '返点复核',
  };

  if (routeMap[pathname]) {
    segments.push({ label: routeMap[pathname], route: pathname });
  }

  if (pathname.startsWith('/weekly-report/company/')) {
    segments.push({ label: '销售报告管理', route: '/report-center' });
    segments.push({ label: '公司级周报', route: pathname });
  }

  if (pathname.startsWith('/weekly-report/department/')) {
    segments.push({ label: '销售报告管理', route: '/report-center' });
    segments.push({ label: '部门级周报', route: pathname });
  }

  if (pathname.startsWith('/monthly-report/company/')) {
    segments.push({ label: '销售报告管理', route: '/report-center' });
    segments.push({ label: '公司级月报', route: pathname });
  }

  if (pathname.startsWith('/monthly-report/department/')) {
    segments.push({ label: '销售报告管理', route: '/report-center' });
    segments.push({ label: '部门级月报', route: pathname });
  }

  if (pathname.startsWith('/quarterly-report/department/')) {
    segments.push({ label: '销售报告管理', route: '/report-center' });
    segments.push({ label: '部门级季报', route: pathname });
  }

  return segments;
}

export function Navbar({ className }: NavbarProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const breadcrumb = getBreadcrumb(location.pathname, searchParams);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: '1', title: '周报已生成', desc: '第48周周报已就绪', time: '2小时前', unread: true },
    { id: '2', title: '目标预警', desc: 'Q4完成率低于80%', time: '4小时前', unread: true },
    { id: '3', title: '数据同步完成', desc: '每日数据同步成功', time: '1天前', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-topbar bg-surface border-b border-[#E5E7EB] z-40 flex items-center justify-between px-6 transition-all duration-300',
        className
      )}
      style={{ left: 'var(--sidebar-width, 240px)' }}
    >
      {/* Left: Breadcrumb */}
      <nav className="flex items-center gap-1 text-caption text-text-secondary">
        {breadcrumb.map((item, index) => (
          <div key={item.label} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="w-3 h-3 text-text-tertiary" />}
            {index === breadcrumb.length - 1 ? (
              <span className="text-text-primary font-medium">{item.label}</span>
            ) : (
              <span>{item.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-[#F3F4F6] transition-colors">
          <Search className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-[#F3F4F6] transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface rounded-card shadow-xl border border-[#E5E7EB] overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center justify-between">
                <span className="text-body-small font-semibold text-text-primary">通知</span>
                <button className="text-caption text-primary hover:text-primary-hover">全部标记已读</button>
              </div>
              <div className="max-h-72 overflow-y-auto custom-scrollbar">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      'px-4 py-3 border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors cursor-pointer',
                      notif.unread && 'bg-primary-light/30'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', notif.unread ? 'bg-primary' : 'bg-text-tertiary')} />
                      <div className="flex-1 min-w-0">
                        <p className="text-body-small font-medium text-text-primary truncate">{notif.title}</p>
                        <p className="text-caption text-text-secondary truncate">{notif.desc}</p>
                        <p className="text-caption text-text-tertiary mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-md hover:bg-[#F3F4F6] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-body-small font-medium text-text-primary">管理员</span>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-card shadow-xl border border-[#E5E7EB] overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-[#F3F4F6]">
                <p className="text-body-small font-semibold text-text-primary">系统管理员</p>
                <p className="text-caption text-text-secondary">admin@analyticshub.com</p>
              </div>
              <div className="py-1">
                <button className="w-full px-4 py-2 flex items-center gap-2.5 text-body-small text-text-secondary hover:bg-[#F3F4F6] hover:text-text-primary transition-colors text-left">
                  <User className="w-4 h-4" />
                  个人资料
                </button>
                <button className="w-full px-4 py-2 flex items-center gap-2.5 text-body-small text-text-secondary hover:bg-[#F3F4F6] hover:text-text-primary transition-colors text-left">
                  <Settings className="w-4 h-4" />
                  账户设置
                </button>
                <button className="w-full px-4 py-2 flex items-center gap-2.5 text-body-small text-text-secondary hover:bg-[#F3F4F6] hover:text-text-primary transition-colors text-left">
                  <HelpCircle className="w-4 h-4" />
                  帮助中心
                </button>
              </div>
              <div className="border-t border-[#F3F4F6] py-1">
                <button className="w-full px-4 py-2 flex items-center gap-2.5 text-body-small text-danger hover:bg-danger-light transition-colors text-left">
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { getBreadcrumb };
