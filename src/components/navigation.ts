import {
  Activity,
  FileText,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  route?: string;
  hidden?: boolean;
  children?: { key: string; label: string; route: string; queryTab?: string; hidden?: boolean }[];
}

export const navItems: NavItem[] = [
  {
    key: 'sales-reports',
    label: '销售报告管理',
    icon: FileText,
    route: '/report-center',
    hidden: true,
  },
  {
    key: 'my-sales-reports',
    label: '我的销售报告',
    icon: FileText,
    route: '/my-sales-reports',
    hidden: true,
  },
  {
    key: 'report-query',
    label: '数据中心',
    icon: Activity,
    route: '/realtime-reports',
    children: [
      { key: 'my-shipping', label: '我的开单统计', route: '/realtime-reports', queryTab: 'my-shipping' },
      { key: 'department', label: '部门开单统计', route: '/realtime-reports', queryTab: 'department' },
      { key: 'salesperson-monthly', label: '业务开单统计', route: '/realtime-reports', queryTab: 'salesperson-monthly' },
      { key: 'channel', label: '客户开单统计', route: '/realtime-reports', queryTab: 'channel' },
      { key: 'target', label: '签约渠道商季度目标统计', route: '/realtime-reports', queryTab: 'target' },
      { key: 'rebate', label: '返点测算', route: '/realtime-reports', queryTab: 'rebate', hidden: true },
      { key: 'config', label: '业绩归属配置', route: '/realtime-reports', queryTab: 'config' },
      { key: 'manual-update', label: '手动更新数据', route: '/realtime-reports', queryTab: 'manual-update' },
      { key: 'sales-target-management', label: '销售目标管理', route: '/realtime-reports', queryTab: 'sales-target-management' },
    ],
  },
];

export function getBreadcrumb(
  pathname: string,
  searchParams: URLSearchParams
): { label: string; route?: string }[] {
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
    '/realtime-reports': '数据中心',
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
