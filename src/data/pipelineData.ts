import type { PipelineStep } from '../types/pipeline';

export const pipelineStepsData: Omit<PipelineStep, 'icon'>[] = [
  {
    id: 'data-download',
    name: 'Data Download & Setup',
    description: 'Downloading raw sequencing data from SRA/ENA databases',
    duration: 12,
    status: 'pending',
    progress: 0,
    visualization: 'file-processing',
    details: [
      'Connecting to SRA database',
      'Downloading FASTQ files',
      'Validating file integrity',
      'Setting up workspace directories'
    ],
    logs: [
      'prefetch SRR12345678',
      'fastq-dump --split-files SRR12345678',
      'Downloading: SRR12345678_1.fastq.gz (2.1 GB)',
      'Downloading: SRR12345678_2.fastq.gz (2.1 GB)',
      'MD5 checksum validation: PASSED',
      'Files downloaded successfully to /data/raw/'
    ],
    files: {
      input: [],
      output: ['SRR12345678_1.fastq.gz', 'SRR12345678_2.fastq.gz'],
      processing: 'Downloading raw sequencing data...'
    }
  },
  {
    id: 'quality-control',
    name: 'Quality Control & Trimming',
    description: 'Analyzing sequence quality and trimming adapters with fastp',
    duration: 15,
    status: 'pending',
    progress: 0,
    visualization: 'quality-metrics',
    details: [
      'Running FastQC analysis',
      'Adapter sequence detection',
      'Quality trimming (Q>20)',
      'Generating QC reports'
    ],
    logs: [
      'fastp -i SRR12345678_1.fastq.gz -I SRR12345678_2.fastq.gz',
      'Detecting adapter sequences...',
      'Read1 before filtering: 1,234,567 reads',
      'Read2 before filtering: 1,234,567 reads',
      'Quality filtering: Q>20, length>100bp',
      'Reads after filtering: 1,189,432 (96.3%)',
      'HTML report generated: fastp_report.html'
    ],
    files: {
      input: ['SRR12345678_1.fastq.gz', 'SRR12345678_2.fastq.gz'],
      output: ['trimmed_R1.fastq.gz', 'trimmed_R2.fastq.gz', 'fastp_report.html'],
      processing: 'Quality filtering and adapter trimming...'
    }
  },
  {
    id: 'read-merging',
    name: 'Paired-end Read Merging',
    description: 'Merging overlapping paired-end reads using vsearch',
    duration: 10,
    status: 'pending',
    progress: 0,
    visualization: 'read-merging',
    details: [
      'Detecting read overlaps',
      'Merging paired reads',
      'Quality score adjustment',
      'Filtering merged reads'
    ],
    logs: [
      'vsearch --fastq_mergepairs trimmed_R1.fastq.gz',
      'Merging paired-end reads...',
      'Minimum overlap: 15bp',
      'Maximum mismatches: 2',
      'Merged reads: 987,654 (83.0%)',
      'Mean merged length: 253bp',
      'Output: merged_reads.fastq'
    ],
    files: {
      input: ['trimmed_R1.fastq.gz', 'trimmed_R2.fastq.gz'],
      output: ['merged_reads.fastq', 'unmerged_R1.fastq', 'unmerged_R2.fastq'],
      processing: 'Merging overlapping read pairs...'
    }
  },
  {
    id: 'asv-inference',
    name: 'ASV Inference (DADA2)',
    description: 'Denoising sequences and inferring Amplicon Sequence Variants',
    duration: 20,
    status: 'pending',
    progress: 0,
    visualization: 'asv-processing',
    details: [
      'Learning error model',
      'Sequence denoising',
      'ASV inference',
      'Chimera detection and removal'
    ],
    logs: [
      'dada2 --input merged_reads.fastq',
      'Learning error rates from 987,654 reads...',
      'Error model converged after 7 iterations',
      'Denoising sequences...',
      'Inferred 12,847 unique ASVs',
      'Detecting chimeric sequences...',
      'Removed 1,203 chimeras (9.4%)',
      'Final ASV count: 11,644',
      'Output: asv_table.csv, rep_seqs.fasta'
    ],
    files: {
      input: ['merged_reads.fastq'],
      output: ['asv_table.csv', 'rep_seqs.fasta', 'dada2_stats.txt'],
      processing: 'Inferring amplicon sequence variants...'
    }
  },
  {
    id: 'taxonomic-classification',
    name: 'Taxonomic Classification',
    description: 'Assigning taxonomy using MMseqs2 and SILVA database',
    duration: 18,
    status: 'pending',
    progress: 0,
    visualization: 'blast-results',
    details: [
      'Database preparation',
      'MMseqs2 search execution',
      'Confidence scoring',
      'Taxonomic assignment'
    ],
    logs: [
      'mmseqs createdb rep_seqs.fasta queryDB',
      'mmseqs search queryDB silva_db resultDB tmp',
      'Searching 11,644 sequences against SILVA database...',
      'Processing: [████████████████████████████████] 100%',
      'Assigned taxonomy: 8,932 sequences (76.7%)',
      'Unassigned sequences: 2,712 (23.3%)',
      'Mean alignment identity: 94.2%',
      'Output: taxonomy_assignments.txt'
    ],
    files: {
      input: ['rep_seqs.fasta', 'asv_table.csv'],
      output: ['taxonomy_assignments.txt', 'alignment_results.txt'],
      processing: 'Searching against reference databases...'
    }
  },
  {
    id: 'novelty-detection',
    name: 'Novel Species Detection',
    description: 'DNABERT embedding analysis for unassigned sequences',
    duration: 25,
    status: 'pending',
    progress: 0,
    visualization: 'embedding-space',
    details: [
      'Extracting unassigned sequences',
      'Generating DNABERT embeddings',
      'Clustering analysis',
      'Novel species candidate identification'
    ],
    logs: [
      'python dnabert_embeddings.py --input unassigned_seqs.fasta',
      'Loading DNABERT-S model...',
      'Model loaded: 6-mer embeddings, 768 dimensions',
      'Generating embeddings for 2,712 sequences...',
      'GPU acceleration enabled (CUDA)',
      'Embedding generation: [████████████████] 100%',
      'Running HDBSCAN clustering...',
      'Identified 47 potential novel species clusters',
      'Top candidates: 8 clusters with >50 reads each',
      'Output: embeddings.npy, clusters.csv'
    ],
    files: {
      input: ['rep_seqs.fasta', 'taxonomy_assignments.txt'],
      output: ['embeddings.npy', 'novel_clusters.csv', 'candidate_species.fasta'],
      processing: 'Analyzing sequence embeddings for novelty...'
    }
  },
  {
    id: 'diversity-analysis',
    name: 'Biodiversity Analysis',
    description: 'Computing diversity metrics and generating final reports',
    duration: 8,
    status: 'pending',
    progress: 0,
    visualization: 'diversity-metrics',
    details: [
      'Alpha diversity calculation',
      'Beta diversity analysis',
      'Species accumulation curves',
      'Report generation'
    ],
    logs: [
      'python diversity_analysis.py --asv_table asv_table.csv',
      'Calculating alpha diversity metrics...',
      'Shannon diversity: 4.23 ± 0.18',
      'Simpson diversity: 0.94 ± 0.02',
      'Observed species: 8,932',
      'Computing beta diversity (Bray-Curtis)...',
      'Generating species accumulation curves...',
      'Creating final biodiversity report...',
      'Report saved: biodiversity_report.html'
    ],
    files: {
      input: ['asv_table.csv', 'taxonomy_assignments.txt', 'novel_clusters.csv'],
      output: ['diversity_metrics.csv', 'biodiversity_report.html', 'ordination_plot.png'],
      processing: 'Computing biodiversity metrics and generating reports...'
    }
  }
];
