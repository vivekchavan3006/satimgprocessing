import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Satellite, ChevronRight, Play, Scan, Layers, Eye, Activity, Globe } from 'lucide-react';

const floatingLabels = [
  { label: 'OPTICAL', x: '12%', y: '22%', delay: 0 },
  { label: 'SAR', x: '78%', y: '18%', delay: 0.3 },
  { label: 'MULTISPECTRAL', x: '8%', y: '65%', delay: 0.6 },
  { label: 'BI-TEMPORAL', x: '74%', y: '70%', delay: 0.9 },
  { label: 'AI VISION', x: '45%', y: '82%', delay: 1.2 },
  { label: 'CHANGE DETECTION', x: '80%', y: '44%', delay: 1.5 },
];

const features = [
  { icon: Scan, label: 'Multimodal Analysis' },
  { icon: Layers, label: 'Optical + SAR Fusion' },
  { icon: Eye, label: 'Visual Grounding' },
  { icon: Activity, label: 'Change Detection' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#050914] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_#0d2247_0%,_#050914_70%)]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56,189,248,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
        {/* Orbital SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="720" cy="420" rx="480" ry="200" fill="none" stroke="#22d3ee" strokeWidth="0.8" />
          <ellipse cx="720" cy="420" rx="320" ry="130" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="6,6" />
          <ellipse cx="720" cy="420" rx="600" ry="250" fill="none" stroke="#0ea5e9" strokeWidth="0.4" strokeDasharray="2,10" transform="rotate(-15 720 420)" />
          {/* Satellite dots */}
          <circle cx="200" cy="320" r="3" fill="#22d3ee" opacity="0.6" />
          <circle cx="1100" cy="480" r="2.5" fill="#38bdf8" opacity="0.5" />
          <circle cx="820" cy="200" r="2" fill="#22d3ee" opacity="0.4" />
        </svg>

        {/* Center glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-600/8 blur-2xl" />
      </div>

      {/* Floating labels */}
      {floatingLabels.map(({ label, x, y, delay }) => (
        <motion.div
          key={label}
          className="absolute hidden lg:flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 backdrop-blur-sm"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 1, duration: 0.6 }}
        >
          <div className="w-1 h-1 rounded-full bg-cyan-400" />
          <span className="text-[9px] text-cyan-300/70 font-['JetBrains_Mono'] tracking-widest font-semibold">
            {label}
          </span>
        </motion.div>
      ))}

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Satellite size={16} className="text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-widest font-['Space_Grotesk']">SATQUERY AI</div>
            <div className="text-[8px] text-cyan-400/60 tracking-[0.2em] font-['JetBrains_Mono']">REMOTE SENSING INTELLIGENCE</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-['JetBrains_Mono']">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400">GROUND STATION LINK: ONLINE</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-8 py-12" role="main">
        <div className="text-center max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-8"
          >
            <Globe size={12} className="text-cyan-400" />
            <span className="text-[10px] text-cyan-400/80 font-['JetBrains_Mono'] tracking-widest">
              VISION-LANGUAGE REMOTE SENSING ASSISTANT
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-['Space_Grotesk'] text-6xl md:text-7xl font-bold text-white mb-4 leading-none tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              SATQUERY
            </span>
            <span className="block text-4xl md:text-5xl mt-2 font-medium text-cyan-400/90">
              AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-xl font-['Space_Grotesk'] text-white/60 mb-3 font-medium tracking-wide"
          >
            Ask. Analyze. Understand Earth.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-sm text-white/35 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            An agentic vision-language assistant for intelligent multimodal remote-sensing analysis. Powered by specialist AI models for optical, SAR, and multispectral imagery.
          </motion.p>

          {/* Feature chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8"
              >
                <Icon size={12} className="text-cyan-400/70" />
                <span className="text-xs text-white/50 font-medium">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              id="launch-mission-btn"
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              aria-label="Launch Mission - Go to dashboard"
            >
              <Satellite size={16} />
              Launch Mission
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="explore-demo-btn"
              onClick={() => navigate('/workspace')}
              className="flex items-center gap-3 px-8 py-3.5 rounded-xl border border-white/15 text-white/70 font-medium text-sm hover:border-cyan-500/30 hover:text-white/90 hover:bg-white/5 transition-all duration-300"
              aria-label="Explore Demo workspace"
            >
              <Play size={14} />
              Explore Demo
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer telemetry */}
      <footer className="relative z-10 flex items-center justify-center gap-8 px-8 py-5 border-t border-white/5" role="contentinfo">
        {[
          '● SYSTEM ONLINE',
          '● MODEL SERVICES READY',
          '● GEO PROCESSING READY',
          '● DATA LINK: SECURE',
        ].map((item, i) => (
          <motion.span
            key={item}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 + i * 0.1 }}
            className="text-[9px] text-green-400/50 font-['JetBrains_Mono'] tracking-widest hidden sm:block"
          >
            {item}
          </motion.span>
        ))}
      </footer>
    </div>
  );
}
