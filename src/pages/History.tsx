import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, ChevronDown, Calendar, Loader2 } from 'lucide-react';
import { getAnalysisHistory } from '../services/api';
import { mockAnalysisHistory } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const statusColors: Record<string, string> = {
  completed: 'text-green-400 bg-green-500/10 border-green-500/20',
  processing: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  failed: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const typeColors: Record<string, string> = {
  'Bi-Temporal': 'text-violet-400',
  'Optical': 'text-cyan-400',
  'SAR': 'text-amber-400',
  'Optical + SAR': 'text-blue-400',
  'Multispectral': 'text-green-400',
};

export default function History() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(mockAnalysisHistory);

  useEffect(() => {
    getAnalysisHistory().then(d => { setData(d); setLoading(false); });
  }, []);

  const filtered = data.filter(a => {
    const q = search.toLowerCase();
    const matchQ = !q || a.query.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchModality = modalityFilter === 'all' || a.inputType === modalityFilter;
    return matchQ && matchStatus && matchModality;
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white font-['Space_Grotesk']">Analysis History</h1>
        <p className="text-xs text-white/35 mt-1">{data.length} total analyses</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 items-center"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            id="history-search"
            type="text"
            placeholder="Search analyses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 transition-all"
            aria-label="Search analysis history"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            id="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white/60 focus:outline-none focus:border-cyan-500/40 transition-all cursor-pointer"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        </div>

        {/* Modality filter */}
        <div className="relative">
          <select
            id="modality-filter"
            value={modalityFilter}
            onChange={e => setModalityFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white/60 focus:outline-none focus:border-cyan-500/40 transition-all cursor-pointer"
            aria-label="Filter by modality"
          >
            <option value="all">All Modalities</option>
            <option value="Optical">Optical</option>
            <option value="SAR">SAR</option>
            <option value="Bi-Temporal">Bi-Temporal</option>
            <option value="Optical + SAR">Optical + SAR</option>
            <option value="Multispectral">Multispectral</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        </div>

        <span className="text-xs text-white/25 font-['JetBrains_Mono']">{filtered.length} results</span>
      </motion.div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="text-cyan-400 animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full" role="grid" aria-label="Analysis history table">
              <thead>
                <tr className="border-b border-white/5">
                  {['Analysis ID', 'Date', 'Query', 'Modality', 'Task', 'Model', 'Confidence', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 font-['JetBrains_Mono'] tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-['JetBrains_Mono'] text-cyan-400/70">{row.id}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[10px] text-white/40 font-['JetBrains_Mono']">
                        {new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <span className="text-xs text-white/55 truncate block" title={row.query}>{row.query}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-['JetBrains_Mono'] font-semibold ${typeColors[row.inputType] || 'text-white/40'}`}>
                        {row.inputType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-white/50">{row.task}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] text-white/40 font-['JetBrains_Mono']">{row.model}</span>
                    </td>
                    <td className="px-4 py-3">
                      {row.confidence > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-500 rounded-full"
                              style={{ width: `${row.confidence}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-cyan-400 font-['JetBrains_Mono']">{row.confidence}%</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-['JetBrains_Mono'] font-semibold ${statusColors[row.status]}`}>
                        {row.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate('/results')}
                          className="p-1.5 text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                          aria-label={`View analysis ${row.id}`}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="p-1.5 text-white/40 hover:text-white/70 hover:bg-white/5 rounded-lg transition-all"
                          aria-label={`Download analysis ${row.id}`}
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-white/25 text-sm">
                      No analyses found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
