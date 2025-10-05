import type { Sample } from '../types';

// Dataset structure tailored for single-read presentation
export interface Dataset {
  id: string;
  name: string;
  type: 'project' | 'expedition' | 'sample';
  summary?: string;
  path?: string;
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
  stats?: {
    runCount: number;
    instrument: string;
    spots: number;
    bases: string;
    downloadSize: string;
  };
  design?: string;
  submittedBy?: string;
  study?: string;
  projectAccessions?: string[];
  sampleAccessions?: string[];
  organism?: string;
  library?: {
    name: string;
    instrument: string;
    strategy: string;
    source: string;
    selection: string;
    layout: string;
  };
}

export const mockDatasets: Dataset[] = [
  {
    id: 'SRX25419065',
    name: 'SRX25419065: amplicon seq. of 18S rRNA of surface sediment',
    type: 'sample',
    summary: '1 Illumina MiSeq run • 206,859 spots • 124.5M bases • 63.4 MB download',
    metadata: {
      location: 'Kattegat (surface sediment)',
      depth: 'Surface sediment',
      date: 'Not specified',
      platform: 'Illumina MiSeq',
      description: 'Amplicon sequencing read from chronic trawling impact study'
    },
    stats: {
      runCount: 1,
      instrument: 'Illumina MiSeq',
      spots: 206_859,
      bases: '124.5M',
      downloadSize: '63.4 MB'
    },
    design: '2×300 bp paired-end',
    submittedBy: 'Stockholm University',
    study: 'Chronic trawling impact - Kattegat - benthic surface sediment - meiofauna Raw sequence reads',
    projectAccessions: ['PRJNA1138962', 'SRP521534'],
    sampleAccessions: ['SAMN42419523', 'SRS22079240'],
    organism: 'marine metagenome',
    library: {
      name: 'P30454_110_S10',
      instrument: 'Illumina MiSeq',
      strategy: 'AMPLICON',
      source: 'METAGENOMIC',
      selection: 'PCR',
      layout: 'PAIRED'
    }
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
