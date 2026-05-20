import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  RotateCcw, Download,
} from 'lucide-react';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';
import { annualTargetKpis, quartersData, monthlyTrendData, departmentQuarterlyData } from './monthly/mockData';
import type { QuarterData } from './monthly/mockData';

const viewTabs = [
  { key: 'amount', label: '金额视角' },
  { key: 'rate', label: '完成率视角' },
];

export default function QuarterlyTarget() {
  const [viewMode, setViewMode] = useState('amount');
  const [year, setYear] = useState('2026');

  const formatCurrency = (v: number) => `¥${(v / 10000).toFixed(0)}万`;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '正常': return <StatusBadge variant="success">正常</StatusBadge>;
      case '风险': return <StatusBadge variant="warning">风险</StatusBadge>;
      case '滞后': return <StatusBadge variant="danger">滞后</StatusBadge>;
      default: return <StatusBadge variant="neutral">{status}</StatusBadge>;
    }
  };

  return (
    <div className="p-page">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-h1 text-text-primary">季度目标分解追踪</h1>
        <p className="text-body-small text-text-secondary mt-1">
          年度目标按季度分解，实时追踪各部门达成进度
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-[#E5E7EB] rounded-card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-9 px-3 rounded-input border border-[#E5E7EB] bg-surface text-body-small text-text-primary focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
            >
              <option value="2026">2026财年</option>
              <option value="2025">2025财年</option>
              <option value="2024">2024财年</option>
            </select>

            <TabSwitcher tabs={viewTabs} activeKey={viewMode} onChange={setViewMode} />
          </div>

          <div className="flex items-center gap-2">
            <button className="h-9 px-3 flex items-center gap-1.5 text-body-small text-text-secondary border border-[#E5E7EB] rounded-button hover:bg-[#F3F4F6] hover:text-text-primary transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              刷新
            </button>
            <button className="h-9 px-3 flex items-center gap-1.5 text-body-small text-text-secondary border border-[#E5E7EB] rounded-button hover:bg-[#F3F4F6] hover:text-text-primary transition-colors">
              <Download className="w-3.5 h-3.5" />
              导出
            </button>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {annualTargetKpis.map((kpi, i) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            prefix={kpi.prefix}
            suffix={kpi.suffix}
            decimals={kpi.decimals}
            format={kpi.format}
            trend={kpi.trend}
            comparison={kpi.comparison}
            delay={i * 100}
          />
        ))}
      </div>

      {/* Quarterly Breakdown Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {quartersData.map((q, index) => (
          <QuarterCard key={q.quarter} data={q} index={index} viewMode={viewMode} formatCurrency={formatCurrency} />
        ))}
      </div>

      {/* Trend Chart */}
      <SectionCard title="月度进度趋势" className="mb-6">
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" style={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`} style={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip
                formatter={((value: number, name: string) => {
                  const labels: Record<string, string> = { actual: '实际完成', target: '目标', cumulative: '累计完成' };
                  return [`¥${(value / 10000).toFixed(0)}万`, labels[name] || name];
                }) as any}
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13 }}
              />
              <ReferenceLine y={50000000 / 12} stroke="#9CA3AF" strokeDasharray="4 4" label={{ value: '月均目标', position: 'right', fill: '#9CA3AF', fontSize: 12 }} />
              <Area type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} fill="url(#colorActual)" name="actual" />
              <Area type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={1} strokeDasharray="4 4" fill="none" name="target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Department Breakdown Table */}
      <SectionCard title="部门目标分解">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="px-3 py-3 text-left text-table-header text-text-secondary uppercase">部门</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">年度目标</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">Q1 目标/实际</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">Q2 目标/实际</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">Q3 目标/实际</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">Q4 目标/实际</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">YTD 实际</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">达成率</th>
                <th className="px-3 py-3 text-center text-table-header text-text-secondary uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {departmentQuarterlyData.map((dept) => (
                <tr key={dept.department} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors h-12">
                  <td className="px-3 py-2 text-body-small font-medium text-text-primary">{dept.department}</td>
                  <td className="px-3 py-2 text-right font-mono text-body-small text-text-primary">{formatCurrency(dept.annualTarget)}</td>
                  <QuarterCell target={dept.q1Target} actual={dept.q1Actual} rate={dept.q1Rate} formatCurrency={formatCurrency} />
                  <QuarterCell target={dept.q2Target} actual={dept.q2Actual} rate={dept.q2Rate} formatCurrency={formatCurrency} />
                  <QuarterCell target={dept.q3Target} actual={dept.q3Actual} rate={dept.q3Rate} formatCurrency={formatCurrency} />
                  <QuarterCell target={dept.q4Target} actual={dept.q4Actual} rate={dept.q4Rate} formatCurrency={formatCurrency} />
                  <td className="px-3 py-2 text-right font-mono text-body-small font-semibold text-text-primary">{formatCurrency(dept.ytdActual)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            dept.completionRate >= 100 ? 'bg-success' :
                            dept.completionRate >= 80 ? 'bg-chart-blue' : 'bg-danger'
                          )}
                          style={{ width: `${Math.min(dept.completionRate, 100)}%` }}
                        />
                      </div>
                      <span className="text-body-small font-mono text-text-primary w-12 text-right">{dept.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">{getStatusBadge(dept.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── Quarter Card ─── */
function QuarterCard({ data, index, viewMode, formatCurrency }: {
  data: QuarterData; index: number; viewMode: string; formatCurrency: (v: number) => string;
}) {
  const barWidth = viewMode === 'amount'
    ? `${Math.min((data.actual / data.target) * 100, 100)}%`
    : `${Math.min(data.completionRate, 100)}%`;

  const barColor = getBarColor(data.completionRate);

  return (
    <div
      className={cn(
        'bg-surface border rounded-card shadow-sm p-5 animate-slide-up',
        data.completionRate < 80 ? 'border-l-4 border-l-danger border-[#E5E7EB]' :
        data.completionRate < 100 ? 'border-l-4 border-l-warning border-[#E5E7EB]' :
        'border-l-4 border-l-success border-[#E5E7EB]'
      )}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-h2 text-text-primary">{data.quarter}</h2>
        <StatusBadge variant={data.status === 'completed' ? 'success' : 'info'}>
          {data.status === 'completed' ? '已完成' : '进行中'}
        </StatusBadge>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-[#F3F4F6] rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: barWidth, backgroundColor: barColor }}
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-caption text-text-secondary mb-0.5">目标</p>
          <p className="text-body-small font-mono font-medium text-text-primary">{formatCurrency(data.target)}</p>
        </div>
        <div>
          <p className="text-caption text-text-secondary mb-0.5">实际</p>
          <p className="text-body-small font-mono font-medium text-text-primary">{formatCurrency(data.actual)}</p>
        </div>
        <div>
          <p className="text-caption text-text-secondary mb-0.5">达成率</p>
          <p className="text-body-small font-mono font-semibold" style={{ color: barColor }}>{data.completionRate}%</p>
        </div>
        <div>
          <p className="text-caption text-text-secondary mb-0.5">差额</p>
          <p className={cn(
            "text-body-small font-mono font-semibold",
            data.gap < 0 ? 'text-danger' : 'text-success'
          )}>
            {data.gap > 0 ? '+' : ''}{formatCurrency(data.gap)}
          </p>
        </div>
      </div>
    </div>
  );
}

function getBarColor(rate: number) {
  if (rate >= 100) return '#10B981';
  if (rate >= 80) return '#3B82F6';
  return '#EF4444';
}

/* ─── Quarter Cell ─── */
function QuarterCell({ target, actual, rate, formatCurrency }: {
  target: number; actual: number; rate: number; formatCurrency: (v: number) => string;
}) {
  return (
    <td className="px-3 py-2">
      <div className="flex flex-col items-end gap-1">
        <span className="font-mono text-caption text-text-secondary">
          {formatCurrency(target)} / <span className="text-text-primary font-medium">{formatCurrency(actual)}</span>
        </span>
        <div className="w-8 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full',
              rate >= 100 ? 'bg-success' : rate >= 80 ? 'bg-chart-blue' : 'bg-danger'
            )}
            style={{ width: `${Math.min(rate, 100)}%` }}
          />
        </div>
      </div>
    </td>
  );
}
