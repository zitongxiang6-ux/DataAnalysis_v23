import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Layout } from '@/components/Layout';
import { DataTable } from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getFullCheckOrders,
  type FullCheckOrder,
} from '../realtime/mockData';
import { ClipboardCheck, RotateCcw, Search, ArrowLeft, Check, X } from 'lucide-react';
import { toast } from 'sonner';

type OrderStatus = 'unchecked' | 'valid' | 'excluded';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerNameFromUrl = searchParams.get('customer') || '';

  // Filters
  const [filters, setFilters] = useState({
    customerNo: '',
    customerName: customerNameFromUrl,
    tradeDateStart: '',
    tradeDateEnd: '',
    deptName: '',
    salespersonName: '',
    saleOrderNo: '',
    docType: '',
    itemNo: '',
    itemName: '',
    productModel: '',
  });

  const [activeTab, setActiveTab] = useState<OrderStatus>('unchecked');
  const [orders, setOrders] = useState<FullCheckOrder[]>(() =>
    getFullCheckOrders(customerNameFromUrl || '恒大地产')
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (o.status !== activeTab) return false;
      if (filters.customerNo && !o.customerNo.includes(filters.customerNo)) return false;
      if (filters.customerName && !o.customerName.includes(filters.customerName)) return false;
      if (filters.deptName && !o.deptName.includes(filters.deptName)) return false;
      if (filters.salespersonName && !o.salespersonName.includes(filters.salespersonName)) return false;
      if (filters.saleOrderNo && !o.saleOrderNo.includes(filters.saleOrderNo)) return false;
      if (filters.docType && !o.docType.includes(filters.docType)) return false;
      if (filters.itemNo && !o.itemNo.includes(filters.itemNo)) return false;
      if (filters.itemName && !o.itemName.includes(filters.itemName)) return false;
      if (filters.productModel && !o.productModel.includes(filters.productModel)) return false;
      if (filters.tradeDateStart && o.tradeDate < filters.tradeDateStart) return false;
      if (filters.tradeDateEnd && o.tradeDate > filters.tradeDateEnd) return false;
      return true;
    });
  }, [orders, activeTab, filters]);

  const uncheckedList = orders.filter((o) => o.status === 'unchecked');
  const validList = orders.filter((o) => o.status === 'valid');
  const excludedList = orders.filter((o) => o.status === 'excluded');
  const uncheckedAmount = uncheckedList.reduce((s, o) => s + o.amount, 0);
  const validAmount = validList.reduce((s, o) => s + o.amount, 0);
  const excludedAmount = excludedList.reduce((s, o) => s + o.amount, 0);

  const setOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const handleReset = () => {
    setFilters({ customerNo: '', customerName: '', tradeDateStart: '', tradeDateEnd: '', deptName: '', salespersonName: '', saleOrderNo: '', docType: '', itemNo: '', itemName: '', productModel: '' });
    toast.info('已重置筛选条件');
  };

  const renderActions = (row: FullCheckOrder) => {
    if (activeTab === 'unchecked') {
      return (
        <div className="flex items-center justify-center gap-1">
          <button onClick={() => setOrderStatus(row.id, 'valid')} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded border border-[#10B981] text-[#10B981] hover:bg-[#DCFCE7]">
            <Check className="w-3 h-3" />确认有效
          </button>
          <button onClick={() => setOrderStatus(row.id, 'excluded')} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded border border-[#EF4444] text-[#EF4444] hover:bg-[#FEE2E2]">
            <X className="w-3 h-3" />确认剔除
          </button>
        </div>
      );
    }
    if (activeTab === 'valid') {
      return (
        <button onClick={() => setOrderStatus(row.id, 'excluded')} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded border border-[#EF4444] text-[#EF4444] hover:bg-[#FEE2E2] mx-auto">
          <X className="w-3 h-3" />改为剔除
        </button>
      );
    }
    return (
      <button onClick={() => setOrderStatus(row.id, 'valid')} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded border border-[#10B981] text-[#10B981] hover:bg-[#DCFCE7] mx-auto">
        <Check className="w-3 h-3" />改为有效
      </button>
    );
  };

  const columns: Column<FullCheckOrder>[] = [
    { key: 'customerNo', title: '客户编号', sortable: true, width: '110px' },
    { key: 'customerName', title: '客户名称', sortable: true, width: '100px' },
    { key: 'tradeDate', title: '交易日期', sortable: true, width: '95px' },
    { key: 'deptName', title: '业务部', sortable: true, width: '100px' },
    { key: 'salespersonName', title: '业务员名', sortable: true, width: '90px' },
    { key: 'saleOrderNo', title: '销售单号', sortable: true, width: '130px' },
    { key: 'returnOrderNo', title: '销货/退单号', sortable: true, width: '130px' },
    { key: 'docType', title: '单据类型', sortable: true, width: '85px' },
    { key: 'itemNo', title: '品号', sortable: true, width: '110px' },
    { key: 'itemName', title: '品名', sortable: true, width: '90px' },
    { key: 'spec', title: '规格', sortable: true, width: '80px' },
    { key: 'quantity', title: '业务数量', sortable: true, align: 'right', width: '80px' },
    { key: 'unitPrice', title: '单价', sortable: true, align: 'right', width: '70px' },
    { key: 'amount', title: '本币价税合计', sortable: true, align: 'right', width: '100px', render: (row) => `¥${row.amount.toLocaleString('zh-CN')}` },
    { key: 'remark', title: '备注', width: '180px', render: (row) => <span className="text-[#9CA3AF] text-[12px] truncate block max-w-[160px]" title={row.remark}>{row.remark}</span> },
    { key: 'projectNo', title: '项目编号', sortable: true, width: '110px' },
    { key: 'projectName', title: '项目名称', sortable: true, width: '120px' },
    { key: 'businessType', title: '业务类型', sortable: true, width: '90px' },
    { key: 'productSeries', title: '产品系列', sortable: true, width: '90px' },
    { key: 'actions', title: '操作', align: 'center', width: activeTab === 'unchecked' ? '160px' : '90px', render: (row) => renderActions(row) },
  ];

  const updateFilter = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <Layout>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/realtime-reports?tab=rebate')} className="flex items-center gap-1 text-[#6B7280] hover:text-[#1F2937] text-[13px]"><ArrowLeft className="w-4 h-4" />返回</button>
        <h1 className="text-h1 text-[#1F2937] flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-[#F59E0B]" />手动复核</h1>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1"><span className="text-[12px] text-[#6B7280]">客户编号</span><Input value={filters.customerNo} onChange={(e) => updateFilter('customerNo', e.target.value)} placeholder="请输入" className="w-[100px] h-8 text-[12px]" /></div>
          <div className="flex items-center gap-1"><span className="text-[12px] text-[#6B7280]">客户名称</span><Input value={filters.customerName} onChange={(e) => updateFilter('customerName', e.target.value)} placeholder="请输入" className="w-[100px] h-8 text-[12px]" /></div>
          <div className="flex items-center gap-1"><span className="text-[12px] text-[#6B7280]">交易日期</span><input type="date" value={filters.tradeDateStart} onChange={(e) => updateFilter('tradeDateStart', e.target.value)} className="w-[115px] h-8 text-[12px] border border-[#E5E7EB] rounded-md px-2" /><span className="text-[#9CA3AF]">~</span><input type="date" value={filters.tradeDateEnd} onChange={(e) => updateFilter('tradeDateEnd', e.target.value)} className="w-[115px] h-8 text-[12px] border border-[#E5E7EB] rounded-md px-2" /></div>
          <div className="flex items-center gap-1"><span className="text-[12px] text-[#6B7280]">业务部</span><Input value={filters.deptName} onChange={(e) => updateFilter('deptName', e.target.value)} placeholder="请输入" className="w-[100px] h-8 text-[12px]" /></div>
          <div className="flex items-center gap-1"><span className="text-[12px] text-[#6B7280]">业务员名</span><Input value={filters.salespersonName} onChange={(e) => updateFilter('salespersonName', e.target.value)} placeholder="请输入" className="w-[100px] h-8 text-[12px]" /></div>
          <div className="flex items-center gap-1"><span className="text-[12px] text-[#6B7280]">销售单号</span><Input value={filters.saleOrderNo} onChange={(e) => updateFilter('saleOrderNo', e.target.value)} placeholder="请输入" className="w-[120px] h-8 text-[12px]" /></div>
          <div className="flex items-center gap-1"><span className="text-[12px] text-[#6B7280]">单据类型</span><Input value={filters.docType} onChange={(e) => updateFilter('docType', e.target.value)} placeholder="请输入" className="w-[90px] h-8 text-[12px]" /></div>
          <div className="flex items-center gap-1"><span className="text-[12px] text-[#6B7280]">品号</span><Input value={filters.itemNo} onChange={(e) => updateFilter('itemNo', e.target.value)} placeholder="请输入" className="w-[100px] h-8 text-[12px]" /></div>
          <div className="flex items-center gap-1"><span className="text-[12px] text-[#6B7280]">品名</span><Input value={filters.itemName} onChange={(e) => updateFilter('itemName', e.target.value)} placeholder="请输入" className="w-[90px] h-8 text-[12px]" /></div>
          <div className="flex items-center gap-1"><span className="text-[12px] text-[#6B7280]">产品型号</span><Input value={filters.productModel} onChange={(e) => updateFilter('productModel', e.target.value)} placeholder="请输入" className="w-[100px] h-8 text-[12px]" /></div>
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1 text-[12px] border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] h-7"><RotateCcw className="w-3 h-3" />重置</Button>
          <Button size="sm" className="gap-1 text-[12px] bg-[#1A56DB] hover:bg-[#1E429F] text-white h-7"><Search className="w-3 h-3" />查询</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 mb-4 px-1">
        <span className="text-[13px] text-[#6B7280]">待复核 <span className="text-[#F59E0B] font-semibold">{uncheckedList.length}</span> 条 (¥{(uncheckedAmount/10000).toFixed(1)}万)</span>
        <span className="text-[13px] text-[#6B7280]">有效 <span className="text-[#10B981] font-semibold">{validList.length}</span> 条 (¥{(validAmount/10000).toFixed(1)}万)</span>
        <span className="text-[13px] text-[#6B7280]">剔除 <span className="text-[#EF4444] font-semibold">{excludedList.length}</span> 条 (¥{(excludedAmount/10000).toFixed(1)}万)</span>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)} className="mb-4">
        <TabsList className="bg-[#F3F4F6] h-10">
          <TabsTrigger value="unchecked" className="text-[13px] px-5 data-[state=active]:bg-white data-[state=active]:text-[#F59E0B] data-[state=active]:font-semibold">待复核金额 ({uncheckedList.length})</TabsTrigger>
          <TabsTrigger value="valid" className="text-[13px] px-5 data-[state=active]:bg-white data-[state=active]:text-[#10B981] data-[state=active]:font-semibold">有效金额 ({validList.length})</TabsTrigger>
          <TabsTrigger value="excluded" className="text-[13px] px-5 data-[state=active]:bg-white data-[state=active]:text-[#EF4444] data-[state=active]:font-semibold">已剔除金额 ({excludedList.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <DataTable columns={columns} data={filteredOrders} rowKey={(row) => row.id} />

      {/* Cancel & Submit */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E5E7EB]">
        <Button variant="outline" onClick={() => navigate('/realtime-reports?tab=rebate')} className="w-[100px] text-[13px] border-[#E5E7EB] text-[#6B7280]">取消</Button>
        <Button onClick={() => { toast.success('复核结果已提交'); navigate('/realtime-reports?tab=rebate'); }} className="w-[100px] text-[13px] bg-[#1A56DB] hover:bg-[#1E429F] text-white">提交</Button>
      </div>
    </Layout>
  );
}
