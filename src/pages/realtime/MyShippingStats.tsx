import { useMemo, useState } from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, CalendarDays, Download } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  getChannelDealerData,
  getCustomerQuarterlyData,
  getSalespersonMonthlyData,
  type ChannelDealerRow,
  type SalespersonMonthData,
  type SalespersonMonthlyTableRow,
} from './mockData';

const CURRENT_SALESPERSON = '唐珂';
const CUMULATIVE_MONTH_COUNT = 4;
const CURRENT_MONTH_INDEX = 3;

type MonthKey =
  | 'jan'
  | 'feb'
  | 'mar'
  | 'apr'
  | 'may'
  | 'jun'
  | 'jul'
  | 'aug'
  | 'sep'
  | 'oct'
  | 'nov'
  | 'dec';
type SortKey = 'annualOrder' | 'annualCompletionRate' | 'cumulativeOrder';
type SortDirection = 'asc' | 'desc';

interface BusinessRow {
  id: string;
  department: string;
  group: string;
  area: string;
  salesperson: string;
  annualTarget: number;
  months: SalespersonMonthData[];
  annualOrder: number;
  annualCompletionRate: number;
  cumulativeActualTarget: number;
  cumulativeOrder: number;
  cumulativeOrderRate: number;
}

const monthColumns: { key: MonthKey; label: string }[] = [
  { key: 'jan', label: '1月' },
  { key: 'feb', label: '2月' },
  { key: 'mar', label: '3月' },
  { key: 'apr', label: '4月' },
  { key: 'may', label: '5月' },
  { key: 'jun', label: '6月' },
  { key: 'jul', label: '7月' },
  { key: 'aug', label: '8月' },
  { key: 'sep', label: '9月' },
  { key: 'oct', label: '10月' },
  { key: 'nov', label: '11月' },
  { key: 'dec', label: '12月' },
];

const tableHeaderClass =
  'border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-left font-semibold text-[#111827]';
const tableCellClass =
  'border-b border-r border-[#F3F4F6] px-3 py-3 text-left text-[#111827]';

