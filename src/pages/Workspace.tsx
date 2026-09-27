import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Upload, X, CheckCircle, AlertTriangle, Clock, Layers, Eye,
  Satellite, FlaskConical, Send, Lightbulb, RotateCcw,
  ChevronDown, ChevronUp, Loader2, ChevronRight, Info,
  ZoomIn, ZoomOut, Maximize2, LayoutPanelLeft, Diff, Scan, Check
} from 'lucide-react';
import { runAnalysis, runRealAnalysis, uploadImage, type ExecutionStep } from '../services/api';
import {
  runObjectDetection,
  AVAILABLE_CLASSES,
  type DetectionClass,
  type DetectionResult
} from '../services/objectDetectionService';
import {
  runDisasterAnalysis,
  type DisasterType,
  type DisasterAnalysisResult
} from '../services/disasterAnalysisService';
import { useToast } from '../context/ToastContext';

type AnalysisMode = 'single' | 'object-detection' | 'disaster' | 'optical-sar' | 'bi-temporal' | 'advanced';

const stepColors: Record<string, string> = {
  pending: 'border-white/10 bg-white/3 text-white/30',
  running: 'border-cyan-500/30 bg-cyan-500/8 text-cyan-400',
  completed: 'border-green-500/30 bg-green-500/8 text-green-400',
  failed: 'border-red-500/30 bg-red-500/8 text-red-400',
};

interface UploadedFileInfo {
  file: File;
  metadata?: Awaited<ReturnType<typeof uploadImage>>;
  uploading: boolean;
  error?: string;
}

