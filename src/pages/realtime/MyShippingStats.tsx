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
import { CalendarDays, Download, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  getChannelDealerData,
  getCustomerQuarterlyData,
  getSalespersonMonthlyData,
  type ChannelDealerRow,
  type CustomerQuarterlyRow,
  type SalespersonMonthData,
  type SalespersonMonthlyTableRow,
} from './mockData';

const CURRENT_SALESPERSON = '唐珂';
const CUMULATIVE_MONTH_COUNT = 4;

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

type DetailDialog =
  | { type: 'business'; row: BusinessRow }
  | { type: 'customer'; row: ChannelDealerRow }
  | null;

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

const quarterGroups = [
  { label: 'Q1', months: monthColumns.slice(0, 3) },
  { label: 'Q2', months: monthColumns.slice(3, 6) },
  { label: 'Q3', months: monthColumns.slice(6, 9) },
  { label: 'Q4', months: monthColumns.slice(9, 12) },
];

const tableHeaderClass =
  'border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-left font-semibold text-[#111827]';
const tableCellClass =
  'border-b border-r border-[#F3F4F6] px-3 py-3 text-left text-[#111827]';

function fmtCurrency(value: number, decimals = 2) {
  const sign = value < 0 ? '-' : '';
  return `${sign}￥${Math.abs(value).toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

function fmtPct(value: number, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

function toPercent(value: number, base: number) {
  return base === 0 ? 0 : Number(((value / base) * 100).toFixed(2));
}

function splitMultiValue(value: string) {
  return value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function includesSalesperson(value: string, salesperson: string) {
  return splitMultiValue(value).includes(salesperson);
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

  const groupAreas = areaMap[group] ?? {};
  return (
    Object.entries(groupAreas).find(([, names]) => names.includes(salesperson))?.[0] ?? '-'
  );
}

function normalizeSalespersonRows(rows: SalespersonMonthlyTableRow[]) {
  let department = '';
  let group = '';

  return rows.reduce<BusinessRow[]>((detailRows, row) => {
    if (row.dept) department = row.dept;
    if (row.group !== undefined && row.group !== '') group = row.group;

    if (row.isGroupSubtotal || row.isDeptSubtotal || row.isGrandTotal) {
      return detailRows;
    }

    const actualGroup = row.group ?? group;
    const annualOrder = row.months.reduce((sum, month) => sum + month.actualOrder, 0);
    const cumulativeMonths = row.months.slice(0, CUMULATIVE_MONTH_COUNT);
    const cumulativeActualTarget = cumulativeMonths.reduce(
      (sum, month) => sum + month.actualTarget,
      0
    );
    const cumulativeOrder = cumulativeMonths.reduce(
      (sum, month) => sum + month.actualOrder,
      0
    );

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

function getAnnualShipping(row: ChannelDealerRow) {
  return monthColumns.reduce((sum, month) => sum + row[month.key], 0);
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
    completionRate: toPercent(getAnnualShipping({ ...totals } as ChannelDealerRow), signingAmount),
    yoyDiff,
    yoyGrowth: toPercent(yoyDiff, previousJanApr),
  };
}

function getQuarterAnnualActual(row: CustomerQuarterlyRow) {
  return row.q1Actual + row.q2Actual + row.q3Actual + row.q4Actual;
}

function DetailAmountDialog({
  detail,
  onClose,
}: {
  detail: DetailDialog;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[82vh] max-w-[780px] overflow-hidden p-5">
        {detail?.type === 'business' && (
          <>
            <DialogHeader className="gap-1">
              <DialogTitle>开单额明细</DialogTitle>
              <DialogDescription>
                {detail.row.department} / {detail.row.group} / {detail.row.area} / {detail.row.salesperson}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[52vh] overflow-y-auto rounded-md border border-[#E5E7EB]">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="sticky top-0 z-10 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-left font-semibold">月份</th>
                    <th className="sticky top-0 z-10 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">实际目标额</th>
                    <th className="sticky top-0 z-10 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">实际开单额</th>
                    <th className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">实际达成率</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.row.months.map((month, index) => (
                    <tr key={monthColumns[index]?.label ?? index} className="hover:bg-[#F9FAFB]">
                      <td className="border-b border-r border-[#F3F4F6] px-3 py-2">
                        {monthColumns[index]?.label}
                      </td>
                      <td className="border-b border-r border-[#F3F4F6] px-3 py-2 text-right">
                        {fmtCurrency(month.actualTarget)}
                      </td>
                      <td className="border-b border-r border-[#F3F4F6] px-3 py-2 text-right font-medium">
                        {fmtCurrency(month.actualOrder)}
                      </td>
                      <td className="border-b border-[#F3F4F6] px-3 py-2 text-right">
                        {fmtPct(month.achievementRate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {detail?.type === 'customer' && (
          <>
            <DialogHeader className="gap-1">
              <DialogTitle>出货额明细</DialogTitle>
              <DialogDescription>
                {detail.row.name} / {detail.row.department} / {detail.row.salesperson}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[52vh] overflow-y-auto rounded-md border border-[#E5E7EB]">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="sticky top-0 z-10 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-left font-semibold">季度</th>
                    <th className="sticky top-0 z-10 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-left font-semibold">月份</th>
                    <th className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">出货额</th>
                  </tr>
                </thead>
                <tbody>
                  {quarterGroups.flatMap((quarter) => [
                    ...quarter.months.map((month, index) => (
                      <tr key={month.key} className="hover:bg-[#F9FAFB]">
                        {index === 0 && (
                          <td
                            rowSpan={quarter.months.length + 1}
                            className="border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 align-middle font-semibold"
                          >
                            {quarter.label}
                          </td>
                        )}
                        <td className="border-b border-r border-[#F3F4F6] px-3 py-2">{month.label}</td>
                        <td className="border-b border-[#F3F4F6] px-3 py-2 text-right font-medium">
                          {fmtCurrency(detail.row[month.key], 2)}
                        </td>
                      </tr>
                    )),
                    <tr key={`${quarter.label}-total`} className="bg-[#F8FAFC] font-semibold">
                      <td className="border-b border-r border-[#E5E7EB] px-3 py-2 text-right">
                        季度小计
                      </td>
                      <td className="border-b border-[#E5E7EB] px-3 py-2 text-right">
                        {fmtCurrency(
                          quarter.months.reduce(
                            (sum, month) => sum + detail.row[month.key],
                            0
                          ),
                          2
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

function QuarterCell({ actual, target }: { actual: number; target: number }) {
  const rate = toPercent(actual, target);
  const diff = target - actual;
  return (
    <div className="space-y-1 py-1 text-[11px]">
      <div className="text-text-secondary">目标 {fmtCurrency(target)}</div>
      <div className="font-medium text-text-primary">出货 {fmtCurrency(actual)}</div>
      <div className={diff > 0 ? 'text-[#DC2626]' : 'text-[#059669]'}>
        {diff > 0 ? '差额' : '超额'} {fmtCurrency(Math.abs(diff))}
      </div>
      <div className={rate >= 100 ? 'font-semibold text-[#059669]' : 'font-semibold text-[#DC2626]'}>
        {fmtPct(rate)}
      </div>
    </div>
  );
}

export default function MyShippingStats() {
  const [year, setYear] = useState('2026');
  const [detail, setDetail] = useState<DetailDialog>(null);
  const [selectedCustomerKeys, setSelectedCustomerKeys] = useState<Set<string>>(new Set());
  const [selectedQuarterlyKeys, setSelectedQuarterlyKeys] = useState<Set<string>>(new Set());

  const businessRows = useMemo(() => {
    const { rows } = getSalespersonMonthlyData();
    return normalizeSalespersonRows(rows).filter(
      (row) => row.salesperson === CURRENT_SALESPERSON
    );
  }, []);

  const businessRow = businessRows[0];

  const customerRows = useMemo(
    () =>
      getChannelDealerData().filter((row) =>
        includesSalesperson(row.salesperson, CURRENT_SALESPERSON)
      ),
    []
  );

  const customerTableRows = useMemo(
    () => [...customerRows, getCustomerTotalRow(customerRows)],
    [customerRows]
  );

  const quarterlyRows = useMemo(
    () =>
      getCustomerQuarterlyData().filter(
        (row) => row.salesperson === CURRENT_SALESPERSON
      ),
    []
  );

  const allCustomersSelected =
    customerTableRows.length > 0 &&
    customerTableRows.every((row) => selectedCustomerKeys.has(row.id));
  const someCustomersSelected =
    customerTableRows.some((row) => selectedCustomerKeys.has(row.id)) && !allCustomersSelected;
  const allQuarterlySelected =
    quarterlyRows.length > 0 &&
    quarterlyRows.every((row) => selectedQuarterlyKeys.has(row.customerName));
  const someQuarterlySelected =
    quarterlyRows.some((row) => selectedQuarterlyKeys.has(row.customerName)) && !allQuarterlySelected;

  const toggleCustomer = (key: string) => {
    setSelectedCustomerKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAllCustomers = () => {
    setSelectedCustomerKeys(
      allCustomersSelected ? new Set() : new Set(customerTableRows.map((row) => row.id))
    );
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
    setSelectedQuarterlyKeys(
      allQuarterlySelected ? new Set() : new Set(quarterlyRows.map((row) => row.customerName))
    );
  };

  const annualShipping = customerRows.reduce(
    (sum, row) => sum + getAnnualShipping(row),
    0
  );
  const quarterTarget = quarterlyRows.reduce((sum, row) => sum + row.annualTarget, 0);
  const quarterActual = quarterlyRows.reduce(
    (sum, row) => sum + getQuarterAnnualActual(row),
    0
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
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
          <div className="flex h-9 items-center gap-2 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-[13px] text-[#374151]">
            <UserRound className="h-4 w-4 text-primary" />
            {CURRENT_SALESPERSON}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="个人保底目标额"
          value={businessRow?.annualTarget ?? 0}
          prefix="¥"
          format
        />
        <KpiCard
          label="个人26年开单额"
          value={businessRow?.annualOrder ?? 0}
          prefix="¥"
          format
          delay={80}
        />
        <KpiCard
          label="客户年度出货额"
          value={annualShipping}
          prefix="¥"
          format
          delay={160}
        />
        <KpiCard
          label="客户出货完成率"
          value={toPercent(quarterActual, quarterTarget)}
          suffix="%"
          decimals={1}
          delay={240}
        />
      </div>

      <SectionCard title="我的业务开单统计">
        <div className="overflow-x-auto rounded-md border border-[#E5E7EB]">
          <table className="w-max min-w-full border-collapse text-[12px]">
            <thead>
              <tr>
                {[
                  '部门',
                  '分组',
                  '区域',
                  '业务员',
                  '保底目标额',
                  '26年开单额',
                  '26年保底目标开单完成率',
                  '累计实际目标额（1-4月）',
                  '累计开单额（1-4月）',
                  '累计开单达成率（1-4月）',
                  '操作',
                ].map((title) => (
                  <th
                    key={title}
                    className={cn(
                      tableHeaderClass,
                      title === '操作' && 'w-[124px] min-w-[124px] text-center',
                      title !== '操作' && title.includes('额') && 'text-right'
                    )}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {businessRows.map((row) => (
                <tr key={row.id} className="hover:bg-[#F9FAFB]">
                  <td className={tableCellClass}>{row.department}</td>
                  <td className={tableCellClass}>{row.group}</td>
                  <td className={tableCellClass}>{row.area}</td>
                  <td className={tableCellClass}>{row.salesperson}</td>
                  <td className={cn(tableCellClass, 'text-right')}>{fmtCurrency(row.annualTarget)}</td>
                  <td className={cn(tableCellClass, 'text-right')}>{fmtCurrency(row.annualOrder)}</td>
                  <td className={cn(tableCellClass, 'text-right')}>{fmtPct(row.annualCompletionRate)}</td>
                  <td className={cn(tableCellClass, 'text-right')}>{fmtCurrency(row.cumulativeActualTarget)}</td>
                  <td className={cn(tableCellClass, 'text-right')}>{fmtCurrency(row.cumulativeOrder)}</td>
                  <td className={cn(tableCellClass, 'text-right')}>{fmtPct(row.cumulativeOrderRate)}</td>
                  <td className={cn(tableCellClass, 'text-center')}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDetail({ type: 'business', row })}
                      className="h-7 gap-1.5 px-2 text-[12px]"
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                      开单额明细
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="我的客户出货统计"
        titleAction={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              selectedCustomerKeys.size === 0
                ? toast.info('请先勾选要导出的客户出货数据')
                : toast.success('导出成功', {
                    description: `已导出 ${selectedCustomerKeys.size} 条客户出货数据`,
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
                    checked={allCustomersSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someCustomersSelected;
                    }}
                    onChange={toggleAllCustomers}
                  />
                </th>
                {[
                  '客户名称',
                  '客户类型',
                  '签约额',
                  '部门',
                  '业务员',
                  '26年出货额',
                  '26年出货完成率',
                  '累计出货额（1-4月）',
                  '同比差额（1-4月）',
                  '同比增长率（1-4月）',
                  '操作',
                ].map((title) => (
                  <th
                    key={title}
                    className={cn(
                      tableHeaderClass,
                      title === '操作' && 'w-[124px] min-w-[124px] text-center',
                      ['签约额', '26年出货额', '累计出货额（1-4月）', '同比差额（1-4月）'].includes(title) &&
                        'text-right'
                    )}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customerTableRows.map((row) => {
                const isTotal = row.id === 'my-customer-total';
                return (
                  <tr
                    key={row.id}
                    className={cn(isTotal ? 'bg-[#EEF2FF] font-semibold' : 'hover:bg-[#F9FAFB]')}
                  >
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
                    <td className={cn(tableCellClass, 'text-right')}>{fmtCurrency(row.signingAmount, 2)}</td>
                    <td className={tableCellClass}>{row.department}</td>
                    <td className={tableCellClass}>{row.salesperson}</td>
                    <td className={cn(tableCellClass, 'text-right')}>{fmtCurrency(getAnnualShipping(row), 2)}</td>
                    <td className={cn(tableCellClass, 'text-right')}>{fmtPct(row.completionRate, 2)}</td>
                    <td className={cn(tableCellClass, 'text-right')}>{fmtCurrency(row.totalJanApr, 2)}</td>
                    <td
                      className={cn(
                        tableCellClass,
                        'text-right',
                        row.yoyDiff >= 0 ? 'text-[#059669]' : 'text-[#DC2626]'
                      )}
                    >
                      {row.yoyDiff >= 0 ? '+' : ''}
                      {fmtCurrency(row.yoyDiff, 2)}
                    </td>
                    <td
                      className={cn(
                        tableCellClass,
                        'text-right',
                        row.yoyGrowth >= 0 ? 'text-[#059669]' : 'text-[#DC2626]'
                      )}
                    >
                      {row.yoyGrowth >= 0 ? '+' : ''}
                      {fmtPct(row.yoyGrowth, 2)}
                    </td>
                    <td className={cn(tableCellClass, 'text-center')}>
                      {!isTotal && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDetail({ type: 'customer', row })}
                          className="h-7 gap-1.5 px-2 text-[12px]"
                        >
                          <CalendarDays className="h-3.5 w-3.5" />
                          出货额明细
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="我的客户季度目标"
        titleAction={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              selectedQuarterlyKeys.size === 0
                ? toast.info('请先勾选要导出的客户季度目标数据')
                : toast.success('导出成功', {
                    description: `已导出 ${selectedQuarterlyKeys.size} 条客户季度目标数据`,
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
                {[
                  '客户名称',
                  '客户类型',
                  '部门',
                  'Q1',
                  'Q2',
                  'Q3',
                  'Q4',
                ].map((title) => (
                  <th
                    key={title}
                    className={cn(
                      tableHeaderClass,
                      title.startsWith('Q') && 'min-w-[150px]'
                    )}
                  >
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
                  <td className={tableCellClass}>{row.department}</td>
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

      <DetailAmountDialog detail={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
