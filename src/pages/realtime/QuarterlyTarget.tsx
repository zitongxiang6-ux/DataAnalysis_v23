import { useState, useMemo } from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { DataTable } from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getQuarterlyData,
  getCustomerQuarterlyData,
  type CustomerQuarterlyRow,
} from './mockData';
import {
  SALESPERSON_NAMES,
  CUSTOMER_NAMES,
} from '@/lib/mockData';
import { SHIPPING_DEPARTMENTS } from './sharedOptions';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Info, Target, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UpdateDataDialog } from '@/components/UpdateDataDialog';

const CUSTOMER_TYPE_OPTIONS = [
  '国际渠道商',
  '国内渠道商',
  'ODM客户',
  '国际重点渠道商',
  '国内重点渠道商',
  '国际发展组客户',
  '国内地产客户',
];

function QuarterCell({ actual, target }: { actual: number; target: number }) {
  const rate = target > 0 ? (actual / target) * 100 : 0;
  const diff = target - actual;
  const status = rate >= 100 ? '达标' : '未达标';
  return (
    <div className="space-y-0.5 py-1">
      <div className="text-[11px] leading-tight text-text-secondary">
        目标 ¥{(target / 10000).toFixed(0)}万
      </div>
      <div className="text-[11px] leading-tight text-text-secondary">
        完成 ¥{(actual / 10000).toFixed(0)}万
      </div>
      <div className={diff > 0 ? 'text-[11px] leading-tight text-danger' : 'text-[11px] leading-tight text-success'}>
        {diff > 0 ? `缺口¥${(diff / 10000).toFixed(0)}万` : `超额¥${(Math.abs(diff) / 10000).toFixed(0)}万`}
      </div>
      <div className={rate >= 100 ? 'text-[11px] leading-tight text-success font-semibold' : 'text-[11px] leading-tight text-danger font-semibold'}>
        {rate.toFixed(1)}%
      </div>
      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${rate >= 100 ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
        {status}
      </span>
    </div>
  );
}

export default function QuarterlyTarget() {
  const [quarterData] = useState(getQuarterlyData());
  const [customerData] = useState(getCustomerQuarterlyData());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Filter states
  const [statYear, setStatYear] = useState('2026');
  const [deptFilter, setDeptFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');

  const kpis = useMemo(() => {
    const annualSigningAmount = customerData.reduce(
      (sum, row) => sum + row.annualTarget,
      0
    );
    const annualShippingAmount = customerData.reduce(
      (sum, row) => sum + row.q1Actual + row.q2Actual + row.q3Actual + row.q4Actual,
      0
    );
    const completionRate =
      annualSigningAmount > 0 ? (annualShippingAmount / annualSigningAmount) * 100 : 0;
    const diffAmount = annualSigningAmount - annualShippingAmount;

    return [
      { label: '年度总签约额', value: annualSigningAmount, prefix: '¥', format: true },
      { label: '年度总出货额', value: annualShippingAmount, prefix: '¥', format: true },
      { label: '总完成率', value: completionRate, suffix: '%', decimals: 1 },
      { label: '总差额', value: diffAmount, prefix: '¥', format: true },
    ];
  }, [customerData]);

  const chartData = [
    { quarter: 'Q1', targetAmount: 3450000, actualAmount: 4850000 },
    { quarter: 'Q2', targetAmount: 9200000, actualAmount: 9970000 },
    { quarter: 'Q3', targetAmount: 16100000, actualAmount: 16210000 },
    { quarter: 'Q4', targetAmount: 23000000, actualAmount: 21100000 },
  ];

  const columns: Column<CustomerQuarterlyRow>[] = [
    { key: 'customerName', title: '客户名称', sortable: true, width: '110px' },
    { key: 'customerType', title: '客户类型', sortable: true, width: '110px' },
    { key: 'department', title: '所属部门', sortable: true, width: '90px' },
    { key: 'salesperson', title: '业务员', sortable: true, width: '80px' },
    {
      key: 'q1Actual',
      title: 'Q1',
      width: '100px',
      render: (row) => <QuarterCell actual={row.q1Actual} target={row.q1Target} />,
    },
    {
      key: 'q2Actual',
      title: 'Q2',
      width: '100px',
      render: (row) => <QuarterCell actual={row.q2Actual} target={row.q2Target} />,
    },
    {
      key: 'q3Actual',
      title: 'Q3',
      width: '100px',
      render: (row) => <QuarterCell actual={row.q3Actual} target={row.q3Target} />,
    },
    {
      key: 'q4Actual',
      title: 'Q4',
      width: '100px',
      render: (row) => <QuarterCell actual={row.q4Actual} target={row.q4Target} />,
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return customerData.slice(start, start + pageSize);
  }, [customerData, page, pageSize]);

  const handleExport = () => {
    if (selectedKeys.size === 0) {
      toast.info('请先勾选要导出的数据');
      return;
    }
    toast.success('导出成功', { description: `已导出 ${selectedKeys.size} 条数据` });
  };

  const handleQuery = () => {
    toast.info('查询功能开发中');
  };

  const handleCancel = () => {
    setStatYear('2026');
    setDeptFilter('all');
    setSalespersonFilter('all');
    setCustomerTypeFilter('all');
    setCustomerFilter('all');
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900 shadow-sm">
        <Info className="h-4 w-4 flex-shrink-0 text-primary" />
        <span className="font-medium">
          页面内的渠道商为当年在CRM中签订协议的渠道商清单
        </span>
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

      {/* Quarterly Progress Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {quarterData.map((q) => {
          const colors =
            q.completionRate >= 95
              ? { bg: 'bg-success-light', text: 'text-success', border: 'border-success/20' }
              : q.completionRate >= 80
              ? { bg: 'bg-warning-light', text: 'text-warning', border: 'border-warning/20' }
              : { bg: 'bg-danger-light', text: 'text-danger', border: 'border-danger/20' };
          return (
            <div
              key={q.quarter}
              className={`${colors.bg} border ${colors.border} rounded-card p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-h3 text-text-primary flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {q.quarter}
                </span>
                <span className={`text-data-medium ${colors.text}`}>
                  {q.completionRate}%
                </span>
              </div>
              <div className="mb-3">
                <Progress
                  value={Math.min(q.completionRate, 100)}
                  className="h-2.5"
                />
              </div>
              <div className="flex justify-between text-caption text-text-secondary mb-1">
                <span>目标: ¥{(q.target / 10000).toFixed(0)}万</span>
                <span>实际: ¥{(q.actual / 10000).toFixed(0)}万</span>
              </div>
              <div className={`text-caption font-semibold ${q.diff >= 0 ? 'text-danger' : 'text-success'}`}>
                {q.diff >= 0 ? '差额' : '超额'}: ¥{Math.abs(q.diff).toLocaleString('zh-CN')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Line Chart */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">季度累计金额趋势</h3>
        </div>
        <div style={{ width: '100%', minWidth: 400, height: 380 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis
                width={65}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                tickFormatter={(v: number) => `¥${(v / 10000).toFixed(0)}万`}
                domain={[0, 25000000]}
              />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 12 }}
                formatter={(value: unknown, name: unknown) => {
                  const labelMap: Record<string, string> = { targetAmount: '目标累计金额', actualAmount: '实际累计金额' };
                  const num = Number(value);
                  const key = String(name);
                  return [`¥${num.toLocaleString('zh-CN')}`, labelMap[key] || key];
                }}
              />
              <Legend formatter={(value) => {
                const labelMap: Record<string, string> = { targetAmount: '目标累计金额', actualAmount: '实际累计金额' };
                return <span className="text-sm">{labelMap[value] || value}</span>;
              }} />
              <Line type="monotone" dataKey="targetAmount" stroke="#3B82F6" strokeWidth={2.5} strokeDasharray="8 4" dot={{ r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} name="targetAmount" />
              <Line type="monotone" dataKey="actualAmount" stroke="#10B981" strokeWidth={2.5} dot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} name="actualAmount" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

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
              {SHIPPING_DEPARTMENTS.map((dept) => (
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
          <UpdateDataDialog />
          <Button variant="outline" size="sm" onClick={handleCancel}>
            重置
          </Button>
          <Button size="sm" onClick={handleQuery}>
            查询
          </Button>
        </div>
      </div>

      {/* Customer Quarterly Table */}
      <SectionCard title="客户季度完成情况">
        <DataTable
          columns={columns}
          data={paginatedData}
          rowKey={(row) => row.customerName}
          selection={{
            selectedKeys,
            onSelectChange: setSelectedKeys,
            rowKey: (row) => row.customerName,
          }}
          toolbar={
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-1.5 text-body-small text-text-secondary border-[#E5E7EB] hover:bg-[#F3F4F6] hover:text-text-primary"
            >
              <Download className="w-3.5 h-3.5" />
              导出
            </Button>
          }
          pagination={{
            page,
            pageSize,
            total: customerData.length,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
        />
      </SectionCard>
    </div>
  );
}
