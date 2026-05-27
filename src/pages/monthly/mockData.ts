// Mock data for Monthly/Quarterly module pages

// ==========================================
// MonthlyQuarterly - Overview Hub
// ==========================================

export interface DimensionCard {
  id: string;
  name: string;
  icon: string;
  keyMetric: string;
  keyLabel: string;
  description: string;
  route: string;
  status: 'ready' | 'pending' | 'processing';
}

export const dimensionCards: DimensionCard[] = [
  {
    id: 'channel-dealer',
    name: '渠道商签约统计',
    icon: 'Users',
    keyMetric: '52',
    keyLabel: '家渠道商',
    description: '国内与国际渠道商签约及开单数据统计',
    route: '/channel-dealer',
    status: 'ready',
  },
  {
    id: 'quarterly-target',
    name: '季度目标分解追踪',
    icon: 'Target',
    keyMetric: 'Q4: 78.4%',
    keyLabel: '目标达成率',
    description: '年度目标按季度分解，实时追踪达成进度',
    route: '/quarterly-target',
    status: 'ready',
  },
  {
    id: 'rebate-calculation',
    name: '返点测算',
    icon: 'Calculator',
    keyMetric: '¥234.5K',
    keyLabel: '预估返点',
    description: '季度与年度返点计算，支持剔除订单',
    route: '/rebate-calculation',
    status: 'ready',
  },
  {
    id: 'key-channels',
    name: '重点渠道商统计',
    icon: 'Star',
    keyMetric: '15',
    keyLabel: '家重点渠道',
    description: '战略合作伙伴业绩追踪与分析',
    route: '#',
    status: 'ready',
  },
  {
    id: 'customer-class',
    name: '客户分类统计',
    icon: 'PieChart',
    keyMetric: '3',
    keyLabel: '大分类',
    description: '国内地产、海外ODM、其他客户分类分析',
    route: '#',
    status: 'ready',
  },
  {
    id: 'customer-behavior',
    name: '客户交易行为分析',
    icon: 'Activity',
    keyMetric: '12%',
    keyLabel: '流失率',
    description: '新客户开发、客户流失、交易间隔分析',
    route: '#',
    status: 'ready',
  },
  {
    id: 'special-price',
    name: '特价审批统计',
    icon: 'CheckSquare',
    keyMetric: '23',
    keyLabel: '笔审批',
    description: '特价申请数量及审批金额统计',
    route: '#',
    status: 'ready',
  },
  {
    id: 'projects',
    name: '项目报备统计',
    icon: 'ClipboardList',
    keyMetric: '156',
    keyLabel: '个新项目',
    description: '项目报备数量，按事业部和业务员统计',
    route: '#',
    status: 'ready',
  },
  {
    id: 'knx-sales',
    name: 'KNX产品销售统计',
    icon: 'Cpu',
    keyMetric: '¥1.23M',
    keyLabel: 'KNX销售额',
    description: 'KNX智能家居产品销售，按型号和业务员',
    route: '#',
    status: 'ready',
  },
  {
    id: 'hotel-projects',
    name: '酒店项目统计',
    icon: 'Building',
    keyMetric: '42',
    keyLabel: '个项目',
    description: '酒店项目统计，按业务员统计数量和收入',
    route: '#',
    status: 'ready',
  },
  {
    id: 'top-customers',
    name: 'TOP客户追踪',
    icon: 'TrendingUp',
    keyMetric: '30',
    keyLabel: '家大客户',
    description: '按开单额排名前30客户及排名变化追踪',
    route: '/top-customer',
    status: 'ready',
  },
];

export const overviewKpis = [
  { label: '总签约额', value: 18450000, prefix: '¥', suffix: '', decimals: 2, format: true, trend: 14.2, comparison: 'vs 上月' },
  { label: '总开单额', value: 16230000, prefix: '¥', suffix: '', decimals: 2, format: true, trend: 8.7, comparison: 'vs 上月' },
  { label: '平均完成率', value: 82.4, prefix: '', suffix: '%', decimals: 1, format: false, trend: 3.1, comparison: 'vs 上月' },
  { label: '活跃客户数', value: 186, prefix: '', suffix: '', decimals: 0, format: false, trend: 5.3, comparison: 'vs 上月' },
];

