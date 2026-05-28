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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getChannelDealerData, type ChannelDealerRow } from './mockData';
import { SHIPPING_DEPARTMENTS } from './sharedOptions';
import { ArrowDown, ArrowUp, CalendarDays, ChevronDown, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DataUpdateNotice } from '@/components/DataUpdateNotice';

type CompanyTab = 'tech' | 'electronics';
type MonthKey = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';
type SortDirection = 'asc' | 'desc';
type SortKey =
  | 'currentOrder'
  | 'cumulativeShipping'
  | 'yoyDiff'
  | 'yoyGrowth'
  | 'annualTarget'
  | 'annualShipping'
  | 'annualCompletionRate';

interface DetailRow extends ChannelDealerRow {
  parentId?: string;
  isDetail?: boolean;
}

interface TableRow extends ChannelDealerRow {
  isTotal?: boolean;
  detailRows?: DetailRow[];
  currentOrder: number;
  annualTarget: number;
  annualShipping: number;
  annualCompletionRate: number;
  cumulativeShipping: number;
}

const CUSTOMER_TYPE_OPTIONS = ['国际渠道商', '国内渠道商', 'ODM客户', '国际重点渠道商', '国内重点渠道商', '国际发展组客户', '国内地产客户'];
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
const CURRENT_MONTH: MonthKey = 'apr';
const sortableColumns: { key: SortKey; label: string; className: string; sortable?: boolean }[] = [
  { key: 'currentOrder', label: '当月实际开单额', className: 'w-[150px] min-w-[150px]' },
  { key: 'cumulativeShipping', label: '累计开单额', className: 'w-[140px] min-w-[140px]' },
  { key: 'yoyDiff', label: '同比差额', className: 'w-[130px] min-w-[130px]', sortable: false },
  { key: 'yoyGrowth', label: '同比增长率', className: 'w-[130px] min-w-[130px]', sortable: false },
  { key: 'annualTarget', label: '年度目标额', className: 'w-[130px] min-w-[130px]', sortable: false },
  { key: 'annualShipping', label: '年度开单额', className: 'w-[130px] min-w-[130px]' },
  { key: 'annualCompletionRate', label: '年度开单达成率', className: 'w-[150px] min-w-[150px]' },
];

const visibleColumns: { key: SortKey; label: string; className: string; sortable?: boolean }[] = [
  { key: 'currentOrder', label: '当月开单额', className: 'w-[150px] min-w-[150px]' },
  { key: 'cumulativeShipping', label: '开单额', className: 'w-[140px] min-w-[140px]' },
  { key: 'annualCompletionRate', label: '年度目标达成率', className: 'w-[150px] min-w-[150px]' },
  { key: 'yoyDiff', label: '同比差额', className: 'w-[130px] min-w-[130px]', sortable: false },
  { key: 'yoyGrowth', label: '同比增长率', className: 'w-[130px] min-w-[130px]', sortable: false },
  { key: 'annualTarget', label: '年度目标额', className: 'w-[130px] min-w-[130px]', sortable: false },
  { key: 'annualShipping', label: '年度开单额', className: 'w-[130px] min-w-[130px]' },
];
void sortableColumns;

const headerClass = 'border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-left font-semibold text-[#111827]';
const bodyClass = 'border-b border-r border-[#F3F4F6] px-3 py-3 text-left text-[#111827]';
const rightBodyClass = 'border-b border-l border-[#F3F4F6] px-3 py-3 text-right';
const actionHeaderClass = 'sticky right-0 z-40 w-[124px] min-w-[124px] border-b border-l border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-center font-semibold text-[#374151] shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';
const actionBodyClass = 'sticky right-0 z-30 w-[124px] min-w-[124px] border-b border-l border-[#E5E7EB] px-3 py-2 text-center shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';

