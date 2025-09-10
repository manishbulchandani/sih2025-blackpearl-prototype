export interface PipelineStep {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds for realistic timing
  icon: React.ReactNode;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  details: string[];
  visualization: 'file-processing' | 'quality-metrics' | 'read-merging' | 'asv-processing' | 'blast-results' | 'embedding-space' | 'diversity-metrics' | 'line' | 'scatter' | 'bar' | 'area' | 'terminal';
  logs: string[];
  currentMessage?: string;
  files?: {
    input: string[];
    output: string[];
    processing: string;
  };
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}
