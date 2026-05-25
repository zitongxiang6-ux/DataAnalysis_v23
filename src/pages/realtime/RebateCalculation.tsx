import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { SectionCard } from '@/components/ui/SectionCard';
import { DataTable } from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  getRebateOrders,
  type RebateOrder,
} from './mockData';
import { ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type PeriodTab = 'quarterly' | 'yearly';

export default function RebateCalculationTab() {
  const navigate = useNavigate();

  // Period tab
  const [periodTab, setPeriodTab] = useState<PeriodTab>('quarterly');

  // Quarterly filters
  const [qYear, setQYear] = useState('2026');
  const [qQuarter, setQQuarter] = useState('Q1');
  const [qCustomer, setQCustomer] = useState('');

  // Yearly filters
  const [yYear, setYYear] = useState('2026');
  const [yCustomer, setYCustomer] = useState('');

  const [orders] = useState(getRebateOrders());

  // Quarterly pagination
  const [qPage, setQPage] = useState(1);
  const [qPageSize, setQPageSize] = useState(10);

  // Yearly pagination
  const [yPage, setYPage] = useState(1);
  const [yPageSize, setYPageSize] = useState(10);

  // Paginated data
  const qPaginated = useMemo(() => {
    const start = (qPage - 1) * qPageSize;
    return orders.slice(start, start + qPageSize);
  }, [orders, qPage, qPageSize]);

  const yPaginated = useMemo(() => {
    const start = (yPage - 1) * yPageSize;
    return orders.slice(start, start + yPageSize);
  }, [orders, yPage, yPageSize]);

  // Common columns (without actions)
  const baseColumns: Column<RebateOrder>[] = [
    { key: 'customerName', title: '客户名称', sortable: true },
    {
      key: 'contractAmount',
      title: '签约总额',
      sortable: true,
      align: 'right',
      render: (row) => `¥${row.contractAmount.toLocaleString('zh-CN')}`,
    },
    {
      key: 'quarterTarget',
      title: '季度目标额',
      sortable: true,
      align: 'right',
      render: () => `¥300,000`,
    },
    {
      key: 'toCheckAmount',
      title: '待复核金额',
      sortable: true,
      align: 'right',
      render: (row) => `¥${row.toCheckAmount.toLocaleString('zh-CN')}`,
    },
    {
      key: 'excludedAmount',
      title: '已剔除金额',
      sortable: true,
      align: 'right',
      render: (row) => row.excludedAmount > 0 ? `¥${row.excludedAmount.toLocaleString('zh-CN')}` : '-',
    },
    {
      key: 'effectiveAmount',
      title: '有效金额',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-medium">
          ¥{row.effectiveAmount.toLocaleString('zh-CN')}
        </span>
      ),
    },
    {
      key: 'isQualified',
      title: '是否达标',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span className={row.contractAmount >= 300000 ? 'text-[#10B981] font-semibold' : 'text-[#EF4444]'}>
          {row.contractAmount >= 300000 ? '已达标' : '未达标'}
        </span>
      ),
    },
    {
      key: 'rebateRatio',
      title: '返点比例',
      sortable: true,
      align: 'right',
      render: (row) => (row.contractAmount >= 300000 ? `${(row.rebateRatio * 100).toFixed(0)}%` : '-'),
    },
    {
      key: 'rebateAmount',
      title: '返点金额',
      sortable: true,
      align: 'right',
      render: (row) => (
        row.contractAmount >= 300000 ? (
          <span className="text-[#10B981] font-semibold">
            ¥{row.rebateAmount.toLocaleString('zh-CN')}
          </span>
        ) : (
          <span className="text-[#9CA3AF]">-</span>
        )
      ),
    },
  ];

  // Quarterly columns (with manual review action)
  const qColumns: Column<RebateOrder>[] = [
    ...baseColumns,
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          {row.toCheckAmount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[#F59E0B] hover:text-[#D97706] hover:bg-[#FEF3C7]"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/rebate-review?customer=${encodeURIComponent(row.customerName)}`);
              }}
            >
              <ClipboardCheck className="w-3.5 h-3.5 mr-1" />
              手动复核
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Yearly columns (without actions - read only)
  const yColumns: Column<RebateOrder>[] = baseColumns.filter(
    (column) => column.key !== 'quarterTarget'
  );

  return (
    <div className="animate-fade-in">
      {/* Period Tab: Quarterly / Yearly */}
      <div className="bg-white border border-[#E5E7EB] rounded-t-lg border-b-0 overflow-hidden">
        <div className="flex h-11 border-b border-[#E5E7EB]">
          <button
            onClick={() => setPeriodTab('quarterly')}
            className={cn(
              'relative flex items-center gap-2 px-6 text-[13px] font-medium transition-all duration-200 whitespace-nowrap',
              periodTab === 'quarterly'
                ? 'text-[#1A56DB] bg-[#EBF0FE]'
                : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB]'
            )}
          >
            季度
            {periodTab === 'quarterly' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A56DB]" />
            )}
          </button>
          <button
            onClick={() => setPeriodTab('yearly')}
            className={cn(
              'relative flex items-center gap-2 px-6 text-[13px] font-medium transition-all duration-200 whitespace-nowrap',
              periodTab === 'yearly'
                ? 'text-[#1A56DB] bg-[#EBF0FE]'
                : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB]'
            )}
          >
            年度
            {periodTab === 'yearly' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A56DB]" />
            )}
          </button>
        </div>
      </div>

      {/* Quarterly Content */}
      {periodTab === 'quarterly' && (
        <div className="bg-white border border-t-0 border-[#E5E7EB] rounded-b-lg p-6 shadow-sm">
          <SectionCard
            title={`${qYear}年 ${qQuarter} 返点测算明细`}
            titleAction={
              <div className="flex items-center gap-2 flex-wrap">
                <Select value={qYear} onValueChange={setQYear}>
                  <SelectTrigger className="w-[90px] h-8 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026年</SelectItem>
                    <SelectItem value="2025">2025年</SelectItem>
                    <SelectItem value="2024">2024年</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={qQuarter} onValueChange={setQQuarter}>
                  <SelectTrigger className="w-[65px] h-8 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1">Q1</SelectItem>
                    <SelectItem value="Q2">Q2</SelectItem>
                    <SelectItem value="Q3">Q3</SelectItem>
                    <SelectItem value="Q4">Q4</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={qCustomer}
                  onChange={(e) => setQCustomer(e.target.value)}
                  placeholder="客户名称"
                  className="w-[110px] h-8 text-[12px]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQCustomer('')}
                  className="h-8 px-3 text-[12px] border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]"
                >
                  重置
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3 text-[12px] bg-[#1A56DB] hover:bg-[#1E429F] text-white"
                >
                  查询
                </Button>
              </div>
            }
          >
            <DataTable
              columns={qColumns}
              data={qPaginated}
              rowKey={(row) => row.id}
              pagination={{
                page: qPage,
                pageSize: qPageSize,
                total: orders.length,
                onPageChange: setQPage,
                onPageSizeChange: setQPageSize,
              }}
            />
          </SectionCard>
        </div>
      )}

      {/* Yearly Content */}
      {periodTab === 'yearly' && (
        <div className="bg-white border border-t-0 border-[#E5E7EB] rounded-b-lg p-6 shadow-sm">
          <SectionCard
            title={`${yYear}年返点明细`}
            titleAction={
              <div className="flex items-center gap-2 flex-wrap">
                <Select value={yYear} onValueChange={setYYear}>
                  <SelectTrigger className="w-[90px] h-8 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026年</SelectItem>
                    <SelectItem value="2025">2025年</SelectItem>
                    <SelectItem value="2024">2024年</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={yCustomer}
                  onChange={(e) => setYCustomer(e.target.value)}
                  placeholder="客户名称"
                  className="w-[110px] h-8 text-[12px]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setYCustomer('')}
                  className="h-8 px-3 text-[12px] border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]"
                >
                  重置
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3 text-[12px] bg-[#1A56DB] hover:bg-[#1E429F] text-white"
                >
                  查询
                </Button>
              </div>
            }
          >
            <DataTable
              columns={yColumns}
              data={yPaginated}
              rowKey={(row) => row.id}
              pagination={{
                page: yPage,
                pageSize: yPageSize,
                total: orders.length,
                onPageChange: setYPage,
                onPageSizeChange: setYPageSize,
              }}
            />
          </SectionCard>
        </div>
      )}
    </div>
  );
}
