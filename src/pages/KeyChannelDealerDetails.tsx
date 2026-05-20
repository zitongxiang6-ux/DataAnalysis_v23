import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { keyChannelDealerGroups } from './report/keyChannelDealerData';
import type { KeyChannelDealerRow, KeyChannelDealerScope } from './report/keyChannelDealerData';

function TrendValue({ value }: { value: number }) {
  const isUp = value >= 0;
  return <span className={isUp ? 'font-medium text-red-600' : 'font-medium text-emerald-600'}>{isUp ? '↗' : '↘'} {Math.abs(value).toFixed(1)}%</span>;
}

function DealerTable({ rows, periodLabel }: { rows: KeyChannelDealerRow[]; periodLabel: string }) {
  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[980px] table-fixed border-collapse text-[13px]">
        <thead>
          <tr className="bg-slate-50 text-[12px] font-semibold text-slate-600">
            <th className="px-4 py-3 text-left">渠道商名称</th>
            <th className="px-4 py-3 text-right">本{periodLabel}出货额</th>
            <th className="px-4 py-3 text-right">上{periodLabel}出货额</th>
            <th className="px-4 py-3 text-right">环比</th>
            <th className="px-4 py-3 text-right">去年同期</th>
            <th className="px-4 py-3 text-right">同比</th>
            <th className="px-4 py-3 text-right">本年累计</th>
            <th className="px-4 py-3 text-center">趋势</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-800">{row.name}</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-700">{row.current}</td>
              <td className="px-4 py-3 text-right text-slate-600">{row.previous}</td>
              <td className="px-4 py-3 text-right"><TrendValue value={row.mom} /></td>
              <td className="px-4 py-3 text-right text-slate-600">{row.lastYear}</td>
              <td className="px-4 py-3 text-right"><TrendValue value={row.yoy} /></td>
              <td className="px-4 py-3 text-right text-slate-700">{row.total}</td>
              <td className="px-4 py-3 text-center text-emerald-600">{row.trend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function KeyChannelDealerDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportId } = useParams();
  const [searchParams] = useSearchParams();
  const initialScope = searchParams.get('tab') === 'international' ? 'international' : 'domestic';
  const [activeScope, setActiveScope] = useState<KeyChannelDealerScope>(initialScope);
  const rows = useMemo(() => keyChannelDealerGroups[activeScope], [activeScope]);
  const isQuarterly = location.pathname.startsWith('/quarterly-report/');
  const backPath = `/${isQuarterly ? 'quarterly-report' : 'monthly-report'}/company/${reportId || (isQuarterly ? '11' : '17')}`;
  const periodLabel = isQuarterly ? '季度' : '月';

  return (
    <Layout contentClassName="bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" className="mb-3 gap-1.5 px-0 text-text-secondary" onClick={() => navigate(backPath)}>
              <ArrowLeft className="h-4 w-4" />
              {isQuarterly ? '返回公司级季报' : '返回公司级月报'}
            </Button>
            <h1 className="text-[24px] font-bold text-slate-900">重点渠道商出货明细</h1>
            <p className="mt-1 text-[13px] text-slate-500">按国内、国际重点渠道商查看本{periodLabel}出货表现与同比/环比变化。</p>
          </div>
        </div>

        <section className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${activeScope === 'domestic' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                onClick={() => setActiveScope('domestic')}
              >
                国内重点渠道商
              </button>
              <button
                type="button"
                className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${activeScope === 'international' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                onClick={() => setActiveScope('international')}
              >
                国际重点渠道商
              </button>
            </div>
            <span className="text-[13px] text-slate-500">共 {rows.length} 条</span>
          </div>
          <DealerTable rows={rows} periodLabel={periodLabel} />
        </section>
      </div>
    </Layout>
  );
}
