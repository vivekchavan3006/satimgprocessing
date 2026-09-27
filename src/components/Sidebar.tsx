import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FlaskConical,
  BarChart3,
  History,
  Cpu,
  Database,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Satellite,
  Activity,
  User,
  Wifi,
  Circle,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.overview') },
    { to: '/workspace', icon: FlaskConical, label: t('nav.workspace') },
    { to: '/results', icon: BarChart3, label: t('nav.results') },
    { to: '/history', icon: History, label: t('nav.history') },
    { to: '/models', icon: Cpu, label: t('nav.models') },
    { to: '/datasets', icon: Database, label: t('nav.datasets') },
    { to: '/reports', icon: FileText, label: t('nav.reports') },
  ];

  const systemStatuses = [
    { label: t('nav.aiEngine'), status: 'online' },
    { label: t('nav.geoPipeline'), status: 'online' },
    { label: t('nav.dataLink'), status: 'online' },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-[#080f1e] border-r border-white/5 overflow-hidden"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-white/5 flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 min-w-0 group"
          aria-label="Go to dashboard"
        >
          {/* Logo mark */}
          <div className="relative flex-shrink-0 w-9 h-9">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Satellite size={18} className="text-cyan-400" />
            </div>
            {/* Orbital arc */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
              <ellipse
                cx="18" cy="18" rx="15" ry="7"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="0.7"
                strokeOpacity="0.4"
                transform="rotate(-30 18 18)"
              />
            </svg>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="text-sm font-bold text-white tracking-wider font-['Space_Grotesk'] leading-none">
                  SATQUERY
                </div>
                <div className="text-[9px] text-cyan-400/70 tracking-[0.2em] font-['JetBrains_Mono'] leading-none mt-0.5">
                  AI PLATFORM
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden" aria-label="Sidebar navigation">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 mb-2"
            >
              <span className="text-[9px] font-semibold text-white/30 tracking-[0.2em] font-['JetBrains_Mono']">
                {t('nav.navigation')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <ul className="space-y-0.5 px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`
                }
                title={collapsed ? label : undefined}
                aria-label={label}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-r-full"
                      />
                    )}
                    <Icon
                      size={18}
                      className={`flex-shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-white/40 group-hover:text-white/70'}`}
                    />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.15 }}
                          className="text-sm font-medium whitespace-nowrap truncate"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* System Status */}
      <div className="border-t border-white/5 py-3 px-2 flex-shrink-0">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-2 mb-2"
            >
              <span className="text-[9px] font-semibold text-white/30 tracking-[0.2em] font-['JetBrains_Mono']">
                {t('nav.systemStatus')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={`space-y-1.5 ${collapsed ? 'flex flex-col items-center' : 'px-2'}`}>
          {systemStatuses.map(({ label, status }) => (
            <div
              key={label}
              className="flex items-center gap-2"
              title={collapsed ? `${label}: ${status}` : undefined}
            >
              <div className="relative flex-shrink-0">
                <Circle
                  size={6}
                  className={status === 'online' ? 'fill-green-400 text-green-400' : 'fill-amber-400 text-amber-400'}
                />
                {status === 'online' && (
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />
                )}
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-white/40 font-['JetBrains_Mono'] whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="border-t border-white/5 p-2 flex-shrink-0 space-y-0.5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`
          }
          title={collapsed ? 'Settings' : undefined}
          aria-label="Settings"
        >
          <Settings size={18} className="flex-shrink-0 text-white/40 group-hover:text-white/70 transition-colors" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="text-sm font-medium"
              >
                {t('nav.settings')}
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        <button
          className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-white/50 hover:text-white/80 hover:bg-white/5"
          title={collapsed ? 'User Profile' : undefined}
          aria-label="User profile"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <User size={11} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex flex-col items-start min-w-0"
              >
                <span className="text-sm font-medium text-white/70 truncate">{t('nav.analyst')}</span>
                <span className="text-[10px] text-white/30 font-['JetBrains_Mono']">ISRO/SAC</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-[#0d1929] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-cyan-500/50 transition-all duration-200 shadow-lg"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
