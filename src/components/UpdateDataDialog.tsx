import { useState } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type UpdateMode = 'month' | 'range';

export function UpdateDataDialog() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<UpdateMode>('month');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleConfirm = () => {
    if (mode === 'range' && (!startTime || !endTime)) {
      toast.info('请选择开始月份和结束月份');
      return;
    }

    toast.success('数据更新任务已提交', {
      description:
        mode === 'month'
          ? '将更新本月1号至当前操作时间内产生的数据。'
          : '将按所选时间段重新计算数据，并重新核算退单剔除。',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-body-small">
          <RefreshCw className="w-3.5 h-3.5" />
          手动更新数据
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>手动更新数据</DialogTitle>
          <DialogDescription>
            选择本次数据更新范围，提交后系统会按所选范围同步并重新汇总统计结果。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('month')}
              className={cn(
                'rounded-lg border p-4 text-left transition-colors',
                mode === 'month'
                  ? 'border-primary bg-primary-light text-text-primary'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
              )}
            >
              <div className="text-sm font-semibold">更新本月数据</div>
              <div className="mt-1 text-xs leading-5 text-text-secondary">
                默认更新本月1号至当前操作时间内产生的数据。
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMode('range')}
              className={cn(
                'rounded-lg border p-4 text-left transition-colors',
                mode === 'range'
                  ? 'border-primary bg-primary-light text-text-primary'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
              )}
            >
              <div className="text-sm font-semibold">选择时间段</div>
              <div className="mt-1 text-xs leading-5 text-text-secondary">
                重新计算指定开始月份和结束月份范围内的数据。
              </div>
            </button>
          </div>

          {mode === 'range' && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-text-secondary">开始月份</span>
                  <Input
                    type="month"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-text-secondary">结束月份</span>
                  <Input
                    type="month"
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm}>确认更新</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
