import { useState } from 'react';
import { Send, Mail, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';
import type { Report } from './types';
import { recipientsData as defaultRecipients } from './mockData';

interface SendReportDialogProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
}

type SendMethod = 'wecom' | 'email';

export function SendReportDialog({ report, open, onClose }: SendReportDialogProps) {
  const [recipients, setRecipients] = useState(defaultRecipients);
  const [sendMethod, setSendMethod] = useState<SendMethod>('wecom');
  const [sending, setSending] = useState(false);

  if (!report) return null;

  const toggleRecipient = (id: string) => {
    setRecipients(prev =>
      prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r)
    );
  };

  const selectedCount = recipients.filter(r => r.selected).length;

  const handleSend = () => {
    if (selectedCount === 0) {
      toast.error('请至少选择一位收件人');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success(`报告已通过${sendMethod === 'wecom' ? '企业微信' : '邮件'}发送给 ${selectedCount} 位收件人`);
      onClose();
    }, 1500);
  };

  const typeLabelMap: Record<string, string> = {
    weekly: '周报',
    monthly: '月报',
    quarterly: '季报',
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[480px] max-w-[calc(100%-2rem)]">
        <Toaster position="bottom-right" />
        <DialogHeader>
          <DialogTitle className="text-h2 text-text-primary flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            发送报告
          </DialogTitle>
          <DialogDescription className="text-body-small text-text-secondary">
            选择收件人和发送方式
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          {/* Report preview */}
          <div className="p-3 bg-primary-light rounded-card border border-primary/20">
            <p className="text-body-small font-medium text-primary">{report.name}</p>
            <p className="text-caption text-text-secondary">
              {typeLabelMap[report.type]} · {report.period}
            </p>
          </div>

          {/* Recipients */}
          <div>
            <p className="text-body-small font-medium text-text-primary mb-3">选择收件人</p>
            <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
              {recipients.map((recipient) => (
                <label
                  key={recipient.id}
                  className={cn(
                    'flex items-center gap-3 p-2.5 rounded-card border cursor-pointer transition-all',
                    recipient.selected
                      ? 'border-primary bg-primary-light'
                      : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'
                  )}
                >
                  <Checkbox
                    checked={recipient.selected}
                    onCheckedChange={() => toggleRecipient(recipient.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-small font-medium text-text-primary">{recipient.name}</p>
                    <p className="text-caption text-text-secondary">{recipient.email}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Send method */}
          <div>
            <p className="text-body-small font-medium text-text-primary mb-3">发送方式</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSendMethod('wecom')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 p-3 rounded-card border transition-all',
                  sendMethod === 'wecom'
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-[#E5E7EB] text-text-secondary hover:bg-[#F9FAFB]'
                )}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-body-small font-medium">企业微信</span>
              </button>
              <button
                onClick={() => setSendMethod('email')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 p-3 rounded-card border transition-all',
                  sendMethod === 'email'
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-[#E5E7EB] text-text-secondary hover:bg-[#F9FAFB]'
                )}
              >
                <Mail className="w-4 h-4" />
                <span className="text-body-small font-medium">邮件</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#F3F4F6]">
          <Button variant="outline" onClick={onClose}>重置</Button>
          <Button
            onClick={handleSend}
            disabled={sending || selectedCount === 0}
            className="gap-1.5"
          >
            {sending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                发送中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                发送 ({selectedCount})
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
