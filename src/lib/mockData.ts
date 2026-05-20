// Mock data generators and shared mock data for AnalyticsHub V1.0

export const CUSTOMER_NAMES = [
  '恒大地产', '万科地产', '保利地产', '碧桂园集团', '龙湖地产',
  '中海地产', '华润置地', '绿城中国', '融创中国', '金地集团',
  '招商蛇口', '世茂集团', '新城控股', '旭辉集团', '阳光城集团',
  '富力地产', '远洋集团', '雅居乐集团', '佳兆业集团', '华夏幸福',
];

export const SALESPERSON_NAMES = ['张三', '李华', '王芳', '赵强', '刘敏', '陈杰', '杨丽', '黄磊', '周涛', '吴静'];

export const DEALER_NAMES = [
  '广州科技', '深圳光明', '北京宏远', '上海信达', '杭州智联',
  '成都华盛', '武汉天成', '南京瑞景', '西安宏图', '重庆新兴',
  '天津滨海', '苏州园区', '东莞制造', '佛山电器', '青岛海港',
];

export const DEPARTMENTS = ['销售一部', '销售二部', '销售三部', '渠道部', '大客户部', '市场部', '电商部'];

// Generate random sales data
export function generateSalesData(days: number = 7) {
  const data = [];
  const baseDate = new Date('2025-12-01');
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toISOString().split('T')[0],
      orders: Math.floor(Math.random() * 200) + 100,
      revenue: Math.floor(Math.random() * 500000) + 200000,
      customers: Math.floor(Math.random() * 50) + 20,
    });
  }
  return data;
}

// Generate dealer data
export function generateDealerData(count: number = 10) {
  return Array.from({ length: count }, (_, i) => ({
    id: `DL${String(i + 1).padStart(4, '0')}`,
    name: DEALER_NAMES[i % DEALER_NAMES.length],
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    salesperson: SALESPERSON_NAMES[i % SALESPERSON_NAMES.length],
    signingAmount: Math.floor(Math.random() * 1000000) + 100000,
    targetAmount: Math.floor(Math.random() * 1200000) + 500000,
    completionRate: +(Math.random() * 40 + 60).toFixed(1),
    openOrders: Math.floor(Math.random() * 30) + 5,
    status: Math.random() > 0.7 ? 'warning' : 'normal',
  }));
}

// Generate customer ranking data
export function generateCustomerRanking(count: number = 30) {
  return Array.from({ length: count }, (_, i) => ({
    rank: i + 1,
    name: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
    shippingAmount: Math.floor(Math.random() * 5000000) + 500000,
    orderCount: Math.floor(Math.random() * 200) + 20,
    previousRank: i + 1 + Math.floor(Math.random() * 6) - 3,
    trend: Math.random() > 0.5 ? 'up' : 'down',
  }));
}

// Generate weekly report data
export function generateWeeklyReportData() {
  return DEPARTMENTS.map((dept, i) => ({
    department: dept,
    salesperson: SALESPERSON_NAMES[i % SALESPERSON_NAMES.length],
    shippingAmount: Math.floor(Math.random() * 800000) + 200000,
    targetAmount: Math.floor(Math.random() * 1000000) + 500000,
    completionRate: +(Math.random() * 35 + 65).toFixed(1),
    yoyGrowth: +(Math.random() * 20 - 5).toFixed(1),
    openOrderValue: Math.floor(Math.random() * 300000) + 50000,
  }));
}

// Generate activity feed data
export function getActivityFeed() {
  return [
    {
      id: '1',
      title: '周报已生成',
      description: '第48周周报已成功生成，共1,247条订单记录',
      timestamp: '2小时前',
      type: 'success' as const,
    },
    {
      id: '2',
      title: '数据已更新',
      description: '每日订单数据同步完成 - 新增156条记录',
      timestamp: '4小时前',
      type: 'info' as const,
    },
    {
      id: '3',
      title: '报告已发送',
      description: 'Q3返利计算报告已发送给5位收件人',
      timestamp: '1天前',
      type: 'success' as const,
    },
    {
      id: '4',
      title: '目标预警',
      description: 'Q4目标完成率低于80%，需要关注',
      timestamp: '2天前',
      type: 'warning' as const,
    },
    {
      id: '5',
      title: '月报已生成',
      description: '2025年11月月报已准备就绪，等待审核',
      timestamp: '3天前',
      type: 'success' as const,
    },
  ];
}

