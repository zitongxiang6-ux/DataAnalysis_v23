import { useState } from 'react';
import { X, Download, Share2, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  trendChartData, revenueBreakdownData, doughnutData, top10Data,
  comparisonData, rankingData, kpiOverviewData
} from './mockData';
import type { Report } from './types';

const viewerTabs = [
  { key: 'overview', label: '核心指标总览' },
  { key: 'trend', label: '环比同比分析' },
  { key: 'ranking', label: '排名分析' },
  { key: 'charts', label: '趋势图' },
];

interface ReportViewerModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
  onShare: () => void;
}

export function ReportViewerModal({ report, open, onClose, onShare }: ReportViewerModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!report || !open) return null;

  const handleDownloadPDF = () => {
    toast.success('PDF 下载已开始');
    setTimeout(() => {
      toast.success('PDF 下载完成');
    }, 1500);
  };

  const typeLabelMap: Record<string, string> = {
    weekly: '周报',
    monthly: '月报',
    quarterly: '季报',
  };

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex flex-col bg-surface animate-fade-in',
    )}>
      <Toaster position="bottom-right" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-[#E5E7EB] bg-surface flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F3F4F6] transition-colors text-text-secondary"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-h2 text-text-primary">{report.name}</h2>
            <p className="text-caption text-text-secondary">
              {typeLabelMap[report.type]} · {report.period}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TabSwitcher tabs={viewerTabs} activeKey={activeTab} onChange={setActiveTab} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            className="gap-1.5 text-body-small"
          >
            <Download className="w-4 h-4" />
            下载 PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="gap-1.5 text-body-small"
          >
            <Share2 className="w-4 h-4" />
            分享链接
          </Button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F3F4F6] transition-colors text-text-secondary"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-page-bg">
        {/* Tab: Core KPIs */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              {kpiOverviewData.map((kpi, i) => (
                <div key={i} className="bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-5">
                  <p className="text-label uppercase text-text-secondary tracking-wider mb-2">{kpi.label}</p>
                  <p className="text-data-large text-text-primary mb-2">
                    {kpi.prefix}{kpi.format
                      ? kpi.value >= 10000
                        ? (kpi.value / 10000).toFixed(2) + '万'
                        : kpi.value.toLocaleString('zh-CN')
                      : kpi.value.toLocaleString('zh-CN')}{kpi.suffix || ''}
                  </p>
                  <p className={cn(
                    'text-caption font-semibold',
                    kpi.trend >= 0 ? 'text-success' : 'text-danger'
                  )}>
                    {kpi.trend >= 0 ? '+' : ''}{kpi.trend}% vs 上期
                  </p>
                </div>
              ))}
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Revenue Breakdown */}
              <div className="bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-5">
                <h3 className="text-h3 text-text-primary mb-4">营收构成</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="text-left text-table-header text-text-secondary py-2">类别</th>
                      <th className="text-right text-table-header text-text-secondary py-2">金额</th>
                      <th className="text-right text-table-header text-text-secondary py-2">占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueBreakdownData.map((item, i) => (
                      <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                        <td className="py-2.5 text-table-cell text-text-primary">{item.category}</td>
                        <td className="py-2.5 text-table-cell text-text-primary text-right font-mono">
                          ¥{(item.amount / 10000).toFixed(1)}万
                        </td>
                        <td className="py-2.5 text-right">
                          <span className="text-table-cell text-text-primary">{item.percentage}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Top Performers */}
              <div className="bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-5">
                <h3 className="text-h3 text-text-primary mb-4">业绩排名</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="text-left text-table-header text-text-secondary py-2">排名</th>
                      <th className="text-left text-table-header text-text-secondary py-2">部门</th>
                      <th className="text-right text-table-header text-text-secondary py-2">金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingData.slice(0, 5).map((item, i) => (
                      <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                        <td className="py-2.5">
                          <span className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold',
                            i === 0 ? 'bg-warning-light text-warning' :
                            i === 1 ? 'bg-gray-200 text-gray-600' :
                            i === 2 ? 'bg-orange-100 text-orange-600' :
                            'bg-gray-100 text-gray-500'
                          )}>
                            {item.rank}
                          </span>
                        </td>
                        <td className="py-2.5 text-table-cell text-text-primary">{item.name}</td>
                        <td className="py-2.5 text-table-cell text-text-primary text-right font-mono">
                          ¥{(item.amount / 10000).toFixed(0)}万
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Trend Analysis */}
        {activeTab === 'trend' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-6">
              <h3 className="text-h3 text-text-primary mb-4">本周 vs 上周趋势</h3>
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip
                      contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: '0 4px 6px rgba(0,0,0,0.04)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="current" name="本期" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="previous" name="上期" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-6">
              <h3 className="text-h3 text-text-primary mb-4">指标对比</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="text-left text-table-header text-text-secondary py-3">指标</th>
                    <th className="text-right text-table-header text-text-secondary py-3">本期</th>
                    <th className="text-right text-table-header text-text-secondary py-3">上期</th>
                    <th className="text-right text-table-header text-text-secondary py-3">变化</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, i) => (
                    <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                      <td className="py-3 text-table-cell text-text-primary">{item.metric}</td>
                      <td className="py-3 text-table-cell text-text-primary text-right font-medium">{item.current}</td>
                      <td className="py-3 text-table-cell text-text-tertiary text-right">{item.previous}</td>
                      <td className="py-3 text-right">
                        <span className={cn(
                          'text-table-cell font-semibold',
                          item.change.startsWith('+') ? 'text-success' : 'text-danger'
                        )}>
                          {item.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Rankings */}
        {activeTab === 'ranking' && (
          <div className="bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-6 animate-fade-in">
            <h3 className="text-h3 text-text-primary mb-4">部门业绩排名</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="text-left text-table-header text-text-secondary py-3 w-16">排名</th>
                  <th className="text-left text-table-header text-text-secondary py-3">部门</th>
                  <th className="text-right text-table-header text-text-secondary py-3">业绩金额</th>
                  <th className="text-right text-table-header text-text-secondary py-3">目标</th>
                  <th className="text-right text-table-header text-text-secondary py-3">完成率</th>
                  <th className="text-right text-table-header text-text-secondary py-3">环比变化</th>
                </tr>
              </thead>
              <tbody>
                {rankingData.map((item, i) => (
                  <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                    <td className="py-3">
                      <span className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold',
                        i === 0 ? 'bg-warning-light text-warning' :
                        i === 1 ? 'bg-gray-200 text-gray-600' :
                        i === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-500'
                      )}>
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-3 text-table-cell text-text-primary font-medium">{item.name}</td>
                    <td className="py-3 text-table-cell text-text-primary text-right font-mono">
                      ¥{(item.amount / 10000).toFixed(0)}万
                    </td>
                    <td className="py-3 text-table-cell text-text-secondary text-right font-mono">
                      ¥{(item.target / 10000).toFixed(0)}万
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              item.completion >= 90 ? 'bg-success' :
                              item.completion >= 75 ? 'bg-warning' :
                              'bg-danger'
                            )}
                            style={{ width: `${Math.min(item.completion, 100)}%` }}
                          />
                        </div>
                        <span className={cn(
                          'text-table-cell font-medium',
                          item.completion >= 90 ? 'text-success' :
                          item.completion >= 75 ? 'text-warning' :
                          'text-danger'
                        )}>
                          {item.completion.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span className={cn(
                        'text-table-cell font-semibold',
                        item.change >= 0 ? 'text-success' : 'text-danger'
                      )}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Charts */}
        {activeTab === 'charts' && (
          <div className="grid grid-cols-2 gap-6 animate-fade-in">
            {/* Revenue Composition */}
            <div className="bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-5">
              <h4 className="text-h3 text-text-primary mb-4">营收构成</h4>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={doughnutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {doughnutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend Area */}
            <div className="bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-5">
              <h4 className="text-h3 text-text-primary mb-4">趋势分析</h4>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB' }} />
                    <Area type="monotone" dataKey="current" name="本期" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 10 Bar */}
            <div className="bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-5">
              <h4 className="text-h3 text-text-primary mb-4">TOP 10 客户</h4>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top10Data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11, fill: '#6B7280' }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB' }} />
                    <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grouped Bar */}
            <div className="bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-5">
              <h4 className="text-h3 text-text-primary mb-4">分类对比</h4>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Q1', domestic: 800, international: 600, direct: 400 },
                    { name: 'Q2', domestic: 900, international: 650, direct: 450 },
                    { name: 'Q3', domestic: 850, international: 700, direct: 420 },
                    { name: 'Q4', domestic: 950, international: 750, direct: 500 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB' }} />
                    <Legend />
                    <Bar dataKey="domestic" name="国内渠道" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar dataKey="international" name="国际渠道" fill="#06B6D4" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar dataKey="direct" name="大客户直销" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 h-12 border-t border-[#E5E7EB] bg-surface flex items-center px-6 text-caption text-text-secondary">
        <span>生成时间: {report.generatedAt}</span>
        <span className="mx-4 text-text-tertiary">|</span>
        <span>文件大小: {report.fileSize}</span>
        <span className="mx-4 text-text-tertiary">|</span>
        <span>版本: v3</span>
      </div>
    </div>
  );
}
