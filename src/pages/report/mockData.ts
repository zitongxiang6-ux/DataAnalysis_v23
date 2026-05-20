import type { Report, ReportVersion, RankingItem, Recipient } from './types';

export const reportList: Report[] = [
  { id: '1', name: '第48周销售周报', type: 'weekly', scope: 'company', period: '2025-11-24 ~ 2025-11-30', generatedAt: '2025-12-01 10:00', status: 'completed', fileSize: '1.8 MB' },
  { id: '2', name: '2025年11月月报', type: 'monthly', scope: 'global_channel', period: '2025-11-01 ~ 2025-11-30', generatedAt: '2025-12-01 09:30', status: 'completed', fileSize: '3.2 MB' },
  { id: '3', name: 'Q4 2025季度目标追踪报告', type: 'quarterly', scope: 'domestic_key_account', period: '2025-10-01 ~ 2025-12-31', generatedAt: '2025-11-29 18:00', status: 'completed', fileSize: '2.1 MB' },
  { id: '4', name: 'Q3 2025返利计算报告', type: 'quarterly', scope: 'international_hotel', period: '2025-07-01 ~ 2025-09-30', generatedAt: '2025-11-28 14:20', status: 'completed', fileSize: '4.5 MB' },
  { id: '5', name: '第47周销售周报', type: 'weekly', scope: 'company', period: '2025-11-17 ~ 2025-11-23', generatedAt: '2025-11-24 08:00', status: 'completed', fileSize: '1.7 MB' },
  { id: '6', name: '2025年10月客户行为分析', type: 'monthly', scope: 'domestic_key_account', period: '2025-10-01 ~ 2025-10-31', generatedAt: '2025-11-22 16:45', status: 'completed', fileSize: '2.8 MB' },
  { id: '7', name: 'Q3 2025渠道经销商签约报告', type: 'quarterly', scope: 'global_channel', period: '2025-07-01 ~ 2025-09-30', generatedAt: '2025-11-20 11:30', status: 'completed', fileSize: '3.9 MB' },
  { id: '8', name: '第46周销售周报', type: 'weekly', scope: 'company', period: '2025-11-10 ~ 2025-11-16', generatedAt: '2025-11-17 08:00', status: 'processing', fileSize: '--' },
  { id: '9', name: '2025年9月月报', type: 'monthly', scope: 'international_hotel', period: '2025-09-01 ~ 2025-09-30', generatedAt: '2025-10-02 10:15', status: 'completed', fileSize: '2.9 MB' },
  { id: '10', name: '第45周销售周报', type: 'weekly', scope: 'company', period: '2025-11-03 ~ 2025-11-09', generatedAt: '2025-11-10 08:00', status: 'completed', fileSize: '1.6 MB' },
  { id: '11', name: 'Q2 2025季度综合报告', type: 'quarterly', scope: 'company', period: '2025-04-01 ~ 2025-06-30', generatedAt: '2025-07-05 12:00', status: 'completed', fileSize: '5.1 MB' },
  { id: '12', name: '2025年8月月报', type: 'monthly', scope: 'global_channel', period: '2025-08-01 ~ 2025-08-31', generatedAt: '2025-09-01 09:00', status: 'completed', fileSize: '3.0 MB' },
  { id: '13', name: '第44周销售周报', type: 'weekly', scope: 'domestic_key_account', period: '2025-10-27 ~ 2025-11-02', generatedAt: '2025-11-03 08:00', status: 'completed', fileSize: '1.5 MB' },
  { id: '14', name: 'Q3 2025国际酒店部报告', type: 'quarterly', scope: 'international_hotel', period: '2025-07-01 ~ 2025-09-30', generatedAt: '2025-11-15 15:30', status: 'pending', fileSize: '--' },
  { id: '15', name: '2025年10月大客户部专报', type: 'monthly', scope: 'domestic_key_account', period: '2025-10-01 ~ 2025-10-31', generatedAt: '2025-11-02 14:00', status: 'completed', fileSize: '2.3 MB' },
  { id: '16', name: '第43周销售周报', type: 'weekly', scope: 'company', period: '2025-10-20 ~ 2025-10-26', generatedAt: '2025-10-27 08:00', status: 'completed', fileSize: '1.9 MB' },
  { id: '17', name: '2025年7月月报', type: 'monthly', scope: 'company', period: '2025-07-01 ~ 2025-07-31', generatedAt: '2025-08-01 09:00', status: 'completed', fileSize: '2.7 MB' },
  { id: '18', name: 'Q2 2025渠道经销商报告', type: 'quarterly', scope: 'global_channel', period: '2025-04-01 ~ 2025-06-30', generatedAt: '2025-07-10 11:00', status: 'completed', fileSize: '4.2 MB' },
];

