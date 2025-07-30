import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  headerTitle?: string; // Add headerTitle to LayoutProps
}

const Layout: React.FC<LayoutProps> = ({ children, headerTitle }) => { // Destructure headerTitle
  return (
    <div className="min-h-screen w-full overflow-x-hidden lg:grid lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col w-full overflow-x-hidden">
        <Header title={headerTitle} /> {/* Pass headerTitle to Header */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-100 dark:bg-gray-900 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;