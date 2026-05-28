import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Download, Edit3, Save, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  getSalespersonMonthlyData,
  type SalespersonMonthData,
  type SalespersonMonthlyTableRow,
} from './mockData';
import {
  SHIPPING_HIERARCHY_FILTER_OPTIONS,
  matchesShippingHierarchyFilter,
} from './sharedOptions';

interface SalesTargetRow {
  id: string;
  department: string;
  group: string;
  area: string;
  salesperson: string;
  annualBaseTarget: number;
  months: SalespersonMonthData[];
}

interface TableRow extends SalesTargetRow {
  departmentRowSpan?: number;
  groupRowSpan?: number;
  areaRowSpan?: number;
  isTotal?: boolean;
}

const monthLabels = [
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
];

const leftHeaderClass =
  'border-b border-r border-[#D8DEE9] bg-[#F8FAFC] px-3 py-3 text-left font-semibold text-[#111827]';
const leftBodyClass =
  'border-b border-r border-[#E5E7EB] px-3 py-3 text-left';
const headerClass =
  'border-b border-r border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-right font-semibold text-[#111827]';
const bodyClass =
  'border-b border-r border-[#F3F4F6] px-3 py-2 text-right';

function formatCurrency(value: number) {
  const sign = value < 0 ? '-' : '';
  return `${sign}￥${Math.abs(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function negativeClass(value: number) {
  return value < 0 ? 'text-[#DC2626]' : '';
}

function parseMoneyInput(value: string) {
  const parsed = Number(value.replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getSalespersonArea(group: string, index: number) {
  if (group.includes('国际渠道')) {
    return index < 3 ? '维护组' : index < 7 ? '发展组' : '开拓组';
  }
  if (group.includes('国内渠道')) {
    return index < 4 ? '维护组' : index < 8 ? '开拓组' : '地产组';
  }
  return '-';
}

function normalizeRows(rows: SalespersonMonthlyTableRow[]) {
  let department = '';
  let group = '';
  const groupCounters = new Map<string, number>();

  return rows.reduce<SalesTargetRow[]>((detailRows, row) => {
    if (row.dept) department = row.dept;
    if (row.group !== undefined && row.group !== '') group = row.group;

    if (row.isGroupSubtotal || row.isDeptSubtotal || row.isGrandTotal) {
      return detailRows;
    }

    const groupKey = `${department}-${row.group ?? group}`;
    const groupIndex = groupCounters.get(groupKey) ?? 0;
    groupCounters.set(groupKey, groupIndex + 1);

    detailRows.push({
      id: row.id,
      department,
      group: row.group ?? group,
      area: getSalespersonArea(row.group ?? group, groupIndex),
      salesperson: row.salesperson,
      annualBaseTarget: row.annualTarget,
      months: row.months.map((month) => ({ ...month })),
    });

    return detailRows;
  }, []);
}

function makeTotalRow(rows: SalesTargetRow[]): TableRow {
  const months = monthLabels.map((_, index) =>
    rows.reduce(
      (total, row) => ({
        initialTarget: total.initialTarget + row.months[index].initialTarget,
        actualTarget: total.actualTarget + row.months[index].actualTarget,
        actualOrder: 0,
        achievementRate: 0,
      }),
      { initialTarget: 0, actualTarget: 0, actualOrder: 0, achievementRate: 0 }
    )
  );

  return {
    id: 'sales-target-total',
    department: '合计',
    group: '-',
    area: '-',
    salesperson: '合计',
    annualBaseTarget: rows.reduce((sum, row) => sum + row.annualBaseTarget, 0),
    months,
    isTotal: true,
  };
}

function getInitialTargetSum(row: TableRow) {
  return row.months.reduce((sum, month) => sum + month.initialTarget, 0);
}

function updateAnnualTargetMonths(row: SalesTargetRow, annualTarget: number) {
  const currentSum = row.months.reduce((sum, month) => sum + month.initialTarget, 0);
  const ratio = currentSum === 0 ? 0 : annualTarget / currentSum;
  return row.months.map((month) => ({
    ...month,
    initialTarget: currentSum === 0 ? Math.round(annualTarget / 12) : Math.round(month.initialTarget * ratio),
  }));
}

function buildTableRows(rows: SalesTargetRow[]): TableRow[] {
  const detailRows = rows.map<TableRow>((row) => ({ ...row }));
  const result: TableRow[] = [makeTotalRow(detailRows)];

  const departmentGroups = new Map<string, TableRow[]>();
  for (const row of detailRows) {
    const departmentRows = departmentGroups.get(row.department) ?? [];
    departmentRows.push(row);
    departmentGroups.set(row.department, departmentRows);
  }

  for (const departmentRows of departmentGroups.values()) {
    departmentRows[0].departmentRowSpan = departmentRows.length;

    const groupMap = new Map<string, TableRow[]>();
    for (const row of departmentRows) {
      const key = `${row.department}-${row.group}`;
      const groupRows = groupMap.get(key) ?? [];
      groupRows.push(row);
      groupMap.set(key, groupRows);
    }
    for (const groupRows of groupMap.values()) {
      groupRows[0].groupRowSpan = groupRows.length;

      const areaMap = new Map<string, TableRow[]>();
      for (const row of groupRows) {
        const key = `${row.department}-${row.group}-${row.area}`;
        const areaRows = areaMap.get(key) ?? [];
        areaRows.push(row);
        areaMap.set(key, areaRows);
      }
      for (const areaRows of areaMap.values()) {
        areaRows[0].areaRowSpan = areaRows.length;
      }
    }

    result.push(...departmentRows);
  }

  return result;
}

function CurrencyCell({
  value,
  editing,
  onChange,
}: {
  value: number;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  if (!editing) {
    return <span className={cn('font-mono', negativeClass(value))}>{formatCurrency(value)}</span>;
  }

  return (
    <Input
      value={String(value)}
      onChange={(event) => onChange(event.target.value)}
      className="h-8 min-w-[116px] text-right text-[12px]"
    />
  );
}

export default function SalesTargetManagement() {
  const [year, setYear] = useState('2026');
  const [importYear, setImportYear] = useState('2026');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');
  const [rows, setRows] = useState<SalesTargetRow[]>(() =>
    normalizeRows(getSalespersonMonthlyData().rows)
  );
  const [draftRows, setDraftRows] = useState<SalesTargetRow[] | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const isEditing = Boolean(draftRows);
  const activeRows = draftRows ?? rows;

  const salespersons = useMemo(
    () =>
      Array.from(
        new Set(
          activeRows
            .filter((row) => matchesShippingHierarchyFilter(row, departmentFilter))
            .map((row) => row.salesperson)
        )
      ),
    [activeRows, departmentFilter]
  );

  const filteredRows = useMemo(
    () =>
      activeRows.filter(
        (row) =>
          matchesShippingHierarchyFilter(row, departmentFilter) &&
          (salespersonFilter === 'all' || row.salesperson === salespersonFilter)
      ),
    [activeRows, departmentFilter, salespersonFilter]
  );

  const tableRows = useMemo(() => buildTableRows(filteredRows), [filteredRows]);

  const updateMonthTarget = (
    id: string,
    monthIndex: number,
    key: 'initialTarget' | 'actualTarget',
    value: string
  ) => {
    const targetValue = parseMoneyInput(value);
    setDraftRows((prev) =>
      (prev ?? rows).map((row) =>
        row.id === id
          ? {
              ...row,
              months: row.months.map((month, index) =>
                index === monthIndex ? { ...month, [key]: targetValue } : month
              ),
            }
          : row
      )
    );
  };

  const updateAnnualTarget = (id: string, value: string) => {
    const targetValue = parseMoneyInput(value);
    setDraftRows((prev) =>
      (prev ?? rows).map((row) =>
        row.id === id
          ? {
              ...row,
              annualBaseTarget: targetValue,
              months: updateAnnualTargetMonths(row, targetValue),
            }
          : row
      )
    );
  };

  const resetFilters = () => {
    setYear('2026');
    setDepartmentFilter('all');
    setSalespersonFilter('all');
  };

  const startEdit = () => {
    setDraftRows(rows.map((row) => ({ ...row, months: row.months.map((month) => ({ ...month })) })));
  };

  const cancelEdit = () => {
    setDraftRows(null);
    toast.info('已取消编辑');
  };

  const saveTargets = () => {
    if (!draftRows) return;
    setRows(draftRows);
    setDraftRows(null);
    toast.success('销售目标已保存', {
      description: `已保存 ${filteredRows.length} 位业务员的目标设置`,
    });
  };

  const queryTargets = () => {
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

          <Select
            value={departmentFilter}
            onValueChange={(value) => {
              setDepartmentFilter(value);
              setSalespersonFilter('all');
            }}
          >
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              {SHIPPING_HIERARCHY_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={salespersonFilter} onValueChange={setSalespersonFilter}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="业务员" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部业务员</SelectItem>
              {salespersons.map((salesperson) => (
                <SelectItem key={salesperson} value={salesperson}>
                  {salesperson}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            重置
          </Button>
          <Button size="sm" onClick={queryTargets}>
            查询
          </Button>
        </div>
      </div>

      <SectionCard
        title="业务员销售目标维护"
        titleAction={
          isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={cancelEdit} className="gap-1.5">
                <X className="h-3.5 w-3.5" />
                取消
              </Button>
              <Button size="sm" onClick={saveTargets} className="gap-1.5">
                <Save className="h-3.5 w-3.5" />
                保存
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={startEdit} className="gap-1.5">
              <Edit3 className="h-3.5 w-3.5" />
              编辑
            </Button>
          )
        }
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportOpen(true)}
              className="gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              导入数据
            </Button>
          </div>
          <span className="text-[12px] text-text-tertiary">
            合计行仅用于汇总查看，不参与编辑。
          </span>
        </div>

        <div className="relative overflow-x-auto rounded-md border border-[#E5E7EB]">
          <table className="w-max min-w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th className={cn(leftHeaderClass, 'w-[120px] min-w-[120px]')}>部门</th>
                <th className={cn(leftHeaderClass, 'w-[120px] min-w-[120px]')}>分组</th>
                <th className={cn(leftHeaderClass, 'w-[110px] min-w-[110px]')}>区域</th>
                <th className={cn(leftHeaderClass, 'w-[110px] min-w-[110px]')}>业务员</th>
                <th className={cn(headerClass, 'w-[150px] min-w-[150px]')}>年度目标额</th>
                {monthLabels.map((month) => (
                  <th
                    key={month}
                    colSpan={2}
                    className={cn(headerClass, 'min-w-[260px] text-center')}
                  >
                    {month}
                  </th>
                ))}
              </tr>
              <tr>
                <th className={cn(leftHeaderClass, 'w-[120px] min-w-[120px]')} />
                <th className={cn(leftHeaderClass, 'w-[120px] min-w-[120px]')} />
                <th className={cn(leftHeaderClass, 'w-[110px] min-w-[110px]')} />
                <th className={cn(leftHeaderClass, 'w-[110px] min-w-[110px]')} />
                <th className={cn(headerClass, 'w-[150px] min-w-[150px]')} />
                {monthLabels.flatMap((month) => [
                  <th key={`${month}-initial`} className={cn(headerClass, 'w-[130px] min-w-[130px]')}>
                    期初目标
                  </th>,
                  <th key={`${month}-actual`} className={cn(headerClass, 'w-[130px] min-w-[130px]')}>
                    实际目标
                  </th>,
                ])}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => {
                const rowEditing = isEditing && !row.isTotal;
                const rowBg = row.isTotal ? 'bg-[#EEF2FF] font-semibold' : 'bg-white';

                return (
                  <tr key={row.id} className={cn(!row.isTotal && 'hover:bg-[#F9FAFB]')}>
                    {row.isTotal ? (
                      <>
                        <td className={cn(leftBodyClass, rowBg, 'font-semibold')}>合计</td>
                        <td className={cn(leftBodyClass, rowBg)}>-</td>
                        <td className={cn(leftBodyClass, rowBg)}>-</td>
                      </>
                    ) : (
                      <>
                        {row.departmentRowSpan !== undefined && (
                          <td
                            rowSpan={row.departmentRowSpan}
                            className={cn(leftBodyClass, rowBg, 'align-middle font-semibold')}
                          >
                            {row.department}
                          </td>
                        )}
                        {row.groupRowSpan !== undefined && (
                          <td
                            rowSpan={row.groupRowSpan}
                            className={cn(leftBodyClass, rowBg, 'align-middle font-semibold')}
                          >
                            {row.group}
                          </td>
                        )}
                        {row.areaRowSpan !== undefined && (
                          <td rowSpan={row.areaRowSpan} className={cn(leftBodyClass, rowBg, 'align-middle')}>
                            {row.area}
                          </td>
                        )}
                      </>
                    )}
                    <td className={cn(leftBodyClass, rowBg, 'font-semibold')}>{row.salesperson}</td>
                    <td className={cn(bodyClass, rowBg)}>
                      <CurrencyCell
                        value={row.isTotal ? getInitialTargetSum(row) : row.annualBaseTarget}
                        editing={rowEditing}
                        onChange={(value) => updateAnnualTarget(row.id, value)}
                      />
                    </td>
                    {row.months.flatMap((month, index) => [
                      <td key={`${row.id}-${index}-initial`} className={cn(bodyClass, rowBg)}>
                        <CurrencyCell
                          value={month.initialTarget}
                          editing={rowEditing}
                          onChange={(value) =>
                            updateMonthTarget(row.id, index, 'initialTarget', value)
                          }
                        />
                      </td>,
                      <td key={`${row.id}-${index}-actual`} className={cn(bodyClass, rowBg)}>
                        <CurrencyCell
                          value={month.actualTarget}
                          editing={rowEditing}
                          onChange={(value) =>
                            updateMonthTarget(row.id, index, 'actualTarget', value)
                          }
                        />
                      </td>,
                    ])}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-[460px]">
          <DialogHeader>
            <DialogTitle>导入数据</DialogTitle>
            <DialogDescription>
              请选择数据所属年份后再导入，系统会按模板字段写入对应年份的期初目标。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-[13px] font-medium text-text-primary">数据所属年份</div>
              <Select value={importYear} onValueChange={setImportYear}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="选择年份" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026年</SelectItem>
                  <SelectItem value="2025">2025年</SelectItem>
                  <SelectItem value="2024">2024年</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => toast.success('模板已下载', { description: '请按模板填写期初目标数据' })}
                className="gap-1.5"
              >
                <Download className="h-4 w-4" />
                下载模板
              </Button>
              <Button
                onClick={() => {
                  toast.success('导入完成', { description: `${importYear} 年期初目标数据已导入` });
                  setImportOpen(false);
                }}
                className="gap-1.5"
              >
                <Upload className="h-4 w-4" />
                导入数据
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
