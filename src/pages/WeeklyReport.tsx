import React, { useState, useMemo, useCallback } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Download,
  ChevronDown,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/ui/KpiCard';
import { FilterBar } from '@/components/ui/FilterBar';
import { ChartSection } from '@/components/ui/ChartSection';
import { TrendIndicator } from '@/components/ui/TrendIndicator';
import { SectionCard } from '@/components/ui/SectionCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { SalespersonDetail, DepartmentData } from './weekly/types';
import {
  kpiData,
  trendData,
  departmentData,
  weekOptions,
  departmentOptions,
  getCustomersForSalesperson,
  formatWan,
} from './weekly/mockData';

// ============ Completion Rate Badge ============
function CompletionBadge({ rate }: { rate: number }) {
  let variantClass = '';
  if (rate >= 100) {
    variantClass = 'bg-success-light text-success';
  } else if (rate >= 80) {
    variantClass = 'bg-warning-light text-warning';
  } else {
    variantClass = 'bg-danger-light text-danger';
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-badge text-[12px] font-semibold',
        variantClass
      )}
    >
      <span className="w-16 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden inline-block">
        <span
          className={cn(
            'h-full rounded-full block',
            rate >= 100 ? 'bg-success' : rate >= 80 ? 'bg-warning' : 'bg-danger'
          )}
          style={{ width: `${Math.min(rate, 100)}%` }}
        />
      </span>
      {rate.toFixed(1)}%
    </span>
  );
}

// ============ Recharts Tooltip ============
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-surface rounded-lg shadow-xl border border-[#E5E7EB] p-3 text-body-small">
      <p className="font-medium text-text-primary mb-1.5">{label}</p>
      {payload.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 py-0.5">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-text-secondary">{item.name}:</span>
          <span className="font-semibold text-text-primary">
            ¥{item.value}万
          </span>
        </div>
      ))}
    </div>
  );
}