// ==========================================
// ChannelDealer - Channel Dealer Statistics
// ==========================================

export interface CustomerDetail {
  customerName: string;
  customerType: string;
  shippingAmount: number;
  orderCount: number;
  lastOrder: string;
  salesperson: string;
}

export interface DealerData {
  id: string;
  name: string;
  code: string;
  channelType: 'domestic' | 'international';
  shippingAmount: number;
  signingAmount: number;
  targetAmount: number;
  completionRate: number;
  yoyChange: number;
  openOrders: number;
  customers: CustomerDetail[];
}

export const dealerKpis = [
  { label: '签约渠道商数', value: 52, prefix: '', suffix: '家', decimals: 0, format: false, trend: 8.3, comparison: 'vs 上季度' },
  { label: '开单总额', value: 12450000, prefix: '¥', suffix: '', decimals: 2, format: true, trend: 18.3, comparison: 'vs 上季度' },
  { label: '平均签约完成率', value: 76.8, prefix: '', suffix: '%', decimals: 1, format: false, trend: 3.2, comparison: 'vs 上季度' },
  { label: '未结束订单金额', value: 2340000, prefix: '¥', suffix: '', decimals: 2, format: true, trend: -5.1, comparison: 'vs 上季度' },
];

export const dealerData: DealerData[] = [
  {
    id: '1', name: '北京智控科技', code: 'BZK-001', channelType: 'domestic',
    shippingAmount: 1234500, signingAmount: 1456000, targetAmount: 1800000,
    completionRate: 80.9, yoyChange: 31.2, openOrders: 456700,
    customers: [
      { customerName: '恒大地产', customerType: '房地产', shippingAmount: 234500, orderCount: 12, lastOrder: '2025-11-28', salesperson: '张伟' },
      { customerName: '万科地产', customerType: '房地产', shippingAmount: 189200, orderCount: 8, lastOrder: '2025-11-27', salesperson: '张伟' },
      { customerName: '保利地产', customerType: '房地产', shippingAmount: 156700, orderCount: 6, lastOrder: '2025-11-25', salesperson: '李华' },
    ],
  },
  {
    id: '2', name: '上海自动化公司', code: 'SHZ-002', channelType: 'domestic',
    shippingAmount: 1089300, signingAmount: 1280000, targetAmount: 1400000,
    completionRate: 91.4, yoyChange: 22.4, openOrders: 234100,
    customers: [
      { customerName: '碧桂园集团', customerType: '房地产', shippingAmount: 312400, orderCount: 15, lastOrder: '2025-11-26', salesperson: '王芳' },
      { customerName: '龙湖地产', customerType: '房地产', shippingAmount: 198300, orderCount: 9, lastOrder: '2025-11-24', salesperson: '王芳' },
    ],
  },
  {
    id: '3', name: '广州建筑系统', code: 'GZJ-003', channelType: 'domestic',
    shippingAmount: 987600, signingAmount: 1100000, targetAmount: 1300000,
    completionRate: 84.6, yoyChange: 18.7, openOrders: 189400,
    customers: [
      { customerName: '中海地产', customerType: '房地产', shippingAmount: 267800, orderCount: 11, lastOrder: '2025-11-23', salesperson: '赵强' },
      { customerName: '华润置地', customerType: '房地产', shippingAmount: 189500, orderCount: 7, lastOrder: '2025-11-22', salesperson: '赵强' },
    ],
  },
  {
    id: '4', name: '深圳光明电气', code: 'SZG-004', channelType: 'domestic',
    shippingAmount: 876400, signingAmount: 980000, targetAmount: 1200000,
    completionRate: 81.7, yoyChange: 15.3, openOrders: 156800,
    customers: [
      { customerName: '绿城中国', customerType: '房地产', shippingAmount: 198400, orderCount: 8, lastOrder: '2025-11-21', salesperson: '刘敏' },
      { customerName: '招商蛇口', customerType: '房地产', shippingAmount: 145600, orderCount: 6, lastOrder: '2025-11-20', salesperson: '刘敏' },
    ],
  },
  {
    id: '5', name: '成都智能控制', code: 'CDZ-005', channelType: 'domestic',
    shippingAmount: 765200, signingAmount: 890000, targetAmount: 1100000,
    completionRate: 80.9, yoyChange: 12.8, openOrders: 123500,
    customers: [
      { customerName: '融创中国', customerType: '房地产', shippingAmount: 187600, orderCount: 9, lastOrder: '2025-11-19', salesperson: '陈杰' },
      { customerName: '金地集团', customerType: '房地产', shippingAmount: 134200, orderCount: 5, lastOrder: '2025-11-18', salesperson: '陈杰' },
    ],
  },
  {
    id: '6', name: '华东科技集团', code: 'HDK-006', channelType: 'international',
    shippingAmount: 1456700, signingAmount: 1678000, targetAmount: 2000000,
    completionRate: 83.9, yoyChange: 45.2, openOrders: 678900,
    customers: [
      { customerName: '万达酒店', customerType: '酒店', shippingAmount: 345600, orderCount: 18, lastOrder: '2025-11-28', salesperson: '杨丽' },
      { customerName: '希尔顿中国', customerType: '酒店', shippingAmount: 278900, orderCount: 14, lastOrder: '2025-11-26', salesperson: '杨丽' },
    ],
  },
  {
    id: '7', name: '德国渠道A', code: 'DEA-101', channelType: 'international',
    shippingAmount: 1234500, signingAmount: 1456000, targetAmount: 1800000,
    completionRate: 80.9, yoyChange: 38.9, openOrders: 567800,
    customers: [
      { customerName: '西门子项目', customerType: 'ODM', shippingAmount: 456700, orderCount: 22, lastOrder: '2025-11-27', salesperson: '黄磊' },
      { customerName: '博世集团', customerType: 'ODM', shippingAmount: 345600, orderCount: 16, lastOrder: '2025-11-25', salesperson: '黄磊' },
    ],
  },
  {
    id: '8', name: '中东贸易公司', code: 'ZED-102', channelType: 'international',
    shippingAmount: 836800, signingAmount: 980000, targetAmount: 1200000,
    completionRate: 81.7, yoyChange: 29.4, openOrders: 345600,
    customers: [
      { customerName: '迪拜地产', customerType: '海外地产', shippingAmount: 234500, orderCount: 10, lastOrder: '2025-11-24', salesperson: '周涛' },
      { customerName: '沙特集团', customerType: '海外地产', shippingAmount: 198700, orderCount: 8, lastOrder: '2025-11-22', salesperson: '周涛' },
    ],
  },
  {
    id: '9', name: '中建集团渠道', code: 'ZJJ-103', channelType: 'domestic',
    shippingAmount: 654300, signingAmount: 780000, targetAmount: 950000,
    completionRate: 82.1, yoyChange: 9.7, openOrders: 98700,
    customers: [
      { customerName: '华夏幸福', customerType: '房地产', shippingAmount: 156700, orderCount: 7, lastOrder: '2025-11-17', salesperson: '吴静' },
      { customerName: '阳光城集团', customerType: '房地产', shippingAmount: 123400, orderCount: 5, lastOrder: '2025-11-16', salesperson: '吴静' },
    ],
  },
  {
    id: '10', name: '东南亚科技', code: 'DNY-104', channelType: 'international',
    shippingAmount: 543200, signingAmount: 650000, targetAmount: 800000,
    completionRate: 81.3, yoyChange: 19.8, openOrders: 234500,
    customers: [
      { customerName: '新加坡建发', customerType: '海外地产', shippingAmount: 178900, orderCount: 8, lastOrder: '2025-11-21', salesperson: '张三' },
      { customerName: '马来西亚集团', customerType: '海外地产', shippingAmount: 145600, orderCount: 6, lastOrder: '2025-11-19', salesperson: '张三' },
    ],
  },
];

