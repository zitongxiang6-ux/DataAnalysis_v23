import { useState, useMemo } from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';


import {
  deptShippingKpis,
} from './mockData';

import { Download, RefreshCw } from 'lucide-react';
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

interface TableRow {
  id: string;
  dept?: string;
  deptRowSpan?: number;
  deptTarget?: number;
  targetRowSpan?: number;
  group: string;
  groupTarget: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun?: number;
  jul?: number;
  aug?: number;
  sep?: number;
  oct?: number;
  nov?: number;
  dec?: number;
  completion: number;
  rate: number;
  yoyDiff: number;
  yoyRate: number;
  isSubtotal?: boolean;
  isTotal?: boolean;
}

const tableRows: TableRow[] = [
  // 全球渠道部
  {
    id: 'r1',
    dept: '全球渠道部',
    deptRowSpan: 4,
    deptTarget: 4500000,
    targetRowSpan: 4,
    group: '分组 A',
    groupTarget: 1500000,
    jan: 120000,
    feb: 135000,
    mar: 158000,
    apr: 142000,
    may: 165000,
    completion: 720000,
    rate: 48.0,
    yoyDiff: 85000,
    yoyRate: 13.4,
  },
  {
    id: 'r2',
    group: '分组 B',
    groupTarget: 1800000,
    jan: 145000,
    feb: 162000,
    mar: 178000,
    apr: 155000,
    may: 188000,
    completion: 828000,
    rate: 46.0,
    yoyDiff: 92000,
    yoyRate: 12.5,
  },
  {
    id: 'r3',
    group: '分组 C',
    groupTarget: 1200000,
    jan: 98000,
    feb: 112000,
    mar: 125000,
    apr: 108000,
    may: 132000,
    completion: 575000,
    rate: 47.9,
    yoyDiff: 48000,
    yoyRate: 9.1,
  },
  {
    id: 'r4',
    group: '全球渠道部-小计',
    groupTarget: 4500000,
    jan: 363000,
    feb: 409000,
    mar: 461000,
    apr: 405000,
    may: 485000,
    completion: 2123000,
    rate: 47.2,
    yoyDiff: 225000,
    yoyRate: 11.9,
    isSubtotal: true,
  },
  // 国内大客户部
  {
    id: 'r5',
    dept: '国内大客户部',
    deptRowSpan: 1,
    deptTarget: 3200000,
    targetRowSpan: 1,
    group: '-',
    groupTarget: 3200000,
    jan: 280000,
    feb: 310000,
    mar: 295000,
    apr: 325000,
    may: 340000,
    completion: 1550000,
    rate: 48.4,
    yoyDiff: 185000,
    yoyRate: 13.6,
  },
  // 国际酒店部
  {
    id: 'r6',
    dept: '国际酒店部',
    deptRowSpan: 1,
    deptTarget: 2800000,
    targetRowSpan: 1,
    group: '-',
    groupTarget: 2800000,
    jan: 220000,
    feb: 245000,
    mar: 268000,
    apr: 240000,
    may: 255000,
    completion: 1228000,
    rate: 43.9,
    yoyDiff: 98000,
    yoyRate: 8.7,
  },
  // 储能事业部
  {
    id: 'r7',
    dept: '储能事业部',
    deptRowSpan: 1,
    deptTarget: 2500000,
    targetRowSpan: 1,
    group: '-',
    groupTarget: 2500000,
    jan: 195000,
    feb: 210000,
    mar: 225000,
    apr: 218000,
    may: 230000,
    completion: 1078000,
    rate: 43.1,
    yoyDiff: 72000,
    yoyRate: 7.2,
  },
  // 合计
  {
    id: 'r8',
    dept: '合计',
    deptRowSpan: 3,
    deptTarget: 13000000,
    targetRowSpan: 3,
    group: '月度合计',
    groupTarget: 0,
    jan: 1058000,
    feb: 1174000,
    mar: 1249000,
    apr: 1188000,
    may: 1310000,
    completion: 5979000,
    rate: 46.0,
    yoyDiff: 580000,
    yoyRate: 10.8,
    isTotal: true,
  },
  {
    id: 'r9',
    group: '季度合计',
    groupTarget: 0,
    jan: 0,
    feb: 0,
    mar: 3481000,
    apr: 0,
    may: 2498000,
    completion: 5979000,
    rate: 46.0,
    yoyDiff: 580000,
    yoyRate: 10.8,
    isTotal: true,
  },
  {
    id: 'r10',
    group: '年度合计',
    groupTarget: 0,
    jan: 0,
    feb: 0,
    mar: 0,
    apr: 0,
    may: 0,
    completion: 5979000,
    rate: 46.0,
    yoyDiff: 580000,
    yoyRate: 10.8,
    isTotal: true,
  },
];

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

