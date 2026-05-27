import { useMemo, useState } from 'react';
import { SectionCard } from '@/components/ui/SectionCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowDown, ArrowUp, CalendarDays, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DataUpdateNotice } from '@/components/DataUpdateNotice';
import { SHIPPING_HIERARCHY_FILTER_OPTIONS } from './sharedOptions';

type CompanyTab = 'tech' | 'electronics';
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
type SortDirection = 'asc' | 'desc';
type SortKey =
  | 'currentTarget'
  | 'currentOrder'
  | 'currentRate'
  | 'cumulativeTarget'
  | 'cumulativeOrder'
  | 'cumulativeOrderRate'
  | 'yoyDiff'
  | 'yoyGrowthRate'
  | 'annualTarget'
  | 'annualOrder'
  | 'annualCompletionRate';

interface SourceRow {
  id: string;
  department: string;
  group: string;
  area: string;
  annualTarget: number;
  monthlyOrders: Record<MonthKey, number>;
  previousCumulativeOrder?: number;
}

interface TableRow extends SourceRow {
  rowType?: 'total' | 'subtotal';
  currentTarget: number;
  currentOrder: number;
  currentRate: number;
  cumulativeTarget: number;
  cumulativeOrder: number;
  cumulativeOrderRate: number;
  annualOrder: number;
  annualCompletionRate: number;
  yoyDiff: number;
  yoyGrowthRate: number;
}

const CURRENT_MONTH: MonthKey = 'apr';
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

const sourceRows: SourceRow[] = [
  row('global-international-maintain', '全球渠道部', '国际渠道组', '维护组', 1180000, [76000, 82000, 88000, 91000, 96000, 102000, 108000, 111000, 117000, 123000, 128000, 132000]),
  row('global-international-development', '全球渠道部', '国际渠道组', '发展组', 950000, [52000, 59000, 64000, 68000, 72000, 78000, 82000, 87000, 91000, 96000, 101000, 106000]),
  row('global-international-expand', '全球渠道部', '国际渠道组', '开拓组', 1100000, [68000, 72000, 79000, 85000, 90000, 96000, 103000, 108000, 114000, 120000, 126000, 132000]),
  row('global-domestic-maintain', '全球渠道部', '国内渠道组', '维护组', 1350000, [98000, 105000, 112000, 118000, 124000, 130000, 136000, 142000, 148000, 154000, 160000, 168000]),
  row('global-domestic-expand', '全球渠道部', '国内渠道组', '开拓组', 1250000, [86000, 93000, 101000, 108000, 116000, 124000, 132000, 139000, 146000, 153000, 160000, 166000]),
  row('global-domestic-real-estate', '全球渠道部', '国内渠道组', '地产组', 980000, [54000, 62000, 69000, 76000, 82000, 88000, 94000, 99000, 104000, 110000, 116000, 122000]),
  row('global-odm-international', '全球渠道部', 'ODM组', '国际ODM', 860000, [45000, 52000, 59000, 63000, 70000, 76000, 83000, 89000, 95000, 101000, 107000, 113000]),
  row('global-odm-domestic', '全球渠道部', 'ODM组', '国内ODM', 720000, [39000, 45000, 51000, 56000, 62000, 68000, 73000, 78000, 83000, 88000, 93000, 98000]),
  row('domestic-key-account', '国内大客户部', '-', '-', 3200000, [280000, 310000, 295000, 325000, 340000, 360000, 375000, 390000, 405000, 420000, 435000, 455000]),
  row('international-hotel', '国际酒店部', '-', '-', 2800000, [220000, 245000, 268000, 240000, 255000, 276000, 298000, 315000, 330000, 346000, 360000, 382000]),
  row('energy-storage', '储能事业部', '-', '-', 2500000, [195000, 210000, 225000, 218000, 230000, 246000, 260000, 274000, 288000, 302000, 318000, 332000]),
  row('hedong-electronics', '河东电子', '-', '-', 1600000, [118000, 126000, 135000, 142000, 150000, 160000, 172000, 181000, 190000, 202000, 214000, 226000]),
];

