import type { ExecutionStep } from './api';

export type DetectionClass =
  | 'Buildings'
  | 'Vehicles'
  | 'Water Bodies'
  | 'Ships'
  | 'Aircraft'
  | 'Roads'
  | 'Solar Panels';

export const AVAILABLE_CLASSES: { name: DetectionClass; color: string; defaultChecked: boolean }[] = [
  { name: 'Buildings', color: '#38bdf8', defaultChecked: true },
  { name: 'Vehicles', color: '#f59e0b', defaultChecked: true },
  { name: 'Water Bodies', color: '#3b82f6', defaultChecked: true },
  { name: 'Ships', color: '#14b8a6', defaultChecked: false },
  { name: 'Aircraft', color: '#a855f7', defaultChecked: false },
  { name: 'Roads', color: '#10b981', defaultChecked: false },
  { name: 'Solar Panels', color: '#eab308', defaultChecked: false },
];

export interface BoundingBox {
  id: string;
  className: DetectionClass;
  confidence: number; // e.g. 94.2
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage
  height: number; // percentage
  color: string;
}

export interface DetectionSummary {
  breakdown: Record<string, number>;
  total: number;
  avgConfidence: number;
}

export interface DetectionResult {
  id: string;
  boxes: BoundingBox[];
  summary: DetectionSummary;
  executionTime: number;
}

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Realistic default box generator tailored to real Sentinel-2 satellite image layout
const PRESET_BOXES: Record<DetectionClass, Omit<BoundingBox, 'id'>[]> = {
  Buildings: [
    { className: 'Buildings', confidence: 96.4, x: 38, y: 26, width: 12, height: 10, color: '#38bdf8' },
    { className: 'Buildings', confidence: 94.8, x: 52, y: 24, width: 14, height: 12, color: '#38bdf8' },
    { className: 'Buildings', confidence: 95.1, x: 44, y: 36, width: 10, height: 9, color: '#38bdf8' },
    { className: 'Buildings', confidence: 92.3, x: 66, y: 32, width: 16, height: 12, color: '#38bdf8' },
    { className: 'Buildings', confidence: 91.5, x: 35, y: 62, width: 12, height: 10, color: '#38bdf8' },
    { className: 'Buildings', confidence: 93.7, x: 50, y: 60, width: 14, height: 11, color: '#38bdf8' },
  ],
  Vehicles: [
    { className: 'Vehicles', confidence: 89.2, x: 44, y: 48, width: 4, height: 3, color: '#f59e0b' },
    { className: 'Vehicles', confidence: 87.5, x: 49, y: 49, width: 4, height: 3, color: '#f59e0b' },
    { className: 'Vehicles', confidence: 91.0, x: 37, y: 54, width: 4, height: 3, color: '#f59e0b' },
    { className: 'Vehicles', confidence: 88.4, x: 58, y: 46, width: 4, height: 3, color: '#f59e0b' },
    { className: 'Vehicles', confidence: 90.1, x: 28, y: 58, width: 4, height: 3, color: '#f59e0b' },
  ],
  'Water Bodies': [
    { className: 'Water Bodies', confidence: 98.6, x: 32, y: 48, width: 44, height: 20, color: '#3b82f6' },
    { className: 'Water Bodies', confidence: 97.4, x: 68, y: 44, width: 25, height: 24, color: '#3b82f6' },
    { className: 'Water Bodies', confidence: 96.1, x: 10, y: 54, width: 26, height: 18, color: '#3b82f6' },
  ],
  Ships: [
    { className: 'Ships', confidence: 93.4, x: 54, y: 55, width: 5, height: 3, color: '#14b8a6' },
    { className: 'Ships', confidence: 90.8, x: 72, y: 52, width: 6, height: 3.5, color: '#14b8a6' },
    { className: 'Ships', confidence: 92.1, x: 34, y: 58, width: 5, height: 3, color: '#14b8a6' },
  ],
  Aircraft: [
    { className: 'Aircraft', confidence: 95.6, x: 78, y: 16, width: 7, height: 5, color: '#a855f7' },
    { className: 'Aircraft', confidence: 94.1, x: 86, y: 14, width: 6, height: 5, color: '#a855f7' },
  ],
  Roads: [
    { className: 'Roads', confidence: 96.0, x: 5, y: 44, width: 90, height: 5, color: '#10b981' },
    { className: 'Roads', confidence: 94.5, x: 48, y: 10, width: 5, height: 75, color: '#10b981' },
  ],
  'Solar Panels': [
    { className: 'Solar Panels', confidence: 92.7, x: 74, y: 24, width: 12, height: 10, color: '#eab308' },
  ],
};

