import { useState, useMemo } from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { getSalespersonMonthlyData } from './mockData';
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

function fmtCurrency(n: number) {
  return `¥${n.toLocaleString('zh-CN')}`;
}

function fmtPct(n: number) {
  return `${n.toFixed(1)}%`;
}

export default function SalespersonMonthly() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [year, setYear] = useState('2026');

  const { rows, kpi } = useMemo(() => getSalespersonMonthlyData(), []);

  const kpis = [
    { label: '总目标额', value: kpi.totalTarget, prefix: '¥', format: true },
    { label: '总开单额', value: kpi.totalOrder, prefix: '¥', format: true },
    { label: '平均达成率', value: kpi.avgAchievementRate, suffix: '%', decimals: 1 },
    { label: '业务员总数', value: kpi.salespersonCount },
  ];

  const allSelected = useMemo(
    () => rows.length > 0 && selectedKeys.size === rows.length,
    [selectedKeys, rows]
  );

  const someSelected = useMemo(
    () => selectedKeys.size > 0 && selectedKeys.size < rows.length,
    [selectedKeys, rows]
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(rows.map((r) => r.id)));
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
            onClick={() =>
              toast.success('数据已更新', { description: '数据已更新至最新状态' })
            }
            className="gap-1.5 text-body-small"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            手动更新数据
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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

      {/* Table */}
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] text-[#374151] text-xs font-semibold">
                <th
                  rowSpan={2}
                  className="px-4 py-3 text-left border-b border-[#F3F4F6] w-10"
                >
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
                <th
                  rowSpan={2}
                  className="px-4 py-3 text-left border-b border-[#F3F4F6] whitespace-nowrap"
                >
                  部门
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 text-left border-b border-[#F3F4F6]"
                >
                  分组
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 text-left border-b border-[#F3F4F6]"
                >
                  业务员
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 text-right border-b border-[#F3F4F6]"
                >
                  保底目标额
                </th>
                {['1月', '2月', '3月', '4月', '5月'].map((m) => (
                  <th
                    key={m}
                    colSpan={4}
                    className="px-4 py-3 text-center border-b border-[#F3F4F6]"
                  >
                    {m}
                  </th>
                ))}
              </tr>
              <tr className="bg-[#F9FAFB] text-[#374151] text-xs font-semibold">
                {Array.from({ length: 5 }).map((_, i) => [
                  <th
                    key={`${i}-init`}
                    className="px-4 py-3 text-right border-b border-[#F3F4F6]"
                  >
                    期初目标
                  </th>,
                  <th
                    key={`${i}-act`}
                    className="px-4 py-3 text-right border-b border-[#F3F4F6]"
                  >
                    实际目标
                  </th>,
                  <th
                    key={`${i}-order`}
                    className="px-4 py-3 text-right border-b border-[#F3F4F6]"
                  >
                    实际开单额
                  </th>,
                  <th
                    key={`${i}-rate`}
                    className="px-4 py-3 text-right border-b border-[#F3F4F6]"
                  >
                    实际达成率
                  </th>,
                ])}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-[#F3F4F6]',
                    row.isGrandTotal && 'bg-[#F3F4F6] font-bold',
                    row.isDeptSubtotal && 'bg-gray-50 font-semibold',
                    row.isGroupSubtotal && 'bg-gray-50 font-semibold',
                    !row.isGrandTotal &&
                      !row.isDeptSubtotal &&
                      !row.isGroupSubtotal &&
                      'hover:bg-[#F9FAFB]'
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
                  {row.dept !== undefined && (
                    <td
                      rowSpan={row.deptRowSpan || 1}
                      className="px-4 py-3 border-b border-[#F3F4F6] font-medium text-left align-middle"
                    >
                      {row.dept}
                    </td>
                  )}
                  {(row.groupRowSpan !== undefined ||
                    row.isDeptSubtotal ||
                    row.isGrandTotal) && (
                    <td
                      rowSpan={row.groupRowSpan || 1}
                      className="px-4 py-3 border-b border-[#F3F4F6] text-left align-middle"
                    >
                      {row.group || ''}
                    </td>
                  )}
                  <td
                    className={cn(
                      'px-4 py-3 border-b border-[#F3F4F6] text-left',
                      (row.isGroupSubtotal ||
                        row.isDeptSubtotal ||
                        row.isGrandTotal) &&
                        'font-semibold'
                    )}
                  >
                    {row.salesperson}
                  </td>
                  <td
                    className={cn(
                      'px-4 py-3 border-b border-[#F3F4F6] text-right',
                      (row.isGroupSubtotal ||
                        row.isDeptSubtotal ||
                        row.isGrandTotal) &&
                        'font-semibold'
                    )}
                  >
                    {fmtCurrency(row.annualTarget)}
                  </td>
                  {row.months.map((m, mi) => [
                    <td
                      key={`${row.id}-${mi}-init`}
                      className={cn(
                        'px-4 py-3 border-b border-[#F3F4F6] text-right',
                        (row.isGroupSubtotal ||
                          row.isDeptSubtotal ||
                          row.isGrandTotal) &&
                          'font-semibold'
                      )}
                    >
                      {fmtCurrency(m.initialTarget)}
                    </td>,
                    <td
                      key={`${row.id}-${mi}-act`}
                      className={cn(
                        'px-4 py-3 border-b border-[#F3F4F6] text-right',
                        (row.isGroupSubtotal ||
                          row.isDeptSubtotal ||
                          row.isGrandTotal) &&
                          'font-semibold'
                      )}
                    >
                      {fmtCurrency(m.actualTarget)}
                    </td>,
                    <td
                      key={`${row.id}-${mi}-order`}
                      className={cn(
                        'px-4 py-3 border-b border-[#F3F4F6] text-right',
                        (row.isGroupSubtotal ||
                          row.isDeptSubtotal ||
                          row.isGrandTotal) &&
                          'font-semibold'
                      )}
                    >
                      {fmtCurrency(m.actualOrder)}
                    </td>,
                    <td
                      key={`${row.id}-${mi}-rate`}
                      className={cn(
                        'px-4 py-3 border-b border-[#F3F4F6] text-right',
                        m.achievementRate >= 100
                          ? 'text-[#10B981]'
                          : 'text-[#EF4444]',
                        (row.isGroupSubtotal ||
                          row.isDeptSubtotal ||
                          row.isGrandTotal) &&
                          'font-semibold'
                      )}
                    >
                      {fmtPct(m.achievementRate)}
                    </td>,
                  ])}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
