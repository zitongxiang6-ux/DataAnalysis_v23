import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Download, Printer, TrendingDown, TrendingUp } from 'lucide-react';
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
import { domesticChannelQuarterRows } from './report/domesticChannelQuarterData';
import type { KeyChannelDealerScope } from './report/keyChannelDealerData';
import type { Report } from './report/types';

const kpis = [
  { label: '本季度开单额', value: '¥3.42亿', sub: '季度目标 ¥3.00亿', changes: ['同比 +20.6%', '环比 +14.8%'], color: 'border-t-blue-600' },
  { label: '未结束订单金额', value: '¥6,380万', sub: '共 58 笔订单', changes: ['同比 -2.8%', '环比 -4.6%'], color: 'border-t-amber-600', down: true },
  { label: '年完成额', value: '¥7.45亿', sub: '年度目标 ¥12亿', changes: ['进度正常'], color: 'border-t-teal-600' },
  { label: '年完成率', value: '62.1%', sub: '时间进度 50.0%', changes: [], color: 'border-t-rose-600' },
];

const quarterCompare = [
  { name: '总开单额', 本季度: 34200, 上季度: 29800, 去年同期: 28350 },
  { name: '国内开单', 本季度: 21180, 上季度: 18820, 去年同期: 18140 },
  { name: '国际开单', 本季度: 13020, 上季度: 10980, 去年同期: 10210 },
];

const deptTrend = [
  { name: '全球渠道部', 本季度开单: 18260, 去年同期: 14980, 同比增幅: 21.9 },
  { name: '国内大客户部', 本季度开单: 7560, 去年同期: 6890, 同比增幅: 9.7 },
  { name: '国际酒店部', 本季度开单: 6890, 去年同期: 5540, 同比增幅: 24.4 },
];

const keyDealerShipCompare = [
  { name: '国内重点渠道商', 本季度开单: 13580, 上季度开单: 12160, 去年同期: 11280, 同比增长: 20.4 },
  { name: '国际重点渠道商', 本季度开单: 8420, 上季度开单: 6810, 去年同期: 6460, 同比增长: 30.3 },
];

const customerTypes = [
  { name: '国内渠道商', value: 9180, fill: '#2563EB' },
  { name: '国际渠道商', value: 4860, fill: '#059669' },
  { name: 'ODM客户', value: 6760, fill: '#D97706' },
  { name: '国内重点渠道商', value: 4380, fill: '#7C3AED' },
  { name: '国际重点渠道商', value: 3140, fill: '#0EA5E9' },
  { name: '国内地产客户', value: 4380, fill: '#F97316' },
  { name: '国际发展组客户', value: 1520, fill: '#94A3B8' },
];

const customerTypeCompare = [
  { name: '国内地产客户', 本季度: 4380, 上季度: 4050, 去年同期: 3980 },
  { name: 'ODM客户', 本季度: 6760, 上季度: 5480, 去年同期: 5070 },
];

const quarterGoal = [
  { name: 'Q1', 目标: 18000, 已完成: 16500, 完成率: 91.7 },
  { name: 'Q2', 目标: 30000, 已完成: 34200, 完成率: 114.0 },
  { name: 'Q3', 目标: 36000, 已完成: 0, 完成率: 0 },
  { name: 'Q4', 目标: 36000, 已完成: 0, 完成率: 0 },
];

const typeSummaryRows = [
  { type: '国内渠道商', amount: '¥9,180万', prev: '¥8,260万', mom: 11.1, last: '¥7,960万', yoy: 15.3, total: '¥2.46亿', trend: '稳健增长' },
  { type: '国际渠道商', amount: '¥4,860万', prev: '¥3,980万', mom: 22.1, last: '¥3,810万', yoy: 27.6, total: '¥1.28亿', trend: '快速增长' },
  { type: 'ODM客户', amount: '¥6,760万', prev: '¥5,480万', mom: 23.4, last: '¥5,070万', yoy: 33.3, total: '¥1.78亿', trend: '高速增长' },
  { type: '国内重点渠道商', amount: '¥4,380万', prev: '¥3,950万', mom: 10.9, last: '¥3,690万', yoy: 18.7, total: '¥1.12亿', trend: '稳定放量' },
  { type: '国际重点渠道商', amount: '¥3,140万', prev: '¥2,430万', mom: 29.2, last: '¥2,380万', yoy: 31.9, total: '¥8,620万', trend: '增速领先' },
];

