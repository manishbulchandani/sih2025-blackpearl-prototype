import type { Sample } from '../types';

// Dataset structure for directory-style browsing
export interface Dataset {
  id: string;
  name: string;
  type: 'project' | 'expedition' | 'sample';
  path: string;
  size?: string;
  fileCount?: number;
  samples?: Sample[];
  children?: Dataset[];
  metadata?: {
    location: string;
    depth: string;
    date: string;
    platform: string;
    description: string;
  };
}

export const mockDatasets: Dataset[] = [
  {
    id: 'mariana-expedition-2024',
    name: 'Mariana Trench Deep Survey 2024',
    type: 'project',
    path: '/datasets/mariana-expedition-2024',
    size: '2.8 TB',
    fileCount: 45,
    children: [
      {
        id: 'challenger-deep-samples',
        name: 'Challenger Deep - Hadal Zone',
        type: 'expedition',
        path: '/datasets/mariana-expedition-2024/challenger-deep',
        size: '1.2 TB',
        fileCount: 18,
        metadata: {
          location: 'Challenger Deep, Mariana Trench',
          depth: '10,000-11,000m',
          date: 'March 2024',
          platform: 'Illumina NovaSeq 6000',
          description: 'Deep hadal zone eDNA sampling from the deepest part of Earth\'s oceans'
        },
        children: [
          {
            id: 'sample-MD24-001',
            name: 'MD24-001_S1_L001_R1_001.fastq.gz',
            type: 'sample',
            path: '/datasets/mariana-expedition-2024/challenger-deep/MD24-001',
            size: '1.2 GB',
            metadata: {
              location: '11.373°N, 142.591°E',
              depth: '10,994m',
              date: '2024-03-15',
              platform: 'Illumina NovaSeq 6000',
              description: '2.45M paired-end reads, 16S rRNA V4 region'
            }
          },
          {
            id: 'sample-MD24-002',
            name: 'MD24-002_S2_L001_R1_001.fastq.gz',
            type: 'sample',
            path: '/datasets/mariana-expedition-2024/challenger-deep/MD24-002',
            size: '1.1 GB',
            metadata: {
              location: '11.371°N, 142.593°E',
              depth: '10,890m',
              date: '2024-03-15',
              platform: 'Illumina NovaSeq 6000',
              description: '2.28M paired-end reads, 16S rRNA V4 region'
            }
          }
        ]
      },
      {
        id: 'sirena-deep-samples',
        name: 'Sirena Deep - Abyssal Transition',
        type: 'expedition',
        path: '/datasets/mariana-expedition-2024/sirena-deep',
        size: '0.9 TB',
        fileCount: 12,
        metadata: {
          location: 'Sirena Deep, Mariana Trench',
          depth: '8,000-9,000m',
          date: 'March 2024',
          platform: 'Illumina MiSeq',
          description: 'Abyssal-hadal transition zone biodiversity survey'
        }
      }
    ]
  },
  {
    id: 'pacific-deep-survey-2024',
    name: 'Pacific Deep Water Survey 2024',
    type: 'project',
    path: '/datasets/pacific-deep-survey-2024',
    size: '4.1 TB',
    fileCount: 67,
    children: [
      {
        id: 'japan-trench',
        name: 'Japan Trench Samples',
        type: 'expedition',
        path: '/datasets/pacific-deep-survey-2024/japan-trench',
        size: '1.8 GB',
        fileCount: 24,
        metadata: {
          location: 'Japan Trench, Northwest Pacific',
          depth: '7,000-9,200m',
          date: 'April 2024',
          platform: 'Illumina NovaSeq 6000',
          description: 'Seismically active trench biodiversity analysis'
        }
      },
      {
        id: 'kermadec-trench',
        name: 'Kermadec Trench Samples',
        type: 'expedition',
        path: '/datasets/pacific-deep-survey-2024/kermadec-trench',
        size: '1.4 GB',
        fileCount: 19,
        metadata: {
          location: 'Kermadec Trench, Southwest Pacific',
          depth: '8,000-10,047m',
          date: 'January 2024',
          platform: 'Illumina HiSeq 4000',
          description: 'Southern hemisphere hadal zone comparative study'
        }
      }
    ]
  },
  {
    id: 'atlantic-ridge-survey',
    name: 'Atlantic Ridge Biodiversity Survey',
    type: 'project',
    path: '/datasets/atlantic-ridge-survey',
    size: '3.2 TB',
    fileCount: 52,
    children: [
      {
        id: 'puerto-rico-trench',
        name: 'Puerto Rico Trench',
        type: 'expedition',
        path: '/datasets/atlantic-ridge-survey/puerto-rico-trench',
        size: '1.1 TB',
        fileCount: 15,
        metadata: {
          location: 'Puerto Rico Trench, North Atlantic',
          depth: '6,000-8,648m',
          date: 'February 2024',
          platform: 'Illumina MiSeq',
          description: 'Atlantic deep-water endemic species discovery'
        }
      }
    ]
  }
];