export async function runObjectDetection(
  selectedClasses: DetectionClass[],
  query: string,
  onTraceUpdate: (step: ExecutionStep) => void
): Promise<DetectionResult> {
  const steps = [
    { step: 1, label: 'Query Received', delay: 400 },
    { step: 2, label: 'Input Validated', delay: 350 },
    { step: 3, label: 'Task: Object Detection', delay: 450 },
    { step: 4, label: 'Model Selected', delay: 400 },
    { step: 5, label: 'Detection Complete', delay: 1800 },
    { step: 6, label: 'Results Displayed', delay: 400 },
  ];

  const stepDetails = [
    {
      task: 'Natural Language Query Processing',
      tool: 'Prompt Router',
      model: 'SatQuery Intent Parser v1.2',
      parameters: [query ? `User prompt: "${query}"` : 'Default multi-class detection', `Active classes: ${selectedClasses.join(', ')}`],
    },
    {
      task: 'Satellite Image Validation & Normalization',
      tool: 'GDAL Image Pipeline',
      model: 'PreProcessor v2.0',
      parameters: ['Single image input', 'Band calibration', 'Resampled 1024x1024'],
    },
    {
      task: 'Multi-Class Spatial Object Localization',
      tool: 'Remote Sensing Object Detector',
      model: 'EarthVL-7B ObjectDetector',
      parameters: ['Multi-scale anchor box', 'Feature Pyramid Network', `Classes (${selectedClasses.length})`],
    },
    {
      task: 'Specialist Specialist Model Routing',
      tool: 'Model Registry',
      model: 'RemoteCLIP-YOLOv8-EO',
      parameters: ['Conf threshold: 0.25', 'NMS IoU: 0.45', 'GPU acceleration: TensorRT'],
    },
    {
      task: 'Bounding Box & Confidence Inference',
      tool: 'Inference Engine',
      model: 'RemoteCLIP-YOLOv8-EO',
      parameters: ['Non-Maximum Suppression', 'Coordinate normalization', 'Class confidence calculation'],
    },
    {
      task: 'Bounding Box & Summary Render',
      tool: 'Spatial Renderer',
      model: 'Visualization Engine',
      parameters: ['SVG Bounding Overlay', 'Class statistics aggregated', 'Trace finalized'],
    },
  ];

  // Mark pending
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

  // Generate boxes based on selected classes
  const boxes: BoundingBox[] = [];
  const breakdown: Record<string, number> = {};

  const activeClasses = selectedClasses.length > 0
    ? selectedClasses
    : (['Buildings', 'Vehicles', 'Water Bodies'] as DetectionClass[]);

  activeClasses.forEach(cls => {
    const templates = PRESET_BOXES[cls] || [];
    // Multiply templates to give realistic count breakdown e.g. Buildings: 42, Vehicles: 31, Water Bodies: 2
    let multiplier = 1;
    if (cls === 'Buildings') multiplier = 7;
    else if (cls === 'Vehicles') multiplier = 8;
    else if (cls === 'Water Bodies') multiplier = 2;

    const count = templates.length * multiplier;
    breakdown[cls] = count;

    templates.forEach((tpl, idx) => {
      boxes.push({
        ...tpl,
        id: `box-${cls}-${idx}`,
      });
    });
  });

  const total = Object.values(breakdown).reduce((acc, c) => acc + c, 0);
  const totalConfidence = boxes.reduce((acc, b) => acc + b.confidence, 0);
  const avgConfidence = boxes.length > 0 ? parseFloat((totalConfidence / boxes.length).toFixed(1)) : 91.2;

  return {
    id: `DET-${Math.floor(Math.random() * 90000 + 10000)}`,
    boxes,
    summary: {
      breakdown,
      total,
      avgConfidence,
    },
    executionTime: 3.84,
  };
}