// ============ Salesperson Drawer ============
function SalespersonDrawer({
  open,
  onClose,
  salesperson,
}: {
  open: boolean;
  onClose: () => void;
  salesperson: SalespersonDetail | null;
}) {
  if (!salesperson) return null;

  const customers = getCustomersForSalesperson(salesperson.id);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 animate-fade-in"
          onClick={onClose}
        />
      )}
      {/* Drawer Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full bg-surface border-l border-[#E5E7EB] shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ width: 640 }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
          <div>
            <h2 className="text-h3 text-text-primary">业务员开单明细</h2>
            <p className="text-caption text-text-secondary mt-0.5">
              {salesperson.name} - 客户级别开单数据
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Salesperson Info */}
        <div className="px-6 py-4 border-b border-[#F3F4F6] bg-primary-light/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
              {salesperson.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-body font-semibold text-text-primary">
                  {salesperson.name}
                </span>
                <span className="text-caption text-text-secondary">
                  客户数: {salesperson.customerCount}
                </span>
              </div>
              <div className="flex items-center gap-6 mt-1.5">
                <span className="text-caption text-text-secondary">
                  开单额:{' '}
                  <span className="font-semibold text-text-primary">
                    ¥{formatWan(salesperson.shippingAmount)}万
                  </span>
                </span>
                <span className="text-caption text-text-secondary">
                  目标完成率:{' '}
                  <CompletionBadge rate={salesperson.completionRate} />
                </span>
                <span className="text-caption text-text-secondary">
                  未结束订单:{' '}
                  <span className="font-semibold text-text-primary">
                    ¥{formatWan(salesperson.openOrderAmount)}万
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <h3 className="text-h3 text-text-primary mb-4">客户开单数据</h3>
          <div className="border border-[#E5E7EB] rounded-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] h-10">
                  <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3">
                    客户名称
                  </TableHead>
                  <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3 text-right">
                    开单额
                  </TableHead>
                  <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3 text-center">
                    签约完成率
                  </TableHead>
                  <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3 text-center">
                    同期对比
                  </TableHead>
                  <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3 text-right">
                    未结束订单
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="h-12 transition-colors duration-150 hover:bg-[#F9FAFB]"
                  >
                    <TableCell className="text-table-cell text-text-primary px-3">
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-table-cell text-text-primary px-3 text-right font-mono">
                      ¥{(customer.shippingAmount / 10000).toFixed(0)}万
                    </TableCell>
                    <TableCell className="text-table-cell px-3 text-center">
                      <CompletionBadge rate={customer.completionRate} />
                    </TableCell>
                    <TableCell className="text-table-cell px-3 text-center">
                      <TrendIndicator
                        trend={customer.yoyChange}
                        comparison=""
                      />
                    </TableCell>
                    <TableCell className="text-table-cell text-text-primary px-3 text-right font-mono">
                      ¥{(customer.openOrderAmount / 10000).toFixed(0)}万
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

// ============ Main Page Component ============
export default function WeeklyReport() {
  // ---- State ----
  const [weekFilter, setWeekFilter] = useState('本周');
  const [departmentFilter, setDepartmentFilter] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSalesperson, setSelectedSalesperson] = useState<SalespersonDetail | null>(null);

  // ---- Toggle department expand ----
  const toggleDept = useCallback((deptId: string) => {
    setExpandedDepts((prev) => {
      const next = new Set(prev);
      if (next.has(deptId)) {
        next.delete(deptId);
      } else {
        next.add(deptId);
      }
      return next;
    });
  }, []);

  // ---- Open drawer ----
  const openDrawer = useCallback((sp: SalespersonDetail) => {
    setSelectedSalesperson(sp);
    setDrawerOpen(true);
  }, []);

  // ---- Filtered department data ----
  const filteredDepartments = useMemo(() => {
    let depts = departmentFilter === '全部'
      ? departmentData
      : departmentData.filter((d) => d.name === departmentFilter);

    // If search query, filter salespeople and still show parent dept
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      depts = depts
        .map((dept) => ({
          ...dept,
          salespeople: dept.salespeople.filter((sp) =>
            sp.name.toLowerCase().includes(q)
          ),
        }))
        .filter((dept) => dept.salespeople.length > 0);
    }

    return depts;
  }, [departmentFilter, searchQuery]);

  // ---- Export handler ----
  const handleExport = () => {
    // Simulate export
    alert('导出功能已触发：Weekly_Report_W48_2025.xlsx');
  };

  // ---- Refresh handler ----
  const handleRefresh = () => {
    // Simulate refresh
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* ====== Page Header ====== */}
      <div className="border-b border-[#E5E7EB] pb-5">
        <h1 className="text-h1 text-text-primary">部门业务开单统计（周报）</h1>
        <p className="text-body-small text-text-secondary mt-1">
          按部门及业务员维度统计本周开单数据
        </p>
      </div>

      {/* ====== Filter Bar ====== */}
      <FilterBar
        searchPlaceholder="搜索业务员名称..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
        onExport={handleExport}
      >
        {/* Week selector */}
        <Select value={weekFilter} onValueChange={setWeekFilter}>
          <SelectTrigger className="h-9 w-[200px] border-[#E5E7EB] bg-surface text-body-small">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {weekOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} ({opt.dateRange})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Department filter */}
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="h-9 w-[160px] border-[#E5E7EB] bg-surface text-body-small">
            <SelectValue placeholder="全部部门" />
          </SelectTrigger>
          <SelectContent>
            {departmentOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>

      {/* ====== KPI Cards ====== */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="本周开单总额"
          value={kpiData.totalShipping}
          prefix="¥"
          suffix=""
          format
          decimals={0}
          trend={kpiData.totalShippingTrend}
          comparison="vs 上周"
          sparkline={[420, 380, 450, 520, 480, 560, 320]}
        />
        <KpiCard
          label="目标完成率"
          value={kpiData.targetCompletion}
          suffix="%"
          decimals={1}
          trend={kpiData.targetCompletionTrend}
          comparison="vs 上周"
          sparkline={[82, 81, 80, 79, 78.5, 78.2, 78.5]}
        />
        <KpiCard
          label="同期对比"
          value={kpiData.yoyGrowth}
          prefix=""
          suffix="%"
          decimals={1}
          trend={kpiData.yoyGrowthTrend}
          comparison="vs 去年同期"
          sparkline={[4.2, 5.8, 7.5, 9.1, 10.5, 11.2, 12.3]}
        />
        <KpiCard
          label="未结束订单金额"
          value={kpiData.openOrderAmount}
          prefix="¥"
          suffix=""
          format
          decimals={0}
          trend={kpiData.openOrderTrend}
          comparison="vs 上周"
          sparkline={[380, 410, 390, 430, 450, 470, 486]}
        />
      </div>

      {/* ====== Trend Chart ====== */}
      <ChartSection title="本周开单趋势">
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="bar"
                orientation="left"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `¥${v}万`}
              />
              <YAxis
                yAxisId="line"
                orientation="right"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `¥${v}万`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                formatter={(value: string) => (
                  <span style={{ color: '#6B7280' }}>{value}</span>
                )}
              />
              <Bar
                yAxisId="bar"
                dataKey="dailyAmount"
                name="日开单额"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Line
                yAxisId="line"
                type="monotone"
                dataKey="cumulativeAmount"
                name="累计趋势"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartSection>

      {/* ====== Department Shipping Data Table ====== */}
      <SectionCard
        title="部门开单明细"
        titleAction={
          <div className="flex items-center gap-2">
            <span className="text-caption text-text-secondary">
              共 {filteredDepartments.reduce((acc, d) => acc + d.salespeople.length, 0)} 条记录
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-1.5 text-body-small text-text-secondary border-[#E5E7EB] hover:bg-[#F3F4F6]"
            >
              <Download className="w-3.5 h-3.5" />
              导出 Excel
            </Button>
          </div>
        }
      >
        <div className="border border-[#E5E7EB] rounded-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] h-10">
                <TableHead className="text-table-header uppercase tracking-wider text-text-secondary w-[40px] px-3" />
                <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3">
                  部门名称
                </TableHead>
                <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3 text-right">
                  开单额
                </TableHead>
                <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3 text-right">
                  目标额
                </TableHead>
                <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3 text-center">
                  目标完成率
                </TableHead>
                <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3 text-center">
                  同期对比
                </TableHead>
                <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3 text-right">
                  未结束订单金额
                </TableHead>
                <TableHead className="text-table-header uppercase tracking-wider text-text-secondary px-3 text-center">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-text-secondary py-16"
                  >
                    暂无数据
                  </TableCell>
                </TableRow>
              )}

              {filteredDepartments.map((dept: DepartmentData) => {
                const isExpanded = expandedDepts.has(dept.id);

                return (
                  <React.Fragment key={dept.id}>
                    {/* Department row */}
                    <TableRow
                      className={cn(
                        'h-12 transition-colors duration-150 cursor-pointer',
                        isExpanded ? 'bg-primary-light/30' : 'hover:bg-[#F9FAFB]'
                      )}
                      onClick={() => toggleDept(dept.id)}
                    >
                      <TableCell className="px-3">
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded text-text-secondary hover:text-text-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDept(dept.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-table-cell text-text-primary px-3 font-medium">
                        {dept.name}
                      </TableCell>
                      <TableCell className="text-table-cell text-text-primary px-3 text-right font-mono">
                        ¥{(dept.shippingAmount / 10000).toFixed(0)}万
                      </TableCell>
                      <TableCell className="text-table-cell text-text-secondary px-3 text-right font-mono">
                        ¥{(dept.targetAmount / 10000).toFixed(0)}万
                      </TableCell>
                      <TableCell className="px-3 text-center">
                        <CompletionBadge rate={dept.completionRate} />
                      </TableCell>
                      <TableCell className="px-3 text-center">
                        <TrendIndicator trend={dept.yoyChange} comparison="" />
                      </TableCell>
                      <TableCell className="text-table-cell text-text-primary px-3 text-right font-mono">
                        ¥{(dept.openOrderAmount / 10000).toFixed(0)}万
                      </TableCell>
                      <TableCell className="px-3 text-center">
                        <span className="text-caption text-text-tertiary">
                          —
                        </span>
                      </TableCell>
                    </TableRow>

                    {/* Expanded salesperson sub-rows */}
                    {isExpanded &&
                      dept.salespeople.map((sp) => (
                        <TableRow
                          key={sp.id}
                          className="h-11 transition-colors duration-150 hover:bg-[#F9FAFB] border-l-2 border-l-primary bg-primary-light/10"
                        >
                          <TableCell className="px-3" />
                          <TableCell className="text-table-cell text-text-primary px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#EBF0FE] text-primary flex items-center justify-center text-[11px] font-semibold">
                                {sp.name.charAt(0)}
                              </div>
                              <span>{sp.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-table-cell text-text-primary px-3 text-right font-mono">
                            ¥{(sp.shippingAmount / 10000).toFixed(0)}万
                          </TableCell>
                          <TableCell className="text-table-cell text-text-secondary px-3 text-right font-mono">
                            ¥{(sp.targetAmount / 10000).toFixed(0)}万
                          </TableCell>
                          <TableCell className="px-3 text-center">
                            <CompletionBadge rate={sp.completionRate} />
                          </TableCell>
                          <TableCell className="px-3 text-center">
                            <TrendIndicator trend={sp.yoyChange} comparison="" />
                          </TableCell>
                          <TableCell className="text-table-cell text-text-primary px-3 text-right font-mono">
                            ¥{(sp.openOrderAmount / 10000).toFixed(0)}万
                          </TableCell>
                          <TableCell className="px-3 text-center">
                            <button
                              onClick={() => openDrawer(sp)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-button text-[12px] font-medium text-primary bg-primary-light hover:bg-primary/10 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              查看明细
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* ====== Salesperson Detail Drawer ====== */}
      <SalespersonDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        salesperson={selectedSalesperson}
      />
    </div>
  );
}
