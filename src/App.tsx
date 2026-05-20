import { Routes, Route, Navigate } from 'react-router'
import ReportCenter from './pages/ReportCenter'
import WeeklyReport from './pages/WeeklyReport'
import CompanyWeeklyReport from './pages/CompanyWeeklyReport'
import CompanyMonthlyReport from './pages/CompanyMonthlyReport'
import CompanyQuarterlyReport from './pages/CompanyQuarterlyReport'
import DepartmentReport from './pages/DepartmentReport'
import KeyChannelDealerDetails from './pages/KeyChannelDealerDetails'
import DomesticChannelQuarterDetails from './pages/DomesticChannelQuarterDetails'
import MonthlyQuarterly from './pages/MonthlyQuarterly'
import ChannelDealer from './pages/ChannelDealer'
import QuarterlyTarget from './pages/QuarterlyTarget'
import RebateCalculation from './pages/RebateCalculation'
import RealtimeReports from './pages/RealtimeReports'
import TopCustomer from './pages/TopCustomer'
import ReviewPage from './pages/rebate/ReviewPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/report-center" replace />} />
      <Route path="/report-center" element={<ReportCenter />} />
      <Route path="/my-sales-reports" element={<ReportCenter viewMode="mine" />} />
      <Route path="/weekly-report/company/:reportId" element={<CompanyWeeklyReport />} />
      <Route path="/monthly-report/company/:reportId" element={<CompanyMonthlyReport />} />
      <Route path="/quarterly-report/company/:reportId" element={<CompanyQuarterlyReport />} />
      <Route path="/weekly-report/department/:reportId" element={<DepartmentReport />} />
      <Route path="/monthly-report/department/:reportId" element={<DepartmentReport />} />
      <Route path="/quarterly-report/department/:reportId" element={<DepartmentReport />} />
      <Route path="/monthly-report/company/:reportId/key-channel-dealers" element={<KeyChannelDealerDetails />} />
      <Route path="/monthly-report/company/:reportId/domestic-channel-quarter-targets" element={<DomesticChannelQuarterDetails />} />
      <Route path="/quarterly-report/company/:reportId/key-channel-dealers" element={<KeyChannelDealerDetails />} />
      <Route path="/quarterly-report/company/:reportId/domestic-channel-quarter-targets" element={<DomesticChannelQuarterDetails />} />
      <Route path="/weekly-report" element={<WeeklyReport />} />
      <Route path="/monthly-quarterly" element={<MonthlyQuarterly />} />
      <Route path="/channel-dealer" element={<ChannelDealer />} />
      <Route path="/quarterly-target" element={<QuarterlyTarget />} />
      <Route path="/rebate-calculation" element={<RebateCalculation />} />
      <Route path="/realtime-reports" element={<RealtimeReports />} />
      <Route path="/top-customer" element={<TopCustomer />} />
      <Route path="/rebate-review" element={<ReviewPage />} />
    </Routes>
  )
}