export const topDealersChart = dealerData.map(d => ({
  name: d.name,
  amount: d.shippingAmount,
  type: d.channelType === 'domestic' ? '国内' : '国际',
})).sort((a, b) => b.amount - a.amount).slice(0, 10);

// ==========================================
// QuarterlyTarget - Quarterly Target Tracking
// ==========================================

export interface QuarterData {
  quarter: string;
  label: string;
  target: number;
  actual: number;
  completionRate: number;
  yoyChange: number;
  status: 'completed' | 'in-progress' | 'pending';
  gap: number;
}

export interface DepartmentQuarterly {
  department: string;
  annualTarget: number;
  q1Target: number; q1Actual: number; q1Rate: number;
  q2Target: number; q2Actual: number; q2Rate: number;
  q3Target: number; q3Actual: number; q3Rate: number;
  q4Target: number; q4Actual: number; q4Rate: number;
  ytdActual: number;
  completionRate: number;
  status: string;
}

export const annualTargetKpis = [
  { label: '年度目标', value: 50000000, prefix: '¥', suffix: '', decimals: 0, format: true, trend: 0, comparison: '2026财年' },
  { label: '实际完成', value: 39200000, prefix: '¥', suffix: '', decimals: 0, format: true, trend: 15.2, comparison: '78.4% 达成率' },
  { label: '差额', value: 10800000, prefix: '¥', suffix: '', decimals: 0, format: true, trend: 0, comparison: 'Q4 需完成 ¥10.8M' },
];