export const mockPipelineSteps = [
  {
    id: 0,
    name: "Raw Data Processing",
    description: "Download and validate FASTQ files from selected datasets",
    status: 'pending' as const,
    progress: 0,
    estimatedTime: 5000,
    technicalDetails: {
      tool: "SRA Toolkit v3.0.7",
      process: "prefetch + fasterq-dump",
      threads: 16,
      memoryUsage: "8.2 GB"
    }
  },
  {
    id: 1,
    name: "Quality Control & Trimming",
    description: "Remove adapters, primers, and low-quality sequences using fastp",
    status: 'pending' as const,
    progress: 0,
    estimatedTime: 6000,
    technicalDetails: {
      tool: "fastp v0.23.4",
      process: "Adapter trimming + Quality filtering",
      qualityThreshold: "Q30",
      minLength: "50bp"
    }
  },
  {
    id: 2,
    name: "Read Merging",
    description: "Merge paired-end reads for full amplicon reconstruction",
    status: 'pending' as const,
    progress: 0,
    estimatedTime: 4000,
    technicalDetails: {
      tool: "vsearch v2.22.1",
      process: "Paired-end merging",
      overlapMin: "10bp",
      maxDiffs: "5"
    }
  },
  {
    id: 3,
    name: "DADA2 Denoising",
    description: "Infer Amplicon Sequence Variants (ASVs) and remove sequencing errors",
    status: 'pending' as const,
    progress: 0,
    estimatedTime: 12000,
    technicalDetails: {
      tool: "DADA2 v1.28.0",
      process: "Error model learning + ASV inference",
      errorModel: "Illumina-specific",
      chimeraDetection: "consensus"
    }
  },
  {
    id: 4,
    name: "Reference-based Classification",
    description: "Taxonomic assignment using MMseqs2 against marine databases",
    status: 'pending' as const,
    progress: 0,
    estimatedTime: 8000,
    technicalDetails: {
      tool: "MMseqs2 v15.6f452",
      database: "SILVA 138.1 + PR2 v4.14.0",
      sensitivity: "7.5",
      coverage: "0.8"
    }
  },
  {
    id: 5,
    name: "AI Embedding Analysis",
    description: "DNABERT-S sequence embeddings for novel taxa detection",
    status: 'pending' as const,
    progress: 0,
    estimatedTime: 15000,
    technicalDetails: {
      tool: "DNABERT-S v1.0",
      model: "6-mer pretrained transformer",
      gpuNodes: "4x NVIDIA A100",
      embeddingDim: "768"
    }
  },
  {
    id: 6,
    name: "Novelty Clustering",
    description: "HDBSCAN clustering of unassigned sequences in embedding space",
    status: 'pending' as const,
    progress: 0,
    estimatedTime: 6000,
    technicalDetails: {
      tool: "HDBSCAN + UMAP",
      minClusterSize: "5",
      minSamples: "3",
      distanceMetric: "cosine"
    }
  },
  {
    id: 7,
    name: "Phylogenetic Placement",
    description: "EPA-ng placement of novel ASVs on reference phylogeny",
    status: 'pending' as const,
    progress: 0,
    estimatedTime: 10000,
    technicalDetails: {
      tool: "EPA-ng v0.3.8",
      referenceTree: "SILVA 138.1 SSU",
      placementMethod: "Maximum likelihood",
      bootstraps: "1000"
    }
  },
  {
    id: 8,
    name: "Biodiversity Analysis",
    description: "Calculate diversity metrics and generate scientific reports",
    status: 'pending' as const,
    progress: 0,
    estimatedTime: 7000,
    technicalDetails: {
      tool: "QIIME2 v2023.7 + vegan R",
      metrics: "Shannon, Simpson, Chao1, PD",
      rarefaction: "10,000 reads/sample",
      betaDiversity: "UniFrac + Bray-Curtis"
    }
  }
];

// Legacy samples for compatibility
export const mockSamples: Sample[] = [
  {
    id: "SRR15847291",
    location: "Mariana Trench, Pacific Ocean",
    coordinates: [11.373, 142.591],
    depth: "10,994m",
    temperature: "1.2°C",
    collection_date: "2024-03-15",
    platform: "Illumina NovaSeq 6000",
    reads: 2450000,
    file_size: "1.2 GB",
    environment_type: "Hadal Zone"
  }
  // ... other samples can be kept for backward compatibility
];
