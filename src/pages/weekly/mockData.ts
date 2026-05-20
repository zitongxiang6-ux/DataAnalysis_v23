import type { DepartmentData, KpiData, TrendDataPoint, CustomerDetail } from './types';

// ============ KPI Data ============
export const kpiData: KpiData = {
  totalShipping: 28560000, // ¥2,856万
  targetCompletion: 78.5,
  yoyGrowth: 12.3,
  openOrderAmount: 4860000, // ¥486万
  totalShippingTrend: 15.3,
  targetCompletionTrend: -1.2,
  yoyGrowthTrend: 8.1,
  openOrderTrend: 5.2,
};

// ============ Trend Chart Data (本周出货趋势) ============
export const trendData: TrendDataPoint[] = [
  { day: '周一', dayShort: '一', dailyAmount: 320, cumulativeAmount: 320 },
  { day: '周二', dayShort: '二', dailyAmount: 480, cumulativeAmount: 800 },
  { day: '周三', dayShort: '三', dailyAmount: 520, cumulativeAmount: 1320 },
  { day: '周四', dayShort: '四', dailyAmount: 450, cumulativeAmount: 1770 },
  { day: '周五', dayShort: '五', dailyAmount: 560, cumulativeAmount: 2330 },
  { day: '周六', dayShort: '六', dailyAmount: 280, cumulativeAmount: 2610 },
  { day: '周日', dayShort: '日', dailyAmount: 246, cumulativeAmount: 2856 },
];

// ============ Department Salespeople Mock Data ============
const globalChannelSalespeople = [
  { id: 'SP001', name: '张伟', customerCount: 24, shippingAmount: 8924000, targetAmount: 10000000, completionRate: 89.2, yoyChange: 22.4, openOrderAmount: 4123000 },
  { id: 'SP002', name: '李华', customerCount: 18, shippingAmount: 4567000, targetAmount: 5500000, completionRate: 83.0, yoyChange: 18.7, openOrderAmount: 2341000 },
  { id: 'SP003', name: '王明', customerCount: 15, shippingAmount: 3789000, targetAmount: 4800000, completionRate: 78.9, yoyChange: 15.2, openOrderAmount: 1896000 },
  { id: 'SP004', name: '赵丽', customerCount: 12, shippingAmount: 2567000, targetAmount: 3200000, completionRate: 80.2, yoyChange: 11.8, openOrderAmount: 1458000 },
];

const domesticKeyAccountSalespeople = [
  { id: 'SP005', name: '王芳', customerCount: 16, shippingAmount: 6789000, targetAmount: 8000000, completionRate: 84.9, yoyChange: 31.2, openOrderAmount: 3456000 },
  { id: 'SP006', name: '陈明', customerCount: 14, shippingAmount: 5556000, targetAmount: 7000000, completionRate: 79.4, yoyChange: 15.8, openOrderAmount: 2894000 },
  { id: 'SP007', name: '刘洋', customerCount: 10, shippingAmount: 3456000, targetAmount: 4500000, completionRate: 76.8, yoyChange: 9.6, openOrderAmount: 2123000 },
  { id: 'SP008', name: '孙静', customerCount: 8, shippingAmount: 2345000, targetAmount: 3000000, completionRate: 78.2, yoyChange: 13.5, openOrderAmount: 1567000 },
];

const internationalHotelSalespeople = [
  { id: 'SP009', name: '刘杰', customerCount: 20, shippingAmount: 3987000, targetAmount: 6000000, completionRate: 66.5, yoyChange: 8.3, openOrderAmount: 5678000 },
  { id: 'SP010', name: '赵磊', customerCount: 11, shippingAmount: 4620000, targetAmount: 5000000, completionRate: 92.4, yoyChange: 45.2, openOrderAmount: 1234000 },
  { id: 'SP011', name: '周涛', customerCount: 9, shippingAmount: 2890000, targetAmount: 4000000, completionRate: 72.3, yoyChange: 6.7, openOrderAmount: 2345000 },
  { id: 'SP012', name: '吴倩', customerCount: 7, shippingAmount: 1980000, targetAmount: 2500000, completionRate: 79.2, yoyChange: 18.9, openOrderAmount: 987000 },
];

