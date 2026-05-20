import { useState } from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { DataTable } from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';
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
import {
  DEPARTMENTS,
  SALESPERSON_NAMES,
  CUSTOMER_NAMES,
} from '@/lib/mockData';

import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CUSTOMER_TYPE_OPTIONS = [
  '国际渠道商',
  '国内渠道商',
  'ODM客户',
  '国际重点渠道商',
  '国内重点渠道商',
  '国际发展组客户',
  '国内地产客户',
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

const fixedStatClass = {
  completion: 'right-[410px] w-[130px] min-w-[130px]',
  rate: 'right-[310px] w-[100px] min-w-[100px]',
  yoyDiff: 'right-[160px] w-[150px] min-w-[150px]',
  yoyRate: 'right-0 w-[160px] min-w-[160px]',
} as const;

const fixedHeaderClass =
  'sticky z-30 px-4 py-3 text-right border-b border-l border-[#D8E5FF] bg-[#EEF4FF] text-[#1D4ED8]';

const fixedBodyClass =
  'sticky z-20 px-4 py-3 text-right border-b border-l border-[#D8E5FF] bg-[#F8FAFF] shadow-[-12px_0_18px_-18px_rgba(30,64,175,0.55)]';

export default function ChannelDealer() {
  const [dealerData, setDealerData] = useState(getChannelDealerData());

  // Filter states
  const [statYear, setStatYear] = useState('2026');
  const [deptFilter, setDeptFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');

  // Table selection state
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = dealerData.length;
  const pagedData = dealerData.slice((page - 1) * pageSize, page * pageSize);

  const handleQuery = () => {
    toast.info('查询功能开发中');
  };

  const handleCancel = () => {
    setStatYear('2026');
    setDeptFilter('all');
    setSalespersonFilter('all');
    setCustomerTypeFilter('all');
    setCustomerFilter('all');
    setDealerData(getChannelDealerData());
  };

  const kpis = [
    { label: '签约渠道数', value: channelDealerKpis.dealerCount, suffix: '家', trend: 5.2, comparison: 'vs 上月' },
    { label: '出货总额', value: channelDealerKpis.totalShipping, prefix: '¥', format: true, trend: 8.7, comparison: 'vs 上月' },
    { label: '平均签约完成率', value: channelDealerKpis.avgCompletionRate, suffix: '%', decimals: 1, trend: 2.3, comparison: 'vs 上月' },
    { label: '未结束订单金额', value: channelDealerKpis.openOrders, prefix: '¥', format: true, trend: -0.8, comparison: '实时变动' },
  ];

  const summaryKpis = [
    { label: '年完成额', value: channelDealerKpis.totalShipping, prefix: '¥', format: true, trend: 8.7, comparison: 'vs 上月' },
    { label: '年完成率', value: channelDealerKpis.avgCompletionRate, suffix: '%', decimals: 1, trend: 2.3, comparison: 'vs 上月' },
    { label: '1~4月同比差额', value: channelDealerKpis.openOrders, prefix: '¥', format: true, trend: 5.2, comparison: 'vs 上月' },
    { label: '1~4月同比增长率', value: 8.7, suffix: '%', decimals: 1, trend: -0.8, comparison: '实时变动' },
  ];

  const formatMoney = (val: number) => {
    const sign = val < 0 ? '-' : '';
    return `${sign}¥${Math.abs(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMonthMoney = (row: ChannelDealerRow, key: MonthKey) => {
    const value = row[key];
    return typeof value === 'number' ? formatMoney(value) : '-';
  };

  const columns: Column<ChannelDealerRow>[] = [
    { key: 'department', title: '部门', sortable: true },
    { key: 'salesperson', title: '业务员', sortable: true },
    { key: 'name', title: '客户名称', sortable: true },
    {
      key: 'channelType',
      title: '客户类型',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span className="text-xs text-text-secondary">{row.channelType}</span>
      ),
    },
    {
      key: 'jan',
      title: '1月出货额',
      sortable: true,
      align: 'right',
      render: (row) => formatMoney(row.jan),
    },
    {
      key: 'feb',
      title: '2月出货额',
      sortable: true,
      align: 'right',
      render: (row) => formatMoney(row.feb),
    },
    {
      key: 'mar',
      title: '3月出货额',
      sortable: true,
      align: 'right',
      render: (row) => formatMoney(row.mar),
    },
    {
      key: 'apr',
      title: '4月出货额',
      sortable: true,
      align: 'right',
      render: (row) => formatMoney(row.apr),
    },
    {
      key: 'totalJanApr',
      title: '1-4月出货额',
      sortable: true,
      align: 'right',
      render: (row) => formatMoney(row.totalJanApr),
    },
    {
      key: 'completionRate',
      title: '完成率',
      sortable: true,
      align: 'right',
      render: (row) => `${row.completionRate.toFixed(2)}%`,
    },
    {
      key: 'yoyDiff',
      title: '1-4月同期差额',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className={row.yoyDiff >= 0 ? 'text-success' : 'text-danger'}>
          {formatMoney(row.yoyDiff)}
        </span>
      ),
    },
    {
      key: 'yoyGrowth',
      title: '1-4月同比增长率',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className={row.yoyGrowth >= 0 ? 'text-success' : 'text-danger'}>
          {row.yoyGrowth >= 0 ? '+' : ''}{row.yoyGrowth.toFixed(2)}%
        </span>
      ),
    },
  ];

  void kpis;
  void columns;

  const customerColumns: Column<ChannelDealerRow>[] = [
    { key: 'name', title: '客户名称', sortable: true, width: '130px' },
    {
      key: 'channelType',
      title: '客户类型',
      sortable: true,
      width: '150px',
      render: (row) => (
        <span className="text-xs text-text-secondary">{row.channelType}</span>
      ),
    },
    { key: 'department', title: '部门', sortable: true, width: '90px' },
    { key: 'salesperson', title: '业务员', sortable: true, width: '90px' },
    {
      key: 'signingAmount',
      title: '签约额',
      sortable: true,
      width: '120px',
      align: 'right',
      render: (row) => formatMoney(row.signingAmount),
    },
    ...monthColumns.map<Column<ChannelDealerRow>>((month) => ({
      key: month.key,
      title: month.title,
      sortable: true,
      width: '120px',
      align: 'right',
      render: (row) => (
        <span className={typeof row[month.key] === 'number' ? '' : 'text-text-tertiary'}>
          {formatMonthMoney(row, month.key)}
        </span>
      ),
    })),
    {
      key: 'totalJanApr',
      title: '年完成额',
      sortable: true,
      width: '130px',
      align: 'right',
      headerClassName: cn(fixedHeaderClass, fixedStatClass.completion),
      cellClassName: cn(fixedBodyClass, fixedStatClass.completion),
      render: (row) => formatMoney(row.totalJanApr),
    },
    {
      key: 'completionRate',
      title: '年完成率',
      sortable: true,
      width: '100px',
      align: 'right',
      headerClassName: cn(fixedHeaderClass, fixedStatClass.rate),
      cellClassName: cn(fixedBodyClass, fixedStatClass.rate),
      render: (row) => `${row.completionRate.toFixed(2)}%`,
    },
    {
      key: 'yoyDiff',
      title: '1~4月同比差额',
      sortable: true,
      width: '150px',
      align: 'right',
      headerClassName: cn(fixedHeaderClass, fixedStatClass.yoyDiff),
      cellClassName: (row) =>
        cn(
          fixedBodyClass,
          fixedStatClass.yoyDiff,
          row.yoyDiff >= 0 ? 'text-success' : 'text-danger'
        ),
      render: (row) => formatMoney(row.yoyDiff),
    },
    {
      key: 'yoyGrowth',
      title: '1~4月同比增长率',
      sortable: true,
      width: '160px',
      align: 'right',
      headerClassName: cn(fixedHeaderClass, fixedStatClass.yoyRate),
      cellClassName: (row) =>
        cn(
          fixedBodyClass,
          fixedStatClass.yoyRate,
          row.yoyGrowth >= 0 ? 'text-success' : 'text-danger'
        ),
      render: (row) => `${row.yoyGrowth >= 0 ? '+' : ''}${row.yoyGrowth.toFixed(2)}%`,
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
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

          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={salespersonFilter} onValueChange={setSalespersonFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="选择业务员" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部业务员</SelectItem>
              {SALESPERSON_NAMES.map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="选择客户类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部客户类型</SelectItem>
              {CUSTOMER_TYPE_OPTIONS.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={customerFilter} onValueChange={setCustomerFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择客户" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部客户</SelectItem>
              {CUSTOMER_NAMES.slice(0, 8).map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
          <Button variant="outline" size="sm" onClick={handleCancel}>
            取消
          </Button>
          <Button size="sm" onClick={handleQuery}>
            查询
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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

      {/* Dealer Table */}
      <SectionCard>
        <DataTable
          columns={customerColumns}
          data={pagedData}
          rowKey={(row) => row.id}
          selection={{
            selectedKeys,
            onSelectChange: setSelectedKeys,
            rowKey: (row) => row.id,
          }}
          toolbar={
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => toast.info('导出功能开发中')}
            >
              <Download className="w-4 h-4 mr-1" />
              导出
            </Button>
          }
          pagination={{
            page,
            pageSize,
            total,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
        />
      </SectionCard>
    </div>
  );
}
