import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FlaskConical, ArrowRight, Building2, Droplets, Layers, Waves,
  TrendingUp, AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { mockRecentAnalyses, mockChangeStats } from '../data/mockData';

const stats = [
  { label: 'Active Analyses', value: '12', delta: '+3', positive: true, icon: FlaskConical, color: 'cyan' },
  { label: 'Images Processed', value: '1,284', delta: '+47', positive: true, icon: Layers, color: 'violet' },
  { label: 'AI Confidence', value: '94.7%', delta: '+0.3%', positive: true, icon: TrendingUp, color: 'green' },
  { label: 'Models Available', value: '8', delta: '', positive: null, icon: CheckCircle2, color: 'blue' },
];

const iconMap: Record<string, React.ElementType> = {
  building: Building2,
  waves: Waves,
  droplets: Droplets,
  layers: Layers,
};

const statusColors: Record<string, string> = {
  completed: 'text-green-400 bg-green-500/10 border-green-500/20',
  processing: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  failed: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const typeColors: Record<string, string> = {
  'Bi-Temporal': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  'Optical': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'SAR': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Optical + SAR': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            {greeting}, <span className="text-cyan-400">Analyst</span>
          </h1>
          <p className="text-sm text-white/40 mt-1">Remote Sensing Intelligence Console</p>
        </div>
        <button
          id="start-new-analysis-btn"
          onClick={() => navigate('/workspace')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 group"
          aria-label="Start a new analysis"
        >
          <FlaskConical size={15} />
          Start New Analysis
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, delta, positive, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 font-medium">{label}</span>
              <div className={`p-1.5 rounded-lg ${color === 'cyan' ? 'bg-cyan-500/10' : color === 'violet' ? 'bg-violet-500/10' : color === 'green' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                <Icon size={14} className={`${color === 'cyan' ? 'text-cyan-400' : color === 'violet' ? 'text-violet-400' : color === 'green' ? 'text-green-400' : 'text-blue-400'}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white font-['Space_Grotesk'] mb-1">{value}</div>
            {delta && (
              <div className={`text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
                {delta} <span className="text-white/30 font-normal">this week</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Analyses */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/70 font-['Space_Grotesk']">Recent Analyses</h2>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {mockRecentAnalyses.map((analysis, i) => {
              const Icon = iconMap[analysis.icon] || Layers;
              return (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="bg-white/[0.03] border border-white/8 rounded-xl p-4 hover:border-white/15 hover:bg-white/[0.05] transition-all cursor-pointer group"
                  onClick={() => navigate('/results')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate('/results')}
                  aria-label={`View analysis: ${analysis.title}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-white/8 transition-colors flex-shrink-0">
                      <Icon size={18} className="text-cyan-400/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white/85 truncate">{analysis.title}</h3>
                        <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-['JetBrains_Mono'] font-semibold ${statusColors[analysis.status]}`}>
                          {analysis.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mb-2 truncate">{analysis.query}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-['JetBrains_Mono'] ${typeColors[analysis.type] || 'text-white/40 bg-white/5 border-white/10'}`}>
                          {analysis.type}
                        </span>
                        <span className="text-[10px] text-white/30 font-['JetBrains_Mono']">{analysis.model}</span>
                        <span className="text-[10px] text-white/30">{analysis.subtitle}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-cyan-400 font-['Space_Grotesk']">{analysis.confidence}%</div>
                      <div className="text-[10px] text-white/30">confidence</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Telemetry panel */}
        <div className="space-y-4">
          {/* System telemetry */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
            <h2 className="text-xs font-semibold text-white/40 font-['JetBrains_Mono'] tracking-wider mb-4">
              SYSTEM TELEMETRY
            </h2>
            <div className="space-y-3">
              {[
                { label: 'AI INFERENCE ENGINE', status: 'READY', color: 'green' },
                { label: 'EARTH OBS PIPELINE', status: 'ACTIVE', color: 'green' },
                { label: 'GROUND STATION LINK', status: 'ONLINE', color: 'green' },
                { label: 'DATA LINK', status: 'SECURE', color: 'cyan' },
                { label: 'GPU CLUSTER', status: '12/16 FREE', color: 'amber' },
                { label: 'STORAGE', status: '2.4 TB FREE', color: 'blue' },
              ].map(({ label, status, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[10px] text-white/35 font-['JetBrains_Mono']">{label}</span>
                  <span className={`text-[10px] font-['JetBrains_Mono'] font-semibold ${
                    color === 'green' ? 'text-green-400' :
                    color === 'cyan' ? 'text-cyan-400' :
                    color === 'amber' ? 'text-amber-400' : 'text-blue-400'
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
            <h2 className="text-xs font-semibold text-white/40 font-['JetBrains_Mono'] tracking-wider mb-3">
              QUICK ACTIONS
            </h2>
            <div className="space-y-2">
              {[
                { label: 'New Analysis', action: () => navigate('/workspace'), primary: true },
                { label: 'View Reports', action: () => navigate('/reports') },
                { label: 'Model Registry', action: () => navigate('/models') },
                { label: 'Browse Datasets', action: () => navigate('/datasets') },
              ].map(({ label, action, primary }) => (
                <button
                  key={label}
                  onClick={action}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    primary
                      ? 'bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20'
                      : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                  }`}
                  aria-label={label}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Demo notice */}
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={12} className="text-amber-400" />
              <span className="text-[10px] font-semibold text-amber-400 font-['JetBrains_Mono']">DEMO DATA</span>
            </div>
            <p className="text-[10px] text-white/35 leading-relaxed">
              All displayed data is synthetic demonstration data. Connect a real FastAPI backend for live analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Land cover chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white/85 font-['Space_Grotesk']">Land Cover Trend — Pune Urban Region</h2>
            <p className="text-xs text-white/35 mt-0.5">DEMO DATA — Temporal analysis Oct 2025 – May 2026</p>
          </div>
          <span className="text-[10px] text-white/30 font-['JetBrains_Mono']">% COVERAGE</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={mockChangeStats} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="builtup" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="vegetation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="month" tick={{ fill: '#ffffff30', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#ffffff30', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0d1929', border: '1px solid #ffffff15', borderRadius: '8px', fontSize: '11px' }}
              labelStyle={{ color: '#ffffff70' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#ffffff50' }} />
            <Area type="monotone" dataKey="builtup" name="Built-up %" stroke="#38bdf8" fill="url(#builtup)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="vegetation" name="Vegetation %" stroke="#4ade80" fill="url(#vegetation)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
