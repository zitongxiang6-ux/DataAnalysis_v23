import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '@/components/Layout';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { ChartSection } from '@/components/ui/ChartSection';
import { cn } from '@/lib/utils';
import {
  getKpiData,
  getQuickAccessReports,
  getActivityFeed,
  getAlerts,
  getMonthlyTrendData,
  getChannelCompositionData,
} from '@/lib/mockData';
import {
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [inView, setInView] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString('zh-CN'));

  useEffect(() => {
    setInView(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('zh-CN'));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const kpiData = getKpiData();
  const reports = getQuickAccessReports();
  const activities = getActivityFeed();
  const alerts = getAlerts();
  const monthlyTrend = getMonthlyTrendData();
  const channelComposition = getChannelCompositionData();

  const [trendTab, setTrendTab] = useState('amount');

  const reportTypeVariant = (type: string): Parameters<typeof StatusBadge>[0]['variant'] => {
    switch (type) {
      case 'weekly': return 'info';
      case 'monthly': return 'processing';
      case 'quarterly': return 'neutral';
      default: return 'neutral';
    }
  };

  const reportTypeLabel = (type: string) => {
    switch (type) {
      case 'weekly': return '周报';
      case 'monthly': return '月报';
      case 'quarterly': return '季报';
      default: return type;
    }
  };

  const activityIcon = (type: string) => {
    switch (type) {
      case 'success': return <div className="w-2 h-2 rounded-full bg-success flex-shrink-0 mt-1.5" />;
      case 'info': return <div className="w-2 h-2 rounded-full bg-info flex-shrink-0 mt-1.5" />;
      case 'warning': return <div className="w-2 h-2 rounded-full bg-warning flex-shrink-0 mt-1.5" />;
      default: return <div className="w-2 h-2 rounded-full bg-text-tertiary flex-shrink-0 mt-1.5" />;
    }
  };

  return (
    <Layout>
      <div ref={dashboardRef} className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-h1 text-text-primary mb-1">Dashboard Overview</h1>
            <p className="text-body-small text-text-secondary">
              2025年12月1日 ~ 2025年12月7日
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full border border-[#E5E7EB]">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-caption font-medium text-success">Live</span>
              <span className="text-caption text-text-tertiary ml-1">{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Section 1: KPI Cards Row */}
        <div
          className={cn(
            'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4',
          )}
        >
          {kpiData.map((kpi, index) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              prefix={kpi.prefix}
              suffix={kpi.suffix}
              decimals={kpi.decimals ?? 0}
              format={kpi.format}
              trend={kpi.trend}
              comparison={kpi.comparison}
              sparkline={kpi.sparkline}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Monthly Trend Chart */}
          <ChartSection
            title="月度趋势"
            titleAction={
              <TabSwitcher
                tabs={[
                  { key: 'amount', label: '金额视图' },
                  { key: 'count', label: '订单视图' },
                ]}
                activeKey={trendTab}
                onChange={setTrendTab}
              />
            }
          >
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(val: number) =>
                      trendTab === 'amount' ? `¥${(val / 10000).toFixed(0)}万` : `${val}`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 8,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.03)',
                      padding: 12,
                      fontSize: 13,
                    }}
                    formatter={((value: number) =>
                      trendTab === 'amount'
                        ? [`¥${(value as number).toLocaleString('zh-CN')}`, '实际金额']
                        : [`${(value as number).toLocaleString('zh-CN')}单`, '订单数']
                    ) as any}
                  />
                  {trendTab === 'amount' ? (
                    <>
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fill="url(#colorRevenue)"
                        name="实际金额"
                        animationDuration={1000}
                      />
                      <Area
                        type="monotone"
                        dataKey="target"
                        stroke="#9CA3AF"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="url(#colorTarget)"
                        name="目标金额"
                        animationDuration={1000}
                      />
                    </>
                  ) : (
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#06B6D4"
                      strokeWidth={2}
                      fill="url(#colorRevenue)"
                      name="订单数"
                      animationDuration={1000}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartSection>

          {/* Channel Composition */}
          <ChartSection title="渠道构成">
            <div className="h-[300px] w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelComposition}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={800}
                    animationBegin={200}
                  >
                    {channelComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 8,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.03)',
                      padding: 12,
                      fontSize: 13,
                    }}
                    formatter={((value: number, name: string) => [`${value}%`, name]) as any}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span style={{ fontSize: 12, color: '#6B7280' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartSection>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Section 2: Quick Access Reports (2 columns) */}
          <div className="xl:col-span-2">
            <SectionCard
              title="最近报告"
              titleAction={
                <button
                  onClick={() => navigate('/report-center')}
                  className="text-body-small text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
                >
                  查看全部
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report, index) => (
                  <button
                    key={report.id}
                    onClick={() => navigate('/report-center')}
                    className={cn(
                      'text-left bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-4',
                      'transition-all duration-150 hover:border-primary/30 hover:shadow-md',
                      'active:scale-[0.98]',
                      'opacity-0 translate-y-3',
                      inView && 'animate-slide-up'
                    )}
                    style={{ animationDelay: `${500 + index * 80}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <StatusBadge variant={reportTypeVariant(report.type)}>
                        {reportTypeLabel(report.type)}
                      </StatusBadge>
                      <StatusBadge variant="success">就绪</StatusBadge>
                    </div>
                    <p className="text-body font-medium text-text-primary mb-3">{report.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-caption text-text-secondary">
                        生成于 {report.time}
                      </span>
                      <ArrowRight className="w-4 h-4 text-text-tertiary" />
                    </div>
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Section 3: Activity Feed */}
          <div>
            <SectionCard
              title="最近动态"
              titleAction={
                <span className="text-caption text-text-secondary">{activities.length} 条动态</span>
              }
            >
              <div className="relative pl-4">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#E5E7EB]" />

                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className={cn(
                        'relative flex items-start gap-3 opacity-0',
                        inView && 'animate-slide-up'
                      )}
                      style={{ animationDelay: `${700 + index * 60}ms` }}
                    >
                      {/* Dot */}
                      {activityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-medium text-text-primary">{activity.title}</p>
                        <p className="text-body-small text-text-secondary mt-0.5 line-clamp-2">{activity.description}</p>
                        <p className="text-caption text-text-tertiary mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Section 4: Alerts & Warnings */}
        <SectionCard
          title={
            <div className="flex items-center gap-2">
              <span>系统告警</span>
              <span className="w-5 h-5 rounded-full bg-danger text-white text-[11px] font-bold flex items-center justify-center">
                {alerts.length}
              </span>
            </div>
          }
        >
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className={cn(
                  'relative rounded-card overflow-hidden opacity-0',
                  alert.severity === 'critical' && 'bg-danger-light animate-slide-in-right',
                  alert.severity === 'medium' && 'bg-warning-light animate-slide-in-right',
                )}
                style={{
                  animationDelay: `${900 + index * 100}ms`,
                }}
              >
                {/* Left border */}
                <div
                  className={cn(
                    'absolute left-0 top-0 bottom-0 w-[3px]',
                    alert.severity === 'critical' && 'bg-danger',
                    alert.severity === 'medium' && 'bg-warning',
                    alert.severity === 'critical' && 'animate-pulse-dot'
                  )}
                />
                <div className="pl-4 pr-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-body font-semibold mb-1',
                        alert.severity === 'critical' && 'text-danger',
                        alert.severity === 'medium' && 'text-warning',
                      )}>
                        {alert.title}
                      </p>
                      <p className="text-body-small text-text-secondary">
                        {alert.description}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(alert.route)}
                      className="text-body-small text-primary hover:text-primary-hover hover:underline flex-shrink-0 transition-colors"
                    >
                      {alert.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Layout>
  );
}
