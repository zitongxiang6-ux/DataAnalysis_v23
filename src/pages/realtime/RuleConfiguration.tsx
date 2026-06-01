import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Info, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { SHIPPING_DEPARTMENTS } from './sharedOptions';

interface AttributionRow {
  id: string;
  companyName: string;
  customerCode: string;
  customerName: string;
  tradeDate: string;
  salesDeptName: string;
  salespersonName: string;
  salesOrderNo: string;
  shippingReturnNo: string;
  docTypeName: string;
  productCode: string;
  productName: string;
  specification: string;
  quantity: number;
  unitPrice: number;
  amountWithTax: number;
  remark: string;
  projectNo: string;
  projectName: string;
  businessType: string;
  productSeries: string;
  assignedSalesperson: string;
  assignedDept: string;
}

const salespersons = ['张三', '李华', '王芳', '赵强', '刘敏', '陈杰', '杨丽', '黄磊', '周涛', '吴静'];
const docTypes = ['销货单', '销售退单'];
const businessTypes = ['项目销售', '渠道销售', '样板间', '年度框架'];
const productSeries = ['智能照明', '智能面板', '能源管理', '酒店客控'];
const customers = ['广州科技', '深圳光明', '北京宏远', '上海信达', '杭州智联', '成都华盛', '武汉天成', '南京瑞景', '西安宏图', '重庆新兴'];
const ownershipDepartmentOptions = [
  { value: '全球渠道部', label: '全球渠道部' },
  { value: '全球渠道部 / 国际渠道组', label: '　国际渠道组' },
  { value: '全球渠道部 / 国际渠道组 / 维护组', label: '　　维护组' },
  { value: '全球渠道部 / 国际渠道组 / 发展组', label: '　　发展组' },
  { value: '全球渠道部 / 国际渠道组 / 开拓组', label: '　　开拓组' },
  { value: '全球渠道部 / 国内渠道组', label: '　国内渠道组' },
  { value: '全球渠道部 / 国内渠道组 / 维护组', label: '　　维护组' },
  { value: '全球渠道部 / 国内渠道组 / 开拓组', label: '　　开拓组' },
  { value: '全球渠道部 / 国内渠道组 / 地产组', label: '　　地产组' },
  { value: '全球渠道部 / ODM组', label: '　ODM组' },
  { value: '全球渠道部 / ODM组 / 国际ODM组', label: '　　国际ODM组' },
  { value: '全球渠道部 / ODM组 / 国内ODM组', label: '　　国内ODM组' },
  { value: '国内大客户部', label: '国内大客户部' },
  { value: '国际酒店部', label: '国际酒店部' },
  { value: '储能事业部', label: '储能事业部' },
  { value: '河东电子', label: '河东电子' },
];

const initialRows: AttributionRow[] = Array.from({ length: 36 }, (_, index) => {
  const department = SHIPPING_DEPARTMENTS[index % SHIPPING_DEPARTMENTS.length];
  const salesperson = salespersons[index % salespersons.length];
  const docTypeName = docTypes[index % docTypes.length];
  const month = (index % 5) + 1;
  const day = String((index % 24) + 1).padStart(2, '0');
  const quantity = (index % 6) + 1;
  const unitPrice = 1280 + index * 75;

  return {
    id: `ATTR-${String(index + 1).padStart(3, '0')}`,
    companyName: index % 3 === 0 ? '河东科技' : '河东智能',
    customerCode: `C${String(1000 + index).padStart(4, '0')}`,
    customerName: customers[index % customers.length],
    tradeDate: `2026-${String(month).padStart(2, '0')}-${day}`,
    salesDeptName: department,
    salespersonName: salesperson,
    salesOrderNo: `SO-2026-${String(8000 + index)}`,
    shippingReturnNo: `${docTypeName === '销售退单' ? 'RT' : 'SH'}-2026-${String(6000 + index)}`,
    docTypeName,
    productCode: `HD-${String(3200 + index)}`,
    productName: index % 2 === 0 ? '智能控制面板' : '智能网关',
    specification: index % 2 === 0 ? '86型 / 黑色' : 'DIN导轨 / 白色',
    quantity,
    unitPrice,
    amountWithTax: quantity * unitPrice,
    remark: index % 5 === 0 ? '跨部门项目，需指定业绩归属' : '-',
    projectNo: `PRJ-${String(202600 + index)}`,
    projectName: index % 4 === 0 ? '酒店智能化项目' : index % 4 === 1 ? '渠道样板间项目' : index % 4 === 2 ? '地产精装项目' : '年度框架订单',
    businessType: businessTypes[index % businessTypes.length],
    productSeries: productSeries[index % productSeries.length],
    assignedSalesperson: '',
    assignedDept: '',
  };
});

