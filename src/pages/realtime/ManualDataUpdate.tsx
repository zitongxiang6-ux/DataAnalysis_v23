import { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { SectionCard } from '@/components/ui/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type UpdateMode = 'today' | 'range';
type UpdateStatus = '更新中' | '已完成';

interface UpdateRecord {
  id: number;
  startedAt: string;
  completedAt: string;
  operator: string;
  status: UpdateStatus;
}

const affectedMenus = [
  '部门开单统计',
  '业务开单统计',
  '客户开单统计',
  '签约渠道商季度目标统计',
  '我的开单统计',
];

const initialRecords: UpdateRecord[] = [
  { id: 1, startedAt: '2026-05-27 19:00:00', completedAt: '2026-05-27 19:08:26', operator: '系统', status: '已完成' },
  { id: 2, startedAt: '2026-05-27 14:26:18', completedAt: '-', operator: '管理员', status: '更新中' },
];

function formatDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function ManualDataUpdate() {
  const [mode, setMode] = useState<UpdateMode>('today');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [records, setRecords] = useState<UpdateRecord[]>(initialRecords);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = () => {
    if (mode === 'range' && (!startTime || !endTime)) {
      toast.info('请选择开始时间和结束时间');
      return;
    }

    setConfirmOpen(true);
  };

  const submitUpdate = () => {
    toast.success('数据更新任务已提交', {
      description:
        mode === 'today'
          ? '将更新昨天更新时间至当前操作时间内产生的数据。'
          : '将按所选时间段重新计算数据，并重新核算退单剔除。',
    });
    setRecords((prev) => [
      {
        id: prev.length + 1,
        startedAt: formatDateTime(new Date()),
        completedAt: '-',
        operator: '管理员',
        status: '更新中',
      },
      ...prev,
    ]);
    setConfirmOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <SectionCard title="手动更新数据">
        <div className="max-w-[860px]">
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-[13px] leading-6 text-blue-900">
            <RefreshCw className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
            <div>
              选择本次数据更新范围，提交后系统会按所选范围同步并重新汇总统计结果。
            </div>
          </div>

          <div className="mb-5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-4">
            <div className="mb-3 text-[14px] font-semibold text-[#111827]">本次更新会刷新以下菜单数据</div>
            <div className="flex flex-wrap gap-2">
              {affectedMenus.map((menu) => (
                <span
                  key={menu}
                  className="rounded-full border border-blue-100 bg-white px-3 py-1 text-[12px] font-medium text-blue-900"
                >
                  {menu}
                </span>
              ))}
            </div>
            <div className="mt-3 text-[12px] leading-5 text-[#6B7280]">
              数据更新会同步刷新以上菜单内的统计结果和列表数据。
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode('today')}
              className={cn(
                'rounded-lg border p-5 text-left transition-colors',
                mode === 'today'
                  ? 'border-primary bg-primary-light text-text-primary shadow-sm'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
              )}
            >
              <div className="text-[15px] font-semibold">更新今天数据</div>
              <div className="mt-2 text-[13px] leading-6 text-text-secondary">
                默认从昨天更新时间到当前操作时间，更新期间产生的数据。
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMode('range')}
              className={cn(
                'rounded-lg border p-5 text-left transition-colors',
                mode === 'range'
                  ? 'border-primary bg-primary-light text-text-primary shadow-sm'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
              )}
            >
              <div className="text-[15px] font-semibold">选择时间段</div>
              <div className="mt-2 text-[13px] leading-6 text-text-secondary">
                重新计算指定开始时间和结束时间内的数据。
              </div>
            </button>
          </div>

          {mode === 'range' && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-text-secondary">开始时间</span>
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-text-secondary">结束时间</span>
                  <Input
                    type="datetime-local"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                  />
                </label>
              </div>
              <div className="mt-3 flex gap-2 text-xs leading-5 text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  选择时间段会重新计算该范围内的数据；如期间存在退单，本次也会重新核算并剔除，请谨慎操作。
                </span>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button className="min-w-[120px]" onClick={handleConfirm}>
              确认更新
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="更新记录">
        <div className="overflow-hidden rounded-md border border-[#E5E7EB]">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F8FAFC] text-left text-[#111827]">
                <th className="w-[90px] border-b border-r border-[#E5E7EB] px-4 py-3 font-semibold">序号</th>
                <th className="border-b border-r border-[#E5E7EB] px-4 py-3 font-semibold">开始更新时间</th>
                <th className="border-b border-r border-[#E5E7EB] px-4 py-3 font-semibold">完成更新时间</th>
                <th className="w-[180px] border-b border-r border-[#E5E7EB] px-4 py-3 font-semibold">更新人</th>
                <th className="w-[160px] border-b border-[#E5E7EB] px-4 py-3 font-semibold">更新状态</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={`${record.id}-${record.startedAt}`} className="hover:bg-[#F9FAFB]">
                  <td className="border-b border-r border-[#F3F4F6] px-4 py-3">{index + 1}</td>
                  <td className="border-b border-r border-[#F3F4F6] px-4 py-3">{record.startedAt}</td>
                  <td className="border-b border-r border-[#F3F4F6] px-4 py-3">{record.completedAt}</td>
                  <td className="border-b border-r border-[#F3F4F6] px-4 py-3">{record.operator}</td>
                  <td className="border-b border-[#F3F4F6] px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium',
                        record.status === '已完成'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-blue-50 text-primary'
                      )}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>确认更新数据？</DialogTitle>
            <DialogDescription>
              是否确定更新数据？提交后系统会按当前选择的更新范围执行刷新。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              取消
            </Button>
            <Button onClick={submitUpdate}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