const sortableColumns: { key: SortKey; label: string; className: string; sortable?: boolean }[] = [
  { key: 'currentTarget', label: '当月实际目标额', className: 'w-[140px] min-w-[140px]', sortable: false },
  { key: 'currentOrder', label: '当月实际开单额', className: 'w-[140px] min-w-[140px]' },
  { key: 'currentRate', label: '当月实际开单达成率', className: 'w-[150px] min-w-[150px]' },
  { key: 'cumulativeTarget', label: '累计实际目标额', className: 'w-[150px] min-w-[150px]', sortable: false },
  { key: 'cumulativeOrder', label: '累计开单额', className: 'w-[140px] min-w-[140px]' },
  { key: 'cumulativeOrderRate', label: '累计开单达成率', className: 'w-[150px] min-w-[150px]' },
  { key: 'yoyDiff', label: '同比差额', className: 'w-[130px] min-w-[130px]', sortable: false },
  { key: 'yoyGrowthRate', label: '同比增长率', className: 'w-[130px] min-w-[130px]', sortable: false },
  { key: 'annualTarget', label: '年度目标额', className: 'w-[130px] min-w-[130px]', sortable: false },
  { key: 'annualOrder', label: '年度开单额', className: 'w-[130px] min-w-[130px]' },
  { key: 'annualCompletionRate', label: '年度开单达成率', className: 'w-[150px] min-w-[150px]' },
];

const leftHeaderClass = 'border-b border-r border-[#D8DEE9] bg-[#F8FAFC] px-2 py-3 text-left font-semibold text-[#111827]';
const bodyCellClass = 'border-b border-r border-[#E5E7EB] px-2 py-3';
const rightCellClass = 'border-b border-l border-[#F3F4F6] px-3 py-3 text-right';
const actionHeaderClass = 'sticky right-0 z-40 w-[124px] min-w-[124px] border-b border-l border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-center font-semibold text-[#374151] shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';
const actionBodyClass = 'sticky right-0 z-30 w-[124px] min-w-[124px] border-b border-l border-[#E5E7EB] px-3 py-2 text-center shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';

function row(id: string, department: string, group: string, area: string, annualTarget: number, values: number[]): SourceRow {
  return { id, department, group, area, annualTarget, monthlyOrders: makeMonths(values) };
}

function makeMonths(values: number[]) {
  return monthColumns.reduce((months, month, index) => {
    months[month.key] = values[index] ?? 0;
    return months;
  }, {} as Record<MonthKey, number>);
}

function toPercent(value: number, base: number) {
  return base === 0 ? 0 : Number(((value / base) * 100).toFixed(2));
}

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

function negativeClass(value: number) {
  return value < 0 ? 'text-[#DC2626]' : '';
}

function monthlyTarget(row: SourceRow, monthKey: MonthKey) {
  const monthIndex = monthColumns.findIndex((month) => month.key === monthKey);
  const baseline = row.annualTarget / 12;
  return Math.round(baseline * (0.92 + (monthIndex % 4) * 0.035));
}

function enhanceRow(source: SourceRow, rowType?: TableRow['rowType']): TableRow {
  const annualOrder = monthColumns.reduce((sum, month) => sum + source.monthlyOrders[month.key], 0);
  const cumulativeMonths = monthColumns.slice(0, 4);
  const cumulativeTarget = cumulativeMonths.reduce((sum, month) => sum + monthlyTarget(source, month.key), 0);
  const cumulativeOrder = cumulativeMonths.reduce((sum, month) => sum + source.monthlyOrders[month.key], 0);
  const previousCumulativeOrder = source.previousCumulativeOrder ?? Math.round(cumulativeOrder * 0.9);
  const yoyDiff = cumulativeOrder - previousCumulativeOrder;
  const currentTarget = monthlyTarget(source, CURRENT_MONTH);
  const currentOrder = source.monthlyOrders[CURRENT_MONTH];

  return {
    ...source,
    rowType,
    currentTarget,
    currentOrder,
    currentRate: toPercent(currentOrder, currentTarget),
    cumulativeTarget,
    cumulativeOrder,
    cumulativeOrderRate: toPercent(cumulativeOrder, cumulativeTarget),
    annualOrder,
    annualCompletionRate: toPercent(annualOrder, source.annualTarget),
    yoyDiff,
    yoyGrowthRate: toPercent(yoyDiff, previousCumulativeOrder),
  };
}

