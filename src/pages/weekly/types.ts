// Types for Weekly Report page

export interface SalespersonDetail {
  id: string;
  name: string;
  customerCount: number;
  shippingAmount: number;
  targetAmount: number;
  completionRate: number;
  yoyChange: number;
  openOrderAmount: number;
  avatar?: string;
}

export interface CustomerDetail {
  id: string;
  name: string;
  shippingAmount: number;
  completionRate: number;
  yoyChange: number;
  openOrderAmount: number;
}

export interface DepartmentData {
  id: string;
  name: string;
  shippingAmount: number;
  targetAmount: number;
  completionRate: number;
  yoyChange: number;
  openOrderAmount: number;
  salespeople: SalespersonDetail[];
}

export interface KpiData {
  totalShipping: number;
  targetCompletion: number;
  yoyGrowth: number;
  openOrderAmount: number;
  totalShippingTrend: number;
  targetCompletionTrend: number;
  yoyGrowthTrend: number;
  openOrderTrend: number;
}

export interface TrendDataPoint {
  day: string;
  dayShort: string;
  dailyAmount: number;
  cumulativeAmount: number;
}

export type WeekOption = '本周' | '上周' | '近4周';

export type DepartmentFilter = '全部' | '全球渠道部' | '国内大客户部' | '国际酒店部';
