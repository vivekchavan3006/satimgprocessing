import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, FileText, Loader2, ExternalLink } from 'lucide-react';
import { getReports, downloadReport } from '../services/api';
import { mockReports } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState(mockReports);

  useEffect(() => {
    getReports().then(r => { setReports(r); setLoading(false); });
  }, []);

  const handleDownload = async (id: string, format: 'pdf' | 'json') => {
    addToast({ type: 'info', title: 'Preparing download', message: `Generating ${format.toUpperCase()} report…` });
    await downloadReport(id, format);
    addToast({ type: 'success', title: 'Download ready', message: `Report ${id} (${format.toUpperCase()}) is ready` });
  };

  return (
    <div className="p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white font-['Space_Grotesk']">Reports</h1>
        <p className="text-xs text-white/35 mt-1">Downloadable analysis reports with evidence and metadata</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="text-cyan-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/8 transition-colors flex-shrink-0">
                  <FileText size={20} className="text-cyan-400/70" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h2 className="text-sm font-semibold text-white/85">{report.title}</h2>
                      <div className="flex items-center gap-3 mt-0.5 text-[10px] text-white/30 font-['JetBrains_Mono']">
                        <span>{report.id}</span>
                        <span>·</span>
                        <span>{new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <span>·</span>
                        <span>{report.location}</span>
                        <span>·</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-lg font-bold text-cyan-400 font-['Space_Grotesk']">{report.confidence}%</span>
                      <span className="text-[9px] text-white/25 font-['JetBrains_Mono']">conf.</span>
                    </div>
                  </div>

                  {/* Query */}
                  <p className="text-xs text-white/45 italic mb-3">"{report.query}"</p>

                  {/* Meta chips */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/8 rounded font-['JetBrains_Mono'] text-white/35">
                      {report.inputType}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/8 rounded font-['JetBrains_Mono'] text-white/35">
                      {report.task}
                    </span>
                    {report.models.map(m => (
                      <span key={m} className="text-[9px] px-2 py-0.5 bg-cyan-500/8 border border-cyan-500/15 rounded font-['JetBrains_Mono'] text-cyan-400/60">
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/results')}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-white/45 rounded-lg text-[11px] hover:border-white/20 hover:text-white/65 transition-all"
                      aria-label={`View report ${report.id}`}
                    >
                      <Eye size={11} />
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(report.id, 'pdf')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-[11px] hover:bg-cyan-500/15 transition-all"
                      aria-label={`Download PDF report ${report.id}`}
                    >
                      <Download size={11} />
                      PDF
                    </button>
                    <button
                      onClick={() => handleDownload(report.id, 'json')}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-white/45 rounded-lg text-[11px] hover:border-white/20 hover:text-white/65 transition-all"
                      aria-label={`Export JSON report ${report.id}`}
                    >
                      <ExternalLink size={11} />
                      JSON
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