function sumSourceRows(id: string, label: string, rows: SourceRow[], rowType: TableRow['rowType']): TableRow {
  const monthlyOrders = monthColumns.reduce((months, month) => {
    months[month.key] = rows.reduce((sum, item) => sum + item.monthlyOrders[month.key], 0);
    return months;
  }, {} as Record<MonthKey, number>);

  const total = enhanceRow(
    {
      id,
      department: rowType === 'total' ? '合计' : rows[0]?.department ?? label,
      group: label,
      area: rowType === 'total' ? '合计' : '小计',
      annualTarget: rows.reduce((sum, item) => sum + item.annualTarget, 0),
      monthlyOrders,
      previousCumulativeOrder: rows.reduce((sum, item) => {
        const rowData = enhanceRow(item);
        return sum + rowData.cumulativeOrder - rowData.yoyDiff;
      }, 0),
    },
    rowType
  );
  return total;
}

function filterRows(rows: SourceRow[], filterValue: string) {
  if (filterValue === 'all') return rows;
  const [level, department, group, area] = filterValue.split('|');
  if (level === 'department') return rows.filter((item) => item.department === department);
  if (level === 'group') return rows.filter((item) => item.department === department && item.group === group);
  if (level === 'area') {
    return rows.filter((item) => item.department === department && item.group === group && item.area === area);
  }
  return rows;
}

function withSubtotals(rows: SourceRow[]) {
  const enhanced: TableRow[] = [];
  const byDepartment = new Map<string, SourceRow[]>();
  rows.forEach((item) => {
    byDepartment.set(item.department, [...(byDepartment.get(item.department) ?? []), item]);
  });

  for (const [department, departmentRows] of byDepartment) {
    if (department === '全球渠道部') {
      const byGroup = new Map<string, SourceRow[]>();
      departmentRows.forEach((item) => {
        byGroup.set(item.group, [...(byGroup.get(item.group) ?? []), item]);
      });
      for (const [group, groupRows] of byGroup) {
        enhanced.push(...groupRows.map((item) => enhanceRow(item)));
        enhanced.push(sumSourceRows(`${group}-subtotal`, `${group}-小计`, groupRows, 'subtotal'));
      }
      enhanced.push(sumSourceRows('global-subtotal', '全球渠道部-小计', departmentRows, 'subtotal'));
    } else {
      enhanced.push(...departmentRows.map((item) => enhanceRow(item)));
    }
  }

  return [sumSourceRows('total', '合计', rows, 'total'), ...enhanced];
}

function sortRows(rows: TableRow[], sortConfig: { key: SortKey; direction: SortDirection } | null) {
  if (!sortConfig) return rows;
  const [totalRows, normalRows] = [
    rows.filter((item) => item.rowType === 'total'),
    rows.filter((item) => item.rowType !== 'total'),
  ];
  const sorted = [...normalRows].sort((a, b) => {
    const diff = a[sortConfig.key] - b[sortConfig.key];
    return sortConfig.direction === 'asc' ? diff : -diff;
  });
  return [...totalRows, ...sorted];
}

function renderValue(row: TableRow, key: SortKey) {
  if (key.endsWith('Rate')) return fmtPct(row[key]);
  if (key === 'yoyDiff') return `${row.yoyDiff >= 0 ? '+' : ''}${fmtCurrency(row.yoyDiff)}`;
  if (key === 'yoyGrowthRate') return `${row.yoyGrowthRate >= 0 ? '+' : ''}${fmtPct(row.yoyGrowthRate)}`;
  return fmtCurrency(row[key]);
}

function SortHeader({
  column,
  sortConfig,
  onSort,
}: {
  column: { key: SortKey; label: string; className: string; sortable?: boolean };
  sortConfig: { key: SortKey; direction: SortDirection } | null;
  onSort: (key: SortKey) => void;
}) {
  const active = sortConfig?.key === column.key;
  if (column.sortable === false) {
    return <span>{column.label}</span>;
  }
  return (
    <button
      type="button"
      onClick={() => onSort(column.key)}
      className="inline-flex w-full items-center justify-end gap-1 text-right"
    >
      <span>{column.label}</span>
      {active && sortConfig?.direction === 'asc' ? (
        <ArrowUp className="h-3.5 w-3.5 text-primary" />
      ) : (
        <ArrowDown className={cn('h-3.5 w-3.5', active ? 'text-primary' : 'text-[#9CA3AF]')} />
      )}
    </button>
  );
}

