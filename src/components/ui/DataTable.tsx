import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, FileX } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string;
  className?: string;
  headerClassName?: string;
  cellClassName?: string | ((row: T, index: number) => string);
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => React.ReactNode;
}

interface SelectionConfig<T> {
  selectedKeys: Set<string>;
  onSelectChange: (keys: Set<string>) => void;
  rowKey: (row: T, index: number) => string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortKey?: string | null;
  sortDirection?: SortDirection;
  onSort?: (key: string) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  emptyText?: string;
  emptyDescription?: string;
  className?: string;
  rowKey?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  selectedRowKey?: string | null;
  loading?: boolean;
  selection?: SelectionConfig<T>;
  toolbar?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  sortKey,
  sortDirection,
  onSort,
  pagination,
  emptyText = '暂无数据',
  emptyDescription = '当前没有可显示的数据',
  className,
  rowKey = (_, index) => String(index),
  onRowClick,
  selectedRowKey,
  loading = false,
  selection,
  toolbar,
}: DataTableProps<T>) {
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  const pageNumbers = React.useMemo(() => {
    if (!pagination) return [];
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (pagination.page > 3) pages.push('...');
      for (let i = Math.max(2, pagination.page - 1); i <= Math.min(totalPages - 1, pagination.page + 1); i++) {
        pages.push(i);
      }
      if (pagination.page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [pagination, totalPages]);

  const allSelected = data.length > 0 && data.every((row, i) => selection?.selectedKeys.has(selection.rowKey(row, i)));
  const someSelected = data.some((row, i) => selection?.selectedKeys.has(selection.rowKey(row, i))) && !allSelected;

  const handleSelectAll = () => {
    if (!selection) return;
    if (allSelected) {
      const newKeys = new Set(selection.selectedKeys);
      data.forEach((row, i) => newKeys.delete(selection.rowKey(row, i)));
      selection.onSelectChange(newKeys);
    } else {
      const newKeys = new Set(selection.selectedKeys);
      data.forEach((row, i) => newKeys.add(selection.rowKey(row, i)));
      selection.onSelectChange(newKeys);
    }
  };

  const handleSelectRow = (row: T, index: number) => {
    if (!selection) return;
    const key = selection.rowKey(row, index);
    const newKeys = new Set(selection.selectedKeys);
    if (newKeys.has(key)) {
      newKeys.delete(key);
    } else {
      newKeys.add(key);
    }
    selection.onSelectChange(newKeys);
  };

  const [jumpPage, setJumpPage] = React.useState('');

  if (loading) {
    return (
      <div className={cn('bg-surface border border-[#E5E7EB] rounded-card shadow-sm', className)}>
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              {columns.map((_, ci) => (
                <div key={ci} className="h-10 rounded-md skeleton-shimmer flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('bg-surface border border-[#E5E7EB] rounded-card shadow-sm', className)}>
        <div className="flex flex-col items-center justify-center py-16">
          <FileX className="w-12 h-12 text-text-tertiary mb-4" />
          <h3 className="text-h3 text-text-primary mb-1">{emptyText}</h3>
          <p className="text-body-small text-text-secondary mb-4">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-surface border border-[#E5E7EB] rounded-card shadow-sm overflow-hidden', className)}>
      {/* Toolbar */}
      {(toolbar || selection) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6]">
          <div className="text-caption text-text-secondary">
            {selection && (
              <span>
                已选 <span className="font-semibold text-primary">{selection.selectedKeys.size}</span> 条
              </span>
            )}
          </div>
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table className="w-max min-w-full">
          <TableHeader>
            <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] h-10">
              {selection && (
                <TableHead className="w-10 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-primary focus:ring-primary"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    'text-table-header uppercase tracking-wider text-text-secondary whitespace-nowrap px-3',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer select-none hover:text-text-primary',
                    col.className,
                    col.headerClassName,
                  )}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div className={cn('flex items-center gap-1', col.align === 'center' && 'justify-center', col.align === 'right' && 'justify-end')}>
                    {col.title}
                    {col.sortable && sortKey === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> :
                      sortDirection === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : null
                    )}
                    {col.sortable && sortKey !== col.key && (
                      <ChevronUp className="w-3.5 h-3.5 text-text-tertiary opacity-0 group-hover:opacity-50" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => {
              const key = rowKey(row, index);
              const isSelected = selection ? selection.selectedKeys.has(selection.rowKey(row, index)) : false;
              return (
                <TableRow
                  key={key}
                  className={cn(
                    'h-12 transition-colors duration-150 cursor-default',
                    onRowClick && 'cursor-pointer',
                    selectedRowKey === key && 'bg-primary-light border-l-2 border-l-primary',
                    selectedRowKey !== key && 'hover:bg-[#F9FAFB]',
                  )}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {selection && (
                    <TableCell className="px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(row, index)}
                        className="w-4 h-4 rounded border-[#E5E7EB] text-primary focus:ring-primary"
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        'text-table-cell text-text-primary px-3',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        col.className,
                        typeof col.cellClassName === 'function'
                          ? col.cellClassName(row, index)
                          : col.cellClassName,
                      )}
                    >
                      {col.render ? col.render(row, index) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#F3F4F6]">
          <div className="flex items-center gap-4">
            <span className="text-caption text-text-secondary">
              共 {pagination.total} 条
            </span>
            {pagination.onPageSizeChange && (
              <select
                value={pagination.pageSize}
                onChange={(e) => pagination.onPageSizeChange?.(Number(e.target.value))}
                className="h-7 px-2 text-caption border border-[#E5E7EB] rounded bg-surface outline-none focus:border-primary"
              >
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
              </select>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
              className="w-8 h-8 flex items-center justify-center rounded text-text-secondary hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pageNumbers.map((page, i) =>
              page === '...' ? (
                <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-text-tertiary text-caption">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => pagination.onPageChange(page as number)}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded text-caption font-medium transition-colors',
                    pagination.page === page
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-[#F3F4F6]'
                  )}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => pagination.onPageChange(Math.min(totalPages, pagination.page + 1))}
              disabled={pagination.page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded text-text-secondary hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-caption text-text-secondary">跳至</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const page = Number(jumpPage);
                    if (page >= 1 && page <= totalPages) {
                      pagination.onPageChange(page);
                      setJumpPage('');
                    }
                  }
                }}
                className="w-12 h-7 px-1 text-caption text-center border border-[#E5E7EB] rounded bg-surface outline-none focus:border-primary"
              />
              <span className="text-caption text-text-secondary">页</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to render status cells
export function renderStatusCell(status: string) {
  const variantMap: Record<string, Parameters<typeof StatusBadge>[0]['variant']> = {
    ready: 'success',
    completed: 'success',
    processing: 'processing',
    pending: 'pending',
    warning: 'warning',
    danger: 'danger',
    failed: 'danger',
    info: 'info',
    normal: 'neutral',
  };
  const labelMap: Record<string, string> = {
    ready: '就绪',
    completed: '已完成',
    processing: '处理中',
    pending: '待处理',
    warning: '警告',
    danger: '危险',
    failed: '失败',
    info: '信息',
    normal: '正常',
  };
  return <StatusBadge variant={variantMap[status] ?? 'neutral'}>{labelMap[status] ?? status}</StatusBadge>;
}
