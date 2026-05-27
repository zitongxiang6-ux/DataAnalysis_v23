import { Info } from 'lucide-react';

type DataUpdateNoticeProps = {
  text?: string;
  dailyFields?: string;
  monthlyFields?: string;
};

export function DataUpdateNotice({ text, dailyFields, monthlyFields }: DataUpdateNoticeProps) {
  const content =
    text ??
    `${dailyFields ?? ''}每天 19:00 自动更新；${monthlyFields ?? ''}每月最后一天 19:00 更新至上月数据`;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-[13px] leading-6 text-blue-900 shadow-sm">
      <Info className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
      <div>
        <span className="font-semibold">更新说明：</span>
        <span>{content}</span>
      </div>
    </div>
  );
}
