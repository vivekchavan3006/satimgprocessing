import type { ExecutionStep } from './api';

export type DisasterType = 'Landslide' | 'Earthquake Impact' | 'Tsunami' | 'Auto-Detect';
export type SeverityLevel = 'Low' | 'Medium' | 'High';

export interface DisasterRegion {
  id: string;
  disasterType: 'Landslide' | 'Earthquake Impact' | 'Tsunami';
  title: string;
  confidence: number; // e.g. 91
  severity: SeverityLevel;
  affectedArea: string; // e.g. "2.4 km²"
  color: string;
  center: { x: number; y: number }; // percentage coords (0-100)
  // Polygon coordinates in percentage (x,y points for SVG polygon)
  polygon: string; 
  description: string;
}

export interface DisasterAnalysisResult {
  id: string;
  disasterType: string; // e.g. "Landslide"
  primaryDisaster: 'Landslide' | 'Earthquake Impact' | 'Tsunami';
  overallSeverity: SeverityLevel;
  totalAffectedArea: string;
  confidence: number;
  regions: DisasterRegion[];
  summaryMetrics: {
    label: string;
    value: string;
  }[];
  recommendation: string;
  executionTime: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const PRESET_DISASTERS: Record<'Landslide' | 'Earthquake Impact' | 'Tsunami', DisasterAnalysisResult> = {
  Landslide: {
    id: 'DIS-LS-9104',
    disasterType: 'Landslide',
    primaryDisaster: 'Landslide',
    overallSeverity: 'High',
    totalAffectedArea: '2.4 km²',
    confidence: 91,
    regions: [
      {
        id: 'ls-reg-1',
        disasterType: 'Landslide',
        title: 'Primary Slope Failure & Debris Runout Zone',
        confidence: 91,
        severity: 'High',
        affectedArea: '1.8 km²',
        color: '#ef4444',
        center: { x: 37, y: 53 },
        polygon: '22,46 48,44 52,60 28,62',
        description: 'Major steep-slope collapse with massive soil erosion and downslope debris path.',
      },
      {
        id: 'ls-reg-2',
        disasterType: 'Landslide',
        title: 'Secondary Scarp Erosion',
        confidence: 87,
        severity: 'Medium',
        affectedArea: '0.6 km²',
        color: '#f97316',
        center: { x: 72, y: 50 },
        polygon: '60,42 82,40 85,58 64,60',
        description: 'Incipient slope instability along road cut channel with high risk of further displacement.',
      },
    ],
    summaryMetrics: [
      { label: 'Displacement Volume', value: '450,000 m³' },
      { label: 'Slope Angle', value: '34.2°' },
      { label: 'Vegetation Loss', value: '78.5%' },
      { label: 'Infrastructure Risk', value: 'Critical (Embankment Highway)' },
    ],
    recommendation: 'Immediate evacuation of downhill structures and containment barrier deployment recommended.',
    executionTime: 2.94,
  },

  'Earthquake Impact': {
    id: 'DIS-EQ-8831',
    disasterType: 'Earthquake impact',
    primaryDisaster: 'Earthquake Impact',
    overallSeverity: 'High',
    totalAffectedArea: '3.8 km²',
    confidence: 89,
    regions: [
      {
        id: 'eq-reg-1',
        disasterType: 'Earthquake Impact',
        title: 'High-Density Structural Collapse Cluster',
        confidence: 92,
        severity: 'High',
        affectedArea: '2.1 km²',
        color: '#f97316',
        center: { x: 50, y: 33 },
        polygon: '36,24 64,22 66,42 38,44',
        description: 'Severe structural fractures, rubble field accumulation, and building collapse.',
      },
      {
        id: 'eq-reg-2',
        disasterType: 'Earthquake Impact',
        title: 'Surface Rupture & Ground Disruption Line',
        confidence: 86,
        severity: 'Medium',
        affectedArea: '1.7 km²',
        color: '#eab308',
        center: { x: 27, y: 37 },
        polygon: '18,28 34,26 36,46 20,48',
        description: 'Ground liquefaction and linear road alignment offset.',
      },
    ],
    summaryMetrics: [
      { label: 'Collapsed Structures', value: '142 Buildings' },
      { label: 'Surface Displacement', value: '1.4 meters' },
      { label: 'Seismic Intensity (Est)', value: 'VIII (Severe)' },
      { label: 'Lifeline Disruption', value: 'Power & Water Outage' },
    ],
    recommendation: 'Deploy Urban Search and Rescue (USAR) units to central quadrant and inspect bridge pilings.',
    executionTime: 3.12,
  },

  Tsunami: {
    id: 'DIS-TS-9420',
    disasterType: 'Tsunami',
    primaryDisaster: 'Tsunami',
    overallSeverity: 'High',
    totalAffectedArea: '5.2 km²',
    confidence: 94,
    regions: [
      {
        id: 'ts-reg-1',
        disasterType: 'Tsunami',
        title: 'Coastal Inundation & Marine Overwash Zone',
        confidence: 94,
        severity: 'High',
        affectedArea: '3.6 km²',
        color: '#06b6d4',
        center: { x: 55, y: 58 },
        polygon: '15,48 55,46 88,42 92,68 62,72 20,70',
        description: 'Extensive saltwater inundation extending 1.2 km inland from shore line.',
      },
      {
        id: 'ts-reg-2',
        disasterType: 'Tsunami',
        title: 'Estuarine Backwater Flooding',
        confidence: 90,
        severity: 'Medium',
        affectedArea: '1.6 km²',
        color: '#3b82f6',
        center: { x: 20, y: 64 },
        polygon: '5,54 32,52 35,74 8,76',
        description: 'Riverine surge backflow causing agricultural and localized residential flooding.',
      },
    ],
    summaryMetrics: [
      { label: 'Inundation Distance', value: '1.25 km Inland' },
      { label: 'Peak Surge Height', value: '4.8 meters' },
      { label: 'Submerged Land', value: '520 Hectares' },
      { label: 'Port Damage', value: 'Severe Infrastructure Impairment' },
    ],
    recommendation: 'Maintain high ground advisory. Priority response needed for coastal drainage and port facility clearance.',
    executionTime: 2.85,
  },
};

export async function runDisasterAnalysis(
  selectedDisaster: DisasterType,
  query: string,
  onTraceUpdate: (step: ExecutionStep) => void
): Promise<DisasterAnalysisResult> {
  // Determine actual disaster type from query or user choice
  const lowerQuery = (query || '').toLowerCase();
  let targetType: 'Landslide' | 'Earthquake Impact' | 'Tsunami' = 'Landslide';

  if (selectedDisaster === 'Tsunami' || lowerQuery.includes('tsunami') || lowerQuery.includes('inundation') || lowerQuery.includes('surge')) {
    targetType = 'Tsunami';
  } else if (selectedDisaster === 'Earthquake Impact' || lowerQuery.includes('earthquake') || lowerQuery.includes('quake') || lowerQuery.includes('building collapse')) {
    targetType = 'Earthquake Impact';
  } else if (selectedDisaster === 'Landslide' || lowerQuery.includes('landslide') || lowerQuery.includes('mudslide') || lowerQuery.includes('slope')) {
    targetType = 'Landslide';
  } else if (selectedDisaster === 'Auto-Detect') {
    if (lowerQuery.includes('water') || lowerQuery.includes('coast')) {
      targetType = 'Tsunami';
    } else if (lowerQuery.includes('structure') || lowerQuery.includes('urban')) {
      targetType = 'Earthquake Impact';
    } else {
      targetType = 'Landslide';
    }
  }

  const modelNames: Record<string, string> = {
    Landslide: 'EarthVL-LandslideDet v2.4 (ResNet-EO)',
    'Earthquake Impact': 'EarthVL-QuakeDamageNet v3.0 (ViT-SAR)',
    Tsunami: 'EarthVL-TsunamiInundate v1.9 (Optical+SAR)',
  };

  const steps = [
    { step: 1, label: 'Query received', delay: 350 },
    { step: 2, label: 'Input validated', delay: 300 },
    { step: 3, label: 'Disaster Analysis', delay: 450 },
    { step: 4, label: 'Model selected', delay: 400 },
    { step: 5, label: 'Detection complete', delay: 1700 },
    { step: 6, label: 'Results displayed', delay: 350 },
  ];

  const stepDetails = [
    {
      task: 'Natural Language & Hazard Query Parsing',
      tool: 'Prompt Router',
      model: 'SatQuery Intent Router v2.0',
      parameters: [
        query ? `User prompt: "${query}"` : `Target disaster: ${selectedDisaster}`,
        `Mode: Disaster Hazard Detection`,
      ],
    },
    {
      task: 'Single Image Quality & Geo Spatial Check',
      tool: 'GDAL & EO Reader',
      model: 'Spatial Input Checker v1.8',
      parameters: ['Single image input verified', 'Format GeoTIFF/PNG/JPEG', 'CRS & spatial grid initialized'],
    },
    {
      task: 'Multi-Hazard & Spatial Texture Feature Analysis',
      tool: 'EO Feature Extractor',
      model: 'EarthVL-Disaster Core',
      parameters: ['Elevation gradient estimation', 'Spectral index ratio (NDVI/NDWI)', 'Texture entropy calculation'],
    },
    {
      task: 'Specialist Disaster Model Selection',
      tool: 'Model Registry',
      model: modelNames[targetType],
      parameters: [`Target model: ${modelNames[targetType]}`, 'Resolution: 1.0m per pixel', 'Detection confidence threshold: 0.80'],
    },
    {
      task: 'Hazard Boundary & Severity Inference',
      tool: 'Segmentation & Boundary Engine',
      model: modelNames[targetType],
      parameters: [
        `Target hazard: ${targetType}`,
        `Segmented boundary points computed`,
        `Severity index calibrated`,
      ],
    },
    {
      task: 'Spatial Overlay & Metric Visualization',
      tool: 'Map & Overlay Renderer',
      model: 'SatQuery Visualizer',
      parameters: ['Disaster boundary polygon rendered', 'Affected area stats computed', 'Trace finalized'],
    },
  ];

  // Mark all pending
  steps.forEach(s => {
    onTraceUpdate({ step: s.step, label: s.label, status: 'pending' });
  });

  for (let i = 0; i < steps.length; i++) {
    onTraceUpdate({
      step: steps[i].step,
      label: steps[i].label,
      status: 'running',
      details: stepDetails[i],
    });
    await delay(steps[i].delay);
    onTraceUpdate({
      step: steps[i].step,
      label: steps[i].label,
      status: 'completed',
      duration: `${(steps[i].delay / 1000).toFixed(1)}s`,
      details: stepDetails[i],
    });
  }

  const baseResult = PRESET_DISASTERS[targetType];

  return {
    ...baseResult,
    id: `DIS-${Math.floor(Math.random() * 90000 + 10000)}`,
  };
}