function fmtCurrency(value: number) {
  const sign = value < 0 ? '-' : '';
  return `${sign}￥${Math.abs(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtPct(value: number) {
  return `${value.toFixed(2)}%`;
}

function toPercent(value: number, base: number) {
  return base === 0 ? 0 : Number(((value / base) * 100).toFixed(2));
}

function negativeClass(value: number) {
  return value < 0 ? 'text-[#DC2626]' : '';
}

function splitMultiValue(value: string) {
  return value
    .split(/[,，、/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function includesSalesperson(value: string, salesperson: string) {
  return splitMultiValue(value).includes(salesperson);
}

function getSalespersonArea(department: string, group: string, salesperson: string) {
  if (department !== '全球渠道部') return '-';

  const areaMap: Record<string, Record<string, string[]>> = {
    国际渠道组: {
      维护组: ['周晓莹', '吴冰', '唐怡萍'],
      发展组: ['李微', '刘明星', '李炳燊'],
      开拓组: ['卫丽', '颜芯瑜', '黄泝期'],
    },
    国内渠道组: {
      维护组: ['刘平平', '陈宇鹏', '范文霞', '张小满'],
      开拓组: ['成彩凤', '罗婉怡', '杨家宝', '黄大华', '孙朝旭'],
      地产组: ['赖映州', '张俊', '黄大华（兼）', '张俊（兼）'],
    },
    ODM组: {
      国际ODM: ['李晓珊'],
      国内ODM: ['彭润城'],
    },
  };

  const groupAreas = areaMap[group] ?? {};
  return Object.entries(groupAreas).find(([, names]) => names.includes(salesperson))?.[0] ?? '-';
}

function normalizeSalespersonRows(rows: SalespersonMonthlyTableRow[]) {
  let department = '';
  let group = '';

  return rows.reduce<BusinessRow[]>((detailRows, row) => {
    if (row.dept) department = row.dept;
    if (row.group !== undefined && row.group !== '') group = row.group;
    if (row.isGroupSubtotal || row.isDeptSubtotal || row.isGrandTotal) return detailRows;

    const actualGroup = row.group ?? group;
    const annualOrder = row.months.reduce((sum, month) => sum + month.actualOrder, 0);
    const cumulativeMonths = row.months.slice(0, CUMULATIVE_MONTH_COUNT);
    const cumulativeActualTarget = cumulativeMonths.reduce((sum, month) => sum + month.actualTarget, 0);
    const cumulativeOrder = cumulativeMonths.reduce((sum, month) => sum + month.actualOrder, 0);

    detailRows.push({
      id: row.id,
      department,
      group: actualGroup,
      area: getSalespersonArea(department, actualGroup, row.salesperson),
      salesperson: row.salesperson,
      annualTarget: row.annualTarget,
      months: row.months,
      annualOrder,
      annualCompletionRate: toPercent(annualOrder, row.annualTarget),
      cumulativeActualTarget,
      cumulativeOrder,
      cumulativeOrderRate: toPercent(cumulativeOrder, cumulativeActualTarget),
    });

    return detailRows;
  }, []);
}

function getAnnualOrder(row: ChannelDealerRow) {
  return monthColumns.reduce((sum, month) => sum + row[month.key], 0);
}

function getCurrentMonthOrder(row: ChannelDealerRow) {
  const key = monthColumns[CURRENT_MONTH_INDEX]?.key ?? 'apr';
  return row[key];
}

function getCustomerTotalRow(rows: ChannelDealerRow[]): ChannelDealerRow {
  const totals = monthColumns.reduce((monthTotals, month) => {
    monthTotals[month.key] = rows.reduce((sum, row) => sum + row[month.key], 0);
    return monthTotals;
  }, {} as Record<MonthKey, number>);
  const signingAmount = rows.reduce((sum, row) => sum + row.signingAmount, 0);
  const totalJanApr = totals.jan + totals.feb + totals.mar + totals.apr;
  const previousJanApr = rows.reduce((sum, row) => sum + row.totalJanApr - row.yoyDiff, 0);
  const yoyDiff = totalJanApr - previousJanApr;
  const annualOrder = monthColumns.reduce((sum, month) => sum + totals[month.key], 0);

  return {
    id: 'my-customer-total',
    name: '合计',
    department: '-',
    salesperson: CURRENT_SALESPERSON,
    channelType: '-',
    signingAmount,
    jan: totals.jan,
    feb: totals.feb,
    mar: totals.mar,
    apr: totals.apr,
    may: totals.may,
    jun: totals.jun,
    jul: totals.jul,
    aug: totals.aug,
    sep: totals.sep,
    oct: totals.oct,
    nov: totals.nov,
    dec: totals.dec,
    totalJanApr,
    completionRate: toPercent(annualOrder, signingAmount),
    yoyDiff,
    yoyGrowth: toPercent(yoyDiff, previousJanApr),
  };
}

function SortButton({
  active,
  direction,
  onClick,
}: {
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'ml-1 inline-flex h-5 w-5 items-center justify-center rounded border align-middle',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-[#D1D5DB] bg-white text-[#6B7280] hover:border-primary hover:text-primary'
      )}
      title={active && direction === 'asc' ? '升序' : '降序'}
    >
      {active && direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
    </button>
  );
}

function QuarterCell({ actual, target }: { actual: number; target: number }) {
  const diff = actual - target;
  const rate = toPercent(actual, target);
  const achieved = actual >= target;
  return (
    <div className="space-y-1 leading-tight">
      <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold', achieved ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
        {achieved ? '达标' : '未达标'}
      </span>
      <div className={negativeClass(target)}>目标 {fmtCurrency(target)}</div>
      <div className={negativeClass(actual)}>开单 {fmtCurrency(actual)}</div>
      <div className={diff >= 0 ? 'text-[#059669]' : 'text-[#DC2626]'}>
        {diff >= 0 ? '超额 ' : '差额 '}
        {fmtCurrency(Math.abs(diff))}
      </div>
      <div className={negativeClass(rate)}>{fmtPct(rate)}</div>
    </div>
  );
}

function CustomerMonthlyDetailDialog({ row, onClose }: { row: ChannelDealerRow | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(row)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[82vh] max-w-[760px] overflow-hidden p-5">
        {row && (
          <>
            <DialogHeader className="gap-1">
              <DialogTitle>开单额明细</DialogTitle>
              <DialogDescription>{row.name} / {row.channelType}</DialogDescription>
            </DialogHeader>
            <div className="max-h-[52vh] overflow-y-auto rounded-md border border-[#E5E7EB]">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr>
                    <th className="sticky top-0 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-left font-semibold">月份</th>
                    <th className="sticky top-0 border-b border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">开单额</th>
                  </tr>
                </thead>
                <tbody>
                  {monthColumns.map((month) => (
                    <tr key={month.key} className="hover:bg-[#F9FAFB]">
                      <td className="border-b border-r border-[#F3F4F6] px-3 py-2">{month.label}</td>
                      <td className={cn('border-b border-[#F3F4F6] px-3 py-2 text-right font-medium', negativeClass(row[month.key]))}>{fmtCurrency(row[month.key])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function MyShippingStats() {
  const [year, setYear] = useState('2026');
  const [selectedCustomerKeys, setSelectedCustomerKeys] = useState<Set<string>>(new Set());
  const [selectedQuarterlyKeys, setSelectedQuarterlyKeys] = useState<Set<string>>(new Set());
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
  const [customerNameFilter, setCustomerNameFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [detailRow, setDetailRow] = useState<ChannelDealerRow | null>(null);

  const businessRows = useMemo(() => {
    const { rows } = getSalespersonMonthlyData();
    return normalizeSalespersonRows(rows).filter((row) => row.salesperson === CURRENT_SALESPERSON);
  }, []);
  const businessRow = businessRows[0];

  const allCustomerRows = useMemo(
    () => getChannelDealerData().filter((row) => includesSalesperson(row.salesperson, CURRENT_SALESPERSON)),
    []
  );
  const customerTypeOptions = useMemo(
    () => Array.from(new Set(allCustomerRows.map((row) => row.channelType))),
    [allCustomerRows]
  );
  const customerNameOptions = useMemo(
    () =>
      Array.from(
        new Set(
          allCustomerRows
            .filter((row) => customerTypeFilter === 'all' || row.channelType === customerTypeFilter)
            .map((row) => row.name)
        )
      ),
    [allCustomerRows, customerTypeFilter]
  );
  const filteredCustomerRows = useMemo(
    () =>
      allCustomerRows.filter(
        (row) =>
          (customerTypeFilter === 'all' || row.channelType === customerTypeFilter) &&
          (customerNameFilter === 'all' || row.name === customerNameFilter)
      ),
    [allCustomerRows, customerNameFilter, customerTypeFilter]
  );
  const customerTableRows = useMemo(() => {
    const detailRows = [...filteredCustomerRows];
    if (sortConfig) {
      detailRows.sort((a, b) => {
        const getValue = (row: ChannelDealerRow) => {
          if (sortConfig.key === 'annualOrder') return getAnnualOrder(row);
          if (sortConfig.key === 'annualCompletionRate') return row.completionRate;
          return row.totalJanApr;
        };
        const diff = getValue(a) - getValue(b);
        return sortConfig.direction === 'asc' ? diff : -diff;
      });
    }
    return [...detailRows, getCustomerTotalRow(filteredCustomerRows)];
  }, [filteredCustomerRows, sortConfig]);
  const quarterlyRows = useMemo(
    () => getCustomerQuarterlyData().filter((row) => row.salesperson === CURRENT_SALESPERSON),
    []
  );

  const allCustomersSelected =
    customerTableRows.length > 0 && customerTableRows.every((row) => selectedCustomerKeys.has(row.id));
  const someCustomersSelected =
    customerTableRows.some((row) => selectedCustomerKeys.has(row.id)) && !allCustomersSelected;
  const allQuarterlySelected =
    quarterlyRows.length > 0 && quarterlyRows.every((row) => selectedQuarterlyKeys.has(row.customerName));
  const someQuarterlySelected =
    quarterlyRows.some((row) => selectedQuarterlyKeys.has(row.customerName)) && !allQuarterlySelected;

  const personalAnnualTarget = businessRow?.annualTarget ?? 0;
  const personalAnnualOrder = businessRow?.annualOrder ?? 0;
  const personalAnnualRate = toPercent(personalAnnualOrder, personalAnnualTarget);
  const cumulativeActualTarget = businessRow?.cumulativeActualTarget ?? 0;
  const cumulativeOrder = businessRow?.cumulativeOrder ?? 0;
  const cumulativeOrderRate = toPercent(cumulativeOrder, cumulativeActualTarget);

  const toggleCustomer = (key: string) => {
    setSelectedCustomerKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const toggleAllCustomers = () => {
    setSelectedCustomerKeys(allCustomersSelected ? new Set() : new Set(customerTableRows.map((row) => row.id)));
  };
  const toggleQuarterly = (key: string) => {
    setSelectedQuarterlyKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const toggleAllQuarterly = () => {
    setSelectedQuarterlyKeys(allQuarterlySelected ? new Set() : new Set(quarterlyRows.map((row) => row.customerName)));
  };
  const toggleSort = (key: SortKey) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'desc' }
    );
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="h-9 w-[120px]">
            <SelectValue placeholder="年份" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026年</SelectItem>
            <SelectItem value="2025">2025年</SelectItem>
            <SelectItem value="2024">2024年</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex h-9 items-center rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-[13px] text-[#374151]">
          {CURRENT_SALESPERSON}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 xl:grid-cols-6">
        <KpiCard label="个人年度目标额" value={personalAnnualTarget} prefix="￥" format />
        <KpiCard label="个人年度开单额" value={personalAnnualOrder} prefix="￥" format delay={60} />
        <KpiCard label="个人年度目标达成率" value={personalAnnualRate} suffix="%" delay={120} />
        <KpiCard label="1-4月实际目标额" value={cumulativeActualTarget} prefix="￥" format delay={180} />
        <KpiCard label="1-4月开单额" value={cumulativeOrder} prefix="￥" format delay={240} />
        <KpiCard label="1-4月实际目标达成率" value={cumulativeOrderRate} suffix="%" delay={300} />
      </div>

      <SectionCard title="我的月度开单统计">
        <div className="overflow-x-auto rounded-md border border-[#E5E7EB]">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr>
                {['月份', '实际目标额', '开单额', '实际目标达成率'].map((title) => (
                  <th key={title} className={cn(tableHeaderClass, title !== '月份' && 'text-right')}>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(businessRow?.months ?? []).map((month, index) => (
                <tr key={monthColumns[index]?.label ?? index} className="hover:bg-[#F9FAFB]">
                  <td className={tableCellClass}>{monthColumns[index]?.label}</td>
                  <td className={cn(tableCellClass, 'text-right', negativeClass(month.actualTarget))}>{fmtCurrency(month.actualTarget)}</td>
                  <td className={cn(tableCellClass, 'text-right font-medium', negativeClass(month.actualOrder))}>{fmtCurrency(month.actualOrder)}</td>
                  <td className={cn(tableCellClass, 'text-right', negativeClass(month.achievementRate))}>{fmtPct(month.achievementRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="我的开单统计"
        titleAction={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              selectedCustomerKeys.size === 0
                ? toast.info('请先勾选要导出的客户开单数据')
                : toast.success('导出成功', {
                    description: `已导出 ${selectedCustomerKeys.size} 条客户开单数据`,
                  })
            }
          >
            <Download className="mr-1 h-4 w-4" />
            导出
          </Button>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Select
            value={customerTypeFilter}
            onValueChange={(value) => {
              setCustomerTypeFilter(value);
              setCustomerNameFilter('all');
            }}
          >
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="客户类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部客户类型</SelectItem>
              {customerTypeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={customerNameFilter} onValueChange={setCustomerNameFilter}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="客户名称" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部客户</SelectItem>
              {customerNameOptions.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-md border border-[#E5E7EB]">
          <table className="w-max min-w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th rowSpan={2} className={cn(tableHeaderClass, 'w-[44px] min-w-[44px] text-center')}>
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={allCustomersSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someCustomersSelected;
                    }}
                    onChange={toggleAllCustomers}
                  />
                </th>
                <th rowSpan={2} className={tableHeaderClass}>客户名称</th>
                <th rowSpan={2} className={tableHeaderClass}>客户类型</th>
                <th rowSpan={2} className={cn(tableHeaderClass, 'text-right')}>当月开单</th>
                <th colSpan={4} className={cn(tableHeaderClass, 'text-center')}>1~4月</th>
                <th rowSpan={2} className={cn(tableHeaderClass, 'text-right')}>年度目标额</th>
                <th rowSpan={2} className={cn(tableHeaderClass, 'text-right')}>
                  年度开单额
                  <SortButton active={sortConfig?.key === 'annualOrder'} direction={sortConfig?.direction ?? 'desc'} onClick={() => toggleSort('annualOrder')} />
                </th>
                <th rowSpan={2} className={cn(tableHeaderClass, 'text-right')}>年度目标达成率</th>
                <th rowSpan={2} className={cn(tableHeaderClass, 'text-center')}>操作</th>
              </tr>
              <tr>
                <th className={cn(tableHeaderClass, 'text-right')}>
                  开单额
                  <SortButton active={sortConfig?.key === 'cumulativeOrder'} direction={sortConfig?.direction ?? 'desc'} onClick={() => toggleSort('cumulativeOrder')} />
                </th>
                <th className={cn(tableHeaderClass, 'text-right')}>年度目标达成率</th>
                <th className={cn(tableHeaderClass, 'text-right')}>同比差额</th>
                <th className={cn(tableHeaderClass, 'text-right')}>同比增长率</th>
              </tr>
            </thead>
            <tbody>
              {customerTableRows.map((row) => {
                const isTotal = row.id === 'my-customer-total';
                const annualOrder = getAnnualOrder(row);
                return (
                  <tr key={row.id} className={cn(isTotal ? 'bg-[#EEF2FF] font-semibold' : 'hover:bg-[#F9FAFB]')}>
                    <td className={cn(tableCellClass, 'text-center')}>
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={selectedCustomerKeys.has(row.id)}
                        onChange={() => toggleCustomer(row.id)}
                      />
                    </td>
                    <td className={tableCellClass}>{row.name}</td>
                    <td className={tableCellClass}>{row.channelType}</td>
                    <td className={cn(tableCellClass, 'text-right', negativeClass(getCurrentMonthOrder(row)))}>{fmtCurrency(getCurrentMonthOrder(row))}</td>
                    <td className={cn(tableCellClass, 'text-right', negativeClass(row.totalJanApr))}>{fmtCurrency(row.totalJanApr)}</td>
                    <td className={cn(tableCellClass, 'text-right', negativeClass(row.completionRate))}>{fmtPct(row.completionRate)}</td>
                    <td className={cn(tableCellClass, 'text-right', row.yoyDiff >= 0 ? 'text-[#059669]' : 'text-[#DC2626]')}>
                      {row.yoyDiff >= 0 ? '+' : ''}
                      {fmtCurrency(row.yoyDiff)}
                    </td>
                    <td className={cn(tableCellClass, 'text-right', row.yoyGrowth >= 0 ? 'text-[#059669]' : 'text-[#DC2626]')}>
                      {row.yoyGrowth >= 0 ? '+' : ''}
                      {fmtPct(row.yoyGrowth)}
                    </td>
                    <td className={cn(tableCellClass, 'text-right', negativeClass(row.signingAmount))}>{fmtCurrency(row.signingAmount)}</td>
                    <td className={cn(tableCellClass, 'text-right', negativeClass(annualOrder))}>{fmtCurrency(annualOrder)}</td>
                    <td className={cn(tableCellClass, 'text-right', negativeClass(row.completionRate))}>{fmtPct(row.completionRate)}</td>
                    <td className={cn(tableCellClass, 'text-center')}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetailRow(row)}
                        className="h-7 gap-1.5 px-2 text-[12px]"
                      >
                        <CalendarDays className="h-3.5 w-3.5" />
                        开单额明细
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="我的签约渠道商季度目标"
        titleAction={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              selectedQuarterlyKeys.size === 0
                ? toast.info('请先勾选要导出的渠道商季度目标数据')
                : toast.success('导出成功', {
                    description: `已导出 ${selectedQuarterlyKeys.size} 条渠道商季度目标数据`,
                  })
            }
          >
            <Download className="mr-1 h-4 w-4" />
            导出
          </Button>
        }
      >
        <div className="overflow-x-auto rounded-md border border-[#E5E7EB]">
          <table className="w-max min-w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th className={cn(tableHeaderClass, 'w-[44px] min-w-[44px] text-center')}>
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={allQuarterlySelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someQuarterlySelected;
                    }}
                    onChange={toggleAllQuarterly}
                  />
                </th>
                {['客户名称', '客户类型', 'Q1', 'Q2', 'Q3', 'Q4'].map((title) => (
                  <th key={title} className={cn(tableHeaderClass, title.startsWith('Q') && 'min-w-[210px]')}>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quarterlyRows.map((row) => (
                <tr key={row.customerName} className="hover:bg-[#F9FAFB]">
                  <td className={cn(tableCellClass, 'text-center')}>
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={selectedQuarterlyKeys.has(row.customerName)}
                      onChange={() => toggleQuarterly(row.customerName)}
                    />
                  </td>
                  <td className={tableCellClass}>{row.customerName}</td>
                  <td className={tableCellClass}>{row.customerType}</td>
                  <td className={tableCellClass}><QuarterCell actual={row.q1Actual} target={row.q1Target} /></td>
                  <td className={tableCellClass}><QuarterCell actual={row.q2Actual} target={row.q2Target} /></td>
                  <td className={tableCellClass}><QuarterCell actual={row.q3Actual} target={row.q3Target} /></td>
                  <td className={tableCellClass}><QuarterCell actual={row.q4Actual} target={row.q4Target} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
      <CustomerMonthlyDetailDialog row={detailRow} onClose={() => setDetailRow(null)} />
    </div>
  );
}
