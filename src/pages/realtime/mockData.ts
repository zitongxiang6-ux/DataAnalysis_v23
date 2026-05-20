import { DEPARTMENTS, SALESPERSON_NAMES, DEALER_NAMES, CUSTOMER_NAMES } from '@/lib/mockData';

export const REALTIME_TIMESTAMP = '2026-05-14 19:00';

// ===== Tab 1: Department Shipping =====
export interface DeptShippingRow {
  id: string;
  department: string;
  salesperson: string;
  shippingAmount: number;
  targetAmount: number;
  completionRate: number;
  yoyGrowth: number;
  openOrderValue: number;
  isLive: boolean;
  sparkline: number[];
}

export function getDeptShippingData(): DeptShippingRow[] {
  return DEPARTMENTS.map((dept, i) => ({
    id: `DS${i + 1}`,
    department: dept,
    salesperson: SALESPERSON_NAMES[i % SALESPERSON_NAMES.length],
    shippingAmount: Math.floor(Math.random() * 600000) + 150000,
    targetAmount: Math.floor(Math.random() * 800000) + 300000,
    completionRate: +(Math.random() * 30 + 65).toFixed(1),
    yoyGrowth: +(Math.random() * 20 - 3).toFixed(1),
    openOrderValue: Math.floor(Math.random() * 250000) + 30000,
    isLive: Math.random() > 0.4,
    sparkline: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50000) + 20000),
  }));
}

export interface CustomerDetail {
  id: string;
  name: string;
  shippingAmount: number;
  orderCount: number;
  lastOrderTime: string;
  status: 'completed' | 'processing' | 'pending';
}

export function getCustomerDetail(salesperson: string): CustomerDetail[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `CUST${i + 1}`,
    name: CUSTOMER_NAMES[(i + SALESPERSON_NAMES.indexOf(salesperson)) % CUSTOMER_NAMES.length],
    shippingAmount: Math.floor(Math.random() * 150000) + 20000,
    orderCount: Math.floor(Math.random() * 30) + 3,
    lastOrderTime: `2026-05-14 ${String(10 + i).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    status: ['completed', 'processing', 'pending'][Math.floor(Math.random() * 3)] as CustomerDetail['status'],
  }));
}

export const deptShippingKpis = {
  totalShipping: 892400,
  completionRate: 82.6,
  yoyComparison: 12.3,
  openOrders: 1234500,
};

export function getIntradayTrendData() {
  const data = [];
  for (let h = 0; h <= 19; h++) {
    data.push({
      hour: `${String(h).padStart(2, '0')}:00`,
      today: Math.floor(Math.random() * 50000) + 30000 + h * 25000,
      yesterday: Math.floor(Math.random() * 40000) + 25000 + h * 22000,
    });
  }
  return data;
}

// ===== Tab 2: Channel Dealer =====
const CUSTOMER_TYPES = [
  '国际渠道商',
  '国内渠道商',
  'ODM客户',
  '国际重点渠道商',
  '国内重点渠道商',
  '国际发展组客户',
  '国内地产客户',
];

export interface ChannelDealerRow {
  id: string;
  name: string;
  department: string;
  salesperson: string;
  channelType: string;
  signingAmount: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may?: number;
  jun?: number;
  jul?: number;
  aug?: number;
  sep?: number;
  oct?: number;
  nov?: number;
  dec?: number;
  totalJanApr: number;
  completionRate: number;
  yoyDiff: number;
  yoyGrowth: number;
}

export function getChannelDealerData(): ChannelDealerRow[] {
  return DEALER_NAMES.map((name, i) => {
    const jan = +(Math.random() * 600000 - 100000).toFixed(2);
    const feb = +(Math.random() * 600000 - 50000).toFixed(2);
    const mar = +(Math.random() * 600000).toFixed(2);
    const apr = +(Math.random() * 600000 - 30000).toFixed(2);
    const totalJanApr = +(jan + feb + mar + apr).toFixed(2);
    const target = Math.abs(totalJanApr) * (1.2 + Math.random() * 0.8);
    const signingAmount = +(Math.abs(totalJanApr) * (1.05 + Math.random() * 0.45)).toFixed(2);
    return {
      id: `CD${i + 1}`,
      name,
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      salesperson: SALESPERSON_NAMES[i % SALESPERSON_NAMES.length],
      channelType: CUSTOMER_TYPES[i % CUSTOMER_TYPES.length],
      signingAmount,
      jan,
      feb,
      mar,
      apr,
      totalJanApr,
      completionRate: target > 0 ? +((totalJanApr / target) * 100).toFixed(2) : 0,
      yoyDiff: +(Math.random() * 200000 - 100000).toFixed(2),
      yoyGrowth: +(Math.random() * 200 - 100).toFixed(2),
    };
  });
}

export const channelDealerKpis = {
  dealerCount: 28,
  totalShipping: 4567800,
  avgCompletionRate: 78.4,
  openOrders: 2345600,
};

export function getTopDealerChartData() {
  return DEALER_NAMES.slice(0, 8).map((name) => ({
    name: name.length > 4 ? name.slice(0, 4) : name,
    fullName: name,
    shippingAmount: Math.floor(Math.random() * 500000) + 150000,
    signingAmount: Math.floor(Math.random() * 700000) + 200000,
    completionRate: +(Math.random() * 25 + 65).toFixed(1),
  }));
}

export interface OrderDetail {
  id: string;
  customerName: string;
  amount: number;
  orderTime: string;
  product: string;
  status: 'completed' | 'processing' | 'pending';
}

export function getOrderDetail(dealerName: string): OrderDetail[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `ORD${String(i + 1).padStart(4, '0')}`,
    customerName: CUSTOMER_NAMES[(i + DEALER_NAMES.indexOf(dealerName)) % CUSTOMER_NAMES.length],
    amount: Math.floor(Math.random() * 80000) + 10000,
    orderTime: `2026-05-14 ${String(14 + i).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    product: ['KNX网关', '智能面板', '温控器', '传感器', '执行器'][i % 5],
    status: ['completed', 'processing', 'pending'][Math.floor(Math.random() * 3)] as OrderDetail['status'],
  }));
}

