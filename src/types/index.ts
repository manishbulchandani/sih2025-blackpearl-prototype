// Core data types for eDNA pipeline

export interface Sample {
  id: string;
  location: string;
  coordinates: [number, number];
  depth: string;
  temperature: string;
  collection_date: string;
  platform: string;
  reads: number;
  file_size: string;
  environment_type: string;
  selected?: boolean;
}

export interface PipelineStep {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  duration?: number;
  estimatedTime?: number;
  outputs?: any;
}

export interface QualityMetrics {
  totalReads: number;
  qualityScores: number[];
  gcContent: number;
  adapterContent: number;
  duplicateRate: number;
}

export interface ASV {
  id: string;
  sequence: string;
  abundance: number;
  samples: string[];
  taxonomicAssignment?: TaxonomicAssignment;
  confidence?: number;
}

export interface TaxonomicAssignment {
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  confidence: number;
  method: 'reference' | 'embedding' | 'phylogenetic';
}

export interface NovelCluster {
  id: string;
  asvs: ASV[];
  evidence_score: number;
  geographic_distribution: string[];
  consensus_sequence: string;
  closest_known?: TaxonomicAssignment;
  embedding_distance?: number;
}

export interface BiodiversityMetrics {
  shannon_diversity: number;
  simpson_diversity: number;
  species_richness: number;
  evenness: number;
  novel_taxa_count: number;
}

export interface PipelineState {
  currentStep: number;
  steps: PipelineStep[];
  selectedSamples: Sample[];
  results?: {
    qualityMetrics: QualityMetrics;
    asvs: ASV[];
    novelClusters: NovelCluster[];
    biodiversityMetrics: BiodiversityMetrics;
  };
}

export interface DatabaseConnection {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  availableSamples: Sample[];
  lastUpdated?: Date;
}
