import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Users, Target, Calculator, Star, PieChart, Activity,
  CheckSquare, ClipboardList, Cpu, Building, TrendingUp,
  ChevronRight, Calendar,
} from 'lucide-react';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';
import { dimensionCards, overviewKpis } from './monthly/mockData';

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-5 h-5 text-primary" />,
  Target: <Target className="w-5 h-5 text-primary" />,
  Calculator: <Calculator className="w-5 h-5 text-primary" />,
  Star: <Star className="w-5 h-5 text-primary" />,
  PieChart: <PieChart className="w-5 h-5 text-primary" />,
  Activity: <Activity className="w-5 h-5 text-primary" />,
  CheckSquare: <CheckSquare className="w-5 h-5 text-primary" />,
  ClipboardList: <ClipboardList className="w-5 h-5 text-primary" />,
  Cpu: <Cpu className="w-5 h-5 text-primary" />,
  Building: <Building className="w-5 h-5 text-primary" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-primary" />,
};

export default function MonthlyQuarterly() {
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState<'monthly' | 'quarterly'>('monthly');

  return (
    <div className="p-page">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-h1 text-text-primary">月报/季报分析</h1>
        <p className="text-body-small text-text-secondary mt-1">
          周期性数据分析总览，涵盖11个分析维度
        </p>
      </div>

      {/* Period Selector */}
      <div className="bg-surface border border-[#E5E7EB] rounded-card p-4 mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-4 h-4 text-text-tertiary" />
          <div className="flex items-center bg-[#F3F4F6] rounded-md p-[3px]">
            <button
              onClick={() => setPeriodType('monthly')}
              className={cn(
                'px-4 py-1.5 rounded text-sm font-medium transition-all duration-150',
                periodType === 'monthly'
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              月度
            </button>
            <button
              onClick={() => setPeriodType('quarterly')}
              className={cn(
                'px-4 py-1.5 rounded text-sm font-medium transition-all duration-150',
                periodType === 'quarterly'
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              季度
            </button>
          </div>
          <span className="text-body-small text-text-secondary">
            {periodType === 'monthly' ? '2025年11月' : '2025年Q4'}
          </span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {overviewKpis.map((kpi, i) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            prefix={kpi.prefix}
            suffix={kpi.suffix}
            decimals={kpi.decimals}
            format={kpi.format}
            trend={kpi.trend}
            comparison={kpi.comparison}
            delay={i * 100}
          />
        ))}
      </div>

      {/* Dimension Cards Grid */}
      <SectionCard bodyClassName="p-5">
        <div className="grid grid-cols-3 gap-4">
          {dimensionCards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => {
                if (card.route !== '#') {
                  navigate(card.route);
                }
              }}
              className={cn(
                'bg-surface border border-[#E5E7EB] rounded-card shadow-sm p-5',
                'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20',
                card.route !== '#' && 'cursor-pointer active:scale-[0.98]',
                'animate-slide-up'
              )}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                  {iconMap[card.icon]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-h3 text-text-primary truncate">{card.name}</h3>
                    <StatusBadge variant="success">就绪</StatusBadge>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-data-medium text-text-primary">{card.keyMetric}</span>
                    <span className="text-caption text-text-secondary">{card.keyLabel}</span>
                  </div>

                  <p className="text-body-small text-text-secondary mb-3 line-clamp-2">
                    {card.description}
                  </p>

                  <div className="flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors group">
                      查看报告
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