const quarterGroups: { label: string; months: { key: MonthKey; label: string }[] }[] = [
  {
    label: 'Q1',
    months: [
      { key: 'jan', label: '1月' },
      { key: 'feb', label: '2月' },
      { key: 'mar', label: '3月' },
    ],
  },
  {
    label: 'Q2',
    months: [
      { key: 'apr', label: '4月' },
      { key: 'may', label: '5月' },
      { key: 'jun', label: '6月' },
    ],
  },
  {
    label: 'Q3',
    months: [
      { key: 'jul', label: '7月' },
      { key: 'aug', label: '8月' },
      { key: 'sep', label: '9月' },
    ],
  },
  {
    label: 'Q4',
    months: [
      { key: 'oct', label: '10月' },
      { key: 'nov', label: '11月' },
      { key: 'dec', label: '12月' },
    ],
  },
];

const fixedStatClass = {
  completion: 'right-[410px] w-[130px] min-w-[130px]',
  rate: 'right-[310px] w-[100px] min-w-[100px]',
  yoyDiff: 'right-[160px] w-[150px] min-w-[150px]',
  yoyRate: 'right-0 w-[160px] min-w-[160px]',
} as const;

const fixedHeaderClass =
  'sticky z-30 px-4 py-3 text-right border-b border-l border-[#D8E5FF] bg-[#EEF4FF] text-[#1D4ED8]';

const fixedBodyClass =
  'sticky z-20 px-4 py-3 text-right border-b border-l border-[#D8E5FF] shadow-[-12px_0_18px_-18px_rgba(30,64,175,0.55)]';

function fmtCurrency(n: number) {
  return `¥${n.toLocaleString('zh-CN')}`;
}

function fmtPct(n: number) {
  return `${n.toFixed(1)}%`;
}

function fmtMonthValue(row: TableRow, key: MonthKey) {
  const value = row[key];
  return value && value > 0 ? fmtCurrency(value) : '-';
}

function stickyCellBg(row: TableRow) {
  if (row.isTotal) return 'bg-[#EAF1FF]';
  if (row.isSubtotal) return 'bg-[#F3F7FF]';
  return 'bg-[#F8FAFF]';
}