function MonthlyDetailDialog({ row, onClose }: { row: TableRow | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(row)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[86vh] max-w-[820px] overflow-hidden p-5">
        {row && (
          <>
            <DialogHeader className="gap-1">
              <DialogTitle>开单额明细</DialogTitle>
              <DialogDescription>
                {row.department} / {row.group} / {row.area}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[62vh] overflow-y-auto rounded-md border border-[#E5E7EB]">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr>
                    <th className="sticky top-0 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-left font-semibold">月份</th>
                    <th className="sticky top-0 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">实际目标额</th>
                    <th className="sticky top-0 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">实际开单额</th>
                    <th className="sticky top-0 border-b border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">实际开单达成率</th>
                  </tr>
                </thead>
                <tbody>
                  {monthColumns.map((month) => {
                    const target = monthlyTarget(row, month.key);
                    const order = row.monthlyOrders[month.key];
                    return (
                      <tr key={month.key} className="hover:bg-[#F9FAFB]">
                        <td className="border-b border-r border-[#F3F4F6] px-3 py-2">{month.label}</td>
                        <td className={cn('border-b border-r border-[#F3F4F6] px-3 py-2 text-right', negativeClass(target))}>{fmtCurrency(target)}</td>
                        <td className={cn('border-b border-r border-[#F3F4F6] px-3 py-2 text-right font-medium', negativeClass(order))}>{fmtCurrency(order)}</td>
                        <td className={cn('border-b border-[#F3F4F6] px-3 py-2 text-right font-medium', negativeClass(toPercent(order, target)))}>{fmtPct(toPercent(order, target))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function DepartmentShipping() {
  const [year, setYear] = useState('2026');
  const [companyTab, setCompanyTab] = useState<CompanyTab>('tech');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [detailRow, setDetailRow] = useState<TableRow | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  const tabRows = useMemo(
    () =>
      sourceRows.filter((item) =>
        companyTab === 'electronics' ? item.department === '河东电子' : item.department !== '河东电子'
      ),
    [companyTab]
  );
  const filteredRows = useMemo(() => filterRows(tabRows, departmentFilter), [departmentFilter, tabRows]);
  const tableRows = useMemo(
    () => sortRows(withSubtotals(filteredRows), sortConfig),
    [filteredRows, sortConfig]
  );
  const tabFilterOptions = useMemo(
    () =>
      SHIPPING_HIERARCHY_FILTER_OPTIONS.filter((option) => {
        if (companyTab === 'electronics') {
          return option.value === 'all' || option.value === 'department|河东电子';
        }
        return !option.value.includes('河东电子');
      }),
    [companyTab]
  );
  const allSelected = tableRows.length > 0 && tableRows.every((row) => selectedKeys.has(row.id));
  const someSelected = tableRows.some((row) => selectedKeys.has(row.id)) && !allSelected;

  const toggleSort = (key: SortKey) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'desc' }
    );
  };
  const resetSelection = () => setSelectedKeys(new Set());
  const toggleAll = () => setSelectedKeys(allSelected ? new Set() : new Set(tableRows.map((row) => row.id)));
  const toggleRow = (id: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex h-11 items-end gap-8 border-b border-[#E5E7EB]">
        {[
          { key: 'tech' as const, label: '河东科技' },
          { key: 'electronics' as const, label: '河东电子' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setCompanyTab(tab.key);
              setDepartmentFilter('all');
              resetSelection();
              setSortConfig(null);
            }}
            className={cn(
              'relative h-11 px-1 text-[14px] font-medium transition-colors',
              companyTab === tab.key
                ? 'text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary'
                : 'text-[#4B5563] hover:text-primary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
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
          <Select
            value={departmentFilter}
            onValueChange={(value) => {
              setDepartmentFilter(value);
              resetSelection();
            }}
          >
            <SelectTrigger className="h-9 w-[280px]">
              <SelectValue placeholder="部门" />
            </SelectTrigger>
            <SelectContent className="max-h-[320px]">
              {tabFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-caption text-text-tertiary">每天19:00自动更新数据</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setYear('2026');
              setDepartmentFilter('all');
              setSortConfig(null);
              resetSelection();
            }}
          >
            重置
          </Button>
          <Button size="sm" onClick={() => toast.success('查询完成', { description: '已按当前筛选条件刷新列表' })}>
            查询
          </Button>
        </div>
      </div>

      <DataUpdateNotice text="当月实际开单额、当月实际开单达成率、年度开单额、年度开单达成率每天 19:00 自动更新；累计开单额、累计开单达成率、同比差额、同比增长率每月最后一天 19:00 更新至上月数据" />

      <SectionCard>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-caption text-text-secondary">
            已选 <span className="font-semibold text-primary">{selectedKeys.size}</span> 条
          </span>
          <Button variant="outline" size="sm" onClick={() => toast.info('导出功能开发中')}>
            <Download className="mr-1 h-4 w-4" />
            导出
          </Button>
        </div>

        <div className="relative overflow-x-auto rounded-md border border-[#E5E7EB]">
          <table className="w-max min-w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th rowSpan={2} className={cn(leftHeaderClass, 'w-[40px] min-w-[40px] text-center')}>
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                  />
                </th>
                <th rowSpan={2} className={cn(leftHeaderClass, 'w-[110px] min-w-[110px]')}>部门</th>
                <th rowSpan={2} className={cn(leftHeaderClass, 'w-[120px] min-w-[120px]')}>分组</th>
                <th rowSpan={2} className={cn(leftHeaderClass, 'w-[100px] min-w-[100px]')}>区域</th>
                {sortableColumns.slice(0, 3).map((column) => (
                  <th key={column.key} rowSpan={2} className={cn(leftHeaderClass, column.className, 'text-right')}>
                    <SortHeader column={column} sortConfig={sortConfig} onSort={toggleSort} />
                  </th>
                ))}
                <th colSpan={5} className="border-b border-l border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-center font-semibold text-[#111827]">1~4月</th>
                {sortableColumns.slice(8).map((column) => (
                  <th key={column.key} rowSpan={2} className={cn(leftHeaderClass, column.className, 'text-right')}>
                    <SortHeader column={column} sortConfig={sortConfig} onSort={toggleSort} />
                  </th>
                ))}
                <th rowSpan={2} className={actionHeaderClass}>操作</th>
              </tr>
              <tr>
                {sortableColumns.slice(3, 8).map((column) => (
                  <th key={column.key} className={cn(leftHeaderClass, column.className, 'text-right')}>
                    <SortHeader column={column} sortConfig={sortConfig} onSort={toggleSort} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => {
                const rowBg = row.rowType === 'total' ? 'bg-[#EEF2FF] font-semibold' : row.rowType === 'subtotal' ? 'bg-[#F8FAFC] font-semibold' : 'bg-white';
                return (
                  <tr key={row.id} className={cn(rowBg, row.rowType === undefined && 'hover:bg-[#F9FAFB]')}>
                    <td className={cn(bodyCellClass, rowBg, 'text-center')}>
                      <input type="checkbox" className="cursor-pointer" checked={selectedKeys.has(row.id)} onChange={() => toggleRow(row.id)} />
                    </td>
                    <td className={cn(bodyCellClass, rowBg, 'font-semibold text-[#111827]')}>{row.department}</td>
                    <td className={cn(bodyCellClass, rowBg, 'font-semibold text-[#111827]')}>{row.group}</td>
                    <td className={cn(bodyCellClass, rowBg)}>{row.area}</td>
                    {sortableColumns.map((column) => (
                      <td
                        key={`${row.id}-${column.key}`}
                        className={cn(rightCellClass, rowBg, column.className, negativeClass(row[column.key]))}
                      >
                        {renderValue(row, column.key)}
                      </td>
                    ))}
                    <td className={cn(actionBodyClass, rowBg)}>
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

      <MonthlyDetailDialog row={detailRow} onClose={() => setDetailRow(null)} />
    </div>
  );
}
