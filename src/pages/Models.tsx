import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, X, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { getModels } from '../services/api';
import { mockModels } from '../data/mockData';
import { useToast } from '../context/ToastContext';

const statusColors: Record<string, { badge: string; dot: string }> = {
  ready: { badge: 'text-green-400 bg-green-500/10 border-green-500/20', dot: 'bg-green-400' },
  updating: { badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  offline: { badge: 'text-red-400 bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
};

const taskColors: Record<string, string> = {
  'Visual Question Answering': 'text-cyan-400',
  'Image Captioning': 'text-violet-400',
  'Visual Grounding': 'text-blue-400',
  'Change Detection': 'text-amber-400',
  'Change Understanding': 'text-orange-400',
  'Multimodal Fusion': 'text-pink-400',
  'Semantic Segmentation': 'text-green-400',
  'Scene Classification': 'text-indigo-400',
};

export default function Models() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState(mockModels);
  const [selectedModel, setSelectedModel] = useState<typeof mockModels[0] | null>(null);

  useEffect(() => {
    getModels().then(m => { setModels(m); setLoading(false); });
  }, []);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white font-['Space_Grotesk']">Models & Tools</h1>
        <p className="text-xs text-white/35 mt-1">
          Specialist AI model registry — {models.filter(m => m.status === 'ready').length} of {models.length} ready
        </p>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Models', value: models.length.toString() },
          { label: 'Ready', value: models.filter(m => m.status === 'ready').length.toString(), color: 'text-green-400' },
          { label: 'Avg Accuracy', value: `${(models.reduce((a, m) => a + m.accuracy, 0) / models.length).toFixed(1)}%`, color: 'text-cyan-400' },
          { label: 'Avg Latency', value: '2.8s', color: 'text-violet-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
            <div className="text-xs text-white/35 mb-1">{label}</div>
            <div className={`text-xl font-bold font-['Space_Grotesk'] ${color || 'text-white'}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Model cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="text-cyan-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {models.map((model, i) => {
            const sc = statusColors[model.status];
            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-white/15 hover:bg-white/[0.04] transition-all flex flex-col group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base font-bold text-white font-['Space_Grotesk']">{model.name}</h2>
                      <span className="text-[9px] text-white/30 font-['JetBrains_Mono']">{model.version}</span>
                    </div>
                    <p className="text-[10px] text-white/35">{model.fullName}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${model.status === 'ready' ? 'animate-pulse' : ''}`} />
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-['JetBrains_Mono'] font-semibold ${sc.badge}`}>
                      {model.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Task */}
                <div className={`text-xs font-semibold mb-3 ${taskColors[model.task] || 'text-white/50'}`}>
                  {model.task}
                </div>

                {/* Accuracy bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-white/30 font-['JetBrains_Mono']">ACCURACY</span>
                    <span className="text-cyan-400 font-['JetBrains_Mono'] font-semibold">{model.accuracy}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${model.accuracy}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: i * 0.06 + 0.3 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Modalities */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {model.modalities.map(m => (
                    <span key={m} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/8 rounded-full text-white/40 font-['JetBrains_Mono']">
                      {m}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-[10px]">
                  <div>
                    <span className="text-white/25 font-['JetBrains_Mono']">PARAMS</span>
                    <div className="text-white/50 font-semibold">{model.parameters}</div>
                  </div>
                  <div>
                    <span className="text-white/25 font-['JetBrains_Mono']">LATENCY</span>
                    <div className="text-white/50 font-semibold">{model.latency}</div>
                  </div>
                </div>

                <div className="flex-1" />

                {/* Action */}
                <button
                  id={`view-model-${model.id}`}
                  onClick={() => setSelectedModel(model)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/8 text-white/50 rounded-xl text-xs font-medium hover:border-cyan-500/25 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all group-hover:border-white/15"
                  aria-label={`View details for ${model.name}`}
                >
                  <Eye size={12} />
                  View Details
                  <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Model detail modal */}
      <AnimatePresence>
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedModel(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedModel.name} details`}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0b1628] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">{selectedModel.name}</h2>
                  <p className="text-xs text-white/35 mt-0.5">{selectedModel.fullName}</p>
                </div>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="p-1.5 text-white/40 hover:text-white/70 rounded-lg hover:bg-white/5 transition-all"
                  aria-label="Close model details"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-sm text-white/55 leading-relaxed mb-5">{selectedModel.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { k: 'Task', v: selectedModel.task },
                  { k: 'Version', v: selectedModel.version },
                  { k: 'Parameters', v: selectedModel.parameters },
                  { k: 'Avg Latency', v: selectedModel.latency },
                  { k: 'Accuracy', v: `${selectedModel.accuracy}%` },
                  { k: 'Last Updated', v: selectedModel.lastUpdated },
                ].map(({ k, v }) => (
                  <div key={k} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <div className="text-[9px] text-white/25 font-['JetBrains_Mono'] mb-1">{k.toUpperCase()}</div>
                    <div className="text-sm font-semibold text-white/70">{v}</div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="text-[9px] text-white/25 font-['JetBrains_Mono'] mb-2">TRAINED ON DATASETS</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModel.datasets.map(d => (
                    <span key={d} className="text-[10px] px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 font-['JetBrains_Mono']">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all"
                  onClick={() => { addToast({ type: 'success', title: `${selectedModel.name} loaded`, message: 'Model ready for analysis' }); setSelectedModel(null); }}
                >
                  Use in Analysis
                </button>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="px-4 py-2.5 border border-white/10 text-white/50 rounded-xl text-sm hover:border-white/20 hover:text-white/70 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
