import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Download, Eye, Layers, AlertTriangle,
  ChevronRight, BarChart3, Satellite, Info, ExternalLink, MapPin
} from 'lucide-react';
import { mockAnalysisResult } from '../data/mockData';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

function ConfidenceRing({ value, size = 80 }: { value: number; size?: number }) {
  const data = [{ value, fill: value >= 90 ? '#22d3ee' : value >= 70 ? '#f59e0b' : '#f87171' }];
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={4}
            background={{ fill: '#ffffff08' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-sm font-bold text-white font-['Space_Grotesk']">{value}%</span>
      </div>
    </div>
  );
}

function SatelliteImageBefore() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full rounded-xl" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="200" fill="#0c1e10" />
      <ellipse cx="60" cy="70" rx="55" ry="45" fill="#1a4a2e" opacity="0.9" />
      <ellipse cx="140" cy="50" rx="70" ry="35" fill="#15382a" opacity="0.8" />
      <ellipse cx="240" cy="90" rx="50" ry="65" fill="#1a4a2e" opacity="0.7" />
      <rect x="110" y="110" width="80" height="60" fill="#2a3a4a" rx="2" opacity="0.7" />
      <ellipse cx="260" cy="155" rx="38" ry="32" fill="#0e3050" opacity="0.9" />
      <line x1="0" y1="130" x2="300" y2="130" stroke="#3a4a5a" strokeWidth="1.5" opacity="0.4" />
      <line x1="150" y1="0" x2="150" y2="200" stroke="#3a4a5a" strokeWidth="1.5" opacity="0.3" />
      <rect x="5" y="5" width="14" height="1.5" fill="#38bdf8" opacity="0.4" />
      <rect x="5" y="5" width="1.5" height="14" fill="#38bdf8" opacity="0.4" />
      <rect x="281" y="5" width="14" height="1.5" fill="#38bdf8" opacity="0.4" />
      <rect x="293.5" y="5" width="1.5" height="14" fill="#38bdf8" opacity="0.4" />
    </svg>
  );
}

function SatelliteImageAfter() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full rounded-xl" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="200" fill="#0c1e10" />
      {/* More built-up */}
      <ellipse cx="60" cy="70" rx="35" ry="28" fill="#1a4a2e" opacity="0.6" />
      <ellipse cx="140" cy="50" rx="50" ry="25" fill="#15382a" opacity="0.5" />
      <ellipse cx="240" cy="90" rx="30" ry="42" fill="#1a4a2e" opacity="0.5" />
      {/* More urban */}
      <rect x="90" y="95" width="130" height="80" fill="#2a3a4a" rx="2" opacity="0.85" />
      <rect x="95" y="100" width="120" height="70" fill="#1e2d3d" rx="1" opacity="0.9" />
      {[100,118,136,154,172,104,122,140,158,176].map((x, i) => (
        <rect key={i} x={x} y={108 + (i % 2) * 30} width="14" height="11" fill="#2d4560" rx="1" opacity="0.7" />
      ))}
      <ellipse cx="260" cy="155" rx="42" ry="36" fill="#0e3050" opacity="0.9" />
      {/* Change highlight */}
      <rect x="90" y="95" width="130" height="80" fill="rgba(56,189,248,0.06)" rx="2" />
      <rect x="90" y="95" width="130" height="80" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" rx="2" opacity="0.4" />
      <line x1="0" y1="130" x2="300" y2="130" stroke="#3a4a5a" strokeWidth="1.5" opacity="0.4" />
      <line x1="150" y1="0" x2="150" y2="200" stroke="#3a4a5a" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

function ChangeMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full rounded-xl" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="200" fill="#07111f" />
      {/* Changed areas */}
      <rect x="90" y="95" width="130" height="80" fill="rgba(56,189,248,0.35)" rx="2" />
      <ellipse cx="80" cy="90" rx="50" ry="30" fill="rgba(74,222,128,0.2)" />
      <ellipse cx="60" cy="70" rx="20" ry="17" fill="rgba(239,68,68,0.15)" />
      {/* Highlight rings */}
      <rect x="90" y="95" width="130" height="80" fill="none" stroke="#38bdf8" strokeWidth="1.5" rx="2" />
      <ellipse cx="80" cy="90" rx="50" ry="30" fill="none" stroke="#4ade80" strokeWidth="1" strokeDasharray="3,3" />
      <ellipse cx="260" cy="155" rx="42" ry="36" fill="rgba(250,204,21,0.12)" />
      <ellipse cx="260" cy="155" rx="42" ry="36" fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="3,3" />
      {/* Legend */}
      <rect x="8" y="165" width="8" height="8" fill="rgba(56,189,248,0.5)" rx="1" />
      <text x="19" y="173" fill="#38bdf8" fontSize="7" fontFamily="monospace">New Built-up</text>
      <rect x="8" y="177" width="8" height="8" fill="rgba(74,222,128,0.4)" rx="1" />
      <text x="19" y="185" fill="#4ade80" fontSize="7" fontFamily="monospace">Veg Loss</text>
      <rect x="80" y="165" width="8" height="8" fill="rgba(250,204,21,0.4)" rx="1" />
      <text x="91" y="173" fill="#facc15" fontSize="7" fontFamily="monospace">Water Change</text>
    </svg>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const result = mockAnalysisResult;
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'grounding'>('overview');

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-green-400" />
            <h1 className="text-xl font-bold text-white font-['Space_Grotesk']">Analysis Complete</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-['JetBrains_Mono']">
              COMPLETED
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-white/30 font-['JetBrains_Mono']">
            <span>ID: {result.id}</span>
            <span>·</span>
            <span>{result.inputType}</span>
            <span>·</span>
            <span><MapPin size={9} className="inline mr-0.5" />{result.location}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => navigate('/workspace')}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/50 rounded-xl text-sm hover:border-white/20 hover:text-white/70 transition-all"
          >
            <Satellite size={14} />
            New Analysis
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 rounded-xl text-sm hover:bg-cyan-500/20 transition-all"
            aria-label="Download Analysis Report"
          >
            <Download size={14} />
            Download Report
          </button>
        </div>
      </motion.div>

      {/* Query + Answer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
      >
        <div className="mb-3">
          <div className="text-[10px] text-white/30 font-['JetBrains_Mono'] mb-1">QUERY</div>
          <p className="text-sm font-medium text-white/70 italic">"{result.query}"</p>
        </div>
        <div className="border-t border-white/5 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-cyan-500/30 to-violet-500/30 flex items-center justify-center">
              <Satellite size={10} className="text-cyan-400" />
            </div>
            <span className="text-[10px] font-semibold text-cyan-400 font-['JetBrains_Mono']">SATQUERY AI</span>
          </div>
          <p className="text-sm text-white/75 leading-relaxed">{result.answer}</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/5">
        {(['overview', 'evidence', 'grounding'] as const).map(tab => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 ${
              activeTab === tab
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-white/40 hover:text-white/60'
            }`}
            aria-selected={activeTab === tab}
            role="tab"
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Confidence breakdown */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <h2 className="text-xs font-semibold text-white/50 font-['JetBrains_Mono'] tracking-wider mb-4">
              CONFIDENCE ANALYSIS
            </h2>
            <div className="flex justify-center mb-4">
              <div className="flex flex-col items-center gap-2">
                <ConfidenceRing value={result.confidence} size={90} />
                <div className="text-center">
                  <div className="text-xs text-white/40">Overall Confidence</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {Object.entries(result.confidence_breakdown).map(([key, val]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                return (
                  <div key={key}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-white/40">{label}</span>
                      <span className="text-cyan-400 font-['JetBrains_Mono']">{val}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analysis metadata */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <h2 className="text-xs font-semibold text-white/50 font-['JetBrains_Mono'] tracking-wider mb-4">
              EXECUTION SUMMARY
            </h2>
            <div className="space-y-3">
              {[
                { k: 'ANALYSIS ID', v: result.id },
                { k: 'TASK', v: result.task },
                { k: 'INPUT TYPE', v: result.inputType },
                { k: 'IMAGES', v: '2 (before + after)' },
                { k: 'MODELS', v: result.models.join(' + ') },
                { k: 'EXEC TIME', v: `${result.executionTime}s` },
                { k: 'BEFORE DATE', v: result.beforeDate },
                { k: 'AFTER DATE', v: result.afterDate },
                { k: 'LOCATION', v: result.location },
              ].map(({ k, v }) => (
                <div key={k} className="flex gap-2">
                  <span className="text-[9px] text-white/25 font-['JetBrains_Mono'] w-20 flex-shrink-0 mt-0.5">{k}</span>
                  <span className="text-[11px] text-white/60 font-medium leading-tight">{v}</span>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-xs font-semibold hover:bg-cyan-500/15 transition-all"
              aria-label="Download Analysis Report"
            >
              <Download size={12} />
              Download Report
            </button>
          </div>

          {/* Change statistics */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <h2 className="text-xs font-semibold text-white/50 font-['JetBrains_Mono'] tracking-wider mb-4">
              CHANGE STATISTICS
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Total Changed Area', value: `${result.statistics.changedArea} km²`, color: 'cyan' },
                { label: 'Built-up Increase', value: `+${result.statistics.builtupChange}%`, color: 'blue' },
                { label: 'Vegetation Decrease', value: `${result.statistics.vegetationChange}%`, color: 'red' },
                { label: 'Water Change', value: `+${result.statistics.waterChange}%`, color: 'green' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5">
                  <span className="text-xs text-white/50">{label}</span>
                  <span className={`text-sm font-bold font-['Space_Grotesk'] ${
                    color === 'cyan' ? 'text-cyan-400' :
                    color === 'blue' ? 'text-blue-400' :
                    color === 'red' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
              <div className="text-[9px] text-white/25 font-['JetBrains_Mono'] mb-2">EVIDENCE SOURCES</div>
              {['Optical imagery', 'SAR imagery', 'Temporal comparison'].map(src => (
                <div key={src} className="flex items-center gap-1.5">
                  <CheckCircle2 size={10} className="text-green-400" />
                  <span className="text-[10px] text-white/40">{src}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'evidence' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Image trio */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'BEFORE IMAGE', sub: result.beforeDate, comp: <SatelliteImageBefore /> },
              { label: 'AFTER IMAGE', sub: result.afterDate, comp: <SatelliteImageAfter /> },
              { label: 'CHANGE MAP', sub: 'Detected Changes', comp: <ChangeMap /> },
            ].map(({ label, sub, comp }) => (
              <div key={label} className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                  <span className="text-[10px] font-semibold text-white/50 font-['JetBrains_Mono']">{label}</span>
                  <span className="text-[9px] text-white/25 font-['JetBrains_Mono']">{sub}</span>
                </div>
                <div className="aspect-[3/2] p-2">{comp}</div>
              </div>
            ))}
          </div>

          {/* Cross-modal evidence */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'OPTICAL EVIDENCE', text: result.evidence.optical, color: 'cyan' },
              { label: 'SAR EVIDENCE', text: result.evidence.sar, color: 'violet' },
              { label: 'FUSION RESULT', text: result.evidence.fusion, color: 'green' },
            ].map(({ label, text, color }) => (
              <div key={label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                <div className={`text-[9px] font-semibold font-['JetBrains_Mono'] tracking-wider mb-2 ${
                  color === 'cyan' ? 'text-cyan-400' :
                  color === 'violet' ? 'text-violet-400' : 'text-green-400'
                }`}>
                  {label}
                </div>
                <p className="text-[11px] text-white/55 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'grounding' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Viewer with overlays */}
            <div className="lg:col-span-2 bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-white/40 font-['JetBrains_Mono']">GROUNDING VISUALIZATION</span>
                <span className="text-[9px] text-amber-400/60 font-['JetBrains_Mono']">DEMO DATA</span>
              </div>
              <div className="relative p-3">
                <SatelliteImageAfter />
              </div>
            </div>

            {/* Detections */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-white/50 font-['JetBrains_Mono'] tracking-wider">
                DETECTED REGIONS
              </h2>
              {result.detections.map(det => (
                <motion.div
                  key={det.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/[0.03] border border-white/8 rounded-xl p-4 cursor-pointer hover:border-cyan-500/20 transition-all"
                  role="button"
                  tabIndex={0}
                  aria-label={`Detection: ${det.label}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white/70">{det.label}</span>
                    <span className={`text-[10px] font-bold font-['Space_Grotesk'] ${
                      det.change === 'increase' ? 'text-cyan-400' :
                      det.change === 'decrease' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {det.confidence}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[8px] text-white/25 font-['JetBrains_Mono']">COORDINATES</div>
                      <div className="text-[10px] text-white/50 font-['JetBrains_Mono']">
                        {det.coordinates[0]}°N, {det.coordinates[1]}°E
                      </div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/25 font-['JetBrains_Mono']">AREA</div>
                      <div className="text-[10px] text-white/50 font-['JetBrains_Mono']">{det.area} km²</div>
                    </div>
                  </div>
                  <div className={`mt-2 text-[9px] font-['JetBrains_Mono'] ${
                    det.change === 'increase' ? 'text-cyan-400/60' :
                    det.change === 'decrease' ? 'text-red-400/60' : 'text-amber-400/60'
                  }`}>
                    ▲ {det.change.toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
