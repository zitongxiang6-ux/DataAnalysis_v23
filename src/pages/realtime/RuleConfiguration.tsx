import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type RuleStatus = 'assigned' | 'unassigned';

interface SalesOrderRuleRow {
  id: string;
  companyName: string;
  customerCode: string;
  customerName: string;
  salesDeptName: string;
  salespersonName: string;
  tradeDate: string;
  documentDate: string;
  auditDate: string;
  salesOrderNo: string;
  shippingReturnNo: string;
  docType: string;
  remark: string;
  projectNo: string;
  projectName: string;
  creatorName: string;
  provinceCategoryDesc: string;
  assignedSalesperson?: string;
  assignedDept?: string;
}

const departments = [
  '销售一部',
  '销售二部',
  '销售三部',
  '渠道部',
  '大客户部',
  '电商部',
  '国际酒店部',
];

const salespersons = [
  '张三',
  '李华',
  '王芳',
  '赵强',
  '刘敏',
  '陈杰',
  '杨丽',
  '黄磊',
  '周涛',
  '吴静',
];

const docTypes = ['销货单', '销退单', '换货单'];
const regions = ['国内渠道客户', '国际渠道客户', '国内重点渠道商', '国际重点渠道商', 'ODM客户', '地产客户'];
const customers = ['广州科技', '深圳光明', '北京宏远', '上海信达', '杭州智联', '成都华盛', '武汉天成', '南京瑞景', '西安宏图', '重庆新兴'];

