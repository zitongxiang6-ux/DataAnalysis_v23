import { useMemo, useState } from 'react';
import { SectionCard } from '@/components/ui/SectionCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  getSalespersonMonthlyData,
  type SalespersonMonthData,
  type SalespersonMonthlyTableRow,
} from './mockData';
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
import { SHIPPING_HIERARCHY_FILTER_OPTIONS, matchesShippingHierarchyFilter } from './sharedOptions';

type CompanyTab = 'tech' | 'electronics';
type SortDirection = 'asc' | 'desc';
type SortKey =
  | 'currentTarget'
  | 'currentOrder'
  | 'currentRate'
  | 'cumulativeActualTarget'
  | 'cumulativeOrder'
  | 'cumulativeOrderRate'
  | 'annualTarget'
  | 'annualOrder'
  | 'annualCompletionRate';

interface DetailRow {
  id: string;
  dept: string;
  group: string;
  area: string;
  salesperson: string;
  annualTarget: number;
  months: SalespersonMonthData[];
}

interface TableRow extends DetailRow {
  isTotal?: boolean;
  currentTarget: number;
  currentOrder: number;
  currentRate: number;
  cumulativeActualTarget: number;
  cumulativeOrder: number;
  cumulativeOrderRate: number;
  annualOrder: number;
  annualCompletionRate: number;
}

const CURRENT_MONTH_INDEX = 3;
const CUMULATIVE_MONTH_COUNT = 4;
const monthColumns = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'].map((label, index) => ({ label, index }));
const sortableColumns: { key: SortKey; label: string; className: string; sortable?: boolean }[] = [
  { key: 'currentTarget', label: '当月实际目标额', className: 'w-[140px] min-w-[140px]', sortable: false },
  { key: 'currentOrder', label: '当月实际开单额', className: 'w-[140px] min-w-[140px]' },
  { key: 'currentRate', label: '当月实际开单达成率', className: 'w-[150px] min-w-[150px]' },
  { key: 'cumulativeActualTarget', label: '累计实际目标额', className: 'w-[150px] min-w-[150px]', sortable: false },
  { key: 'cumulativeOrder', label: '累计开单额', className: 'w-[140px] min-w-[140px]' },
  { key: 'cumulativeOrderRate', label: '累计开单达成率', className: 'w-[150px] min-w-[150px]' },
  { key: 'annualTarget', label: '年度目标额', className: 'w-[130px] min-w-[130px]', sortable: false },
  { key: 'annualOrder', label: '年度开单额', className: 'w-[130px] min-w-[130px]' },
  { key: 'annualCompletionRate', label: '年度开单达成率', className: 'w-[150px] min-w-[150px]' },
];

const headerClass = 'border-b border-r border-[#D8DEE9] bg-[#F8FAFC] px-2 py-3 text-left font-semibold text-[#111827]';
const bodyClass = 'border-b border-r border-[#E5E7EB] px-2 py-3';
const rightBodyClass = 'border-b border-l border-[#F3F4F6] px-3 py-3 text-right';
const actionHeaderClass = 'sticky right-0 z-40 w-[124px] min-w-[124px] border-b border-l border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-center font-semibold text-[#374151] shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';
const actionBodyClass = 'sticky right-0 z-30 w-[124px] min-w-[124px] border-b border-l border-[#E5E7EB] px-3 py-2 text-center shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';

