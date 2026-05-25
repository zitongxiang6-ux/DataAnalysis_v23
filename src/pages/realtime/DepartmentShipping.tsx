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
import { deptShippingKpis } from './mockData';
import { CalendarDays, Download } from 'lucide-react';
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

type MonthRecord = Record<MonthKey, number>;

type StatKey =
  | 'annualOrder'
  | 'annualCompletionRate'
  | 'cumulativeTarget'
  | 'cumulativeOrder'
  | 'cumulativeOrderRate'
  | 'yoyDiff'
  | 'yoyGrowthRate';

interface SourceRow {
  id: string;
  department: string;
  group: string;
  area: string;
  target: number;
  monthlyOrders: MonthRecord;
  previousCumulativeOrder?: number;
  isTotal?: boolean;
}

interface TableRow extends SourceRow {
  departmentRowSpan?: number;
  groupRowSpan?: number;
  annualOrder: number;
  annualCompletionRate: number;
  cumulativeTarget: number;
  cumulativeOrder: number;
  cumulativeOrderRate: number;
  yoyDiff: number;
  yoyGrowthRate: number;
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

const quarterGroups = [
  { label: 'Q1', months: monthColumns.slice(0, 3) },
  { label: 'Q2', months: monthColumns.slice(3, 6) },
  { label: 'Q3', months: monthColumns.slice(6, 9) },
  { label: 'Q4', months: monthColumns.slice(9, 12) },
];

const statColumns: { key: StatKey; label: string; className: string }[] = [
  { key: 'annualOrder', label: '26年开单额', className: 'w-[120px] min-w-[120px]' },
  { key: 'annualCompletionRate', label: '26年开单完成率', className: 'w-[160px] min-w-[160px]' },
  { key: 'cumulativeTarget', label: '累计目标额（1-4月）', className: 'w-[160px] min-w-[160px]' },
  { key: 'cumulativeOrder', label: '累计开单额（1-4月）', className: 'w-[160px] min-w-[160px]' },
  { key: 'cumulativeOrderRate', label: '累计开单达成率（1-4月）', className: 'w-[170px] min-w-[170px]' },
  { key: 'yoyDiff', label: '同比差额（1-4月）', className: 'w-[150px] min-w-[150px]' },
  { key: 'yoyGrowthRate', label: '同比增长率（1-4月）', className: 'w-[150px] min-w-[150px]' },
];

const sourceRows: SourceRow[] = [
  {
    id: 'global-international-maintain',
    department: '全球渠道部',
    group: '国际渠道组',
    area: '维护组',
    target: 1180000,
    monthlyOrders: makeMonths([76000, 82000, 88000, 91000, 96000, 102000, 108000, 111000, 117000, 123000, 128000, 132000]),
  },
  {
    id: 'global-international-development',
    department: '全球渠道部',
    group: '国际渠道组',
    area: '发展组',
    target: 950000,
    monthlyOrders: makeMonths([52000, 59000, 64000, 68000, 72000, 78000, 82000, 87000, 91000, 96000, 101000, 106000]),
  },
  {
    id: 'global-international-expand',
    department: '全球渠道部',
    group: '国际渠道组',
    area: '开拓组',
    target: 1100000,
    monthlyOrders: makeMonths([68000, 72000, 79000, 85000, 90000, 96000, 103000, 108000, 114000, 120000, 126000, 132000]),
  },
  {
    id: 'global-domestic-maintain',
    department: '全球渠道部',
    group: '国内渠道组',
    area: '维护组',
    target: 1350000,
    monthlyOrders: makeMonths([98000, 105000, 112000, 118000, 124000, 130000, 136000, 142000, 148000, 154000, 160000, 168000]),
  },
  {
    id: 'global-domestic-expand',
    department: '全球渠道部',
    group: '国内渠道组',
    area: '开拓组',
    target: 1250000,
    monthlyOrders: makeMonths([86000, 93000, 101000, 108000, 116000, 124000, 132000, 139000, 146000, 153000, 160000, 166000]),
  },
  {
    id: 'global-domestic-real-estate',
    department: '全球渠道部',
    group: '国内渠道组',
    area: '地产组',
    target: 980000,
    monthlyOrders: makeMonths([54000, 62000, 69000, 76000, 82000, 88000, 94000, 99000, 104000, 110000, 116000, 122000]),
  },
  {
    id: 'global-odm-international',
    department: '全球渠道部',
    group: 'ODM组',
    area: '国际ODM',
    target: 860000,
    monthlyOrders: makeMonths([45000, 52000, 59000, 63000, 70000, 76000, 83000, 89000, 95000, 101000, 107000, 113000]),
  },
  {
    id: 'global-odm-domestic',
    department: '全球渠道部',
    group: 'ODM组',
    area: '国内ODM',
    target: 720000,
    monthlyOrders: makeMonths([39000, 45000, 51000, 56000, 62000, 68000, 73000, 78000, 83000, 88000, 93000, 98000]),
  },
  {
    id: 'domestic-key-account',
    department: '国内大客户部',
    group: '-',
    area: '-',
    target: 3200000,
    monthlyOrders: makeMonths([280000, 310000, 295000, 325000, 340000, 360000, 375000, 390000, 405000, 420000, 435000, 455000]),
  },
  {
    id: 'international-hotel',
    department: '国际酒店部',
    group: '-',
    area: '-',
    target: 2800000,
    monthlyOrders: makeMonths([220000, 245000, 268000, 240000, 255000, 276000, 298000, 315000, 330000, 346000, 360000, 382000]),
  },
  {
    id: 'energy-storage',
    department: '储能事业部',
    group: '-',
    area: '-',
    target: 2500000,
    monthlyOrders: makeMonths([195000, 210000, 225000, 218000, 230000, 246000, 260000, 274000, 288000, 302000, 318000, 332000]),
  },
  {
    id: 'hedong-electronics',
    department: '河东电子',
    group: '-',
    area: '-',
    target: 1600000,
    monthlyOrders: makeMonths([118000, 126000, 135000, 142000, 150000, 160000, 172000, 181000, 190000, 202000, 214000, 226000]),
  },
];

const hierarchyFilterOptions = [
  { value: 'all', label: '全部' },
  ...Array.from(new Set(sourceRows.map((row) => row.department))).map((department) => ({
    value: ['department', department].join('|'),
    label: `部门：${department}`,
  })),
  ...Array.from(new Set(sourceRows.filter((row) => row.group !== '-').map((row) => `${row.department}|${row.group}`))).map((value) => {
    const [department, group] = value.split('|');
    return {
      value: ['group', department, group].join('|'),
      label: `分组：${department} / ${group}`,
    };
  }),
  ...sourceRows.filter((row) => row.area !== '-').map((row) => ({
    value: ['area', row.department, row.group, row.area].join('|'),
    label: `区域：${row.department} / ${row.group} / ${row.area}`,
  })),
];

const leftHeaderClass =
  'border-b border-r border-[#D8DEE9] bg-[#F8FAFC] px-2 py-3 text-left font-semibold text-[#111827]';
const leftBodyClass =
  'border-b border-r border-[#E5E7EB] px-2 py-3 text-left';
const statHeaderClass =
  'border-b border-l border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-right font-semibold leading-tight text-[#374151] whitespace-normal';
const statBodyClass =
  'border-b border-l border-[#F3F4F6] bg-white px-3 py-3 text-right';
const actionHeaderClass =
  'sticky right-0 z-40 w-[124px] min-w-[124px] border-b border-l border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-center font-semibold text-[#374151] shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';
const actionBodyClass =
  'sticky right-0 z-30 w-[124px] min-w-[124px] border-b border-l border-[#E5E7EB] px-3 py-2 text-center shadow-[-12px_0_18px_-18px_rgba(15,23,42,0.55)]';

function makeMonths(values: number[]): MonthRecord {
  return monthColumns.reduce((months, month, index) => {
    months[month.key] = values[index] ?? 0;
    return months;
  }, {} as MonthRecord);
}

function sumMonths(rows: Pick<TableRow, 'monthlyOrders'>[]): MonthRecord {
  return monthColumns.reduce((months, month) => {
    months[month.key] = rows.reduce((sum, row) => sum + row.monthlyOrders[month.key], 0);
    return months;
  }, {} as MonthRecord);
}

function toTableRow(row: SourceRow): TableRow {
  const annualOrder = monthColumns.reduce((sum, month) => sum + row.monthlyOrders[month.key], 0);
  const cumulativeOrder = sumFirstFourMonths(row.monthlyOrders);
  const cumulativeTarget = Math.round((row.target / 12) * 4);
  const previousCumulativeOrder = row.previousCumulativeOrder ?? Math.round(cumulativeOrder * 0.9);
  const yoyDiff = cumulativeOrder - previousCumulativeOrder;

  return {
    ...row,
    annualOrder,
    annualCompletionRate: toPercent(annualOrder, row.target),
    cumulativeTarget,
    cumulativeOrder,
    cumulativeOrderRate: toPercent(cumulativeOrder, cumulativeTarget),
    yoyDiff,
    yoyGrowthRate: toPercent(yoyDiff, previousCumulativeOrder),
  };
}

function makeTotalRow(rows: TableRow[]): TableRow {
  const target = rows.reduce((sum, row) => sum + row.target, 0);
  const monthlyOrders = sumMonths(rows);
  const previousCumulativeOrder = rows.reduce((sum, row) => sum + (row.cumulativeOrder - row.yoyDiff), 0);

  return {
    ...toTableRow({
      id: 'total',
      department: '合计',
      group: '-',
      area: '-',
      target,
      monthlyOrders,
      previousCumulativeOrder,
      isTotal: true,
    }),
    departmentRowSpan: 1,
    groupRowSpan: 1,
  };
}

function buildTableRows(rows: SourceRow[]) {
  const detailRows = rows.map(toTableRow);
  const rowSpanRows = detailRows.map((row, index) => {
    const departmentFirstIndex = detailRows.findIndex((item) => item.department === row.department);
    const groupFirstIndex = detailRows.findIndex(
      (item) => item.department === row.department && item.group === row.group
    );

    return {
      ...row,
      departmentRowSpan:
        index === departmentFirstIndex
          ? detailRows.filter((item) => item.department === row.department).length
          : undefined,
      groupRowSpan:
        index === groupFirstIndex
          ? detailRows.filter((item) => item.department === row.department && item.group === row.group).length
          : undefined,
    };
  });

  return [makeTotalRow(detailRows), ...rowSpanRows];
}

function sumFirstFourMonths(months: MonthRecord) {
  return months.jan + months.feb + months.mar + months.apr;
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

function bodyBg(row: TableRow) {
  return row.isTotal ? 'bg-[#EEF2FF] font-semibold' : 'bg-white';
}

function fixedBodyBg(row: TableRow, tone: 'left' | 'stat' = 'left') {
  if (row.isTotal) return tone === 'stat' ? 'bg-[#EEF2FF] font-semibold' : 'bg-[#EEF2FF] font-semibold';
  return tone === 'stat' ? 'bg-white' : 'bg-white';
}

function renderStat(row: TableRow, key: StatKey) {
  switch (key) {
    case 'annualOrder':
      return fmtCurrency(row.annualOrder);
    case 'annualCompletionRate':
      return fmtPct(row.annualCompletionRate);
    case 'cumulativeTarget':
      return fmtCurrency(row.cumulativeTarget);
    case 'cumulativeOrder':
      return fmtCurrency(row.cumulativeOrder);
    case 'cumulativeOrderRate':
      return fmtPct(row.cumulativeOrderRate);
    case 'yoyDiff':
      return `${row.yoyDiff >= 0 ? '+' : ''}${fmtCurrency(row.yoyDiff)}`;
    case 'yoyGrowthRate':
      return `${row.yoyGrowthRate >= 0 ? '+' : ''}${fmtPct(row.yoyGrowthRate)}`;
    default:
      return '';
  }
}

function statTone(row: TableRow, key: StatKey) {
  if (key !== 'yoyDiff' && key !== 'yoyGrowthRate') return '';
  return row[key] >= 0 ? 'text-[#059669]' : 'text-[#DC2626]';
}

function getRowContext(row: TableRow) {
  return {
    department: row.department || '-',
    group: row.group || '-',
    area: row.area || '-',
  };
}

function filterSourceRows(rows: SourceRow[], filterValue: string) {
  if (filterValue === 'all') return rows;

  const [level, department, group, area] = filterValue.split('|');

  if (level === 'department') {
    return rows.filter((row) => row.department === department);
  }

  if (level === 'group') {
    return rows.filter((row) => row.department === department && row.group === group);
  }

  if (level === 'area') {
    return rows.filter(
      (row) => row.department === department && row.group === group && row.area === area
    );
  }

  return rows;
}

function MonthlyDetailDialog({
  row,
  onClose,
}: {
  row: TableRow | null;
  onClose: () => void;
}) {
  const context = row ? getRowContext(row) : null;

  return (
    <Dialog open={Boolean(row)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[86vh] max-w-[780px] overflow-hidden p-5">
        {row && context && (
          <>
            <DialogHeader className="gap-1">
              <DialogTitle>开单额明细</DialogTitle>
              <DialogDescription>
                {context.department} / {context.group} / {context.area}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-3 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-[12px]">
              <div>
                <div className="text-text-tertiary">部门</div>
                <div className="mt-1 font-semibold text-text-primary">{context.department}</div>
              </div>
              <div>
                <div className="text-text-tertiary">分组</div>
                <div className="mt-1 font-semibold text-text-primary">{context.group}</div>
              </div>
              <div>
                <div className="text-text-tertiary">区域</div>
                <div className="mt-1 font-semibold text-text-primary">{context.area}</div>
              </div>
            </div>

            <div className="max-h-[58vh] overflow-y-auto rounded-md border border-[#E5E7EB]">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#374151]">
                    <th className="sticky top-0 z-10 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-left font-semibold">季度</th>
                    <th className="sticky top-0 z-10 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-left font-semibold">月份</th>
                    <th className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">开单额</th>
                  </tr>
                </thead>
                <tbody>
                  {quarterGroups.flatMap((quarter) => [
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
                        <td className="border-b border-r border-[#F3F4F6] px-3 py-2">{month.label}</td>
                        <td className="border-b border-[#F3F4F6] px-3 py-2 text-right font-medium">
                          {fmtCurrency(row.monthlyOrders[month.key])}
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
                            (sum, month) => sum + row.monthlyOrders[month.key],
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

export default function DepartmentShipping() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [year, setYear] = useState('2026');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [monthlyDetailRow, setMonthlyDetailRow] = useState<TableRow | null>(null);

  const kpis = [
    { label: '年完成额', value: deptShippingKpis.totalShipping, prefix: '¥', format: true },
    { label: '年完成率', value: deptShippingKpis.completionRate, suffix: '%', decimals: 1 },
    { label: '1~4月同比差额', value: deptShippingKpis.openOrders, prefix: '¥', format: true },
    { label: '1~4月同比增长率', value: deptShippingKpis.yoyComparison, suffix: '%', decimals: 1 },
  ];

  const filteredSourceRows = useMemo(
    () => filterSourceRows(sourceRows, departmentFilter),
    [departmentFilter]
  );

  const tableRows = useMemo(() => buildTableRows(filteredSourceRows), [filteredSourceRows]);

  const allSelected = useMemo(
    () => tableRows.length > 0 && selectedKeys.size === tableRows.length,
    [selectedKeys, tableRows]
  );

  const someSelected = useMemo(
    () => selectedKeys.size > 0 && selectedKeys.size < tableRows.length,
    [selectedKeys, tableRows]
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(tableRows.map((row) => row.id)));
    }
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

  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    setSelectedKeys(new Set());
    setMonthlyDetailRow(null);
  };

  const handleReset = () => {
    setYear('2026');
    setDepartmentFilter('all');
    setSelectedKeys(new Set());
    setMonthlyDetailRow(null);
  };

  const handleQuery = () => {
    toast.success('查询完成', { description: '已按当前筛选条件刷新列表' });
  };

  return (
    <div className="animate-fade-in">
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

          <Select value={departmentFilter} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="h-9 w-[280px]">
              <SelectValue placeholder="部门" />
            </SelectTrigger>
            <SelectContent>
              {hierarchyFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
          <Button variant="outline" size="sm" onClick={handleReset}>
            重置
          </Button>
          <Button size="sm" onClick={handleQuery}>
            查询
          </Button>
        </div>
      </div>

      {SHOW_SUMMARY_KPIS && (
        <div className="mb-6 grid grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              prefix={kpi.prefix || ''}
              suffix={kpi.suffix || ''}
              decimals={kpi.decimals || 0}
              format={kpi.format || false}
              delay={index * 100}
            />
          ))}
        </div>
      )}

      <DataUpdateNotice
        dailyFields="年开单额、年开单完成率、月开单额"
        monthlyFields="累计开单额、累计开单达成率、同比差额、同比增长率"
      />

      <SectionCard>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-caption text-text-secondary">
            已选 <span className="font-semibold text-primary">{selectedKeys.size}</span> 条
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
                <th className={cn(leftHeaderClass, 'w-[40px] min-w-[40px] text-center')}>
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className={cn(leftHeaderClass, 'w-[96px] min-w-[96px]')}>
                  部门
                </th>
                <th className={cn(leftHeaderClass, 'w-[100px] min-w-[100px]')}>
                  分组
                </th>
                <th className={cn(leftHeaderClass, 'w-[90px] min-w-[90px]')}>
                  区域
                </th>
                <th className={cn(leftHeaderClass, 'w-[110px] min-w-[110px] text-right')}>
                  保底目标额
                </th>
                {statColumns.map((column) => (
                  <th key={column.key} className={cn(statHeaderClass, column.className)}>
                    {column.label}
                  </th>
                ))}
                <th className={actionHeaderClass}>操作</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.id} className={cn(bodyBg(row), !row.isTotal && 'hover:bg-[#F9FAFB]')}>
                  <td className={cn(leftBodyClass, fixedBodyBg(row), 'w-[40px] min-w-[40px] text-center')}>
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={selectedKeys.has(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                    />
                  </td>
                  {row.departmentRowSpan !== undefined && (
                    <td
                      rowSpan={row.departmentRowSpan}
                      className={cn(
                        leftBodyClass,
                        fixedBodyBg(row),
                        'w-[96px] min-w-[96px] align-middle font-semibold text-[#111827]'
                      )}
                    >
                      {row.department}
                    </td>
                  )}
                  {row.groupRowSpan !== undefined && (
                    <td
                      rowSpan={row.groupRowSpan}
                      className={cn(
                        leftBodyClass,
                        fixedBodyBg(row),
                        'w-[100px] min-w-[100px] align-middle font-semibold text-[#111827]'
                      )}
                    >
                      {row.group}
                    </td>
                  )}
                  <td className={cn(leftBodyClass, fixedBodyBg(row), 'w-[90px] min-w-[90px] text-[#111827]')}>
                    {row.area}
                  </td>
                  <td className={cn(leftBodyClass, fixedBodyBg(row), 'w-[110px] min-w-[110px] text-right')}>
                    {fmtCurrency(row.target)}
                  </td>
                  {statColumns.map((column) => (
                    <td
                      key={`${row.id}-${column.key}`}
                      className={cn(
                        statBodyClass,
                        column.className,
                        fixedBodyBg(row, 'stat'),
                        statTone(row, column.key)
                      )}
                    >
                      {renderStat(row, column.key)}
                    </td>
                  ))}
                  <td className={cn(actionBodyClass, fixedBodyBg(row))}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMonthlyDetailRow(row)}
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

      <MonthlyDetailDialog
        row={monthlyDetailRow}
        onClose={() => setMonthlyDetailRow(null)}
      />
    </div>
  );
}
