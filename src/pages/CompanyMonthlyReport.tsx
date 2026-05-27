import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Download,
  Printer,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Toaster, toast } from 'sonner';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { reportList } from './report/mockData';
import { keyChannelDealerGroups } from './report/keyChannelDealerData';
import type { KeyChannelDealerRow, KeyChannelDealerScope } from './report/keyChannelDealerData';
import { domesticChannelQuarterRows } from './report/domesticChannelQuarterData';
import type { Report } from './report/types';

const kpis = [
  { label: '本月开单额', value: '¥1.25亿', sub: '目标 ¥1.10亿', changes: ['同比 +18.2%', '环比 +12.5%'], color: 'border-t-blue-600' },
  { label: '未结束订单金额', value: '¥5,680万', sub: '共 42 笔订单', changes: ['同比 -3.2%', '环比 -5.2%'], color: 'border-t-amber-600', down: true },
  { label: '年完成额', value: '¥5.28亿', sub: '年度目标 ¥12亿', changes: ['进度正常'], color: 'border-t-teal-600' },
  { label: '年完成率', value: '44.0%', sub: '时间进度 41.7%', changes: [], color: 'border-t-rose-600' },
];

const monthlyCompare = [
  { name: '总开单额', 本月: 12500, 上月: 11110, 去年同期: 10570 },
  { name: '国内开单', 本月: 7825, 上月: 7100, 去年同期: 6756 },
  { name: '国际开单', 本月: 4675, 上月: 4010, 去年同期: 3814 },
];

const deptTrend = [
  { name: '全球渠道部', 本月开单: 6701, 去年同期: 5590, 同比增幅: 19.9 },
  { name: '国内大客户部', 本月开单: 2479, 去年同期: 2224, 同比增幅: 11.5 },
  { name: '国际酒店部', 本月开单: 2320, 去年同期: 1895, 同比增幅: 22.4 },
];

const customerTypes = [
  { name: '国内渠道商', value: 3420, fill: '#2563EB' },
  { name: '国际渠道商', value: 1760, fill: '#059669' },
  { name: 'ODM客户', value: 2450, fill: '#D97706' },
  { name: '国内重点渠道商', value: 1585, fill: '#7C3AED' },
  { name: '国际重点渠道商', value: 1120, fill: '#0EA5E9' },
  { name: '国内地产客户', value: 1680, fill: '#F97316' },
  { name: '国际发展组客户', value: 485, fill: '#94A3B8' },
];

const keyDealerShipCompare = [
  { name: '国内重点渠道商', 本月开单: 5005, 上月开单: 4568, 去年同期: 4233, 同比增长: 18.2 },
  { name: '国际重点渠道商', 本月开单: 3045, 上月开单: 2526, 去年同期: 2390, 同比增长: 27.4 },
];

const quarterProgress = [
  { name: 'Q1', 目标: 18000, 已完成: 16500, 完成率: 91.7 },
  { name: 'Q2', 目标: 30000, 已完成: 24500, 完成率: 81.7 },
  { name: 'Q3', 目标: 36000, 已完成: 0, 完成率: 0 },
  { name: 'Q4', 目标: 36000, 已完成: 0, 完成率: 0 },
];

const customerTypeCompare = [
  { name: '国内地产客户', 本月: 1680, 上月: 1598, 去年同期: 1597 },
  { name: 'ODM客户', 本月: 2450, 上月: 2020, 去年同期: 1906 },
];

const typeSummaryRows = [
  { type: '国内渠道商', amount: '¥3,420万', ratio: '27.4%', prev: '¥3,108万', mom: 10.0, last: '¥2,965万', yoy: 15.3, total: '¥1.54亿', trend: '稳健增长' },
  { type: '国际渠道商', amount: '¥1,760万', ratio: '14.1%', prev: '¥1,488万', mom: 18.3, last: '¥1,382万', yoy: 27.4, total: '¥7,920万', trend: '快速增长' },
  { type: 'ODM客户', amount: '¥2,450万', ratio: '19.6%', prev: '¥2,020万', mom: 21.3, last: '¥1,906万', yoy: 28.5, total: '¥1.08亿', trend: '高速增长' },
  { type: '国际重点渠道商', amount: '¥1,120万', ratio: '9.0%', prev: '¥986万', mom: 13.6, last: '¥892万', yoy: 25.6, total: '¥4,850万', trend: '较快增长' },
  { type: '国内重点渠道商', amount: '¥1,585万', ratio: '12.7%', prev: '¥1,460万', mom: 8.6, last: '¥1,376万', yoy: 15.2, total: '¥6,930万', trend: '稳步提升' },
  { type: '国际发展组客户', amount: '¥485万', ratio: '3.9%', prev: '¥398万', mom: 21.9, last: '¥352万', yoy: 37.8, total: '¥2,160万', trend: '培育增长' },
  { type: '国内地产客户', amount: '¥1,680万', ratio: '13.4%', prev: '¥1,598万', mom: 5.1, last: '¥1,597万', yoy: 5.2, total: '¥7,850万', trend: '增速放缓' },
];

