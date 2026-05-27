import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Download, Printer, TrendingDown, TrendingUp } from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from 'recharts';
import { Toaster, toast } from 'sonner';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { reportList } from './report/mockData';
import type { Report, ReportScope, ReportType } from './report/types';

type DepartmentScope = Extract<ReportScope, 'global_channel' | 'domestic_key_account' | 'international_hotel'>;

type DepartmentProfile = {
  scope: DepartmentScope;
  name: string;
  manager: string;
  customerFocus: string;
  monthlyAmount: number;
  monthlyTarget: number;
  openOrder: number;
  yearDone: number;
  yearTarget: number;
  completion: number;
  yoy: number;
  mom: number;
  groupNames: string[];
  customerTypes: Array<{ name: string; value: number; fill: string }>;
  salespeople: Array<{ name: string; group: string; amount: number; completion: number; change: number }>;
  customers: Array<{ name: string; type: string; amount: number; openOrder: number; change: number }>;
  risks: Array<{ orderNo: string; customer: string; owner: string; amount: number; hours: number; status: string }>;
};

type CompanyTopCustomer = {
  rank: number;
  name: string;
  scope: DepartmentScope;
  customerType: string;
  owner: string;
  annual2025: number;
  ytd2026: number;
  yoy: number;
  status: '稳定贡献' | '冲刺提升' | '重点预警';
  action: string;
};

const departmentProfiles: Record<DepartmentScope, DepartmentProfile> = {
  global_channel: {
    scope: 'global_channel',
    name: '全球渠道部',
    manager: '李总监',
    customerFocus: '国内渠道商、国际渠道商、ODM客户',
    monthlyAmount: 6701,
    monthlyTarget: 6200,
    openOrder: 2180,
    yearDone: 26500,
    yearTarget: 52000,
    completion: 108.1,
    yoy: 19.9,
    mom: 13.4,
    groupNames: ['国内渠道组', '国际渠道组', 'ODM组'],
    customerTypes: [
      { name: '国内渠道商', value: 3420, fill: '#2563EB' },
      { name: '国际渠道商', value: 1760, fill: '#059669' },
      { name: 'ODM客户', value: 1521, fill: '#D97706' },
    ],
    salespeople: [
      { name: '李姝', group: '国内渠道组', amount: 1260, completion: 113.5, change: 12.8 },
      { name: '张伟', group: '国际渠道组', amount: 1180, completion: 108.2, change: 18.4 },
      { name: '王强', group: 'ODM组', amount: 980, completion: 104.7, change: 9.6 },
      { name: '陈芸', group: '国内渠道组', amount: 820, completion: 96.4, change: 5.2 },
      { name: '刘舟', group: '国际渠道组', amount: 760, completion: 94.8, change: -2.1 },
    ],
    customers: [
      { name: '深圳华强科技', type: '国内渠道商', amount: 1856, openOrder: 386, change: 22.1 },
      { name: '上海新联电子', type: '国内渠道商', amount: 1425, openOrder: 52, change: 17.8 },
      { name: '新加坡AsiaTech', type: '国际渠道商', amount: 985, openOrder: 128, change: 30.3 },
      { name: '印度MumbaiTech', type: 'ODM客户', amount: 652, openOrder: 86, change: 24.8 },
      { name: '迪拜GulfBuild', type: '国际渠道商', amount: 598, openOrder: 96, change: 25.6 },
    ],
    risks: [
      { orderNo: 'SO-2026-8001', customer: '深圳华强科技', owner: '李姝', amount: 386, hours: 72, status: '待交付' },
      { orderNo: 'SO-2026-8023', customer: '新加坡AsiaTech', owner: '张伟', amount: 128, hours: 36, status: '清关中' },
      { orderNo: 'SO-2026-8048', customer: '迪拜GulfBuild', owner: '张伟', amount: 96, hours: 28, status: '排产中' },
    ],
  },
  domestic_key_account: {
    scope: 'domestic_key_account',
    name: '国内大客户部',
    manager: '周总',
    customerFocus: '国内重点渠道商、国内地产客户',
    monthlyAmount: 2479,
    monthlyTarget: 2800,
    openOrder: 1260,
    yearDone: 10280,
    yearTarget: 32000,
    completion: 88.5,
    yoy: 11.5,
    mom: 6.8,
    groupNames: ['重点渠道组', '地产客户组', '项目跟进组'],
    customerTypes: [
      { name: '国内重点渠道商', value: 1280, fill: '#2563EB' },
      { name: '国内地产客户', value: 860, fill: '#7C3AED' },
      { name: '项目客户', value: 339, fill: '#0EA5E9' },
    ],
    salespeople: [
      { name: '刘敏', group: '重点渠道组', amount: 620, completion: 96.8, change: 8.4 },
      { name: '赵强', group: '地产客户组', amount: 540, completion: 91.2, change: 4.6 },
      { name: '陈杰', group: '项目跟进组', amount: 455, completion: 87.5, change: -1.8 },
      { name: '黄磊', group: '重点渠道组', amount: 386, completion: 83.9, change: 3.2 },
      { name: '杨丽', group: '地产客户组', amount: 310, completion: 78.5, change: -4.1 },
    ],
    customers: [
      { name: '北京中科创新', type: '国内重点渠道商', amount: 856, openOrder: 215, change: 18.9 },
      { name: '杭州智联网终端', type: '国内地产客户', amount: 742, openOrder: 96, change: 9.1 },
      { name: '成都西部电子', type: '国内地产客户', amount: 598, openOrder: 180, change: -6.9 },
      { name: '武汉光谷科技', type: '项目客户', amount: 485, openOrder: 72, change: -8.2 },
      { name: '南京瑞景集团', type: '国内重点渠道商', amount: 420, openOrder: 60, change: 9.4 },
    ],
    risks: [
      { orderNo: 'SO-2026-8105', customer: '成都西部电子', owner: '杨丽', amount: 180, hours: 58, status: '待确认' },
      { orderNo: 'SO-2026-8112', customer: '武汉光谷科技', owner: '陈杰', amount: 72, hours: 44, status: '合同复核' },
      { orderNo: 'SO-2026-8130', customer: '北京中科创新', owner: '刘敏', amount: 215, hours: 30, status: '待交付' },
    ],
  },
  international_hotel: {
    scope: 'international_hotel',
    name: '国际酒店部',
    manager: '王总',
    customerFocus: '国际重点渠道商、国际发展组客户、酒店项目客户',
    monthlyAmount: 2320,
    monthlyTarget: 2100,
    openOrder: 1510,
    yearDone: 9200,
    yearTarget: 26000,
    completion: 110.5,
    yoy: 22.4,
    mom: 16.8,
    groupNames: ['国际重点渠道组', '发展组', '酒店项目组'],
    customerTypes: [
      { name: '国际重点渠道商', value: 1120, fill: '#2563EB' },
      { name: '国际发展组客户', value: 680, fill: '#059669' },
      { name: '酒店项目客户', value: 520, fill: '#D97706' },
    ],
    salespeople: [
      { name: '王强', group: '国际重点渠道组', amount: 710, completion: 118.4, change: 21.6 },
      { name: '赵晴', group: '发展组', amount: 520, completion: 109.2, change: 18.5 },
      { name: '陈运', group: '酒店项目组', amount: 418, completion: 104.6, change: 12.8 },
      { name: '孙宁', group: '国际重点渠道组', amount: 365, completion: 96.3, change: 6.1 },
      { name: '林珊', group: '发展组', amount: 288, completion: 86.9, change: -2.6 },
    ],
    customers: [
      { name: '新加坡AsiaTech', type: '国际重点渠道商', amount: 985, openOrder: 128, change: 30.3 },
      { name: '迪拜GulfBuild', type: '国际重点渠道商', amount: 805, openOrder: 96, change: 25.6 },
      { name: '马来西亚MegaHome', type: '国际发展组客户', amount: 640, openOrder: 64, change: 21.4 },
      { name: '越南VinaTech', type: '国际发展组客户', amount: 585, openOrder: 72, change: 29.2 },
      { name: '泰国BangkokHome', type: '酒店项目客户', amount: 438, openOrder: 44, change: 20.9 },
    ],
    risks: [
      { orderNo: 'SO-2026-8201', customer: '新加坡AsiaTech', owner: '王强', amount: 128, hours: 36, status: '清关中' },
      { orderNo: 'SO-2026-8216', customer: '迪拜GulfBuild', owner: '孙宁', amount: 96, hours: 32, status: '排产中' },
      { orderNo: 'SO-2026-8230', customer: '越南VinaTech', owner: '赵晴', amount: 72, hours: 26, status: '待发货' },
    ],
  },
};

