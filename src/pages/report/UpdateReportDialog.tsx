import { useState } from 'react';
import { RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';
import type { Report } from './types';

interface UpdateReportDialogProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
}

export function UpdateReportDialog({ report, open, onClose }: UpdateReportDialogProps) {
  const [updating, setUpdating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!report) return null;

  const steps = [
    { label: '同步订单数据...', key: 'sync' },
    { label: '计算各项指标...', key: 'calc' },
    { label: '生成报告文件...', key: 'generate' },
  ];

  const handleStartUpdate = () => {
    setUpdating(true);
    setCurrentStep(0);
    setCompleted(false);

    // Simulate step progression
    setTimeout(() => setCurrentStep(1), 1200);
    setTimeout(() => setCurrentStep(2), 2400);
    setTimeout(() => {
      setCompleted(true);
      setUpdating(false);
      toast.success('报告数据更新成功');
      setTimeout(() => {
        onClose();
        setCompleted(false);
        setCurrentStep(0);
      }, 1500);
    }, 3500);
  };

  const handleCancel = () => {
    if (!updating) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !updating && handleCancel()}>
      <DialogContent className="w-[440px] max-w-[calc(100%-2rem)]">
        <Toaster position="bottom-right" />
        <DialogHeader>
          <DialogTitle className="text-h2 text-text-primary flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            更新报告数据
          </DialogTitle>
          <DialogDescription className="text-body-small text-text-secondary">
            此操作将重新计算所有订单数据并生成最新报告
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {!updating && !completed && (
            <div className="p-4 bg-warning-light rounded-card border border-warning/20">
              <p className="text-body-small text-warning">
                确认要更新「{report.name}」的数据吗？此操作可能需要几分钟时间。
              </p>
            </div>
          )}

          {/* Progress steps */}
          <div className="space-y-4 mt-4">
            {steps.map((step, index) => {
              const isActive = updating && currentStep === index;
              const isDone = completed || (updating && currentStep > index);

              return (
                <div
                  key={step.key}
                  className={cn(
                    'flex items-center gap-3 transition-opacity duration-300',
                    updating && currentStep < index ? 'opacity-40' : 'opacity-100'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    isDone ? 'bg-success text-white' :
                    isActive ? 'bg-primary text-white' :
                    'bg-[#F3F4F6] text-text-tertiary'
                  )}>
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="text-caption font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    'text-body-small',
                    isDone ? 'text-success font-medium' :
                    isActive ? 'text-primary font-medium' :
                    'text-text-secondary'
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Completed state */}
          {completed && (
            <div className="mt-6 flex flex-col items-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-success-light flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <p className="text-body font-medium text-success">报告数据更新成功</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#F3F4F6]">
          {!updating && !completed && (
            <>
              <Button variant="outline" onClick={handleCancel}>重置</Button>
              <Button onClick={handleStartUpdate} className="gap-1.5">
                <RefreshCw className="w-4 h-4" />
                开始更新
              </Button>
            </>
          )}
          {(updating || completed) && (
            <Button variant="outline" onClick={onClose} disabled={updating}>
              {completed ? '关闭' : '请稍候...'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