export interface LiveTransaction {
  id: string;
  customer: string;
  amount: number;
  dealer: string;
  time: string;
}

export function getLiveTransactions(): LiveTransaction[] {
  return [
    { id: 'LT1', customer: '万科地产', amount: 45200, dealer: '广州科技', time: '2分钟前' },
    { id: 'LT2', customer: '保利地产', amount: 28300, dealer: '深圳光明', time: '5分钟前' },
    { id: 'LT3', customer: '龙湖地产', amount: 67800, dealer: '北京宏远', time: '8分钟前' },
    { id: 'LT4', customer: '碧桂园集团', amount: 31500, dealer: '上海信达', time: '12分钟前' },
    { id: 'LT5', customer: '中海地产', amount: 52100, dealer: '杭州智联', time: '18分钟前' },
  ];
}

// ===== Tab 3: Quarterly Target =====
export interface QuarterData {
  quarter: string;
  target: number;
  actual: number;
  completionRate: number;
  diff: number;
}

export function getQuarterlyData(): QuarterData[] {
  return [
    { quarter: 'Q1', target: 5000000, actual: 4850000, completionRate: 97.0, diff: 150000 },
    { quarter: 'Q2', target: 5500000, actual: 5120000, completionRate: 93.1, diff: 380000 },
    { quarter: 'Q3', target: 6000000, actual: 6240000, completionRate: 104.0, diff: -240000 },
    { quarter: 'Q4', target: 6500000, actual: 4890000, completionRate: 75.2, diff: 1610000 },
  ];
}

export function getQuarterlyTrendData() {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  return months.map((month, i) => ({
    month,
    target: Math.floor(1600000 + i * 50000),
    actual: Math.floor(1400000 + i * 80000 + Math.random() * 200000),
    cumulative: Math.floor((1400000 + i * 80000) * (i + 1) * 0.85),
  }));
}

export interface DeptQuarterlyRow {
  department: string;
  q1Target: number;
  q1Actual: number;
  q2Target: number;
  q2Actual: number;
  q3Target: number;
  q3Actual: number;
  q4Target: number;
  q4Actual: number;
}

