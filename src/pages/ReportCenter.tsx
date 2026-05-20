import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Download, Eye, Mail, MoreVertical, Share2, X } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toaster, toast } from 'sonner';
import { reportList } from './report/mockData';
import type { Column } from '@/components/ui/DataTable';
import type { Report, ReportLevel, ReportScope, ReportStatus, ReportType } from './report/types';

const REPORT_TABS: { key: ReportType; label: string }[] = [
  { key: 'weekly', label: '周报' },
  { key: 'monthly', label: '月报' },
  { key: 'quarterly', label: '季报' },
];

const LEVEL_OPTIONS: { value: ReportLevel | 'all'; label: string }[] = [
  { value: 'all', label: '全部层级' },
  { value: 'company', label: '公司级报告' },
  { value: 'department', label: '部门级报告' },
  { value: 'group', label: '小组级报告' },
];

const SCOPE_OPTIONS: { value: ReportScope | 'all'; label: string; level?: ReportLevel }[] = [
  { value: 'all', label: '全部范围' },
  { value: 'company', label: '全公司', level: 'company' },
  { value: 'global_channel', label: '全球渠道部', level: 'department' },
  { value: 'domestic_key_account', label: '国内大客户部', level: 'department' },
  { value: 'international_hotel', label: '国际酒店部', level: 'department' },
  { value: 'international_channel_group', label: '国际渠道组', level: 'group' },
  { value: 'domestic_channel_group', label: '国内渠道组', level: 'group' },
  { value: 'odm_group', label: 'ODM组', level: 'group' },
];

const STATUS_OPTIONS: { value: ReportStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: 'completed', label: '已完成' },
  { value: 'processing', label: '处理中' },
];

const extraReports: Report[] = [
  { id: 'extra-dept-weekly-1', name: '第48周全球渠道部销售周报', type: 'weekly', level: 'department', scope: 'global_channel', period: '2025-11-24 ~ 2025-11-30', generatedAt: '2025-12-01 09:10', status: 'completed', fileSize: '1.7 MB' },
  { id: 'extra-dept-weekly-2', name: '第48周国内大客户部销售周报', type: 'weekly', level: 'department', scope: 'domestic_key_account', period: '2025-11-24 ~ 2025-11-30', generatedAt: '2025-12-01 09:15', status: 'completed', fileSize: '1.6 MB' },
  { id: 'extra-dept-weekly-3', name: '第48周国际酒店部销售周报', type: 'weekly', level: 'department', scope: 'international_hotel', period: '2025-11-24 ~ 2025-11-30', generatedAt: '2025-12-01 09:18', status: 'completed', fileSize: '1.6 MB' },
  { id: 'extra-1', name: '第48周国际渠道组销售周报', type: 'weekly', level: 'group', scope: 'international_channel_group', period: '2025-11-24 ~ 2025-11-30', generatedAt: '2025-12-01 09:20', status: 'processing', fileSize: '--' },
  { id: 'extra-2', name: '第47周国内渠道组销售周报', type: 'weekly', level: 'group', scope: 'domestic_channel_group', period: '2025-11-17 ~ 2025-11-23', generatedAt: '2025-11-24 08:20', status: 'completed', fileSize: '1.6 MB' },
  { id: 'extra-3', name: '2025年11月全公司月报', type: 'monthly', level: 'company', scope: 'company', period: '2025-11-01 ~ 2025-11-30', generatedAt: '2025-12-01 09:30', status: 'completed', fileSize: '3.2 MB' },
  { id: 'extra-4', name: '2025年10月国际渠道组月报', type: 'monthly', level: 'group', scope: 'international_channel_group', period: '2025-10-01 ~ 2025-10-31', generatedAt: '2025-11-02 10:15', status: 'completed', fileSize: '2.4 MB' },
  { id: 'extra-5', name: '2025年9月ODM组月报', type: 'monthly', level: 'group', scope: 'odm_group', period: '2025-09-01 ~ 2025-09-30', generatedAt: '2025-10-02 10:15', status: 'completed', fileSize: '2.9 MB' },
  { id: 'extra-6', name: 'Q3 2025国际渠道组返点计算报告', type: 'quarterly', level: 'group', scope: 'international_channel_group', period: '2025-07-01 ~ 2025-09-30', generatedAt: '2025-11-28 14:20', status: 'completed', fileSize: '4.5 MB' },
  { id: 'extra-7', name: 'Q2 2025国内渠道组季度报告', type: 'quarterly', level: 'group', scope: 'domestic_channel_group', period: '2025-04-01 ~ 2025-06-30', generatedAt: '2025-07-10 11:00', status: 'completed', fileSize: '4.2 MB' },
];

const peopleOptions = [
  '刘正德(13480290785)',
  '张经理(13900001111)',
  '李总监(13900002222)',
  '王主管(13900003333)',
  '赵经理(13900004444)',
  '刘助理(13900005555)',
  '陈运营(13900006666)',
  '周总(13900007777)',
  '黄磊(13900008888)',
  '杨丽(13900009999)',
];

type RecipientChannel = 'CRM' | '邮箱';

type RecipientRule = {
  type: ReportType;
  level: ReportLevel;
  scope: ReportScope;
  people: string[];
  channels?: RecipientChannel[];
  autoSend?: boolean;
  emails?: string;
};

const inferLevel = (scope: ReportScope): ReportLevel => {
  const option = SCOPE_OPTIONS.find((item) => item.value === scope);
  return option?.level || 'department';
};