const companyTop30Customers: CompanyTopCustomer[] = [
  { rank: 1, name: '深圳华强科技', scope: 'global_channel', customerType: '国内渠道商', owner: '李姝', annual2025: 5680, ytd2026: 2856, yoy: 22.5, status: '稳定贡献', action: '锁定下季度复购订单' },
  { rank: 2, name: '上海新联电子', scope: 'global_channel', customerType: '国内渠道商', owner: '李姝', annual2025: 4856, ytd2026: 2425, yoy: 18.2, status: '稳定贡献', action: '跟进重点项目交付节奏' },
  { rank: 3, name: '新加坡AsiaTech', scope: 'international_hotel', customerType: '国际重点渠道商', owner: '王强', annual2025: 3650, ytd2026: 1865, yoy: 28.6, status: '稳定贡献', action: '提前锁定Q3排期' },
  { rank: 4, name: '北京中科创新', scope: 'domestic_key_account', customerType: '国内重点渠道商', owner: '刘敏', annual2025: 3280, ytd2026: 1520, yoy: 16.8, status: '稳定贡献', action: '推进在谈项目验收' },
  { rank: 5, name: '杭州智联网终端', scope: 'domestic_key_account', customerType: '国内地产客户', owner: '赵强', annual2025: 2985, ytd2026: 1425, yoy: 12.1, status: '稳定贡献', action: '保持地产项目开单节奏' },
  { rank: 6, name: '广州恒通科技', scope: 'global_channel', customerType: '国内渠道商', owner: '陈芸', annual2025: 2880, ytd2026: 1318, yoy: 10.5, status: '冲刺提升', action: '补齐在谈订单转化' },
  { rank: 7, name: '印度MumbaiTech', scope: 'global_channel', customerType: 'ODM客户', owner: '王强', annual2025: 2760, ytd2026: 1225, yoy: 24.8, status: '稳定贡献', action: '提升ODM交付稳定性' },
  { rank: 8, name: '东莞精密制造', scope: 'global_channel', customerType: '国内渠道商', owner: '刘舟', annual2025: 2680, ytd2026: 185, yoy: -42.6, status: '重点预警', action: '安排专项回访排查流失原因' },
  { rank: 9, name: '成都西部电子', scope: 'domestic_key_account', customerType: '国内地产客户', owner: '杨丽', annual2025: 2420, ytd2026: 865, yoy: -6.9, status: '冲刺提升', action: '优先处理未结订单' },
  { rank: 10, name: '武汉光谷科技', scope: 'domestic_key_account', customerType: '项目客户', owner: '陈杰', annual2025: 2150, ytd2026: 785, yoy: -8.2, status: '冲刺提升', action: '复盘报价与交付周期' },
  { rank: 11, name: '南京瑞景集团', scope: 'domestic_key_account', customerType: '国内重点渠道商', owner: '黄磊', annual2025: 2020, ytd2026: 920, yoy: 9.4, status: '稳定贡献', action: '扩大重点项目覆盖' },
  { rank: 12, name: '广州智远科技', scope: 'international_hotel', customerType: '国际发展组客户', owner: '赵晴', annual2025: 1960, ytd2026: 910, yoy: 18.7, status: '稳定贡献', action: '推进海外样板项目' },
  { rank: 13, name: '迪拜GulfBuild', scope: 'international_hotel', customerType: '国际重点渠道商', owner: '孙宁', annual2025: 1880, ytd2026: 980, yoy: 25.6, status: '稳定贡献', action: '锁定下半年批量订单' },
  { rank: 14, name: '青岛海联智能', scope: 'global_channel', customerType: '国内渠道商', owner: '陈芸', annual2025: 1760, ytd2026: 760, yoy: 11.0, status: '稳定贡献', action: '持续推动复购' },
  { rank: 15, name: '厦门海沧科技', scope: 'global_channel', customerType: '国内渠道商', owner: '李姝', annual2025: 1680, ytd2026: 705, yoy: 10.1, status: '稳定贡献', action: '维护重点渠道关系' },
  { rank: 16, name: '西安宏图科技', scope: 'domestic_key_account', customerType: '国内地产客户', owner: '赵强', annual2025: 1650, ytd2026: 690, yoy: 9.7, status: '稳定贡献', action: '跟进新增项目立项' },
  { rank: 17, name: '泉州海翼智能', scope: 'global_channel', customerType: 'ODM客户', owner: '王强', annual2025: 1520, ytd2026: 610, yoy: 6.3, status: '冲刺提升', action: '提升订单频次' },
  { rank: 18, name: '重庆新兴科技', scope: 'domestic_key_account', customerType: '项目客户', owner: '陈杰', annual2025: 1480, ytd2026: 550, yoy: 5.8, status: '冲刺提升', action: '推进项目签收' },
  { rank: 19, name: '苏州云谷电子', scope: 'global_channel', customerType: '国内渠道商', owner: '刘舟', annual2025: 1420, ytd2026: 530, yoy: 4.2, status: '冲刺提升', action: '提升动销节奏' },
  { rank: 20, name: '泰国BangkokHome', scope: 'international_hotel', customerType: '酒店项目客户', owner: '陈运', annual2025: 1380, ytd2026: 610, yoy: 20.9, status: '稳定贡献', action: '推动酒店项目二次采购' },
  { rank: 21, name: '马来西亚MegaHome', scope: 'international_hotel', customerType: '国际发展组客户', owner: '赵晴', annual2025: 1320, ytd2026: 675, yoy: 21.4, status: '稳定贡献', action: '争取区域渠道代理' },
  { rank: 22, name: '宁波东方家居', scope: 'domestic_key_account', customerType: '国内地产客户', owner: '杨丽', annual2025: 1280, ytd2026: 420, yoy: -3.4, status: '重点预警', action: '排查项目延期原因' },
  { rank: 23, name: '越南VinaTech', scope: 'international_hotel', customerType: '国际发展组客户', owner: '赵晴', annual2025: 1240, ytd2026: 660, yoy: 29.2, status: '稳定贡献', action: '提前排产保障交付' },
  { rank: 24, name: '佛山智造联盟', scope: 'global_channel', customerType: 'ODM客户', owner: '王强', annual2025: 1180, ytd2026: 430, yoy: 3.1, status: '冲刺提升', action: '推进新品打样转量产' },
  { rank: 25, name: '天津云谷电子', scope: 'domestic_key_account', customerType: '国内重点渠道商', owner: '刘敏', annual2025: 1160, ytd2026: 510, yoy: 4.3, status: '冲刺提升', action: '补齐重点产品组合' },
  { rank: 26, name: '韩国SeoulBuild', scope: 'international_hotel', customerType: '国际重点渠道商', owner: '孙宁', annual2025: 1120, ytd2026: 520, yoy: 18.2, status: '稳定贡献', action: '建立月度滚动预测' },
  { rank: 27, name: '合肥科创园', scope: 'domestic_key_account', customerType: '项目客户', owner: '陈杰', annual2025: 1080, ytd2026: 390, yoy: 2.8, status: '冲刺提升', action: '推动验收节点前移' },
  { rank: 28, name: '阿联酋HomeLink', scope: 'international_hotel', customerType: '酒店项目客户', owner: '陈运', annual2025: 1040, ytd2026: 480, yoy: 16.5, status: '稳定贡献', action: '跟进Q3补单机会' },
  { rank: 29, name: '常州瑞科智能', scope: 'global_channel', customerType: '国内渠道商', owner: '陈芸', annual2025: 1010, ytd2026: 360, yoy: 1.6, status: '冲刺提升', action: '提升渠道活跃度' },
  { rank: 30, name: '长沙星城科技', scope: 'domestic_key_account', customerType: '国内地产客户', owner: '黄磊', annual2025: 980, ytd2026: 330, yoy: -1.5, status: '重点预警', action: '制定专项挽回计划' },
];

