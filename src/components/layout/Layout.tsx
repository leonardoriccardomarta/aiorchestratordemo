import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import Navigation from './Navigation';
import Sidebar from './Sidebar';

export interface LayoutProps {
  children: React.ReactNode;
  navigationItems?: any[];
  sidebarItems?: any[];
  user?: any;
  breadcrumbs?: any[];
  onLogout?: () => void;
  onSearch?: (query: string) => void;
  className?: string;
  showSidebar?: boolean;
  showNavigation?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  navigationItems = [],
  sidebarItems = [],
  user,
  breadcrumbs,
  onLogout,
  onSearch,
  className,
  showSidebar = true,
  showNavigation = true,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Navigation */}
      {showNavigation && (
        <Navigation
          items={navigationItems}
          breadcrumbs={breadcrumbs}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            items={sidebarItems}
            collapsed={sidebarCollapsed}
            onToggle={setSidebarCollapsed}
          />
        )}

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 transition-all duration-300 ease-in-out',
            showSidebar && (sidebarCollapsed ? 'ml-16' : 'ml-64')
          )}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 