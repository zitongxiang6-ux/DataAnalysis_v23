import { useMemo } from 'react';
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
} from 'recharts';
import { Toaster, toast } from 'sonner';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { reportList } from './report/mockData';
import type { Report } from './report/types';

const kpis = [
  { label: '本周出货总额', value: '¥2,856万', change: '12.5% 环比上周', trend: 'up', color: 'border-t-blue-600' },
  { label: '未结束订单金额', value: '¥1,425万', change: '5.2% 环比上周', trend: 'down', color: 'border-t-amber-600' },
  { label: '年完成额', value: '¥5.28亿', change: '目标进度正常', trend: 'up', color: 'border-t-teal-600' },
  { label: '年完成率', value: '42.5%', sub: '时间进度 41.7%', color: 'border-t-red-600' },
] as const;

const regionData = [
  { name: '全球渠道部', value: 980, fill: '#2563EB' },
  { name: '国内大客户部', value: 1026, fill: '#059669' },
  { name: '国际酒店部', value: 850, fill: '#7C3AED' },
];

const trendData = [
  { day: '周一', daily: 326, cumulative: 326 },
  { day: '周二', daily: 418, cumulative: 744 },
  { day: '周三', daily: 356, cumulative: 1100 },
  { day: '周四', daily: 502, cumulative: 1602 },
  { day: '周五', daily: 468, cumulative: 2070 },
  { day: '周六', daily: 392, cumulative: 2462 },
  { day: '周日', daily: 394, cumulative: 2856 },
];

const topSalespeople = [
  { rank: 1, name: '张伟', dept: '国内大客户部', amount: '¥386万', change: 15.2 },
  { rank: 2, name: '李娜', dept: '全球渠道部', amount: '¥312万', change: 8.7 },
  { rank: 3, name: '王强', dept: '国际酒店部', amount: '¥278万', change: -3.1 },
];

const topCustomers = [
  { rank: 1, name: '深圳华强科技', type: '签约渠道', amount: '¥425万', openOrder: '¥386万', danger: true },
  { rank: 2, name: '上海新联电子', type: '签约渠道', amount: '¥368万', openOrder: '¥52万' },
  { rank: 3, name: '新加坡AsiaTech', type: '国际客户', amount: '¥296万', openOrder: '¥128万' },
];

const overdueOrders = [
  { no: 'HT-202605001', customer: '深圳华强科技', owner: '张伟', amount: '¥386万', hours: '72小时', status: '待交付', danger: true },
  { no: 'HT-202605018', customer: '北京中科创新', owner: '刘洋', amount: '¥215万', hours: '48小时', status: '待确认' },
  { no: 'HT-202605023', customer: '新加坡AsiaTech', owner: '王强', amount: '¥128万', hours: '36小时', status: '海关清关' },
  { no: 'HT-202605029', customer: '杭州智联网络', owner: '陈静', amount: '¥96万', hours: '24小时', status: '生产中' },
  { no: 'HT-202605031', customer: '广州恒通科技', owner: '李娜', amount: '¥82万', hours: '18小时', status: '待发货' },
];