// ============ Customer Data for Drill-down ============
const customerDataMap: Record<string, CustomerDetail[]> = {
  'SP001': [
    { id: 'CU001', name: '恒大地产集团', shippingAmount: 2345000, completionRate: 112.5, yoyChange: 28.3, openOrderAmount: 567000 },
    { id: 'CU002', name: '万科地产股份', shippingAmount: 1892000, completionRate: 98.4, yoyChange: 22.1, openOrderAmount: 456000 },
    { id: 'CU003', name: '碧桂园控股', shippingAmount: 1567000, completionRate: 87.6, yoyChange: 18.5, openOrderAmount: 823000 },
    { id: 'CU004', name: '保利发展控股', shippingAmount: 1345000, completionRate: 95.2, yoyChange: 15.8, openOrderAmount: 345000 },
    { id: 'CU005', name: '龙湖集团', shippingAmount: 987000, completionRate: 76.3, yoyChange: 31.2, openOrderAmount: 678000 },
    { id: 'CU006', name: '中海企业集团', shippingAmount: 789000, completionRate: 68.5, yoyChange: 24.7, openOrderAmount: 1254000 },
  ],
  'SP002': [
    { id: 'CU007', name: '华润置地有限公司', shippingAmount: 1234000, completionRate: 89.5, yoyChange: 12.3, openOrderAmount: 345000 },
    { id: 'CU008', name: '绿城中国控股', shippingAmount: 987000, completionRate: 76.2, yoyChange: 22.5, openOrderAmount: 678000 },
    { id: 'CU009', name: '融创中国控股', shippingAmount: 876000, completionRate: 82.1, yoyChange: 15.6, openOrderAmount: 456000 },
    { id: 'CU010', name: '金地集团股份有限公司', shippingAmount: 765000, completionRate: 91.3, yoyChange: 18.9, openOrderAmount: 234000 },
    { id: 'CU011', name: '招商蛇口工业区', shippingAmount: 698000, completionRate: 85.7, yoyChange: 24.1, openOrderAmount: 628000 },
  ],
  'SP003': [
    { id: 'CU012', name: '世茂集团股份', shippingAmount: 987000, completionRate: 78.5, yoyChange: 16.2, openOrderAmount: 345000 },
    { id: 'CU013', name: '新城控股集团', shippingAmount: 876000, completionRate: 82.4, yoyChange: 11.8, openOrderAmount: 456000 },
    { id: 'CU014', name: '旭辉控股集团', shippingAmount: 765000, completionRate: 75.6, yoyChange: 13.5, openOrderAmount: 567000 },
    { id: 'CU015', name: '阳光城集团', shippingAmount: 654000, completionRate: 69.3, yoyChange: 19.8, openOrderAmount: 234000 },
    { id: 'CU016', name: '富力地产集团', shippingAmount: 498000, completionRate: 88.1, yoyChange: 14.3, openOrderAmount: 298000 },
  ],
  'SP004': [
    { id: 'CU017', name: '远洋集团控股', shippingAmount: 765000, completionRate: 91.2, yoyChange: 18.5, openOrderAmount: 234000 },
    { id: 'CU018', name: '雅居乐集团', shippingAmount: 654000, completionRate: 78.3, yoyChange: 12.1, openOrderAmount: 345000 },
    { id: 'CU019', name: '佳兆业集团', shippingAmount: 543000, completionRate: 65.8, yoyChange: 8.6, openOrderAmount: 456000 },
    { id: 'CU020', name: '华夏幸福基业', shippingAmount: 605000, completionRate: 82.5, yoyChange: 7.2, openOrderAmount: 423000 },
  ],
  'SP005': [
    { id: 'CU021', name: '中国铁建地产', shippingAmount: 1876000, completionRate: 102.3, yoyChange: 35.8, openOrderAmount: 234000 },
    { id: 'CU022', name: '中建地产集团', shippingAmount: 1543000, completionRate: 95.6, yoyChange: 28.4, openOrderAmount: 456000 },
    { id: 'CU023', name: '中交地产股份', shippingAmount: 1234000, completionRate: 88.2, yoyChange: 41.2, openOrderAmount: 678000 },
    { id: 'CU024', name: '电建地产集团', shippingAmount: 987000, completionRate: 76.5, yoyChange: 22.1, openOrderAmount: 890000 },
    { id: 'CU025', name: '金茂控股集团', shippingAmount: 765000, completionRate: 82.4, yoyChange: 29.3, openOrderAmount: 567000 },
    { id: 'CU026', name: '越秀地产股份', shippingAmount: 382000, completionRate: 91.8, yoyChange: 32.5, openOrderAmount: 621000 },
  ],
  'SP006': [
    { id: 'CU027', name: '华发实业股份', shippingAmount: 1543000, completionRate: 87.6, yoyChange: 19.5, openOrderAmount: 345000 },
    { id: 'CU028', name: '首开股份集团', shippingAmount: 1234000, completionRate: 78.2, yoyChange: 12.8, openOrderAmount: 678000 },
    { id: 'CU029', name: '金融街控股', shippingAmount: 987000, completionRate: 65.4, yoyChange: 8.2, openOrderAmount: 456000 },
    { id: 'CU030', name: '滨江集团股份', shippingAmount: 876000, completionRate: 92.1, yoyChange: 24.6, openOrderAmount: 234000 },
    { id: 'CU031', name: '荣盛发展集团', shippingAmount: 917000, completionRate: 73.5, yoyChange: 14.1, openOrderAmount: 1187000 },
  ],
  'SP007': [
    { id: 'CU032', name: '蓝光发展集团', shippingAmount: 987000, completionRate: 82.1, yoyChange: 11.5, openOrderAmount: 345000 },
    { id: 'CU033', name: '正荣地产集团', shippingAmount: 876000, completionRate: 78.3, yoyChange: 6.2, openOrderAmount: 456000 },
    { id: 'CU034', name: '融信中国控股', shippingAmount: 765000, completionRate: 72.5, yoyChange: 9.8, openOrderAmount: 567000 },
    { id: 'CU035', name: '祥生控股集团', shippingAmount: 543000, completionRate: 65.8, yoyChange: 10.4, openOrderAmount: 234000 },
    { id: 'CU036', name: '禹洲集团股份', shippingAmount: 285000, completionRate: 78.9, yoyChange: 8.7, openOrderAmount: 532000 },
  ],
  'SP008': [
    { id: 'CU037', name: '宝龙地产控股', shippingAmount: 654000, completionRate: 78.2, yoyChange: 15.2, openOrderAmount: 234000 },
    { id: 'CU038', name: '中骏集团控股', shippingAmount: 543000, completionRate: 72.1, yoyChange: 9.8, openOrderAmount: 345000 },
    { id: 'CU039', name: '合景泰富集团', shippingAmount: 432000, completionRate: 68.5, yoyChange: 16.2, openOrderAmount: 456000 },
    { id: 'CU040', name: '时代中国控股', shippingAmount: 716000, completionRate: 91.3, yoyChange: 11.8, openOrderAmount: 632000 },
  ],
  'SP009': [
    { id: 'CU041', name: '希尔顿酒店集团', shippingAmount: 1234000, completionRate: 65.8, yoyChange: 4.2, openOrderAmount: 1876000 },
    { id: 'CU042', name: '万豪国际酒店', shippingAmount: 987000, completionRate: 58.2, yoyChange: 3.8, openOrderAmount: 1234000 },
    { id: 'CU043', name: '洲际酒店集团', shippingAmount: 765000, completionRate: 72.5, yoyChange: 12.6, openOrderAmount: 987000 },
    { id: 'CU044', name: '雅高酒店集团', shippingAmount: 543000, completionRate: 61.3, yoyChange: 8.5, openOrderAmount: 765000 },
    { id: 'CU045', name: '凯悦酒店集团', shippingAmount: 458000, completionRate: 78.2, yoyChange: 14.2, openOrderAmount: 816000 },
  ],
  'SP010': [
    { id: 'CU046', name: '温德姆酒店集团', shippingAmount: 1567000, completionRate: 112.5, yoyChange: 52.3, openOrderAmount: 234000 },
    { id: 'CU047', name: '最佳西方国际', shippingAmount: 1234000, completionRate: 98.4, yoyChange: 48.2, openOrderAmount: 345000 },
    { id: 'CU048', name: ' Choice 酒店集团', shippingAmount: 987000, completionRate: 85.2, yoyChange: 38.6, openOrderAmount: 456000 },
    { id: 'CU049', name: '东呈酒店集团', shippingAmount: 543000, completionRate: 76.8, yoyChange: 41.2, openOrderAmount: 678000 },
    { id: 'CU050', name: '华住酒店集团', shippingAmount: 287000, completionRate: 68.5, yoyChange: 35.8, openOrderAmount: 234000 },
    { id: 'CU051', name: '锦江酒店集团', shippingAmount: 190000, completionRate: 72.3, yoyChange: 28.4, openOrderAmount: 187000 },
  ],
  'SP011': [
    { id: 'CU052', name: '首旅如家酒店', shippingAmount: 876000, completionRate: 72.1, yoyChange: 8.5, openOrderAmount: 567000 },
    { id: 'CU053', name: '格林酒店集团', shippingAmount: 654000, completionRate: 68.4, yoyChange: 4.2, openOrderAmount: 456000 },
    { id: 'CU054', name: '尚美生活集团', shippingAmount: 543000, completionRate: 75.8, yoyChange: 6.8, openOrderAmount: 345000 },
    { id: 'CU055', name: '亚朵酒店集团', shippingAmount: 432000, completionRate: 82.1, yoyChange: 7.2, openOrderAmount: 234000 },
    { id: 'CU056', name: '开元酒店集团', shippingAmount: 385000, completionRate: 63.7, yoyChange: 6.0, openOrderAmount: 443000 },
  ],
  'SP012': [
    { id: 'CU057', name: '君澜酒店集团', shippingAmount: 543000, completionRate: 78.2, yoyChange: 22.5, openOrderAmount: 234000 },
    { id: 'CU058', name: '万达酒店集团', shippingAmount: 432000, completionRate: 82.1, yoyChange: 18.6, openOrderAmount: 345000 },
    { id: 'CU059', name: '金陵饭店集团', shippingAmount: 321000, completionRate: 76.5, yoyChange: 15.2, openOrderAmount: 234000 },
    { id: 'CU060', name: '岭南酒店集团', shippingAmount: 286000, completionRate: 81.2, yoyChange: 19.5, openOrderAmount: 174000 },
    { id: 'CU061', name: '华侨酒店集团', shippingAmount: 418000, completionRate: 78.4, yoyChange: 18.1, openOrderAmount: 543000 },
  ],
};