const annualRows = [
  { rank: 1, name: '深圳华强科技', type: '国内渠道商', region: '国内', lastYear: '¥5,680万', current: '¥3,920万', yoy: 24.6, progress: '69.0%', status: '正常' },
  { rank: 2, name: '上海新联电子', type: '国内渠道商', region: '国内', lastYear: '¥4,856万', current: '¥3,350万', yoy: 21.8, progress: '69.0%', status: '正常' },
  { rank: 3, name: '北京中科创新', type: '国内重点渠道商', region: '国内', lastYear: '¥3,280万', current: '¥2,190万', yoy: 18.4, progress: '66.8%', status: '正常' },
  { rank: 4, name: '杭州智联网终端', type: '国内地产客户', region: '国内', lastYear: '¥2,985万', current: '¥1,920万', yoy: 14.7, progress: '64.3%', status: '正常' },
  { rank: 5, name: '广州恒通科技', type: '国内渠道商', region: '国内', lastYear: '¥2,880万', current: '¥1,850万', yoy: 13.5, progress: '64.2%', status: '正常' },
  { rank: 6, name: '南京瑞景集团', type: '国内重点渠道商', region: '国内', lastYear: '¥2,020万', current: '¥1,420万', yoy: 16.4, progress: '70.3%', status: '正常' },
  { rank: 7, name: '青岛海联智能', type: '国内渠道商', region: '国内', lastYear: '¥1,880万', current: '¥1,286万', yoy: 11.7, progress: '68.4%', status: '正常' },
  { rank: 8, name: '厦门海沧科技', type: '国内渠道商', region: '国内', lastYear: '¥1,690万', current: '¥1,108万', yoy: 10.4, progress: '65.6%', status: '正常' },
  { rank: 9, name: '宁波华创设备', type: '国内渠道商', region: '国内', lastYear: '¥1,510万', current: '¥1,020万', yoy: 15.2, progress: '67.5%', status: '正常' },
  { rank: 10, name: '西安宏图科技', type: '国内渠道商', region: '国内', lastYear: '¥1,390万', current: '¥980万', yoy: 12.7, progress: '70.5%', status: '正常' },
  { rank: 11, name: '成都西部电子', type: '国内地产客户', region: '国内', lastYear: '¥2,420万', current: '¥1,060万', yoy: -5.6, progress: '43.8%', status: '预警' },
  { rank: 12, name: '武汉光谷科技', type: '国内地产客户', region: '国内', lastYear: '¥2,150万', current: '¥1,120万', yoy: -3.1, progress: '52.1%', status: '关注' },
  { rank: 13, name: '天津云谷电子', type: '国内渠道商', region: '国内', lastYear: '¥1,560万', current: '¥890万', yoy: 4.8, progress: '57.1%', status: '关注' },
  { rank: 14, name: '苏州明科电子', type: 'ODM客户', region: '国内', lastYear: '¥1,820万', current: '¥1,188万', yoy: 8.9, progress: '65.3%', status: '正常' },
  { rank: 15, name: '重庆新兴地产', type: '国内地产客户', region: '国内', lastYear: '¥1,760万', current: '¥910万', yoy: -1.8, progress: '51.7%', status: '关注' },
  { rank: 16, name: '泉州海翼智能', type: '国内渠道商', region: '国内', lastYear: '¥1,080万', current: '¥730万', yoy: 8.2, progress: '67.6%', status: '正常' },
  { rank: 17, name: '合肥科锐系统', type: '国内地产客户', region: '国内', lastYear: '¥1,455万', current: '¥780万', yoy: -2.5, progress: '53.6%', status: '关注' },
  { rank: 18, name: '佛山德联电子', type: 'ODM客户', region: '国内', lastYear: '¥1,220万', current: '¥835万', yoy: 7.6, progress: '68.4%', status: '正常' },
  { rank: 19, name: '长沙星城置业', type: '国内地产客户', region: '国内', lastYear: '¥1,285万', current: '¥620万', yoy: -8.5, progress: '48.2%', status: '关注' },
  { rank: 20, name: '郑州城市发展', type: '国内地产客户', region: '国内', lastYear: '¥1,180万', current: '¥510万', yoy: -11.9, progress: '43.2%', status: '预警' },
  { rank: 21, name: '沈阳北方置业', type: '国内地产客户', region: '国内', lastYear: '¥1,035万', current: '¥430万', yoy: -13.6, progress: '41.5%', status: '预警' },
  { rank: 22, name: '无锡联创科技', type: 'ODM客户', region: '国内', lastYear: '¥980万', current: '¥668万', yoy: 10.1, progress: '68.2%', status: '正常' },
  { rank: 23, name: '东莞精密制造', type: '国内渠道商', region: '国内', lastYear: '¥2,680万', current: '¥520万', yoy: -42.6, progress: '19.4%', status: '预警' },
  { rank: 24, name: '常州科恒电气', type: '国内重点渠道商', region: '国内', lastYear: '¥930万', current: '¥610万', yoy: 6.3, progress: '65.6%', status: '正常' },
  { rank: 25, name: '南通嘉诚智能', type: '国内渠道商', region: '国内', lastYear: '¥880万', current: '¥560万', yoy: 5.8, progress: '63.6%', status: '正常' },
  { rank: 26, name: '哈尔滨北辰电子', type: '国内地产客户', region: '国内', lastYear: '¥820万', current: '¥392万', yoy: -7.9, progress: '47.8%', status: '关注' },
  { rank: 27, name: '昆明云投科技', type: '国内渠道商', region: '国内', lastYear: '¥790万', current: '¥516万', yoy: 6.9, progress: '65.3%', status: '正常' },
  { rank: 28, name: '济南鲁信设备', type: 'ODM客户', region: '国内', lastYear: '¥760万', current: '¥498万', yoy: 8.4, progress: '65.5%', status: '正常' },
  { rank: 29, name: '太原晋能置业', type: '国内地产客户', region: '国内', lastYear: '¥720万', current: '¥322万', yoy: -10.8, progress: '44.7%', status: '预警' },
  { rank: 30, name: '福州闽海科技', type: '国内渠道商', region: '国内', lastYear: '¥690万', current: '¥466万', yoy: 7.2, progress: '67.5%', status: '正常' },
  { rank: 1, name: '新加坡AsiaTech', type: '国际重点渠道商', region: '国际', lastYear: '¥3,650万', current: '¥2,460万', yoy: 32.5, progress: '67.4%', status: '正常' },
  { rank: 2, name: '印度MumbaiTech', type: 'ODM客户', region: '国际', lastYear: '¥2,760万', current: '¥1,720万', yoy: 29.4, progress: '62.3%', status: '正常' },
  { rank: 3, name: '迪拜GulfBuild', type: '国际重点渠道商', region: '国际', lastYear: '¥1,620万', current: '¥1,190万', yoy: 31.8, progress: '73.5%', status: '正常' },
  { rank: 4, name: '马来西亚MegaHome', type: '国际发展组客户', region: '国际', lastYear: '¥1,330万', current: '¥965万', yoy: 25.1, progress: '72.6%', status: '正常' },
  { rank: 5, name: '越南VinaTech', type: '国际发展组客户', region: '国际', lastYear: '¥1,125万', current: '¥830万', yoy: 34.2, progress: '73.8%', status: '正常' },
  { rank: 6, name: '泰国BangkokHome', type: '国际发展组客户', region: '国际', lastYear: '¥920万', current: '¥675万', yoy: 27.8, progress: '73.4%', status: '正常' },
  { rank: 7, name: '印尼JakartaBuild', type: '国际渠道商', region: '国际', lastYear: '¥890万', current: '¥638万', yoy: 24.6, progress: '71.7%', status: '正常' },
  { rank: 8, name: '菲律宾ManilaTech', type: '国际渠道商', region: '国际', lastYear: '¥840万', current: '¥590万', yoy: 23.5, progress: '70.2%', status: '正常' },
  { rank: 9, name: '韩国SeoulSmart', type: '国际重点渠道商', region: '国际', lastYear: '¥790万', current: '¥556万', yoy: 21.4, progress: '70.4%', status: '正常' },
  { rank: 10, name: '日本TokyoHome', type: '国际渠道商', region: '国际', lastYear: '¥760万', current: '¥515万', yoy: 18.6, progress: '67.8%', status: '正常' },
  { rank: 11, name: '澳洲SydneyBuild', type: '国际重点渠道商', region: '国际', lastYear: '¥720万', current: '¥486万', yoy: 19.2, progress: '67.5%', status: '正常' },
  { rank: 12, name: '德国BerlinTech', type: '国际发展组客户', region: '国际', lastYear: '¥690万', current: '¥452万', yoy: 15.5, progress: '65.5%', status: '正常' },
  { rank: 13, name: '法国ParisDesign', type: '国际渠道商', region: '国际', lastYear: '¥660万', current: '¥418万', yoy: 13.2, progress: '63.3%', status: '正常' },
  { rank: 14, name: '英国LondonBuild', type: '国际重点渠道商', region: '国际', lastYear: '¥640万', current: '¥396万', yoy: 12.6, progress: '61.9%', status: '正常' },
  { rank: 15, name: '加拿大MapleHome', type: '国际发展组客户', region: '国际', lastYear: '¥610万', current: '¥365万', yoy: 9.4, progress: '59.8%', status: '关注' },
  { rank: 16, name: '美国PacificTech', type: '国际渠道商', region: '国际', lastYear: '¥590万', current: '¥352万', yoy: 8.8, progress: '59.7%', status: '关注' },
  { rank: 17, name: '墨西哥CasaPlus', type: '国际发展组客户', region: '国际', lastYear: '¥560万', current: '¥336万', yoy: 11.7, progress: '60.0%', status: '正常' },
  { rank: 18, name: '巴西RioBuild', type: '国际渠道商', region: '国际', lastYear: '¥535万', current: '¥318万', yoy: 10.3, progress: '59.4%', status: '关注' },
  { rank: 19, name: '土耳其AnkaraHome', type: '国际重点渠道商', region: '国际', lastYear: '¥510万', current: '¥296万', yoy: 7.8, progress: '58.0%', status: '关注' },
  { rank: 20, name: '沙特RiyadhBuild', type: '国际发展组客户', region: '国际', lastYear: '¥485万', current: '¥286万', yoy: 14.9, progress: '59.0%', status: '关注' },
  { rank: 21, name: '阿联酋EmiratesHome', type: '国际重点渠道商', region: '国际', lastYear: '¥460万', current: '¥282万', yoy: 16.4, progress: '61.3%', status: '正常' },
  { rank: 22, name: '埃及CairoTech', type: '国际渠道商', region: '国际', lastYear: '¥438万', current: '¥242万', yoy: 5.6, progress: '55.3%', status: '关注' },
  { rank: 23, name: '南非CapeBuild', type: '国际发展组客户', region: '国际', lastYear: '¥420万', current: '¥226万', yoy: 4.9, progress: '53.8%', status: '关注' },
  { rank: 24, name: '智利SantiagoHome', type: '国际渠道商', region: '国际', lastYear: '¥395万', current: '¥205万', yoy: 2.6, progress: '51.9%', status: '关注' },
  { rank: 25, name: '波兰WarsawTech', type: '国际发展组客户', region: '国际', lastYear: '¥372万', current: '¥198万', yoy: 6.2, progress: '53.2%', status: '关注' },
  { rank: 26, name: '意大利MilanHome', type: '国际渠道商', region: '国际', lastYear: '¥350万', current: '¥172万', yoy: -3.8, progress: '49.1%', status: '关注' },
  { rank: 27, name: '西班牙MadridBuild', type: '国际发展组客户', region: '国际', lastYear: '¥330万', current: '¥158万', yoy: -5.4, progress: '47.9%', status: '关注' },
  { rank: 28, name: '荷兰AmsterdamTech', type: '国际重点渠道商', region: '国际', lastYear: '¥315万', current: '¥132万', yoy: -8.2, progress: '41.9%', status: '预警' },
  { rank: 29, name: '瑞典NordicHome', type: '国际渠道商', region: '国际', lastYear: '¥298万', current: '¥116万', yoy: -10.1, progress: '38.9%', status: '预警' },
  { rank: 30, name: '新西兰AucklandBuild', type: '国际发展组客户', region: '国际', lastYear: '¥280万', current: '¥98万', yoy: -12.8, progress: '35.0%', status: '预警' },
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

function statusTone(status: string) {
  if (status === '预警' || status === '存在风险') return 'red';
  if (status === '关注' || status === '冲刺中') return 'amber';
  return 'green';
}

export default function CompanyQuarterlyReport() {
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
            <h1 className="text-[24px] font-bold text-slate-900">{report?.name || 'Q2 2025季度综合报告'}</h1>
            <p className="mt-1 text-[13px] text-slate-500">统计周期：2025年4月1日 - 6月30日（公司级）</p>
          </div>
          <div className="flex items-center gap-2 pt-8">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              打印
            </Button>
            <Button size="sm" onClick={() => toast.success('公司级季报已开始导出')}>
              <Download className="h-4 w-4" />
              导出报告
            </Button>
          </div>
        </div>

        <Card>
          <SectionHeader index={1} title="本季度核心指标总览" />
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
          <SectionHeader index={2} title="本季经验总结" />
          <SummaryBox>
            <div className="space-y-3">
              <p className="indent-8">
                本季公司整体开单额为 <Highlight>¥3.42亿</Highlight>，达成季度目标 <Highlight>114.0%</Highlight>，同比去年同期 <TrendText value={20.6} />，环比上季度 <TrendText value={14.8} />，整体表现好于上季度和去年同期，说明二季度需求承接、订单交付和重点渠道冲刺均处于扩张状态。其中，国内开单 <Highlight>¥2.12亿</Highlight>，国际开单 <Highlight>¥1.30亿</Highlight>，国际业务同比 <TrendText value={27.5} />、环比 <TrendText value={18.6} />，增速明显高于国内，是本季新增量最强的来源。
              </p>
              <p className="indent-8">
                从头部贡献看，<Highlight>全球渠道部</Highlight>本季开单 <Highlight>¥1.83亿</Highlight>，贡献规模最大，是公司季度达成的核心支撑；<Highlight>国际酒店部</Highlight>同比 <TrendText value={24.4} />，增长弹性最好，说明海外项目和酒店渠道的订单承接能力正在增强；<Highlight>国内大客户部</Highlight>本季开单 <Highlight>¥7,560万</Highlight>，仍保持稳定贡献，但同比增速低于公司整体，需要进一步推动重点项目验收和复购节奏。渠道结构上，国内重点渠道商和国际重点渠道商合计开单约 <Highlight>¥2.20亿</Highlight>，占本季开单约 <Highlight>64.3%</Highlight>，头部渠道盘仍是季度结果的关键抓手。
              </p>
              <p className="indent-8">
                从客户结构看，<Highlight>国内渠道商</Highlight>和<Highlight>国际渠道商</Highlight>仍是主要开单来源，ODM 客户本季开单 <Highlight>¥6,760万</Highlight>，同比 <TrendText value={33.3} />，是本季最有弹性的客户类型；但国内地产客户、本季低进度渠道商和部分尾部客户增长偏慢，容易稀释头部客户带来的增量。公司前 30 客户中，头部客户仍保持稳定贡献，尾部客户则需要关注复购频次、项目延期和价格竞争带来的流失风险。
              </p>
              <p className="indent-8">
                从目标与风险看，Q2 当前季度目标开单额 <Highlight>¥3.0亿</Highlight>，实际完成 <Highlight>¥3.42亿</Highlight>，季度目标已超额完成；但全年目标仍需要继续拉动 Q3、Q4 的排期承接。未结束订单、低进度渠道商和地产客户恢复节奏仍是下季度的主要风险点，尤其需要明确超期订单责任人、预计结单时间和跨部门协同节点，避免尾部订单滚动影响后续季度开单节奏。
              </p>
              <WarningText>重点关注：下季度建议继续锁定国际重点渠道商订单排期，同时对国内大客户部、地产客户、低进度渠道商和未结束订单建立专项跟进清单；头部客户要稳定复购，尾部客户要明确责任人与转化计划，避免季度增长过度依赖少数头部渠道。</WarningText>
            </div>
          </SummaryBox>
          <div className="grid grid-cols-1 gap-6 px-6 pb-6 lg:grid-cols-2">
            <ChartBlock title="季度开单额对比（本季度 / 上季度 / 去年同期）" summary="小结：本季度总开单、国内开单、国际开单均高于上季度和去年同期，说明公司整体需求仍处于扩张状态。" bubble={<><div className="font-semibold text-slate-700">总开单额</div><div className="text-blue-600">本季度：¥34,200万</div><div className="text-sky-500">上季度：¥29,800万</div><div className="text-slate-400">去年同期：¥28,350万</div></>}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quarterCompare}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(value) => `¥${(Number(value) / 10000).toFixed(1)}亿`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => [amountTooltip(value), '']} />
                  <Legend />
                  <Bar dataKey="本季度" fill="#2563EB" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="上季度" fill="#60A5FA" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="去年同期" fill="#CBD5E1" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartBlock>
            <ChartBlock title="各部门季度开单额及同比" summary="小结：全球渠道部贡献最高，国际酒店部同比增幅最大，国内大客户部仍有进一步提升空间。" bubble={<><div className="font-semibold text-slate-700">全球渠道部</div><div className="text-blue-600">本季度开单：¥18,260万</div><div className="text-sky-500">去年同期：¥14,980万</div><div className="text-amber-500">同比增幅：21.9%</div></>}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={deptTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="amount" tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="rate" orientation="right" tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value, name) => [name === '同比增幅' ? percentTooltip(value) : amountTooltip(value), name]} />
                  <Legend />
                  <Bar yAxisId="amount" dataKey="本季度开单" fill="#2563EB" radius={[5, 5, 0, 0]} />
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
                  本季度国内、国际重点渠道商合计开单 <Highlight>¥2.20亿</Highlight>，占公司本季度开单额约 <Highlight>64.3%</Highlight>，是拉动季度开单的核心渠道盘。其中国内重点渠道商开单 <Highlight>¥1.36亿</Highlight>，环比提升 11.7%，同比 <TrendText value={20.4} />，贡献规模更大。
                </p>
                <p>
                  国际重点渠道商本季度开单 <Highlight>¥8,420万</Highlight>，环比提升 23.6%，同比 <TrendText value={30.3} />，增速明显高于国内。国内渠道商胜在规模和稳定供给，国际渠道商胜在增速和新增空间；下季度建议继续锁定国际重点渠道商订单排期，同时保持国内头部渠道商复购稳定。
                </p>
              </div>
              <WarningText>重点关注：国际重点渠道商增速更好，但客户数量和交付链路仍相对集中；国内重点渠道商需关注中腰部客户是否跟上头部节奏，避免季度开单过度集中在少数渠道。</WarningText>
            </div>
            <ChartBlock title="国内/国际重点渠道商季度开单能力对比" summary="小结：国内重点渠道商贡献规模更高，国际重点渠道商同比增速更快，二者分别承担基本盘和增量盘。">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={keyDealerShipCompare}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="amount" tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={(value) => `¥${Number(value) / 1000}千万`} />
                  <YAxis yAxisId="rate" orientation="right" tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value, name) => [name === '同比增长' ? percentTooltip(value) : amountTooltip(value), name]} />
                  <Legend />
                  <Bar yAxisId="amount" dataKey="本季度开单" fill="#2563EB" radius={[5, 5, 0, 0]} />
                  <Bar yAxisId="amount" dataKey="上季度开单" fill="#60A5FA" radius={[5, 5, 0, 0]} />
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
            onViewAll={() => navigate(`/quarterly-report/company/${reportId || report?.id || '11'}/key-channel-dealers?tab=${keyChannelScope}`)}
          />
        </Card>

        <Card>
          <SectionHeader index={4} title="国内渠道商季度目标进展与返点测算" />
          <SummaryBox>
            本年度国内渠道商季度目标分解为：<Highlight>Q1: 15%</Highlight>、<Highlight>Q2: 25%</Highlight>、<Highlight>Q3: 30%</Highlight>、<Highlight>Q4: 30%</Highlight>（季度单独比率，不累计）。本报告为 Q2 季报，季度目标开单额为 <Highlight>¥3.0亿</Highlight>，实际完成 <Highlight>¥3.42亿</Highlight>，季度完成率 <Highlight>114.0%</Highlight>，超额完成 <Highlight>¥4,200万</Highlight>。
            <br />
            从渠道商达成情况看，深圳华强科技、上海新联电子、北京中科创新已提前达成 Q2 目标，形成主要贡献；杭州智联网络、西安宏图科技仍处于冲刺区间，成都西部电子、东莞精密制造存在一定跨期风险，需要在 Q3 初期继续跟进。
          </SummaryBox>
          <div className="px-6 pb-4">
            <ChartBlock title="Q1-Q4 季度目标完成进度" summary="小结：Q2 已超额完成，Q3 目标占全年 30%，需要提前锁定渠道商冲刺项目。" bubble={<><div className="font-semibold text-slate-700">Q2</div><div className="text-blue-600">目标：¥3.0亿</div><div className="text-blue-600">已完成：¥3.42亿</div><div className="text-amber-500">完成率：114.0%</div></>}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={quarterGoal}>
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
            <ReportTable title="国内渠道商季度目标达成明细" tag={<Button variant="outline" size="sm" onClick={() => navigate(`/quarterly-report/company/${reportId || report?.id || '11'}/domestic-channel-quarter-targets`)}>查看全部</Button>}>
              <thead><tr><th>渠道商名称</th><th className="text-center">所属部门</th><th className="text-right">Q2目标</th><th className="text-right">Q2已完成</th><th className="text-right">目标完成率</th><th className="text-center">目标是否达成</th></tr></thead>
              <tbody>{quarterTargetPreviewRows.map((row) => <tr key={row.name}><td className="font-semibold">{row.name}</td><td className="text-center">{row.dept}</td><td className="text-right">{row.target}</td><td className="text-right font-semibold">{row.done}</td><td className="text-right"><Tag tone={statusTone(row.status)}>{row.rate}</Tag></td><td className="text-center"><Tag tone={statusTone(row.status)}>{row.status}</Tag></td></tr>)}</tbody>
            </ReportTable>
          </div>
        </Card>

        <Card>
          <SectionHeader index={5} title="各类型客户季度开单分析" />
          <SummaryBox>
            国内渠道商仍是季度开单主力，合计开单 <Highlight>¥2.12亿</Highlight>，贡献规模稳定；ODM客户本季度开单 <Highlight>¥6,760万</Highlight>，同比 <TrendText value={33.3} />，增速领先，是本季度最有弹性的客户类型。国际重点渠道商和国际发展组客户增速均高于国内客户，说明海外客户结构正在变得更有质量。
          </SummaryBox>
          <div className="grid grid-cols-1 gap-6 px-6 pb-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartBlock title="国内地产客户 vs ODM客户季度开单对比" summary="小结：ODM客户季度增速明显高于国内地产客户，是Q2最主要的弹性增量来源。" bubble={<><div className="font-semibold text-slate-700">ODM客户</div><div className="text-blue-600">本季度：¥6,760万</div><div className="text-sky-500">上季度：¥5,480万</div><div className="text-slate-400">去年同期：¥5,070万</div></>}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerTypeCompare}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                    <Tooltip formatter={(value) => [amountTooltip(value), '']} />
                    <Legend />
                    <Bar dataKey="本季度" fill="#2563EB" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="上季度" fill="#60A5FA" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="去年同期" fill="#CBD5E1" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartBlock>
            </div>
            <ChartBlock title="客户类型季度开单占比" summary="小结：国内渠道商占比最高，ODM客户与国际重点渠道商构成第二增长曲线。">
              <PieChartBlock data={customerTypes} bubble="开单额：¥9,180万" />
            </ChartBlock>
          </div>
          <div className="px-6 pb-6">
            <ReportTable title="各类型客户季度开单汇总">
              <thead><tr><th>客户类型</th><th className="text-right">本季度开单额</th><th className="text-right">上季度开单额</th><th className="text-right">环比</th><th className="text-right">去年同期</th><th className="text-right">同比</th><th className="text-right">本年累计</th><th className="text-center">趋势</th></tr></thead>
              <tbody>{typeSummaryRows.map((row) => <tr key={row.type}><td className="font-semibold">{row.type}</td><td className="text-right font-semibold">{row.amount}</td><td className="text-right">{row.prev}</td><td className="text-right"><TrendText value={row.mom} /></td><td className="text-right">{row.last}</td><td className="text-right"><TrendText value={row.yoy} /></td><td className="text-right">{row.total}</td><td className="text-center text-emerald-600">{row.trend}</td></tr>)}</tbody>
            </ReportTable>
          </div>
        </Card>

        <Card>
          <SectionHeader index={6} title="2025年前30客户 & 2025年Q2开单情况" />
          <SummaryBox>
            从 Q2 表现看，2025 年前30客户中的头部客户仍保持主要贡献，国内客户规模更厚，国际客户增速更快。深圳华强科技、上海新联电子、新加坡 AsiaTech 继续保持头部位置，其中新加坡 AsiaTech、迪拜 GulfBuild 等国际客户季度同比增速明显高于国内平均，说明国际重点客户承接能力增强。
            <WarningText>客户流失预警：东莞精密制造 Q2 进度明显偏慢，需安排专项回访；国际客户虽然增速更好，但订单兑现对交付周期和跨境物流更敏感，需要提前锁定 Q3 排期。</WarningText>
          </SummaryBox>
          <div className="px-6 pb-6">
            <div className="mb-4 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button type="button" className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${annualScope === 'domestic' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`} onClick={() => setAnnualScope('domestic')}>国内客户</button>
              <button type="button" className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${annualScope === 'international' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`} onClick={() => setAnnualScope('international')}>国际客户</button>
            </div>
            <ReportTable title={`${annualScope === 'domestic' ? '国内' : '国际'}2025年前30客户Q2开单进展`} fullHeight tag={<><Tag tone="green">正常 ≥60%</Tag><Tag tone="amber">关注 45%-60%</Tag><Tag tone="red">预警 &lt;45%</Tag></>}>
              <thead><tr><th>2025排名</th><th>客户名称</th><th className="text-center">客户类型</th><th className="text-center">国内/国际</th><th className="text-right">2025年全年开单</th><th className="text-right">2025年Q2开单</th><th className="text-right">同比去年Q2</th><th className="text-right">时间进度占比</th><th className="text-center">状态</th></tr></thead>
              <tbody>{annualScopeRows.map((row) => <tr key={row.name} className={row.status === '预警' ? 'bg-red-50' : row.status === '关注' ? 'bg-amber-50' : 'bg-emerald-50'}><td><span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{row.rank}</span></td><td className="font-semibold">{row.name}</td><td className="text-center"><Tag tone={row.region === '国际' ? 'green' : 'blue'}>{row.type}</Tag></td><td className="text-center">{row.region}</td><td className="text-right">{row.lastYear}</td><td className="text-right font-semibold">{row.current}</td><td className="text-right"><TrendText value={row.yoy} /></td><td className="text-right font-semibold">{row.progress}</td><td className="text-center"><Tag tone={statusTone(row.status)}>{row.status}</Tag></td></tr>)}</tbody>
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
  rows: typeof keyChannelDealerGroups.domestic;
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
        <button type="button" className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${activeScope === 'domestic' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`} onClick={() => onScopeChange('domestic')}>国内重点渠道商</button>
        <button type="button" className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${activeScope === 'international' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`} onClick={() => onScopeChange('international')}>国际重点渠道商</button>
      </div>
      <ReportTable title="">
        <thead><tr><th>渠道商名称</th><th className="text-right">本季度开单额</th><th className="text-right">上季度开单额</th><th className="text-right">环比</th><th className="text-right">去年同期</th><th className="text-right">同比</th><th className="text-right">本年累计</th><th className="text-center">趋势</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.name}><td className="font-semibold">{row.name}</td><td className="text-right font-semibold">{row.current}</td><td className="text-right">{row.previous}</td><td className="text-right"><TrendText value={row.mom} /></td><td className="text-right">{row.lastYear}</td><td className="text-right"><TrendText value={row.yoy} /></td><td className="text-right">{row.total}</td><td className="text-center text-emerald-600">{row.trend}</td></tr>)}</tbody>
      </ReportTable>
    </div>
  );
}

function PieChartBlock({ data, bubble }: { data: { name: string; value: number; fill: string }[]; bubble: string }) {
  return (
    <div className="relative h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={120} paddingAngle={2}>
            {data.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute left-1/2 top-1/2 rounded-md border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-primary shadow-sm">{bubble}</div>
    </div>
  );
}

function ChartBlock({ title, summary, bubble, children }: { title: string; summary: string; bubble?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-[14px] font-semibold text-slate-700">{title}</h3>
      <div className="relative h-[300px]">
        {children}
        {bubble && <div className="pointer-events-none absolute left-[45%] top-[35%] rounded-md border border-slate-200 bg-white px-4 py-3 text-[13px] leading-7 shadow-sm">{bubble}</div>}
      </div>
      <div className="mt-3 rounded-lg bg-slate-50 px-4 py-3 text-[13px] leading-6 text-slate-500">{summary}</div>
    </div>
  );
}

function ReportTable({ title, tag, fullHeight = false, children }: { title: string; tag?: ReactNode; fullHeight?: boolean; children: ReactNode }) {
  return (
    <div>
      {(title || tag) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && <h3 className="text-[14px] font-semibold text-slate-700">{title}</h3>}
          {tag && <div className="flex flex-wrap justify-end gap-2">{tag}</div>}
        </div>
      )}
      <div className={`${fullHeight ? '' : 'max-h-[520px]'} overflow-auto rounded-lg border border-slate-200`}>
        <table className="w-full min-w-[900px] table-fixed border-collapse text-[13px] [&_td]:border-b [&_td]:border-slate-100 [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-slate-700 [&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:border-b [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-[12px] [&_th]:font-semibold [&_th]:text-slate-600 [&_tr:hover_td]:bg-slate-50">
          {children}
        </table>
      </div>
    </div>
  );
}

function Tag({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'red' }) {
  const styles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[tone]}`}>{children}</span>;
}