function formatMoney(value: number) {
  const sign = value < 0 ? '-' : '';
  return `${sign}￥${Math.abs(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPct(value: number) {
  return `${value.toFixed(2)}%`;
}

function toPercent(value: number, base: number) {
  return base === 0 ? 0 : Number(((value / base) * 100).toFixed(2));
}

function negativeClass(value: number) {
  return value < 0 ? 'text-[#DC2626]' : '';
}

function splitMultiValue(value: string) {
  return value.split(/[,，、/]/).map((item) => item.trim()).filter(Boolean);
}

function uniqueOptions(values: string[]) {
  return Array.from(new Set(values.flatMap(splitMultiValue))).filter(Boolean);
}

function getAnnualShipping(row: Pick<ChannelDealerRow, MonthKey>) {
  return monthColumns.reduce((sum, month) => sum + row[month.key], 0);
}

function getPreviousCumulative(row: ChannelDealerRow) {
  return row.totalJanApr - row.yoyDiff;
}

function splitDealerRow(row: ChannelDealerRow): DetailRow[] {
  const departments = splitMultiValue(row.department);
  const salespersons = splitMultiValue(row.salesperson);
  const ownerCount = Math.max(departments.length, salespersons.length, 1);
  return Array.from({ length: ownerCount }, (_, index) => {
    const factor = 1 / ownerCount;
    const monthly = monthColumns.reduce((acc, month) => {
      acc[month.key] = Number((row[month.key] * factor).toFixed(2));
      return acc;
    }, {} as Record<MonthKey, number>);
    const totalJanApr = monthly.jan + monthly.feb + monthly.mar + monthly.apr;
    const signingAmount = Number((row.signingAmount * factor).toFixed(2));
    const annualShipping = getAnnualShipping(monthly);
    const previous = getPreviousCumulative(row) * factor;
    const yoyDiff = Number((totalJanApr - previous).toFixed(2));
    return {
      ...row,
      ...monthly,
      id: `${row.id}-owner-${index}`,
      parentId: row.id,
      isDetail: true,
      department: departments[index] ?? departments[0] ?? '-',
      salesperson: salespersons[index] ?? salespersons[0] ?? '-',
      signingAmount,
      totalJanApr,
      completionRate: toPercent(annualShipping, signingAmount),
      yoyDiff,
      yoyGrowth: toPercent(yoyDiff, previous),
    };
  });
}

function enhance(row: ChannelDealerRow, detailRows?: DetailRow[], isTotal = false): TableRow {
  const annualShipping = getAnnualShipping(row);
  return {
    ...row,
    isTotal,
    detailRows,
    currentOrder: row[CURRENT_MONTH],
    annualTarget: row.signingAmount,
    annualShipping,
    annualCompletionRate: toPercent(annualShipping, row.signingAmount),
    cumulativeShipping: row.totalJanApr,
  };
}

function aggregateRows(rows: DetailRow[], id: string, name: string, isTotal = false): TableRow {
  const monthly = monthColumns.reduce((acc, month) => {
    acc[month.key] = rows.reduce((sum, row) => sum + row[month.key], 0);
    return acc;
  }, {} as Record<MonthKey, number>);
  const signingAmount = rows.reduce((sum, row) => sum + row.signingAmount, 0);
  const totalJanApr = monthly.jan + monthly.feb + monthly.mar + monthly.apr;
  const previous = rows.reduce((sum, row) => sum + getPreviousCumulative(row), 0);
  const yoyDiff = totalJanApr - previous;
  const row: ChannelDealerRow = {
    id,
    name,
    department: isTotal ? '-' : uniqueOptions(rows.map((item) => item.department)).join(', '),
    salesperson: isTotal ? '-' : uniqueOptions(rows.map((item) => item.salesperson)).join(', '),
    channelType: isTotal ? '-' : rows[0]?.channelType ?? '-',
    signingAmount,
    ...monthly,
    totalJanApr,
    completionRate: toPercent(getAnnualShipping(monthly), signingAmount),
    yoyDiff,
    yoyGrowth: toPercent(yoyDiff, previous),
  };
  return enhance(row, isTotal ? undefined : rows, isTotal);
}

function renderValue(row: TableRow | DetailRow, key: SortKey) {
  if (key === 'annualCompletionRate') return formatPct('annualCompletionRate' in row ? row.annualCompletionRate : row.completionRate);
  if (key === 'yoyGrowth') return `${row.yoyGrowth >= 0 ? '+' : ''}${formatPct(row.yoyGrowth)}`;
  if (key === 'yoyDiff') return `${row.yoyDiff >= 0 ? '+' : ''}${formatMoney(row.yoyDiff)}`;
  if (key === 'annualTarget') return formatMoney(row.signingAmount);
  if (key === 'annualShipping') return formatMoney(getAnnualShipping(row));
  if (key === 'cumulativeShipping') return formatMoney(row.totalJanApr);
  if (key === 'currentOrder') return formatMoney(row[CURRENT_MONTH]);
  return '';
}

function sortRows(rows: TableRow[], sortConfig: { key: SortKey; direction: SortDirection } | null) {
  if (!sortConfig) return rows;
  const total = rows.filter((row) => row.isTotal);
  const rest = rows.filter((row) => !row.isTotal).sort((a, b) => {
    const diff = a[sortConfig.key] - b[sortConfig.key];
    return sortConfig.direction === 'asc' ? diff : -diff;
  });
  return [...total, ...rest];
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

function MonthlyDetailDialog({ row, onClose }: { row: TableRow | DetailRow | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(row)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[82vh] max-w-[760px] overflow-hidden p-5">
        {row && (
          <>
            <DialogHeader className="gap-1">
              <DialogTitle>开单额明细</DialogTitle>
              <DialogDescription>{row.name} / {row.department} / {row.salesperson}</DialogDescription>
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
                      <td className={cn('border-b border-[#F3F4F6] px-3 py-2 text-right font-medium', negativeClass(row[month.key]))}>{formatMoney(row[month.key])}</td>
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

export default function ChannelDealer() {
  const [dealerData] = useState(getChannelDealerData());
  const [statYear, setStatYear] = useState('2026');
  const [companyTab, setCompanyTab] = useState<CompanyTab>('tech');
  const [deptFilter, setDeptFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [detailRow, setDetailRow] = useState<TableRow | DetailRow | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  const ownerRows = useMemo(() => dealerData.flatMap(splitDealerRow), [dealerData]);
  const tabRows = useMemo(
    () => ownerRows.filter((row) => (companyTab === 'electronics' ? row.department === '河东电子' : row.department !== '河东电子')),
    [companyTab, ownerRows]
  );
  const filteredOwnerRows = useMemo(
    () =>
      tabRows.filter(
        (row) =>
          (deptFilter === 'all' || row.department === deptFilter) &&
          (salespersonFilter === 'all' || row.salesperson === salespersonFilter) &&
          (customerTypeFilter === 'all' || row.channelType === customerTypeFilter) &&
          (customerFilter === 'all' || row.name === customerFilter)
      ),
    [customerFilter, customerTypeFilter, deptFilter, salespersonFilter, tabRows]
  );
  const tableRows = useMemo(() => {
    const grouped = new Map<string, DetailRow[]>();
    filteredOwnerRows.forEach((row) => grouped.set(row.name, [...(grouped.get(row.name) ?? []), row]));
    const summaryRows = Array.from(grouped.entries()).map(([name, rows]) => aggregateRows(rows, rows[0].parentId ?? rows[0].id, name));
    return sortRows([aggregateRows(filteredOwnerRows, 'channel-dealer-total', '合计', true), ...summaryRows], sortConfig);
  }, [filteredOwnerRows, sortConfig]);

  const departmentOptions = useMemo(() => SHIPPING_DEPARTMENTS.filter((dept) => (companyTab === 'electronics' ? dept === '河东电子' : dept !== '河东电子')), [companyTab]);
  const salespersonOptions = useMemo(() => uniqueOptions(tabRows.map((row) => row.salesperson)), [tabRows]);
  const customerOptions = useMemo(() => Array.from(new Set(tabRows.map((row) => row.name))), [tabRows]);
  const selectedVisibleCount = tableRows.filter((row) => selectedKeys.has(row.id)).length;
  const allSelected = tableRows.length > 0 && tableRows.every((row) => selectedKeys.has(row.id));
  const someSelected = selectedVisibleCount > 0 && !allSelected;
  const resetSelection = () => setSelectedKeys(new Set());
  const toggleSort = (key: SortKey) => setSortConfig((prev) => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'desc' }));

  const resetFilters = () => {
    setStatYear('2026');
    setDeptFilter('all');
    setSalespersonFilter('all');
    setCustomerTypeFilter('all');
    setCustomerFilter('all');
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
              resetFilters();
              setExpandedKeys(new Set());
            }}
            className={cn('relative h-11 px-1 text-[14px] font-medium transition-colors', companyTab === tab.key ? 'text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary' : 'text-[#4B5563] hover:text-primary')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={statYear} onValueChange={setStatYear}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="年份" /></SelectTrigger>
            <SelectContent><SelectItem value="2026">2026</SelectItem><SelectItem value="2025">2025</SelectItem><SelectItem value="2024">2024</SelectItem></SelectContent>
          </Select>
          <Select value={deptFilter} onValueChange={(value) => { setDeptFilter(value); resetSelection(); }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="选择部门" /></SelectTrigger>
            <SelectContent><SelectItem value="all">全部部门</SelectItem>{departmentOptions.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={salespersonFilter} onValueChange={(value) => { setSalespersonFilter(value); resetSelection(); }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="选择业务员" /></SelectTrigger>
            <SelectContent><SelectItem value="all">全部业务员</SelectItem>{salespersonOptions.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={customerTypeFilter} onValueChange={(value) => { setCustomerTypeFilter(value); resetSelection(); }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="选择客户类型" /></SelectTrigger>
            <SelectContent><SelectItem value="all">全部客户类型</SelectItem>{CUSTOMER_TYPE_OPTIONS.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={customerFilter} onValueChange={(value) => { setCustomerFilter(value); resetSelection(); }}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="选择客户" /></SelectTrigger>
            <SelectContent><SelectItem value="all">全部客户</SelectItem>{customerOptions.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-caption text-text-tertiary">每天19:00自动更新数据</span>
          <Button variant="outline" size="sm" onClick={resetFilters}>重置</Button>
          <Button size="sm" onClick={() => toast.success('查询完成', { description: '已按当前筛选条件刷新列表' })}>查询</Button>
        </div>
      </div>

      <DataUpdateNotice text="当月开单额、年度开单额、年度目标达成率每天 19:00 自动更新；月度累计：开单额、同比差额、同比增长率、年度目标达成率每月最后一天 19:00 更新至上月数据；" />

      <SectionCard>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-caption text-text-secondary">已选 <span className="font-semibold text-primary">{selectedVisibleCount}</span> 条</span>
          <Button variant="outline" size="sm" onClick={() => toast.success('导出成功', { description: `已一次性导出 ${filteredOwnerRows.length} 条客户明细数据` })}><Download className="mr-1 h-4 w-4" />导出全部</Button>
        </div>
        <div className="relative overflow-x-auto rounded-md border border-[#E5E7EB]">
          <table className="w-max min-w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th rowSpan={2} className={cn(headerClass, 'w-[44px] min-w-[44px] text-center')}>
                  <input type="checkbox" className="cursor-pointer" checked={allSelected} ref={(el) => { if (el) el.indeterminate = someSelected; }} onChange={() => setSelectedKeys(allSelected ? new Set() : new Set(tableRows.map((row) => row.id)))} />
                </th>
                <th rowSpan={2} className={cn(headerClass, 'w-[58px] min-w-[58px] text-center')}>展开</th>
                <th rowSpan={2} className={cn(headerClass, 'w-[130px] min-w-[130px]')}>客户名称</th>
                <th rowSpan={2} className={cn(headerClass, 'w-[140px] min-w-[140px]')}>客户类型</th>
                <th rowSpan={2} className={cn(headerClass, 'w-[180px] min-w-[180px]')}>部门</th>
                <th rowSpan={2} className={cn(headerClass, 'w-[170px] min-w-[170px]')}>业务员</th>
                <th rowSpan={2} className={cn(headerClass, visibleColumns[0].className, 'text-right')}><SortHeader column={visibleColumns[0]} sortConfig={sortConfig} onSort={toggleSort} /></th>
                <th colSpan={4} className="border-b border-l border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-center font-semibold text-[#111827]">1~4月</th>
                {visibleColumns.slice(5).map((column) => <th key={column.key} rowSpan={2} className={cn(headerClass, column.className, 'text-right')}><SortHeader column={column} sortConfig={sortConfig} onSort={toggleSort} /></th>)}
                <th rowSpan={2} className={cn(headerClass, 'w-[150px] min-w-[150px] text-right')}>年度目标达成率</th>
                <th rowSpan={2} className={actionHeaderClass}>操作</th>
              </tr>
              <tr>
                {visibleColumns.slice(1, 5).map((column) => <th key={column.key} className={cn(headerClass, column.className, 'text-right')}><SortHeader column={column} sortConfig={sortConfig} onSort={toggleSort} /></th>)}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => {
                const expanded = expandedKeys.has(row.id);
                const rowBg = row.isTotal ? 'bg-[#EEF2FF] font-semibold' : 'bg-white';
                return (
                  <>
                    <tr key={row.id} className={cn(rowBg, !row.isTotal && 'hover:bg-[#F9FAFB]')}>
                      <td className={cn(bodyClass, rowBg, 'text-center')}><input type="checkbox" className="cursor-pointer" checked={selectedKeys.has(row.id)} onChange={() => setSelectedKeys((prev) => { const next = new Set(prev); next.has(row.id) ? next.delete(row.id) : next.add(row.id); return next; })} /></td>
                      <td className={cn(bodyClass, rowBg, 'text-center')}>
                        {!row.isTotal && (row.detailRows?.length ?? 0) > 1 && (
                          <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-[#EEF2FF]" onClick={() => setExpandedKeys((prev) => { const next = new Set(prev); next.has(row.id) ? next.delete(row.id) : next.add(row.id); return next; })}>
                            {expanded ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-[#6B7280]" />}
                          </button>
                        )}
                      </td>
                      <td className={cn(bodyClass, rowBg, 'font-medium')}>{row.name}</td>
                      <td className={cn(bodyClass, rowBg)}>{row.channelType}</td>
                      <td className={cn(bodyClass, rowBg)}>{row.department}</td>
                      <td className={cn(bodyClass, rowBg)}>{row.salesperson}</td>
                      {visibleColumns.map((column) => <td key={`${row.id}-${column.key}`} className={cn(rightBodyClass, rowBg, column.className, negativeClass(row[column.key]))}>{renderValue(row, column.key)}</td>)}
                      <td className={cn(rightBodyClass, rowBg, 'w-[150px] min-w-[150px]', negativeClass(row.annualCompletionRate))}>{renderValue(row, 'annualCompletionRate')}</td>
                      <td className={cn(actionBodyClass, rowBg)}><Button variant="outline" size="sm" onClick={() => setDetailRow(row)} className="h-7 gap-1.5 px-2 text-[12px]"><CalendarDays className="h-3.5 w-3.5" />开单额明细</Button></td>
                    </tr>
                    {expanded && row.detailRows?.map((detail) => (
                      <tr key={detail.id} className="bg-[#FAFBFF] hover:bg-[#F5F7FF]">
                        <td className={bodyClass} />
                        <td className={cn(bodyClass, 'text-center text-[#9CA3AF]')}>明细</td>
                        <td className={cn(bodyClass, 'pl-6 text-[#374151]')}>{detail.name}</td>
                        <td className={bodyClass}>{detail.channelType}</td>
                        <td className={bodyClass}>{detail.department}</td>
                        <td className={bodyClass}>{detail.salesperson}</td>
                        {visibleColumns.map((column) => <td key={`${detail.id}-${column.key}`} className={cn(rightBodyClass, column.className, negativeClass(column.key === 'annualCompletionRate' ? detail.completionRate : column.key === 'annualTarget' ? detail.signingAmount : column.key === 'annualShipping' ? getAnnualShipping(detail) : column.key === 'cumulativeShipping' ? detail.totalJanApr : column.key === 'currentOrder' ? detail[CURRENT_MONTH] : detail[column.key]))}>{renderValue(detail, column.key)}</td>)}
                        <td className={cn(rightBodyClass, 'w-[150px] min-w-[150px]', negativeClass(detail.completionRate))}>{renderValue(detail, 'annualCompletionRate')}</td>
                        <td className={actionBodyClass}><Button variant="outline" size="sm" onClick={() => setDetailRow(detail)} className="h-7 gap-1.5 px-2 text-[12px]"><CalendarDays className="h-3.5 w-3.5" />开单额明细</Button></td>
                      </tr>
                    ))}
                  </>
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
