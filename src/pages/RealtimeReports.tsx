
import { useSearchParams } from 'react-router';
import { Layout } from '@/components/Layout';
import {
  Building2,
  Globe,
  Target,
  Calculator,
  Settings,
  Users,
  UserRound,
} from 'lucide-react';

// Import tab components
import DepartmentShipping from './realtime/DepartmentShipping';
import ChannelDealer from './realtime/ChannelDealer';
import QuarterlyTarget from './realtime/QuarterlyTarget';
import RebateCalculationTab from './realtime/RebateCalculation';
import RuleConfiguration from './realtime/RuleConfiguration';
import SalespersonMonthly from './realtime/SalespersonMonthly';
import MyShippingStats from './realtime/MyShippingStats';
import SalesTargetManagement from './realtime/SalesTargetManagement';

interface SubTab {
  key: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function RealtimeReports() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'department';


  const subTabs: SubTab[] = [
    {
      key: 'my-shipping',
      label: '我的出货统计',
      icon: <UserRound className="w-4 h-4" />,
      component: <MyShippingStats />,
    },
    {
      key: 'sales-target-management',
      label: '销售目标管理',
      icon: <Target className="w-4 h-4" />,
      component: <SalesTargetManagement />,
    },
    {
      key: 'department',
      label: '部门出货统计',
      icon: <Building2 className="w-4 h-4" />,
      component: <DepartmentShipping />,
    },
    {
      key: 'salesperson-monthly',
      label: '业务出货统计',
      icon: <Users className="w-4 h-4" />,
      component: <SalespersonMonthly />,
    },
    {
      key: 'channel',
      label: '客户出货统计',
      icon: <Globe className="w-4 h-4" />,
      component: <ChannelDealer />,
    },
    {
      key: 'target',
      label: '季度目标统计',
      icon: <Target className="w-4 h-4" />,
      component: <QuarterlyTarget />,
    },
    {
      key: 'rebate',
      label: '返点测算',
      icon: <Calculator className="w-4 h-4" />,
      component: <RebateCalculationTab />,
    },
    {
      key: 'config',
      label: '业绩归属配置',
      icon: <Settings className="w-4 h-4" />,
      component: <RuleConfiguration />,
    },
  ];

  const currentTab = subTabs.find(t => t.key === activeTab)!;

  return (
    <Layout>
      {/* Tab Content */}
      <div className="bg-surface border border-[#E5E7EB] rounded-card p-6 mb-6 shadow-sm">
        {currentTab.component}
      </div>
    </Layout>
  );
}
