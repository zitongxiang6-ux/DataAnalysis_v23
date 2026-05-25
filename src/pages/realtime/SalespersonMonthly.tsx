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
  getSalespersonMonthlyData,
  type SalespersonMonthData,
  type SalespersonMonthlyTableRow,
} from './mockData';
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
import {
  SHIPPING_HIERARCHY_FILTER_OPTIONS,
  matchesShippingHierarchyFilter,
} from './sharedOptions';

const SHOW_SUMMARY_KPIS = false;
const CUMULATIVE_MONTH_COUNT = 4;

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
  deptRowSpan?: number;
  groupRowSpan?: number;
  areaRowSpan?: number;
  annualOrder: number;
  annualCompletionRate: number;
  cumulativeActualTarget: number;
  cumulativeOrder: number;
  cumulativeOrderRate: number;
  isTotal?: boolean;
}

type StatKey =
  | 'annualOrder'
  | 'annualCompletionRate'
  | 'cumulativeActualTarget'
  | 'cumulativeOrder'
  | 'cumulativeOrderRate';

const monthColumns = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
].map((label, index) => ({ label, index }));

const quarterGroups = [
  { label: 'Q1', months: monthColumns.slice(0, 3) },
  { label: 'Q2', months: monthColumns.slice(3, 6) },
  { label: 'Q3', months: monthColumns.slice(6, 9) },
  { label: 'Q4', months: monthColumns.slice(9, 12) },
];

