import { useLocation, useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { domesticChannelQuarterRows } from './report/domesticChannelQuarterData';
import type { DomesticChannelQuarterRow } from './report/domesticChannelQuarterData';

function StatusTag({ status }: { status: DomesticChannelQuarterRow['status'] }) {
  const className =
    status === '存在风险'
      ? 'bg-red-50 text-red-600'
      : status === '冲刺中'
        ? 'bg-amber-50 text-amber-600'
        : 'bg-emerald-50 text-emerald-600';

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{status}</span>;
}

export default function DomesticChannelQuarterDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportId } = useParams();
  const isQuarterly = location.pathname.startsWith('/quarterly-report/');
  const backPath = `/${isQuarterly ? 'quarterly-report' : 'monthly-report'}/company/${reportId || (isQuarterly ? '11' : '17')}`;

  return (
    <Layout contentClassName="bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <div>
          <Button variant="ghost" size="sm" className="mb-3 gap-1.5 px-0 text-text-secondary" onClick={() => navigate(backPath)}>
            <ArrowLeft className="h-4 w-4" />
            {isQuarterly ? '返回公司级季报' : '返回公司级月报'}
          </Button>
          <h1 className="text-[24px] font-bold text-slate-900">国内渠道商季度目标达成明细</h1>
          <p className="mt-1 text-[13px] text-slate-500">查看 Q2 国内渠道商目标、完成额、完成率和当前达成状态。</p>
        </div>

        <section className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-slate-900">全部国内渠道商明细</h2>
              <p className="mt-1 text-[12px] text-slate-500">共 {domesticChannelQuarterRows.length} 条记录，按完成率和风险状态综合查看。</p>
            </div>
          </div>
          <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full min-w-[900px] table-fixed border-collapse text-[13px]">
              <thead>
                <tr className="bg-slate-50 text-[12px] font-semibold text-slate-600">
                  <th className="px-4 py-3 text-left">渠道商名称</th>
                  <th className="px-4 py-3 text-center">所属部门</th>
                  <th className="px-4 py-3 text-right">Q2目标</th>
                  <th className="px-4 py-3 text-right">Q2已完成</th>
                  <th className="px-4 py-3 text-right">目标完成率</th>
                  <th className="px-4 py-3 text-center">目标是否达成</th>
                </tr>
              </thead>
              <tbody>
                {domesticChannelQuarterRows.map((row) => (
                  <tr key={row.name} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-800">{row.name}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{row.dept}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.target}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">{row.done}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{row.rate}</td>
                    <td className="px-4 py-3 text-center"><StatusTag status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}
