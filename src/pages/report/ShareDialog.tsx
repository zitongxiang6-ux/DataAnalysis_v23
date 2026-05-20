import { useState } from 'react';
import { Link2, Copy, Check } from 'lucide-react';
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

interface ShareDialogProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
}

export function ShareDialog({ report, open, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const shareLink = `https://analytics-hub.company.com/reports/${report.id}?token=ro_${Math.random().toString(36).substring(2, 14)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('链接已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success('链接已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[440px] max-w-[calc(100%-2rem)]">
        <Toaster position="bottom-right" />
        <DialogHeader>
          <DialogTitle className="text-h2 text-text-primary flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            分享报告
          </DialogTitle>
          <DialogDescription className="text-body-small text-text-secondary">
            复制下方链接分享给其他人查看
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-caption text-text-secondary mb-2">分享链接 (只读权限)</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-input px-3 py-2 text-body-small text-text-primary font-mono truncate">
              {shareLink}
            </div>
            <Button
              onClick={handleCopy}
              className={cn(
                'gap-1.5 transition-all',
                copied && 'bg-success hover:bg-success'
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制链接
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-info-light rounded-card border border-info/20">
          <p className="text-caption text-info">
            提示: 此链接包含只读访问令牌，接收者无需登录即可查看报告内容。
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