const initialOrders: SalesOrderRuleRow[] = Array.from({ length: 36 }, (_, index) => {
  const customer = customers[index % customers.length];
  const dept = departments[index % departments.length];
  const salesperson = salespersons[index % salespersons.length];
  const docType = docTypes[index % docTypes.length];
  const month = (index % 5) + 1;
  const day = String((index % 24) + 1).padStart(2, '0');
  const hasAssignment = index % 4 !== 1;

  return {
    id: `SO-RULE-${String(index + 1).padStart(3, '0')}`,
    companyName: index % 3 === 0 ? '河东科技' : '河东智能',
    customerCode: `C${String(1000 + index).padStart(4, '0')}`,
    customerName: customer,
    salesDeptName: dept,
    salespersonName: salesperson,
    tradeDate: `2026-${String(month).padStart(2, '0')}-${day}`,
    documentDate: `2026-${String(month).padStart(2, '0')}-${day}`,
    auditDate: `2026-${String(month).padStart(2, '0')}-${String(Number(day) + 1).padStart(2, '0')}`,
    salesOrderNo: `SO-2026-${String(8000 + index)}`,
    shippingReturnNo: `${docType === '销退单' ? 'RT' : 'SH'}-2026-${String(6000 + index)}`,
    docType,
    remark: index % 5 === 0 ? '跨部门项目，需指定统计归属' : index % 6 === 0 ? '项目报备客户' : '-',
    projectNo: `PRJ-${String(202600 + index)}`,
    projectName: index % 4 === 0 ? '酒店智能化项目' : index % 4 === 1 ? '渠道样板间项目' : index % 4 === 2 ? '地产精装项目' : '年度框架订单',
    creatorName: salespersons[(index + 2) % salespersons.length],
    provinceCategoryDesc: regions[index % regions.length],
    assignedSalesperson: hasAssignment ? salesperson : undefined,
    assignedDept: hasAssignment ? dept : undefined,
  };
});

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export default function RuleConfiguration() {
  const [orders, setOrders] = useState<SalesOrderRuleRow[]>(initialOrders);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [keyword, setKeyword] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');
  const [docTypeFilter, setDocTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | RuleStatus>('all');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [batchSalesperson, setBatchSalesperson] = useState('');
  const [batchDept, setBatchDept] = useState('');

  const filteredOrders = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return orders.filter((order) => {
      const status: RuleStatus = order.assignedSalesperson || order.assignedDept ? 'assigned' : 'unassigned';
      const keywordHit =
        !normalizedKeyword ||
        [
          order.companyName,
          order.customerCode,
          order.customerName,
          order.salesDeptName,
          order.salespersonName,
          order.salesOrderNo,
          order.shippingReturnNo,
          order.projectNo,
          order.projectName,
          order.creatorName,
          order.provinceCategoryDesc,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedKeyword);

      return (
        keywordHit &&
        (deptFilter === 'all' || order.salesDeptName === deptFilter) &&
        (salespersonFilter === 'all' || order.salespersonName === salespersonFilter) &&
        (docTypeFilter === 'all' || order.docType === docTypeFilter) &&
        (regionFilter === 'all' || order.provinceCategoryDesc === regionFilter) &&
        (statusFilter === 'all' || status === statusFilter) &&
        (!dateStart || order.tradeDate >= dateStart) &&
        (!dateEnd || order.tradeDate <= dateEnd)
      );
    });
  }, [orders, keyword, deptFilter, salespersonFilter, docTypeFilter, regionFilter, statusFilter, dateStart, dateEnd]);

  const selectedOrders = useMemo(
    () => orders.filter((order) => selectedKeys.has(order.id)),
    [orders, selectedKeys]
  );

  const targetRows = selectedOrders;
  const canConfirmAssignment = selectedKeys.size > 0 && Boolean(batchSalesperson || batchDept);
  const allFilteredSelected =
    filteredOrders.length > 0 && filteredOrders.every((order) => selectedKeys.has(order.id));
  const someFilteredSelected =
    filteredOrders.some((order) => selectedKeys.has(order.id)) && !allFilteredSelected;

  const toggleSelectAllFiltered = () => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredOrders.forEach((order) => next.delete(order.id));
      } else {
        filteredOrders.forEach((order) => next.add(order.id));
      }
      return next;
    });
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

  const resetFilters = () => {
    setKeyword('');
    setDeptFilter('all');
    setSalespersonFilter('all');
    setDocTypeFilter('all');
    setRegionFilter('all');
    setStatusFilter('all');
    setDateStart('');
    setDateEnd('');
  };

  const applyBatchAssignment = () => {
    if (targetRows.length === 0) {
      toast.info('请先勾选需要设置归属的销货单');
      return;
    }
    if (!batchSalesperson && !batchDept) {
      toast.info('请选择归属业务员或归属部门');
      return;
    }

    const targetIds = new Set(targetRows.map((row) => row.id));
    setOrders((prev) =>
      prev.map((order) =>
        targetIds.has(order.id)
          ? {
              ...order,
              assignedSalesperson: batchSalesperson || order.assignedSalesperson,
              assignedDept: batchDept || order.assignedDept,
            }
          : order
      )
    );
    toast.success(`已更新 ${targetRows.length} 条归属规则`);
  };

  const clearBatchAssignment = () => {
    if (targetRows.length === 0) {
      toast.info('请先勾选需要清空归属的销货单');
      return;
    }

    const targetIds = new Set(targetRows.map((row) => row.id));
    setOrders((prev) =>
      prev.map((order) =>
        targetIds.has(order.id)
          ? { ...order, assignedSalesperson: undefined, assignedDept: undefined }
          : order
      )
    );
    toast.success(`已清空 ${targetRows.length} 条指定归属`);
  };

  const updateSingleAssignment = (
    id: string,
    field: 'assignedSalesperson' | 'assignedDept',
    value: string
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, [field]: value || undefined } : order
      )
    );
  };

  return (
    <div className="animate-fade-in space-y-4">
      <section className="bg-white border border-[#E5E7EB] rounded-card shadow-sm">
        <div className="px-5 py-4 border-b border-[#F3F4F6]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-[#111827]">销货单统计归属规则</h2>
              <p className="mt-1 text-[12px] text-[#6B7280]">
                通过筛选定位销货单，再批量指定统计归属业务员和归属部门。
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-6 gap-3">
            <div className="col-span-2">
              <label className="mb-1 block text-[12px] text-[#6B7280]">快速搜索</label>
              <Input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="客户、单号、项目、创建人"
                className="h-9 text-[13px]"
              />
            </div>
            <SelectField label="原业务部门" value={deptFilter} onChange={setDeptFilter} options={departments} />
            <SelectField label="原业务员" value={salespersonFilter} onChange={setSalespersonFilter} options={salespersons} />
            <SelectField label="单据类型" value={docTypeFilter} onChange={setDocTypeFilter} options={docTypes} />
            <SelectField label="客户属性" value={regionFilter} onChange={setRegionFilter} options={unique(regions)} />
            <div>
              <label className="mb-1 block text-[12px] text-[#6B7280]">交易日期起</label>
              <input
                type="date"
                value={dateStart}
                onChange={(event) => setDateStart(event.target.value)}
                className="h-9 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-[13px] outline-none focus:border-[#1A56DB]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] text-[#6B7280]">交易日期止</label>
              <input
                type="date"
                value={dateEnd}
                onChange={(event) => setDateEnd(event.target.value)}
                className="h-9 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-[13px] outline-none focus:border-[#1A56DB]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] text-[#6B7280]">设置状态</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as 'all' | RuleStatus)}
                className="h-9 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-[13px] outline-none focus:border-[#1A56DB]"
              >
                <option value="all">全部状态</option>
                <option value="assigned">已指定</option>
                <option value="unassigned">未设置</option>
              </select>
            </div>
            <div className="col-start-6 flex items-end justify-end gap-2">
              <Button variant="outline" size="sm" className="h-9 px-4" onClick={resetFilters}>
                重置
              </Button>
              <Button size="sm" className="h-9 px-4" onClick={() => toast.success('查询完成')}>
                查询
              </Button>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-[#E5E7EB] bg-[#F8FAFC]">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[170px]">
              <label className="mb-1 block text-[12px] text-[#6B7280]">批量归属业务员</label>
              <select
                value={batchSalesperson}
                onChange={(event) => setBatchSalesperson(event.target.value)}
                className="h-9 w-full rounded-md border border-[#D1D5DB] bg-white px-3 text-[13px] outline-none focus:border-[#1A56DB]"
              >
                <option value="">不修改业务员</option>
                {salespersons.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[170px]">
              <label className="mb-1 block text-[12px] text-[#6B7280]">批量归属部门</label>
              <select
                value={batchDept}
                onChange={(event) => setBatchDept(event.target.value)}
                className="h-9 w-full rounded-md border border-[#D1D5DB] bg-white px-3 text-[13px] outline-none focus:border-[#1A56DB]"
              >
                <option value="">不修改部门</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <Button size="sm" className="h-9" disabled={!canConfirmAssignment} onClick={applyBatchAssignment}>
              确认指定归属
            </Button>
            <Button variant="outline" size="sm" className="h-9" onClick={clearBatchAssignment}>
              清空指定归属
            </Button>
            <span className="ml-auto text-[12px] text-[#6B7280]">
              当前筛选 <span className="font-semibold text-[#1A56DB]">{filteredOrders.length}</span> 条，
              已选 <span className="font-semibold text-[#1A56DB]">{selectedKeys.size}</span> 条
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-max min-w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F9FAFB] text-[#374151]">
                <th className="sticky left-0 z-20 w-10 min-w-10 border-b border-[#E5E7EB] bg-[#F9FAFB] px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someFilteredSelected;
                    }}
                    onChange={toggleSelectAllFiltered}
                  />
                </th>
                {[
                  '公司名称',
                  '客户编号',
                  '客户名称',
                  '业务员部门名称',
                  '业务员名称',
                  '交易日期',
                  '单据日期',
                  '审核日期',
                  '销售单号',
                  '销货/退单号',
                  '单据类型',
                  '备注',
                  '项目编号',
                  '项目名称',
                  '创建人名称',
                  '省分类/国外客户大区属性描述',
                ].map((header) => (
                  <th key={header} className="min-w-[120px] border-b border-[#E5E7EB] px-3 py-3 text-left font-semibold whitespace-nowrap">
                    {header}
                  </th>
                ))}
                <th className="sticky right-[180px] z-20 min-w-[180px] border-b border-l border-[#D8E5FF] bg-[#EEF4FF] px-3 py-3 text-left text-[#1D4ED8]">
                  指定归属业务员
                </th>
                <th className="sticky right-0 z-20 min-w-[180px] border-b border-l border-[#D8E5FF] bg-[#EEF4FF] px-3 py-3 text-left text-[#1D4ED8]">
                  指定归属部门
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isSelected = selectedKeys.has(order.id);

                return (
                  <tr
                    key={order.id}
                    className={cn(
                      'border-b border-[#F3F4F6] hover:bg-[#F9FAFB]',
                      isSelected && 'bg-[#F3F7FF]'
                    )}
                  >
                    <td className="sticky left-0 z-10 border-b border-[#F3F4F6] bg-inherit px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(order.id)}
                      />
                    </td>
                    <TextCell>{order.companyName}</TextCell>
                    <TextCell>{order.customerCode}</TextCell>
                    <TextCell strong>{order.customerName}</TextCell>
                    <TextCell>{order.salesDeptName}</TextCell>
                    <TextCell>{order.salespersonName}</TextCell>
                    <TextCell>{order.tradeDate}</TextCell>
                    <TextCell>{order.documentDate}</TextCell>
                    <TextCell>{order.auditDate}</TextCell>
                    <TextCell>{order.salesOrderNo}</TextCell>
                    <TextCell>{order.shippingReturnNo}</TextCell>
                    <TextCell>
                      <span className={cn(
                        'rounded px-1.5 py-0.5 text-[12px]',
                        order.docType === '销退单'
                          ? 'bg-[#FEE2E2] text-[#B91C1C]'
                          : 'bg-[#E0F2FE] text-[#075985]'
                      )}>
                        {order.docType}
                      </span>
                    </TextCell>
                    <TextCell muted>{order.remark}</TextCell>
                    <TextCell>{order.projectNo}</TextCell>
                    <TextCell>{order.projectName}</TextCell>
                    <TextCell>{order.creatorName}</TextCell>
                    <TextCell>{order.provinceCategoryDesc}</TextCell>
                    <td className="sticky right-[180px] z-10 border-b border-l border-[#D8E5FF] bg-[#F8FAFF] px-3 py-2 shadow-[-12px_0_18px_-18px_rgba(30,64,175,0.55)]">
                      <select
                        value={order.assignedSalesperson || ''}
                        onChange={(event) => updateSingleAssignment(order.id, 'assignedSalesperson', event.target.value)}
                        className="h-8 w-full rounded-md border border-[#D1D5DB] bg-white px-2 text-[13px] outline-none focus:border-[#1A56DB]"
                      >
                        <option value="">未设置</option>
                        {salespersons.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="sticky right-0 z-10 border-b border-l border-[#D8E5FF] bg-[#F8FAFF] px-3 py-2">
                      <select
                        value={order.assignedDept || ''}
                        onChange={(event) => updateSingleAssignment(order.id, 'assignedDept', event.target.value)}
                        className="h-8 w-full rounded-md border border-[#D1D5DB] bg-white px-2 text-[13px] outline-none focus:border-[#1A56DB]"
                      >
                        <option value="">未设置</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 text-[12px] text-[#6B7280]">
          <span>规则优先级：手动指定归属优先于销货单原业务员和原业务部门。</span>
        </div>
      </section>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-[12px] text-[#6B7280]">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-[13px] outline-none focus:border-[#1A56DB]"
      >
        <option value="all">全部</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function TextCell({
  children,
  strong = false,
  muted = false,
}: {
  children: ReactNode;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={cn(
        'min-w-[120px] border-b border-[#F3F4F6] px-3 py-3 whitespace-nowrap',
        strong && 'font-medium text-[#111827]',
        muted && 'text-[#6B7280]'
      )}
    >
      {children}
    </td>
  );
}
