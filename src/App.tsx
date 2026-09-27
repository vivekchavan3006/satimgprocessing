import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './components/AppLayout';
import { Loader2 } from 'lucide-react';

const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Workspace = lazy(() => import('./pages/Workspace'));
const Results = lazy(() => import('./pages/Results'));
const History = lazy(() => import('./pages/History'));
const Models = lazy(() => import('./pages/Models'));
const Datasets = lazy(() => import('./pages/Datasets'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={24} className="text-cyan-400 animate-spin" />
        <span className="text-xs text-white/30 font-['JetBrains_Mono']">LOADING MODULE…</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen bg-[#050914] flex items-center justify-center">
            <PageLoader />
          </div>
        }>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<Landing />} />

            {/* App routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={
                <Suspense fallback={<PageLoader />}><Dashboard /></Suspense>
              } />
              <Route path="/workspace" element={
                <Suspense fallback={<PageLoader />}><Workspace /></Suspense>
              } />
              <Route path="/results" element={
                <Suspense fallback={<PageLoader />}><Results /></Suspense>
              } />
              <Route path="/history" element={
                <Suspense fallback={<PageLoader />}><History /></Suspense>
              } />
              <Route path="/models" element={
                <Suspense fallback={<PageLoader />}><Models /></Suspense>
              } />
              <Route path="/datasets" element={
                <Suspense fallback={<PageLoader />}><Datasets /></Suspense>
              } />
              <Route path="/reports" element={
                <Suspense fallback={<PageLoader />}><Reports /></Suspense>
              } />
              <Route path="/settings" element={
                <Suspense fallback={<PageLoader />}><Settings /></Suspense>
              } />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  );
}