// Generate alert data
export function getAlerts() {
  return [
    {
      id: '1',
      title: 'Q4目标低于阈值',
      severity: 'critical' as const,
      description: 'Q4完成率为78.4%，目标为85%。请检查季度策略。',
      action: '查看详情',
      route: '/quarterly-target',
    },
    {
      id: '2',
      title: '3份报告待更新',
      severity: 'medium' as const,
      description: '周报、月报和返利报告自上次同步以来尚未更新。',
      action: '立即更新',
      route: '/report-center',
    },
    {
      id: '3',
      title: '2家渠道经销商低于目标',
      severity: 'medium' as const,
      description: '国内经销商"广州科技"和"深圳光明"低于季度签约目标。',
      action: '查看经销商',
      route: '/channel-dealer',
    },
  ];
}

// Generate quick access reports
export function getQuickAccessReports() {
  return [
    {
      id: '1',
      name: '第48周周报',
      type: 'weekly' as const,
      status: 'ready' as const,
      time: '2小时前',
    },
    {
      id: '2',
      name: '2025年11月月报',
      type: 'monthly' as const,
      status: 'ready' as const,
      time: '1天前',
    },
    {
      id: '3',
      name: 'Q4 2025季度目标追踪',
      type: 'quarterly' as const,
      status: 'ready' as const,
      time: '3天前',
    },
    {
      id: '4',
      name: 'Q3 2025返利计算',
      type: 'quarterly' as const,
      status: 'ready' as const,
      time: '5天前',
    },
  ];
}

// KPI data for dashboard
export function getKpiData() {
  return [
    {
      label: 'TOTAL ORDERS',
      value: 1247,
      prefix: '',
      suffix: '',
      trend: 8.2,
      comparison: 'vs 上周',
      sparkline: [180, 220, 195, 240, 210, 230, 172],
    },
    {
      label: 'REVENUE',
      value: 2840000,
      prefix: '¥',
      suffix: '',
      trend: 12.5,
      comparison: 'vs 上周',
      decimals: 2,
      format: true,
      sparkline: [380000, 420000, 390000, 460000, 410000, 440000, 360000],
    },
    {
      label: 'AVG ORDER VALUE',
      value: 22780,
      prefix: '¥',
      suffix: '',
      trend: 3.1,
      comparison: 'vs 上周',
      sparkline: [21000, 22500, 21800, 24000, 23000, 23500, 22780],
    },
    {
      label: 'TARGET COMPLETION',
      value: 78.4,
      prefix: '',
      suffix: '%',
      trend: -2.3,
      comparison: 'vs 上周',
      decimals: 1,
      sparkline: [82, 81, 80, 79, 78.5, 78.2, 78.4],
    },
  ];
}

// Format number helper
export function formatNumber(num: number, decimals: number = 0, format: boolean = false): string {
  if (format && num >= 10000) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(decimals) + 'M';
    }
    return (num / 10000).toFixed(decimals) + '万';
  }
  return decimals > 0 ? num.toFixed(decimals) : num.toLocaleString('zh-CN');
}

// Pie chart data for channel composition
export function getChannelCompositionData() {
  return [
    { name: '国内渠道', value: 45, color: '#3B82F6' },
    { name: '国际渠道', value: 30, color: '#06B6D4' },
    { name: '大客户直销', value: 15, color: '#6366F1' },
    { name: '电商平台', value: 10, color: '#10B981' },
  ];
}

// Monthly trend data
export function getMonthlyTrendData() {
  return [
    { month: '7月', revenue: 2800000, orders: 980, target: 3000000 },
    { month: '8月', revenue: 3100000, orders: 1100, target: 3000000 },
    { month: '9月', revenue: 2650000, orders: 950, target: 3000000 },
    { month: '10月', revenue: 3400000, orders: 1250, target: 3200000 },
    { month: '11月', revenue: 2950000, orders: 1080, target: 3200000 },
    { month: '12月', revenue: 2840000, orders: 1247, target: 3500000 },
  ];
}