export const quartersData: QuarterData[] = [
  { quarter: 'Q1', label: '第一季度', target: 10000000, actual: 9200000, completionRate: 92.0, yoyChange: 15.3, status: 'completed', gap: -800000 },
  { quarter: 'Q2', label: '第二季度', target: 12500000, actual: 11800000, completionRate: 94.4, yoyChange: 22.7, status: 'completed', gap: -700000 },
  { quarter: 'Q3', label: '第三季度', target: 13000000, actual: 10200000, completionRate: 78.5, yoyChange: -3.2, status: 'completed', gap: -2800000 },
  { quarter: 'Q4', label: '第四季度', target: 14500000, actual: 8000000, completionRate: 55.2, yoyChange: 8.1, status: 'in-progress', gap: -6500000 },
];

export const monthlyTrendData = [
  { month: '1月', actual: 2800000, target: 3333333, cumulative: 2800000 },
  { month: '2月', actual: 3100000, target: 6666666, cumulative: 5900000 },
  { month: '3月', actual: 3300000, target: 10000000, cumulative: 9200000 },
  { month: '4月', actual: 3800000, target: 12500000, cumulative: 13000000 },
  { month: '5月', actual: 4200000, target: 15000000, cumulative: 17200000 },
  { month: '6月', actual: 3800000, target: 22500000, cumulative: 21000000 },
  { month: '7月', actual: 3500000, target: 26000000, cumulative: 24500000 },
  { month: '8月', actual: 3200000, target: 29500000, cumulative: 27700000 },
  { month: '9月', actual: 3500000, target: 33000000, cumulative: 31200000 },
  { month: '10月', actual: 2800000, target: 36500000, cumulative: 34000000 },
  { month: '11月', actual: 3200000, target: 42000000, cumulative: 37200000 },
  { month: '12月', actual: 2000000, target: 50000000, cumulative: 39200000 },
];

export const departmentQuarterlyData: DepartmentQuarterly[] = [
  { department: '国内销售部', annualTarget: 20000000, q1Target: 5000000, q1Actual: 4800000, q1Rate: 96.0, q2Target: 5500000, q2Actual: 5200000, q2Rate: 94.5, q3Target: 5000000, q3Actual: 4600000, q3Rate: 92.0, q4Target: 4500000, q4Actual: 3400000, q4Rate: 75.6, ytdActual: 18000000, completionRate: 90.0, status: '正常' },
  { department: '国际销售部', annualTarget: 15000000, q1Target: 3500000, q1Actual: 2800000, q1Rate: 80.0, q2Target: 4000000, q2Actual: 3500000, q2Rate: 87.5, q3Target: 4000000, q3Actual: 2900000, q3Rate: 72.5, q4Target: 3500000, q4Actual: 2100000, q4Rate: 60.0, ytdActual: 11300000, completionRate: 75.3, status: '风险' },
  { department: 'OEM事业部', annualTarget: 10000000, q1Target: 2000000, q1Actual: 1600000, q1Rate: 80.0, q2Target: 2500000, q2Actual: 2400000, q2Rate: 96.0, q3Target: 2800000, q3Actual: 1800000, q3Rate: 64.3, q4Target: 2700000, q4Actual: 1400000, q4Rate: 51.9, ytdActual: 7200000, completionRate: 72.0, status: '风险' },
  { department: 'KNX事业部', annualTarget: 5000000, q1Target: 800000, q1Actual: 600000, q1Rate: 75.0, q2Target: 1100000, q2Actual: 700000, q2Rate: 63.6, q3Target: 1200000, q3Actual: 900000, q3Rate: 75.0, q4Target: 1900000, q4Actual: 1100000, q4Rate: 57.9, ytdActual: 3300000, completionRate: 66.0, status: '滞后' },
];