const typeLabelMap: Record<ReportType, string> = {
  weekly: '周报',
  monthly: '月报',
  quarterly: '季报',
};

const levelLabelMap: Record<ReportLevel, string> = {
  company: '公司级报告',
  department: '部门级报告',
  group: '小组级报告',
};

const scopeLabelMap = SCOPE_OPTIONS.reduce<Record<string, string>>((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

const allReports: Report[] = [
  ...reportList.map((report) => ({
    ...report,
    level: report.level || inferLevel(report.scope),
  })),
  ...extraReports,
];

const updatedAtMap: Record<string, string> = {
  '1': '2025-12-01 14:32',
  '5': '2025-11-24 10:20',
  '6': '2025-11-22 18:10',
  '11': '2025-07-05 15:30',
  '17': '2025-08-01 11:45',
  'extra-3': '2025-12-01 11:10',
  'extra-dept-weekly-1': '2025-12-01 10:05',
  'extra-dept-weekly-2': '2025-12-01 10:12',
  'extra-dept-weekly-3': '2025-12-01 10:16',
};

const getUpdatedAt = (report: Report) => report.updatedAt || updatedAtMap[report.id] || '';
const getReceivedAt = (report: Report) => getUpdatedAt(report) || report.generatedAt;
const getReportVersion = (report: Report) => (getUpdatedAt(report) ? 'V3' : 'V1');

const initialRecipientRules: RecipientRule[] = REPORT_TABS.flatMap((tab) =>
  SCOPE_OPTIONS.filter((scope) => scope.value !== 'all').map((scope) => ({
    type: tab.key,
    level: scope.level || 'department',
    scope: scope.value as ReportScope,
    people: scope.value === 'company' ? ['李总监'] : [],
    channels: ['CRM', '邮箱'],
    autoSend: true,
  }))
);

export default function ReportCenter({ viewMode = 'manage' }: { viewMode?: 'manage' | 'mine' }) {
  const navigate = useNavigate();
  const isMineView = viewMode === 'mine';
  const [activeType, setActiveType] = useState<ReportType>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<ReportLevel | 'all'>('all');
  const [scopeFilter, setScopeFilter] = useState<ReportScope | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [recipientOpen, setRecipientOpen] = useState(false);
  const [recipientRules, setRecipientRules] = useState<RecipientRule[]>(initialRecipientRules);
  const [sendReport, setSendReport] = useState<Report | null>(null);
  const [versionReport, setVersionReport] = useState<Report | null>(null);
  const [shareReport, setShareReport] = useState<Report | null>(null);
  const [selectedReportKeys, setSelectedReportKeys] = useState<Set<string>>(new Set());

  const visibleScopeOptions = useMemo(
    () =>
      SCOPE_OPTIONS.filter((item) => item.value === 'all' || levelFilter === 'all' || item.level === levelFilter),
    [levelFilter]
  );

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allReports.filter((report) => (
      report.type === activeType &&
      (!isMineView || report.status === 'completed') &&
      (!q || report.name.toLowerCase().includes(q)) &&
      (levelFilter === 'all' || report.level === levelFilter) &&
      (scopeFilter === 'all' || report.scope === scopeFilter) &&
      (statusFilter === 'all' || report.status === statusFilter) &&
      (!startDate || report.generatedAt.slice(0, 10) >= startDate) &&
      (!endDate || report.generatedAt.slice(0, 10) <= endDate)
    ));
  }, [activeType, isMineView, searchQuery, levelFilter, scopeFilter, statusFilter, startDate, endDate]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const tabCounts = useMemo(() => {
    return REPORT_TABS.reduce<Record<ReportType, number>>((acc, tab) => {
      acc[tab.key] = allReports.filter((report) => report.type === tab.key && (!isMineView || report.status === 'completed')).length;
      return acc;
    }, { weekly: 0, monthly: 0, quarterly: 0 });
  }, [isMineView]);

  const scheduleText: Record<ReportType, string> = {
    weekly: '周报：每周日19:00自动生成本周周报',
    monthly: '月报：每月30/31号19:00生成本月月报',
    quarterly: '季报：每季度最后一个月30/31号19:00生成本季度季报',
  };

  const selectedCount = selectedReportKeys.size;
  const hasSelectedReports = selectedCount > 0;

  const resetFilters = () => {
    setSearchQuery('');
    setLevelFilter('all');
    setScopeFilter('all');
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const handleDownload = (report: Report) => {
    setDownloadingId(report.id);
    setTimeout(() => {
      setDownloadingId(null);
      toast.success('下载已开始');
    }, 800);
  };

  const openViewer = (report: Report) => {
    const level = report.level || inferLevel(report.scope);
    if (report.type === 'weekly') {
      if (level === 'company' && report.scope === 'company') {
        navigate(`/weekly-report/company/${report.id}`, { state: { report } });
      } else if (level === 'department') {
        navigate(`/weekly-report/department/${report.id}`, { state: { report } });
      } else {
        navigate('/weekly-report');
      }
    } else if (report.type === 'monthly') {
      if (level === 'company' && report.scope === 'company') {
        navigate(`/monthly-report/company/${report.id}`, { state: { report } });
      } else if (level === 'department') {
        navigate(`/monthly-report/department/${report.id}`, { state: { report } });
      } else {
        navigate('/monthly-quarterly');
      }
    } else {
      if (level === 'company' && report.scope === 'company') {
        navigate(`/quarterly-report/company/${report.id}`, { state: { report } });
      } else if (level === 'department') {
        navigate(`/quarterly-report/department/${report.id}`, { state: { report } });
      } else {
        navigate('/monthly-quarterly');
      }
    }
  };

  const getRecipientRuleForReport = (report: Report) =>
    recipientRules.find((rule) => rule.type === report.type && rule.scope === report.scope) ||
    recipientRules.find((rule) => rule.scope === report.scope) ||
    recipientRules.find((rule) => rule.scope === 'company') ||
    recipientRules[0];

  const columns: Column<Report>[] = [
    {
      key: 'name',
      title: '报告名称',
      sortable: true,
      render: (row) => (
        <button
          onClick={() => openViewer(row)}
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          {row.name}
        </button>
      ),
    },
    {
      key: 'level',
      title: '分类层级',
      sortable: true,
      width: '120px',
      render: (row) => <span>{levelLabelMap[row.level || inferLevel(row.scope)]}</span>,
    },
    {
      key: 'scope',
      title: '报告范围',
      sortable: true,
      width: '140px',
      render: (row) => <span>{scopeLabelMap[row.scope]}</span>,
    },
    {
      key: 'period',
      title: '统计周期',
      sortable: true,
      width: '190px',
      render: (row) => <span className="font-mono text-body-small">{row.period}</span>,
    },
    {
      key: 'generatedAt',
      title: '生成时间',
      sortable: true,
      width: '150px',
      render: (row) => <span className="font-mono text-body-small text-text-secondary">{row.generatedAt}</span>,
    },
    {
      key: 'updatedAt',
      title: isMineView ? '接收时间' : '更新时间',
      sortable: true,
      width: '150px',
      render: (row) => (
        <span className="font-mono text-body-small text-text-secondary">
          {isMineView ? getReceivedAt(row) : getUpdatedAt(row)}
        </span>
      ),
    },
    ...(isMineView
      ? [
          {
            key: 'version',
            title: '版本号',
            sortable: true,
            width: '90px',
            render: (row: Report) => (
              <span className="font-mono text-body-small text-text-secondary">{getReportVersion(row)}</span>
            ),
          },
        ]
      : []),
    {
      key: 'status',
      title: '报告状态',
      sortable: true,
      width: '100px',
      render: (row) => {
        const statusMap: Record<ReportStatus, { variant: Parameters<typeof StatusBadge>[0]['variant']; label: string }> = {
          completed: { variant: 'completed', label: '已完成' },
          processing: { variant: 'processing', label: '处理中' },
          pending: { variant: 'pending', label: '待处理' },
        };
        const status = statusMap[row.status];
        return <StatusBadge variant={status.variant}>{status.label}</StatusBadge>;
      },
    },
    {
      key: 'fileSize',
      title: '文件大小',
      width: '90px',
      align: 'right',
      render: (row) => <span className="font-mono text-body-small text-text-secondary">{row.fileSize}</span>,
    },
    {
      key: 'actions',
      title: '操作',
      width: '150px',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          <IconButton title="查看" onClick={() => openViewer(row)}>
            <Eye className="h-4 w-4" />
          </IconButton>
          <IconButton title="下载" onClick={() => handleDownload(row)}>
            {downloadingId === row.id ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </IconButton>
          <IconButton title="分享" onClick={() => setShareReport(row)}>
            <Share2 className="h-4 w-4" />
          </IconButton>
          {!isMineView && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-primary-light hover:text-primary">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => toast.success('报告已加入更新队列')}>手动更新</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSendReport(row)}>发送报告</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVersionReport(row)}>版本历史</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Toaster position="bottom-right" />

      <div className="mb-4 flex items-center justify-between border-b border-[#DDE6F2]">
        <div className="flex gap-1">
          {REPORT_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveType(tab.key);
                setPage(1);
              }}
              className={`relative h-12 px-6 text-[14px] font-medium transition-colors ${
                activeType === tab.key
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
              <span className="ml-1 text-[12px] text-text-tertiary">({tabCounts[tab.key]})</span>
              {activeType === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 pb-3">
          {!isMineView && <span className="text-[12px] text-text-secondary">{scheduleText[activeType]}</span>}
          {!isMineView && (
            <Button size="sm" onClick={() => setRecipientOpen(true)} className="gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              配置接收人
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4 rounded-card border border-[#E5E7EB] bg-white shadow-sm">
        <div className="hidden">
          <Button size="sm" onClick={() => setRecipientOpen(true)} className="gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            配置接收人
          </Button>
        </div>
        <div className="hidden">
          <div className="flex gap-1">
            {REPORT_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveType(tab.key);
                  setPage(1);
                }}
                className={`relative h-11 px-5 text-[13px] font-medium transition-colors ${
                  activeType === tab.key
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
                <span className="ml-1 text-[12px] text-text-tertiary">({tabCounts[tab.key]})</span>
                {activeType === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={() => setRecipientOpen(true)} className="mb-3 gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            配置接收人
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-4">
          <select
            value={levelFilter}
            onChange={(event) => {
              setLevelFilter(event.target.value as ReportLevel | 'all');
              setScopeFilter('all');
              setPage(1);
            }}
            className="h-9 min-w-[150px] flex-1 rounded-input border border-[#E5E7EB] bg-surface px-3 text-body-small outline-none focus-visible:border-primary"
          >
            {LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            value={scopeFilter}
            onChange={(event) => {
              setScopeFilter(event.target.value as ReportScope | 'all');
              setPage(1);
            }}
            className="h-9 min-w-[170px] flex-1 rounded-input border border-[#E5E7EB] bg-surface px-3 text-body-small outline-none focus-visible:border-primary"
          >
            {visibleScopeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as ReportStatus | 'all');
              setPage(1);
            }}
            className="h-9 min-w-[150px] flex-1 rounded-input border border-[#E5E7EB] bg-surface px-3 text-body-small outline-none focus-visible:border-primary"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <div className="flex min-w-[310px] flex-[1.4] items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="h-9 min-w-0 flex-1 rounded-input border border-[#E5E7EB] bg-surface px-3 text-body-small outline-none focus-visible:border-primary"
            />
            <span className="shrink-0 text-[14px] text-text-secondary">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="h-9 min-w-0 flex-1 rounded-input border border-[#E5E7EB] bg-surface px-3 text-body-small outline-none focus-visible:border-primary"
            />
          </div>
          <input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPage(1);
            }}
            placeholder="输入报告名称"
            className="h-9 min-w-[180px] flex-1 rounded-input border border-[#E5E7EB] bg-surface px-3 text-body-small outline-none focus-visible:border-primary"
          />
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 px-4" onClick={resetFilters}>
              重置
            </Button>
            <Button
              size="sm"
              className="h-9 px-4"
              onClick={() => {
                setPage(1);
                toast.success('查询完成');
              }}
            >
              查询
            </Button>
          </div>
        </div>

        <div className="hidden">
          <span className="text-caption text-text-secondary">
            当前显示 {filteredData.length} 条{typeLabelMap[activeType]}
          </span>
          <button onClick={resetFilters} className="text-caption font-medium text-primary hover:text-primary-hover">
            清除筛选
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-card border border-[#E5E7EB] bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
          <h3 className="text-h3 text-text-primary">{isMineView ? `我的${typeLabelMap[activeType]}` : `${typeLabelMap[activeType]}列表`}</h3>
          <div className="flex items-center gap-2">
            {!isMineView && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasSelectedReports}
                  onClick={() => toast.success(`已导出 ${selectedCount} 份报告`)}
                >
                  批量导出
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasSelectedReports}
                  onClick={() => toast.success(`已加入 ${selectedCount} 份报告更新队列`)}
                >
                  批量更新
                </Button>
                <Button
                  size="sm"
                  disabled={!hasSelectedReports}
                  onClick={() => toast.success(`已发送 ${selectedCount} 份报告`)}
                >
                  批量发送报告
                </Button>
              </>
            )}
            <span className="ml-2 text-caption text-text-secondary">共 {filteredData.length} 条记录</span>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={paginatedData}
          selection={isMineView ? undefined : {
            selectedKeys: selectedReportKeys,
            onSelectChange: setSelectedReportKeys,
            rowKey: (row) => row.id,
          }}
          pagination={{
            page,
            pageSize,
            total: filteredData.length,
            onPageChange: setPage,
            onPageSizeChange: (size) => {
              setPageSize(size);
              setPage(1);
            },
          }}
          emptyText="暂无报告"
          emptyDescription="没有找到匹配的报告，请调整筛选条件"
        />
      </div>

      {!isMineView && (
        <SharedRecipientConfigDialog
          open={recipientOpen}
          rules={recipientRules}
          onClose={() => setRecipientOpen(false)}
          onSave={(nextRules) => {
            setRecipientRules(nextRules);
            setRecipientOpen(false);
            toast.success('接收人规则已保存，周报、月报、季报将按该默认规则推送');
          }}
        />
      )}
      {!isMineView && sendReport && (
        <SendReportDialog
          report={sendReport}
          rule={getRecipientRuleForReport(sendReport)}
          onClose={() => setSendReport(null)}
          onSend={() => {
            toast.success('报告已发送');
            setSendReport(null);
          }}
        />
      )}
      {!isMineView && versionReport && (
        <VersionHistoryDialog
          report={versionReport}
          rule={getRecipientRuleForReport(versionReport)}
          onClose={() => setVersionReport(null)}
          onView={(report) => openViewer(report)}
        />
      )}
      {shareReport && (
        <ShareReportDialog
          report={shareReport}
          onClose={() => setShareReport(null)}
        />
      )}
    </Layout>
  );
}

void RecipientConfigDialog;

function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
    >
      {children}
    </button>
  );
}

function ShareReportDialog({
  report,
  onClose,
}: {
  report: Report;
  onClose: () => void;
}) {
  const level = report.level || inferLevel(report.scope);
  const shareLink = `${window.location.origin}/shared-report/${report.type}/${level}/${report.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('分享链接已复制');
    } catch {
      toast.error('复制失败，请手动复制链接');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-6">
      <div className="w-[560px] rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">分享报告</h2>
            <p className="mt-2 text-[12px] text-text-secondary">复制下方链接，可分享给有权限的人员查看该报告。</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-text-secondary hover:bg-[#F3F4F6]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2">
            <div className="text-[12px] text-text-secondary">报告名称</div>
            <div className="mt-1 font-medium text-text-primary">{report.name}</div>
          </div>
          <div>
            <label className="mb-1 block text-[12px] text-text-secondary">分享链接</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareLink}
                className="h-9 min-w-0 flex-1 rounded-input border border-[#D8DEE8] bg-white px-3 text-[13px] text-text-primary outline-none"
              />
              <Button size="sm" onClick={handleCopy}>复制</Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-5 py-4">
          <Button variant="outline" size="sm" onClick={onClose}>关闭</Button>
        </div>
      </div>
    </div>
  );
}

function PersonSearchSelect({
  value,
  onChange,
  placeholder = '搜索并选择接收人员',
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const filteredPeople = peopleOptions.filter((person) =>
    person.toLowerCase().includes(query.trim().toLowerCase())
  );

  const togglePerson = (person: string) => {
    onChange(value.includes(person) ? value.filter((item) => item !== person) : [...value, person]);
    setQuery('');
    setOpen(true);
  };

  return (
    <div className="relative">
      <div
        className="min-h-[92px] rounded-input border border-[#D8DEE8] bg-white px-3 py-2 transition-colors focus-within:border-primary"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-wrap gap-2">
          {value.map((person) => (
            <span
              key={person}
              className="inline-flex items-center gap-1 rounded border border-[#D8DEE8] bg-[#F8FAFC] px-2 py-1 text-[12px] text-text-primary"
            >
              {person}
              <button
                type="button"
                className="text-text-tertiary hover:text-text-primary"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange(value.filter((item) => item !== person));
                }}
              >
                x
              </button>
            </span>
          ))}
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 140)}
            placeholder={value.length ? '继续搜索人员' : placeholder}
            className="min-w-[180px] flex-1 border-0 bg-transparent py-1 text-[13px] outline-none placeholder:text-text-tertiary"
          />
        </div>
      </div>
      {open && (
        <div className="absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-md border border-[#D8DEE8] bg-white py-1 shadow-lg">
          {filteredPeople.length > 0 ? (
            filteredPeople.map((person) => {
              const selected = value.includes(person);
              return (
                <button
                  key={person}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => togglePerson(person)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition-colors ${
                    selected ? 'bg-primary-light text-primary' : 'text-text-primary hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span>{person}</span>
                  {selected && <span className="text-[12px] font-medium">已选</span>}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-3 text-[13px] text-text-tertiary">未找到匹配人员</div>
          )}
        </div>
      )}
    </div>
  );
}

function ChannelSelector({
  value,
  onChange,
}: {
  value: RecipientChannel[];
  onChange: (next: RecipientChannel[]) => void;
}) {
  const toggleChannel = (channel: RecipientChannel) => {
    const next = value.includes(channel)
      ? value.filter((item) => item !== channel)
      : [...value, channel];
    if (next.length === 0) {
      toast.error('接收渠道至少选择一个');
      return;
    }
    onChange(next);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {(['CRM', '邮箱'] as RecipientChannel[]).map((channel) => (
        <button
          key={channel}
          type="button"
          onClick={() => toggleChannel(channel)}
          className={`rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${
            value.includes(channel)
              ? 'border-primary bg-primary-light text-primary'
              : 'border-[#D8DEE8] bg-white text-text-secondary hover:bg-[#F8FAFC]'
          }`}
        >
          {channel}
        </button>
      ))}
    </div>
  );
}

function SendReportDialog({
  report,
  rule,
  onClose,
  onSend,
}: {
  report: Report;
  rule?: RecipientRule;
  onClose: () => void;
  onSend: () => void;
}) {
  const [people, setPeople] = useState<string[]>(rule?.people?.length ? rule.people : []);
  const [channels, setChannels] = useState<RecipientChannel[]>(
    rule?.channels?.length ? rule.channels : ['CRM', '邮箱']
  );

  useEffect(() => {
    setPeople(rule?.people?.length ? rule.people : []);
    setChannels(rule?.channels?.length ? rule.channels : ['CRM', '邮箱']);
  }, [report.id, rule]);

  const handleSend = () => {
    if (!people.length) {
      toast.error('请至少选择一位接收人');
      return;
    }
    if (!channels.length) {
      toast.error('接收渠道至少选择一个');
      return;
    }
    onSend();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-6">
      <div className="w-[680px] rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">发送报告</h2>
            <p className="mt-2 text-[12px] text-text-secondary">
              默认带出当前报告范围已配置的接收人和接收渠道，本次发送前可临时调整。
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-text-secondary hover:bg-[#F3F4F6]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2">
            <div className="text-[12px] text-text-secondary">报告名称</div>
            <div className="mt-1 font-medium text-text-primary">{report.name}</div>
          </div>
          <div>
            <label className="mb-1 block text-[12px] text-text-secondary">接收人员</label>
            <PersonSearchSelect value={people} onChange={setPeople} />
          </div>
          <div>
            <label className="mb-2 block text-[12px] text-text-secondary">接收渠道</label>
            <ChannelSelector value={channels} onChange={setChannels} />
            <p className="mt-2 text-[12px] text-text-tertiary">至少选择一个接收渠道。</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-5 py-4">
          <Button variant="outline" size="sm" onClick={onClose}>取消</Button>
          <Button size="sm" onClick={handleSend}>确认发送</Button>
        </div>
      </div>
    </div>
  );
}

function VersionHistoryDialog({
  report,
  rule,
  onClose,
  onView,
}: {
  report: Report;
  rule?: RecipientRule;
  onClose: () => void;
  onView: (report: Report) => void;
}) {
  const recipients = rule?.people?.length ? rule.people.join('、') : '-';
  const rows = [
    {
      version: 'V3',
      generatedAt: getUpdatedAt(report) || report.generatedAt,
      name: `${report.name}（更新版）`,
      sent: '是',
      recipients,
    },
    {
      version: 'V2',
      generatedAt: report.generatedAt,
      name: report.name,
      sent: rule?.autoSend === false ? '否' : '是',
      recipients,
    },
    {
      version: 'V1',
      generatedAt: report.generatedAt.slice(0, 10) + ' 08:00',
      name: `${report.name}（初始版）`,
      sent: '否',
      recipients,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-6">
      <div className="w-[880px] rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">版本历史</h2>
            <p className="mt-2 text-[12px] text-text-secondary">
              查看该报告历次生成记录，可直接进入对应报告详情。
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-text-secondary hover:bg-[#F3F4F6]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="overflow-hidden rounded-lg border border-[#E5E7EB]">
            <table className="w-full border-collapse text-[13px]">
              <thead className="bg-[#F8FAFC] text-text-secondary">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">生成时间</th>
                  <th className="px-4 py-3 text-left font-medium">报告名称</th>
                  <th className="px-4 py-3 text-left font-medium">版本号</th>
                  <th className="px-4 py-3 text-left font-medium">发送状态</th>
                  <th className="px-4 py-3 text-left font-medium">接收人</th>
                  <th className="px-4 py-3 text-center font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.version} className="border-t border-[#EEF2F6]">
                    <td className="px-4 py-3 font-mono text-text-secondary">{row.generatedAt}</td>
                    <td className="px-4 py-3 text-primary">{row.name}</td>
                    <td className="px-4 py-3">{row.version}</td>
                    <td className="px-4 py-3">{row.sent}</td>
                    <td className="max-w-[210px] truncate px-4 py-3">{row.recipients}</td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onClose();
                          onView(report);
                        }}
                      >
                        查看报告
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-[#E5E7EB] px-5 py-4">
          <Button variant="outline" size="sm" onClick={onClose}>关闭</Button>
        </div>
      </div>
    </div>
  );
}

function SharedRecipientConfigDialog({
  open,
  rules,
  onClose,
  onSave,
}: {
  open: boolean;
  rules: RecipientRule[];
  onClose: () => void;
  onSave: (rules: RecipientRule[]) => void;
}) {
  const [draftRules, setDraftRules] = useState<RecipientRule[]>(rules);
  const [selectedLevel, setSelectedLevel] = useState<ReportLevel>('company');
  const [selectedScope, setSelectedScope] = useState<ReportScope>('company');
  const [peopleQuery, setPeopleQuery] = useState('');
  const [peopleOpen, setPeopleOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDraftRules(rules);
      setSelectedLevel('company');
      setSelectedScope('company');
      setPeopleQuery('');
      setPeopleOpen(false);
    }
  }, [open, rules]);

  const scopeOptionsForLevel = SCOPE_OPTIONS.filter(
    (scope) => scope.value !== 'all' && scope.level === selectedLevel
  );
  const selectedRule =
    draftRules.find((rule) => rule.scope === selectedScope) || draftRules[0];
  const selectedPeople = selectedRule?.people ?? [];
  const selectedChannels: RecipientChannel[] =
    selectedRule?.channels?.length ? selectedRule.channels : ['CRM', '邮箱'];
  const selectedAutoSend = selectedRule?.autoSend !== false;
  const filteredPeople = peopleOptions.filter((person) =>
    person.toLowerCase().includes(peopleQuery.trim().toLowerCase())
  );

  if (!open) return null;

  const updateScopeRule = (scope: ReportScope, patch: Partial<RecipientRule>) => {
    setDraftRules((prev) =>
      prev.map((rule) => (rule.scope === scope ? { ...rule, ...patch } : rule))
    );
  };

  const togglePerson = (person: string) => {
    if (!selectedRule) return;
    const people = selectedPeople.includes(person)
      ? selectedPeople.filter((item) => item !== person)
      : [...selectedPeople, person];
    updateScopeRule(selectedRule.scope, { people });
    setPeopleQuery('');
    setPeopleOpen(true);
  };

  const removePerson = (person: string) => {
    if (!selectedRule) return;
    updateScopeRule(selectedRule.scope, {
      people: selectedPeople.filter((item) => item !== person),
    });
  };

  const toggleChannel = (channel: RecipientChannel) => {
    if (!selectedRule) return;
    const nextChannels = selectedChannels.includes(channel)
      ? selectedChannels.filter((item) => item !== channel)
      : [...selectedChannels, channel];

    if (nextChannels.length === 0) {
      toast.error('接收渠道至少选择一个');
      return;
    }
    updateScopeRule(selectedRule.scope, { channels: nextChannels });
  };

  const handleSave = () => {
    const normalizedRules = draftRules.map((rule) => ({
      ...rule,
      channels: rule.channels?.length ? rule.channels : (['CRM', '邮箱'] as RecipientChannel[]),
      autoSend: rule.autoSend !== false,
    }));

    if (normalizedRules.some((rule) => !rule.channels?.length)) {
      toast.error('接收渠道至少选择一个');
      return;
    }
    onSave(normalizedRules);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-6">
      <div className="w-[720px] rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">配置接收人</h2>
            <p className="mt-2 max-w-[600px] text-[12px] leading-5 text-text-secondary">
              此处配置为周报、月报、季报共用的默认接收规则。选择报告层级和范围后，设置默认接收人员与接收渠道，后续生成的周报、月报、季报都会按该规则推送。
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-text-secondary hover:bg-[#F3F4F6]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] text-text-secondary">报告层级</label>
              <select
                value={selectedLevel}
                onChange={(event) => {
                  const nextLevel = event.target.value as ReportLevel;
                  const nextScope = SCOPE_OPTIONS.find(
                    (scope) => scope.value !== 'all' && scope.level === nextLevel
                  )?.value as ReportScope | undefined;
                  setSelectedLevel(nextLevel);
                  if (nextScope) setSelectedScope(nextScope);
                }}
                className="h-9 w-full rounded-input border border-[#E5E7EB] bg-white px-3 text-[13px] outline-none focus-visible:border-primary"
              >
                {LEVEL_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] text-text-secondary">报告范围</label>
              <select
                value={selectedScope}
                onChange={(event) => setSelectedScope(event.target.value as ReportScope)}
                className="h-9 w-full rounded-input border border-[#E5E7EB] bg-white px-3 text-[13px] outline-none focus-visible:border-primary"
              >
                {scopeOptionsForLevel.map((scope) => (
                  <option key={scope.value} value={scope.value}>
                    {scope.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedRule && (
            <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-md bg-[#EEF4FF] px-2.5 py-1 text-[12px] font-medium text-primary">
                  {levelLabelMap[selectedRule.level]}
                </span>
                <span className="font-medium text-text-primary">{scopeLabelMap[selectedRule.scope]}</span>
              </div>

              <label className="mb-1 block text-[12px] text-text-secondary">接收人员</label>
              <div className="relative">
                <div
                  className="min-h-[92px] rounded-input border border-[#D8DEE8] bg-white px-3 py-2 transition-colors focus-within:border-primary"
                  onClick={() => setPeopleOpen(true)}
                >
                  <div className="flex flex-wrap gap-2">
                    {selectedPeople.map((person) => (
                      <span
                        key={person}
                        className="inline-flex items-center gap-1 rounded border border-[#D8DEE8] bg-[#F8FAFC] px-2 py-1 text-[12px] text-text-primary"
                      >
                        {person}
                        <button
                          type="button"
                          className="text-text-tertiary hover:text-text-primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            removePerson(person);
                          }}
                        >
                          x
                        </button>
                      </span>
                    ))}
                    <input
                      value={peopleQuery}
                      onChange={(event) => {
                        setPeopleQuery(event.target.value);
                        setPeopleOpen(true);
                      }}
                      onFocus={() => setPeopleOpen(true)}
                      onBlur={() => window.setTimeout(() => setPeopleOpen(false), 140)}
                      placeholder={selectedPeople.length ? '继续搜索人员' : '搜索并选择接收人员'}
                      className="min-w-[180px] flex-1 border-0 bg-transparent py-1 text-[13px] outline-none placeholder:text-text-tertiary"
                    />
                  </div>
                </div>
                {peopleOpen && (
                  <div className="absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-md border border-[#D8DEE8] bg-white py-1 shadow-lg">
                    {filteredPeople.length > 0 ? (
                      filteredPeople.map((person) => {
                        const selected = selectedPeople.includes(person);
                        return (
                          <button
                            key={person}
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => togglePerson(person)}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition-colors ${
                              selected ? 'bg-primary-light text-primary' : 'text-text-primary hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <span>{person}</span>
                            {selected && <span className="text-[12px] font-medium">已选</span>}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-3 text-[13px] text-text-tertiary">未找到匹配人员</div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-[12px] text-text-secondary">接收渠道</label>
                <div className="flex flex-wrap gap-2">
                  {(['CRM', '邮箱'] as RecipientChannel[]).map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => toggleChannel(channel)}
                      className={`rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                        selectedChannels.includes(channel)
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-[#D8DEE8] bg-white text-text-secondary hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[12px] text-text-tertiary">至少选择一个接收渠道。</p>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-[12px] text-text-secondary">是否自动发送报告</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: true, label: '是' },
                    { value: false, label: '否' },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => updateScopeRule(selectedRule.scope, { autoSend: option.value })}
                      className={`rounded-md border px-4 py-1.5 text-[13px] font-medium transition-colors ${
                        selectedAutoSend === option.value
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-[#D8DEE8] bg-white text-text-secondary hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {selectedAutoSend && (
                  <p className="mt-2 text-[12px] text-text-tertiary">
                    报告生成成功后自动发送至接收人；手动更新的报告需手动发送报告。
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-5 py-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            取消
          </Button>
          <Button size="sm" onClick={handleSave}>
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}

function RecipientConfigDialog({
  open,
  activeType,
  rules,
  onClose,
  onSave,
}: {
  open: boolean;
  activeType: ReportType;
  rules: RecipientRule[];
  onClose: () => void;
  onSave: (rules: RecipientRule[]) => void;
}) {
  const [draftRules, setDraftRules] = useState<RecipientRule[]>(rules);
  const [selectedLevel, setSelectedLevel] = useState<ReportLevel>('company');
  const [selectedScope, setSelectedScope] = useState<ReportScope>('company');
  const [sendToEmail, setSendToEmail] = useState(true);

  if (!open) return null;

  const visibleRules = draftRules.filter((rule) => rule.type === activeType);
  const scopeOptionsForLevel = SCOPE_OPTIONS.filter(
    (scope) => scope.value !== 'all' && scope.level === selectedLevel
  );
  const selectedRule =
    visibleRules.find((rule) => rule.scope === selectedScope) || visibleRules[0];

  const updateRule = (scope: ReportScope, patch: Partial<RecipientRule>) => {
    setDraftRules((prev) =>
      prev.map((rule) =>
        rule.type === activeType && rule.scope === scope ? { ...rule, ...patch } : rule
      )
    );
  };

  const togglePerson = (scope: ReportScope, person: string) => {
    const rule = visibleRules.find((item) => item.scope === scope);
    if (!rule) return;
    const people = rule.people.includes(person)
      ? rule.people.filter((item) => item !== person)
      : [...rule.people, person];
    updateRule(scope, { people });
  };

  const updatePeopleFromSelect = (scope: ReportScope, values: string[]) => {
    updateRule(scope, { people: values });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-6">
      <div className="w-[640px] rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">配置接收人</h2>
            <p className="mt-1 text-[12px] text-text-secondary">
              当前配置：{typeLabelMap[activeType]}。先选择层级和范围，再设置该范围的默认接收人员。
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-text-secondary hover:bg-[#F3F4F6]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] text-text-secondary">报告层级</label>
              <select
                value={selectedLevel}
                onChange={(event) => {
                  const nextLevel = event.target.value as ReportLevel;
                  const nextScope = SCOPE_OPTIONS.find(
                    (scope) => scope.value !== 'all' && scope.level === nextLevel
                  )?.value as ReportScope;
                  setSelectedLevel(nextLevel);
                  setSelectedScope(nextScope);
                }}
                className="h-9 w-full rounded-input border border-[#E5E7EB] bg-white px-3 text-[13px] outline-none focus-visible:border-primary"
              >
                {LEVEL_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] text-text-secondary">报告范围</label>
              <select
                value={selectedScope}
                onChange={(event) => setSelectedScope(event.target.value as ReportScope)}
                className="h-9 w-full rounded-input border border-[#E5E7EB] bg-white px-3 text-[13px] outline-none focus-visible:border-primary"
              >
                {scopeOptionsForLevel.map((scope) => (
                  <option key={scope.value} value={scope.value}>{scope.label}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedRule && (
            <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-[#EEF4FF] px-2.5 py-1 text-[12px] font-medium text-primary">
                  {levelLabelMap[selectedRule.level]}
                </span>
                <span className="font-medium text-text-primary">{scopeLabelMap[selectedRule.scope]}</span>
              </div>
              <label className="mb-1 block text-[12px] text-text-secondary">接收人员</label>
              <select
                multiple
                size={4}
                value={selectedRule.people}
                onChange={(event) =>
                  updatePeopleFromSelect(
                    selectedRule.scope,
                    Array.from(event.currentTarget.selectedOptions).map((option) => option.value)
                  )
                }
                className="w-full rounded-input border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] outline-none focus-visible:border-primary"
              >
                {peopleOptions.map((person) => (
                  <option key={person} value={person}>{person}</option>
                ))}
              </select>
              <p className="mt-2 text-[12px] text-text-tertiary">按住 Ctrl 可多选人员。</p>
            </div>
          )}

          <label className="flex h-10 items-center gap-2 rounded-md border border-[#E5E7EB] px-3 text-[13px] text-text-primary">
            <input
              type="checkbox"
              checked={sendToEmail}
              onChange={(event) => setSendToEmail(event.target.checked)}
            />
            后续报告生成后发送至邮箱
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-5 py-4">
          <Button variant="outline" size="sm" onClick={onClose}>取消</Button>
          <Button size="sm" onClick={() => onSave(draftRules)}>
            保存接收人规则
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-6">
      <div className="max-h-[86vh] w-[920px] overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">配置接收人</h2>
            <p className="mt-1 text-[12px] text-text-secondary">
              当前配置：{typeLabelMap[activeType]}。规则保存后，后续生成的报告会按对应层级自动推送。
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-text-secondary hover:bg-[#F3F4F6]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto p-5">
          <div className="space-y-3">
            {visibleRules.map((rule) => (
              <div key={rule.scope} className="rounded-lg border border-[#E5E7EB] p-4">
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-md bg-[#EEF4FF] px-2.5 py-1 text-[12px] font-medium text-primary">
                    {levelLabelMap[rule.level]}
                  </span>
                  <span className="font-medium text-text-primary">{scopeLabelMap[rule.scope]}</span>
                </div>
                <div className="grid grid-cols-[1.2fr_1fr] gap-4">
                  <div>
                    <p className="mb-2 text-[12px] text-text-secondary">选择接收人员</p>
                    <div className="flex flex-wrap gap-2">
                      {peopleOptions.map((person) => (
                        <button
                          key={person}
                          onClick={() => togglePerson(rule.scope, person)}
                          className={`rounded-md border px-2.5 py-1 text-[12px] transition-colors ${
                            rule.people.includes(person)
                              ? 'border-primary bg-primary-light text-primary'
                              : 'border-[#E5E7EB] text-text-secondary hover:bg-[#F9FAFB]'
                          }`}
                        >
                          {person}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[12px] text-text-secondary">手动输入邮箱地址</p>
                    <input
                      value={rule.emails}
                      onChange={(event) => updateRule(rule.scope, { emails: event.target.value })}
                      placeholder="多个邮箱用逗号分隔"
                      className="h-9 w-full rounded-input border border-[#E5E7EB] px-3 text-[13px] outline-none focus-visible:border-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-5 py-4">
          <Button variant="outline" size="sm" onClick={onClose}>取消</Button>
          <Button size="sm" onClick={() => onSave(draftRules)}>保存接收人规则</Button>
        </div>
      </div>
    </div>
  );
}