const periodConfig: Record<ReportType, {
  label: string;
  unit: string;
  previousUnit: string;
  periodText: string;
  amountRatio: number;
  targetRatio: number;
  openOrderRatio: number;
  trendLabels: string[];
  trendWeights: number[];
  fileName: string;
}> = {
  weekly: {
    label: '周报',
    unit: '本周',
    previousUnit: '上周',
    periodText: '2026年5月12日 - 5月18日（第20周）',
    amountRatio: 0.23,
    targetRatio: 0.23,
    openOrderRatio: 0.34,
    trendLabels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    trendWeights: [0.11, 0.15, 0.13, 0.2, 0.17, 0.12, 0.12],
    fileName: '周报',
  },
  monthly: {
    label: '月报',
    unit: '本月',
    previousUnit: '上月',
    periodText: '2026年5月1日 - 5月31日',
    amountRatio: 1,
    targetRatio: 1,
    openOrderRatio: 1,
    trendLabels: ['第1周', '第2周', '第3周', '第4周', '第5周'],
    trendWeights: [0.18, 0.21, 0.2, 0.24, 0.17],
    fileName: '月报',
  },
  quarterly: {
    label: '季报',
    unit: '本季度',
    previousUnit: '上季度',
    periodText: '2025年4月1日 - 6月30日（Q2）',
    amountRatio: 2.76,
    targetRatio: 2.7,
    openOrderRatio: 1.12,
    trendLabels: ['4月', '5月', '6月'],
    trendWeights: [0.31, 0.36, 0.33],
    fileName: '季报',
  },
};