// ==========================================
// RebateCalculation - Rebate Calculation
// ==========================================

export interface RebateOrder {
  id: string;
  orderNo: string;
  customerName: string;
  orderDate: string;
  signingAmount: number;
  rebateRate: number;
  rebateAmount: number;
  excluded: boolean;
  excludeReason?: string;
  status: 'included' | 'excluded';
}

export interface RebateCustomer {
  id: string;
  customerName: string;
  totalSigning: number;
  quarterTarget: number;
  pendingVerify: number;
  excludedAmount: number;
  effectiveAmount: number;
  rebateRate: number;
  rebateAmount: number;
  status: 'eligible' | 'pending' | 'excluded';
}

export const rebateKpis = [
  { label: '总签约额', value: 4567800, prefix: '¥', suffix: '', decimals: 0, format: true, trend: 12.5, comparison: '23笔订单' },
  { label: '总订单数', value: 23, prefix: '', suffix: '笔', decimals: 0, format: false, trend: -2, comparison: '剔除后: 21笔' },
  { label: '平均订单额', value: 198600, prefix: '¥', suffix: '', decimals: 0, format: true, trend: 5.1, comparison: '单笔平均' },
  { label: '预估返点', value: 91356, prefix: '¥', suffix: '', decimals: 0, format: true, trend: 8.3, comparison: '季度计算' },
];

export const rebateOrders: RebateOrder[] = [
  { id: '1', orderNo: 'ORD-2025-1042', customerName: '恒大地产', orderDate: '2025-11-28', signingAmount: 456700, rebateRate: 2, rebateAmount: 9134, excluded: false, status: 'included' },
  { id: '2', orderNo: 'ORD-2025-1038', customerName: '万科地产', orderDate: '2025-11-27', signingAmount: 389200, rebateRate: 2, rebateAmount: 7784, excluded: false, status: 'included' },
  { id: '3', orderNo: 'ORD-2025-1035', customerName: '碧桂园集团', orderDate: '2025-11-25', signingAmount: 234500, rebateRate: 3, rebateAmount: 7035, excluded: true, excludeReason: '内部订单', status: 'excluded' },
  { id: '4', orderNo: 'ORD-2025-1031', customerName: '保利地产', orderDate: '2025-11-22', signingAmount: 567800, rebateRate: 2, rebateAmount: 11356, excluded: false, status: 'included' },
  { id: '5', orderNo: 'ORD-2025-1028', customerName: '绿城中国', orderDate: '2025-11-20', signingAmount: 198400, rebateRate: 3, rebateAmount: 5952, excluded: false, status: 'included' },
  { id: '6', orderNo: 'ORD-2025-1025', customerName: '龙湖地产', orderDate: '2025-11-18', signingAmount: 123600, rebateRate: 3, rebateAmount: 3708, excluded: true, excludeReason: '待审批', status: 'excluded' },
  { id: '7', orderNo: 'ORD-2025-1021', customerName: '中海地产', orderDate: '2025-11-15', signingAmount: 678900, rebateRate: 2, rebateAmount: 13578, excluded: false, status: 'included' },
  { id: '8', orderNo: 'ORD-2025-1018', customerName: '华润置地', orderDate: '2025-11-12', signingAmount: 345200, rebateRate: 3, rebateAmount: 10356, excluded: false, status: 'included' },
  { id: '9', orderNo: 'ORD-2025-1015', customerName: '融创中国', orderDate: '2025-11-10', signingAmount: 278900, rebateRate: 3, rebateAmount: 8367, excluded: false, status: 'included' },
  { id: '10', orderNo: 'ORD-2025-1012', customerName: '招商蛇口', orderDate: '2025-11-08', signingAmount: 456300, rebateRate: 2, rebateAmount: 9126, excluded: false, status: 'included' },
];