function SatelliteImagePlaceholder({
  label,
  subLabel,
  detectionResult,
  disasterResult,
  showBoxes = true,
  imageUrl,
}: {
  label?: string;
  subLabel?: string;
  detectionResult?: DetectionResult | null;
  disasterResult?: DisasterAnalysisResult | null;
  showBoxes?: boolean;
  imageUrl?: string;
}) {
  return (
    <div className="relative w-full h-full min-h-[220px] bg-[#0a1628] rounded-xl overflow-hidden flex flex-col group select-none">
      {/* Real Sentinel-2 High-Resolution Satellite Image */}
      <img
        src={imageUrl || "/satellite-demo-optimized.jpg"}
        alt="Satellite Image"
        className="absolute inset-0 w-full h-full object-cover select-none"
      />

      {/* Coordinate & HUD Overlay SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {/* Subtle scan lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 25} x2="400" y2={i * 25}
            stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />
        ))}
        {/* Corner markers */}
        <rect x="8" y="8" width="18" height="2" fill="#38bdf8" opacity="0.6" />
        <rect x="8" y="8" width="2" height="18" fill="#38bdf8" opacity="0.6" />
        <rect x="374" y="8" width="18" height="2" fill="#38bdf8" opacity="0.6" />
        <rect x="390" y="8" width="2" height="18" fill="#38bdf8" opacity="0.6" />
        <rect x="8" y="290" width="18" height="2" fill="#38bdf8" opacity="0.6" />
        <rect x="8" y="274" width="2" height="18" fill="#38bdf8" opacity="0.6" />
        <rect x="374" y="290" width="18" height="2" fill="#38bdf8" opacity="0.6" />
        <rect x="390" y="274" width="2" height="18" fill="#38bdf8" opacity="0.6" />
        {/* Coordinate grid */}
        {[0.25, 0.5, 0.75].map((f, i) => (
          <React.Fragment key={i}>
            <line x1={f * 400} y1="0" x2={f * 400} y2="300" stroke="rgba(56,189,248,0.08)" strokeWidth="0.5" strokeDasharray="4,4" />
            <line x1="0" y1={f * 300} x2="400" y2={f * 300} stroke="rgba(56,189,248,0.08)" strokeWidth="0.5" strokeDasharray="4,4" />
          </React.Fragment>
        ))}
      </svg>

      {/* Bounding Boxes SVG Overlay */}
      {detectionResult && showBoxes && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          {detectionResult.boxes.map(box => (
            <g key={box.id}>
              {/* Box Fill & Border */}
              <rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                fill={`${box.color}22`}
                stroke={box.color}
                strokeWidth="0.8"
                rx="0.5"
              />
              {/* Class Label Tag */}
              <foreignObject
                x={box.x}
                y={Math.max(0, box.y - 4.5)}
                width={box.width + 25}
                height="6"
                className="overflow-visible"
              >
                <div
                  className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-[7px] font-bold font-['JetBrains_Mono'] leading-none shadow-md whitespace-nowrap"
                  style={{ backgroundColor: box.color, color: '#050914' }}
                >
                  <span>{box.className}</span>
                  <span className="opacity-80 font-normal">{box.confidence}%</span>
                </div>
              </foreignObject>
            </g>
          ))}
        </svg>
      )}

      {/* Disaster Region Boundaries SVG Overlay */}
      {disasterResult && showBoxes && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          {disasterResult.regions.map(region => (
            <g key={region.id}>
              <polygon
                points={region.polygon}
                fill={`${region.color}33`}
                stroke={region.color}
                strokeWidth="1"
                strokeDasharray="2,1"
                className="animate-pulse"
              />
              <polygon
                points={region.polygon}
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.3"
                opacity="0.6"
              />
              <foreignObject
                x={Math.max(2, region.center.x - 18)}
                y={Math.max(2, region.center.y - 4)}
                width="40"
                height="8"
                className="overflow-visible"
              >
                <div
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[7px] font-bold font-['JetBrains_Mono'] leading-none shadow-lg whitespace-nowrap border"
                  style={{ backgroundColor: `${region.color}ea`, borderColor: '#ffffff40', color: '#ffffff' }}
                >
                  <AlertTriangle size={8} />
                  <span>{region.title}</span>
                  <span className="opacity-90 font-normal bg-black/40 px-1 rounded">{region.affectedArea}</span>
                </div>
              </foreignObject>
            </g>
          ))}
        </svg>
      )}

      {/* Detection Summary Overlay Card */}
      {detectionResult && (
        <div className="absolute top-2 right-2 max-w-[200px] bg-[#08111f]/90 border border-cyan-500/30 rounded-xl p-3 shadow-xl backdrop-blur-md z-20 font-['JetBrains_Mono']">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-2">
            <span className="text-[10px] font-bold text-cyan-400 tracking-wider flex items-center gap-1">
              <Scan size={10} /> DETECTION SUMMARY
            </span>
            <span className="text-[9px] text-white/40">{detectionResult.summary.total} OBJ</span>
          </div>
          <div className="space-y-1 text-[10px]">
            {Object.entries(detectionResult.summary.breakdown).map(([cls, count]) => (
              <div key={cls} className="flex justify-between items-center text-white/70">
                <span className="text-white/50">{cls}:</span>
                <span className="font-semibold text-white/90">{count}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-1.5 mt-1 flex justify-between items-center text-cyan-300 font-bold">
              <span>Total:</span>
              <span>{detectionResult.summary.total}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400 text-[9px] pt-0.5">
              <span>Avg Confidence:</span>
              <span>{detectionResult.summary.avgConfidence}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Disaster Summary Overlay Card */}
      {disasterResult && (
        <div className="absolute top-2 right-2 max-w-[220px] bg-[#08111f]/95 border border-red-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md z-20 font-['JetBrains_Mono']">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-2">
            <span className="text-[10px] font-bold text-red-400 tracking-wider flex items-center gap-1">
              <AlertTriangle size={11} className="text-red-400 animate-pulse" /> DISASTER ANALYSIS
            </span>
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${
              disasterResult.overallSeverity === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
              disasterResult.overallSeverity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }`}>
              {disasterResult.overallSeverity}
            </span>
          </div>
          <div className="space-y-1.5 text-[10px]">
            <div className="text-xs font-bold text-white flex items-center gap-1">
              {disasterResult.disasterType} detected
            </div>
            <div className="flex justify-between items-center text-white/70">
              <span className="text-white/50">Confidence:</span>
              <span className="font-semibold text-emerald-400">{disasterResult.confidence}%</span>
            </div>
            <div className="flex justify-between items-center text-white/70">
              <span className="text-white/50">Severity:</span>
              <span className={`font-bold ${
                disasterResult.overallSeverity === 'High' ? 'text-red-400' :
                disasterResult.overallSeverity === 'Medium' ? 'text-amber-400' : 'text-yellow-400'
              }`}>
                {disasterResult.overallSeverity}
              </span>
            </div>
            <div className="flex justify-between items-center text-white/70">
              <span className="text-white/50">Affected Area:</span>
              <span className="font-semibold text-cyan-300">{disasterResult.totalAffectedArea}</span>
            </div>
          </div>
        </div>
      )}

      {/* Overlay info */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/50 rounded text-[9px] font-['JetBrains_Mono'] text-cyan-400/80 backdrop-blur-sm z-20">
        <Satellite size={9} />
        DEMO IMAGE
      </div>
      {label && !detectionResult && !disasterResult && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-[9px] font-['JetBrains_Mono'] text-white/60 backdrop-blur-sm z-20">
          {label}
        </div>
      )}
      <div className="absolute bottom-2 left-2 text-[8px] font-['JetBrains_Mono'] text-white/25 z-20">
        LAT 18.52 | LON 73.86 | RES 1.0m
      </div>
      {subLabel && (
        <div className="absolute bottom-2 right-2 text-[9px] font-['JetBrains_Mono'] text-amber-400/60 z-20">
          {subLabel}
        </div>
      )}
    </div>
  );
}

function UploadZone({
  label,
  subLabel,
  onFile,
  fileInfo,
  detectionResult,
  disasterResult,
  showBoxes,
}: {
  label: string;
  subLabel?: string;
  onFile: (f: File) => void;
  fileInfo?: UploadedFileInfo;
  detectionResult?: DetectionResult | null;
  disasterResult?: DisasterAnalysisResult | null;
  showBoxes?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="text-xs font-semibold text-white/60 font-['JetBrains_Mono'] tracking-wider">{label}</div>
        {subLabel && <span className="text-[9px] text-amber-400/70 font-['JetBrains_Mono']">{subLabel}</span>}
      </div>

      {fileInfo?.metadata ? (
        <div className="relative">
          <SatelliteImagePlaceholder
            label={label}
            subLabel={subLabel}
            detectionResult={detectionResult}
            disasterResult={disasterResult}
            showBoxes={showBoxes}
            imageUrl={fileInfo.file ? URL.createObjectURL(fileInfo.file) : undefined}
          />
          <button
            onClick={() => onFile(new File([], ''))} // reset trick
            className="absolute top-2 right-8 p-1 bg-black/60 rounded text-white/50 hover:text-white/80 transition-colors z-30"
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
          {/* Metadata card */}
          <div className="mt-3 bg-white/[0.03] border border-white/8 rounded-xl p-3 grid grid-cols-2 gap-2">
            {[
              { k: 'SENSOR', v: fileInfo.metadata.sensor },
              { k: 'MODALITY', v: fileInfo.metadata.modality },
              { k: 'RESOLUTION', v: fileInfo.metadata.resolution },
              { k: 'ACQUISITION', v: fileInfo.metadata.acquisitionDate },
              { k: 'FORMAT', v: fileInfo.metadata.format },
              { k: 'CRS', v: fileInfo.metadata.crs },
            ].map(({ k, v }) => (
              <div key={k}>
                <div className="text-[8px] text-white/30 font-['JetBrains_Mono'] tracking-wider">{k}</div>
                <div className="text-[11px] text-white/70 font-medium mt-0.5">{v}</div>
              </div>
            ))}
          </div>
          {/* Validation */}
          <div className="mt-2 space-y-1">
            {[
              { ok: fileInfo.metadata.validation.formatSupported, label: 'Format supported' },
              { ok: fileInfo.metadata.validation.spatialMetadata, label: 'Spatial metadata detected' },
              { ok: fileInfo.metadata.validation.readable, label: 'Image readable' },
            ].map(({ ok, label: vl }) => (
              <div key={vl} className="flex items-center gap-1.5">
                {ok
                  ? <CheckCircle size={11} className="text-green-400" />
                  : <AlertTriangle size={11} className="text-amber-400" />}
                <span className={`text-[10px] font-['JetBrains_Mono'] ${ok ? 'text-green-400/70' : 'text-amber-400/70'}`}>
                  {ok ? '✓' : '⚠'} {vl}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
            dragging
              ? 'border-cyan-400/60 bg-cyan-500/8'
              : 'border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.02]'
          }`}
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          aria-label={`Upload ${label} image`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".tif,.tiff,.png,.jpg,.jpeg"
            className="hidden"
            onChange={e => e.target.files?.[0] && onFile(e.target.files[0])}
            aria-hidden="true"
          />
          {fileInfo?.uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-cyan-400 animate-spin" />
              <span className="text-xs text-white/40">Processing metadata…</span>
            </div>
          ) : (
            <>
              <Upload size={24} className="text-white/20 mx-auto mb-3" />
              <p className="text-xs text-white/50 mb-1">Drag & drop or click to upload</p>
              <p className="text-[10px] text-white/25">GeoTIFF · TIFF · PNG · JPEG · Max 2GB</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function AgentTracePanel({ steps }: { steps: ExecutionStep[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {steps.map(step => (
        <div
          key={step.step}
          className={`border rounded-xl overflow-hidden transition-all ${stepColors[step.status]}`}
        >
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-left"
            onClick={() => setExpanded(expanded === step.step ? null : step.step)}
            aria-expanded={expanded === step.step}
            aria-controls={`step-detail-${step.step}`}
          >
            <span className="text-[10px] font-['JetBrains_Mono'] w-5 flex-shrink-0 opacity-60">
              {String(step.step).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold">{step.label}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {step.status === 'running' && <Loader2 size={12} className="animate-spin" />}
              {step.status === 'completed' && <CheckCircle size={12} />}
              {step.status === 'pending' && <Clock size={12} className="opacity-30" />}
              <span className="text-[10px] font-['JetBrains_Mono'] capitalize opacity-70">{step.status}</span>
              {step.duration && <span className="text-[10px] font-['JetBrains_Mono'] opacity-50">{step.duration}</span>}
              {step.details && (expanded === step.step ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
            </div>
          </button>
          <AnimatePresence>
            {expanded === step.step && step.details && (
              <motion.div
                id={`step-detail-${step.step}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3 border-t border-white/5 mt-0 pt-3 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[8px] text-white/30 font-['JetBrains_Mono'] mb-0.5">TASK</div>
                    <div className="text-[10px] text-white/60">{step.details.task}</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-white/30 font-['JetBrains_Mono'] mb-0.5">MODEL</div>
                    <div className="text-[10px] text-white/60">{step.details.model}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[8px] text-white/30 font-['JetBrains_Mono'] mb-1">PARAMETERS</div>
                    <div className="flex flex-wrap gap-1">
                      {step.details.parameters.map(p => (
                        <span key={p} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/8 rounded text-white/40 font-['JetBrains_Mono']">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function Workspace() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const modes = [
    { id: 'single' as AnalysisMode, label: t('workspace.singleImage'), icon: Eye },
    { id: 'object-detection' as AnalysisMode, label: t('workspace.objectDetection'), icon: Scan },
    { id: 'disaster' as AnalysisMode, label: t('workspace.disasterAnalysis'), icon: AlertTriangle },
    { id: 'optical-sar' as AnalysisMode, label: t('workspace.opticalSar'), icon: Layers },
    { id: 'bi-temporal' as AnalysisMode, label: t('workspace.biTemporal'), icon: Diff },
    { id: 'advanced' as AnalysisMode, label: t('workspace.advanced'), icon: FlaskConical },
  ];

  const [mode, setMode] = useState<AnalysisMode>('single');
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [files, setFiles] = useState<Record<string, UploadedFileInfo | undefined>>({
    primary: undefined,
    secondary: undefined,
  });

  // Object Detection State
  const [selectedClasses, setSelectedClasses] = useState<DetectionClass[]>([
    'Buildings',
    'Vehicles',
    'Water Bodies',
  ]);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [showBoxes, setShowBoxes] = useState(true);

  // Disaster Analysis State
  const [selectedDisasterType, setSelectedDisasterType] = useState<DisasterType>('Landslide');
  const [disasterResult, setDisasterResult] = useState<DisasterAnalysisResult | null>(null);

  const handleClassToggle = (cls: DetectionClass) => {
    setSelectedClasses(prev =>
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    );
  };

  const handleSelectAllClasses = () => {
    if (selectedClasses.length === AVAILABLE_CLASSES.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(AVAILABLE_CLASSES.map(c => c.name));
    }
  };

  const handleFile = useCallback(async (key: string, file: File) => {
    if (!file.name) {
      setFiles(prev => ({ ...prev, [key]: undefined }));
      setDetectionResult(null);
      setDisasterResult(null);
      return;
    }
    setFiles(prev => ({ ...prev, [key]: { file, uploading: true } }));
    try {
      const metadata = await uploadImage(file);
      setFiles(prev => ({ ...prev, [key]: { file, metadata, uploading: false } }));
      addToast({ type: 'success', title: 'Image uploaded', message: `${file.name} processed successfully` });
    } catch {
      setFiles(prev => ({ ...prev, [key]: { file, uploading: false, error: 'Upload failed' } }));
      addToast({ type: 'error', title: 'Upload failed', message: 'Could not process image' });
    }
  }, [addToast]);

  const handleAnalyze = useCallback(async () => {
    if (mode === 'disaster') {
      setIsAnalyzing(true);
      setExecutionSteps([]);
      setDisasterResult(null);
      try {
        const result = await runDisasterAnalysis(
          selectedDisasterType,
          query,
          step => setExecutionSteps(prev => {
            const idx = prev.findIndex(s => s.step === step.step);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = step;
              return next;
            }
            return [...prev, step];
          })
        );
        setDisasterResult(result);
        addToast({
          type: 'success',
          title: 'Disaster analysis complete',
          message: `${result.disasterType} detected (${result.confidence}% confidence, ${result.overallSeverity} severity)`,
        });
      } catch {
        addToast({ type: 'error', title: 'Analysis failed', message: 'Could not perform disaster analysis' });
      } finally {
        setIsAnalyzing(false);
      }
      return;
    }

    if (mode === 'object-detection') {
      if (selectedClasses.length === 0) {
        addToast({ type: 'warning', title: 'Classes required', message: 'Please select at least one detection class' });
        return;
      }
      setIsAnalyzing(true);
      setExecutionSteps([]);
      setDetectionResult(null);
      try {
        const result = await runObjectDetection(
          selectedClasses,
          query,
          step => setExecutionSteps(prev => {
            const idx = prev.findIndex(s => s.step === step.step);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = step;
              return next;
            }
            return [...prev, step];
          })
        );
        setDetectionResult(result);
        addToast({
          type: 'success',
          title: 'Detection complete',
          message: `Detected ${result.summary.total} objects across ${Object.keys(result.summary.breakdown).length} classes`,
        });
      } catch {
        addToast({ type: 'error', title: 'Detection failed', message: 'Could not perform object detection' });
      } finally {
        setIsAnalyzing(false);
      }
      return;
    }

    // Standard Modes
    if (!query.trim()) {
      addToast({ type: 'warning', title: 'Query required', message: 'Please enter a question about your imagery' });
      return;
    }
    
    // Check if we have an image
    if (!files.primary?.file || files.primary.file.size === 0) {
      addToast({ type: 'error', title: 'Image required', message: 'Please upload an image first' });
      return;
    }
    
    setIsAnalyzing(true);
    setExecutionSteps([]);
    setDetectionResult(null);
    try {
      const result = await runRealAnalysis(
        files.primary.file,
        query,
        step => setExecutionSteps(prev => {
          const idx = prev.findIndex(s => s.step === step.step);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = step;
            return next;
          }
          return [...prev, step];
        })
      );
      setDetectionResult(result);
      addToast({ type: 'success', title: 'Analysis complete', message: `Found ${result.summary.total} objects` });
    } catch {
      addToast({ type: 'error', title: 'Analysis failed', message: 'Something went wrong during inference' });
    } finally {
      setIsAnalyzing(false);
    }
  }, [query, mode, selectedClasses, selectedDisasterType, navigate, addToast, files]);

  const secondLabel = mode === 'optical-sar' ? t('workspace.sarImage') : mode === 'bi-temporal' ? t('workspace.afterImage') : '';
  const firstLabel = mode === 'bi-temporal' ? t('workspace.beforeImage') : mode === 'optical-sar' ? t('workspace.opticalImage') : t('workspace.image');
  const firstSub = mode === 'bi-temporal' ? '12 MAY 2025' : undefined;
  const secondSub = mode === 'bi-temporal' ? '18 MAY 2026' : undefined;

  const needsSecond = mode === 'optical-sar' || mode === 'bi-temporal';
    mode === 'object-detection'
      ? detectionSuggestions
      : mode === 'disaster'
      ? disasterSuggestions
      : generalSuggestions;

  return (
    <div className="h-full flex flex-col">
      {/* Mode selector bar */}
      <div className="px-6 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-white font-['Space_Grotesk']">{t('workspace.title')}</h1>
          <div className="flex items-center gap-2 text-[10px] font-['JetBrains_Mono'] text-white/30">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI INFERENCE ENGINE: READY
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {modes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`mode-${id}`}
              onClick={() => {
                setMode(id);
                setExecutionSteps([]);
                setDetectionResult(null);
                setDisasterResult(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === id
                  ? id === 'disaster'
                    ? 'bg-red-500/15 border border-red-500/30 text-red-400 shadow-sm shadow-red-500/10'
                    : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-sm shadow-cyan-500/10'
                  : 'border border-white/8 text-white/40 hover:text-white/60 hover:border-white/15'
              }`}
              aria-pressed={mode === id}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 grid grid-cols-12 gap-0 min-h-0">
        {/* Left: Upload + Query/Class Controls */}
        <div className="col-span-12 lg:col-span-3 border-r border-white/5 overflow-y-auto p-4 space-y-4">
          <UploadZone
            label={firstLabel}
            subLabel={firstSub}
            onFile={f => handleFile('primary', f)}
            fileInfo={files.primary}
            detectionResult={mode === 'object-detection' ? detectionResult : null}
            disasterResult={mode === 'disaster' ? disasterResult : null}
            showBoxes={showBoxes}
          />
          {needsSecond && (
            <UploadZone
              label={secondLabel}
              subLabel={secondSub}
              onFile={f => handleFile('secondary', f)}
              fileInfo={files.secondary}
            />
          )}

          {/* Disaster Analysis Mode Selector */}
          {mode === 'disaster' && (
            <div className="space-y-3 bg-white/[0.02] border border-white/8 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-white/70 font-['JetBrains_Mono'] tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={12} className="text-red-400" /> DISASTER TYPE
                </h3>
                <span className="text-[9px] text-white/40 font-['JetBrains_Mono']">SINGLE IMAGE</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {(['Landslide', 'Earthquake Impact', 'Tsunami', 'Auto-Detect'] as DisasterType[]).map(dType => {
                  const isSelected = selectedDisasterType === dType;
                  return (
                    <button
                      key={dType}
                      onClick={() => setSelectedDisasterType(dType)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-red-500/15 border-red-500/40 text-white'
                          : 'bg-white/[0.01] border-white/5 text-white/40 hover:border-white/10 hover:text-white/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            dType === 'Landslide' ? 'bg-red-500' :
                            dType === 'Earthquake Impact' ? 'bg-orange-500' :
                            dType === 'Tsunami' ? 'bg-cyan-400' : 'bg-purple-400'
                          }`}
                        />
                        <span>{dType}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          isSelected ? 'bg-red-500 border-red-400 text-white' : 'border-white/20'
                        }`}
                      >
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Object Detection Multi-Class Selector */}
          {mode === 'object-detection' && (
            <div className="space-y-3 bg-white/[0.02] border border-white/8 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-white/70 font-['JetBrains_Mono'] tracking-wider flex items-center gap-1.5">
                  <Scan size={12} className="text-cyan-400" /> TARGET CLASSES
                </h3>
                <button
                  onClick={handleSelectAllClasses}
                  className="text-[9px] text-cyan-400 hover:text-cyan-300 font-['JetBrains_Mono'] transition-colors"
                >
                  {selectedClasses.length === AVAILABLE_CLASSES.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {AVAILABLE_CLASSES.map(cls => {
                  const isSelected = selectedClasses.includes(cls.name);
                  return (
                    <button
                      key={cls.name}
                      onClick={() => handleClassToggle(cls.name)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-white/[0.06] border-white/20 text-white'
                          : 'bg-white/[0.01] border-white/5 text-white/30 hover:border-white/10 hover:text-white/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cls.color }}
                        />
                        <span>{cls.name}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          isSelected ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-white/20'
                        }`}
                      >
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Query Composer */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white/60 font-['JetBrains_Mono'] tracking-wider">
              {mode === 'disaster'
                ? 'DISASTER PROMPT QUERY'
                : mode === 'object-detection'
                ? 'OPTIONAL PROMPT QUERY'
                : 'ASK SATQUERY'}
            </h3>
            <textarea
              id="query-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={
                mode === 'disaster'
                  ? t('workspace.queryPlaceholderDisaster')
                  : mode === 'object-detection'
                  ? t('workspace.queryPlaceholderDetection')
                  : t('workspace.queryPlaceholderGeneral')
              }
              className="w-full h-20 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all font-['Inter']"
              aria-label="Analysis query"
            />
            {/* Suggestions */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Lightbulb size={10} className="text-amber-400/60" />
                <span className="text-[9px] text-white/25 font-['JetBrains_Mono']">SUGGESTIONS</span>
              </div>
              {activeSuggestions.slice(0, 3).map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="w-full text-left text-[10px] text-white/35 hover:text-white/60 hover:bg-white/5 px-2 py-1.5 rounded-lg transition-all border border-transparent hover:border-white/8 leading-relaxed"
                  aria-label={`Use suggestion: ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
            {/* Actions */}
            <div className="flex gap-2">
              <button
                id="analyze-btn"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg ${
                  mode === 'disaster'
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-500 hover:to-amber-500 shadow-red-500/20'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20'
                }`}
                aria-label={
                  mode === 'disaster'
                    ? 'Analyze Disaster'
                    : mode === 'object-detection'
                    ? 'Detect Objects'
                    : 'Analyze Query'
                }
              >
                {isAnalyzing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : mode === 'disaster' ? (
                  <AlertTriangle size={14} />
                ) : mode === 'object-detection' ? (
                  <Scan size={14} />
                ) : (
                  <Send size={14} />
                )}
                {isAnalyzing
                  ? mode === 'disaster'
                    ? t('workspace.analyzingDisaster')
                    : mode === 'object-detection'
                    ? t('workspace.detecting')
                    : t('workspace.analyzing')
                  : mode === 'disaster'
                  ? t('workspace.analyzeDisaster')
                  : mode === 'object-detection'
                  ? t('workspace.detectObjects')
                  : t('workspace.analyzeQuery')}
              </button>
              <button
                onClick={() => {
                  setQuery('');
                  setExecutionSteps([]);
                  setDetectionResult(null);
                  setDisasterResult(null);
                }}
                className="px-3 py-2.5 border border-white/10 text-white/40 rounded-xl hover:border-white/20 hover:text-white/60 transition-all"
                aria-label="Clear query"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Center: Image viewer */}
        <div className="col-span-12 lg:col-span-6 flex flex-col border-r border-white/5 min-h-0">
          {/* Viewer toolbar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 flex-shrink-0">
            <span className="text-[10px] text-white/30 font-['JetBrains_Mono'] flex-1">{t('workspace.viewer')}</span>
            {((mode === 'object-detection' && detectionResult) || (mode === 'disaster' && disasterResult)) && (
              <button
                onClick={() => setShowBoxes(!showBoxes)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-['JetBrains_Mono'] border transition-all flex items-center gap-1.5 ${
                  showBoxes
                    ? mode === 'disaster'
                      ? 'bg-red-500/15 border-red-500/30 text-red-400'
                      : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                    : 'border-white/10 text-white/40 hover:text-white/60'
                }`}
              >
                <Eye size={11} />
                {showBoxes ? t('workspace.hideOverlays') : t('workspace.showOverlays')}
              </button>
            )}
            {[ZoomIn, ZoomOut, Maximize2, LayoutPanelLeft].map((Icon, i) => (
              <button
                key={i}
                className="p-1.5 text-white/30 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all"
                aria-label={['Zoom in', 'Zoom out', 'Fullscreen', 'Panel layout'][i]}
              >
                <Icon size={13} />
              </button>
            ))}
          </div>

          {/* Image area */}
          <div className={`flex-1 p-3 grid gap-3 ${needsSecond ? 'grid-rows-2' : 'grid-rows-1'} overflow-hidden`}>
            <SatelliteImagePlaceholder
              label={firstLabel}
              subLabel={firstSub}
              detectionResult={mode === 'object-detection' || mode === 'single' ? detectionResult : null}
              disasterResult={mode === 'disaster' ? disasterResult : null}
              showBoxes={showBoxes}
              imageUrl={files.primary?.file && files.primary.file.size > 0 ? URL.createObjectURL(files.primary.file) : undefined}
            />
            {needsSecond && <SatelliteImagePlaceholder label={secondLabel} subLabel={secondSub} imageUrl={files.secondary?.file && files.secondary.file.size > 0 ? URL.createObjectURL(files.secondary.file) : undefined} />}
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-6 px-4 py-2 border-t border-white/5 bg-black/20 flex-shrink-0">
            {[
              { label: 'LAT', value: '18.5204°N' },
              { label: 'LON', value: '73.8567°E' },
              { label: 'ZOOM', value: '14.2x' },
              { label: 'RESOLUTION', value: '1.0m' },
              { label: 'MODE', value: modes.find(m => m.id === mode)?.label || mode },
              ...(mode === 'object-detection' && detectionResult
                ? [{ label: 'DETECTIONS', value: `${detectionResult.summary.total} objects` }]
                : []),
              ...(mode === 'disaster' && disasterResult
                ? [
                    { label: 'DISASTER', value: disasterResult.disasterType },
                    { label: 'SEVERITY', value: disasterResult.overallSeverity },
                    { label: 'AFFECTED AREA', value: disasterResult.totalAffectedArea },
                  ]
                : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-[8px] text-white/25 font-['JetBrains_Mono']">{label}</span>
                <span className="text-[10px] text-cyan-400/70 font-['JetBrains_Mono']">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Agent trace */}
        <div className="col-span-12 lg:col-span-3 flex flex-col min-h-0">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 flex-shrink-0">
            <div className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-cyan-400 animate-pulse' : 'bg-white/20'}`} />
            <span className="text-[10px] text-white/40 font-['JetBrains_Mono'] tracking-wider">{t('workspace.agentTrace')}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {executionSteps.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <FlaskConical size={28} className="text-white/10 mb-3" />
                <p className="text-xs text-white/25">
                  {mode === 'disaster'
                    ? t('workspace.selectDisasterFirst')
                    : mode === 'object-detection'
                    ? t('workspace.selectClassesFirst')
                    : t('workspace.uploadImageFirst')}
                </p>
                <p className="text-[10px] text-white/15 mt-1">Agent execution trace will appear here</p>
              </div>
            ) : (
              <AgentTracePanel steps={executionSteps} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