const annualRows = [
  { rank: 1, name: '深圳华强科技', type: '国内渠道商', region: '国内', lastYear: '¥5,680万', current: '¥2,856万', yoy: 22.5, progress: '50.3%', status: '正常' },
  { rank: 2, name: '上海新联电子', type: '国内渠道商', region: '国内', lastYear: '¥4,856万', current: '¥2,425万', yoy: 18.2, progress: '49.9%', status: '正常' },
  { rank: 3, name: '新加坡AsiaTech', type: '国际重点渠道商', region: '国际', lastYear: '¥3,650万', current: '¥1,865万', yoy: 28.6, progress: '51.1%', status: '正常' },
  { rank: 4, name: '北京中科创新', type: '国内重点渠道商', region: '国内', lastYear: '¥3,280万', current: '¥1,520万', yoy: 16.8, progress: '46.3%', status: '正常' },
  { rank: 5, name: '杭州智联网终端', type: '国内地产客户', region: '国内', lastYear: '¥2,985万', current: '¥1,425万', yoy: 12.1, progress: '47.7%', status: '正常' },
  { rank: 6, name: '广州恒通科技', type: '国内渠道商', region: '国内', lastYear: '¥2,880万', current: '¥1,318万', yoy: 10.5, progress: '45.8%', status: '正常' },
  { rank: 7, name: '印度MumbaiTech', type: 'ODM客户', region: '国际', lastYear: '¥2,760万', current: '¥1,225万', yoy: 24.8, progress: '44.4%', status: '正常' },
  { rank: 8, name: '东莞精密制造', type: '国内渠道商', region: '国内', lastYear: '¥2,680万', current: '¥185万', yoy: -62.3, progress: '6.9%', status: '预警' },
  { rank: 9, name: '成都西部电子', type: '国内地产客户', region: '国内', lastYear: '¥2,420万', current: '¥865万', yoy: -6.9, progress: '35.7%', status: '关注' },
  { rank: 10, name: '武汉光谷科技', type: '国内地产客户', region: '国内', lastYear: '¥2,150万', current: '¥785万', yoy: -8.2, progress: '36.5%', status: '关注' },
  { rank: 11, name: '南京瑞景集团', type: '国内重点渠道商', region: '国内', lastYear: '¥2,020万', current: '¥920万', yoy: 9.4, progress: '45.5%', status: '正常' },
  { rank: 12, name: '广州智远科技', type: '国际发展组客户', region: '国际', lastYear: '¥1,960万', current: '¥910万', yoy: 18.7, progress: '46.4%', status: '正常' },
  { rank: 13, name: '青岛海联智能', type: '国内渠道商', region: '国内', lastYear: '¥1,880万', current: '¥792万', yoy: 6.6, progress: '42.1%', status: '正常' },
  { rank: 14, name: '苏州明科电子', type: 'ODM客户', region: '国内', lastYear: '¥1,820万', current: '¥758万', yoy: 4.8, progress: '41.6%', status: '正常' },
  { rank: 15, name: '重庆新兴地产', type: '国内地产客户', region: '国内', lastYear: '¥1,760万', current: '¥645万', yoy: -4.2, progress: '36.6%', status: '关注' },
  { rank: 16, name: '厦门海沧科技', type: '国内渠道商', region: '国内', lastYear: '¥1,690万', current: '¥760万', yoy: 8.9, progress: '45.0%', status: '正常' },
  { rank: 17, name: '迪拜GulfBuild', type: '国际重点渠道商', region: '国际', lastYear: '¥1,620万', current: '¥805万', yoy: 25.6, progress: '49.7%', status: '正常' },
  { rank: 18, name: '天津云谷电子', type: '国内渠道商', region: '国内', lastYear: '¥1,560万', current: '¥602万', yoy: -1.8, progress: '38.6%', status: '关注' },
  { rank: 19, name: '宁波华创设备', type: 'ODM客户', region: '国内', lastYear: '¥1,510万', current: '¥705万', yoy: 14.2, progress: '46.7%', status: '正常' },
  { rank: 20, name: '合肥科锐系统', type: '国内地产客户', region: '国内', lastYear: '¥1,455万', current: '¥510万', yoy: -7.5, progress: '35.1%', status: '关注' },
  { rank: 21, name: '西安宏图科技', type: '国内渠道商', region: '国内', lastYear: '¥1,390万', current: '¥612万', yoy: 7.1, progress: '44.0%', status: '正常' },
  { rank: 22, name: '马来西亚MegaHome', type: '国际发展组客户', region: '国际', lastYear: '¥1,330万', current: '¥640万', yoy: 21.4, progress: '48.1%', status: '正常' },
  { rank: 23, name: '长沙星城置业', type: '国内地产客户', region: '国内', lastYear: '¥1,285万', current: '¥430万', yoy: -10.6, progress: '33.5%', status: '预警' },
  { rank: 24, name: '佛山德联电子', type: 'ODM客户', region: '国内', lastYear: '¥1,220万', current: '¥515万', yoy: 3.9, progress: '42.2%', status: '正常' },
  { rank: 25, name: '郑州城市发展', type: '国内地产客户', region: '国内', lastYear: '¥1,180万', current: '¥388万', yoy: -12.1, progress: '32.9%', status: '预警' },
  { rank: 26, name: '越南VinaTech', type: '国际发展组客户', region: '国际', lastYear: '¥1,125万', current: '¥585万', yoy: 29.2, progress: '52.0%', status: '正常' },
  { rank: 27, name: '泉州海翼智能', type: '国内渠道商', region: '国内', lastYear: '¥1,080万', current: '¥455万', yoy: 2.5, progress: '42.1%', status: '正常' },
  { rank: 28, name: '沈阳北方置业', type: '国内地产客户', region: '国内', lastYear: '¥1,035万', current: '¥310万', yoy: -15.8, progress: '30.0%', status: '预警' },
  { rank: 29, name: '无锡联创科技', type: 'ODM客户', region: '国内', lastYear: '¥980万', current: '¥432万', yoy: 8.6, progress: '44.1%', status: '正常' },
  { rank: 30, name: '泰国BangkokHome', type: '国际发展组客户', region: '国际', lastYear: '¥920万', current: '¥438万', yoy: 20.9, progress: '47.6%', status: '正常' },
];

