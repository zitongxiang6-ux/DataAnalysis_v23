import { Download, Eye } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { versionHistoryData } from './mockData';
import type { Report } from './types';
import { Toaster, toast } from 'sonner';

interface VersionHistoryDrawerProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
  onViewVersion: (version: string) => void;
}

export function VersionHistoryDrawer({ report, open, onClose, onViewVersion }: VersionHistoryDrawerProps) {
  if (!report) return null;

  const handleDownload = (version: string) => {
    toast.success(`版本 ${version} 下载已开始`);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0">
        <Toaster position="bottom-right" />
        <SheetHeader className="px-6 py-5 border-b border-[#E5E7EB]">
          <SheetTitle className="text-h2 text-text-primary">版本历史</SheetTitle>
          <SheetDescription className="text-body-small text-text-secondary">
            报告: {report.name}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[22px] top-2 bottom-2 w-px bg-[#E5E7EB]" />

            <div className="space-y-0">
              {versionHistoryData.map((ver, index) => (
                <div
                  key={ver.version}
                  className="relative pl-14 pb-8 animate-slide-in-right"
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
                >
                  {/* Version badge */}
                  <div className="absolute left-0 top-0 w-[45px] h-[45px] rounded-full bg-primary-light border-2 border-primary/20 flex items-center justify-center z-10">
                    <span className="text-[12px] font-mono font-bold text-primary">{ver.version}</span>
                  </div>

                  {/* Content */}
                  <div className="bg-surface border border-[#E5E7EB] rounded-card p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-small font-mono text-text-secondary">{ver.generatedAt}</span>
                      <span className="text-body-small font-mono text-text-primary font-medium">{ver.fileSize}</span>
                    </div>
                    <p className="text-caption text-text-secondary mb-3">统计周期: {ver.period}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-body-small h-8"
                        onClick={() => onViewVersion(ver.version)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        查看
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-body-small h-8"
                        onClick={() => handleDownload(ver.version)}
                      >
                        <Download className="w-3.5 h-3.5" />
                        下载
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