function getRankClass(rank: number) {
  if (rank === 1) return 'bg-amber-100 text-amber-700';
  if (rank === 2) return 'bg-slate-100 text-slate-600';
  return 'bg-orange-100 text-orange-700';
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

function formatTooltipAmount(value: unknown) {
  return `¥${Number(value ?? 0)}万`;
}

function SectionHeader({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-center gap-2 px-6 pt-5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[13px] font-semibold text-white">
        {index}
      </span>
      <h2 className="text-[16px] font-semibold text-slate-800">{title}</h2>
    </div>
  );
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[12px] border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function Tag({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'red' }) {
  const toneClass = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-100 text-red-800',
  }[tone];

  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${toneClass}`}>{children}</span>;
}

export default function CompanyWeeklyReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportId } = useParams();

  const report = useMemo(() => {
    const stateReport = (location.state as { report?: Report } | null)?.report;
    return stateReport || reportList.find((item) => item.id === reportId);
  }, [location.state, reportId]);

  return (
    <Layout contentClassName="bg-[#F1F5F9]">
      <Toaster position="bottom-right" />

      <div className="mx-auto max-w-[1280px] space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" className="mb-3 gap-1.5 px-0 text-text-secondary" onClick={() => navigate('/report-center')}>
              <ArrowLeft className="h-4 w-4" />
              返回销售报告
            </Button>
            <h1 className="text-[24px] font-bold text-slate-900">{report?.name || '销售周报'}</h1>
            <p className="mt-1 text-[13px] text-slate-500">
              统计周期：2026年5月12日 - 5月18日（第20周）
            </p>
          </div>
          <div className="flex items-center gap-2 pt-8">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              打印
            </Button>
            <Button size="sm" onClick={() => toast.success('公司级周报已开始导出')}>
              <Download className="h-4 w-4" />
              导出报告
            </Button>
          </div>
        </div>

        <Card>
          <SectionHeader index={1} title="本周核心指标总览" />
          <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
            {kpis.map((item) => (
              <div key={item.label} className={`rounded-[10px] border border-slate-200 border-t-[3px] bg-white p-5 ${item.color}`}>
                <div className="mb-2 text-[13px] font-medium text-slate-500">{item.label}</div>
                <div className="text-[28px] font-bold leading-tight text-slate-900">{item.value}</div>
                {'sub' in item && item.sub && (
                  <div className="mt-2 text-[12px] leading-5 text-slate-500">{item.sub}</div>
                )}
                {'change' in item && item.change && (
                  <div className={`mt-2 inline-flex rounded-md px-2 py-0.5 text-[12px] font-medium ${item.trend === 'up' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {item.trend === 'up' ? '▲' : '▼'} {item.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader index={2} title="本周经验总结" />
          <div className="px-6 pt-4 text-[14px] leading-8 text-slate-700">
            <p className="indent-8">
              从整体经营看，本周公司出货总额达到
              <span className="font-semibold text-primary"> ¥2,856万</span>，环比上周
              <span className="font-medium text-red-600"> 上升12.5%</span>，周目标完成率为
              <span className="font-semibold text-primary"> 87.2%</span>。全年累计完成
              <span className="font-semibold text-primary"> ¥5.28亿</span>，年完成率
              <span className="font-semibold text-primary"> 42.5%</span>，略高于时间进度 41.7%，说明年度节奏基本健康，但周度目标仍有小幅缺口。
            </p>
            <p className="mt-3 indent-8">
              从部门贡献看，本周出货主要由
              <span className="font-semibold text-primary"> 国内大客户部、全球渠道部、国际酒店部</span>
              三个部门支撑，其中国内大客户部贡献最高，全球渠道部保持稳定供给，国际酒店部仍是增量弹性来源。部门之间贡献较均衡，但头部部门对公司结果的影响更强，后续仍要关注核心部门的订单交付节奏。
            </p>
            <p className="mt-3 indent-8">
              从人员与客户看，张伟本周出货
              <span className="font-semibold text-primary"> ¥386万</span>，为业务员侧头部贡献；李娜保持第二梯队贡献，王强虽进入 TOP3 但环比有所回落。客户侧，深圳华强科技、上海新联电子、新加坡 AsiaTech 继续贡献主要出货，其中深圳华强科技金额最高，但也带来最大的未结订单风险。
            </p>
            <p className="mt-3 indent-8">
              从风险侧看，本周未结束订单金额
              <span className="font-semibold text-primary"> ¥1,425万</span>，其中深圳华强科技订单金额
              <span className="font-semibold text-primary"> ¥386万</span>、已超 72 小时未结单；北京中科创新、新加坡 AsiaTech 也存在待确认或清关类节点。建议按“金额高、时长长、交付链路复杂”三个维度设定优先级，避免风险订单滚动到下周。
            </p>
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-7 text-amber-800">
              <strong>重点关注：</strong>本周建议优先跟进深圳华强科技 HT-202605001 号订单，同步复盘王强负责客户的交付节点；对周目标未达成的部门，按业务员和客户两条线拆分缺口，推动下周初快速补单和出货。
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 px-6 pb-4 pt-5 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-[14px] font-semibold text-slate-700">各部门出货占比</h3>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip formatter={(value) => [formatTooltipAmount(value), '出货额']} />
                    <Pie data={regionData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={2}>
                      {regionData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                    </Pie>
                    <Legend verticalAlign="bottom" height={28} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[12px] leading-6 text-slate-600">
                小结：国内大客户部贡献 ¥1,026万，占比最高；全球渠道部与国际酒店部贡献接近，三个核心部门共同支撑本周主要出货。
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-[14px] font-semibold text-slate-700">本周（周一到周日）出货趋势</h3>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `¥${value}万`} />
                    <Tooltip formatter={(value, name) => [formatTooltipAmount(value), name === 'daily' ? '日出货额' : '累计出货额']} />
                    <Legend formatter={(value) => (value === 'daily' ? '日出货额' : '累计出货额')} />
                    <Line type="monotone" dataKey="daily" stroke="#2563EB" strokeWidth={2.3} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="cumulative" stroke="#059669" strokeWidth={2.3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[12px] leading-6 text-slate-600">
                小结：周四形成本周单日高点，之后日出货额略有回落，但累计曲线持续上行，说明整体交付节奏稳定。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 px-6 pb-6 lg:grid-cols-2">
            <ReportTable title="业务员出货 TOP3" tag={<Tag>本周</Tag>}>
              <thead>
                <tr><th>排名</th><th>业务员姓名</th><th>所属事业部</th><th className="text-right">出货额</th><th className="text-right">环比</th></tr>
              </thead>
              <tbody>
                {topSalespeople.map((item) => (
                  <tr key={item.rank}>
                    <td><span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${getRankClass(item.rank)}`}>{item.rank}</span></td>
                    <td className="font-semibold">{item.name}</td>
                    <td>{item.dept}</td>
                    <td className="text-right font-semibold">{item.amount}</td>
                    <td className="text-right"><TrendText value={item.change} /></td>
                  </tr>
                ))}
              </tbody>
            </ReportTable>

            <ReportTable title="客户出货 TOP3" tag={<Tag tone="green">本周</Tag>}>
              <thead>
                <tr><th>排名</th><th>客户名称</th><th>客户类型</th><th className="text-right">出货额</th><th className="text-right">未结订单</th></tr>
              </thead>
              <tbody>
                {topCustomers.map((item) => (
                  <tr key={item.rank}>
                    <td><span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${getRankClass(item.rank)}`}>{item.rank}</span></td>
                    <td className="font-semibold">{item.name}</td>
                    <td><Tag tone={item.type === '国际客户' ? 'green' : 'blue'}>{item.type}</Tag></td>
                    <td className="text-right font-semibold">{item.amount}</td>
                    <td className={`text-right font-semibold ${item.danger ? 'text-red-600' : 'text-slate-500'}`}>{item.openOrder}</td>
                  </tr>
                ))}
              </tbody>
            </ReportTable>
          </div>

          <div className="px-6 pb-6">
            <ReportTable title="超时未结束订单明细（TOP5）" tag={<Tag tone="amber">需重点关注</Tag>}>
              <thead>
                <tr><th>订单编号</th><th>客户名称</th><th>所属业务员</th><th className="text-right">订单金额</th><th className="text-center">已下单时长</th><th className="text-center">订单状态</th></tr>
              </thead>
              <tbody>
                {overdueOrders.map((item) => (
                  <tr key={item.no} className={item.danger ? 'bg-red-50' : ''}>
                    <td className="font-semibold">{item.no}</td>
                    <td>{item.customer}</td>
                    <td>{item.owner}</td>
                    <td className="text-right font-semibold">{item.amount}</td>
                    <td className={`text-center font-semibold ${item.danger ? 'text-red-600' : 'text-amber-600'}`}>{item.hours}</td>
                    <td className="text-center"><Tag tone={item.danger ? 'red' : 'amber'}>{item.status}</Tag></td>
                  </tr>
                ))}
              </tbody>
            </ReportTable>
          </div>
        </Card>

      </div>
    </Layout>
  );
}

function ReportTable({ title, tag, children }: { title: string; tag?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-slate-700">{title}</h3>
        {tag}
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full border-collapse text-[13px] [&_td]:border-b [&_td]:border-slate-100 [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-slate-700 [&_th]:border-b [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-[12px] [&_th]:font-semibold [&_th]:text-slate-600 [&_tr:hover_td]:bg-slate-50">
          {children}
        </table>
      </div>
    </div>
  );
}
