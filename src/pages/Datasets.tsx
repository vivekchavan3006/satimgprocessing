import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Database, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getDatasets } from '../services/api';
import { mockDatasets } from '../data/mockData';

const modalityColors: Record<string, string> = {
  Optical: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  SAR: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Multispectral: 'text-green-400 bg-green-500/10 border-green-500/20',
};

export default function Datasets() {
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState(mockDatasets);

  useEffect(() => {
    getDatasets().then(d => { setDatasets(d); setLoading(false); });
  }, []);

  return (
    <div className="p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white font-['Space_Grotesk']">Datasets</h1>
        <p className="text-xs text-white/35 mt-1">Benchmark and training datasets for remote sensing AI</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="text-cyan-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {datasets.map((ds, i) => (
            <motion.div
              key={ds.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white/[0.03] border rounded-2xl p-5 transition-all hover:bg-white/[0.04] ${
                ds.highlighted
                  ? 'border-cyan-500/25 shadow-lg shadow-cyan-500/5'
                  : 'border-white/8 hover:border-white/15'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                    ds.highlighted ? 'bg-cyan-500/15 border border-cyan-500/20' : 'bg-white/5'
                  }`}>
                    <Database size={18} className={ds.highlighted ? 'text-cyan-400' : 'text-white/40'} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h2 className="text-base font-bold text-white font-['Space_Grotesk']">{ds.name}</h2>
                      {ds.badge && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-['JetBrains_Mono'] font-bold tracking-widest ${
                          ds.highlighted
                            ? 'bg-cyan-500/15 border border-cyan-500/25 text-cyan-400'
                            : 'bg-white/5 border border-white/10 text-white/40'
                        }`}>
                          {ds.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/35 truncate">{ds.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {ds.status === 'restricted' ? (
                    <>
                      <Lock size={12} className="text-amber-400" />
                      <span className="text-[10px] px-2 py-0.5 rounded-full border font-['JetBrains_Mono'] font-semibold text-amber-400 bg-amber-500/10 border-amber-500/20">
                        RESTRICTED
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={12} className="text-green-400" />
                      <span className="text-[10px] px-2 py-0.5 rounded-full border font-['JetBrains_Mono'] font-semibold text-green-400 bg-green-500/10 border-green-500/20">
                        ACTIVE
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-white/45 leading-relaxed mb-4">{ds.description}</p>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { k: 'PURPOSE', v: ds.purpose },
                  { k: 'IMAGES', v: ds.images.toLocaleString() },
                  { k: 'RESOLUTION', v: ds.resolution },
                  { k: 'SOURCE', v: ds.source },
                  { k: 'LICENSE', v: ds.license },
                ].map(({ k, v }) => (
                  <div key={k} className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2">
                    <div className="text-[8px] text-white/25 font-['JetBrains_Mono'] mb-1">{k}</div>
                    <div className="text-[11px] text-white/55 font-medium leading-tight">{v}</div>
                  </div>
                ))}
                {/* Modalities */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2">
                  <div className="text-[8px] text-white/25 font-['JetBrains_Mono'] mb-1.5">MODALITIES</div>
                  <div className="flex flex-wrap gap-1">
                    {ds.modality.map(m => (
                      <span key={m} className={`text-[9px] px-1.5 py-0.5 rounded border font-['JetBrains_Mono'] ${modalityColors[m] || 'text-white/40 bg-white/5 border-white/10'}`}>
                        {m}
                      </span>
                    ))}
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