const statColumns: { key: StatKey; label: string; className: string }[] = [
  { key: 'annualOrder', label: '26年开单额', className: 'w-[120px] min-w-[120px]' },
  {
    key: 'annualCompletionRate',
    label: '26年保底目标开单完成率',
    className: 'w-[190px] min-w-[190px]',
  },
  {
    key: 'cumulativeActualTarget',
    label: '累计实际目标额（1-4月）',
    className: 'w-[170px] min-w-[170px]',
  },
  {
    key: 'cumulativeOrder',
    label: '累计开单额（1-4月）',
    className: 'w-[160px] min-w-[160px]',
  },
  {
    key: 'cumulativeOrderRate',
    label: '累计开单达成率（1-4月）',
    className: 'w-[170px] min-w-[170px]',
  },
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

function fmtCurrency(n: number) {
  const sign = n < 0 ? '-' : '';
  return `${sign}￥${Math.abs(n).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtPct(n: number) {
  return `${n.toFixed(2)}%`;
}

function toPercent(value: number, base: number) {
  return base === 0 ? 0 : Number(((value / base) * 100).toFixed(2));
}

function sumMonthData(rows: DetailRow[]): SalespersonMonthData[] {
  const maxMonthCount = Math.max(...rows.map((row) => row.months.length), 0);

  return Array.from({ length: maxMonthCount }, (_, index) => {
    const initialTarget = rows.reduce(
      (sum, row) => sum + (row.months[index]?.initialTarget ?? 0),
      0
    );
    const actualTarget = rows.reduce(
      (sum, row) => sum + (row.months[index]?.actualTarget ?? 0),
      0
    );
    const actualOrder = rows.reduce(
      (sum, row) => sum + (row.months[index]?.actualOrder ?? 0),
      0
    );

    return {
      initialTarget,
      actualTarget,
      actualOrder,
      achievementRate: toPercent(actualOrder, actualTarget),
    };
  });
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
  const matchedArea = Object.entries(groupAreas).find(([, salespersons]) =>
    salespersons.includes(salesperson)
  );

  return matchedArea?.[0] ?? '-';
}

function normalizeRows(rows: SalespersonMonthlyTableRow[]) {
  let currentDept = '';
  let currentGroup = '';

  return rows.reduce<DetailRow[]>((detailRows, row) => {
    if (row.dept) currentDept = row.dept;
    if (row.group !== undefined && row.group !== '') currentGroup = row.group;

    if (row.isGroupSubtotal || row.isDeptSubtotal || row.isGrandTotal) {
      return detailRows;
    }

    const group = row.group ?? currentGroup;
    const dept = currentDept;

    detailRows.push({
      id: row.id,
      dept,
      group,
      area: getSalespersonArea(dept, group, row.salesperson),
      salesperson: row.salesperson,
      annualTarget: row.annualTarget,
      months: row.months,
    });

    return detailRows;
  }, []);
}

function enhanceRow(row: DetailRow): TableRow {
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

  return {
    ...row,
    annualOrder,
    annualCompletionRate: toPercent(annualOrder, row.annualTarget),
    cumulativeActualTarget,
    cumulativeOrder,
    cumulativeOrderRate: toPercent(cumulativeOrder, cumulativeActualTarget),
  };
}

function makeTotalRow(rows: DetailRow[]): TableRow {
  return {
    ...enhanceRow({
      id: 'salesperson-total',
      dept: '合计',
      group: '-',
      area: '-',
      salesperson: '合计',
      annualTarget: rows.reduce((sum, row) => sum + row.annualTarget, 0),
      months: sumMonthData(rows),
    }),
    deptRowSpan: 1,
    groupRowSpan: 1,
    areaRowSpan: 1,
    isTotal: true,
  };
}

function buildTableRows(rows: DetailRow[]) {
  const detailRows = rows.map(enhanceRow);
  const rowSpanRows = detailRows.map((row, index) => {
    const deptFirstIndex = detailRows.findIndex((item) => item.dept === row.dept);
    const groupFirstIndex = detailRows.findIndex(
      (item) => item.dept === row.dept && item.group === row.group
    );
    const areaFirstIndex = detailRows.findIndex(
      (item) =>
        item.dept === row.dept && item.group === row.group && item.area === row.area
    );

    return {
      ...row,
      deptRowSpan:
        index === deptFirstIndex
          ? detailRows.filter((item) => item.dept === row.dept).length
          : undefined,
      groupRowSpan:
        index === groupFirstIndex
          ? detailRows.filter(
              (item) => item.dept === row.dept && item.group === row.group
            ).length
          : undefined,
      areaRowSpan:
        index === areaFirstIndex
          ? detailRows.filter(
              (item) =>
                item.dept === row.dept &&
                item.group === row.group &&
                item.area === row.area
            ).length
          : undefined,
    };
  });

  return [makeTotalRow(rows), ...rowSpanRows];
}

function filterRows(rows: DetailRow[], filterValue: string) {
  return rows.filter((row) => matchesShippingHierarchyFilter(row, filterValue));
}

function renderStat(row: TableRow, key: StatKey) {
  switch (key) {
    case 'annualOrder':
      return fmtCurrency(row.annualOrder);
    case 'annualCompletionRate':
      return fmtPct(row.annualCompletionRate);
    case 'cumulativeActualTarget':
      return fmtCurrency(row.cumulativeActualTarget);
    case 'cumulativeOrder':
      return fmtCurrency(row.cumulativeOrder);
    case 'cumulativeOrderRate':
      return fmtPct(row.cumulativeOrderRate);
    default:
      return '';
  }
}

function bodyBg(row: TableRow) {
  return row.isTotal ? 'bg-[#EEF2FF] font-semibold' : 'bg-white';
}

function fixedBodyBg(row: TableRow) {
  return row.isTotal ? 'bg-[#EEF2FF] font-semibold' : 'bg-white';
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
      <DialogContent className="max-h-[82vh] max-w-[780px] overflow-hidden p-5">
        {row && (
          <>
            <DialogHeader className="gap-1">
              <DialogTitle>开单额明细</DialogTitle>
              <DialogDescription>
                {row.dept} / {row.group} / {row.area} / {row.salesperson}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-4 gap-3 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-[12px]">
              <div>
                <div className="text-text-tertiary">部门</div>
                <div className="mt-1 font-semibold text-text-primary">{row.dept}</div>
              </div>
              <div>
                <div className="text-text-tertiary">分组</div>
                <div className="mt-1 font-semibold text-text-primary">{row.group}</div>
              </div>
              <div>
                <div className="text-text-tertiary">区域</div>
                <div className="mt-1 font-semibold text-text-primary">{row.area}</div>
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
                    <th className="sticky top-0 z-10 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">
                      实际目标额
                    </th>
                    <th className="sticky top-0 z-10 border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">
                      实际开单额
                    </th>
                    <th className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-right font-semibold">
                      实际达成率
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quarterGroups.flatMap((quarter) => {
                    const availableMonths = quarter.months.filter(
                      (month) => row.months[month.index]
                    );
                    const quarterActualTarget = availableMonths.reduce(
                      (sum, month) => sum + row.months[month.index].actualTarget,
                      0
                    );
                    const quarterActualOrder = availableMonths.reduce(
                      (sum, month) => sum + row.months[month.index].actualOrder,
                      0
                    );

                    if (availableMonths.length === 0) return [];

                    return [
                      ...availableMonths.map((month, index) => (
                        <tr key={month.label} className="hover:bg-[#F9FAFB]">
                          {index === 0 && (
                            <td
                              rowSpan={availableMonths.length + 1}
                              className="border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 align-middle font-semibold text-[#111827]"
                            >
                              {quarter.label}
                            </td>
                          )}
                          <td className="border-b border-r border-[#F3F4F6] px-3 py-2">
                            {month.label}
                          </td>
                          <td className="border-b border-r border-[#F3F4F6] px-3 py-2 text-right font-medium">
                            {fmtCurrency(row.months[month.index].actualTarget)}
                          </td>
                          <td className="border-b border-r border-[#F3F4F6] px-3 py-2 text-right font-medium">
                            {fmtCurrency(row.months[month.index].actualOrder)}
                          </td>
                          <td
                            className={cn(
                              'border-b border-[#F3F4F6] px-3 py-2 text-right font-medium',
                              row.months[month.index].achievementRate >= 100
                                ? 'text-[#059669]'
                                : 'text-[#DC2626]'
                            )}
                          >
                            {fmtPct(row.months[month.index].achievementRate)}
                          </td>
                        </tr>
                      )),
                      <tr key={`${quarter.label}-total`} className="bg-[#F8FAFC] font-semibold">
                        <td className="border-b border-r border-[#E5E7EB] px-3 py-2 text-right">
                          季度小计
                        </td>
                        <td className="border-b border-r border-[#E5E7EB] px-3 py-2 text-right">
                          {fmtCurrency(quarterActualTarget)}
                        </td>
                        <td className="border-b border-r border-[#E5E7EB] px-3 py-2 text-right">
                          {fmtCurrency(quarterActualOrder)}
                        </td>
                        <td className="border-b border-[#E5E7EB] px-3 py-2 text-right">
                          {fmtPct(toPercent(quarterActualOrder, quarterActualTarget))}
                        </td>
                      </tr>,
                    ];
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

export default function SalespersonMonthly() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [year, setYear] = useState('2026');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');
  const [detailRow, setDetailRow] = useState<TableRow | null>(null);

  const { rows, kpi } = useMemo(() => getSalespersonMonthlyData(), []);
  const normalizedRows = useMemo(() => normalizeRows(rows), [rows]);
  const filteredRows = useMemo(
    () =>
      filterRows(normalizedRows, departmentFilter).filter(
        (row) => salespersonFilter === 'all' || row.salesperson === salespersonFilter
      ),
    [departmentFilter, normalizedRows, salespersonFilter]
  );
  const tableRows = useMemo(() => buildTableRows(filteredRows), [filteredRows]);
  const salespersonOptions = useMemo(
    () => Array.from(new Set(normalizedRows.map((row) => row.salesperson))),
    [normalizedRows]
  );

  const kpis = [
    { label: '总目标额', value: kpi.totalTarget, prefix: '¥', format: true },
    { label: '总开单额', value: kpi.totalOrder, prefix: '¥', format: true },
    { label: '平均达成率', value: kpi.avgAchievementRate, suffix: '%', decimals: 1 },
    { label: '业务员总数', value: kpi.salespersonCount },
  ];

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
    setDetailRow(null);
  };

  const handleSalespersonChange = (value: string) => {
    setSalespersonFilter(value);
    setSelectedKeys(new Set());
    setDetailRow(null);
  };

  const handleReset = () => {
    setYear('2026');
    setDepartmentFilter('all');
    setSalespersonFilter('all');
    setSelectedKeys(new Set());
    setDetailRow(null);
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
            <SelectContent className="max-h-[320px]">
              {SHIPPING_HIERARCHY_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={salespersonFilter} onValueChange={handleSalespersonChange}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="业务员" />
            </SelectTrigger>
            <SelectContent className="max-h-[320px]">
              <SelectItem value="all">全部业务员</SelectItem>
              {salespersonOptions.map((name) => (
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
          {kpis.map((kpiItem, i) => (
            <KpiCard
              key={kpiItem.label}
              label={kpiItem.label}
              value={kpiItem.value}
              prefix={kpiItem.prefix || ''}
              suffix={kpiItem.suffix || ''}
              decimals={kpiItem.decimals || 0}
              format={kpiItem.format || false}
              delay={i * 100}
            />
          ))}
        </div>
      )}

      <DataUpdateNotice
        dailyFields="年开单额、年保底目标开单完成率、月实际开单额、月实际达成率"
        monthlyFields="累计实际目标额、累计开单额、累计开单达成率"
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
                <th className={cn(leftHeaderClass, 'w-[100px] min-w-[100px]')}>
                  业务员
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
                  {row.deptRowSpan !== undefined && (
                    <td
                      rowSpan={row.deptRowSpan}
                      className={cn(
                        leftBodyClass,
                        fixedBodyBg(row),
                        'w-[96px] min-w-[96px] align-middle font-semibold text-[#111827]'
                      )}
                    >
                      {row.dept}
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
                  {row.areaRowSpan !== undefined && (
                    <td
                      rowSpan={row.areaRowSpan}
                      className={cn(
                        leftBodyClass,
                        fixedBodyBg(row),
                        'w-[90px] min-w-[90px] align-middle text-[#111827]'
                      )}
                    >
                      {row.area}
                    </td>
                  )}
                  <td className={cn(leftBodyClass, fixedBodyBg(row), 'w-[100px] min-w-[100px] text-[#111827]')}>
                    {row.salesperson}
                  </td>
                  <td className={cn(leftBodyClass, fixedBodyBg(row), 'w-[110px] min-w-[110px] text-right')}>
                    {fmtCurrency(row.annualTarget)}
                  </td>
                  {statColumns.map((column) => (
                    <td
                      key={`${row.id}-${column.key}`}
                      className={cn(statBodyClass, column.className, row.isTotal && 'bg-[#EEF2FF] font-semibold')}
                    >
                      {renderStat(row, column.key)}
                    </td>
                  ))}
                  <td className={cn(actionBodyClass, fixedBodyBg(row))}>
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
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <MonthlyDetailDialog row={detailRow} onClose={() => setDetailRow(null)} />
    </div>
  );
}
