import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, RefreshCw, ChevronDown, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { t } = useTranslation();
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header className="h-16 flex items-center px-6 border-b border-white/5 bg-[#060c1a]/80 backdrop-blur-sm flex-shrink-0" role="banner">
      {/* Left: title */}
      <div className="flex-1">
        {title && (
          <div>
            <h1 className="text-sm font-semibold text-white/90 font-['Space_Grotesk']">{title}</h1>
            {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Right: telemetry + status */}
      <div className="flex items-center gap-5">
        {/* Telemetry */}
        <div className="hidden md:flex items-center gap-4 text-[10px] font-['JetBrains_Mono'] text-white/30">
          <span className="flex items-center gap-1.5">
            <span className="text-cyan-400/60">UTC</span>
            <span className="text-white/50">{timeStr}</span>
          </span>
          <span className="text-white/15">|</span>
          <span>{dateStr}</span>
        </div>

        {/* System Online */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
          </div>
          <span className="text-[10px] text-green-400 font-['JetBrains_Mono'] font-semibold tracking-wider">
            {t('nav.systemOnline')}
          </span>
        </div>

        {/* Last sync */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-white/30 font-['JetBrains_Mono']">
          <RefreshCw size={10} />
          <span>{t('nav.syncAgo')}</span>
        </div>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </button>

        {/* Avatar */}
        <button
          className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-white/5 transition-all group"
          aria-label="User menu"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[11px] font-bold text-white">
            A
          </div>
          <ChevronDown size={12} className="text-white/30 group-hover:text-white/50 transition-colors" />
        </button>
      </div>
    </header>
  );
}