export const rebateCustomers: RebateCustomer[] = [
  { id: '1', customerName: '恒大地产', totalSigning: 1456700, quarterTarget: 1500000, pendingVerify: 123400, excludedAmount: 0, effectiveAmount: 1456700, rebateRate: 2, rebateAmount: 29134, status: 'eligible' },
  { id: '2', customerName: '万科地产', totalSigning: 892300, quarterTarget: 1000000, pendingVerify: 0, excludedAmount: 0, effectiveAmount: 892300, rebateRate: 2, rebateAmount: 17846, status: 'eligible' },
  { id: '3', customerName: '碧桂园集团', totalSigning: 678900, quarterTarget: 800000, pendingVerify: 234500, excludedAmount: 234500, effectiveAmount: 444400, rebateRate: 3, rebateAmount: 13332, status: 'excluded' },
  { id: '4', customerName: '保利地产', totalSigning: 1567800, quarterTarget: 1600000, pendingVerify: 0, excludedAmount: 0, effectiveAmount: 1567800, rebateRate: 2, rebateAmount: 31356, status: 'eligible' },
  { id: '5', customerName: '绿城中国', totalSigning: 456700, quarterTarget: 500000, pendingVerify: 0, excludedAmount: 0, effectiveAmount: 456700, rebateRate: 3, rebateAmount: 13701, status: 'eligible' },
  { id: '6', customerName: '龙湖地产', totalSigning: 345600, quarterTarget: 400000, pendingVerify: 123600, excludedAmount: 123600, effectiveAmount: 222000, rebateRate: 3, rebateAmount: 6660, status: 'pending' },
  { id: '7', customerName: '中海地产', totalSigning: 1890000, quarterTarget: 2000000, pendingVerify: 0, excludedAmount: 0, effectiveAmount: 1890000, rebateRate: 2, rebateAmount: 37800, status: 'eligible' },
  { id: '8', customerName: '华润置地', totalSigning: 567800, quarterTarget: 600000, pendingVerify: 0, excludedAmount: 0, effectiveAmount: 567800, rebateRate: 3, rebateAmount: 17034, status: 'eligible' },
  { id: '9', customerName: '融创中国', totalSigning: 234500, quarterTarget: 300000, pendingVerify: 0, excludedAmount: 0, effectiveAmount: 234500, rebateRate: 3, rebateAmount: 7035, status: 'eligible' },
  { id: '10', customerName: '招商蛇口', totalSigning: 1234500, quarterTarget: 1300000, pendingVerify: 0, excludedAmount: 0, effectiveAmount: 1234500, rebateRate: 2, rebateAmount: 24690, status: 'eligible' },
];

// ==========================================
// TopCustomer - TOP Customer Tracking
// ==========================================

export interface TopCustomer {
  rank: number;
  customerName: string;
  customerCode: string;
  customerType: string;
  revenue: number;
  revenueShare: number;
  orderCount: number;
  avgOrderValue: number;
  previousRank: number | null;
  change: number;
  trend: number[];
}

export const topCustomerKpis = [
  { label: 'TOP30总开单额', value: 28450000, prefix: '¥', suffix: '', decimals: 2, format: true, trend: 10.2, comparison: 'vs 上期' },
  { label: '平均开单额', value: 947800, prefix: '¥', suffix: '', decimals: 0, format: true, trend: 5.8, comparison: 'vs 上期' },
  { label: '排名变化客户数', value: 18, prefix: '', suffix: '家', decimals: 0, format: false, trend: 0, comparison: '上升: 8 / 下降: 5' },
  { label: '新增TOP30客户', value: 3, prefix: '', suffix: '家', decimals: 0, format: false, trend: 0, comparison: '新进入排名' },
];

const generateTrend = (base: number) => {
  const trend = [];
  let val = base * 0.7;
  for (let i = 0; i < 6; i++) {
    val += Math.random() * base * 0.15;
    trend.push(Math.round(val));
  }
  return trend;
};