const scopeFallback: Record<ReportScope, DepartmentScope> = {
  company: 'global_channel',
  global_channel: 'global_channel',
  domestic_key_account: 'domestic_key_account',
  international_hotel: 'international_hotel',
  international_channel_group: 'international_hotel',
  domestic_channel_group: 'global_channel',
  odm_group: 'global_channel',
};

function inferReportType(pathname: string): ReportType {
  if (pathname.startsWith('/monthly-report/')) return 'monthly';
  if (pathname.startsWith('/quarterly-report/')) return 'quarterly';
  return 'weekly';
}

function currencyWan(value: number) {
  if (value >= 10000) return `¥${(value / 10000).toFixed(2)}亿`;
  return `¥${Math.round(value).toLocaleString()}万`;
}

function getRankClass(rank: number) {
  if (rank === 1) return 'bg-amber-100 text-amber-700';
  if (rank === 2) return 'bg-slate-100 text-slate-600';
  if (rank === 3) return 'bg-orange-100 text-orange-700';
  return 'bg-blue-50 text-blue-600';
}

function TrendText({ value }: { value: number }) {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 font-medium ${positive ? 'text-red-600' : 'text-emerald-600'}`}>
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function tooltipAmount(value: unknown) {
  return currencyWan(Number(value ?? 0));
}

function getMarketLabel(item: CompanyTopCustomer) {
  if (
    item.customerType.includes('国际')
    || item.customerType.includes('ODM')
    || /Asia|Mumbai|Gulf|Mega|Vina|Bangkok|Seoul|HomeLink/i.test(item.name)
  ) {
    return '国际';
  }
  return '国内';
}

function getProgressStatus(progress: number) {
  if (progress >= 40) return '正常';
  if (progress >= 35) return '关注';
  return '预警';
}

export default function DepartmentReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportId } = useParams();
  const reportType = inferReportType(location.pathname);
  const period = periodConfig[reportType];

  const report = useMemo(() => {
    const stateReport = (location.state as { report?: Report } | null)?.report;
    return stateReport || reportList.find((item) => item.id === reportId);
  }, [location.state, reportId]);

  const scope = scopeFallback[report?.scope || 'global_channel'];
  const profile = departmentProfiles[scope];
  const amount = Math.round(profile.monthlyAmount * period.amountRatio);
  const target = Math.round(profile.monthlyTarget * period.targetRatio);
  const completion = Number(((amount / target) * 100).toFixed(1));
  const openOrder = Math.round(profile.openOrder * period.openOrderRatio);
  const yearRate = Number(((profile.yearDone / profile.yearTarget) * 100).toFixed(1));

  const trendData = useMemo(() => {
    let cumulative = 0;
    return period.trendLabels.map((label, index) => {
      const ship = Math.round(amount * period.trendWeights[index]);
      cumulative += ship;
      return { label, 开单额: ship, 累计开单额: cumulative };
    });
  }, [amount, period]);

  const scaledSalespeople = profile.salespeople.map((item) => ({
    ...item,
    amount: Math.round(item.amount * period.amountRatio),
  }));
  const salespersonChartData = scaledSalespeople.map((item) => ({
    name: item.name,
    [period.unit]: item.amount,
    [period.previousUnit]: Math.round(item.amount / (1 + item.change / 100)),
    目标完成率: item.completion,
  }));
  const scaledCustomers = profile.customers.map((item) => ({
    ...item,
    amount: Math.round(item.amount * period.amountRatio),
    openOrder: Math.round(item.openOrder * period.openOrderRatio),
  }));
  const scaledRisks = profile.risks.map((item) => ({
    ...item,
    amount: Math.round(item.amount * period.openOrderRatio),
  }));
  const scaledCustomerTypes = profile.customerTypes.map((item) => ({
    ...item,
    value: Math.round(item.value * period.amountRatio),
  }));
  const departmentCompanyTopCustomers = companyTop30Customers
    .filter((item) => item.scope === scope)
    .map((item) => {
      const currentAmount = reportType === 'quarterly'
        ? Math.round(item.ytd2026 * 0.58)
        : Math.round(item.ytd2026 * 0.24);
      return {
        ...item,
        currentAmount,
        progress: Number(((item.ytd2026 / item.annual2025) * 100).toFixed(1)),
        market: getMarketLabel(item),
        progressStatus: getProgressStatus(Number(((item.ytd2026 / item.annual2025) * 100).toFixed(1))),
      };
    });
  const topCustomerAmount = departmentCompanyTopCustomers.reduce((sum, item) => sum + item.currentAmount, 0);
  const topCustomerYtdAmount = departmentCompanyTopCustomers.reduce((sum, item) => sum + item.ytd2026, 0);
  const riskCustomerCount = departmentCompanyTopCustomers.filter((item) => item.progressStatus === '预警').length;
  const normalCustomerCount = departmentCompanyTopCustomers.filter((item) => item.progressStatus === '正常').length;
  const attentionCustomerCount = departmentCompanyTopCustomers.filter((item) => item.progressStatus === '关注').length;
  const topDepartmentCustomer = departmentCompanyTopCustomers[0];
  const slowestProgressCustomer = departmentCompanyTopCustomers.reduce(
    (slowest, item) => (item.progress < slowest.progress ? item : slowest),
    departmentCompanyTopCustomers[0] ?? { name: '-', progress: 0 },
  );
  const comparisonLabel = reportType === 'monthly' ? '去年同月' : reportType === 'quarterly' ? '去年同季度' : '去年同期';
  const bestTrendPoint = trendData.reduce(
    (best, item) => (item.开单额 > best.开单额 ? item : best),
    trendData[0] ?? { label: period.unit, 开单额: amount, 累计开单额: amount },
  );
  const lastTrendPoint = trendData[trendData.length - 1] ?? bestTrendPoint;
  const tailSalesperson = scaledSalespeople[scaledSalespeople.length - 1];
  const tailCustomer = scaledCustomers[scaledCustomers.length - 1];

  return (
    <Layout contentClassName="bg-[#F8FAFC]">
      <Toaster position="bottom-right" />
      <div className="mx-auto max-w-[1360px] space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" className="mb-3 gap-1.5 px-0 text-text-secondary" onClick={() => navigate('/report-center')}>
              <ArrowLeft className="h-4 w-4" />
              返回销售报告
            </Button>
            <h1 className="text-[24px] font-bold text-slate-900">
              {report?.name || `${profile.name}${period.label}`}
            </h1>
            <p className="mt-1 text-[13px] text-slate-500">
              统计周期：{period.periodText}（部门级，仅展示{profile.name}数据）
            </p>
          </div>
          <div className="flex items-center gap-2 pt-8">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              打印
            </Button>
            <Button size="sm" onClick={() => toast.success(`${profile.name}${period.fileName}已开始导出`)}>
              <Download className="h-4 w-4" />
              导出报告
            </Button>
          </div>
        </div>

        <Card>
          <SectionHeader index={1} title={`${period.unit}核心指标总览`} />
          <div className="grid grid-cols-2 gap-4 p-6 lg:grid-cols-4">
            <MetricCard label={`${period.unit}开单额`} value={currencyWan(amount)} sub={`部门目标 ${currencyWan(target)}`} change={profile.mom} changeSuffix={`环比${period.previousUnit}`} color="border-t-blue-600" />
            <MetricCard label="未结束订单金额" value={currencyWan(openOrder)} sub={`${scaledRisks.length} 笔重点跟进订单`} change={-4.8} changeSuffix={`环比${period.previousUnit}`} inverse color="border-t-amber-600" />
            <MetricCard label="年完成额" value={currencyWan(profile.yearDone)} sub={`年度目标 ${currencyWan(profile.yearTarget)}`} changeText="进度正常" color="border-t-teal-600" />
            <MetricCard label="年完成率" value={`${yearRate}%`} sub="按当前部门年度目标计算" changeText="超过公司完成率3%" color="border-t-rose-600" />
          </div>
        </Card>

        <Card>
          <SectionHeader index={2} title={`${period.unit}经营总结`} />
          <SummaryBox>
            <div className="space-y-3">
              <p className="indent-8">
                {profile.name}{period.unit}开单额 <Highlight>{currencyWan(amount)}</Highlight>，目标完成率 <Highlight>{completion}%</Highlight>。
                同比{comparisonLabel} <TrendText value={profile.yoy} />，环比{period.previousUnit} <TrendText value={profile.mom} />，
                整体开单节奏好于{period.previousUnit}，且同比{comparisonLabel}表现更好，说明当前客户需求、订单交付和重点项目转化均较基准周期改善。
              </p>
              <p className="indent-8">
                从时间节奏看，<Highlight>{bestTrendPoint.label}</Highlight>开单 <Highlight>{currencyWan(bestTrendPoint.开单额)}</Highlight>，
                是{period.unit}表现最好的阶段；截至{lastTrendPoint.label}累计开单达到 <Highlight>{currencyWan(lastTrendPoint.累计开单额)}</Highlight>。
                后续应延续高峰阶段的客户跟进节奏，并复盘低峰阶段是否存在排产、签收或客户确认滞后的问题。
              </p>
              <p className="indent-8">
                从人员贡献看，<Highlight>{scaledSalespeople[0]?.name}</Highlight>{period.unit}开单 <Highlight>{currencyWan(scaledSalespeople[0]?.amount || 0)}</Highlight>，
                完成率 <Highlight>{scaledSalespeople[0]?.completion}%</Highlight>，是部门主要拉动项；
                <Highlight>{scaledSalespeople[1]?.name}</Highlight> 与 <Highlight>{scaledSalespeople[2]?.name}</Highlight> 保持第二梯队贡献。
                尾部业务员为 <Highlight>{tailSalesperson?.name || '-'}</Highlight>，{period.unit}开单 <Highlight>{currencyWan(tailSalesperson?.amount || 0)}</Highlight>，
                完成率 <Highlight>{tailSalesperson?.completion || 0}%</Highlight>，需要重点补足客户拜访、在谈订单推进和尾单转化。
              </p>
              <p className="indent-8">
                从客户结构看，<Highlight>{scaledCustomerTypes[0].name}</Highlight> 贡献 <Highlight>{currencyWan(scaledCustomerTypes[0].value)}</Highlight>，
                是当前部门最核心的开单来源；重点客户中 <Highlight>{scaledCustomers[0]?.name}</Highlight> 开单
                <Highlight>{currencyWan(scaledCustomers[0]?.amount || 0)}</Highlight>，同比 <TrendText value={scaledCustomers[0]?.change || 0} />，
                头部客户复购和项目推进仍是增长的主要支撑。尾部客户为 <Highlight>{tailCustomer?.name || '-'}</Highlight>，
                {period.unit}开单 <Highlight>{currencyWan(tailCustomer?.amount || 0)}</Highlight>，未结束订单 <Highlight>{currencyWan(tailCustomer?.openOrder || 0)}</Highlight>，
                需要确认需求稳定性、报价推进和交付节点，避免尾部客户继续拖低部门整体转化。
              </p>
              <p className="indent-8">
                从交付风险看，未结束订单金额 <Highlight>{currencyWan(openOrder)}</Highlight>，其中
                <Highlight>{scaledRisks[0]?.customer}</Highlight> 的 {scaledRisks[0]?.orderNo} 金额较高、等待时长较长，
                当前共有 <Highlight>{scaledRisks.length} 笔</Highlight> 重点风险订单需要跟进。建议部门总经理优先协调销售、交付和财务资源，
                对超过 48 小时未结订单建立每日复盘机制，避免影响下一周期开单节奏。
              </p>
              <WarningText>
                部门动作建议：保住头部客户复购节奏，把低于目标完成率的业务员和尾部客户纳入专项跟进清单；对高金额未结束订单明确责任人、预计结单时间和跨部门协同事项。
              </WarningText>
            </div>
          </SummaryBox>

          <div className="grid grid-cols-1 gap-6 px-6 pb-6 lg:grid-cols-2">
            <ChartBlock
              title={`${period.unit}开单趋势`}
              summary={`小结：${period.unit}累计开单保持上行，${bestTrendPoint.label}单期表现最好，${lastTrendPoint.label}累计达到 ${currencyWan(amount)}，部门应继续关注高峰阶段后的订单承接。`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={(value) => `¥${value}万`} />
                  <Tooltip formatter={(value) => [tooltipAmount(value), '']} />
                  <Legend />
                  <Line dataKey="开单额" stroke="#2563EB" strokeWidth={2.4} dot={{ r: 3 }} />
                  <Line dataKey="累计开单额" stroke="#059669" strokeWidth={2.4} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartBlock>

            <ChartBlock
              title={`${period.unit}业务员开单TOP5`}
              summary={`小结：${scaledSalespeople[0]?.name}${period.unit}开单最高，较${period.previousUnit}保持增长；${scaledSalespeople[1]?.name}与${scaledSalespeople[2]?.name}构成第二梯队。需要重点关注${period.unit}低于${period.previousUnit}或环比偏弱的业务员，推动在谈订单尽快开单。`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={salespersonChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={(value) => `¥${value}万`} />
                  <Tooltip formatter={(value) => [tooltipAmount(value), '']} />
                  <Legend />
                  <Bar dataKey={period.unit} fill="#2563EB" radius={[5, 5, 0, 0]} />
                  <Bar dataKey={period.previousUnit} fill="#93C5FD" radius={[5, 5, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartBlock>
          </div>
        </Card>

        <Card>
          <SectionHeader index={3} title="客户结构与重点客户" />
          <div className="grid grid-cols-1 gap-6 px-6 py-5 lg:grid-cols-[0.9fr_1.1fr]">
            <ChartBlock
              title="本部门客户类型开单占比"
              bubble={<><div className="font-semibold text-slate-700">{scaledCustomerTypes[0].name}</div><div className="text-primary">开单额：{currencyWan(scaledCustomerTypes[0].value)}</div></>}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={scaledCustomerTypes} dataKey="value" nameKey="name" innerRadius={66} outerRadius={104} paddingAngle={2}>
                    {scaledCustomerTypes.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(value) => [tooltipAmount(value), '开单额']} />
                  <Legend verticalAlign="bottom" height={28} />
                </PieChart>
              </ResponsiveContainer>
            </ChartBlock>

            <ReportTable title="重点客户开单TOP5">
              <thead>
                <tr>
                  <th>排名</th>
                  <th>客户名称</th>
                  <th>客户类型</th>
                  <th className="text-right">{period.unit}开单额</th>
                  <th className="text-right">未结束订单</th>
                  <th className="text-right">同比</th>
                </tr>
              </thead>
              <tbody>
                {scaledCustomers.map((item, index) => (
                  <tr key={item.name}>
                    <td><span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${getRankClass(index + 1)}`}>{index + 1}</span></td>
                    <td className="font-semibold">{item.name}</td>
                    <td><Tag>{item.type}</Tag></td>
                    <td className="text-right font-semibold">{currencyWan(item.amount)}</td>
                    <td className="text-right">{currencyWan(item.openOrder)}</td>
                    <td className="text-right"><TrendText value={item.change} /></td>
                  </tr>
                ))}
              </tbody>
            </ReportTable>
            <p className="rounded-lg bg-slate-50 px-4 py-3 text-[12px] leading-6 text-slate-600 lg:col-span-2">
              小结：{scaledCustomerTypes[0].name}仍是当前部门的主要来源，贡献 {currencyWan(scaledCustomerTypes[0].value)}；
              重点客户中 {scaledCustomers[0]?.name} 贡献最高，{period.unit}开单 {currencyWan(scaledCustomers[0]?.amount || 0)}，
              同比 <TrendText value={scaledCustomers[0]?.change || 0} />，未结束订单 {currencyWan(scaledCustomers[0]?.openOrder || 0)}。
              {scaledCustomers[1]?.name} 与 {scaledCustomers[2]?.name} 构成第二梯队，建议继续保障头部客户交付稳定性，同时关注
              {tailCustomer?.name || '-'} 等尾部客户的订单转化和复购节奏，避免客户贡献过度集中。
            </p>
          </div>
        </Card>

        <Card>
          <SectionHeader index={4} title="未结束订单分析" />
          <div className="px-6 py-5">
            <ReportTable title="未结束订单及风险跟进明细">
              <thead>
                <tr>
                  <th>订单编号</th>
                  <th>客户名称</th>
                  <th>负责人</th>
                  <th className="text-right">金额</th>
                  <th className="text-center">时长</th>
                  <th className="text-center">状态</th>
                </tr>
              </thead>
              <tbody>
                {scaledRisks.map((item) => (
                  <tr key={item.orderNo} className={item.hours >= 48 ? 'bg-red-50' : item.hours >= 36 ? 'bg-amber-50' : ''}>
                    <td className="font-semibold">{item.orderNo}</td>
                    <td>{item.customer}</td>
                    <td>{item.owner}</td>
                    <td className="text-right font-semibold">{currencyWan(item.amount)}</td>
                    <td className={`text-center font-semibold ${item.hours >= 48 ? 'text-red-600' : 'text-amber-600'}`}>{item.hours}小时</td>
                    <td className="text-center"><Tag tone={item.hours >= 48 ? 'red' : 'amber'}>{item.status}</Tag></td>
                  </tr>
                ))}
              </tbody>
            </ReportTable>
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[12px] leading-6 text-slate-600">
              小结：当前未结束订单合计 {currencyWan(openOrder)}，其中 {scaledRisks[0]?.customer} 的 {scaledRisks[0]?.orderNo}
              等待 {scaledRisks[0]?.hours} 小时、金额 {currencyWan(scaledRisks[0]?.amount || 0)}，是优先级最高的风险项；建议按负责人拆分跟进动作，
              对超过 48 小时的订单明确结单节点，对 24-48 小时订单提前协调交付资源，减少滚动到下周的风险。
            </p>
          </div>
        </Card>

        {reportType !== 'weekly' && (
          <Card>
            <SectionHeader index={5} title="公司2025年前30客户 & 2026年开单情况" />
            <SummaryBox>
              <div className="space-y-3">
                <p className="indent-8">
                  该分析口径以 <Highlight>公司级 2025 年开单额前30客户</Highlight> 为基础，再筛选出归属本部门的客户。
                  本部门当前命中公司前30客户 <Highlight>{departmentCompanyTopCustomers.length} 家</Highlight>，
                  2026年至今累计开单 <Highlight>{currencyWan(topCustomerYtdAmount)}</Highlight>，
                  {period.unit}合计开单 <Highlight>{currencyWan(topCustomerAmount)}</Highlight>，说明公司级头部客户仍是本部门开单稳定性的关键来源。
                </p>
                <p className="indent-8">
                  从客户表现看，<Highlight>{topDepartmentCustomer?.name || '-'}</Highlight> 是当前命中的头部客户，
                  2026年至今开单 <Highlight>{currencyWan(topDepartmentCustomer?.ytd2026 || 0)}</Highlight>，
                  时间进度占比 <Highlight>{topDepartmentCustomer?.progress || 0}%</Highlight>，同比
                  <TrendText value={topDepartmentCustomer?.yoy || 0} />。当前进度正常客户
                  <Highlight>{normalCustomerCount} 家</Highlight>，关注客户 <Highlight>{attentionCustomerCount} 家</Highlight>，
                  预警客户 <Highlight>{riskCustomerCount} 家</Highlight>。
                </p>
                <p className="indent-8">
                  从管理动作看，对<Highlight>正常</Highlight>客户保持复购节奏和交付确定性；对
                  <Highlight>关注</Highlight>客户提升拜访频次、推进在谈订单转开单；对
                  <Highlight>预警</Highlight>客户建立总经理跟进清单。尤其是
                  <Highlight>{slowestProgressCustomer?.name || '-'}</Highlight> 当前时间进度占比仅
                  <Highlight>{slowestProgressCustomer?.progress || 0}%</Highlight>，需要优先排查价格、交付、竞品切换和项目延期风险。
                </p>
              </div>
            </SummaryBox>

            <div className="px-6 pb-6">
              <ReportTable
                title="客户明细"
                action={(
                  <div className="flex flex-wrap items-center gap-2 text-[12px]">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">正常 ≥40%</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">关注 35%-40%</span>
                    <span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-700">预警 &lt;35%</span>
                  </div>
                )}
              >
                <thead>
                  <tr>
                    <th className="text-center">2025排名</th>
                    <th>客户名称</th>
                    <th>客户类型</th>
                    <th>国内/国际</th>
                    <th className="text-right">2025全年开单</th>
                    <th className="text-right">2026至今</th>
                    <th className="text-right">同比去年1-5月</th>
                    <th className="text-right">时间进度占比</th>
                    <th className="text-center">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentCompanyTopCustomers.map((item) => (
                    <tr
                      key={item.name}
                      className={item.progressStatus === '预警' ? 'bg-red-50' : item.progressStatus === '关注' ? 'bg-amber-50' : 'bg-emerald-50/50'}
                    >
                      <td className="text-center">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${getRankClass(item.rank <= 3 ? item.rank : 4)}`}>
                          {item.rank}
                        </span>
                      </td>
                      <td className="font-semibold">{item.name}</td>
                      <td><Tag>{item.customerType}</Tag></td>
                      <td>{item.market}</td>
                      <td className="text-right font-semibold">{currencyWan(item.annual2025)}</td>
                      <td className="text-right font-semibold">{currencyWan(item.ytd2026)}</td>
                      <td className="text-right"><TrendText value={item.yoy} /></td>
                      <td className="text-right font-semibold">{item.progress}%</td>
                      <td className="text-center">
                        <Tag tone={item.progressStatus === '预警' ? 'red' : item.progressStatus === '关注' ? 'amber' : 'green'}>{item.progressStatus}</Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ReportTable>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[12px] leading-6 text-slate-600">
                小结：本部门命中的公司前30客户共 {departmentCompanyTopCustomers.length} 家，2026年至今累计开单 {currencyWan(topCustomerYtdAmount)}，
                其中 {topDepartmentCustomer?.name || '-'} 贡献最高，时间进度占比 {topDepartmentCustomer?.progress || 0}%；
                {riskCustomerCount > 0
                  ? `当前有 ${riskCustomerCount} 家客户处于重点预警，需要优先复盘流失原因和下周期挽回动作。`
                  : '当前暂无重点预警客户，应继续保持头部客户复购节奏。'}
                建议部门每月跟踪时间进度低于 35% 的客户，结合未结束订单和拜访计划提前干预，避免公司级核心客户贡献下滑。
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <section className="rounded-[12px] border border-slate-200 bg-white shadow-sm">{children}</section>;
}

function SectionHeader({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-center gap-2 px-6 pt-5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[13px] font-semibold text-white">{index}</span>
      <h2 className="text-[16px] font-semibold text-slate-900">{title}</h2>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  change,
  changeSuffix,
  changeText,
  inverse = false,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  change?: number;
  changeSuffix?: string;
  changeText?: string;
  inverse?: boolean;
  color: string;
}) {
  const good = changeText ? true : inverse ? Number(change) < 0 : Number(change) >= 0;
  return (
    <div className={`rounded-[12px] border border-slate-200 border-t-[3px] bg-white p-5 ${color}`}>
      <div className="mb-2 text-[13px] font-medium text-slate-500">{label}</div>
      <div className="text-[28px] font-bold leading-tight text-slate-900">{value}</div>
      <div className="mt-1 text-[12px] text-slate-400">{sub}</div>
      <div className={`mt-2 inline-flex rounded-md px-2 py-0.5 text-[12px] font-medium ${good ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {changeText || `${Number(change) >= 0 ? '▲' : '▼'} ${Math.abs(Number(change)).toFixed(1)}%${changeSuffix ? ` ${changeSuffix}` : ''}`}
      </div>
    </div>
  );
}

function SummaryBox({ children }: { children: ReactNode }) {
  return <div className="px-6 pb-5 pt-4 text-[14px] leading-8 text-slate-700">{children}</div>;
}

function Highlight({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-primary">{children}</span>;
}

function WarningText({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-7 text-amber-800">
      <strong>重点关注：</strong>{children}
    </div>
  );
}

function ChartBlock({
  title,
  summary,
  bubble,
  children,
}: {
  title: string;
  summary?: string;
  bubble?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-[14px] font-semibold text-slate-700">{title}</h3>
      <div className="relative h-[300px]">
        {children}
        {bubble && (
          <div className="pointer-events-none absolute left-[48%] top-[36%] min-w-[150px] rounded border border-slate-200 bg-white/95 px-4 py-3 text-[13px] leading-7 shadow-sm">
            {bubble}
          </div>
        )}
      </div>
      {summary && <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[12px] leading-6 text-slate-600">{summary}</p>}
    </div>
  );
}

function ReportTable({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[14px] font-semibold text-slate-700">{title}</h3>
        {action}
      </div>
      <div className="overflow-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[760px] table-fixed border-collapse text-[13px] [&_td]:border-b [&_td]:border-slate-100 [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-slate-700 [&_th]:border-b [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-[12px] [&_th]:font-semibold [&_th]:text-slate-600 [&_tr:hover_td]:bg-slate-50">
          {children}
        </table>
      </div>
    </div>
  );
}

function Tag({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'amber' | 'red' | 'green' }) {
  const toneClass = {
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    green: 'bg-emerald-50 text-emerald-700',
  }[tone];
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${toneClass}`}>{children}</span>;
}