export function getCustomersForSalesperson(salespersonId: string): CustomerDetail[] {
  return customerDataMap[salespersonId] ?? [];
}

// ============ Department Aggregated Data ============
export const departmentData: DepartmentData[] = [
  {
    id: 'DEPT01',
    name: '全球渠道部',
    shippingAmount: globalChannelSalespeople.reduce((sum, sp) => sum + sp.shippingAmount, 0),
    targetAmount: globalChannelSalespeople.reduce((sum, sp) => sum + sp.targetAmount, 0),
    completionRate: 0,
    yoyChange: 18.2,
    openOrderAmount: globalChannelSalespeople.reduce((sum, sp) => sum + sp.openOrderAmount, 0),
    salespeople: globalChannelSalespeople,
  },
  {
    id: 'DEPT02',
    name: '国内大客户部',
    shippingAmount: domesticKeyAccountSalespeople.reduce((sum, sp) => sum + sp.shippingAmount, 0),
    targetAmount: domesticKeyAccountSalespeople.reduce((sum, sp) => sum + sp.targetAmount, 0),
    completionRate: 0,
    yoyChange: 16.8,
    openOrderAmount: domesticKeyAccountSalespeople.reduce((sum, sp) => sum + sp.openOrderAmount, 0),
    salespeople: domesticKeyAccountSalespeople,
  },
  {
    id: 'DEPT03',
    name: '国际酒店部',
    shippingAmount: internationalHotelSalespeople.reduce((sum, sp) => sum + sp.shippingAmount, 0),
    targetAmount: internationalHotelSalespeople.reduce((sum, sp) => sum + sp.targetAmount, 0),
    completionRate: 0,
    yoyChange: 22.5,
    openOrderAmount: internationalHotelSalespeople.reduce((sum, sp) => sum + sp.openOrderAmount, 0),
    salespeople: internationalHotelSalespeople,
  },
];

// Calculate completion rates
for (const dept of departmentData) {
  dept.completionRate = +((dept.shippingAmount / dept.targetAmount) * 100).toFixed(1);
}

// ============ Week Options ============
export const weekOptions = [
  { label: '本周', value: '本周', dateRange: '2025-11-24 ~ 2025-11-30' },
  { label: '上周', value: '上周', dateRange: '2025-11-17 ~ 2025-11-23' },
  { label: '近4周', value: '近4周', dateRange: '2025-11-03 ~ 2025-11-30' },
];

export const departmentOptions = ['全部', '全球渠道部', '国内大客户部', '国际酒店部'];

// ============ Format helpers ============
export function formatWan(amount: number): string {
  return (amount / 10000).toFixed(0);
}

export function formatWanDecimal(amount: number, decimals = 0): string {
  return (amount / 10000).toFixed(decimals);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