export function getDeptQuarterlyData(): DeptQuarterlyRow[] {
  return DEPARTMENTS.map((dept) => ({
    department: dept,
    q1Target: Math.floor(Math.random() * 800000) + 400000,
    q1Actual: Math.floor(Math.random() * 900000) + 300000,
    q2Target: Math.floor(Math.random() * 900000) + 500000,
    q2Actual: Math.floor(Math.random() * 1000000) + 400000,
    q3Target: Math.floor(Math.random() * 1000000) + 600000,
    q3Actual: Math.floor(Math.random() * 1100000) + 500000,
    q4Target: Math.floor(Math.random() * 1100000) + 700000,
    q4Actual: Math.floor(Math.random() * 1200000) + 400000,
  }));
}

export const todayImpact = {
  amount: 892400,
  contribution: 1.8,
  projectedCompletion: 82.4,
};

// ===== Tab 4: Rebate Calculation =====
export interface RebateOrder {
  id: string;
  customerName: string;
  contractAmount: number;
  toCheckAmount: number;
  excludedAmount: number;
  effectiveAmount: number;
  rebateRatio: number;
  rebateAmount: number;
  isExcluded: boolean;
}

export function getRebateOrders(): RebateOrder[] {
  return Array.from({ length: 10 }, (_, i) => {
    const contractAmount = Math.floor(Math.random() * 500000) + 50000;
    const toCheckAmount = Math.floor(contractAmount * 0.05);
    const excludedAmount = Math.random() > 0.7 ? Math.floor(contractAmount * 0.1) : 0;
    const effectiveAmount = contractAmount - toCheckAmount - excludedAmount;
    const rebateRatio = contractAmount >= 300000 ? 0.03 : 0.02;
    return {
      id: `RO${i + 1}`,
      customerName: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
      contractAmount,
      toCheckAmount,
      excludedAmount,
      effectiveAmount,
      rebateRatio,
      rebateAmount: Math.floor(effectiveAmount * rebateRatio),
      isExcluded: false,
    };
  });
}

export interface RebateSummary {
  totalContract: number;
  totalExcluded: number;
  totalEffective: number;
  totalRebate: number;
}

export function getRebateSummary(orders: RebateOrder[]): RebateSummary {
  return orders.reduce(
    (acc, o) => {
      if (o.isExcluded) {
        acc.totalExcluded += o.contractAmount;
      } else {
        acc.totalContract += o.contractAmount;
        acc.totalExcluded += o.excludedAmount;
        acc.totalEffective += o.effectiveAmount;
        acc.totalRebate += o.rebateAmount;
      }
      return acc;
    },
    { totalContract: 0, totalExcluded: 0, totalEffective: 0, totalRebate: 0 }
  );
}

// ===== Tab 5: Rule Configuration =====
export interface SalespersonRule {
  id: string;
  customerCode: string;
  customerName: string;
  dateRange: string;
  orderNo: string;
  originalSalesperson: string;
  assignedSalesperson: string;
  assignedDept: string;
  effectiveTime: string;
}

export function getSalespersonRules(): SalespersonRule[] {
  return [
    { id: 'R1', customerCode: 'C1001', customerName: '恒大地产', dateRange: '2026-01-01 ~ 2026-12-31', orderNo: 'ORD-DOM-*', originalSalesperson: '张伟', assignedSalesperson: '李华', assignedDept: '销售一部', effectiveTime: '2026-01-01' },
    { id: 'R2', customerCode: 'C1002', customerName: '万科地产', dateRange: '2026-01-01 ~ 2026-06-30', orderNo: 'ORD-INT-*', originalSalesperson: '王芳', assignedSalesperson: '赵强', assignedDept: '销售二部', effectiveTime: '2026-01-15' },
    { id: 'R3', customerCode: 'C1003', customerName: '保利地产', dateRange: '2026-03-01 ~ 2026-09-30', orderNo: 'ORD-OEM-*', originalSalesperson: '刘敏', assignedSalesperson: '陈杰', assignedDept: '渠道部', effectiveTime: '2026-03-01' },
    { id: 'R4', customerCode: 'C1004', customerName: '碧桂园集团', dateRange: '2026-02-01 ~ 2026-08-31', orderNo: 'ORD-KNX-*', originalSalesperson: '杨丽', assignedSalesperson: '黄磊', assignedDept: '大客户部', effectiveTime: '2026-02-15' },
    { id: 'R5', customerCode: 'C1005', customerName: '龙湖地产', dateRange: '2026-04-01 ~ 2026-12-31', orderNo: 'ORD-DOM-VIP-*', originalSalesperson: '周涛', assignedSalesperson: '吴静', assignedDept: '销售一部', effectiveTime: '2026-04-01' },
    { id: 'R6', customerCode: 'C1006', customerName: '中海地产', dateRange: '2026-05-01 ~ 2026-11-30', orderNo: 'ORD-INT-VIP-*', originalSalesperson: '张三', assignedSalesperson: '李华', assignedDept: '电商部', effectiveTime: '2026-05-01' },
  ];
}