export const topCustomersData: TopCustomer[] = [
  { rank: 1, customerName: '恒大地产', customerCode: 'EVG-001', customerType: '房地产', revenue: 4567800, revenueShare: 16.1, orderCount: 45, avgOrderValue: 101507, previousRank: 1, change: 0, trend: generateTrend(4567800) },
  { rank: 2, customerName: '万科地产', customerCode: 'VNK-002', customerType: '房地产', revenue: 3234500, revenueShare: 11.4, orderCount: 38, avgOrderValue: 85118, previousRank: 4, change: 2, trend: generateTrend(3234500) },
  { rank: 3, customerName: '华润置地', customerCode: 'CRL-003', customerType: '房地产', revenue: 2987600, revenueShare: 10.5, orderCount: 32, avgOrderValue: 93363, previousRank: 2, change: -1, trend: generateTrend(2987600) },
  { rank: 4, customerName: '保利地产', customerCode: 'PLY-004', customerType: '房地产', revenue: 2456700, revenueShare: 8.6, orderCount: 28, avgOrderValue: 87739, previousRank: 3, change: -1, trend: generateTrend(2456700) },
  { rank: 5, customerName: '碧桂园集团', customerCode: 'CGN-005', customerType: '房地产', revenue: 2123400, revenueShare: 7.5, orderCount: 25, avgOrderValue: 84936, previousRank: 5, change: 0, trend: generateTrend(2123400) },
  { rank: 6, customerName: '绿城中国', customerCode: 'GCT-006', customerType: '房地产', revenue: 1876500, revenueShare: 6.6, orderCount: 22, avgOrderValue: 85295, previousRank: 9, change: 3, trend: generateTrend(1876500) },
  { rank: 7, customerName: '龙湖地产', customerCode: 'LFP-007', customerType: '房地产', revenue: 1654300, revenueShare: 5.8, orderCount: 19, avgOrderValue: 87068, previousRank: 7, change: 0, trend: generateTrend(1654300) },
  { rank: 8, customerName: '融创中国', customerCode: 'SNC-008', customerType: '房地产', revenue: 1432100, revenueShare: 5.0, orderCount: 17, avgOrderValue: 84241, previousRank: 6, change: -1, trend: generateTrend(1432100) },
  { rank: 9, customerName: '世茂集团', customerCode: 'SMG-009', customerType: '房地产', revenue: 1234500, revenueShare: 4.3, orderCount: 15, avgOrderValue: 82300, previousRank: null, change: 0, trend: generateTrend(1234500) },
  { rank: 10, customerName: '雅居乐集团', customerCode: 'AGL-010', customerType: '房地产', revenue: 1098700, revenueShare: 3.9, orderCount: 14, avgOrderValue: 78479, previousRank: 15, change: 5, trend: generateTrend(1098700) },
  { rank: 11, customerName: '万达酒店', customerCode: 'WDH-011', customerType: '酒店', revenue: 987600, revenueShare: 3.5, orderCount: 18, avgOrderValue: 54867, previousRank: 10, change: -1, trend: generateTrend(987600) },
  { rank: 12, customerName: '中海地产', customerCode: 'ZHD-012', customerType: '房地产', revenue: 923400, revenueShare: 3.2, orderCount: 13, avgOrderValue: 71031, previousRank: 11, change: -1, trend: generateTrend(923400) },
  { rank: 13, customerName: '金地集团', customerCode: 'JDJ-013', customerType: '房地产', revenue: 876500, revenueShare: 3.1, orderCount: 12, avgOrderValue: 73042, previousRank: 13, change: 0, trend: generateTrend(876500) },
  { rank: 14, customerName: '富力地产', customerCode: 'FLD-014', customerType: '房地产', revenue: 789000, revenueShare: 2.8, orderCount: 11, avgOrderValue: 71727, previousRank: 12, change: -2, trend: generateTrend(789000) },
  { rank: 15, customerName: '招商蛇口', customerCode: 'ZSK-015', customerType: '房地产', revenue: 654300, revenueShare: 2.3, orderCount: 10, avgOrderValue: 65430, previousRank: 16, change: 1, trend: generateTrend(654300) },
  { rank: 16, customerName: '新城控股', customerCode: 'XCK-016', customerType: '房地产', revenue: 598700, revenueShare: 2.1, orderCount: 9, avgOrderValue: 66522, previousRank: 14, change: -2, trend: generateTrend(598700) },
  { rank: 17, customerName: '远洋集团', customerCode: 'YYJ-017', customerType: '房地产', revenue: 543200, revenueShare: 1.9, orderCount: 8, avgOrderValue: 67900, previousRank: 18, change: 1, trend: generateTrend(543200) },
  { rank: 18, customerName: '华夏幸福', customerCode: 'HXF-018', customerType: '房地产', revenue: 498600, revenueShare: 1.8, orderCount: 8, avgOrderValue: 62325, previousRank: 17, change: -1, trend: generateTrend(498600) },
  { rank: 19, customerName: '阳光城集团', customerCode: 'YGC-019', customerType: '房地产', revenue: 445700, revenueShare: 1.6, orderCount: 7, avgOrderValue: 63671, previousRank: 20, change: 1, trend: generateTrend(445700) },
  { rank: 20, customerName: '佳兆业集团', customerCode: 'JZJ-020', customerType: '房地产', revenue: 387600, revenueShare: 1.4, orderCount: 6, avgOrderValue: 64600, previousRank: 19, change: -1, trend: generateTrend(387600) },
  { rank: 21, customerName: '希尔顿中国', customerCode: 'XED-021', customerType: '酒店', revenue: 356700, revenueShare: 1.3, orderCount: 10, avgOrderValue: 35670, previousRank: 22, change: 1, trend: generateTrend(356700) },
  { rank: 22, customerName: '绿地集团', customerCode: 'LDJ-022', customerType: '房地产', revenue: 298700, revenueShare: 1.0, orderCount: 5, avgOrderValue: 59740, previousRank: 21, change: -1, trend: generateTrend(298700) },
  { rank: 23, customerName: '中建集团', customerCode: 'ZJJ-023', customerType: 'ODM', revenue: 267800, revenueShare: 0.9, orderCount: 12, avgOrderValue: 22317, previousRank: 25, change: 2, trend: generateTrend(267800) },
  { rank: 24, customerName: '凯德集团', customerCode: 'KDJ-024', customerType: '房地产', revenue: 234500, revenueShare: 0.8, orderCount: 4, avgOrderValue: 58625, previousRank: 23, change: -1, trend: generateTrend(234500) },
  { rank: 25, customerName: '正荣地产', customerCode: 'ZRD-025', customerType: '房地产', revenue: 198700, revenueShare: 0.7, orderCount: 4, avgOrderValue: 49675, previousRank: 24, change: -1, trend: generateTrend(198700) },
  { rank: 26, customerName: '禹洲集团', customerCode: 'YZJ-026', customerType: '房地产', revenue: 176500, revenueShare: 0.6, orderCount: 3, avgOrderValue: 58833, previousRank: 27, change: 1, trend: generateTrend(176500) },
  { rank: 27, customerName: '宝龙地产', customerCode: 'BLD-027', customerType: '房地产', revenue: 154300, revenueShare: 0.5, orderCount: 3, avgOrderValue: 51433, previousRank: 26, change: -1, trend: generateTrend(154300) },
  { rank: 28, customerName: '中骏集团', customerCode: 'ZJU-028', customerType: '房地产', revenue: 123400, revenueShare: 0.4, orderCount: 2, avgOrderValue: 61700, previousRank: 29, change: 1, trend: generateTrend(123400) },
  { rank: 29, customerName: '合景泰富', customerCode: 'HJF-029', customerType: '房地产', revenue: 98700, revenueShare: 0.3, orderCount: 2, avgOrderValue: 49350, previousRank: 28, change: -1, trend: generateTrend(98700) },
  { rank: 30, customerName: '东原集团', customerCode: 'DYJ-030', customerType: '房地产', revenue: 76500, revenueShare: 0.3, orderCount: 2, avgOrderValue: 38250, previousRank: 30, change: 0, trend: generateTrend(76500) },
];

export const top10Distribution = topCustomersData.slice(0, 10).map(c => ({
  name: c.customerName,
  revenue: c.revenue,
  share: c.revenueShare,
}));
