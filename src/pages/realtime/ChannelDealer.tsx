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
import {
  getChannelDealerData,
  channelDealerKpis,
  type ChannelDealerRow,
} from './mockData';
import { SHIPPING_DEPARTMENTS } from './sharedOptions';

import { CalendarDays, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DataUpdateNotice } from '@/components/DataUpdateNotice';
import { UpdateDataDialog } from '@/components/UpdateDataDialog';

const SHOW_SUMMARY_KPIS = false;

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

type StatKey =
  | 'annualShipping'
  | 'annualCompletionRate'
  | 'cumulativeShipping'
  | 'yoyDiff'
  | 'yoyGrowth';

type TableRow = ChannelDealerRow & { isTotal?: boolean };

const CUSTOMER_TYPE_OPTIONS = [
  '国际渠道商',
  '国内渠道商',
  'ODM客户',
  '国际重点渠道商',
  '国内重点渠道商',
  '国际发展组客户',
  '国内地产客户',
];

const monthColumns: { key: MonthKey; title: string }[] = [
  { key: 'jan', title: '1月出货额' },
  { key: 'feb', title: '2月出货额' },
  { key: 'mar', title: '3月出货额' },
  { key: 'apr', title: '4月出货额' },
  { key: 'may', title: '5月出货额' },
  { key: 'jun', title: '6月出货额' },
  { key: 'jul', title: '7月出货额' },
  { key: 'aug', title: '8月出货额' },
  { key: 'sep', title: '9月出货额' },
  { key: 'oct', title: '10月出货额' },
  { key: 'nov', title: '11月出货额' },
  { key: 'dec', title: '12月出货额' },
];

const statColumns: {
  key: StatKey;
  title: string;
  className: string;
}[] = [
  {
    key: 'annualShipping',
    title: '26年出货额',
    className: 'right-[724px] w-[145px] min-w-[145px]',
  },
  {
    key: 'annualCompletionRate',
    title: '26年出货完成率',
    className: 'right-[579px] w-[145px] min-w-[145px]',
  },
  {
    key: 'cumulativeShipping',
    title: '累计出货额（1-4月）',
    className: 'right-[434px] w-[145px] min-w-[145px]',
  },
  {
    key: 'yoyDiff',
    title: '同比差额（1-4月）',
    className: 'right-[284px] w-[150px] min-w-[150px]',
  },
  {
    key: 'yoyGrowth',
    title: '同比增长率（1-4月）',
    className: 'right-[124px] w-[160px] min-w-[160px]',
  },
];

const headerClass =
  'border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-left font-semibold text-[#111827]';
const bodyClass =
  'border-b border-r border-[#F3F4F6] px-3 py-3 text-left text-[#111827]';
const statHeaderClass =
  'sticky z-40 border-b border-l border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-right font-semibold text-[#374151] shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';
const statBodyClass =
  'sticky z-30 border-b border-l border-[#F3F4F6] bg-white px-3 py-3 text-right shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';
const actionHeaderClass =
  'sticky right-0 z-40 w-[124px] min-w-[124px] border-b border-l border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-center font-semibold text-[#374151] shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';
const actionBodyClass =
  'sticky right-0 z-30 w-[124px] min-w-[124px] border-b border-l border-[#E5E7EB] bg-white px-3 py-2 text-center shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';