export default function DepartmentShipping() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [year, setYear] = useState('2026');

  const kpis = [
    { label: '年完成额', value: deptShippingKpis.totalShipping, prefix: '¥', format: true },
    { label: '年完成率', value: deptShippingKpis.completionRate, suffix: '%', decimals: 1 },
    { label: '1~4月同比差额', value: deptShippingKpis.openOrders, prefix: '¥', format: true },
    { label: '1~4月同比增长率', value: deptShippingKpis.yoyComparison, suffix: '%', decimals: 1 },
  ];

  const allSelected = useMemo(
    () => tableRows.length > 0 && selectedKeys.size === tableRows.length,
    [selectedKeys]
  );

  const someSelected = useMemo(
    () => selectedKeys.size > 0 && selectedKeys.size < tableRows.length,
    [selectedKeys]
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(tableRows.map((r) => r.id)));
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

  return (
    <div className="animate-fade-in">
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="年份" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026年</SelectItem>
            <SelectItem value="2025">2025年</SelectItem>
            <SelectItem value="2024">2024年</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4">
          <span className="text-caption text-text-tertiary">
            每天19:00自动更新数据
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('数据已更新', { description: '数据已更新至最新状态' })}
            className="gap-1.5 text-body-small"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            手动更新数据
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, i) => (
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

      {/* Department Table */}
      <SectionCard>
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-caption text-text-secondary">
            已选 <span className="font-semibold text-primary">{selectedKeys.size}</span> 条
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('导出功能开发中')}
          >
            <Download className="w-4 h-4 mr-1" />
            导出
          </Button>
        </div>

        {/* Custom HTML Table */}
        <div className="overflow-x-auto">
          <table className="w-max min-w-full border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] text-[#374151] text-xs font-semibold">
                <th rowSpan={2} className="px-4 py-3 text-left border-b border-[#F3F4F6] w-10 min-w-10">
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
                <th rowSpan={2} className="px-4 py-3 text-left border-b border-[#F3F4F6] min-w-[130px]">部门</th>
                <th rowSpan={2} className="px-4 py-3 text-right border-b border-[#F3F4F6] min-w-[120px]">部门目标额</th>
                <th rowSpan={2} className="px-4 py-3 text-left border-b border-[#F3F4F6] min-w-[120px]">分组</th>
                <th rowSpan={2} className="px-4 py-3 text-right border-b border-[#F3F4F6] min-w-[130px]">分组目标额</th>
                {quarterGroups.map((quarter) => (
                  <th
                    key={quarter.label}
                    colSpan={quarter.months.length}
                    className="px-4 py-3 text-center border-b border-[#F3F4F6] bg-[#F8FAFC] text-[#475569] min-w-[300px]"
                  >
                    {quarter.label}
                  </th>
                ))}
                <th rowSpan={2} className={cn(fixedHeaderClass, fixedStatClass.completion)}>
                  年完成额
                </th>
                <th rowSpan={2} className={cn(fixedHeaderClass, fixedStatClass.rate)}>
                  完成率
                </th>
                <th rowSpan={2} className={cn(fixedHeaderClass, fixedStatClass.yoyDiff)}>
                  1~4月同比差额
                </th>
                <th rowSpan={2} className={cn(fixedHeaderClass, fixedStatClass.yoyRate)}>
                  1~4月同比增长率
                </th>
              </tr>
              <tr className="bg-[#F9FAFB] text-[#374151] text-xs font-semibold">
                {quarterGroups.flatMap((quarter) =>
                  quarter.months.map((month) => (
                    <th
                      key={month.key}
                      className="px-4 py-3 text-right border-b border-[#F3F4F6] min-w-[100px]"
                    >
                      {month.label}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {tableRows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-[#F3F4F6]',
                    row.isTotal && 'bg-[#F3F4F6] font-bold',
                    row.isSubtotal && 'bg-gray-50 font-semibold',
                    !row.isTotal && !row.isSubtotal && 'hover:bg-[#F9FAFB]'
                  )}
                >
                  <td className="px-4 py-3 border-b border-[#F3F4F6]">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={selectedKeys.has(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                    />
                  </td>
                  {row.dept && (
                    <td
                      rowSpan={row.deptRowSpan}
                      className="px-4 py-3 border-b border-[#F3F4F6] font-medium text-left align-middle"
                    >
                      {row.dept}
                    </td>
                  )}
                  {row.deptTarget !== undefined && (
                    <td
                      rowSpan={row.targetRowSpan}
                      className="px-4 py-3 border-b border-[#F3F4F6] text-right align-middle"
                    >
                      {fmtCurrency(row.deptTarget)}
                    </td>
                  )}
                  <td
                    className={cn(
                      'px-4 py-3 border-b border-[#F3F4F6] text-left',
                      (row.isSubtotal || row.isTotal) && 'font-semibold'
                    )}
                  >
                    {row.group}
                  </td>
                  <td
                    className={cn(
                      'px-4 py-3 border-b border-[#F3F4F6] text-right',
                      (row.isSubtotal || row.isTotal) && 'font-semibold'
                    )}
                  >
                    {row.groupTarget > 0 ? fmtCurrency(row.groupTarget) : '-'}
                  </td>
                  {quarterGroups.flatMap((quarter) =>
                    quarter.months.map((month) => (
                      <td
                        key={`${row.id}-${month.key}`}
                        className={cn(
                          'px-4 py-3 border-b border-[#F3F4F6] text-right min-w-[100px]',
                          (row.isSubtotal || row.isTotal) && 'font-semibold',
                          !row[month.key] && 'text-text-tertiary'
                        )}
                      >
                        {fmtMonthValue(row, month.key)}
                      </td>
                    ))
                  )}
                  <td
                    className={cn(
                      fixedBodyClass,
                      fixedStatClass.completion,
                      stickyCellBg(row),
                      (row.isSubtotal || row.isTotal) && 'font-semibold'
                    )}
                  >
                    {fmtCurrency(row.completion)}
                  </td>
                  <td
                    className={cn(
                      fixedBodyClass,
                      fixedStatClass.rate,
                      stickyCellBg(row),
                      (row.isSubtotal || row.isTotal) && 'font-semibold'
                    )}
                  >
                    {fmtPct(row.rate)}
                  </td>
                  <td
                    className={cn(
                      fixedBodyClass,
                      fixedStatClass.yoyDiff,
                      stickyCellBg(row),
                      row.yoyDiff >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]',
                      (row.isSubtotal || row.isTotal) && 'font-semibold'
                    )}
                  >
                    {row.yoyDiff >= 0 ? '+' : ''}
                    {fmtCurrency(row.yoyDiff)}
                  </td>
                  <td
                    className={cn(
                      fixedBodyClass,
                      fixedStatClass.yoyRate,
                      stickyCellBg(row),
                      row.yoyRate >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]',
                      (row.isSubtotal || row.isTotal) && 'font-semibold'
                    )}
                  >
                    {row.yoyRate >= 0 ? '+' : ''}
                    {fmtPct(row.yoyRate)}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </SectionCard>
    </div>
  );
}
