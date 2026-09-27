// Mock API service layer — prepared for FastAPI backend integration
// Replace these mock functions with real API calls when backend is ready

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface UploadedImage {
  id: string;
  filename: string;
  size: number;
  format: string;
  dimensions: { width: number; height: number };
  crs: string;
  acquisitionDate: string;
  sensor: string;
  resolution: string;
  modality: string;
  validation: {
    formatSupported: boolean;
    spatialMetadata: boolean;
    readable: boolean;
    warnings: string[];
  };
}

export interface AnalysisRequest {
  imageIds: string[];
  query: string;
  mode: 'single' | 'optical-sar' | 'bi-temporal' | 'advanced';
}

export interface AnalysisResult {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  query: string;
  answer?: string;
  confidence?: number;
  task?: string;
  models?: string[];
  executionTime?: number;
  executionTrace?: ExecutionStep[];
}

export interface ExecutionStep {
  step: number;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: string;
  details?: {
    task: string;
    tool: string;
    model: string;
    parameters: string[];
  };
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

export async function uploadImage(file: File): Promise<UploadedImage> {
  await delay(1200);

  const formats: Record<string, string> = {
    'image/tiff': 'GeoTIFF',
    'image/png': 'PNG',
    'image/jpeg': 'JPEG',
  };

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const format = ext === 'tif' || ext === 'tiff' ? 'GeoTIFF' : formats[file.type] || ext.toUpperCase();
  const isSupported = ['tif', 'tiff', 'png', 'jpg', 'jpeg'].includes(ext);

  return {
    id: `img-${Date.now()}`,
    filename: file.name,
    size: file.size,
    format,
    dimensions: { width: 4096, height: 4096 },
    crs: 'EPSG:4326',
    acquisitionDate: '2026-05-18',
    sensor: 'Cartosat-2S',
    resolution: '1.0 m',
    modality: 'Optical',
    validation: {
      formatSupported: isSupported,
      spatialMetadata: isSupported,
      readable: isSupported,
      warnings: isSupported ? [] : ['Unsupported format', 'Missing metadata'],
    },
  };
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

export async function runRealAnalysis(
  file: File,
  query: string,
  onTraceUpdate: (step: ExecutionStep) => void
): Promise<any> {
  const steps = [
    { step: 1, label: 'Uploading Image', status: 'pending' as const },
    { step: 2, label: 'Backend Processing', status: 'pending' as const },
    { step: 3, label: 'Grounding DINO Inference', status: 'pending' as const },
  ];

  steps.forEach(s => onTraceUpdate(s));

  try {
    onTraceUpdate({ ...steps[0], status: 'running' });
    const formData = new FormData();
    formData.append('image', file);
    formData.append('query', query);

    onTraceUpdate({ ...steps[0], status: 'completed' });
    onTraceUpdate({ ...steps[1], status: 'running' });

    const response = await fetch(`${API_BASE_URL.replace('/v1', '')}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    onTraceUpdate({ ...steps[1], status: 'completed' });
    onTraceUpdate({ ...steps[2], status: 'running' });

    const result = await response.json();
    
    onTraceUpdate({ ...steps[2], status: 'completed' });

    // Format result to match DetectionResult interface
    const breakdown: Record<string, number> = {};
    let totalConfidence = 0;

    result.detections.forEach((det: any) => {
      breakdown[det.className] = (breakdown[det.className] || 0) + 1;
      totalConfidence += det.confidence;
    });

    const avgConfidence = result.detections.length > 0 
      ? parseFloat((totalConfidence / result.detections.length).toFixed(1)) 
      : 0;

    return {
      id: `DET-${Math.floor(Math.random() * 90000 + 10000)}`,
      boxes: result.detections,
      summary: {
        breakdown,
        total: result.detections.length,
        avgConfidence,
      },
      executionTime: 0,
      model: result.model
    };
  } catch (error) {
    onTraceUpdate({ ...steps[1], status: 'failed' });
    throw error;
  }
}

export async function runAnalysis(
  request: AnalysisRequest,
  onTraceUpdate: (step: ExecutionStep) => void
): Promise<AnalysisResult> {
  const steps = [
    { step: 1, label: 'Query Interpretation', delay: 600 },
    { step: 2, label: 'Input Validation', delay: 400 },
    { step: 3, label: 'Task Classification', delay: 500 },
    { step: 4, label: 'Model Selection', delay: 400 },
    { step: 5, label: 'Image Analysis', delay: 2800 },
    { step: 6, label: 'Evidence Extraction', delay: 1200 },
    { step: 7, label: 'Confidence Validation', delay: 600 },
    { step: 8, label: 'Response Generation', delay: 900 },
  ];

  const stepDetails = [
    { task: 'Natural language understanding', tool: 'LLM Query Parser', model: 'Gemini-Flash Query Router', parameters: ['Semantic parsing', 'Intent classification', 'Entity extraction'] },
    { task: 'Image compatibility check', tool: 'GDAL + Metadata Extractor', model: 'Validation Engine v1.0', parameters: ['Format check', 'CRS validation', 'Band consistency'] },
    { task: 'Task type classification', tool: 'Task Router', model: 'Task Classifier v1.0', parameters: ['Temporal analysis required', 'Multi-image input', 'Change quantification'] },
    { task: 'Specialist model routing', tool: 'Model Registry', model: 'Agent Controller', parameters: ['Change-VQA selected', 'ChangeDet auxiliary', 'Confidence threshold: 0.85'] },
    { task: 'Bi-temporal change analysis', tool: 'Change Detection Engine', model: 'ChangeDet v2.1', parameters: ['Temporal comparison', 'Spatial alignment', 'Change threshold: 0.15'] },
    { task: 'Spatial evidence localization', tool: 'Evidence Engine', model: 'Change-VQA v2.1', parameters: ['Region attribution', 'Confidence mapping', 'Spatial statistics'] },
    { task: 'Multi-factor confidence scoring', tool: 'Confidence Engine', model: 'Calibration v1.0', parameters: ['Input quality: 98%', 'Model confidence: 93%', 'Evidence agreement: 91%'] },
    { task: 'Natural language answer generation', tool: 'Answer Generator', model: 'Change-VQA v2.1', parameters: ['Evidence grounded', 'Confidence calibrated', 'Spatial metadata included'] },
  ];

  // Mark all as pending
  steps.forEach(s => {
    onTraceUpdate({ step: s.step, label: s.label, status: 'pending' });
  });

  for (let i = 0; i < steps.length; i++) {
    onTraceUpdate({ step: steps[i].step, label: steps[i].label, status: 'running', details: stepDetails[i] });
    await delay(steps[i].delay);
    onTraceUpdate({
      step: steps[i].step,
      label: steps[i].label,
      status: 'completed',
      duration: `${(steps[i].delay / 1000).toFixed(1)}s`,
      details: stepDetails[i],
    });
  }

  return {
    id: `SAT-2026-${Math.floor(Math.random() * 90000 + 10000)}`,
    status: 'completed',
    query: request.query,
    answer: 'Significant expansion of built-up area was detected in the northeastern region of the analysis area. Several previously vegetated regions spanning approximately 12.4 km² have been converted to built-up land, primarily concentrated along the northern urban boundary. SAR backscatter analysis confirms the structural nature of new constructions. Vegetation density has decreased by approximately 5.7%, while a minor increase of 1.4% in water surface coverage is observed.',
    confidence: 94.2,
    task: 'Change Understanding',
    models: ['ChangeDet v2.1', 'Change-VQA v2.1'],
    executionTime: 8.42,
  };
}

// ─── Models ───────────────────────────────────────────────────────────────────

export async function getModels() {
  await delay(300);
  const { mockModels } = await import('../data/mockData');
  return mockModels;
}

// ─── Analysis History ─────────────────────────────────────────────────────────

export async function getAnalysisHistory() {
  await delay(400);
  const { mockAnalysisHistory } = await import('../data/mockData');
  return mockAnalysisHistory;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function getReports() {
  await delay(350);
  const { mockReports } = await import('../data/mockData');
  return mockReports;
}

export async function downloadReport(reportId: string, format: 'pdf' | 'json') {
  await delay(800);
  return { success: true, message: `Report ${reportId} download initiated (${format.toUpperCase()})` };
}

// ─── Datasets ─────────────────────────────────────────────────────────────────

export async function getDatasets() {
  await delay(300);
  const { mockDatasets } = await import('../data/mockData');
  return mockDatasets;
}
