import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ToastContainer from './ToastContainer';

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#050914] overflow-hidden">
      {/* Star field background */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0d1f3c_0%,_#050914_70%)]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56,189,248,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Stars */}
        <div className="stars-layer" />
      </div>

      {/* Sidebar */}
      <div className="relative z-10 flex-shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar />
        <main className="flex-1 overflow-auto" role="main">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
