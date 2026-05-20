import { useState, useMemo } from 'react';
import {
  ChevronDown, ChevronUp, RotateCcw, Calculator, Info,
} from 'lucide-react';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { cn } from '@/lib/utils';
import { rebateCustomers } from './monthly/mockData';

const calcTypeTabs = [
  { key: 'q1', label: '2026 Q1' },
  { key: 'q2', label: '2026 Q2' },
  { key: 'annual', label: '2026年度' },
];

export default function RebateCalculation() {
  const [calcType, setCalcType] = useState('q1');
  const [rulesExpanded, setRulesExpanded] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [recalculated, setRecalculated] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setRecalculated(false);
  };

  const selectAll = () => {
    if (selectedIds.size === rebateCustomers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rebateCustomers.map(c => c.id)));
    }
    setRecalculated(false);
  };

  const handleRecalculate = () => {
    setRecalculated(true);
  };

  // Computed values
  const { totalSigning, totalExcluded, totalEffective, totalRebate } = useMemo(() => {
    const selectedCustomers = rebateCustomers.filter(c => selectedIds.has(c.id));
    const ts = rebateCustomers.reduce((s, c) => s + c.totalSigning, 0);
    const te = selectedCustomers.reduce((s, c) => s + c.excludedAmount, 0);
    const ef = ts - te;
    // Rebate rate: >= 30万 gets 2%, < 30万 gets 3% for quarterly
    const tr = rebateCustomers.reduce((s, c) => {
      if (selectedIds.has(c.id)) return s;
      return s + c.rebateAmount;
    }, 0);
    return { totalSigning: ts, totalExcluded: te, totalEffective: ef, totalRebate: tr };
  }, [selectedIds]);

  const formatCurrency = (v: number) => `¥${v.toLocaleString('zh-CN')}`;

  return (
    <div className="p-page">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-h1 text-text-primary">返点测算</h1>
        <p className="text-body-small text-text-secondary mt-1">
          季度与年度返点计算，支持剔除订单并重新计算
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-[#E5E7EB] rounded-card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <TabSwitcher tabs={calcTypeTabs} activeKey={calcType} onChange={setCalcType} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRecalculate}
              className={cn(
                "h-9 px-4 flex items-center gap-1.5 text-body-small font-medium rounded-button transition-colors",
                selectedIds.size > 0 && !recalculated
                  ? 'bg-primary text-white hover:bg-primary-hover'
                  : 'bg-primary-light text-primary hover:bg-primary/10'
              )}
            >
              <Calculator className="w-3.5 h-3.5" />
              重新计算
            </button>
            <button className="h-9 px-3 flex items-center gap-1.5 text-body-small text-text-secondary border border-[#E5E7EB] rounded-button hover:bg-[#F3F4F6] hover:text-text-primary transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              刷新
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Rules Banner */}
      <div className="bg-primary-light/60 border border-primary/20 rounded-card mb-6 overflow-hidden">
        <button
          onClick={() => setRulesExpanded(!rulesExpanded)}
          className="w-full flex items-center justify-between px-5 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-body-small font-medium text-primary">返点计算规则</span>
          </div>
          {rulesExpanded ? (
            <ChevronUp className="w-4 h-4 text-primary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-primary" />
          )}
        </button>
        {rulesExpanded && (
          <div className="px-5 pb-4 text-body-small text-text-secondary space-y-2">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <p>
                <span className="font-medium text-text-primary">季度返点：</span>
                签约额 &lt; <span className="text-data-medium text-primary font-semibold">30万</span> → <span className="font-semibold text-primary">3%</span>；
                签约额 ≥ <span className="text-data-medium text-primary font-semibold">30万</span> → <span className="font-semibold text-primary">2%</span>
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <p>
                <span className="font-medium text-text-primary">年度返点（额外）：</span>
                年度签约额 ≥ <span className="text-data-medium text-primary font-semibold">30万</span> → 额外 <span className="font-semibold text-primary">3%</span>
              </p>
            </div>
            <p className="text-caption text-text-tertiary pl-3.5">注：被剔除的订单不计入签约总额</p>
          </div>
        )}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="总签约额"
          value={totalSigning}
          prefix="¥"
          suffix=""
          decimals={0}
          format={true}
          trend={12.5}
          comparison={`${rebateCustomers.length}笔订单`}
          delay={0}
        />
        <KpiCard
          label="总剔除金额"
          value={totalExcluded}
          prefix="¥"
          suffix=""
          decimals={0}
          format={true}
          trend={-5}
          comparison={`${selectedIds.size} 家客户被剔除`}
          delay={100}
        />
        <KpiCard
          label="总有效金额"
          value={totalEffective}
          prefix="¥"
          suffix=""
          decimals={0}
          format={true}
          trend={8.3}
          comparison="剔除后金额"
          delay={200}
        />
        <KpiCard
          label="总返点金额"
          value={totalRebate}
          prefix="¥"
          suffix=""
          decimals={0}
          format={true}
          trend={6.7}
          comparison={calcType === 'annual' ? '年度计算' : '季度计算'}
          delay={300}
        />
      </div>

      {/* Customer Table */}
      <SectionCard
        title="客户返点明细"
        titleAction={
          selectedIds.size > 0 && (
            <span className="text-caption text-text-secondary">
              已选择 {selectedIds.size} 家客户
            </span>
          )
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === rebateCustomers.length && rebateCustomers.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-3 py-3 text-left text-table-header text-text-secondary uppercase">客户名称</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">签约总额</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">季度目标额</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">待核查金额</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">剔除金额</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">有效金额</th>
                <th className="px-3 py-3 text-center text-table-header text-text-secondary uppercase">返点比例</th>
                <th className="px-3 py-3 text-right text-table-header text-text-secondary uppercase">返点金额</th>
                <th className="px-3 py-3 text-center text-table-header text-text-secondary uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {rebateCustomers.map((customer) => {
                const isSelected = selectedIds.has(customer.id);
                return (
                  <tr
                    key={customer.id}
                    className={cn(
                      'border-b border-[#F3F4F6] transition-colors h-12',
                      isSelected ? 'bg-[#FAFAFA]' : 'hover:bg-[#F9FAFB]'
                    )}
                  >
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(customer.id)}
                        className="w-4 h-4 rounded border-[#E5E7EB] text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-3 py-2 text-body-small font-medium text-text-primary">{customer.customerName}</td>
                    <td className="px-3 py-2 text-right font-mono text-body-small text-text-primary">{formatCurrency(customer.totalSigning)}</td>
                    <td className="px-3 py-2 text-right font-mono text-body-small text-info">{formatCurrency(customer.quarterTarget)}</td>
                    <td className="px-3 py-2 text-right font-mono text-body-small text-warning">{formatCurrency(customer.pendingVerify)}</td>
                    <td className={cn(
                      "px-3 py-2 text-right font-mono text-body-small",
                      isSelected ? 'text-danger line-through' : 'text-text-primary'
                    )}>
                      {formatCurrency(customer.excludedAmount)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-body-small font-semibold text-text-primary">{formatCurrency(isSelected ? customer.totalSigning - customer.excludedAmount : customer.effectiveAmount)}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={cn(
                        'inline-flex px-2 py-0.5 rounded-badge text-badge-text font-semibold',
                        customer.rebateRate === 3 ? 'bg-primary-light text-primary' : 'bg-info-light text-info'
                      )}>
                        {customer.rebateRate}%
                      </span>
                    </td>
                    <td className={cn(
                      "px-3 py-2 text-right font-mono text-body-small font-semibold",
                      isSelected ? 'text-text-tertiary line-through' : 'text-success'
                    )}>
                      {formatCurrency(isSelected ? 0 : customer.rebateAmount)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {isSelected ? (
                        <StatusBadge variant="neutral" showDot={false}>已剔除</StatusBadge>
                      ) : customer.status === 'excluded' ? (
                        <StatusBadge variant="warning">待核查</StatusBadge>
                      ) : customer.status === 'pending' ? (
                        <StatusBadge variant="info">审批中</StatusBadge>
                      ) : (
                        <StatusBadge variant="success">有效</StatusBadge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Summary Card */}
      <SectionCard title="返点计算汇总">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
            <div>
              <p className="text-body font-medium text-text-primary">步骤1：总签约额（剔除后）</p>
              <p className="text-body-small text-text-secondary font-mono mt-0.5">
                {rebateCustomers.length}家客户 ¥{totalSigning.toLocaleString('zh-CN')} - ¥{totalExcluded.toLocaleString('zh-CN')} 剔除 = ¥{totalEffective.toLocaleString('zh-CN')}
              </p>
            </div>
            <span className="text-data-medium text-text-primary font-mono">{formatCurrency(totalEffective)}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
            <div>
              <p className="text-body font-medium text-text-primary">步骤2：确定返点比例</p>
              <p className="text-body-small text-text-secondary font-mono mt-0.5">
                {formatCurrency(totalEffective)} ≥ 30万阈值 → {totalEffective >= 300000 ? '2%' : '3%'} 季度返点率
              </p>
            </div>
            <span className="text-data-medium text-primary font-mono">{totalEffective >= 300000 ? '2%' : '3%'}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
            <div>
              <p className="text-body font-medium text-text-primary">步骤3：计算返点金额</p>
              <p className="text-body-small text-text-secondary font-mono mt-0.5">
                {formatCurrency(totalEffective)} × {totalEffective >= 300000 ? '2%' : '3%'} = {formatCurrency(totalRebate)}
              </p>
            </div>
            <span className="text-data-medium text-success font-mono">{formatCurrency(totalRebate)}</span>
          </div>

          {calcType === 'annual' && (
            <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
              <div>
                <p className="text-body font-medium text-text-primary">步骤4：年度额外返点</p>
                <p className="text-body-small text-text-secondary font-mono mt-0.5">
                  年度累计 ≥ 30万 → 额外3%
                </p>
              </div>
              <span className="text-data-medium text-success font-mono">{formatCurrency(Math.round(totalEffective * 0.03))}</span>
            </div>
          )}

          {/* Final Total */}
          <div className="bg-primary-light/60 rounded-card p-4 flex items-center justify-between">
            <div>
              <p className="text-label uppercase text-primary tracking-wider">返点合计</p>
              <p className="text-caption text-text-secondary mt-0.5">
                {calcType === 'annual' ? '季度返点 + 年度返点' : '季度返点'}
              </p>
            </div>
            <span className="text-data-large text-success font-mono">
              {formatCurrency(calcType === 'annual' ? Math.round(totalRebate + totalEffective * 0.03) : totalRebate)}
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