// ===== Manual Review - Full Check Orders =====
export interface FullCheckOrder {
  id: string;
  customerNo: string;
  customerName: string;
  tradeDate: string;
  deptName: string;
  salespersonName: string;
  saleOrderNo: string;
  returnOrderNo: string;
  docType: string;
  itemNo: string;
  itemName: string;
  spec: string;
  productModel: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  remark: string;
  projectNo: string;
  projectName: string;
  businessType: string;
  productSeries: string;
  status: 'unchecked' | 'valid' | 'excluded';
}

export function getFullCheckOrders(customerName: string): FullCheckOrder[] {
  const products = [
    { itemNo: 'KNX-GW-001', itemName: 'KNX网关', spec: '标准版', model: 'GW-2024A', series: 'KNX网关' },
    { itemNo: 'KNX-SP-002', itemName: '智能面板', spec: '触控屏', model: 'SP-7PRO', series: '智能面板' },
    { itemNo: 'KNX-TC-003', itemName: '温控器', spec: '无线版', model: 'TC-W300', series: '温控器' },
    { itemNo: 'KNX-SN-004', itemName: '传感器', spec: '多功能', model: 'SN-M200', series: '传感器' },
    { itemNo: 'KNX-SW-005', itemName: '智能开关', spec: '单火版', model: 'SW-S100', series: '智能开关' },
    { itemNo: 'KNX-AC-006', itemName: '执行器', spec: '8路', model: 'AC-8CH', series: '执行器' },
    { itemNo: 'KNX-RL-007', itemName: '继电器', spec: '16A', model: 'RL-16A', series: '继电器' },
    { itemNo: 'KNX-MD-008', itemName: 'KNX模块', spec: '输入输出', model: 'MD-IO16', series: 'KNX模块' },
  ];
  const salespeople = ['张伟', '李明', '王芳', '刘强', '陈静'];
  const depts = ['销售一部', '销售二部', '渠道部', '大客户部'];
  const projects = [
    { no: 'PRJ-2026-001', name: '恒大智慧社区项目' },
    { no: 'PRJ-2026-002', name: '万科智能家居项目' },
    { no: 'PRJ-2026-003', name: '保利酒店智能化项目' },
    { no: 'PRJ-2026-004', name: '绿地商业中心项目' },
  ];
  const remarks = [
    '该订单为样品发货，需确认是否计入返点',
    '客户要求延期付款，建议暂缓计入',
    '属渠道分销订单，按规则应剔除',
    '价格低于标准价15%，需业务确认',
    '重复下单，可能为上期补单',
    '项目试验订单，金额较小可计入',
    '属工程样板单，建议剔除',
    'VIP客户特价订单，需审批',
    '跨区销售订单，待确认归属',
    '该客户为季度新客户，首单计入',
  ];
  return Array.from({ length: 15 }, (_, i) => {
    const product = products[i % products.length];
    const qty = Math.floor(Math.random() * 50) + 1;
    const price = Math.floor(Math.random() * 500) + 50;
    const proj = projects[i % projects.length];
    return {
      id: `FO${String(i + 1).padStart(3, '0')}`,
      customerNo: `CUST-${String(1000 + i).padStart(4, '0')}`,
      customerName,
      tradeDate: `2026-0${(i % 3) + 1}-${String(10 + (i % 20)).padStart(2, '0')}`,
      deptName: depts[i % depts.length],
      salespersonName: salespeople[i % salespeople.length],
      saleOrderNo: `SO-2026-${String(1000 + i).padStart(4, '0')}`,
      returnOrderNo: i % 5 === 0 ? `RO-2026-${String(500 + i).padStart(4, '0')}` : '-',
      docType: i % 5 === 0 ? '销退单' : '销货单',
      itemNo: product.itemNo,
      itemName: product.itemName,
      spec: product.spec,
      productModel: product.model,
      quantity: qty,
      unitPrice: price,
      amount: qty * price,
      remark: remarks[i % remarks.length],
      projectNo: proj.no,
      projectName: proj.name,
      businessType: i % 3 === 0 ? '直销' : i % 3 === 1 ? '分销' : '工程',
      productSeries: product.series,
      status: 'unchecked' as const,
    };
  });
}

