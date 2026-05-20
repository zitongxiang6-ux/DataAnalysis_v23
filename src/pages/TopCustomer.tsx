import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  Crown, ArrowUp, ArrowDown, Minus, RotateCcw, Download, Search,
  Eye,
} from 'lucide-react';
import {
  AreaChart, Area,
} from 'recharts';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { cn } from '@/lib/utils';
import { topCustomerKpis, topCustomersData, top10Distribution } from './monthly/mockData';

const periodTabs = [
  { key: 'monthly', label: '月度' },
  { key: 'quarterly', label: '季度' },
];

export default function TopCustomer() {
  const [periodType, setPeriodType] = useState('monthly');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return topCustomersData;
    return topCustomersData.filter(c =>
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const formatCurrency = (v: number) => `¥${(v / 10000).toFixed(1)}万`;

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-7 h-7 rounded-full bg-[#F59E0B] flex items-center justify-center">
          <Crown className="w-3.5 h-3.5 text-white" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-7 h-7 rounded-full bg-[#9CA3AF] flex items-center justify-center text-white text-xs font-bold">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-7 h-7 rounded-full bg-[#B45309] flex items-center justify-center text-white text-xs font-bold">
          3
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center text-caption font-mono font-semibold text-text-secondary">
        {rank}
      </div>
    );
  };

  const getRankChange = (change: number, previousRank: number | null) => {
    if (previousRank === null) {
      return <StatusBadge variant="info" showDot={false}>NEW</StatusBadge>;
    }
    if (change === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-caption font-medium text-text-tertiary">
          <Minus className="w-3.5 h-3.5" />-
        </span>
      );
    }
    if (change > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-caption font-semibold text-success">
          <ArrowUp className={cn("w-3.5 h-3.5", change >= 5 && "font-bold")} />
          +{change}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-caption font-semibold text-danger">
        <ArrowDown className={cn("w-3.5 h-3.5", change <= -5 && "font-bold")} />
        {change}
      </span>
    );
  };

  const getCustomerTypeBadge = (type: string) => {
    switch (type) {
      case '房地产': return <StatusBadge variant="info">房地产</StatusBadge>;
      case '酒店': return <StatusBadge variant="success">酒店</StatusBadge>;
      case 'ODM': return <StatusBadge variant="warning">ODM</StatusBadge>;
      default: return <StatusBadge variant="neutral">{type}</StatusBadge>;
    }
  };

  // Mini sparkline component
  const MiniSparkline = ({ data }: { data: number[] }) => {
    const chartData = data.map((v, i) => ({ value: v, idx: i }));
    return (
      <div className="w-[60px] h-[24px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`spark-${chartData[0]?.idx ?? 0}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={1.5}
              fill={`url(#spark-${chartData[0]?.idx ?? 0})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="p-page">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-h1 text-text-primary">TOP客户追踪</h1>
        <p className="text-body-small text-text-secondary mt-1">
          按出货额排名前30客户及排名变化追踪
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-[#E5E7EB] rounded-card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <TabSwitcher tabs={periodTabs} activeKey={periodType} onChange={setPeriodType} />
            <span className="text-body-small text-text-secondary">
              {periodType === 'monthly' ? '2025年11月' : '2025年Q4'}
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="搜索客户名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-9 w-[240px] rounded-input border border-[#E5E7EB] bg-surface text-body-small text-text-primary placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
              />
            </div>
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
      <div className="grid grid-cols-4 gap-4 mb-6">
        {topCustomerKpis.map((kpi, i) => (
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

      {/* Ranking Table */}
      <SectionCard
        title="客户排名"
        titleAction={
          <span className="text-caption text-text-secondary">
            {periodType === 'monthly' ? '2025年11月' : '2025年Q4'} · 共{filteredCustomers.length}家
          </span>
        }
        className="mb-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="px-3 py-3 text-center text-table-header text-text-secondary uppercase w-[60px]">排名</th>
                <th className="px-3 py-3 text-left text-table-header text-text-secondary uppercase">排名变化</th>
                <th className="px-3 py-3 text-left text-table-header text-text-secondary uppercase">客户名称</th>
                <th className="px-3 py-3 text-left text-table-header text-text-secondary uppercase">客户类型</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">出货额</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">占比</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">订单数</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">平均订单额</th>
                <th className="px-3 py-3 text-center text-table-header text-text-secondary uppercase">趋势</th>
                <th className="px-3 py-3 text-center text-table-header text-text-secondary uppercase w-[50px]">查看</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr
                  key={customer.customerCode}
                  className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors h-12 animate-slide-up"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <td className="px-3 py-2">
                    <div className="flex justify-center">{getRankBadge(customer.rank)}</div>
                  </td>
                  <td className="px-3 py-2">{getRankChange(customer.change, customer.previousRank)}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-body-small font-medium",
                        customer.rank <= 10 ? 'text-text-primary font-semibold' : 'text-text-primary'
                      )}>
                        {customer.customerName}
                      </span>
                      <span className="text-caption text-text-tertiary">{customer.customerCode}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">{getCustomerTypeBadge(customer.customerType)}</td>
                  <td className="px-3 py-2 text-right font-mono text-body-small font-semibold text-text-primary">
                    {formatCurrency(customer.revenue)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-[60px] h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-chart-blue"
                          style={{ width: `${Math.min(customer.revenueShare * 3, 100)}%` }}
                        />
                      </div>
                      <span className="text-caption font-mono text-text-secondary w-12 text-right">{customer.revenueShare}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-body-small text-text-primary">{customer.orderCount}</td>
                  <td className="px-3 py-2 text-right font-mono text-body-small text-text-primary">{formatCurrency(customer.avgOrderValue)}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center">
                      <MiniSparkline data={customer.trend} />
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-primary-light text-text-secondary hover:text-primary transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Revenue Distribution Chart */}
      <SectionCard
        title="TOP10 收入分布"
        titleAction={
          <button className="text-caption text-primary hover:text-primary-hover transition-colors">
            查看全部30家
          </button>
        }
      >
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={top10Distribution}
              layout="vertical"
              margin={{ left: 20, right: 60, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis type="number" tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`} style={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis type="category" dataKey="name" width={100} style={{ fontSize: 12, fill: '#1F2937' }} />
              <Tooltip
                formatter={((value: number) => [`¥${value.toLocaleString('zh-CN')}`, '出货额']) as any}
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13 }}
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={24}>
                {top10Distribution.map((_, index) => (
                  <Cell key={index} fill={
                    index === 0 ? '#1E40AF' :
                    index === 1 ? '#3B82F6' :
                    index === 2 ? '#60A5FA' :
                    '#3B82F6'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-caption text-text-secondary">
          <p>
            TOP 3 客户合计占比：
            <span className="font-semibold text-text-primary">
              {(top10Distribution[0]?.share ?? 0) + (top10Distribution[1]?.share ?? 0) + (top10Distribution[2]?.share ?? 0)}%
            </span>
            · 集中度：
            <span className="font-semibold text-text-primary">高</span>
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
