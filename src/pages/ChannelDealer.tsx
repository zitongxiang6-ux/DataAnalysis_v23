import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  ChevronDown, ChevronRight, RotateCcw, Download, Search,
} from 'lucide-react';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TrendIndicator } from '@/components/ui/TrendIndicator';
import { cn } from '@/lib/utils';
import { dealerKpis, dealerData } from './monthly/mockData';
import type { CustomerDetail } from './monthly/mockData';

export default function ChannelDealer() {
  const [channelType, setChannelType] = useState<'all' | 'domestic' | 'international'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredDealers = useMemo(() => {
    let data = [...dealerData];
    if (channelType !== 'all') {
      data = data.filter(d => d.channelType === channelType);
    }
    if (searchQuery) {
      data = data.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return data;
  }, [channelType, searchQuery]);

  const chartData = useMemo(() => {
    return filteredDealers
      .map(d => ({ name: d.name, amount: d.shippingAmount, type: d.channelType }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }, [filteredDealers]);

  const toggleExpand = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  const formatCurrency = (v: number) => `¥${(v / 10000).toFixed(1)}万`;

  return (
    <div className="p-page">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-h1 text-text-primary">渠道商签约统计</h1>
        <p className="text-body-small text-text-secondary mt-1">
          国内与国际渠道商签约、出货及完成率分析
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-[#E5E7EB] rounded-card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Channel Type */}
            <select
              value={channelType}
              onChange={(e) => setChannelType(e.target.value as 'all' | 'domestic' | 'international')}
              className="h-9 px-3 rounded-input border border-[#E5E7EB] bg-surface text-body-small text-text-primary focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
            >
              <option value="all">全部渠道</option>
              <option value="domestic">国内渠道</option>
              <option value="international">国际渠道</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="搜索渠道商名称..."
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
        {dealerKpis.map((kpi, i) => (
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

      {/* Bar Chart */}
      <SectionCard title="渠道商出货额排名 (TOP10)" className="mb-6">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis type="number" tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`} style={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis type="category" dataKey="name" width={140} style={{ fontSize: 12, fill: '#1F2937' }} />
              <Tooltip
                formatter={((value: number) => [formatCurrency(value), '出货额']) as any}
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13 }}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.type === 'domestic' ? '#3B82F6' : '#06B6D4'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-4 text-caption text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#3B82F6]" />
            <span>国内渠道</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#06B6D4]" />
            <span>国际渠道</span>
          </div>
        </div>
      </SectionCard>

      {/* Dealer Detail Table */}
      <SectionCard title="渠道商明细" titleAction={<span className="text-caption text-text-secondary">共 {filteredDealers.length} 家</span>}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="w-10 px-3 py-2" />
                <th className="px-3 py-2 text-left text-table-header text-text-secondary uppercase">渠道商名称</th>
                <th className="px-3 py-2 text-left text-table-header text-text-secondary uppercase">渠道类型</th>
                <th className="px-3 py-2 text-right text-table-header text-text-secondary uppercase">出货额</th>
                <th className="px-3 py-2 text-right text-table-header text-text-secondary uppercase">签约金额</th>
                <th className="px-3 py-2 text-right text-table-header text-text-secondary uppercase">完成率</th>
                <th className="px-3 py-2 text-right text-table-header text-text-secondary uppercase">同期对比</th>
                <th className="px-3 py-2 text-right text-table-header text-text-secondary uppercase">未结束订单</th>
              </tr>
            </thead>
            <tbody>
              {filteredDealers.map((dealer) => (
                <>
                  <tr
                    key={dealer.id}
                    onClick={() => toggleExpand(dealer.id)}
                    className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors cursor-pointer h-12"
                  >
                    <td className="px-3 py-2">
                      {expandedRow === dealer.id ? (
                        <ChevronDown className="w-4 h-4 text-text-secondary" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-text-secondary" />
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-body-small font-medium text-text-primary">{dealer.name}</span>
                        <span className="text-caption text-text-tertiary">{dealer.code}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge variant={dealer.channelType === 'domestic' ? 'info' : 'neutral'}>
                        {dealer.channelType === 'domestic' ? '国内' : '国际'}
                      </StatusBadge>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-body-small text-text-primary">{formatCurrency(dealer.shippingAmount)}</td>
                    <td className="px-3 py-2 text-right font-mono text-body-small text-text-primary">{formatCurrency(dealer.signingAmount)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-600',
                              dealer.completionRate >= 100 ? 'bg-success' :
                              dealer.completionRate >= 80 ? 'bg-chart-blue' : 'bg-danger'
                            )}
                            style={{ width: `${Math.min(dealer.completionRate, 100)}%` }}
                          />
                        </div>
                        <span className="text-body-small font-mono text-text-primary w-12 text-right">{dealer.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <TrendIndicator trend={dealer.yoyChange} comparison="" />
                    </td>
                    <td className={cn(
                      "px-3 py-2 text-right font-mono text-body-small",
                      dealer.openOrders > 500000 ? 'text-warning font-medium' : 'text-text-primary'
                    )}>
                      {formatCurrency(dealer.openOrders)}
                    </td>
                  </tr>
                  {/* Expanded Row */}
                  {expandedRow === dealer.id && (
                    <tr key={`${dealer.id}-expanded`}>
                      <td colSpan={8} className="px-4 py-4 bg-[#FAFAFA] border-b border-[#F3F4F6]">
                        <div className="pl-8">
                          <p className="text-caption text-text-secondary mb-2 font-semibold uppercase tracking-wider">客户明细</p>
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-[#E5E7EB]">
                                <th className="py-2 text-left text-caption text-text-secondary">客户名称</th>
                                <th className="py-2 text-left text-caption text-text-secondary">客户类型</th>
                                <th className="py-2 text-right text-caption text-text-secondary">出货额</th>
                                <th className="py-2 text-right text-caption text-text-secondary">订单数</th>
                                <th className="py-2 text-right text-caption text-text-secondary">最近订单</th>
                                <th className="py-2 text-left text-caption text-text-secondary">业务员</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dealer.customers.map((customer: CustomerDetail, idx: number) => (
                                <tr key={idx} className="border-b border-[#F3F4F6] last:border-0">
                                  <td className="py-2 text-body-small text-text-primary">{customer.customerName}</td>
                                  <td className="py-2 text-body-small text-text-secondary">{customer.customerType}</td>
                                  <td className="py-2 text-right font-mono text-body-small text-text-primary">{formatCurrency(customer.shippingAmount)}</td>
                                  <td className="py-2 text-right font-mono text-body-small text-text-primary">{customer.orderCount}</td>
                                  <td className="py-2 text-right font-mono text-caption text-text-secondary">{customer.lastOrder}</td>
                                  <td className="py-2 text-body-small text-text-secondary">{customer.salesperson}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