export interface DepartmentRule {
  id: string;
  deptName: string;
  defaultStatMethod: string;
  customRule: string;
  effectiveTime: string;
}

export function getDepartmentRules(): DepartmentRule[] {
  return [
    { id: 'DR1', deptName: '销售一部', defaultStatMethod: '按签约归属', customRule: '大客户订单归大客户部', effectiveTime: '2026-01-01' },
    { id: 'DR2', deptName: '销售二部', defaultStatMethod: '按出货归属', customRule: '无', effectiveTime: '2026-01-01' },
    { id: 'DR3', deptName: '渠道部', defaultStatMethod: '按签约归属', customRule: '渠道订单100%归属', effectiveTime: '2026-03-01' },
    { id: 'DR4', deptName: '大客户部', defaultStatMethod: '按客户归属', customRule: 'VIP客户优先分配', effectiveTime: '2026-02-15' },
  ];
}

// ===== Customer Quarterly Completion =====
export interface CustomerQuarterlyRow {
  customerName: string;
  department: string;
  customerType: string;
  salesperson: string;
  annualTarget: number;
  q1Actual: number;
  q1Target: number;
  q2Actual: number;
  q2Target: number;
  q3Actual: number;
  q3Target: number;
  q4Actual: number;
  q4Target: number;
}

export function getCustomerQuarterlyData(): CustomerQuarterlyRow[] {
  const customers = [
    { name: '恒大地产', dept: '销售一部', type: '国内地产客户', sales: '张三' },
    { name: '万科地产', dept: '销售一部', type: '国内渠道商', sales: '李华' },
    { name: '保利地产', dept: '销售二部', type: 'ODM客户', sales: '王芳' },
    { name: '碧桂园集团', dept: '销售二部', type: '国际渠道商', sales: '赵强' },
    { name: '龙湖地产', dept: '渠道部', type: '国内重点渠道商', sales: '刘敏' },
    { name: '中海地产', dept: '大客户部', type: '国际重点渠道商', sales: '陈杰' },
    { name: '华润置地', dept: '大客户部', type: '国际发展组客户', sales: '杨丽' },
    { name: '绿城中国', dept: '销售一部', type: '国内地产客户', sales: '黄磊' },
    { name: '融创中国', dept: '销售三部', type: '国内渠道商', sales: '周涛' },
    { name: '招商蛇口', dept: '销售三部', type: 'ODM客户', sales: '吴静' },
    { name: '金地集团', dept: '渠道部', type: '国际渠道商', sales: '张三' },
    { name: '华夏幸福', dept: '销售一部', type: '国内重点渠道商', sales: '李华' },
  ];

  return customers.map((c) => {
    const annualTarget = [2000000, 1800000, 1500000, 1600000, 1200000, 2200000, 1400000, 1000000, 900000, 1100000, 800000, 950000][customers.indexOf(c)];
    const q1Target = Math.floor(annualTarget * 0.15);
    const q2Target = Math.floor(annualTarget * 0.25);
    const q3Target = Math.floor(annualTarget * 0.30);
    const q4Target = Math.floor(annualTarget * 0.30);
    return {
      customerName: c.name,
      department: c.dept,
      customerType: c.type,
      salesperson: c.sales,
      annualTarget,
      q1Actual: Math.floor(q1Target * (0.7 + Math.random() * 0.5)),
      q1Target,
      q2Actual: Math.floor(q2Target * (0.7 + Math.random() * 0.5)),
      q2Target,
      q3Actual: Math.floor(q3Target * (0.7 + Math.random() * 0.5)),
      q3Target,
      q4Actual: Math.floor(q4Target * (0.7 + Math.random() * 0.5)),
      q4Target,
    };
  });
}