function formatMoney(value: number) {
  const sign = value < 0 ? '-' : '';
  return `${sign}￥${Math.abs(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPct(value: number) {
  return `${value.toFixed(2)}%`;
}

function toPercent(value: number, base: number) {
  return base === 0 ? 0 : Number(((value / base) * 100).toFixed(2));
}

function getAnnualShipping(row: ChannelDealerRow) {
  return monthColumns.reduce((sum, month) => sum + row[month.key], 0);
}

function getPreviousCumulativeShipping(row: ChannelDealerRow) {
  return row.totalJanApr - row.yoyDiff;
}

function splitMultiValue(value: string) {
  return value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function matchesMultiValue(value: string, filterValue: string) {
  if (filterValue === 'all') return true;
  return splitMultiValue(value).includes(filterValue);
}

function uniqueOptions(values: string[]) {
  return Array.from(new Set(values.flatMap(splitMultiValue))).filter(Boolean);
}

function makeTotalRow(rows: ChannelDealerRow[]): TableRow {
  const monthlyTotals = monthColumns.reduce((totals, month) => {
    totals[month.key] = rows.reduce((sum, row) => sum + row[month.key], 0);
    return totals;
  }, {} as Record<MonthKey, number>);
  const signingAmount = rows.reduce((sum, row) => sum + row.signingAmount, 0);
  const totalJanApr = monthlyTotals.jan + monthlyTotals.feb + monthlyTotals.mar + monthlyTotals.apr;
  const annualShipping = monthColumns.reduce((sum, month) => sum + monthlyTotals[month.key], 0);
  const previousCumulativeShipping = rows.reduce(
    (sum, row) => sum + getPreviousCumulativeShipping(row),
    0
  );
  const yoyDiff = totalJanApr - previousCumulativeShipping;

  return {
    id: 'channel-dealer-total',
    name: '合计',
    department: '-',
    salesperson: '-',
    channelType: '-',
    signingAmount,
    jan: monthlyTotals.jan,
    feb: monthlyTotals.feb,
    mar: monthlyTotals.mar,
    apr: monthlyTotals.apr,
    may: monthlyTotals.may,
    jun: monthlyTotals.jun,
    jul: monthlyTotals.jul,
    aug: monthlyTotals.aug,
    sep: monthlyTotals.sep,
    oct: monthlyTotals.oct,
    nov: monthlyTotals.nov,
    dec: monthlyTotals.dec,
    totalJanApr,
    completionRate: toPercent(annualShipping, signingAmount),
    yoyDiff,
    yoyGrowth: toPercent(yoyDiff, previousCumulativeShipping),
    isTotal: true,
  };
}

function renderStat(row: ChannelDealerRow, key: StatKey) {
  switch (key) {
    case 'annualShipping':
      return formatMoney(getAnnualShipping(row));
    case 'annualCompletionRate':
      return formatPct(row.completionRate);
    case 'cumulativeShipping':
      return formatMoney(row.totalJanApr);
    case 'yoyDiff':
      return `${row.yoyDiff >= 0 ? '+' : ''}${formatMoney(row.yoyDiff)}`;
    case 'yoyGrowth':
      return `${row.yoyGrowth >= 0 ? '+' : ''}${formatPct(row.yoyGrowth)}`;
    default:
      return '';
  }
}

function statTone(row: ChannelDealerRow, key: StatKey) {
  if (key !== 'yoyDiff' && key !== 'yoyGrowth') return '';
  return row[key] >= 0 ? 'text-[#059669]' : 'text-[#DC2626]';
}

function MonthlyDetailDialog({
  row,
  onClose,
}: {
  row: TableRow | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(row)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[82vh] max-w-[760px] overflow-hidden p-5">
        {row && (
          <>
            <DialogHeader className="gap-1">
              <DialogTitle>出货额明细</DialogTitle>
              <DialogDescription>
                {row.name} / {row.department} / {row.salesperson}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-4 gap-3 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-[12px]">
              <div>
                <div className="text-text-tertiary">客户名称</div>
                <div className="mt-1 font-semibold text-text-primary">{row.name}</div>
              </div>
              <div>
                <div className="text-text-tertiary">客户类型</div>
                <div className="mt-1 font-semibold text-text-primary">{row.channelType}</div>
              </div>
              <div>
                <div className="text-text-tertiary">部门</div>
                <div className="mt-1 font-semibold text-text-primary">{row.department}</div>
              </div>
              <div>
                <div className="text-text-tertiary">业务员</div>
                <div className="mt-1 font-semibold text-text-primary">{row.salesperson}</div>
              </div>
            </div>

            <div className="max-h-[48vh] overflow-y-auto rounded-md border border-[#E5E7EB]">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#374151]">
                    <th className="sticky top-0 z-10 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-left font-semibold">
                      季度
                    </th>
                    <th className="sticky top-0 z-10 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-left font-semibold">
                      月份
                    </th>
                    <th className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">
                      出货额
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Q1', months: monthColumns.slice(0, 3) },
                    { label: 'Q2', months: monthColumns.slice(3, 6) },
                    { label: 'Q3', months: monthColumns.slice(6, 9) },
                    { label: 'Q4', months: monthColumns.slice(9, 12) },
                  ].flatMap((quarter) => [
                    ...quarter.months.map((month, index) => (
                      <tr key={month.key} className="hover:bg-[#F9FAFB]">
                        {index === 0 && (
                          <td
                            rowSpan={quarter.months.length + 1}
                            className="border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 align-middle font-semibold text-[#111827]"
                          >
                            {quarter.label}
                          </td>
                        )}
                        <td className="border-b border-r border-[#F3F4F6] px-3 py-2">
                          {month.title.replace('出货额', '')}
                        </td>
                        <td className="border-b border-[#F3F4F6] px-3 py-2 text-right font-medium">
                          {formatMoney(row[month.key])}
                        </td>
                      </tr>
                    )),
                    <tr key={`${quarter.label}-total`} className="bg-[#F8FAFC] font-semibold">
                      <td className="border-b border-r border-[#E5E7EB] px-3 py-2 text-right">
                        季度小计
                      </td>
                      <td className="border-b border-[#E5E7EB] px-3 py-2 text-right">
                        {formatMoney(
                          quarter.months.reduce(
                            (sum, month) => sum + row[month.key],
                            0
                          )
                        )}
                      </td>
                    </tr>,
                  ])}
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
  const [dealerData, setDealerData] = useState(getChannelDealerData());
  const [statYear, setStatYear] = useState('2026');
  const [deptFilter, setDeptFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [detailRow, setDetailRow] = useState<TableRow | null>(null);

  const departmentOptions = useMemo(
    () => SHIPPING_DEPARTMENTS,
    []
  );
  const salespersonOptions = useMemo(
    () => uniqueOptions(dealerData.map((row) => row.salesperson)),
    [dealerData]
  );
  const customerOptions = useMemo(
    () => Array.from(new Set(dealerData.map((row) => row.name))),
    [dealerData]
  );

  const filteredRows = useMemo(
    () =>
      dealerData.filter(
        (row) =>
          matchesMultiValue(row.department, deptFilter) &&
          matchesMultiValue(row.salesperson, salespersonFilter) &&
          (customerTypeFilter === 'all' || row.channelType === customerTypeFilter) &&
          (customerFilter === 'all' || row.name === customerFilter)
      ),
    [customerFilter, customerTypeFilter, dealerData, deptFilter, salespersonFilter]
  );

  const tableRows = useMemo<TableRow[]>(
    () => [makeTotalRow(filteredRows), ...filteredRows],
    [filteredRows]
  );

  const selectedVisibleCount = tableRows.filter((row) =>
    selectedKeys.has(row.id)
  ).length;
  const allSelected =
    tableRows.length > 0 && tableRows.every((row) => selectedKeys.has(row.id));
  const someSelected = selectedVisibleCount > 0 && !allSelected;

  const resetSelection = () => setSelectedKeys(new Set());

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        tableRows.forEach((row) => next.delete(row.id));
        return next;
      });
      return;
    }

    setSelectedKeys((prev) => {
      const next = new Set(prev);
      tableRows.forEach((row) => next.add(row.id));
      return next;
    });
  };

  const toggleSelectRow = (id: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleQuery = () => {
    toast.success('查询完成', { description: '已按当前筛选条件刷新列表' });
  };

  const handleCancel = () => {
    setStatYear('2026');
    setDeptFilter('all');
    setSalespersonFilter('all');
    setCustomerTypeFilter('all');
    setCustomerFilter('all');
    setDealerData(getChannelDealerData());
    resetSelection();
    setDetailRow(null);
  };

  const summaryKpis = [
    { label: '年完成额', value: channelDealerKpis.totalShipping, prefix: '¥', format: true, trend: 8.7, comparison: 'vs 上月' },
    { label: '年完成率', value: channelDealerKpis.avgCompletionRate, suffix: '%', decimals: 1, trend: 2.3, comparison: 'vs 上月' },
    { label: '1~4月同比差额', value: channelDealerKpis.openOrders, prefix: '¥', format: true, trend: 5.2, comparison: 'vs 上月' },
    { label: '1~4月同比增长率', value: 8.7, suffix: '%', decimals: 1, trend: -0.8, comparison: '实时变动' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={statYear} onValueChange={setStatYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="年份" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={deptFilter}
            onValueChange={(value) => {
              setDeptFilter(value);
              resetSelection();
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={salespersonFilter}
            onValueChange={(value) => {
              setSalespersonFilter(value);
              resetSelection();
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="选择业务员" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部业务员</SelectItem>
              {salespersonOptions.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={customerTypeFilter}
            onValueChange={(value) => {
              setCustomerTypeFilter(value);
              resetSelection();
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="选择客户类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部客户类型</SelectItem>
              {CUSTOMER_TYPE_OPTIONS.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={customerFilter}
            onValueChange={(value) => {
              setCustomerFilter(value);
              resetSelection();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择客户" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部客户</SelectItem>
              {customerOptions.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-caption text-text-tertiary">
            每天19:00自动更新数据
          </span>
          <UpdateDataDialog />
          <Button variant="outline" size="sm" onClick={handleCancel}>
            重置
          </Button>
          <Button size="sm" onClick={handleQuery}>
            查询
          </Button>
        </div>
      </div>

      {SHOW_SUMMARY_KPIS && (
        <div className="mb-6 grid grid-cols-4 gap-4">
          {summaryKpis.map((kpi, i) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              prefix={kpi.prefix || ''}
              suffix={kpi.suffix || ''}
              decimals={kpi.decimals || 0}
              format={kpi.format || false}
              delay={i * 100}
            />
          ))}
        </div>
      )}

      <DataUpdateNotice
        dailyFields="年出货额、年出货完成率、月出货额"
        monthlyFields="累计出货额、同比差额、同比增长率"
      />

      <SectionCard>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-caption text-text-secondary">
            已选 <span className="font-semibold text-primary">{selectedVisibleCount}</span> 条
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('导出功能开发中')}
          >
            <Download className="mr-1 h-4 w-4" />
            导出
          </Button>
        </div>

        <div className="relative overflow-x-auto rounded-md border border-[#E5E7EB]">
          <table className="w-max min-w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th className={cn(headerClass, 'w-[44px] min-w-[44px] text-center')}>
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className={cn(headerClass, 'w-[130px] min-w-[130px]')}>
                  客户名称
                </th>
                <th className={cn(headerClass, 'w-[140px] min-w-[140px]')}>
                  客户类型
                </th>
                <th className={cn(headerClass, 'w-[125px] min-w-[125px] text-right')}>
                  签约额
                </th>
                <th className={cn(headerClass, 'w-[180px] min-w-[180px]')}>
                  部门
                </th>
                <th className={cn(headerClass, 'w-[170px] min-w-[170px]')}>
                  业务员
                </th>
                {statColumns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(statHeaderClass, column.className)}
                  >
                    {column.title}
                  </th>
                ))}
                <th className={actionHeaderClass}>操作</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    row.isTotal ? 'bg-[#EEF2FF] font-semibold' : 'bg-white hover:bg-[#F9FAFB]'
                  )}
                >
                  <td className={cn(bodyClass, 'text-center', row.isTotal && 'bg-[#EEF2FF]')}>
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={selectedKeys.has(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                    />
                  </td>
                  <td className={cn(bodyClass, 'font-medium', row.isTotal && 'bg-[#EEF2FF]')}>
                    {row.name}
                  </td>
                  <td className={cn(bodyClass, 'text-text-secondary', row.isTotal && 'bg-[#EEF2FF]')}>
                    {row.channelType}
                  </td>
                  <td className={cn(bodyClass, 'text-right', row.isTotal && 'bg-[#EEF2FF]')}>
                    {formatMoney(row.signingAmount)}
                  </td>
                  <td className={cn(bodyClass, 'max-w-[180px]', row.isTotal && 'bg-[#EEF2FF]')}>
                    {row.department}
                  </td>
                  <td className={cn(bodyClass, 'max-w-[170px]', row.isTotal && 'bg-[#EEF2FF]')}>
                    {row.salesperson}
                  </td>
                  {statColumns.map((column) => (
                    <td
                      key={`${row.id}-${column.key}`}
                      className={cn(
                        statBodyClass,
                        column.className,
                        row.isTotal && 'bg-[#EEF2FF] font-semibold',
                        statTone(row, column.key)
                      )}
                    >
                      {renderStat(row, column.key)}
                    </td>
                  ))}
                  <td className={cn(actionBodyClass, row.isTotal && 'bg-[#EEF2FF]')}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailRow(row)}
                      className="h-7 gap-1.5 px-2 text-[12px]"
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                      出货额明细
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <MonthlyDetailDialog row={detailRow} onClose={() => setDetailRow(null)} />
    </div>
  );
}
