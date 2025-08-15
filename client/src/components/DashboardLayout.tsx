'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  userEmail?: string;
  onLogout: () => void;
}

export default function DashboardLayout({ children, userEmail, onLogout }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail={userEmail} onLogout={onLogout} />
      
      {/* Main content area */}
      <div className="flex-1 lg:ml-0 min-h-screen">
        {/* Content wrapper with proper spacing for mobile menu */}
        <div className="lg:pl-0 pt-16 lg:pt-0">
          <div className="max-w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