function formatCurrency(value: number) {
  const sign = value < 0 ? '-' : '';
  return `${sign}￥${Math.abs(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export default function RuleConfiguration() {
  const [sourceRows, setSourceRows] = useState(initialRows);
  const [resultRows, setResultRows] = useState<AttributionRow[]>([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [importOpen, setImportOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [batchSalesperson, setBatchSalesperson] = useState('');
  const [batchDept, setBatchDept] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [salesOrderNo, setSalesOrderNo] = useState('');
  const [shippingReturnNo, setShippingReturnNo] = useState('');
  const [projectNo, setProjectNo] = useState('');
  const [projectName, setProjectName] = useState('');
  const [productCodeFilter, setProductCodeFilter] = useState('');
  const [productNameFilter, setProductNameFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');
  const [docTypeFilter, setDocTypeFilter] = useState('all');
  const [businessTypeFilter, setBusinessTypeFilter] = useState('all');
  const [productSeriesFilter, setProductSeriesFilter] = useState('all');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const filteredSalespersons = useMemo(
    () =>
      unique(
        sourceRows
          .filter((row) => departmentFilter === 'all' || row.salesDeptName === departmentFilter)
          .map((row) => row.salespersonName)
      ),
    [departmentFilter, sourceRows]
  );

  const allSelected = resultRows.length > 0 && resultRows.every((row) => selectedKeys.has(row.id));
  const someSelected = resultRows.some((row) => selectedKeys.has(row.id)) && !allSelected;
  const selectedCount = selectedKeys.size;
  const canBatchUpdate = selectedCount > 0 && (batchSalesperson || batchDept);

  const queryRows = () => {
    const rows = sourceRows.filter((row) => (
      contains(row.companyName, companyName) &&
      contains(row.customerCode, customerCode) &&
      contains(row.customerName, customerName) &&
      contains(row.salesOrderNo, salesOrderNo) &&
      contains(row.shippingReturnNo, shippingReturnNo) &&
      contains(row.projectNo, projectNo) &&
      contains(row.projectName, projectName) &&
      contains(row.productCode, productCodeFilter) &&
      contains(row.productName, productNameFilter) &&
      (departmentFilter === 'all' || row.salesDeptName === departmentFilter) &&
      (salespersonFilter === 'all' || row.salespersonName === salespersonFilter) &&
      (docTypeFilter === 'all' || row.docTypeName === docTypeFilter) &&
      (businessTypeFilter === 'all' || row.businessType === businessTypeFilter) &&
      (productSeriesFilter === 'all' || row.productSeries === productSeriesFilter) &&
      (!dateStart || row.tradeDate >= dateStart) &&
      (!dateEnd || row.tradeDate <= dateEnd)
    ));

    setResultRows(rows);
    setSelectedKeys(new Set());
    setBatchSalesperson('');
    setBatchDept('');
    setHasQueried(true);
    toast.success('查询完成', { description: `已查询到 ${rows.length} 条业绩归属数据` });
  };

  const resetPage = () => {
    setCompanyName('');
    setCustomerCode('');
    setCustomerName('');
    setSalesOrderNo('');
    setShippingReturnNo('');
    setProjectNo('');
    setProjectName('');
    setProductCodeFilter('');
    setProductNameFilter('');
    setDepartmentFilter('all');
    setSalespersonFilter('all');
    setDocTypeFilter('all');
    setBusinessTypeFilter('all');
    setProductSeriesFilter('all');
    setDateStart('');
    setDateEnd('');
    setResultRows([]);
    setSelectedKeys(new Set());
    setBatchSalesperson('');
    setBatchDept('');
    setHasQueried(false);
  };

  const handleReset = () => {
    if (hasQueried && resultRows.length > 0) {
      setResetConfirmOpen(true);
      return;
    }
    resetPage();
  };

  const updateAssignment = (
    id: string,
    field: 'assignedSalesperson' | 'assignedDept',
    value: string
  ) => {
    setResultRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const applyBatchAssignment = () => {
    if (!canBatchUpdate) {
      toast.info('请先勾选数据，并选择要批量修改的归属信息');
      return;
    }

    setResultRows((prev) =>
      prev.map((row) =>
        selectedKeys.has(row.id)
          ? {
              ...row,
              assignedSalesperson: batchSalesperson || row.assignedSalesperson,
              assignedDept: batchDept || row.assignedDept,
            }
          : row
      )
    );
    toast.success('批量修改完成', { description: `已更新 ${selectedCount} 条数据的归属信息` });
  };

  const submitAssignments = () => {
    if (resultRows.length === 0) {
      toast.info('请先查询需要配置的数据');
      return;
    }

    const resultMap = new Map(resultRows.map((row) => [row.id, row]));
    setSourceRows((prev) => prev.map((row) => resultMap.get(row.id) ?? row));
    toast.success('提交成功', { description: '业绩归属配置已保存' });
    resetPage();
  };

  const toggleAll = () => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        resultRows.forEach((row) => next.delete(row.id));
      } else {
        resultRows.forEach((row) => next.add(row.id));
      }
      return next;
    });
  };

  const toggleRow = (id: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="animate-fade-in space-y-5">
      <section className="rounded-card border border-[#E5E7EB] bg-white shadow-sm">
        <div className="border-b border-[#F3F4F6] px-5 py-4">
          <h2 className="text-base font-semibold text-[#111827]">业绩归属配置</h2>
          <div className="mt-3 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-[13px] leading-6 text-blue-900">
            <Info className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
            <div>
              按销售单、销货/退单和产品明细查询数据后，维护归属业务员与归属部门。请先设置查询条件并点击“查询”，系统带出数据行后，再按查询结果维护归属业务员和归属部门。
            </div>
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="grid grid-cols-6 gap-3">
            <Field label="客户名称">
              <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="客户名称" className="h-9 text-[13px]" />
            </Field>
            <Field label="客户编码">
              <Input value={customerCode} onChange={(event) => setCustomerCode(event.target.value)} placeholder="客户编码" className="h-9 text-[13px]" />
            </Field>
            <Field label="公司名称">
              <Input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="公司名称" className="h-9 text-[13px]" />
            </Field>
            <Field label="销售单号">
              <Input value={salesOrderNo} onChange={(event) => setSalesOrderNo(event.target.value)} placeholder="销售单号" className="h-9 text-[13px]" />
            </Field>
            <Field label="销货/退单号">
              <Input value={shippingReturnNo} onChange={(event) => setShippingReturnNo(event.target.value)} placeholder="销货/退单号" className="h-9 text-[13px]" />
            </Field>
            <SelectField label="单据类型名称" value={docTypeFilter} onChange={setDocTypeFilter} options={docTypes} />
            <Field label="项目编号">
              <Input value={projectNo} onChange={(event) => setProjectNo(event.target.value)} placeholder="项目编号" className="h-9 text-[13px]" />
            </Field>
            <Field label="项目名称">
              <Input value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="项目名称" className="h-9 text-[13px]" />
            </Field>
            <Field label="品号">
              <Input value={productCodeFilter} onChange={(event) => setProductCodeFilter(event.target.value)} placeholder="品号" className="h-9 text-[13px]" />
            </Field>
            <Field label="品名">
              <Input value={productNameFilter} onChange={(event) => setProductNameFilter(event.target.value)} placeholder="品名" className="h-9 text-[13px]" />
            </Field>
            <SelectField label="业务员部门名称" value={departmentFilter} onChange={(value) => {
              setDepartmentFilter(value);
              setSalespersonFilter('all');
            }} options={SHIPPING_DEPARTMENTS} />
            <SelectField label="业务员名称" value={salespersonFilter} onChange={setSalespersonFilter} options={filteredSalespersons} />
            <SelectField label="业务类型" value={businessTypeFilter} onChange={setBusinessTypeFilter} options={businessTypes} />
            <SelectField label="产品系列" value={productSeriesFilter} onChange={setProductSeriesFilter} options={productSeries} />
            <Field label="交易日期起">
              <input type="date" value={dateStart} onChange={(event) => setDateStart(event.target.value)} className="h-9 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-[13px] outline-none focus:border-[#1A56DB]" />
            </Field>
            <Field label="交易日期止">
              <input type="date" value={dateEnd} onChange={(event) => setDateEnd(event.target.value)} className="h-9 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-[13px] outline-none focus:border-[#1A56DB]" />
            </Field>
            <div className="col-span-4 flex items-end justify-end gap-2">
              <Button variant="outline" size="sm" className="h-9 px-4" onClick={handleReset}>重置</Button>
              <Button size="sm" className="h-9 px-5" onClick={queryRows}>查询</Button>
            </div>
          </div>
        </div>
      </section>

      {hasQueried && (
        <section className="rounded-card border border-[#E5E7EB] bg-white shadow-sm">
          <div className="border-b border-[#F3F4F6] px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedCount === 0}
                  onClick={() => setImportOpen(true)}
                  className="h-9 gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  导入更新
                </Button>
                <SelectBox label="批量修改归属业务员" value={batchSalesperson} onChange={setBatchSalesperson} options={salespersons} placeholder="不修改业务员" />
                <SelectBox label="批量修改归属部门" value={batchDept} onChange={setBatchDept} options={ownershipDepartmentOptions} placeholder="不修改部门" />
                <Button size="sm" className="h-9" disabled={!canBatchUpdate} onClick={applyBatchAssignment}>
                  确认批量修改
                </Button>
              </div>
              <Button
                size="sm"
                onClick={submitAssignments}
                className="h-9 gap-1.5 bg-[#D97706] px-5 text-white hover:bg-[#B45309]"
              >
                <Save className="h-3.5 w-3.5" />
                提交修改内容
              </Button>
            </div>
            <div className="mt-3 text-[12px] text-[#6B7280]">
              当前筛选 <span className="font-semibold text-primary">{resultRows.length}</span> 条，已选{' '}
              <span className="font-semibold text-primary">{selectedCount}</span> 条
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-max min-w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#F9FAFB] text-[#374151]">
                  <th className="sticky left-0 z-20 w-10 min-w-10 border-b border-[#E5E7EB] bg-[#F9FAFB] px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={toggleAll}
                    />
                  </th>
                  {[
                    '公司名称',
                    '客户编码',
                    '客户名称',
                    '交易日期',
                    '业务员部门名称',
                    '业务员名称',
                    '销售单号',
                    '销货/退单号',
                    '单据类型名称',
                    '品号',
                    '品名',
                    '规格',
                    '业务数量',
                    '单价',
                    '本币价税合计',
                    '备注',
                    '项目编号',
                    '项目名称',
                    '业务类型',
                    '产品系列',
                  ].map((header) => (
                    <th key={header} className="min-w-[120px] whitespace-nowrap border-b border-[#E5E7EB] px-3 py-3 text-left font-semibold">
                      {header}
                    </th>
                  ))}
                  <th className="sticky right-[180px] z-20 min-w-[180px] border-b border-l border-[#D8E5FF] bg-[#EEF4FF] px-3 py-3 text-left text-[#1D4ED8]">归属业务员</th>
                  <th className="sticky right-0 z-20 min-w-[180px] border-b border-l border-[#D8E5FF] bg-[#EEF4FF] px-3 py-3 text-left text-[#1D4ED8]">归属部门</th>
                </tr>
              </thead>
              <tbody>
                {resultRows.length === 0 ? (
                  <tr>
                    <td colSpan={23} className="px-5 py-12 text-center text-[13px] text-[#6B7280]">
                      未查询到符合条件的数据，请调整筛选条件后重试。
                    </td>
                  </tr>
                ) : (
                  resultRows.map((row) => (
                    <tr key={row.id} className={cn('border-b border-[#F3F4F6] hover:bg-[#F9FAFB]', selectedKeys.has(row.id) && 'bg-[#F3F7FF]')}>
                      <td className="sticky left-0 z-10 border-b border-[#F3F4F6] bg-inherit px-3 py-3 text-center">
                        <input type="checkbox" checked={selectedKeys.has(row.id)} onChange={() => toggleRow(row.id)} />
                      </td>
                      <TextCell>{row.companyName}</TextCell>
                      <TextCell>{row.customerCode}</TextCell>
                      <TextCell strong>{row.customerName}</TextCell>
                      <TextCell>{row.tradeDate}</TextCell>
                      <TextCell>{row.salesDeptName}</TextCell>
                      <TextCell>{row.salespersonName}</TextCell>
                      <TextCell>{row.salesOrderNo}</TextCell>
                      <TextCell>{row.shippingReturnNo}</TextCell>
                      <TextCell>{row.docTypeName}</TextCell>
                      <TextCell>{row.productCode}</TextCell>
                      <TextCell>{row.productName}</TextCell>
                      <TextCell>{row.specification}</TextCell>
                      <TextCell align="right">{row.quantity.toLocaleString('zh-CN')}</TextCell>
                      <TextCell align="right">{formatCurrency(row.unitPrice)}</TextCell>
                      <TextCell align="right">{formatCurrency(row.amountWithTax)}</TextCell>
                      <TextCell muted>{row.remark}</TextCell>
                      <TextCell>{row.projectNo}</TextCell>
                      <TextCell>{row.projectName}</TextCell>
                      <TextCell>{row.businessType}</TextCell>
                      <TextCell>{row.productSeries}</TextCell>
                      <td className="sticky right-[180px] z-10 border-b border-l border-[#D8E5FF] bg-[#F8FAFF] px-3 py-2 shadow-[-12px_0_18px_-18px_rgba(30,64,175,0.55)]">
                        <select value={row.assignedSalesperson} onChange={(event) => updateAssignment(row.id, 'assignedSalesperson', event.target.value)} className="h-8 w-full rounded-md border border-[#D1D5DB] bg-white px-2 text-[13px] outline-none focus:border-[#1A56DB]">
                          <option value="">未设置</option>
                          {salespersons.map((name) => <option key={name} value={name}>{name}</option>)}
                        </select>
                      </td>
                      <td className="sticky right-0 z-10 border-b border-l border-[#D8E5FF] bg-[#F8FAFF] px-3 py-2">
                        <select value={row.assignedDept} onChange={(event) => updateAssignment(row.id, 'assignedDept', event.target.value)} className="h-8 w-full rounded-md border border-[#D1D5DB] bg-white px-2 text-[13px] outline-none focus:border-[#1A56DB]">
                          <option value="">未设置</option>
                          {ownershipDepartmentOptions.map((department) => <option key={department.value} value={department.value}>{department.label}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-[430px]">
          <DialogHeader>
            <DialogTitle>导入更新</DialogTitle>
            <DialogDescription>
              可先下载已选数据模板，在本地维护归属业务员和归属部门后再导入系统。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => toast.success('模板已下载', { description: `已导出 ${selectedCount} 条待更新数据` })} className="gap-1.5">
              <Download className="h-4 w-4" />
              下载模板（{selectedCount}）
            </Button>
            <Button onClick={() => {
              toast.success('导入成功', { description: '归属业务员和归属部门已更新' });
              setImportOpen(false);
            }} className="gap-1.5">
              <Upload className="h-4 w-4" />
              导入数据
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>确认重置？</DialogTitle>
            <DialogDescription>
              点击“重置”会清空下面的查询结果，确认是否清空？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>
              取消
            </Button>
            <Button
              onClick={() => {
                resetPage();
                setResetConfirmOpen(false);
              }}
            >
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function contains(source: string, keyword: string) {
  return !keyword.trim() || source.toLowerCase().includes(keyword.trim().toLowerCase());
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[12px] text-[#6B7280]">{label}</label>
      {children}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-[13px] outline-none focus:border-[#1A56DB]">
        <option value="all">全部</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </Field>
  );
}

function SelectBox({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (value: string) => void; options: (string | { value: string; label: string })[]; placeholder: string }) {
  return (
    <div className="min-w-[180px]">
      <label className="mb-1 block text-[12px] text-[#6B7280]">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-full rounded-md border border-[#D1D5DB] bg-white px-3 text-[13px] outline-none focus:border-[#1A56DB]">
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
        })}
      </select>
    </div>
  );
}

function TextCell({ children, strong = false, muted = false, align = 'left' }: { children: React.ReactNode; strong?: boolean; muted?: boolean; align?: 'left' | 'right' }) {
  return (
    <td className={cn('min-w-[120px] whitespace-nowrap border-b border-[#F3F4F6] px-3 py-3', align === 'right' ? 'text-right' : 'text-left', strong && 'font-medium text-[#111827]', muted && 'text-[#6B7280]')}>
      {children}
    </td>
  );
}