function fmtCurrency(value: number) {
  const sign = value < 0 ? '-' : '';
  return `${sign}￥${Math.abs(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

function getSalespersonArea(dept: string, group: string, salesperson: string) {
  if (dept !== '全球渠道部') return '-';
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
  return Object.entries(areaMap[group] ?? {}).find(([, names]) => names.includes(salesperson))?.[0] ?? '-';
}

function normalizeRows(rows: SalespersonMonthlyTableRow[]) {
  let currentDept = '';
  let currentGroup = '';
  return rows.reduce<DetailRow[]>((detailRows, row) => {
    if (row.dept) currentDept = row.dept;
    if (row.group !== undefined && row.group !== '') currentGroup = row.group;
    if (row.isGroupSubtotal || row.isDeptSubtotal || row.isGrandTotal) return detailRows;
    const group = row.group ?? currentGroup;
    detailRows.push({
      id: row.id,
      dept: currentDept,
      group,
      area: getSalespersonArea(currentDept, group, row.salesperson),
      salesperson: row.salesperson,
      annualTarget: row.annualTarget,
      months: row.months,
    });
    return detailRows;
  }, []);
}

function sumMonthData(rows: DetailRow[]) {
  return monthColumns.map((_, index) => {
    const actualTarget = rows.reduce((sum, row) => sum + (row.months[index]?.actualTarget ?? 0), 0);
    const actualOrder = rows.reduce((sum, row) => sum + (row.months[index]?.actualOrder ?? 0), 0);
    return {
      initialTarget: rows.reduce((sum, row) => sum + (row.months[index]?.initialTarget ?? 0), 0),
      actualTarget,
      actualOrder,
      achievementRate: toPercent(actualOrder, actualTarget),
    };
  });
}

function enhanceRow(row: DetailRow, isTotal = false): TableRow {
  const currentMonth = row.months[CURRENT_MONTH_INDEX] ?? { actualTarget: 0, actualOrder: 0 };
  const cumulativeMonths = row.months.slice(0, CUMULATIVE_MONTH_COUNT);
  const cumulativeActualTarget = cumulativeMonths.reduce((sum, month) => sum + month.actualTarget, 0);
  const cumulativeOrder = cumulativeMonths.reduce((sum, month) => sum + month.actualOrder, 0);
  const annualOrder = row.months.reduce((sum, month) => sum + month.actualOrder, 0);
  return {
    ...row,
    isTotal,
    currentTarget: currentMonth.actualTarget,
    currentOrder: currentMonth.actualOrder,
    currentRate: toPercent(currentMonth.actualOrder, currentMonth.actualTarget),
    cumulativeActualTarget,
    cumulativeOrder,
    cumulativeOrderRate: toPercent(cumulativeOrder, cumulativeActualTarget),
    annualOrder,
    annualCompletionRate: toPercent(annualOrder, row.annualTarget),
  };
}

function makeTotalRow(rows: DetailRow[]) {
  return enhanceRow(
    {
      id: 'salesperson-total',
      dept: '合计',
      group: '-',
      area: '-',
      salesperson: '合计',
      annualTarget: rows.reduce((sum, row) => sum + row.annualTarget, 0),
      months: sumMonthData(rows),
    },
    true
  );
}

function buildTableRows(rows: DetailRow[], sortConfig: { key: SortKey; direction: SortDirection } | null) {
  const detailRows = rows.map((row) => enhanceRow(row));
  if (sortConfig) {
    detailRows.sort((a, b) => {
      const diff = a[sortConfig.key] - b[sortConfig.key];
      return sortConfig.direction === 'asc' ? diff : -diff;
    });
  }
  return [makeTotalRow(rows), ...detailRows];
}

function renderValue(row: TableRow, key: SortKey) {
  return key.endsWith('Rate') ? fmtPct(row[key]) : fmtCurrency(row[key]);
}

function SortHeader({ column, sortConfig, onSort }: { column: { key: SortKey; label: string; className: string; sortable?: boolean }; sortConfig: { key: SortKey; direction: SortDirection } | null; onSort: (key: SortKey) => void }) {
  const active = sortConfig?.key === column.key;
  if (column.sortable === false) {
    return <span>{column.label}</span>;
  }
  return (
    <button type="button" onClick={() => onSort(column.key)} className="inline-flex w-full items-center justify-end gap-1 text-right">
      <span>{column.label}</span>
      {active && sortConfig?.direction === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-primary" /> : <ArrowDown className={cn('h-3.5 w-3.5', active ? 'text-primary' : 'text-[#9CA3AF]')} />}
    </button>
  );
}

function MonthlyDetailDialog({ row, onClose }: { row: TableRow | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(row)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[82vh] max-w-[780px] overflow-hidden p-5">
        {row && (
          <>
            <DialogHeader className="gap-1">
              <DialogTitle>开单额明细</DialogTitle>
              <DialogDescription>{row.dept} / {row.group} / {row.area} / {row.salesperson}</DialogDescription>
            </DialogHeader>
            <div className="max-h-[56vh] overflow-y-auto rounded-md border border-[#E5E7EB]">
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
                  {row.months.map((month, index) => (
                    <tr key={monthColumns[index]?.label} className="hover:bg-[#F9FAFB]">
                      <td className="border-b border-r border-[#F3F4F6] px-3 py-2">{monthColumns[index]?.label}</td>
                      <td className={cn('border-b border-r border-[#F3F4F6] px-3 py-2 text-right', negativeClass(month.actualTarget))}>{fmtCurrency(month.actualTarget)}</td>
                      <td className={cn('border-b border-r border-[#F3F4F6] px-3 py-2 text-right font-medium', negativeClass(month.actualOrder))}>{fmtCurrency(month.actualOrder)}</td>
                      <td className={cn('border-b border-[#F3F4F6] px-3 py-2 text-right font-medium', negativeClass(month.achievementRate))}>{fmtPct(month.achievementRate)}</td>
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

export default function SalespersonMonthly() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [year, setYear] = useState('2026');
  const [companyTab, setCompanyTab] = useState<CompanyTab>('tech');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');
  const [detailRow, setDetailRow] = useState<TableRow | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  const { rows } = useMemo(() => getSalespersonMonthlyData(), []);
  const normalizedRows = useMemo(() => normalizeRows(rows), [rows]);
  const tabRows = useMemo(
    () => normalizedRows.filter((row) => (companyTab === 'electronics' ? row.dept === '河东电子' : row.dept !== '河东电子')),
    [companyTab, normalizedRows]
  );
  const filteredRows = useMemo(
    () =>
      tabRows
        .filter((row) => matchesShippingHierarchyFilter(row, departmentFilter))
        .filter((row) => salespersonFilter === 'all' || row.salesperson === salespersonFilter),
    [departmentFilter, salespersonFilter, tabRows]
  );
  const tableRows = useMemo(() => buildTableRows(filteredRows, sortConfig), [filteredRows, sortConfig]);
  const salespersonOptions = useMemo(() => Array.from(new Set(tabRows.map((row) => row.salesperson))), [tabRows]);
  const filterOptions = useMemo(
    () => SHIPPING_HIERARCHY_FILTER_OPTIONS.filter((option) => (companyTab === 'electronics' ? option.value === 'all' || option.value === 'department|河东电子' : !option.value.includes('河东电子'))),
    [companyTab]
  );

  const allSelected = tableRows.length > 0 && tableRows.every((row) => selectedKeys.has(row.id));
  const someSelected = selectedKeys.size > 0 && !allSelected;
  const toggleSort = (key: SortKey) => setSortConfig((prev) => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'desc' }));
  const resetSelection = () => setSelectedKeys(new Set());
  const handleReset = () => {
    setYear('2026');
    setDepartmentFilter('all');
    setSalespersonFilter('all');
    setSortConfig(null);
    resetSelection();
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex h-11 items-end gap-8 border-b border-[#E5E7EB]">
        {[{ key: 'tech' as const, label: '河东科技' }, { key: 'electronics' as const, label: '河东电子' }].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setCompanyTab(tab.key);
              setDepartmentFilter('all');
              setSalespersonFilter('all');
              setSortConfig(null);
              resetSelection();
            }}
            className={cn('relative h-11 px-1 text-[14px] font-medium transition-colors', companyTab === tab.key ? 'text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary' : 'text-[#4B5563] hover:text-primary')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="h-9 w-[120px]"><SelectValue placeholder="年份" /></SelectTrigger>
            <SelectContent><SelectItem value="2026">2026年</SelectItem><SelectItem value="2025">2025年</SelectItem><SelectItem value="2024">2024年</SelectItem></SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={(value) => { setDepartmentFilter(value); resetSelection(); }}>
            <SelectTrigger className="h-9 w-[280px]"><SelectValue placeholder="部门" /></SelectTrigger>
            <SelectContent className="max-h-[320px]">{filterOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={salespersonFilter} onValueChange={(value) => { setSalespersonFilter(value); resetSelection(); }}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="业务员" /></SelectTrigger>
            <SelectContent className="max-h-[320px]"><SelectItem value="all">全部业务员</SelectItem>{salespersonOptions.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-caption text-text-tertiary">每天19:00自动更新数据</span>
          <Button variant="outline" size="sm" onClick={handleReset}>重置</Button>
          <Button size="sm" onClick={() => toast.success('查询完成', { description: '已按当前筛选条件刷新列表' })}>查询</Button>
        </div>
      </div>

      <DataUpdateNotice text="当月实际开单额、当月实际开单达成率、年度开单额、年度开单达成率每天 19:00 自动更新；累计开单额、累计开单达成率每月最后一天 19:00 更新至上月数据" />

      <SectionCard>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-caption text-text-secondary">已选 <span className="font-semibold text-primary">{selectedKeys.size}</span> 条</span>
          <Button variant="outline" size="sm" onClick={() => toast.info('导出功能开发中')}><Download className="mr-1 h-4 w-4" />导出</Button>
        </div>
        <div className="relative overflow-x-auto rounded-md border border-[#E5E7EB]">
          <table className="w-max min-w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th rowSpan={2} className={cn(headerClass, 'w-[40px] min-w-[40px] text-center')}>
                  <input type="checkbox" className="cursor-pointer" checked={allSelected} ref={(el) => { if (el) el.indeterminate = someSelected; }} onChange={() => setSelectedKeys(allSelected ? new Set() : new Set(tableRows.map((row) => row.id)))} />
                </th>
                <th rowSpan={2} className={cn(headerClass, 'w-[96px] min-w-[96px]')}>部门</th>
                <th rowSpan={2} className={cn(headerClass, 'w-[100px] min-w-[100px]')}>分组</th>
                <th rowSpan={2} className={cn(headerClass, 'w-[90px] min-w-[90px]')}>区域</th>
                <th rowSpan={2} className={cn(headerClass, 'w-[100px] min-w-[100px]')}>业务员</th>
                {sortableColumns.slice(0, 3).map((column) => <th key={column.key} rowSpan={2} className={cn(headerClass, column.className, 'text-right')}><SortHeader column={column} sortConfig={sortConfig} onSort={toggleSort} /></th>)}
                <th colSpan={3} className="border-b border-l border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-center font-semibold text-[#111827]">1~4月</th>
                {sortableColumns.slice(6).map((column) => <th key={column.key} rowSpan={2} className={cn(headerClass, column.className, 'text-right')}><SortHeader column={column} sortConfig={sortConfig} onSort={toggleSort} /></th>)}
                <th rowSpan={2} className={actionHeaderClass}>操作</th>
              </tr>
              <tr>
                {sortableColumns.slice(3, 6).map((column) => <th key={column.key} className={cn(headerClass, column.className, 'text-right')}><SortHeader column={column} sortConfig={sortConfig} onSort={toggleSort} /></th>)}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => {
                const rowBg = row.isTotal ? 'bg-[#EEF2FF] font-semibold' : 'bg-white';
                return (
                  <tr key={row.id} className={cn(rowBg, !row.isTotal && 'hover:bg-[#F9FAFB]')}>
                    <td className={cn(bodyClass, rowBg, 'text-center')}><input type="checkbox" className="cursor-pointer" checked={selectedKeys.has(row.id)} onChange={() => setSelectedKeys((prev) => { const next = new Set(prev); next.has(row.id) ? next.delete(row.id) : next.add(row.id); return next; })} /></td>
                    <td className={cn(bodyClass, rowBg, 'font-semibold')}>{row.dept}</td>
                    <td className={cn(bodyClass, rowBg)}>{row.group}</td>
                    <td className={cn(bodyClass, rowBg)}>{row.area}</td>
                    <td className={cn(bodyClass, rowBg)}>{row.salesperson}</td>
                    {sortableColumns.map((column) => <td key={`${row.id}-${column.key}`} className={cn(rightBodyClass, rowBg, column.className, negativeClass(row[column.key]))}>{renderValue(row, column.key)}</td>)}
                    <td className={cn(actionBodyClass, rowBg)}>
                      <Button variant="outline" size="sm" onClick={() => setDetailRow(row)} className="h-7 gap-1.5 px-2 text-[12px]"><CalendarDays className="h-3.5 w-3.5" />开单额明细</Button>
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