function amountTooltip(value: unknown) {
  return `¥${Number(value ?? 0).toLocaleString()}万`;
}

function percentTooltip(value: unknown) {
  return `${Number(value ?? 0).toFixed(1)}%`;
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

function rankClass(rank: number) {
  if (rank === 1) return 'bg-amber-100 text-amber-700';
  if (rank === 2) return 'bg-slate-100 text-slate-600';
  if (rank === 3) return 'bg-orange-100 text-orange-700';
  return 'bg-slate-100 text-slate-500';
}

export default function CompanyMonthlyReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportId } = useParams();
  const [keyChannelScope, setKeyChannelScope] = useState<KeyChannelDealerScope>('domestic');
  const [annualScope, setAnnualScope] = useState<'domestic' | 'international'>('domestic');

  const report = useMemo(() => {
    const stateReport = (location.state as { report?: Report } | null)?.report;
    return stateReport || reportList.find((item) => item.id === reportId);
  }, [location.state, reportId]);

  const keyChannelRows = keyChannelDealerGroups[keyChannelScope].slice(0, 10);
  const quarterTargetPreviewRows = domesticChannelQuarterRows.slice(0, 10);
  const annualScopeRows = annualRows.filter((row) => row.region === (annualScope === 'domestic' ? '国内' : '国际'));

  return (
    <Layout contentClassName="bg-[#F8FAFC]">
      <Toaster position="bottom-right" />
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" className="mb-3 gap-1.5 px-0 text-text-secondary" onClick={() => navigate('/report-center')}>
              <ArrowLeft className="h-4 w-4" />
              返回销售报告
            </Button>
            <h1 className="text-[24px] font-bold text-slate-900">{report?.name || '销售月报'}</h1>
            <p className="mt-1 text-[13px] text-slate-500">统计周期：2026年5月1日 - 5月31日（公司级）</p>
          </div>
          <div className="flex items-center gap-2 pt-8">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              打印
            </Button>
            <Button size="sm" onClick={() => toast.success('公司级月报已开始导出')}>
              <Download className="h-4 w-4" />
              导出报告
            </Button>
          </div>
        </div>

        <Card>
          <SectionHeader index={1} title="本月核心指标总览" />
          <div className="grid grid-cols-2 gap-4 p-6 lg:grid-cols-4">
            {kpis.map((item) => (
              <div key={item.label} className={`rounded-[12px] border border-slate-200 border-t-[3px] bg-white p-5 ${item.color}`}>
                <div className="mb-2 text-[13px] font-medium text-slate-500">{item.label}</div>
                <div className="text-[28px] font-bold leading-tight text-slate-900">{item.value}</div>
                <div className="mt-1 text-[12px] text-slate-400">{item.sub}</div>
                {item.changes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.changes.map((change) => (
                      <span key={change} className={`rounded-md px-2 py-0.5 text-[12px] font-medium ${item.down ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {item.down ? '▼' : '▲'} {change}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader index={2} title="本月经验总结" />
          <SummaryBox>
            <div className="space-y-3">
              <p className="indent-8">
                从整体经营看，本月公司开单总额为 <Highlight>¥1.25亿</Highlight>，达成月度目标 <Highlight>113.6%</Highlight>，同比去年同月 <TrendText value={18.2} />，环比上月 <TrendText value={12.5} />，整体开单节奏好于上月，也明显好于去年同期。其中，国内开单 <Highlight>¥7,825万</Highlight>，国际开单 <Highlight>¥4,675万</Highlight>，国际业务同比 <TrendText value={22.4} />、环比 <TrendText value={16.8} />，增速高于国内，说明海外订单承接和交付节奏更活跃。
              </p>
              <p className="indent-8">
                从部门贡献看，<Highlight>全球渠道部</Highlight>开单 <Highlight>¥6,701万</Highlight>，占公司总开单额 <Highlight>53.6%</Highlight>，是本月最核心的贡献部门；国内大客户部 <Highlight>¥2,479万</Highlight>、国际酒店部 <Highlight>¥2,320万</Highlight>形成第二梯队。全球渠道部贡献规模最大，国际酒店部同比增速更突出，国内大客户部规模稳定但增速偏低，需要继续提升重点项目验收和复购转化。
              </p>
              <p className="indent-8">
                从客户结构看，深圳华强科技、上海新联电子、新加坡 AsiaTech 等头部客户继续贡献主要增量，TOP3 集中度提升，说明头部客户复购和项目推进仍是增长的主要支撑。尾部客户中，东莞精密制造、成都西部电子、武汉光谷科技等进度偏慢，客户贡献不均衡的问题仍需关注，避免头部客户稳定但尾部客户持续流失。
              </p>
              <p className="indent-8">
                从交付风险看，未结束订单 <Highlight>¥5,680万</Highlight>（42笔），环比上月下降 <TrendText value={-5.2} />，结单效率持续改善；但超 72 小时未结订单仍有 8 笔，合计 <Highlight>¥1,856万</Highlight>。其中深圳华强科技金额最高、等待时间较长，尾部客户和进度偏慢客户需明确责任人、预计结单时间和跨部门协同事项，避免滚动到下月影响开单。
              </p>
              <WarningText>重点关注：下月建议继续放大国际酒店部和全球渠道部的增长势能，同时对国内大客户部、尾部客户和超 72 小时未结订单建立专项跟进清单；对低增长部门和尾部客户按周复盘，保证月初订单承接和月底交付节奏同步改善。</WarningText>
            </div>
          </SummaryBox>
          <div className="grid grid-cols-1 gap-6 px-6 pb-6 lg:grid-cols-2">
            <ChartBlock title="开单额对比（本月 / 上月 / 去年同期）" summary="小结：本月总开单、国内开单、国际开单均高于上月和去年同期，说明公司整体需求处于扩张状态。" bubble={<><div className="font-semibold text-slate-700">总开单额</div><div className="text-blue-600">本月：¥12,500万</div><div className="text-sky-500">上月：¥11,110万</div><div className="text-slate-400">去年同期：¥10,570万</div></>}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCompare}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(value) => `${(Number(value) / 10000).toFixed(1)}亿`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => [amountTooltip(value), '']} />
                  <Legend />
                  <Bar dataKey="本月" fill="#2563EB" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="上月" fill="#60A5FA" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="去年同期" fill="#CBD5E1" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartBlock>
            <ChartBlock title="各部门开单额及占比" summary="小结：全球渠道部贡献最高，国际酒店部同比增幅最大，国内大客户部仍有进一步提升空间。" bubble={<><div className="font-semibold text-slate-700">全球渠道部</div><div className="text-blue-600">本月开单：¥6,701万</div><div className="text-sky-500">去年同期：¥5,590万</div><div className="text-amber-500">同比增幅：19.9%</div></>}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={deptTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="amount" tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="rate" orientation="right" tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value, name) => [name === '同比增幅' ? percentTooltip(value) : amountTooltip(value), name]} />
                  <Legend />
                  <Bar yAxisId="amount" dataKey="本月开单" fill="#2563EB" radius={[5, 5, 0, 0]} />
                  <Bar yAxisId="amount" dataKey="去年同期" fill="#93C5FD" radius={[5, 5, 0, 0]} />
                  <Line yAxisId="rate" dataKey="同比增幅" stroke="#F59E0B" strokeWidth={2.5} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartBlock>
          </div>
        </Card>

        <Card>
          <SectionHeader index={3} title="国内国际重点渠道商分析" />
          <div className="grid grid-cols-1 gap-6 p-6 pt-4 pb-4 lg:grid-cols-2">
            <div className="flex min-h-[420px] flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-5">
              <div className="space-y-4 text-[14px] leading-8 text-slate-700">
                <p>
                  本月国内、国际重点渠道商合计开单 <Highlight>¥8,050万</Highlight>，占公司本月开单额约 <Highlight>64.4%</Highlight>，是拉动月度开单的核心渠道盘。其中国内重点渠道商开单 <Highlight>¥5,005万</Highlight>，环比提升 9.6%，同比 <TrendText value={18.2} />，贡献规模更大，主要由深圳华强科技、上海新联电子、北京中科创新支撑。
                </p>
                <p>
                  国际重点渠道商本月开单 <Highlight>¥3,045万</Highlight>，环比提升 20.5%，同比 <TrendText value={27.4} />，增速明显高于国内，说明海外重点渠道的订单承接能力正在增强。从开单能力看，国内渠道商胜在规模和稳定供给，国际渠道商胜在增速和新增空间；后续应保持国内头部渠道商稳定复购，同时把新加坡 AsiaTech、迪拜 GulfBuild 等国际渠道商作为下半年增量重点。
                </p>
              </div>
              <WarningText>重点关注：国际重点渠道商增速更好，但客户数量和交付链路仍相对集中，建议锁定 TOP3 国际渠道商的下半年订单排期；国内重点渠道商需关注中腰部客户是否跟上头部节奏，避免开单过度集中在少数渠道。</WarningText>
            </div>
            <ChartBlock title="国内/国际重点渠道商开单能力对比" summary="小结：国内重点渠道商贡献规模更高，国际重点渠道商同比增速更快，二者分别承担基本盘和增量盘。">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={keyDealerShipCompare}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="amount" tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={(value) => `¥${Number(value) / 1000}千万`} />
                  <YAxis yAxisId="rate" orientation="right" tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value, name) => [name === '同比增长' ? percentTooltip(value) : amountTooltip(value), name]} />
                  <Legend />
                  <Bar yAxisId="amount" dataKey="本月开单" fill="#2563EB" radius={[5, 5, 0, 0]} />
                  <Bar yAxisId="amount" dataKey="上月开单" fill="#60A5FA" radius={[5, 5, 0, 0]} />
                  <Bar yAxisId="amount" dataKey="去年同期" fill="#CBD5E1" radius={[5, 5, 0, 0]} />
                  <Line yAxisId="rate" dataKey="同比增长" stroke="#F59E0B" strokeWidth={2.5} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartBlock>
          </div>
          <KeyChannelDealerPreview
            activeScope={keyChannelScope}
            rows={keyChannelRows}
            onScopeChange={setKeyChannelScope}
            onViewAll={() => navigate(`/monthly-report/company/${reportId || report?.id || '17'}/key-channel-dealers?tab=${keyChannelScope}`)}
          />
        </Card>

        <Card>
          <SectionHeader index={4} title="国内渠道商季度目标进展与返点测算" />
          <SummaryBox>
            本年度国内渠道商季度目标分解为：<Highlight>Q1: 15%</Highlight>、<Highlight>Q2: 25%</Highlight>、<Highlight>Q3: 30%</Highlight>、<Highlight>Q4: 30%</Highlight>（季度单独比率，不累计）。当前为 Q2（4-6月），季度目标开单额为 <Highlight>¥3.0亿</Highlight>，目前已完成 <Highlight>¥2.45亿</Highlight>，季度完成率 <Highlight>81.7%</Highlight>，距季度结束还有 <Highlight>42天</Highlight>，剩余缺口 <Highlight>¥5,500万</Highlight>。
            <br />
            从渠道商达成情况看，深圳华强科技、上海新联电子、北京中科创新已提前达成 Q2 目标，形成主要贡献；杭州智联网络、广州恒通科技处于冲刺区间，仍需推动重点项目尽快验收开单；成都西部电子当前完成率 84.4%，存在跨期风险，需要销售与交付协同跟进。
          </SummaryBox>
          <div className="px-6 pb-4">
            <ChartBlock title="Q1-Q4 季度目标完成进度" summary="小结：Q1 已接近完成，Q2 当前完成率 81.7%，需要在剩余周期继续推进渠道商冲刺。" bubble={<><div className="font-semibold text-slate-700">Q2</div><div className="text-blue-600">目标：¥3.0亿</div><div className="text-blue-600">已完成：¥2.45亿</div><div className="text-amber-500">完成率：81.7%</div></>}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={quarterProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="amount" tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="rate" orientation="right" tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value, name) => [name === '完成率' ? percentTooltip(value) : amountTooltip(value), name]} />
                  <Legend />
                  <Bar yAxisId="amount" dataKey="目标" fill="#E2E8F0" radius={[5, 5, 0, 0]} />
                  <Bar yAxisId="amount" dataKey="已完成" fill="#2563EB" radius={[5, 5, 0, 0]} />
                  <Line yAxisId="rate" dataKey="完成率" stroke="#F59E0B" strokeWidth={2.5} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartBlock>
          </div>
          <div className="px-6 pb-6">
            <ReportTable
              title="国内渠道商季度目标达成明细"
              tag={<Button variant="outline" size="sm" onClick={() => navigate(`/monthly-report/company/${reportId || report?.id || '17'}/domestic-channel-quarter-targets`)}>查看全部</Button>}
            >
              <thead><tr><th>渠道商名称</th><th className="text-center">所属部门</th><th className="text-right">Q2目标</th><th className="text-right">Q2已完成</th><th className="text-right">目标完成率</th><th className="text-center">目标是否达成</th></tr></thead>
              <tbody>{quarterTargetPreviewRows.map((row) => <tr key={row.name}><td className="font-semibold">{row.name}</td><td className="text-center">{row.dept}</td><td className="text-right">{row.target}</td><td className="text-right font-semibold">{row.done}</td><td className="text-right"><Tag tone={row.status === '存在风险' ? 'red' : row.status === '冲刺中' ? 'amber' : 'green'}>{row.rate}</Tag></td><td className="text-center"><Tag tone={row.status === '存在风险' ? 'red' : row.status === '冲刺中' ? 'amber' : 'green'}>{row.status}</Tag></td></tr>)}</tbody>
            </ReportTable>
          </div>
        </Card>

        <Card>
          <SectionHeader index={5} title="各类型客户开单分析" />
          <SummaryBox>
            国内渠道商仍是开单主力，合计开单 <Highlight>¥7,825万</Highlight>，占比 <Highlight>62.6%</Highlight>，同比保持双位数增长，说明核心渠道盘基本稳定。ODM客户本月开单 <Highlight>¥2,450万</Highlight>，同比增长 <TrendText value={28.5} />，增速显著领先其他类型，是本月最值得继续加码的增长来源。
            <br />
            国内地产客户开单 <Highlight>¥1,680万</Highlight>，环比仅增长 5.1%，增速偏温和，后续需要关注重点项目复购和回款节奏；国际发展组客户开单 <Highlight>¥1,295万</Highlight>，同比增长 24.3%，虽然规模小于渠道商和 ODM，但增长质量较好，可作为海外新增客户培育池持续跟进。
          </SummaryBox>
          <div className="grid grid-cols-1 gap-6 px-6 pb-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartBlock title="国内地产客户 vs ODM客户开单对比" summary="小结：ODM客户增长斜率明显高于国内地产客户，是本月最具弹性的客户类型。" bubble={<><div className="font-semibold text-slate-700">ODM客户</div><div className="text-blue-600">本月：¥2,450万</div><div className="text-sky-500">上月：¥2,020万</div><div className="text-slate-400">去年同期：¥1,906万</div></>}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerTypeCompare}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                    <Tooltip formatter={(value) => [amountTooltip(value), '']} />
                    <Legend />
                    <Bar dataKey="本月" fill="#2563EB" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="上月" fill="#60A5FA" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="去年同期" fill="#CBD5E1" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartBlock>
            </div>
            <ChartBlock title="客户类型占比" summary="小结：国内渠道商占比最高，ODM 与国际发展组客户构成第二增长曲线。">
              <PieChartBlock data={customerTypes} bubble="开单额：¥5,480万" />
            </ChartBlock>
          </div>
          <div className="px-6 pb-6">
            <ReportTable title="各类型客户开单汇总">
              <thead><tr><th>客户类型</th><th className="text-right">本月开单额</th><th className="text-right">上月开单额</th><th className="text-right">环比</th><th className="text-right">去年同期</th><th className="text-right">同比</th><th className="text-right">本年累计</th><th className="text-center">趋势</th></tr></thead>
              <tbody>{typeSummaryRows.map((row) => <tr key={row.type}><td className="font-semibold">{row.type}</td><td className="text-right font-semibold">{row.amount}</td><td className="text-right">{row.prev}</td><td className="text-right"><TrendText value={row.mom} /></td><td className="text-right">{row.last}</td><td className="text-right"><TrendText value={row.yoy} /></td><td className="text-right">{row.total}</td><td className="text-center text-emerald-600">{row.trend}</td></tr>)}</tbody>
            </ReportTable>
          </div>
        </Card>

        <Card>
          <SectionHeader index={6} title="2025年前30客户 & 2026年开单情况" />
          <SummaryBox>
            2025 年 TOP30 客户全年合计贡献 <Highlight>¥10.85亿</Highlight>，2026 年 1-5 月这些客户累计开单 <Highlight>¥4.12亿</Highlight>，整体达到去年全年贡献的约 38.0%，略低于时间进度但客户集中度有所提升。
            国内客户仍承担主要规模贡献，深圳华强科技、上海新联电子、北京中科创新等头部客户进度稳定，国内合计客户数更多、基本盘更厚；国际客户数量较少但增速更优，新加坡 AsiaTech、印度 MumbaiTech、迪拜 GulfBuild 的进度和同比表现更突出，说明海外重点客户的承接能力正在增强。
            <br />
            从当前质量看，国际客户整体更好，平均进度和同比增速都高于国内，但规模仍依赖国内客户。国内侧重点是稳住头部渠道商并修复东莞精密制造、成都西部电子、武汉光谷科技等慢进度客户；国际侧建议继续加码重点渠道商和发展组客户，把高增速转化为下半年锁单。
            <WarningText>客户流失预警：国内客户中的东莞精密制造 2026 年至今仅开单 ¥185万，前 5 月进度仅 6.9%，建议销售总监安排拜访了解原因；国际客户虽然整体表现更好，但仍需关注交付稳定性和汇率、跨境物流对订单兑现的影响。</WarningText>
          </SummaryBox>
          <div className="px-6 pb-6">
            <div className="mb-4 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${annualScope === 'domestic' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                onClick={() => setAnnualScope('domestic')}
              >
                国内客户
              </button>
              <button
                type="button"
                className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${annualScope === 'international' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                onClick={() => setAnnualScope('international')}
              >
                国际客户
              </button>
            </div>
            <ReportTable title={`${annualScope === 'domestic' ? '国内' : '国际'}2025年开单额前30客户明细及2026年进展`} fullHeight tag={<><Tag tone="green">正常 ≥40%</Tag><Tag tone="amber">关注 35%-40%</Tag><Tag tone="red">预警 &lt;35%</Tag></>}>
              <thead><tr><th>2025排名</th><th>客户名称</th><th className="text-center">客户类型</th><th className="text-center">国内/国际</th><th className="text-right">2025年全年开单</th><th className="text-right">2026年至今</th><th className="text-right">同比去年1-5月</th><th className="text-right">时间进度占比</th><th className="text-center">状态</th></tr></thead>
              <tbody>{annualScopeRows.map((row) => <tr key={row.name} className={row.status === '预警' ? 'bg-red-50' : row.status === '关注' ? 'bg-amber-50' : 'bg-emerald-50'}><td><span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${rankClass(row.rank)}`}>{row.rank}</span></td><td className="font-semibold">{row.name}</td><td className="text-center"><Tag tone={row.region === '国际' ? 'green' : 'blue'}>{row.type}</Tag></td><td className="text-center">{row.region}</td><td className="text-right">{row.lastYear}</td><td className="text-right font-semibold">{row.current}</td><td className="text-right"><TrendText value={row.yoy} /></td><td className="text-right font-semibold">{row.progress}</td><td className="text-center"><Tag tone={row.status === '预警' ? 'red' : row.status === '关注' ? 'amber' : 'green'}>{row.status}</Tag></td></tr>)}</tbody>
            </ReportTable>
          </div>
        </Card>
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
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[13px] font-semibold text-white">{index}</span>
      <h2 className="text-[16px] font-semibold text-slate-900">{title}</h2>
    </div>
  );
}

function SummaryBox({ children }: { children: ReactNode }) {
  return <div className="px-6 pt-4 pb-5 text-[14px] leading-8 text-slate-700">{children}</div>;
}

function Highlight({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-primary">{children}</span>;
}

function WarningText({ children }: { children: ReactNode }) {
  return <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-7 text-amber-800"><strong>重点关注：</strong>{children}</div>;
}

function KeyChannelDealerPreview({
  activeScope,
  rows,
  onScopeChange,
  onViewAll,
}: {
  activeScope: KeyChannelDealerScope;
  rows: KeyChannelDealerRow[];
  onScopeChange: (scope: KeyChannelDealerScope) => void;
  onViewAll: () => void;
}) {
  return (
    <div className="px-6 pb-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-slate-800">国内/国际重点渠道商开单明细</h3>
          <p className="mt-1 text-[12px] text-slate-500">默认展示前 10 条，可进入全部明细页查看完整渠道商列表。</p>
        </div>
        <Button variant="outline" size="sm" onClick={onViewAll}>查看全部</Button>
      </div>
      <div className="mb-3 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${activeScope === 'domestic' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
          onClick={() => onScopeChange('domestic')}
        >
          国内重点渠道商
        </button>
        <button
          type="button"
          className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${activeScope === 'international' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
          onClick={() => onScopeChange('international')}
        >
          国际重点渠道商
        </button>
      </div>
      <KeyChannelDealerTable rows={rows} />
    </div>
  );
}

function KeyChannelDealerTable({ rows }: { rows: KeyChannelDealerRow[] }) {
  return (
    <div className="overflow-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[980px] table-fixed border-collapse text-[13px]">
        <thead>
          <tr className="bg-slate-50 text-[12px] font-semibold text-slate-600">
            <th className="px-4 py-2.5 text-left">渠道商名称</th>
            <th className="px-4 py-2.5 text-right">本月开单额</th>
            <th className="px-4 py-2.5 text-right">上月开单额</th>
            <th className="px-4 py-2.5 text-right">环比</th>
            <th className="px-4 py-2.5 text-right">去年同期</th>
            <th className="px-4 py-2.5 text-right">同比</th>
            <th className="px-4 py-2.5 text-right">本年累计</th>
            <th className="px-4 py-2.5 text-center">趋势</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-2.5 font-semibold text-slate-800">{row.name}</td>
              <td className="px-4 py-2.5 text-right font-semibold text-slate-700">{row.current}</td>
              <td className="px-4 py-2.5 text-right text-slate-600">{row.previous}</td>
              <td className="px-4 py-2.5 text-right"><TrendText value={row.mom} /></td>
              <td className="px-4 py-2.5 text-right text-slate-600">{row.lastYear}</td>
              <td className="px-4 py-2.5 text-right"><TrendText value={row.yoy} /></td>
              <td className="px-4 py-2.5 text-right text-slate-700">{row.total}</td>
              <td className="px-4 py-2.5 text-center text-emerald-600">{row.trend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartBlock({ title, summary, bubble, children }: { title: string; summary: string; bubble?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[14px] font-semibold text-slate-700">{title}</h3>
      <div className="relative h-[280px]">
        {children}
        {bubble && (
          <div className="pointer-events-none absolute left-[27%] top-[24%] min-w-[150px] rounded border border-slate-200 bg-white/95 px-4 py-3 text-[13px] leading-7 shadow-sm">
            {bubble}
          </div>
        )}
      </div>
      <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[12px] leading-6 text-slate-600">{summary}</p>
    </div>
  );
}

function PieChartBlock({ data, bubble }: { data: Array<{ name: string; value: number; fill: string }>; bubble: string }) {
  return (
    <div className="relative h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip formatter={(value) => [amountTooltip(value), '开单额']} />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
            {data.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
          </Pie>
          <Legend verticalAlign="bottom" height={28} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute left-[50%] top-[38%] rounded border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-primary shadow-sm">
        {bubble}
      </div>
    </div>
  );
}

function Tag({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'red' }) {
  const toneClass = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
  }[tone];

  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${toneClass}`}>{children}</span>;
}

function ReportTable({ title, tag, fullHeight = false, children }: { title: string; tag?: ReactNode; fullHeight?: boolean; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[14px] font-semibold text-slate-700">{title}</h3>
        {tag && <div className="flex flex-wrap justify-end gap-2">{tag}</div>}
      </div>
      <div className={`${fullHeight ? '' : 'max-h-[520px]'} overflow-auto rounded-lg border border-slate-200`}>
        <table className="w-full min-w-[900px] table-fixed border-collapse text-[13px] [&_td]:border-b [&_td]:border-slate-100 [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-slate-700 [&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:border-b [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-[12px] [&_th]:font-semibold [&_th]:text-slate-600 [&_tr:hover_td]:bg-slate-50">
          {children}
        </table>
      </div>
    </div>
  );
}