// Colors for quarter progress
export function getQuarterColor(rate: number): { bg: string; text: string; bar: string } {
  if (rate >= 95) return { bg: 'bg-success-light', text: 'text-success', bar: 'bg-success' };
  if (rate >= 80) return { bg: 'bg-warning-light', text: 'text-warning', bar: 'bg-warning' };
  return { bg: 'bg-danger-light', text: 'text-danger', bar: 'bg-danger' };
}

// ===== Tab 6: Salesperson Monthly Target =====
export interface SalespersonMonthData {
  initialTarget: number;
  actualTarget: number;
  actualOrder: number;
  achievementRate: number;
}

export interface SalespersonMonthlyTableRow {
  id: string;
  dept?: string;
  deptRowSpan?: number;
  group?: string;
  groupRowSpan?: number;
  salesperson: string;
  annualTarget: number;
  months: SalespersonMonthData[];
  isGroupSubtotal?: boolean;
  isDeptSubtotal?: boolean;
  isGrandTotal?: boolean;
}

function seededRandom(seed: string): () => number {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
  }
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateSalespersonData(
  dept: string,
  group: string,
  name: string
): { annualTarget: number; months: SalespersonMonthData[] } {
  const rand = seededRandom(`${dept}-${group}-${name}`);
  const annualTarget = Math.round(500000 + rand() * 1500000);
  const months: SalespersonMonthData[] = [];
  for (let i = 0; i < 5; i++) {
    const monthRand = seededRandom(`${dept}-${group}-${name}-month-${i}`);
    const monthlyQuota = annualTarget / 12;
    const initialTarget = Math.round(monthlyQuota * (0.8 + monthRand() * 0.4));
    const actualTarget = Math.round(initialTarget * (0.9 + monthRand() * 0.2));
    const actualOrder = Math.round(actualTarget * (0.7 + monthRand() * 0.6));
    const achievementRate =
      actualTarget > 0 ? +(actualOrder / actualTarget * 100).toFixed(1) : 0;
    months.push({ initialTarget, actualTarget, actualOrder, achievementRate });
  }
  return { annualTarget, months };
}

function sumMonthData(
  monthsArray: SalespersonMonthData[][]
): SalespersonMonthData[] {
  const result: SalespersonMonthData[] = [];
  for (let i = 0; i < 5; i++) {
    let initialTarget = 0;
    let actualTarget = 0;
    let actualOrder = 0;
    for (const months of monthsArray) {
      initialTarget += months[i].initialTarget;
      actualTarget += months[i].actualTarget;
      actualOrder += months[i].actualOrder;
    }
    const achievementRate =
      actualTarget > 0 ? +(actualOrder / actualTarget * 100).toFixed(1) : 0;
    result.push({ initialTarget, actualTarget, actualOrder, achievementRate });
  }
  return result;
}

