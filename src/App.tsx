import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { Icons } from './components/ui/Icon';
import { PageLoading } from './components/ui/Loading';
import './i18n/config'; // Initialize i18n
import './i18n/forceEnglish'; // Force English for Y Combinator demo
import './config/language'; // Aggressive English forcing

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Chatbot = lazy(() => import('./pages/Chatbot'));
const Workflows = lazy(() => import('./pages/Workflows'));
const Analytics = lazy(() => import('./pages/Analytics'));
const RevenueOptimization = lazy(() => import('./pages/RevenueOptimization'));
const Settings = lazy(() => import('./pages/Settings'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Payments = lazy(() => import('./pages/Payments'));
const Support = lazy(() => import('./pages/Support'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const AuditLog = lazy(() => import('./pages/AuditLog'));
const Performance = lazy(() => import('./pages/Performance'));
const Security = lazy(() => import('./pages/Security'));

// Navigation items - Simplified for YC Demo
const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <Icons.Dashboard /> },
  { label: 'Chatbot', href: '/chatbot', icon: <Icons.Chatbot /> },
  { label: 'Workflows', href: '/workflows', icon: <Icons.Workflow /> },
  { label: 'FAQ', href: '/faq', icon: <Icons.FAQ /> },
  { label: 'Analytics', href: '/analytics', icon: <Icons.Analytics /> },
  { label: 'Payments', href: '/payments', icon: <Icons.Payments /> },
  { label: 'Settings', href: '/settings', icon: <Icons.Settings /> },
];

// Sidebar items - Simplified for YC Demo
const sidebarItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Icons.Dashboard />,
  },
  {
    label: 'Chatbot',
    href: '/chatbot',
    icon: <Icons.Chatbot />,
  },
  {
    label: 'Workflows',
    href: '/workflows',
    icon: <Icons.Workflow />,
  },
  {
    label: 'FAQ',
    href: '/faq',
    icon: <Icons.FAQ />,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <Icons.Analytics />,
  },
  {
    label: 'Payments',
    href: '/payments',
    icon: <Icons.Payments />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Icons.Settings />,
  },
];

// Loading component for lazy routes
const RouteLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <PageLoading text="Loading page..." />
  </div>
);

const App: React.FC = () => {

  return (
    <AuthProvider>
      <Router>
        <Layout
          navigationItems={navigationItems}
          sidebarItems={sidebarItems}
        >
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/revenue" element={<RevenueOptimization />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/security" element={<Security />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/audit" element={<AuditLog />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/support" element={<Support />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App; 