export const versionHistoryData: ReportVersion[] = [
  { version: 'v3', generatedAt: '2025-12-01 14:32', fileSize: '2.1 MB', period: '2025-11-24 ~ 2025-11-30' },
  { version: 'v2', generatedAt: '2025-12-01 10:15', fileSize: '2.0 MB', period: '2025-11-24 ~ 2025-11-30' },
  { version: 'v1.1', generatedAt: '2025-11-30 22:00', fileSize: '1.95 MB', period: '2025-11-24 ~ 2025-11-30' },
  { version: 'v1', generatedAt: '2025-11-30 18:00', fileSize: '1.9 MB', period: '2025-11-24 ~ 2025-11-30' },
  { version: 'v0.9', generatedAt: '2025-11-30 12:30', fileSize: '1.8 MB', period: '2025-11-24 ~ 2025-11-30' },
  { version: 'v0.8', generatedAt: '2025-11-29 20:00', fileSize: '1.7 MB', period: '2025-11-17 ~ 2025-11-23' },
];

export const rankingData: RankingItem[] = [
  { rank: 1, name: '销售一部', amount: 2840000, target: 3000000, completion: 94.7, change: 5.2 },
  { rank: 2, name: '大客户部', amount: 2560000, target: 2800000, completion: 91.4, change: 3.8 },
  { rank: 3, name: '渠道部', amount: 2310000, target: 2600000, completion: 88.8, change: -1.2 },
  { rank: 4, name: '国际酒店部', amount: 1980000, target: 2400000, completion: 82.5, change: 7.1 },
  { rank: 5, name: '销售二部', amount: 1750000, target: 2200000, completion: 79.5, change: -3.5 },
  { rank: 6, name: '销售三部', amount: 1620000, target: 2000000, completion: 81.0, change: 2.1 },
  { rank: 7, name: '电商部', amount: 980000, target: 1200000, completion: 81.7, change: 12.3 },
  { rank: 8, name: '市场部', amount: 720000, target: 1000000, completion: 72.0, change: -5.8 },
];

export const recipientsData: Recipient[] = [
  { id: '1', name: '张经理', email: 'zhang@company.com', selected: false },
  { id: '2', name: '李总监', email: 'li@company.com', selected: false },
  { id: '3', name: '王主管', email: 'wang@company.com', selected: false },
  { id: '4', name: '赵经理', email: 'zhao@company.com', selected: false },
  { id: '5', name: '刘助理', email: 'liu@company.com', selected: false },
];

export const trendChartData = [
  { period: '第42周', current: 420000, previous: 380000 },
  { period: '第43周', current: 450000, previous: 400000 },
  { period: '第44周', current: 480000, previous: 420000 },
  { period: '第45周', current: 510000, previous: 460000 },
  { period: '第46周', current: 470000, previous: 490000 },
  { period: '第47周', current: 560000, previous: 500000 },
  { period: '第48周', current: 620000, previous: 540000 },
];

export const revenueBreakdownData = [
  { category: '国内渠道', amount: 1280000, percentage: 45 },
  { category: '国际渠道', amount: 854000, percentage: 30 },
  { category: '大客户直销', amount: 426000, percentage: 15 },
  { category: '电商平台', amount: 284000, percentage: 10 },
];

export const doughnutData = [
  { name: '国内渠道', value: 45, fill: '#3B82F6' },
  { name: '国际渠道', value: 30, fill: '#06B6D4' },
  { name: '大客户直销', value: 15, fill: '#6366F1' },
  { name: '电商平台', value: 10, fill: '#10B981' },
];

export const top10Data = [
  { name: '恒大地产', value: 520000 },
  { name: '万科地产', value: 480000 },
  { name: '保利地产', value: 420000 },
  { name: '碧桂园', value: 380000 },
  { name: '龙湖地产', value: 350000 },
  { name: '中海地产', value: 310000 },
  { name: '华润置地', value: 280000 },
  { name: '绿城中国', value: 240000 },
  { name: '融创中国', value: 200000 },
  { name: '金地集团', value: 180000 },
];

export const comparisonData = [
  { metric: '总营收', current: '¥284万', previous: '¥256万', change: '+10.9%' },
  { metric: '订单数', current: '1,247', previous: '1,100', change: '+13.4%' },
  { metric: '平均订单金额', current: '¥22,780', previous: '¥23,270', change: '-2.1%' },
  { metric: '新增客户', current: '42', previous: '38', change: '+10.5%' },
  { metric: '目标完成率', current: '94.7%', previous: '89.2%', change: '+5.5%' },
  { metric: '回款金额', current: '¥198万', previous: '¥172万', change: '+15.1%' },
];

export const kpiOverviewData = [
  { label: '总营收', value: 2840000, prefix: '¥', format: true, trend: 10.9 },
  { label: '总订单数', value: 1247, prefix: '', format: false, trend: 13.4 },
  { label: '平均订单金额', value: 22780, prefix: '¥', format: false, trend: -2.1 },
  { label: '目标完成率', value: 94.7, prefix: '', suffix: '%', format: false, trend: 5.5 },
];
