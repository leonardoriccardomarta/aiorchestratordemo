import { Routes, Route, Outlet } from 'react-router-dom';
import { FC, lazy, Suspense } from 'react';

import Layout from '../components/layout/Layout';
import { PageLoading } from '../components/ui/Loading';

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('../pages/Dashboard'));
const Chatbot = lazy(() => import('../pages/Chatbot'));
const WorkflowsPage = lazy(() => import('../pages/Workflows'));
const AnalyticsPage = lazy(() => import('../pages/Analytics'));
const FaqManagementPage = lazy(() => import('../pages/FaqManagement'));
const PaymentsPage = lazy(() => import('../pages/Payments'));
const ProfilePage = lazy(() => import('../pages/Profile'));
const SettingsPage = lazy(() => import('../pages/Settings'));
const FaqPage = lazy(() => import('../pages/FAQ'));
const AffiliatePage = lazy(() => import('../pages/AffiliateProgram'));
const UsagePage = lazy(() => import('../pages/Usage'));
const LoginPage = lazy(() => import('../pages/Login'));
const TrialPage = lazy(() => import('../pages/Trial'));
const PricingPage = lazy(() => import('../pages/Pricing'));
const SupportPage = lazy(() => import('../pages/Support'));
const DocumentationPage = lazy(() => import('../pages/Documentation'));
const RevenueOptimizationPage = lazy(() => import('../pages/RevenueOptimization'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

import { withAuthProtection } from '../middleware/authMiddleware';

// Create protected components
const ProtectedDashboard = withAuthProtection(DashboardPage);
const ProtectedChatbot = withAuthProtection(Chatbot);
const ProtectedWorkflows = withAuthProtection(WorkflowsPage);
const ProtectedAnalytics = withAuthProtection(AnalyticsPage);
const ProtectedFaqManagement = withAuthProtection(FaqManagementPage);
const ProtectedPayments = withAuthProtection(PaymentsPage);
const ProtectedProfile = withAuthProtection(ProfilePage);
const ProtectedSettings = withAuthProtection(SettingsPage);
const ProtectedFaq = withAuthProtection(FaqPage);
const ProtectedAffiliate = withAuthProtection(AffiliatePage);
const ProtectedUsage = withAuthProtection(UsagePage);
const ProtectedSupport = withAuthProtection(SupportPage);
const ProtectedDocumentation = withAuthProtection(DocumentationPage);
const ProtectedRevenueOptimization = withAuthProtection(RevenueOptimizationPage);

const AppRouter: FC = () => {
  return (
    <Suspense fallback={<PageLoading text="Loading..." />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/trial" element={<TrialPage />} />

        {/* Protected Layout with nested routes */}
        <Route element={<Layout children={<Outlet />} />}>
          <Route path="/" element={<ProtectedDashboard />} />
          <Route path="/dashboard" element={<ProtectedDashboard />} />
          <Route path="/chatbot" element={<ProtectedChatbot />} />
          <Route path="/workflows" element={<ProtectedWorkflows />} />
          <Route path="/analytics" element={<ProtectedAnalytics />} />
          <Route path="/faq-management" element={<ProtectedFaqManagement />} />
          <Route path="/payments" element={<ProtectedPayments />} />
          <Route path="/profile" element={<ProtectedProfile />} />
          <Route path="/settings" element={<ProtectedSettings />} />
          <Route path="/faq" element={<ProtectedFaq />} />
          <Route path="/usage" element={<ProtectedUsage />} />
          <Route path="/support" element={<ProtectedSupport />} />
          <Route path="/documentation" element={<ProtectedDocumentation />} />
          <Route path="/revenue-optimization" element={<ProtectedRevenueOptimization />} />
          <Route path="/affiliate" element={<ProtectedAffiliate />} />
          <Route path="/referrals" element={<ProtectedAffiliate />} />
          <Route path="/referrals/history" element={<ProtectedAffiliate />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter; 