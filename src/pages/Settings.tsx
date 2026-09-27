import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Moon, Monitor, Cpu, HardDrive,
  Globe, Download, Save, ChevronRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const settingsSections = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'appearance', label: 'Appearance', icon: Monitor },
  { id: 'models', label: 'Model Preferences', icon: Cpu },
  { id: 'inference', label: 'Inference Settings', icon: SettingsIcon },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'export', label: 'Export Preferences', icon: Download },
];

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5.5 rounded-full transition-colors ${value ? 'bg-cyan-500' : 'bg-white/10'}`}
      role="switch"
      aria-checked={value}
      aria-label={label}
    >
      <div className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-[18px]' : ''}`} />
    </button>
  );
}

function Select({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm text-white/60 focus:outline-none focus:border-cyan-500/40 transition-all"
      aria-label={label}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function Settings() {
  const { addToast } = useToast();
  const [activeSection, setActiveSection] = useState('general');
  const [prefs, setPrefs] = useState({
    theme: 'dark',
    language: 'English',
    timezone: 'Asia/Kolkata',
    defaultModel: 'Remote-VQA v1.4',
    confidenceThreshold: 75,
    maxImages: 2,
    autoSave: true,
    notifications: true,
    gpuAcceleration: true,
    batchProcessing: false,
    storageLimit: '50 GB',
    autoCleanup: true,
    exportFormat: 'PDF',
    includeEvidence: true,
    includeTrace: false,
  });

  const update = (key: string, val: unknown) => setPrefs(p => ({ ...p, [key]: val }));
  const save = () => addToast({ type: 'success', title: 'Settings saved', message: 'Your preferences have been updated' });

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-4">
            <SettingRow label="Language" desc="Interface display language">
              <Select value={prefs.language} onChange={v => update('language', v)} options={['English', 'Hindi']} label="Language" />
            </SettingRow>
            <SettingRow label="Timezone" desc="Used for analysis timestamps">
              <Select value={prefs.timezone} onChange={v => update('timezone', v)} options={['Asia/Kolkata', 'UTC', 'America/New_York']} label="Timezone" />
            </SettingRow>
            <SettingRow label="Auto-save analyses" desc="Automatically save completed analyses">
              <Toggle value={prefs.autoSave} onChange={v => update('autoSave', v)} label="Auto-save" />
            </SettingRow>
            <SettingRow label="Notifications" desc="Show toast notifications">
              <Toggle value={prefs.notifications} onChange={v => update('notifications', v)} label="Notifications" />
            </SettingRow>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {['dark', 'light', 'midnight', 'ocean'].map(t => (
                <button
                  key={t}
                  onClick={() => update('theme', t)}
                  className={`p-4 rounded-xl border text-sm font-medium capitalize transition-all ${
                    prefs.theme === t
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                      : 'border-white/8 text-white/40 hover:border-white/15'
                  }`}
                  aria-pressed={prefs.theme === t}
                  aria-label={`${t} theme`}
                >
                  <div className={`w-full h-8 rounded-lg mb-2 ${
                    t === 'dark' ? 'bg-[#080f1e]' :
                    t === 'light' ? 'bg-gray-100' :
                    t === 'midnight' ? 'bg-[#030711]' : 'bg-[#071428]'
                  }`} />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {t === 'dark' && <span className="ml-2 text-[9px] text-cyan-400/60">(Default)</span>}
                </button>
              ))}
            </div>
          </div>
        );
      case 'models':
        return (
          <div className="space-y-4">
            <SettingRow label="Default Model" desc="Fallback model for unclassified tasks">
              <Select value={prefs.defaultModel} onChange={v => update('defaultModel', v)}
                options={['Remote-VQA v1.4', 'RS-Caption v2.0', 'Change-VQA v2.1']} label="Default model" />
            </SettingRow>
            <SettingRow label="Confidence Threshold" desc="Minimum confidence for accepted results">
              <div className="flex items-center gap-3">
                <input
                  type="range" min={50} max={99} value={prefs.confidenceThreshold}
                  onChange={e => update('confidenceThreshold', +e.target.value)}
                  className="w-32 accent-cyan-400"
                  aria-label="Confidence threshold"
                />
                <span className="text-sm text-cyan-400 font-['JetBrains_Mono'] w-10">{prefs.confidenceThreshold}%</span>
              </div>
            </SettingRow>
          </div>
        );
      case 'inference':
        return (
          <div className="space-y-4">
            <SettingRow label="GPU Acceleration" desc="Use GPU for faster inference">
              <Toggle value={prefs.gpuAcceleration} onChange={v => update('gpuAcceleration', v)} label="GPU acceleration" />
            </SettingRow>
            <SettingRow label="Batch Processing" desc="Process multiple queries simultaneously">
              <Toggle value={prefs.batchProcessing} onChange={v => update('batchProcessing', v)} label="Batch processing" />
            </SettingRow>
            <SettingRow label="Max Images per Analysis" desc="Maximum number of input images">
              <Select value={String(prefs.maxImages)} onChange={v => update('maxImages', +v)}
                options={['1', '2', '4', '8']} label="Max images" />
            </SettingRow>
          </div>
        );
      case 'storage':
        return (
          <div className="space-y-4">
            <SettingRow label="Storage Limit" desc="Maximum storage for analysis results">
              <Select value={prefs.storageLimit} onChange={v => update('storageLimit', v)}
                options={['10 GB', '50 GB', '100 GB', 'Unlimited']} label="Storage limit" />
            </SettingRow>
            <SettingRow label="Auto Cleanup" desc="Automatically delete old analyses">
              <Toggle value={prefs.autoCleanup} onChange={v => update('autoCleanup', v)} label="Auto cleanup" />
            </SettingRow>
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
              <div className="text-xs text-white/50 mb-2">Storage Usage</div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-1">
                <div className="h-full w-[34%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-white/30 font-['JetBrains_Mono']">
                <span>17.1 GB used</span>
                <span>50 GB limit</span>
              </div>
            </div>
          </div>
        );
      case 'export':
        return (
          <div className="space-y-4">
            <SettingRow label="Default Export Format" desc="Format for downloaded reports">
              <Select value={prefs.exportFormat} onChange={v => update('exportFormat', v)}
                options={['PDF', 'JSON', 'CSV']} label="Export format" />
            </SettingRow>
            <SettingRow label="Include Visual Evidence" desc="Embed imagery in exported reports">
              <Toggle value={prefs.includeEvidence} onChange={v => update('includeEvidence', v)} label="Include evidence" />
            </SettingRow>
            <SettingRow label="Include Execution Trace" desc="Include agent trace in exports">
              <Toggle value={prefs.includeTrace} onChange={v => update('includeTrace', v)} label="Include trace" />
            </SettingRow>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white font-['Space_Grotesk']">Settings</h1>
        <p className="text-xs text-white/35 mt-1">Platform configuration and preferences</p>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {settingsSections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`settings-${id}`}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === id
                  ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }`}
              aria-current={activeSection === id ? 'page' : undefined}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 space-y-2"
          >
            <h2 className="text-sm font-semibold text-white/70 mb-4 font-['Space_Grotesk']">
              {settingsSections.find(s => s.id === activeSection)?.label}
            </h2>
            {renderContent()}
          </motion.div>

          <div className="flex justify-end mt-4">
            <button
              id="save-settings-btn"
              onClick={save}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
              aria-label="Save settings"
            >
              <Save size={14} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <div className="text-sm text-white/65 font-medium">{label}</div>
        <div className="text-xs text-white/30 mt-0.5">{desc}</div>
      </div>
      {children}
    </div>
  );
}