export function getSalespersonMonthlyData(): {
  rows: SalespersonMonthlyTableRow[];
  kpi: {
    totalTarget: number;
    totalOrder: number;
    avgAchievementRate: number;
    salespersonCount: number;
  };
} {
  const orgStructure = [
    {
      dept: '全球渠道部',
      groups: [
        {
          name: '国际渠道组',
          salespersons: [
            '周晓莹',
            '吴冰',
            '唐怡萍',
            '李微',
            '刘明星',
            '李炳燊',
            '卫丽',
            '颜芯瑜',
            '黄泝期',
          ],
        },
        {
          name: '国内渠道组',
          salespersons: [
            '刘平平',
            '陈宇鹏',
            '范文霞',
            '张小满',
            '成彩凤',
            '罗婉怡',
            '杨家宝',
            '黄大华',
            '孙朝旭',
            '赖映州',
            '张俊',
            '黄大华（兼）',
            '张俊（兼）',
          ],
        },
        { name: 'ODM组', salespersons: ['李晓珊', '彭润城'] },
      ],
    },
    {
      dept: '国内大客户部',
      groups: [
        {
          name: '-',
          salespersons: [
            '冯健维',
            '刘志钢',
            '蓝山山',
            '刘武德',
            '崔应杰',
            '朱静晨',
            '杨上贵',
            '李帅',
            '郭达龙',
            '申俊强',
            '陈俊',
            '张颿',
          ],
        },
      ],
    },
    {
      dept: '国际酒店部',
      groups: [
        {
          name: '-',
          salespersons: [
            '熊伟键',
            '江鹭',
            '蒋其才',
            '沙特驻点人员1',
            '沙特驻点人员2',
          ],
        },
      ],
    },
    {
      dept: '储能事业部',
      groups: [
        {
          name: '-',
          salespersons: ['唐珂', '刘舒婷', '许鹏飞', '待招人'],
        },
      ],
    },
  ];

  const rows: SalespersonMonthlyTableRow[] = [];
  let rowId = 0;
  let totalTarget = 0;
  let totalOrder = 0;
  let totalActualTarget = 0;
  let salespersonCount = 0;

  for (const dept of orgStructure) {
    const deptRows: SalespersonMonthlyTableRow[] = [];
    let deptRowCount = 0;

    for (const group of dept.groups) {
      const groupMonths: SalespersonMonthData[][] = [];

      for (const sp of group.salespersons) {
        const data = generateSalespersonData(dept.dept, group.name, sp);
        groupMonths.push(data.months);
        totalTarget += data.annualTarget;
        salespersonCount += 1;
        data.months.forEach((m) => {
          totalOrder += m.actualOrder;
          totalActualTarget += m.actualTarget;
        });

        deptRows.push({
          id: `sm-${rowId++}`,
          group: group.name,
          salesperson: sp,
          annualTarget: data.annualTarget,
          months: data.months,
        });
      }

      // Group subtotal
      const groupTotalMonths = sumMonthData(groupMonths);
      const groupTotalAnnual = groupMonths.reduce((sum, _, i) => {
        const idx = deptRows.length - groupMonths.length + i;
        return sum + deptRows[idx].annualTarget;
      }, 0);

      deptRows.push({
        id: `sm-${rowId++}`,
        group: group.name,
        salesperson: `${dept.dept}-${group.name}-小计`,
        annualTarget: groupTotalAnnual,
        months: groupTotalMonths,
        isGroupSubtotal: true,
      });

      deptRowCount += group.salespersons.length + 1;
    }

    // Dept subtotal
    const salespersonRows = deptRows.filter(
      (r) => !r.isGroupSubtotal && !r.isDeptSubtotal && !r.isGrandTotal
    );
    const deptTotalMonths = sumMonthData(salespersonRows.map((r) => r.months));
    const deptTotalAnnual = salespersonRows.reduce(
      (sum, r) => sum + r.annualTarget,
      0
    );

    deptRows.push({
      id: `sm-${rowId++}`,
      group: dept.groups.length > 1 ? '' : undefined,
      groupRowSpan: dept.groups.length > 1 ? 1 : undefined,
      salesperson: `${dept.dept}-小计`,
      annualTarget: deptTotalAnnual,
      months: deptTotalMonths,
      isDeptSubtotal: true,
    });
    deptRowCount += 1;

    // Set dept on first row
    if (deptRows.length > 0) {
      deptRows[0].dept = dept.dept;
      deptRows[0].deptRowSpan = deptRowCount;
    }

    // Set group rowSpan on first row of each group
    let currentIdx = 0;
    for (const group of dept.groups) {
      const groupRowCount = group.salespersons.length + 1;
      deptRows[currentIdx].groupRowSpan = groupRowCount;
      currentIdx += groupRowCount;
    }

    rows.push(...deptRows);
  }

  // Grand total
  const allSalespersonRows = rows.filter(
    (r) => !r.isGroupSubtotal && !r.isDeptSubtotal && !r.isGrandTotal
  );
  const grandTotalMonths = sumMonthData(
    allSalespersonRows.map((r) => r.months)
  );
  const grandTotalAnnual = allSalespersonRows.reduce(
    (sum, r) => sum + r.annualTarget,
    0
  );

  rows.push({
    id: `sm-${rowId++}`,
    dept: '河东科技-总计',
    deptRowSpan: 1,
    group: '',
    groupRowSpan: 1,
    salesperson: '河东科技-总计',
    annualTarget: grandTotalAnnual,
    months: grandTotalMonths,
    isGrandTotal: true,
  });

  const avgAchievementRate =
    totalActualTarget > 0
      ? +(totalOrder / totalActualTarget * 100).toFixed(1)
      : 0;

  return {
    rows,
    kpi: {
      totalTarget,
      totalOrder,
      avgAchievementRate,
      salespersonCount,
    },
  };
}
